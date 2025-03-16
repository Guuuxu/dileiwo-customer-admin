import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'carbon:shopping-catalog',
      order: 2000,
      title: '初始认证',
    },
    name: 'initAuth',
    path: '/initAuth',

    children: [
      {
        name: 'initAuth.new',
        path: '/initAuth/new',
        component: () => import('#/views/auth/new/index.vue'),
        meta: {
          icon: 'lucide:shopping-bag',
          title: '初始认证',
        },
      },

      {
        name: 'initAuth.declare',
        path: '/initAuth/declare',
        component: () => import('#/views/auth/declare/index.vue'),
        meta: {
          icon: 'lucide:file-code',
          title: '疑品申报',
        },
      },
      
    ],
  },
];

export default routes;
