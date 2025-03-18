import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'carbon:shopping-catalog',
      order: 4000,
      title: '损坏管理',
    },
    name: 'damage',
    path: '/damage',

    children: [
      {
        name: 'damage.dispose',
        path: '/damage/dispose',
        component: () => import('#/views/damage/maintain/index.vue'),
        meta: {
          icon: 'lucide:file-code',
          title: '待处理',
        },
      },
      {
        name: 'damage.submit',
        path: '/damage/submit',
        component: () => import('#/views/damage/submit/index.vue'),
        meta: {
          icon: 'lucide:shopping-bag',
          title: '已提交',
        },
      },

      
    ],
  },
];

export default routes;
