<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { onMounted, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getDeliveryDetails } from '#/api';

defineOptions({
  name: 'FormDrawer',
});


const row = ref({})
const [Drawer, drawerApi] = useVbenDrawer({
  class: 'w-[50%]',
  footer: false,
  onCancel() {
    drawerApi.close();
  },
  onConfirm: async () => {
    drawerApi.close();
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const { values } = drawerApi.getData<Record<string, any>>();
      if (values) {
        row.value = values;
        // getDeliveryDetails(row.value.id).then((res) => {
        //   gridApi.setGridOptions({data:res.data});
        // })
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
    { field: 'detail_no', title: '包装编码' },
    { field: 'limit_count', title: '总循环次数',width: 70 },
    { field: 'month_limit', title: '单月已用',width: 70 },
    { field: 'remain_count', title: '单月剩余用量',width: 70 },
    { field: 'status', title: '状态', width: 60,slots: { 
      default: ({ row }) => {
        return row.status == '1' ? '出库' : '回收';
      }
     } },
    { field: 'createTime', title: '租赁到期日' },
    { field: 'receive_person', title: '客户' },
    { field: 'receive_phone', title: '收件人地址' },
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
      query: async ({ page }) => {
        return await getDeliveryDetails(row.value.id);
      },
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });
// 模拟行数据

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
