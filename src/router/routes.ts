import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        redirect: { path: '2025' },
      },
      {
        path: '2024',
        component: () => import('pages/NFour.vue'),
      },
      {
        path: '2025',
        component: () => import('pages/NFive.vue'),
      },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    redirect: { path: '' },
  },
];

export default routes;
