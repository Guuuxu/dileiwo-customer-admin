<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';

import { ElTabs, ElTabPane, ElCard, ElRow, ElCol } from 'element-plus';
import { useVbenForm } from '#/adapter/form';

defineOptions({
  name: 'FormDrawer',
});

import { useSchema, useSchemaScan } from './data';
const [BaseForm, BaseFormApi] = useVbenForm({
  schema: useSchema(),
  showDefaultActions: false,
});

const type = ref(''); //
const [ScanForm, ScanFormApi] = useVbenForm({
  schema: useSchemaScan(),
  layout: 'vertical',
  showDefaultActions: false,
});
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
        type.value = values.type;
      console.log(values);
      if (values) {
        BaseFormApi.setValues({
          ...values,
          itemIcon: [
            {
              name: 'logo-custom.png',
              url: 'https://egclub.nyc3.digitaloceanspaces.com/production/images/services/gift.png',
            },
          ],
        });
      }
    }
  },
  title: '详情',
});
</script>
<template>
  <Drawer>
    <ScanForm v-if="type === '出库'" />
    <BaseForm v-else />
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
