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
          <Grid>
            <template #status="{ row }">
              <el-tag :type="row.status ? 'success' : 'danger'">{{
                row.status ? '已启用' : '已禁用'
              }}</el-tag>
            </template>
            <template #action="{ row }">
              <ElButton type="primary" link @click="handleEditRow(row)"
                >编辑
              </ElButton>

              <ElButton type="danger" link @click="handleDeleteRow(row)"
                >删除
              </ElButton>
            </template>
          </Grid>
        </div>
      </template>
    </ElCard>

    <Drawer @onUpdated="handleUpdate" />
  </Page>
</template>
<script lang="ts" setup>
import { ref, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getAdminUserListApi, deleteAdminUserApi } from '#/api';

import { Page, useVbenDrawer, VbenButton } from '@vben/common-ui';
import Edit from './edit.vue';
const [Drawer, drawerApi] = useVbenDrawer({
  connectedComponent: Edit,
});

import { ElButton, ElCard, ElMessage, ElTag, ElMessageBox } from 'element-plus';

import { $t } from '#/locales';

const router = useRouter();

// 表格配置
import type { AdminInfo } from '@vben/types';
interface RowType extends AdminInfo {
  id: number;
  creatTime: string;
  status: number;
  name: string;
  phone: string;
  role: string;
}
const dataList: any = ref([]);
const gridOptions: VxeGridProps<RowType> = {
  columns: [
    // { align: 'left', title: '', type: 'checkbox', width: 40 },
    { field: 'id', title: 'ID' },
    { field: 'name', title: '姓名' },
    {
      field: 'type',
      title: '角色',
      cellRender: {
        name: 'CellSelectLabel',
        props: {
          options: [
            { label: '总管员', value: 0 },
            { label: '管理员', value: 1 },
            { label: '操作员', value: 2 },
          ],
        },
      },
    },
    { field: 'phone', title: '手机号' },
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
      query: async ({ page }, formValues) => {
        return await getAdminUserListApi({
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
  schema: [
    {
      component: 'Input',
      fieldName: 'keyword',
      label: '用户',
      componentProps: {
        placeholder: '请输入用户ID/姓名/手机号',
      },
    },
    {
      component: 'Select',
      fieldName: 'type',
      label: '角色',
      componentProps: {
        options: [
          { label: '总管员', value: 0 },
          { label: '管理员', value: 1 },
          { label: '操作员', value: 2 },
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
  handleSetData({}, 'add');
};
// 编辑
function handleEditRow(row: RowType) {
  handleSetData(row, 'edit');
}
// 禁用
const handleDisabled = (row: RowType) => {
  row.status = row.status ? 0 : 1;
  ElMessage.success(`已${row.status === 1 ? '启用' : '禁用'}${row.name}`);
  // nextTick(() => {
  //   gridApi.reload();
  // });
};
// 导入
// 详情
const handleViewRow = (row: RowType) => {
  handleSetData(row, 'view');
};

const handleSetData = (row: RowType, pageType: string) => {
  drawerApi
    .setData({
      values: { ...row,  },
    })
    .setState({
      title: pageType === 'add' ? '新增' : '编辑',
    })
    .open();
};

const handleDeleteRow = (row?: {}) => {
  console.log(`🚀 ~  ~ row:`, row);
  ElMessageBox.confirm('确认删除此用户吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await deleteAdminUserApi(row.id);
    gridApi.reload();
    ElMessage.success('删除成功');
  });
};
const handleUpdate = () => {
  gridApi.reload();
};
</script>
