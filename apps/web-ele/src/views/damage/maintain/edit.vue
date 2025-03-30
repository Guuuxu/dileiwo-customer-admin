<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import type { VxeGridProps } from '#/adapter/vxe-table';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';

import { useSchema, useSchemaReason } from './data';
import { ElMessage } from 'element-plus';
import { scanOutboundBarcode } from '#/api';

defineOptions({
  name: 'FormDrawer',
});
const step = ref('0');
const [BaseForm, BaseFormApi] = useVbenForm({
  schema: [
  {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
        onKeyup(e: KeyboardEvent) {
          if (e.key === 'Enter') {
            // 如果按下回车键，调用 handleEnterInput 函数
            handleEnterInput();
          }
        },
      },
      fieldName: 'code',
      label: '请扫描损坏品包装编码',
      labelWidth: 150, // 设置label宽度
      rules: 'required',
    },
  ],
  layout: 'vertical',
  showDefaultActions: false,
});
// 输入确认
const handleEnterInput = async () => {
  const formValues = await BaseFormApi.getValues()
  console.log('handleEnterInput',formValues );
  // const res = await scanOutboundBarcode(row.value.id,formValues.code)
    ElMessage.success('操作完成！')
    step.value = '1'
    BaseFormApi.setValues({
      ...formValues,
      code: '',
    })
};

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
      const formValues = await BaseFormApi.getValues()
      console.log(formValues)
      if(!formValues.code) ElMessage.warning('请先扫描包装编码');
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
