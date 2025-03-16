<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';

import { useSchema, useSchemaReason } from './data';

defineOptions({
  name: 'FormDrawer',
});
const step = ref('0');
const [BaseForm, BaseFormApi] = useVbenForm({
  schema: useSchema(),
  layout: 'vertical',
  showDefaultActions: false,
});

const [BaseForm2, BaseFormApi2] = useVbenForm({
  schema: useSchemaReason(),
  layout: 'vertical',
  showDefaultActions: false,
});

const [Drawer, drawerApi] = useVbenDrawer({
  onCancel() {
    drawerApi.close();
  },
  onConfirm: async () => {
    if (step.value === '0') {
      await BaseFormApi.submitForm();
      step.value = '1';
    } else {
      drawerApi.close();
    }
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
  category: string;
  user: string;
  codeRange: string;
}
const dataList: any = ref([]);
const gridOptions: VxeGridProps<RowType> = {
  columns: [
    // { align: 'left', title: '', type: 'checkbox', width: 40 },
    { field: 'category', title: '型号' },
    { field: 'codeRange', title: '包装编码' },
    { field: 'createTime', title: '最新入库日期' },
    { field: 'user', title: '最新使用者' },
  ],
  data: dataList.value,
  height: '500px',
  scrollY: {
    enabled: true,
    gt: 0,
  },
  showOverflow: true,
  pagerConfig: {
    enabled: false,
  },
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
        category: '100',
        user: '张三',
        codeRange: '1 - 10002',
        remark: '备注一下',
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
    <BaseForm v-if="step === '0'" />

    <template v-else>
      <Grid style="height: auto" />
      <BaseForm2 class="mt-5" />
    </template>
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
