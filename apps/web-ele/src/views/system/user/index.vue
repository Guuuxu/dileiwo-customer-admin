<template>
  <Page :title="$t(router.currentRoute.value.meta.title)">
    <ElCard>
      <template #default>
        <Form>
          <template #reset-before>
            <ElButton type="primary" @click="handleSearch">查询</ElButton>
          </template>
          <template #submit-before>
            <ElButton @click="handleReset">重置</ElButton>
          </template>
        </Form>
        <div class="vp-raw h-[500px] w-full">
          <Grid>
            <template #status="{ row }">
              <el-tag :type="row.status ? 'success' : 'danger'">{{
                row.status ? '启用' : '封禁'
              }}</el-tag>
            </template>
            <template #action="{ row }">
              <div class="flex justify-center">
                <ElButton type="primary" link @click="handleEditRow(row)"
                  >详情
                </ElButton>
                <ElDropdown trigger="click">
                  <el-button type="primary" link>
                    更多
                    <ElIcon name="el-icon-arrow-down" />
                  </el-button>
                  <template #dropdown>
                    <ElDropdownMenu>
                      <ElDropdownItem @click="handleRecommend(row)"
                        >{{ row.isRecommend ? '取消推荐' : '首页推荐' }}
                      </ElDropdownItem>
                      <ElDropdownItem @click="handleDeleteRow(row)"
                        >修改积分
                      </ElDropdownItem>
                      <ElDropdownItem @click="handleSendCoupon(row)"
                        >发放优惠券
                      </ElDropdownItem>
                      <ElDropdownItem @click="handleDeleteRow(row)"
                        >封禁
                      </ElDropdownItem>
                    </ElDropdownMenu>
                  </template>
                </ElDropdown>
              </div>
            </template>
          </Grid>
        </div>
      </template>
    </ElCard>

    <FormDrawer />
    <BaseDrawer />
  </Page>
</template>
<script lang="ts" setup>
import { ref, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import type { VxeGridProps } from '#/adapter/vxe-table';
import { useVbenVxeGrid } from '#/adapter/vxe-table';

import { Page, useVbenDrawer, VbenButton } from '@vben/common-ui';
import Edit from './edit.vue';
import CouponDrawer from './modules/coupon-drawer.vue';
const [FormDrawer, formDrawerApi] = useVbenDrawer({
  connectedComponent: Edit,
});

// 选择优惠券
const [BaseDrawer, baseDrawerApi] = useVbenDrawer({
  connectedComponent: CouponDrawer,
});
const handleSendCoupon = (row: RowType) => {
  console.log(formDrawerApi);
  baseDrawerApi
    .setData({
      values: { ...row },
    })
    .open();
};

import {
  ElButton,
  ElCard,
  ElMessage,
  ElTag,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElIcon,
} from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { $t } from '#/locales';

const router = useRouter();
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
  wrapperClass: 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4',
  handleSubmit: (values) => {
    ElMessage.success(`表单数据：${JSON.stringify(values)}`);
  },
  schema: [
    {
      component: 'Input',
      fieldName: 'name',
      label: '用户',
      componentProps: {
        placeholder: '请输入用户ID/用户昵称/手机号/邮箱',
      },
    },
    {
      component: 'Select',
      fieldName: 'isRecommend',
      label: '首页推荐',
      componentProps: {
        placeholder: '请选择',
        options: [
          { label: '全部', value: 0 },
          { label: '是', value: 1 },
          { label: '否', value: 2 },
        ],
      },
    },
    {
      component: 'Select',
      fieldName: 'status',
      label: '状态',
      componentProps: {
        placeholder: '请选择状态',
        options: [
          { label: '全部', value: 0 },
          { label: '启用', value: 1 },
          { label: '封禁', value: 2 },
        ],
      },
    },
    {
      component: 'Select',
      fieldName: 'recharge',
      label: '余额',
      componentProps: {
        placeholder: '请选择',
        options: [
          { label: '全部', value: 0 },
          { label: '欠款', value: 1 },
          { label: '正常', value: 2 },
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

// 表格配置
interface RowType {
  id: number;
  creatTime: string;
  name: string;
  customer: string;
  isRecommend: number;
  status: number;
  phone: string;
  email: string;
  discordId: string;
  userType: string; // 1 用户 2 陪玩
  grade: string;
  gradeName: string;
  recharge: string;
  revenue: string;
  point: string;
  updateTime: string;
  remark: string;
}
const dataList: any = ref([]);
const gridOptions: VxeGridProps<RowType> = {
  columns: [
    // { align: 'left', title: '', type: 'checkbox', width: 40 },
    { type: 'seq', width: 80 },
    { field: 'code', title: 'ID' },
    { field: 'name', title: '用户' },
    { field: 'phone', title: '手机号' },
    { field: 'discordId', title: 'Discord Id' },
    { field: 'IDName', title: '身份' },
    { field: 'grade', title: 'VIP等级' },
    { field: 'gradeName', title: '平台会员' },
    { field: 'recharge', title: '水晶余额' },
    { field: 'isRecommend', title: '首页推荐' },
    { field: 'status', title: '状态', slots: { default: 'status' } },
    { field: 'updateTime', title: '更新时间' },
    {
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      title: '操作',
      width: 150,
    },
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
        code: 10_000 + i,
        name: '张三',
        avatar: '',
        phone: '13888888888',
        email: '1123@qq.com',
        discordId: '123456',
        userType: '用户', // 1 用户 2 陪玩
        grade: '0',
        gradeName: '年费会员',
        recharge: '1110',
        isRecommend: 1,
        status: 1,
        updateTime: '2025-01-03',
        remark: '备注一下',
      });
    }
    // gridApi.setGridOptions({ data: dataList });
  } catch (error) {
    console.error('Failed to load data:', error);
    // Implement user-friendly error handling
  }
};

// 新增
const handleAdd = () => {
  handleSetData({});
};
// 编辑
function handleEditRow(row: RowType) {
  handleSetData(row);
}
// 详情
const handleViewRow = (row: RowType) => {
  handleSetData(row);
};

const handleSetData = (row: RowType) => {
  formDrawerApi
    .setData({
      values: { ...row },
    })
    .open();
};
const handleRecommend = (row: RowType) => {
  row.isRecommend = row.isRecommend === 1 ? 0 : 1;
  ElMessage.success(
    `已${row.isRecommend === 1 ? '推荐' : '取消推荐'} ${row.name} 成功`,
  );
  console.log(`🚀 ~ handleRecommend ~ row:`, row);
};
const handleDeleteRow = (row?: {}) => {
  console.log(`🚀 ~ handleDeleteRow ~ row:`, row);
};

onMounted(() => {
  loadList(10);
});
</script>
