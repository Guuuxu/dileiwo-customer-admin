<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { Page, useVbenDrawer } from '@vben/common-ui';

import { ElButton, ElMessage, ElMessageBox } from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { $t } from '#/locales';
import { getInventoryRecords, deleteDelivery } from '#/api';

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
  package: string;
  customer: string;
  contact: string;
  address: string;
}
const dataList: any = ref([]);
const gridOptions: VxeGridProps<RowType> = {
  columns: [
    // { align: 'left', title: '', type: 'checkbox', width: 40 },
    // { field: 'type_name', title: '型号' },
    { field: 'detail_no', title: '包装编码', width: 150 },
    { field: 'month_limit', title: '总循环次数' },
    { field: 'limit_count', title: '单月已用' },
    { field: 'remain_count', title: '单月剩余用量' },
    { field: 'type', title: '类型', slots: { default: 'type' } },
    { field: 'name', title: '客户' },
    { field: 'receive_address', title: '收件人地址' },
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
      query: async ({ page }, formValues) => {
        return await getInventoryRecords({
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
  fieldMappingTime: [['date', ['start', 'end']]],
  schema: [
    {
      component: 'Select',
      fieldName: 'type',
      label: '类型',
      componentProps: {
        options: [
          { label: '出库', value: '1' },
          { label: '回收', value: '2' },
          { label: '损坏', value: '3' },
        ],
      },
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
  handleSetData({}, '新增');
};
// 明细
function handleViewRow(row: RowType) {
  handleSetData(row, '明细');
}
function handleExportRow(row: RowType) {
  ElMessage.warning('功能待开发！');
}

const handleSetData = (row: RowType, title: string) => {
  drawerApi
    .setData({
      values: { ...row },
    })
    .setState({
      title,
    })
    .open();
};
const handleDeleteRow = (row: RowType) => {
  ElMessageBox.confirm('此操作将永久删除该条记录, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      // Perform delete operation here
      // const index = dataList.value.findIndex((item: { id: number; }) => item.id === row.id);
      // if (index !== -1) {
      //   dataList.value.splice(index, 1);
      //   ElMessage.success('删除成功');
      // }
      ElMessage.success('删除成功');
    })
    .catch(() => {
      ElMessage.info('已取消删除');
    });
};
</script>
<template>
  <Page auto-content-height :title="$t(router.currentRoute.value.meta.title)">
    <template #extra>
      <!-- <ElButton type="primary" @click="handleAdd()"> 新增 </ElButton> -->
      <!-- <ElButton type="primary" @click="handleToDetail()"> 导入 </ElButton> -->
    </template>
    <Grid>
      <template #type="{ row }">
        <span v-if="row.type == '1'">出库</span>
        <span v-if="row.type == '2'">回收</span>
        <span v-if="row.type == '3'">损坏</span>
      </template>
    </Grid>

    <Drawer />
  </Page>
</template>
