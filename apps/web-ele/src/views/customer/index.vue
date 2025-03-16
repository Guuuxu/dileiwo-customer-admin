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

// 表格配置
interface RowType {
  id: number;
  createTime: string;
  package: string;
  person: string;
  contact: string;
  address: string;
}
const dataList: any = ref([]);
const gridOptions: VxeGridProps<RowType> = {
  columns: [
    // { align: 'left', title: '', type: 'checkbox', width: 40 },
    // { field: 'category', title: '型号' },
    { field: 'customer', title: '客户名称' },
    { field: 'code', title: '登记注册号', },
    { field: 'person', title: '法定代表人', },
    // { field: 'status', title: '状态', slots: { default: 'status' } },
    {
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      title: '操作',
      width: 250,
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
      componentProps: {
        placeholder: '请输入客户名称、客户编号'
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
        customer:'长吉有限公司',
        code: '00002' + i,
        tel: '020-99290029',
        phone: '13500000000',
        contact: '张三',
        person: '李四',
        address: '江苏',
        contactAddress: '中山路1号',
        consignee: '刘京东',
        consigneePhone:'13899999999',
        consigneeAddress: '钟楼'
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
const handleEditRow = (row: RowType)=>{
  handleSetData(row,'编辑')
}

function handleExportRow(row: RowType) {
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
    '请注意，若删除后，该客户数据将一并从系统内删除',
    '请确认是否删除此客户',
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
              <ElButton type="primary" link @click="handleExportRow(row)">
                明细
              </ElButton>
              <ElButton type="primary" link @click="handleExportRow(row)">
                导出
              </ElButton>
              <ElButton type="danger" link @click="handleDeleteRow(row)">
                删除
              </ElButton>
            </template>
          </Grid>

    <Drawer />
  </Page>
</template>
