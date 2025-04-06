import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'carbon:shopping-catalog',
      order: 3000,
      title: '包装出库',
    },
    name: 'delivery',
    path: '/delivery',
    children: [
      {
        name: 'delivery.customer',
        path: '/delivery/customer',
        component: () => import('#/views/delivery/customer/index.vue'),
        meta: {
          icon: 'lucide:shopping-bag',
          title: '客户管理',
        },
      },
      {
        name: 'delivery.history',
        path: '/delivery/history',
        component: () => import('#/views/delivery/history/index.vue'),
        meta: {
          icon: 'lucide:shopping-bag',
          title: '出库管理',
        },
      },
    ],
  },
];

export default routes;
