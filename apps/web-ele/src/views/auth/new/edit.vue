<script lang="ts" setup>
import { onMounted, ref,nextTick } from 'vue';
import { useVbenDrawer,useVbenModal, VbenButton } from '@vben/common-ui';
import type { VxeGridProps } from '#/adapter/vxe-table';
import { useVbenVxeGrid } from '#/adapter/vxe-table';


import { useVbenForm } from '#/adapter/form';

import { useSchema, useSchemaScan } from './data';

defineOptions({
  name: 'FormDrawer',
});
const step = ref('0'); // 0：包装认证 1：包装扫码
const [BaseForm, BaseFormApi] = useVbenForm({
  schema: useSchema(),
  showDefaultActions: false,
});
const [ScanForm, ScanFormApi] = useVbenForm({
  schema: useSchemaScan(),
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
        console.log('values', values);
        // 包装型号、数量任意⼀项不正确
        if (values.packageNum === '2' || values.packageType === '2') {
          step.value = '1';
        }

        // drawerApi.close();
      }
    } else if (step.value === '1') {
      loadList(3);
      drawerApi.close();
      modalApi.open()
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
// 输入确认
const handleEnterInput = () => {
  console.log('handleEnterInput', '确认了');
};
const [Modal, modalApi] = useVbenModal({
  closeOnClickModal: false,
  header: false,
  fullscreenButton: false,
  confirmText: '导出',
  onConfirm:()=>{ 
    modalApi.close()
  }
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
        code: 'DR-100' + i,
        result: '型号错误',
      });
    }
    // gridApi.setGridOptions({ data: dataList });
  } catch (error) {
    console.error('Failed to load data:', error);
    // Implement user-friendly error handling
  }
};
</script>
<template>
  <Drawer>
    <BaseForm v-if="step === '0'" />
    <ScanForm v-else-if="step === '1'" />
  </Drawer>
  <Modal >
    <Page auto-content-height >
       
    <div class="flex-col-center pt-5 text-[14px]">
      <div>经比对确认以下包装未认证成功，您可以将信息截图保存后，联系迪雷沃</div>
      <div class="text-[red] mt-5">若有疑品，请另外进行疑品申报</div>
      
      <Grid class="mt-4" />
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
