<!-- confirm.vue -->

<template>
  <div class="confirm">
    <!-- メールアドレスと認証コードを突合する -->
    <h3>メールアドレスを確認してください</h3>
    <form class="form" @submit.prevent="confirm">
      <div>
        <div class="user">メールアドレス:</div>
        <input
          type="text"
          placeholder="email"
          v-model="email"
          required
          readonly
        />
      </div>
      <div>
        <div class="code">認証コード:</div>
        <input type="text" placeholder="code" v-model="code" required />
      </div>
      <button class="confirm-button">確認</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { confirmSignUp } from '../auth/authService';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const code = ref('');

const confirm = async () => {
  try {
    await confirmSignUp(email.value, code.value);
    router.push('/signin');
  } catch (error) {
    alert(`確認に失敗しました: ${error}`);
  }
};

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  email.value = urlParams.get('email') || '';
});
</script>