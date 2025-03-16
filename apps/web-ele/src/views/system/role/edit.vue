<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';

import { ElTabs, ElTabPane, ElCard, ElRow, ElCol } from 'element-plus';
import { useVbenForm } from '#/adapter/form';

defineOptions({
  name: 'FormDrawer',
});

const [BaseForm, BaseFormApi] = useVbenForm({
  schema: useSchema(),
  showDefaultActions: false,
});

import { useSchema } from './data';

const [Drawer, drawerApi] = useVbenDrawer({
  onCancel() {
    drawerApi.close();
  },
  onConfirm: async () => {
    await BaseFormApi.submitForm();
    drawerApi.close();
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const { values } = drawerApi.getData<Record<string, any>>();
      if (values) {
        BaseFormApi.setValues(values);
      }
    }
  },
  title: '详情',
});
</script>
<template>
  <Drawer>
    <BaseForm />
  </Drawer>
</template>
<style lang="scss" scoped>
.grid-content {
  width: 116px;
  height: 116px;
}

.player-card {
  font-size: 14px;
  line-height: 25px;
}

::v-deep .vxe-grid {
  padding: 0;
}
</style>
