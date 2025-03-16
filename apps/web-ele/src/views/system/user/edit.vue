<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';

import { ElTabs, ElTabPane, ElCard, ElRow, ElCol, ElImage } from 'element-plus';
import { useVbenForm } from '#/adapter/form';

import type { VxeGridProps } from '#/adapter/vxe-table';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
defineOptions({
  name: 'FormDrawer',
});

const [BaseForm, BaseFormApi] = useVbenForm({
  // 大屏一行显示3个，中屏一行显示2个，小屏一行显示1个
  wrapperClass: 'grid-cols-1 md:grid-cols-2',
  schema: [
    {
      component: 'Image',
      componentProps: {
        placeholder: '请输入',

        class: 'avatar',
        src: 'https://egclub.nyc3.digitaloceanspaces.com/production/users/avatars/Te5VsbCnuaXRzyRTnu5hKhln6yqtACHqYggVE64t.png', // Add the source URL for the image here
      },
      fieldName: 'avatar',
      label: '用户头像',
    },
    {
      component: 'Span',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'name',
      label: '用户昵称',
    },
    {
      component: 'Span',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'code',
      label: '用户ID',
    },
    {
      component: 'Span',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'phone',
      label: '手机号',
    },
    {
      component: 'Span',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'email',
      label: '邮箱',
    },
    {
      component: 'Span',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'IDName',
      label: '身份',
    },
    {
      component: 'Span',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'taxCode',
      label: '纳税识别号',
    },
    {
      component: 'Span',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'grade',
      label: 'VIP登记',
    },
    {
      component: 'Span',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'gradeName',
      label: '平台会员',
    },
    {
      component: 'Span',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'recharge',
      label: '水晶余额',
    },
    {
      component: 'Span',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'revenue',
      label: '用户收益',
    },
    {
      component: 'Span',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'point',
      label: '积分',
    },
    {
      component: 'Span',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'isRecommend',
      label: '首页推荐',
    },
    {
      component: 'Select',
      componentProps: {
        placeholder: '请选择',
        options: [
          { label: '正常', value: 1 },
          { label: '禁用', value: 0 },
        ],
        disabled: true,
      },
      fieldName: 'status',
      label: '状态',
    },
    {
      component: 'Span',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'orders',
      label: '陪玩接单',
    },
  ],
  showDefaultActions: false,
});

import { useSchema } from './data';
const [PlayerForm, PlayerFormApi] = useVbenForm({
  // 大屏一行显示3个，中屏一行显示2个，小屏一行显示1个
  wrapperClass: 'grid-cols-1 md:grid-cols-2',
  schema: useSchema(),
  showDefaultActions: false,
});
const [Drawer, drawerApi] = useVbenDrawer({
  class: 'w-[600px]',
  onCancel() {
    drawerApi.close();
  },
  onConfirm: async () => {
    await PlayerFormApi.submitForm();
    drawerApi.close();
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const { values } = drawerApi.getData<Record<string, any>>();
      if (values) {
        PlayerFormApi.setValues(values);
        BaseFormApi.setValues(values);
      }
    }
  },
  title: '详情',
});
import type { TabsPaneContext } from 'element-plus';
const activeName = ref('base');
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event);
};

// 被邀请用户table
// 表格配置
interface RowType {
  id: number;
  creatTime: string;
  name: string;
  phone: string;
}
const dataList: any = ref([]);
const gridOptions: VxeGridProps<RowType> = {
  columns: [
    { field: 'name', title: '被邀请用户' },
    { field: 'phone', title: '手机号' },
    { field: 'phone', title: '消费分成' },
    { field: 'phone', title: '接单分成' },
  ],
  data: dataList.value,
  height: '500',
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
        name: '张三',
        phone: '13888888888',
      });
    }
    // gridApi.setGridOptions({ data: dataList });
  } catch (error) {
    console.error('Failed to load data:', error);
    // Implement user-friendly error handling
  }
};
onMounted(() => {
  loadList(4);
});
const srcList = [
  'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
];
</script>
<template>
  <Drawer>
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="基础信息" name="base">
        <BaseForm>
          <template #avatar="slotProps">
            <el-image
              class="h-[50px] w-[50px] rounded-lg"
              :src="srcList[0]"
              :preview-src-list="srcList"
              fit="cover"
            />
          </template>
        </BaseForm>
      </el-tab-pane>
      <el-tab-pane label="陪玩信息" name="player">
        <div class="grid grid-cols-4 gap-4">
          <div class="grid-content bg-slate-300">
            <!-- <img src="~@/assets/hot-game1.png" alt="" /> -->
          </div>
          <div class="grid-content bg-slate-300"></div>
          <div class="grid-content bg-slate-300"></div>
          <div class="grid-content bg-slate-300"></div>
        </div>
        <!-- <PlayerForm></PlayerForm> -->
        <el-card class="player-card mt-2 w-[100%]">
          <el-row>
            <el-col :span="12">用户所在地: 纽约</el-col>
            <el-col :span="12">语音试听: $900.00</el-col>
          </el-row>
          <el-row>
            <el-col :span="12">冠名价格: <el-input /></el-col>
            <el-col :span="12">冠名赠送免费陪玩时长: 5h30m</el-col>
          </el-row>
        </el-card>
        <!-- 陪玩技能1 -->
        <el-card class="player-card mt-2 w-[100%]">
          <template #header>
            <div class="card-header">
              <span>陪玩技能1</span>
            </div>
          </template>
          <el-row style="width: 100%">
            <el-col :span="12">陪玩技能: LOL</el-col>
            <el-col :span="12">游戏时长: 5h 30m</el-col>
          </el-row>
          <el-row>
            <el-col :span="12">段位: 铂金</el-col>
            <el-col :span="12">游戏经验: -</el-col>
          </el-row>
          <el-row>
            <el-col :span="24">游戏id、段位截图、成就截图: </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">个人简介: -</el-col>
          </el-row>
          <el-row>
            <el-col :span="12">陪玩价格（按时长计费）: <el-input /></el-col>
            <el-col :span="12">陪玩价格（按局数计费）: <el-input /></el-col>
          </el-row>
          <el-row>
            <el-col :span="12">陪玩价格（定额计费）: <el-input /></el-col>
          </el-row>
        </el-card>
        <el-card class="player-card mt-2 w-[100%]">
          <template #header>
            <div class="card-header">
              <span>陪玩技能2</span>
            </div>
          </template>
          <el-row style="width: 100%">
            <el-col :span="12">陪玩技能: LOL</el-col>
            <el-col :span="12">游戏时长: 5h 30m</el-col>
          </el-row>
          <el-row>
            <el-col :span="12">段位: 铂金</el-col>
            <el-col :span="12">游戏经验: -</el-col>
          </el-row>

          <el-row>
            <el-col :span="24">游戏id、段位截图、成就截图: </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">个人简介: -</el-col>
          </el-row>
          <el-row>
            <el-col :span="12">陪玩价格（按时长计费）: <el-input /></el-col>
            <el-col :span="12">陪玩价格（按局数计费）: <el-input /></el-col>
          </el-row>
          <el-row>
            <el-col :span="12">陪玩价格（定额计费）: <el-input /></el-col>
          </el-row>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="邀请用户信息" name="invitation">
        <el-card class="player-card mt-2 w-[100%]">
          <el-row>
            <el-col :span="12">共邀请人数：4</el-col>
            <el-col :span="12">总邀请奖励: $900.00</el-col>
          </el-row>
        </el-card>
        <Grid class="mt-2 p-0"></Grid>
      </el-tab-pane>
    </el-tabs>
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
