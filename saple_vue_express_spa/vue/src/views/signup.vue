<!-- signup.vue -->

<template>
  <div class="signup">
    <h3>サインアップ</h3>
    <form class="form" @submit.prevent="signup">
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
      <button class="signup-button">サインアップ</button>
    </form>
  </div>

</template>

<script setup lang="ts">
import { ref } from 'vue';
import { signUp } from '../auth/authService';
import { useRouter } from 'vue-router';

const router = useRouter();
const username = ref('');
const password = ref('');

const signup = async () => {
  try {
    const session = await signUp(username.value, password.value);
    console.log('Sign up successful', session);
    router.push('/confirm?email=' + username.value);
  } catch (error) {
    alert(`Sign up failed: ${error}`);
  }
};
</script>