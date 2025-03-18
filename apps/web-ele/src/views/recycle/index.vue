<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { Page, useVbenDrawer, VbenButton } from '@vben/common-ui';

import { ElButton, ElCard, ElMessage, ElTag } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { $t } from '#/locales';


const router = useRouter();
const [Form, formApi] = useVbenForm({
  commonConfig: {
    // 所有表单项
    componentProps: {
      class: 'w-full',
    },
  },
  layout: 'horizontal',
  resetButtonOptions: { show: false },
  submitButtonOptions: { show: false },
  // 大屏一行显示3个，中屏一行显示2个，小屏一行显示1个
  wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  handleSubmit: (values) => {
    
  },
  schema: [
    {
      component: 'Input',
      fieldName: 'code',
      label: '回收包装编码',
      componentProps: {
        onKeyup(e: KeyboardEvent) {
          if (e.key === 'Enter') {
            // 如果按下回车键，调用 handleEnterInput 函数
            handleEnterInput((e.target as HTMLInputElement).value);
          }
        
        },
      },
    },
  ],
});

const codeList = ref<string[]>([]);
// 输入确认
const handleEnterInput = (val: string) => {
  console.log('handleEnterInput', val);
  codeList.value.push(val)
  setTimeout(() => {
    formApi.resetForm();
  },1500)
};

const handleFinishScan = () => {
  ElMessage.success('回收复查完成');
}


</script>
<template>
  <Page auto-content-height :title="$t(router.currentRoute.value.meta.title)">
    <ElCard>
      <Form></Form>
      <template #footer>
        <div class="text-right"><VbenButton @click="handleFinishScan()">结束扫描</VbenButton></div>
      </template>
    </ElCard>
  </Page>
</template>
