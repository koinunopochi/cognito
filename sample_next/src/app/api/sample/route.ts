// app/api/sample/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import config from '@/app/auth/config.json';

const userPoolId = config.userPoolId;
const clientId = config.clientId;
// const clientSecret = config.clientSecret;

// if (!userPoolId || !clientId || !clientSecret) {
if (!userPoolId || !clientId) {
  throw new Error(
    'COGNITO_USER_POOL_ID, COGNITO_CLIENT_ID, and COGNITO_CLIENT_SECRET must be set'
  );
}

const verifier = CognitoJwtVerifier.create({
  userPoolId: userPoolId as string,
  tokenUse: 'access',
  clientId: clientId as string,
  // clientSecret: clientSecret as string,
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
    const payload = await verifier.verify(accessToken);

    console.log('payload: ', payload);
    const email = payload.username;

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
