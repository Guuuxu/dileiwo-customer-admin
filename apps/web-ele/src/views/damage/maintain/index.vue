<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import { onMounted, ref, reactive } from 'vue';
import { useRouter } from 'vue-router';

import { Page, useVbenDrawer, useVbenModal } from '@vben/common-ui';

import {
  ElButton,
  ElInput,
  ElMessage,
  ElTag,
  ElMessageBox,
  ElForm,
  ElFormItem,
} from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getRepairVerifyList, sendRepair } from '#/api';
import { damageReportStatusOptions } from '#/views/dict';
import { $t } from '#/locales';

import Edit from './edit.vue';

const [Drawer, drawerApi] = useVbenDrawer({
  connectedComponent: Edit,
});
const [Modal, modalApi] = useVbenModal();

const router = useRouter();

// 表格配置
interface RowType {
  id: number;
  createTime: string;
  name: string;
  itemIcon: string;
  status: number;
  user: string;
}
const dataList: any = ref([]);
const gridOptions: VxeGridProps<RowType> = {
  columns: [
    // { align: 'left', title: '', type: 'checkbox', width: 40 },
    { field: 'order_no', title: '型号' },
    { field: 'detail_no', title: '包装编码' },
    { field: 'last_user', title: '使用者（最近一次）' },
    { field: 'reason', title: '备注' },
    {
      field: 'status',
      title: '状态',
      cellRender: {
        name: 'CellSelectLabel',
        props: {
          options: damageReportStatusOptions,
        },
      },
    },
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
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await getRepairVerifyList({
          page: page.currentPage,
          per_page: page.pageSize,
          ...formValues,
        });
      },
    },
  },
};
const formOptions: VbenFormProps = {
  // 默认展开
  collapsed: false,
  schema: [
    {
      component: 'Input',
      fieldName: 'type_name',
      label: '型号',
    },
  ],
  // 控制表单是否显示折叠按钮
  showCollapseButton: true,
  // 是否在字段值改变时提交表单
  submitOnChange: true,
  // 按下回车时是否提交表单
  submitOnEnter: false,
};
const [Grid, gridApi] = useVbenVxeGrid({ formOptions, gridOptions });

// 新增
const handleAdd = () => {
  handleSetData({}, '新增');
};
// 编辑
function handleEditRow(row: RowType) {
  ElMessage.success('操作成功');
}

const handleSetData = (row: RowType, title: string) => {
  drawerApi
    .setData({
      values: { ...row },
    })
    .setState({
      title,
    })
    .open();
};

// 当前选择行
const currentRow = ref<RowType>({});
const handleSendRow = (row: RowType) => {
  modalApi.open();
  currentRow.value = row;
  // ElMessageBox.prompt('是否确认寄出？', '提示', {
  //   confirmButtonText: '确定',
  //   cancelButtonText: '取消',
  //   type: 'warning',
  // }).then(async () => {
  //   await sendRepair(row.id);
  //   gridApi.reload();
  //   ElMessage.success('操作成功');
  // });
};
const form = reactive({
  transfer_no: '',
});
const tranForm = ref<InstanceType<typeof ElForm>>();
const transfer_no = [
  { required: true, message: '请输入运输单号', trigger: 'blur' },
];
const handleSendConfirm = () => {
  tranForm.value?.validate(async (valid) => {
    if (valid) {
      await sendRepair({ id: currentRow.value.id, transfer_no: form.transfer_no });
      gridApi.reload();
      ElMessage.success('操作成功');
      modalApi.close();
    }
  });
};

const handleUpdate = () => {
  gridApi.reload();
};
</script>
<template>
  <Page auto-content-height :title="$t(router.currentRoute.value.meta.title)">
    <template #extra>
      <ElButton type="primary" @click="handleAdd()"> 新增 </ElButton>
      <!-- <ElButton type="primary" @click="handleToDetail()"> 导入 </ElButton> -->
    </template>
    <Grid>
      <template #action="{ row }">
        <ElButton
          type="primary"
          v-if="row.status == 1"
          link
          @click="handleSendRow(row)"
        >
          寄出
        </ElButton>
      </template>
    </Grid>

    <Drawer @onUpdated="handleUpdate" />
    <Modal title="提示">
      <template #default>
        <div class="">
          <h3>是否确认寄出？</h3>
          <ElForm class="mt-5" :model="form" ref="tranForm">
            <el-form-item
              label="运输单号"
              prop="transfer_no"
              :rules="transfer_no"
            >
              <ElInput placeholder="请输入" v-model="form.transfer_no" />
            </el-form-item>
          </ElForm>
        </div>
      </template>
      <template #footer>
        <ElButton type="primary" @click="modalApi.close">取消</ElButton>
        <ElButton type="primary" @click="handleSendConfirm">确定</ElButton>
      </template>
    </Modal>
  </Page>
</template>
