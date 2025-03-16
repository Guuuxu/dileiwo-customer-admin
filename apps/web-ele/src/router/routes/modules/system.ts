import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'ion:settings-outline',
      order: 7000,
      title: $t('page.system.title'),
    },
    name: 'System',
    path: '/system',
    children: [
      {
        name: 'system.admin',
        path: '/system/admin',
        component: () => import('#/views/system/admin/index.vue'),
        meta: {
          icon: 'lucide:user-round',
          title: $t('page.system.administrator'),
        },
      },
      {
        name: 'system.user',
        path: '/system/user',
        component: () => import('#/views/system/user/index.vue'),
        meta: {
          icon: 'lucide:user-round',
          title: $t('page.system.user'),
        },
      },
      {
        name: 'system.role',
        path: '/system/role',
        component: () => import('#/views/system/role/index.vue'),
        meta: {
          icon: 'mdi:user-tie',
          title: $t('page.system.role'),
        },
      },
    ],
  },
];

export default routes;
