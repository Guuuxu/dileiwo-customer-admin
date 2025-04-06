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
import { getOutboundRecords,deleteDelivery,exportData } from '#/api';
import Edit from './edit.vue';
import Detail from './detail.vue';

const [Drawer, drawerApi] = useVbenDrawer({
  connectedComponent: Edit,
});

const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  connectedComponent: Detail,
});

const router = useRouter();



// 表格配置
interface RowType {
  id: number;
  created_at: string;
  category: string;
  during: string;
  times: string;
  remark: string;
}
const dataList: any = ref([]);
const gridOptions: VxeGridProps<RowType> = {
  columns: [
    // { align: 'left', title: '', type: 'checkbox', width: 40 },
    { field: 'type_name', title: '型号' },
    { field: 'created_at', title: '出货日期', },
    { field: 'receive_person', title: '联络人' },
    { field:'receive_phone', title: '联系电话' },
    { field: 'receive_address', title: '地址' },
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
        return await getOutboundRecords({
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
      component: 'Input',
      fieldName: 'client',
      label: '客户',
    },
    // {
    //   component: 'Input',
    //   fieldName: 'customer',
    //   label: '出库单号',
    // },
    {
      component: 'Select',
      fieldName: 'type_name',
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
const handleViewRow = (row: RowType) => {
  detailDrawerApi
   .setData({
      values: {...row },
    })
   .open();
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
    deleteDelivery(row.id).then((res) => {
      ElMessage.success('删除成功');
      gridApi.query();
    })
    
  }).catch(() => {
    ElMessage.info('已取消删除');
  });
};
const handleExport = async (row: RowType) => {
  await exportData(row.id).then((res) => {
    ElMessage.success('导出成功');
  })
}
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
            
            <template #action="{ row }">
              <ElButton type="primary" link @click="handleViewRow(row)">
                明细
              </ElButton>
              <!-- <ElButton type="primary" link @click="handleExport(row)">
                下载
              </ElButton> -->
              <ElButton type="danger" link @click="handleDeleteRow(row)">
                删除
              </ElButton>
            </template>
          </Grid>

    <Drawer  @onUpdated="handleUpdate"/>
    <DetailDrawer />
  </Page>
</template>
