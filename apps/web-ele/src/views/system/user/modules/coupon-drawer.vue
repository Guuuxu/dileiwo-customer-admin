<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';

import { ElMessage, ElButton } from 'element-plus';
import { useVbenForm } from '#/adapter/form';

import type { VxeGridProps } from '#/adapter/vxe-table';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
defineOptions({
  name: 'FormDrawer',
});

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
      fieldName: 'name',
      label: '优惠券',
      componentProps: {
        placeholder: '请输入优惠券ID/优惠券名称',
        clearable: true,
      },
    },
    {
      component: 'Select',
      fieldName: 'status',
      label: '状态',
      componentProps: {
        placeholder: '请选择状态',
        clearable: true,
        options: [
          { label: '全部', value: 0 },
          { label: '满减券', value: 1 },
          { label: '折扣券', value: 2 },
          { label: '代金券', value: 3 },
        ],
      },
    },
  ],
});

function handleSearch() {
  formApi.getValues();
}
function handleReset() {
  formApi.resetForm();
}

const [Drawer, drawerApi] = useVbenDrawer({
  class: 'w-[700px]',
  closeOnClickModal: false,
  onCancel() {
    drawerApi.close();
  },
  onConfirm: async () => {
    const selection = gridApi.grid?.getCheckboxRecords();
    if (selection.length === 0) {
      ElMessage.error('请至少选择一条数据');
      return;
    }
    console.log(selection);
    drawerApi.close();
    ElMessage.success('操作成功');
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const { values } = drawerApi.getData<Record<string, any>>();
      if (values) {
      }
    }
  },
  title: '发放优惠券',
});

// 被邀请用户table
// 表格配置
interface RowType {
  id: number;
  creatTime: string;
  name: string;
  num: string;
}
const dataList: any = ref([]);
const gridOptions: VxeGridProps<RowType> = {
  columns: [
    { align: 'left', title: '', type: 'checkbox', width: 40 },
    // { type: 'seq', width: 80 },
    { field: 'name', title: '优惠券名称' },
    { field: 'category', title: '优惠券类型' },
    { field: 'num', title: '已发放数量' },
    { field: 'total', title: '发放总量' },
    { field: 'status', title: '状态' },
    { field: 'creatTime', title: '有效期' },
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
const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });

// 模拟行数据
const loadList = (size = 200) => {
  try {
    // const dataList: RowType[] = [];
    for (let i = 0; i < size; i++) {
      dataList.value.push({
        id: 10_000 + i,
        name: '满减20',
        category: '满减券',
        creatTime: '2025-10-01',
        num: '134',
        total: 1000,
        status: 1,
      });
    }
    // gridApi.setGridOptions({ data: dataList });
  } catch (error) {
    console.error('Failed to load data:', error);
    // Implement user-friendly error handling
  }
};

onMounted(() => {
  loadList(10);
});
</script>
<template>
  <Drawer>
    <Form>
      <template #reset-before>
        <ElButton type="primary" @click="handleSearch">查询</ElButton>
      </template>
      <template #submit-before>
        <ElButton @click="handleReset">重置</ElButton>
      </template>
    </Form>
    <div class="vp-raw h-[500px] w-full">
      <Grid></Grid>
    </div>
  </Drawer>
</template>
<style lang="scss" scoped>
.grid-content {
  width: 116px;
  height: 116px;
}

.player-card {
  font-size: 14px;
  line-height: 28px;
}

::v-deep .vxe-grid {
  padding: 0;
}

::v-deep .avatar {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 10px;
}
</style>
