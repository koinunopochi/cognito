// app/api/sample/route.ts
import { NextRequest, NextResponse } from 'next/server';

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
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (email) {
    const data = mockData[email];

    if (data) {
      return NextResponse.json(data);
    } else {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
  } else {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }
}
