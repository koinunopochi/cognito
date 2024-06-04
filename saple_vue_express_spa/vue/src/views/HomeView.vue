<template>
  <div class="home">
    <h1>Welcome to the Home Page</h1>
    <button @click="logout">Logout</button>
  </div>
</template>

<script setup lang="ts">
import { signOut } from '../auth/authService';
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
</script>