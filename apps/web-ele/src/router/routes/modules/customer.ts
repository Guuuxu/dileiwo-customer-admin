import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'carbon:shopping-catalog',
      order: 6000,
      title: '客户管理',
    },
    name: 'customer',
    path: '/customer',

    component: () => import('#/views/customer/index.vue'),
  },
];

export default routes;
