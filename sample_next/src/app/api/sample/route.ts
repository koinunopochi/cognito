// app/api/sample/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getUserData } from '@/app/auth/authService';

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

export async function GET(request: NextRequest) {
  const accessToken = request.headers
    .get('Authorization')
    ?.replace('Bearer ', '');

  // console.log('accessToken: ', accessToken);

  if (!accessToken) {
    return NextResponse.json(
      { error: 'Access token is required' },
      { status: 401 }
    );
  }

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
    if (email) {
      const data = mockData[email];

      if (data) {
        return NextResponse.json(data);
      } else {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
    } else {
      return NextResponse.json(
        { error: 'Invalid access token' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Error verifying access token: ', error);
    return NextResponse.json(
      { error: 'Invalid access token' },
      { status: 401 }
    );
  }
}
