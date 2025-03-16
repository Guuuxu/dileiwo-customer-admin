<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { onMounted, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';

import { useSchema } from './data';

defineOptions({
  name: 'FormDrawer',
});

const [BaseForm, BaseFormApi] = useVbenForm({
  schema: useSchema(),
  showDefaultActions: false,
});

const [Drawer, drawerApi] = useVbenDrawer({
  class: 'w-[700px]',
  confirmText:'导出',
  onCancel() {
    drawerApi.close();
  },
  onConfirm: async () => {
    await BaseFormApi.submitForm();
    drawerApi.close();
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const { values } = drawerApi.getData<Record<string, any>>();
      if (values) {
        BaseFormApi.setValues({
          ...values,
        });
      }
    }
  },
  title: '详情',
});

// 表格配置
interface RowType {
  id: number;
  createTime: string;
  package: string;
  customer: string;
  contact: string;
  address: string;
}
const dataList: any = ref([]);
const gridOptions: VxeGridProps<RowType> = {
  columns: [
    // { align: 'left', title: '', type: 'checkbox', width: 40 },
    // { field: 'category', title: '型号' },
    { field: 'packageCode', title: '包装编码' },
    { field: 'createTime', title: '总循环次数' },
    { field: 'customer', title: '单月已用' },
    { field: 'customer', title: '单月剩余用量' },
    { field: 'status', title: '状态', slots: { default: 'status' } },
    { field: 'createTime', title: '租赁到期日' },
    { field: 'customer', title: '客户' },
    { field: 'address', title: '收件人地址' },
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
        createTime: '2025-01-03',
        category: `00002${i}`,
        package: 'DR200',
        customer: '张三',
        contact: '李四',
        address: '江苏',
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
  loadList(6);
});
</script>
<template>
  <Drawer>
    <Grid>
      <template #status="{ row }">
        <el-tag :type="row.status ? 'success' : 'danger'">
          {{ row.status ? '出库' : '' }}
        </el-tag>
      </template>
    </Grid>
  </Drawer>
</template>
<style lang="scss" scoped>
.grid-content {
  width: 116px;
  height: 116px;
}

.player-card {
  font-size: 14px;
  line-height: 25px;
}

::v-deep .vxe-grid {
  padding: 0;
}
</style>
