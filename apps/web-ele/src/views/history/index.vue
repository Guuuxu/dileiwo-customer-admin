<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { Page, useVbenDrawer } from '@vben/common-ui';

import { ElButton, ElMessage, ElMessageBox } from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { $t } from '#/locales';

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
    { field: 'category', title: '型号' },
    { field: 'package', title: '包装' },
    { field: 'createTime', title: '出货日期' },
    { field: 'customer', title: '出货客户' },
    { field: 'contact', title: '联络人' },
    { field: 'address', title: '地址' },
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
      component: 'Select',
      fieldName: 'type',
      label: '类型',
      componentProps: {
        options: [
          { label: '租赁', value: '1' },
          { label: '购买', value: '2' },
          { label: '出库', value: '3' },
          { label: '回收', value: '4' },
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

// 模拟行数据
const loadList = (size = 200) => {
  try {
    // const dataList: RowType[] = [];
    for (let i = 0; i < size; i++) {
      dataList.value.push({
        id: 10_000 + i,
        createTime: '2025-01-03',
        category: `00002${i}`,
        package: 'DR200',
        customer: '张三',
        contact: '李四',
        address: '江苏',
      });
    }
    // gridApi.setGridOptions({ data: dataList });
  } catch (error) {
    console.error('Failed to load data:', error);
    // Implement user-friendly error handling
  }
};

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

onMounted(() => {
  loadList(6);
});
</script>
<template>
  <Page auto-content-height :title="$t(router.currentRoute.value.meta.title)">
    <template #extra>
      <!-- <ElButton type="primary" @click="handleAdd()"> 新增 </ElButton> -->
      <!-- <ElButton type="primary" @click="handleToDetail()"> 导入 </ElButton> -->
    </template>
    <Grid>
      <template #action="{ row }">
        <ElButton type="primary" link @click="handleViewRow(row)">
          明细
        </ElButton>
      </template>
    </Grid>

    <Drawer />
  </Page>
</template>
