
<script lang="ts" setup>
  
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { AnalysisChartCard, WorkbenchHeader } from '@vben/common-ui';
import { preferences } from '@vben/preferences';
import { useUserStore } from '@vben/stores';
import { getHomeData } from '#/api';
import { ElCard, ElRow, ElCol } from 'element-plus';
import dayjs from 'dayjs';

import type { VxeGridProps } from '#/adapter/vxe-table';

const userStore = useUserStore();

const homeData = ref<any>({});
const dataList: any = ref([]);
// 表格配置
interface RowType {
  id: number;
  order_no: string;
  detail_no: string;
  rent_time: string;
  during: string;
  end_time: string;
}
const containerRef = ref<HTMLElement | null>(null);
const headerHeight = ref(0);
const cardHeaderHeight = ref(0);
const gridOptions: VxeGridProps<RowType> = {
  columns: [
    // { align: 'left', title: '', type: 'checkbox', width: 40 },
    { field: 'order_no', title: '单号' },
    { field: 'detail_no', title: '包装编码' },
    { field: 'type_name', title: '型号' },
    { field: 'month_limit', title: '总量' },
    { field: 'limit_count', title: '单月用量', },
    { field: 'month_limit_max', title: '单月用量上限' },
    { field: 'rent_time', title: '起租日',
      slots: {
        default: ({ row }) => {
        // 格式化日期为 YYYY-MM-DD 格式
        return row.rent_time ? dayjs(row.rent_time).format('YYYY-MM-DD') : '-';
      }
      }
     },
    { field: 'during', title: '租赁时长' },
    { field: 'end_time', title: '到期日',slots: {
      default: ({ row }) => {
        // 格式化日期为 YYYY-MM-DD 格式
        return row.end_time ? dayjs(row.end_time).format('YYYY-MM-DD') : '-';
      }
    } },
  ],
  data: dataList.value,
  // 先不设置固定高度
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
  pagerConfig: {
    enabled: false
  },
  proxyConfig: {

  },
};
const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });

onMounted(async () => {
  const res = await getHomeData();
  console.log(res);
  homeData.value = res;
  const height = window.innerHeight - 580;
  gridApi.setGridOptions({ data: res.bound_list,height: height });
})
</script>
<template>
  <div class="p-5 flex flex-col ">
    <WorkbenchHeader
      :avatar="userStore.userInfo?.avatar || preferences.app.defaultAvatar"
      class="workbench-header"
    >
      <template #title>
        早安, {{ userStore.userInfo?.realName }}, 开始您一天的工作吧！
      </template>
      <template #description> 今日晴，20℃ - 32℃！ </template>
    </WorkbenchHeader>
    <el-row class="mt-5 stats-row" :gutter="20">
      <el-col :span="16">
        <el-card>
          <template #header>
            <span class="text-lg font-semibold">当前包装使用情况</span>
          </template>
          <div class="flex items-center justify-between">
            <div class="flex flex-col items-center">
              <span class="text-sm text-gray-500">持有包装总数</span>
              <span class="text-xl font-bold">{{homeData.total_count}}</span>
            </div>
            <div class="flex flex-col items-center">
              <span class="text-sm text-gray-500">在库包装数量</span>
              <span class="text-xl font-bold">{{homeData.inbound_count}}</span>
            </div>
            <div class="flex flex-col items-center">
              <span class="text-sm text-gray-500">出库包装数量</span>
              <span class="text-xl font-bold">{{homeData.outbound_count}}</span>
            </div>
            <div class="flex flex-col items-center">
              <span class="text-sm text-gray-500">损坏申报数量</span>
              <span class="text-xl font-bold">{{homeData.repair_count}}</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header>
            <span class="text-lg font-semibold">当前各型号总量</span>
          </template>
          <div class="flex items-center gap-5 overflow-x-auto">
            <div class="model-item flex flex-col items-center" v-for="(item, index) in homeData.model_list" :key="item.id">
              <span class="text-sm text-gray-500">{{item.type_name}}</span>
              <span class="text-xl font-bold">{{item.count}}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-card class="mt-5">
      <template #header>
        <span class="text-lg font-semibold">包装租赁/购买详情</span>
      </template>
      <Grid class="h-full" />
    </el-card>
  </div>

</template>
<style lang="scss" scoped>
.stats-row {
  :deep(.el-card__body){
    box-sizing: border-box;
    min-height: 100px;
  }
}

  .model-item{
    padding: 0 5px;
  }
</style>
