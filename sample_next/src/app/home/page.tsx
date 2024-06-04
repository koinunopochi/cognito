// src/app/home/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { getSession, signOut } from '../auth/authService';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [session, setSession] = useState(null);
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const session: any = await getSession();
      setSession(session);

      if (session && session.accessToken) {
        console.log('session: ', session);
        fetchUserData(session.email,session.accessToken);
      }
    };

    fetchSession();
  }, []);

  const fetchUserData = async (email:string,accessToken: string) => {
    try {
      const response = await fetch(
        `/api/sample?email=${encodeURIComponent(email)}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      } else {
        console.error('Error fetching user data: ', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching user data: ', error);
    }
  };

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
      {userData ? (
        <div>
          <p>Name: {userData.name}</p>
          <p>Age: {userData.age}</p>
          <p>City: {userData.city}</p>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
}
