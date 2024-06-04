const express = require('express');
const cors = require('cors');
const { getUserData } = require('./authService');

const mockData = {
  'user1@example.com': {
    name: 'User 1',
    age: 25,
    city: 'Tokyo',
  },
  'user2@example.com': {
    name: 'User 2',
    age: 30,
    city: 'Osaka',
  },
  'user3@example.com': {
    name: 'User 3',
    age: 35,
    city: 'Nagoya',
  },
};

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/sample', async (req, res) => {
  if (!req.headers.authorization) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  const accessToken = req.headers.authorization.split(' ')[1];

  try {
    const userData = await getUserData(accessToken);
    // emailを取得
    let userAttributes = userData.UserAttributes;
    let emailAttribute = userAttributes.find(
      (attribute) => attribute.Name === 'email'
    );

    let email = null;
    if (emailAttribute) {
      email = emailAttribute.Value;
      console.log(email);
    } else {
      console.log('Email attribute not found');
    }
    if (!mockData[email]) {
      res.status(404).json({ message: 'Not Found' });
      return;
    }

    res.json(mockData[email]);
  } catch (err) {
    console.log('Error:', err);
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
