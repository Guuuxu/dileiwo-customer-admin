<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import type { VxeGridProps } from '#/adapter/vxe-table';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';

import { useSchema, useSchemaReason } from './data';
import { ElMessage } from 'element-plus';
import { scanRepair,updateRepair,getRepairDetail } from '#/api';

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
const detail = ref({})
// 输入确认
const handleEnterInput = async () => {
  const formValues = await BaseFormApi.getValues()
  const res = await scanRepair({detail_no:formValues.code})
  console.log('res',res );
  detail.value = res
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
      const { valid } = await BaseFormApi.validate();
      if (valid) {
        const formValues = await BaseFormApi.getValues()
        console.log(formValues)
        updateRepair({...formValues,model_detail_id:detail.value.id,}).then((res) => {
          ElMessage.success('操作完成！')
          drawerApi.close();
        })
      }
      
    } else {
      const { valid } = await BaseFormApi2.validate();
      if (valid) {
        const formValues = await BaseFormApi2.getValues()
        console.log(formValues)
        
        
      }
      
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
    }else{
      step.value = '0'
      BaseFormApi.setValues({
        code: '',
      })
      BaseFormApi2.setValues({
        reason: '',
        remark: '',
      })
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

</script>
<template>
  <Drawer>
    <BaseForm v-if="step === '0'" />

    <template v-else>
      <!-- <Grid style="height: auto" /> -->
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
