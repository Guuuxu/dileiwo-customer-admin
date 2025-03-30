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
import { handleScan } from '#/api';


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
      fieldName: 'detail_no',
      label: '回收包装编码',
      componentProps: {
        placeholder: '请输入',
        onKeyup(e: any) {
          if (e.key === 'Enter') {
            handleEnterInput();
          }
        },
      },
    },
  ],
});
// 输入确认
const handleEnterInput = async () => {
  const formValues = await formApi.getValues();
  console.log('handleEnterInput', formValues);
  const data = {
    type: 1,
    detail_no: formValues.detail_no,
  };
  console.log('handleEnterInput', data);
  const res = await handleScan(data);
  ElMessage.success('回收完成！');
};

// 表格配置
interface RowType {
  id: number;
  created_at: string;
  category: string;
  days: string;
  times: string;
  remark: string;
}
const dataList: any = ref([]);
const gridOptions: VxeGridProps<RowType> = {
  columns: [
    // { align: 'left', title: '', type: 'checkbox', width: 40 },
    { field: 'category', title: '型号' },
    { field: 'amount', title: '数量' },
    { field: 'days', title: '租赁天数', },
    { field: 'times', title: '单月循环次数', },
    { field: 'created_at', title: '出货日期', },
    { field: 'remark', title: '备注', },
    // { field: 'status', title: '状态', slots: { default: 'status' } },
    {
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      title: '操作',
      width: 150,
    },
  ],
  data: dataList.value,
  height: 'auto',
  scrollY: {
    enabled: true,
    gt: 0,
  },
  showOverflow: true,
  editConfig: {
    mode: 'row',
    trigger: 'click',
  },
  pagerConfig: {},
  // proxyConfig: {
  //   ajax: {
  //     query: async ({ page }) => {
  //       return await getExampleTableApi({
  //         page: page.currentPage,
  //         per_page: page.pageSize,
  //       });
  //     },
  //   },
  // },
};
const formOptions: VbenFormProps = {
  // 默认展开
  collapsed: false,
  fieldMappingTime: [['date', ['start', 'end']]],
  schema: [
    {
      component: 'Input',
      fieldName: 'customer',
      label: '客户',
    },
    {
      component: 'Input',
      fieldName: 'customer',
      label: '出库单号',
    },
    {
      component: 'Select',
      fieldName: 'type',
      label: '出货类型',
      componentProps:{
        options: [
          { label: '租赁', value: '1' },
          { label: '购买', value: '2' },
        ],
      }
    },

  ],
  // 控制表单是否显示折叠按钮
  showCollapseButton: true,
  // 是否在字段值改变时提交表单
  submitOnChange: true,
  // 按下回车时是否提交表单
  submitOnEnter: false,
};
const [Grid, gridApi] = useVbenVxeGrid({ formOptions, gridOptions });

// 新增
const handleAdd = () => {
  handleSetData({},'新增');
};
// 编辑
function handleEditRow(row: RowType) {
  ElMessage.warning('功能待开发！')
}


const handleSetData = (row: RowType, title: string) => {
  drawerApi
    .setData({
      values: { ...row },
    }).setState({
      title
    })
    .open();
};

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
      <Form></Form>
      <template #footer>
        <div class="text-right"><VbenButton>结束扫描</VbenButton></div>
      </template>
    </ElCard>
  </Page>
</template>
