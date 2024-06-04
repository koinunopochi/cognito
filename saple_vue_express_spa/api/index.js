const express = require('express');
const cors = require('cors');
const config = require('../vue/src/auth/config.json');
const { CognitoJwtVerifier } = require('aws-jwt-verify');

const userPoolId = config.userPoolId;
const clientId = config.clientId;

console.log('User Pool ID:', userPoolId);
console.log('Client ID:', clientId);

if (!userPoolId || !clientId) {
  throw new Error(
    'COGNITO_USER_POOL_ID, COGNITO_CLIENT_ID, and COGNITO_CLIENT_SECRET must be set'
  );
}

const verifier = CognitoJwtVerifier.create({
  userPoolId: userPoolId,
  tokenUse: 'access',
  clientId: clientId,
});

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

app.get('/api/sample', async(req, res) => {
  const query = req.query;
  console.log('Query:', query);
  console.log('Request Authorization:', req.headers.authorization);
  if (!req.headers.authorization) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  const token = req.headers.authorization.split(' ')[1];

  try{
    const payload =await verifier.verify(token);
    console.log('Payload:', payload);

    const email = payload.username;

    console.log('Request User:', email);
    if (!mockData[email]) {
      res.status(404).json({ message: 'Not Found' });
      return;
    }

    res.json(mockData[email]);
  }catch(err){
    console.log('Error:', err);
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
