<template>
  <div class="home">
    <h1>Welcome to the Home Page</h1>
    <button @click="logout">Logout</button>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { signOut,getSession } from '../auth/authService';
import { useRouter } from 'vue-router';

const router = useRouter();

const logout = async () => {
  try {
    await signOut();
    router.push('/signin');
  } catch (error) {
    console.error('Error signing out: ', error);
  }
};

const sampleFetch = async () => {
  try {
    const session: any = await getSession();
    const response = await fetch('http://localhost:3000/api/sample?email='+session.email, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`,
      },
    });
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error fetching data: ', error);
  }
};

onMounted(() => {
  sampleFetch();
});
</script>
