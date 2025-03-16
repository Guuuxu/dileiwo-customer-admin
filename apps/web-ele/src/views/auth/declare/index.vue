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
  wrapperClass: 'grid-cols-2',
  
  handleSubmit: (values) => {
    ElMessage.success(`表单数据：${JSON.stringify(values)}`);
  },
  schema: [
    {
      component: 'Input',
      fieldName: 'code',
      label: '回收包装编码',
      formItemClass: 'col-span-1',
      labelWidth: 150,
      componentProps: {},
    },
    {
      component: 'Input',
      fieldName: 'reason',
      formItemClass: 'col-span-2',
      label: '瑕疵原因',
      labelWidth: 150,
      componentProps: {
        type: 'textarea',
        rows: 4
      },
    },
    {
      component: 'Input',
      fieldName: 'code',
      label: '包装整体含编码图',
      labelWidth: 150,
      formItemClass: 'col-span-2',
      componentProps: {},
    },
    {
      component: 'Input',
      fieldName: 'code',
      label: '包装瑕疵细部图',
      labelWidth: 150,
      formItemClass: 'col-span-2',
      componentProps: {},
    },
  ],
});

function handleSearch() {
  formApi.getValues();
}
function handleReset() {
  formApi.resetForm();
}


import { ElMessageBox } from 'element-plus';
const handleDeleteRow = (row: RowType) => {
  ElMessageBox.confirm(
    '此操作将永久删除该条记录, 是否继续?',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    // Perform delete operation here
    // const index = dataList.value.findIndex((item: { id: number; }) => item.id === row.id);
    // if (index !== -1) {
    //   dataList.value.splice(index, 1);
    //   ElMessage.success('删除成功');
    // }
    ElMessage.success('删除成功');
  }).catch(() => {
    ElMessage.info('已取消删除');
  });
};


</script>
<template>
  <Page auto-content-height :title="$t(router.currentRoute.value.meta.title)">
    <ElCard>
      <h3 class="text-[red] mb-2">请留意，疑品为初始认证后7日内申报有效！</h3>
      <Form></Form>
      <template #footer>
        <div class="text-right"><VbenButton>结束扫描</VbenButton></div>
      </template>
    </ElCard>
  </Page>
</template>
