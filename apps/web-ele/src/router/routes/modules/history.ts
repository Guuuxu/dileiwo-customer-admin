import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'carbon:shopping-catalog',
      order: 5000,
      title: '使用记录',
    },
    name: 'history',
    path: '/history',

    component: () => import('#/views/history/index.vue'),
  },
];

export default routes;
