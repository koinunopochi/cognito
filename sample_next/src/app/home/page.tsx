// src/app/home/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { getSession, signOut } from '../auth/authService';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [session, setSession] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const session:any = await getSession();
      setSession(session);
    };

    fetchSession();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  if (!session) {
    return (
      <div className="homePage">
        <h1>Access Denied</h1>
        <p>Please log in to access this page.</p>
      </div>
    );
  }

  return (
    <div className="homePage">
      <h1>Home</h1>
      <h4>Welcome to the home page, {session.email}</h4>
      <p>本来は、ユーザ―用の画面に切り替える。</p>
      <p>ログインユーザーでないとアクセスできないようにする。</p>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
}
