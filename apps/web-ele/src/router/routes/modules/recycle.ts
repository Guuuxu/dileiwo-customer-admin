import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'carbon:shopping-catalog',
      order: 3000,
      title: '回收复查',
    },
    name: 'recycle',
    path: '/recycle',

    component: () => import('#/views/recycle/index.vue'),
  },
];

export default routes;
