<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { Page, useVbenDrawer } from '@vben/common-ui';

import { ElButton, ElCard, ElMessage, ElTag } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { $t } from '#/locales';

import Edit from './edit.vue';

const [Drawer, drawerApi] = useVbenDrawer({
  connectedComponent: Edit,
});

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
      label: '项目名称',
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
    { field: 'customer', title: '客户' },
    { field: 'receiver', title: '收货人' },
    { field: 'contact', title: '联系电话', },
    { field: 'address', title: '收货地址', },
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
  //         pageSize: page.pageSize,
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

// 模拟行数据
const loadList = (size = 200) => {
  try {
    // const dataList: RowType[] = [];
    for (let i = 0; i < size; i++) {
      dataList.value.push({
        id: 10_000 + i,
        createTime: '2025-01-03',
        customer: '欢庆有限公司',
        receiver: '张三',
        contact: '13500000009',
        address: '新竹市',
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
  handleSetData({},'新增');
};
// 编辑
function handleEditRow(row: RowType) {
  handleSetData(row,'编辑');
}
const handleDeliveryRow = ()=>{
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

onMounted(() => {
  loadList(6);
});
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
              <ElButton type="primary" link @click="handleDeliveryRow(row)">
                出库
              </ElButton>
              <ElButton type="danger" link @click="handleDeleteRow(row)">
                删除
              </ElButton>
            </template>
          </Grid>

    <Drawer />
  </Page>
</template>
