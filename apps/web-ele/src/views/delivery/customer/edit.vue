<script lang="ts" setup>
import { ref, onMounted, h } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';

import { ElMessage, ElButton } from 'element-plus';
import { useVbenForm } from '#/adapter/form';
import {
  updateCustomer,
  updateDelivery,
  scanOutboundBarcode,
  sendPhoneMessage,
} from '#/api';

defineOptions({
  name: 'FormDrawer',
});

import { useSchema } from './data';
const [BaseForm, BaseFormApi] = useVbenForm({
  schema: useSchema(),
  showDefaultActions: false,
});

const type = ref('');
const row = ref({});
const boundData = ref({});
// 定义自定义事件
const emits = defineEmits(['onUpdated']);
const [ScanForm, ScanFormApi] = useVbenForm({
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
        onKeyup(e: KeyboardEvent) {
          if (e.key === 'Enter') {
            // 如果按下回车键，调用 handleEnterInput 函数
            handleEnterInput();
          }
        },
      },
      fieldName: 'code',
      label: '请扫描包装编码',
      // 设置标签的宽度为 150 像素
      labelWidth: 150,
      suffix: () =>
        h('span', { class: 'text-[12px]' }, '点击发送移转⼿机APP端扫码'),
      renderComponentContent: () => ({
        append: () =>
          h(
            ElButton,
            {
              class: 'text-[12px]',
              onClick: () => {
                console.log('Append 被点击');
                // 可以根据需要调用相应的处理函数
                sendPhoneMessage(boundData.value?.id).then((res) => {
                  console.log(res);
                  ElMessage.success('操作成功');
                });
              },
            },
            '发送',
          ),
      }),
    },
  ],
  layout: 'vertical',
  showDefaultActions: false,
});
const [Drawer, drawerApi] = useVbenDrawer({
  onCancel() {
    drawerApi.close();
  },
  onConfirm: async () => {
    if (type.value === '出库') {
      drawerApi.close();
    } else {
      const { valid } = await BaseFormApi.validate();
      if (!valid) {
        return;
      }
      const formValues = await BaseFormApi.getValues();
      const params = {
        id: row.value?.id,
        ...formValues,
      };
      const res = await updateCustomer(params);
      drawerApi.close();
      ElMessage.success('操作成功');
      // 触发自定义事件通知父组件
      emits('onUpdated');
    }
  },
  async onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const { values } = drawerApi.getData<Record<string, any>>();
      row.value = values;
      type.value = values.type;
      console.log(values);
      if (type.value === '出库') {
        const res = await updateDelivery({ client_custom_id: row.value.id });
        boundData.value = res;
        ElMessage.success('操作成功');
      }
      if (values) {
        BaseFormApi.setValues({
          ...values,
        });
      }
    }
  },
  title: '详情',
});
// 输入确认
const handleEnterInput = async () => {
  const formValues = await ScanFormApi.getValues();
  console.log('handleEnterInput', formValues);
  const res = await scanOutboundBarcode(boundData.value.id, formValues.code);
  ElMessage.success('操作完成！');
  // 触发自定义事件通知父组件
  emits('onUpdated');
};
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
