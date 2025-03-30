<template>
  <Page :title="$t(router.currentRoute.value.meta.title)">
    <template #extra>
      <ElButton type="primary" @click="handleAdd()"> 新增 </ElButton>
      <!-- <ElButton type="primary" @click="handleToDetail()"> 导入 </ElButton> -->
    </template>
    <ElCard>
      <template #default>
        <Form>
          <template #reset-before>
            <ElButton type="primary" @click="handleSearch">搜索</ElButton>
          </template>
          <template #submit-before>
            <ElButton @click="handleReset">清空</ElButton>
          </template>
        </Form>
        <div class="vp-raw h-[500px] w-full">
          <Grid> </Grid>
        </div>
      </template>
    </ElCard>

    <Drawer />
  </Page>
</template>
<script lang="ts" setup>
import { ref, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import type { VxeGridProps } from '#/adapter/vxe-table';
import { useVbenVxeGrid } from '#/adapter/vxe-table';

import { Page, useVbenDrawer, VbenButton } from '@vben/common-ui';
import Edit from './edit.vue';
const [Drawer, drawerApi] = useVbenDrawer({
  connectedComponent: Edit,
});

import { ElButton, ElCard, ElMessage, ElTag } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
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
  wrapperClass: 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4',
  handleSubmit: (values) => {
    ElMessage.success(`表单数据：${JSON.stringify(values)}`);
  },
  schema: [
    {
      component: 'Input',
      fieldName: 'name',
      label: '角色名称',
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

// 表格配置
interface RowType {
  id: number;
  creatTime: string;
  name: string;
  customer: string;
}
const dataList: any = ref([]);
const gridOptions: VxeGridProps<RowType> = {
  columns: [
    // { align: 'left', title: '', type: 'checkbox', width: 40 },
    { field: 'name', title: '角色名称' },
    { field: 'permission', title: '权限字符' },
    { field: 'permission', title: '角色描述' },

    // { field: 'status', title: '状态', slots: { default: 'status' } },
    { field: 'createTime', title: '更新时间' },
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
const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });

// 模拟行数据
const loadList = (size = 200) => {
  try {
    // const dataList: RowType[] = [];
    for (let i = 0; i < size; i++) {
      dataList.value.push({
        id: 10_000 + i,
        createTime: '2025-01-03',
        name: '管理员',
        permission: 'admin',
        status: 1,
        remark: '备注一下',
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
  handleSetData({});
};
// 编辑
function handleEditRow(row: RowType) {
  handleSetData(row);
}
// 详情
const handleViewRow = (row: RowType) => {
  handleSetData(row);
};

const handleSetData = (row: RowType) => {
  drawerApi
    .setData({
      values: { ...row },
    })
    .open();
};

const handleDeleteRow = (row?: {}) => {
  console.log(`🚀 ~  ~ row:`, row);
};

onMounted(() => {
  loadList(2);
});
</script>
