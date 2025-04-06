<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { Page, useVbenDrawer } from '@vben/common-ui';

import { ElButton, ElCard, ElMessage, ElTag,ElMessageBox } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { $t } from '#/locales';
import { getCustomerList,deleteCustomer } from '#/api';

import Edit from './edit.vue';

const [Drawer, drawerApi] = useVbenDrawer({
  connectedComponent: Edit,
});

const router = useRouter();




// 表格配置
interface RowType {
  id: number;
  createTime: string;
  category: string;
  days: string;
  times: string;
  remark: string;
}
const dataList: any = ref([]);
const gridOptions: VxeGridProps<RowType> = {
  columns: [
    // { align: 'left', title: '', type: 'checkbox', width: 40 },
    { field: 'name', title: '客户' },
    { field: 'receive_person', title: '收货人' },
    { field: 'receive_phone', title: '联系电话', },
    { field: 'register_address', title: '收货地址', },
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
  proxyConfig: {
    ajax: {
      query: async ({ page },formValues) => {
        return await getCustomerList({
          page: page.currentPage,
          per_page: page.pageSize,
          ...formValues,
        });
      },
    },
  },
};
const formOptions: VbenFormProps = {
  // 默认展开
  collapsed: false,
  // fieldMappingTime: [['date', ['start', 'end']]],
  schema: [
    {
      component: 'Input',
      fieldName: 'name',
      label: '客户',
    },
    {
      component: 'Input',
      fieldName: 'order',
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
  handleSetData(row,'编辑');
}
const handleDeliveryRow = (row: RowType)=>{
  handleSetData(row,'出库');
}


const handleSetData = (row: RowType, title: string) => {
  drawerApi
    .setData({
      values: { ...row, type: title },
    }).setState({
      title
    })
    .open();
};

const handleDeleteRow = (row: RowType) => {
  ElMessageBox.confirm(
    '确认删除此客户数据?',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    await deleteCustomer(row.id);
    ElMessage.success('删除成功');
    gridApi.query();
  }).catch(() => {
    ElMessage.info('已取消删除');
  });
};
const handleUpdate = ()=>{
  gridApi.reload();
}

</script>
<template>
  <Page auto-content-height :title="$t(router.currentRoute.value.meta.title)">
    <template #extra>
      <ElButton type="primary" @click="handleAdd()"> 新增 </ElButton>
      <!-- <ElButton type="primary" @click="handleToDetail()"> 导入 </ElButton> -->
    </template>
    <Grid>
            <template #status="{ row }">
              <ElTag :type="row.status ? 'success' : 'danger'">
                {{ row.status ? '已启用' : '已禁用' }}
              </ElTag>
            </template>
            <template #action="{ row }">
              <ElButton type="primary" link @click="handleEditRow(row)">
                编辑
              </ElButton>
              <!-- <ElButton type="primary" link @click="handleDeliveryRow(row)">
                出库
              </ElButton> -->
              <ElButton type="danger" link @click="handleDeleteRow(row)">
                删除
              </ElButton>
            </template>
          </Grid>

    <Drawer @onUpdated="handleUpdate" />
  </Page>
</template>
