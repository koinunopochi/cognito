<!-- signin.vue -->
<template>
  <div class="signin">
    <h3>サインイン</h3>
    <form class="form" @submit.prevent="signin">
      <div>
        <div class="user">ユーザーネーム:</div>
        <input type="text" placeholder="username" v-model="username" required />
      </div>
      <div>
        <div class="pass">パスワード:</div>
        <input
          type="password"
          placeholder="password"
          v-model="password"
          required
        />
      </div>
      <button class="signin-button">サインイン</button>
    </form>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { signIn } from '../auth/authService';
import { useRouter } from 'vue-router';

const router = useRouter();
const username = ref('');
const password = ref('');

const signin = async () => {
  try {
    const session = await signIn(username.value, password.value);
    console.log('Sign in successful', session);
    if (session && typeof session.AccessToken !== 'undefined') {
      sessionStorage.setItem('accessToken', session.AccessToken);
      if (sessionStorage.getItem('accessToken')) {
        router.push('/home');
      } else {
        console.error('Session token was not set properly.');
      }
    } else {
      console.error('SignIn session or AccessToken is undefined.');
    }
  } catch (error) {
    alert(`Sign in failed: ${error}`);
  }
};
</script>