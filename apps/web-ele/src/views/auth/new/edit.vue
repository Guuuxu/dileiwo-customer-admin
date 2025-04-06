<script lang="ts" setup>
import { onMounted, ref, nextTick } from 'vue';
import { useVbenDrawer, useVbenModal, VbenButton } from '@vben/common-ui';
import type { VxeGridProps } from '#/adapter/vxe-table';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { handleConfirmAuth, handleAuthScan, handleAuthScanResult } from '#/api';

import { useVbenForm } from '#/adapter/form';

import { useSchema, useSchemaScan } from './data';
import { ElMessage, ElMessageBox } from 'element-plus';

defineOptions({
  name: 'FormDrawer',
});
const step = ref('0'); // 0：包装认证 1：包装扫码
const row = ref({});
const hasDoubt = ref('');
const scanResult = ref<any[]>([]);
// 定义自定义事件
const emits = defineEmits(['onUpdated']);
const [BaseForm, BaseFormApi] = useVbenForm({
  schema: useSchema(),
  showDefaultActions: false,
});
const [ScanForm, ScanFormApi] = useVbenForm({
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
        onKeyup(e: any) {
          if (e.key === 'Enter') {
            handleEnterInput();
          }
        },
      },
      fieldName: 'code',
      label: '请扫描包装编码',
      labelWidth: 150, // 设置label宽度
      rules: 'required',
    },
  ],
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
        const values = await BaseFormApi.getValues();
        hasDoubt.value = values.isUndefined;
        console.log('values', values);
        // 包装型号、数量正确
        if (values.packageNum === '1' && values.packageType === '1') {
          // 有疑品
          if (values.isUndefined === '1') {
            drawerApi.close();
            ElMessageBox.confirm(
              '请将疑品抽出，进行疑品申报(7日内申报有效)',
              '初始认证结束',
              {
                confirmButtonText: '确定',
                showCancelButton: false,
                type: 'warning',
              },
            ).then(() => {
              // 确定
            });
          } else {
            // 无疑品
            await handleConfirmAuth(row.value.id);
            ElMessage.success('初始认证完成！');
            // 触发自定义事件通知父组件
            emits('onUpdated');
            drawerApi.close();
          }
        } else {
          // ElMessage.error('包装型号、数量任意⼀项不正确');
          step.value = '1';
        }

        // drawerApi.close();
      }
    } else if (step.value === '1') {
      const { valid } = await ScanFormApi.validate();
      if (!valid) {
        return;
      }

      const res = await handleAuthScanResult(row.value.id);
      console.log('res', res);
      for (let i = 0; i < res.length; i++) {
        const element = res[i];
        scanResult.value.push({
          code: element,
          result: '未认证',
        });
      }
      console.log('scanResult', scanResult.value);
      drawerApi.close();
      modalApi.open();
    }
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const { values } = drawerApi.getData<Record<string, any>>();
      if (values) {
        row.value = values;
        BaseFormApi.setValues({
          ...values,
        });
      }
    } else {
      step.value = '0';
      BaseFormApi.resetForm();
    }
  },
  title: '详情',
});

// 输入确认
const handleEnterInput = async () => {
  const formValues = await ScanFormApi.getValues();
  try {
    await handleAuthScan(row.value.id, formValues.code);
    ElMessage.success('操作完成！');
    step.value = '1';
    setTimeout(() => {
      ScanFormApi.setValues({
        ...formValues,
        code: '',
      });
    }, 1000);
  } catch (error) {
    console.log('handleEnterInput', error);
    if (
      scanResult.value.findIndex(
        (item: { code: any }) => item.code === formValues.code,
      ) < 0
    ) {
      scanResult.value.push({
        code: formValues.code,
        result: error?.msg,
      });
    }
  }
};

const [Modal, modalApi] = useVbenModal({
  closeOnClickModal: false,
  header: false,
  fullscreenButton: false,
  showConfirmButton: false,
  confirmText: '导出',
  onConfirm: () => {
    modalApi.close();
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      gridApi.setGridOptions({
        data: scanResult.value,
      });
    }
    // 关闭时清空数据
    else {
      scanResult.value = [];
    }
  },
  onCancel() {
    modalApi.close();
  },
});
// 表格配置
interface RowType {
  id: number;
  createTime: string;
  code: string;
  result: string;
}
const dataList: any = ref([]);
const gridOptions: VxeGridProps<RowType> = {
  columns: [
    { field: 'code', title: '包装编码' },
    { field: 'result', title: '型号错误' },
  ],
  data: dataList.value,
  height: '500px',
  scrollY: {
    enabled: true,
    gt: 0,
  },
  showOverflow: true,
  editConfig: {
    mode: 'row',
    trigger: 'click',
  },
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

</script>
<template>
  <Drawer>
    <BaseForm v-if="step === '0'" />
    <ScanForm v-else-if="step === '1'" />
  </Drawer>
  <Modal>
    <Page auto-content-height>
      <div class="flex-col-center pt-5 text-[14px]">
        <div>
          经比对确认以下包装未认证成功，您可以将信息截图保存后，联系迪雷沃
        </div>
        <div v-if="hasDoubt == '1'" class="mt-5 text-[red]">
          若有疑品，请另外进行疑品申报
        </div>

        <Grid class="mt-4 w-full" />
      </div>
    </Page>
  </Modal>
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
