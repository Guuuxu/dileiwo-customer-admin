import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'carbon:shopping-catalog',
      order: 5000,
      title: '库存管理',
    },
    name: 'inventory',
    path: '/inventory',

    component: () => import('#/views/inventory/index.vue'),
  },
];

export default routes;
