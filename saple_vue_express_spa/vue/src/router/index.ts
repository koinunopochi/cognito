import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import signin from '../views/signin.vue';
import signup from '../views/signup.vue';
import { getSession } from '../auth/authService';

const routes = [
  {
    path: '/home',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true },
  },
  { path: '/signin', component: signin },
  { path: '/signup', component: signup },
  { path: '/confirm', component: () => import('../views/confirm.vue') },

  // 他の認証が必要なルートを追加
  // {
  //   path: '/profile',
  //   name: 'profile',
  //   component: () => import('../views/Profile.vue'),
  //   meta: { requiresAuth: true },
  // },
  // {
  //   path: '/settings',
  //   name: 'settings',
  //   component: () => import('../views/Settings.vue'),
  //   meta: { requiresAuth: true },
  // },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const session = await getSession();

  if (requiresAuth && !session) {
    next('/login');
  } else {
    next();
  }
});

export default router;
