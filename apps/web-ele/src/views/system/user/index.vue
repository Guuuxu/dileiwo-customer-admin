<template>
  <Page auto-content-height :title="$t(router.currentRoute.value.meta.title)">
    <ElCard auto-content-height>
      <template #default>
        <Form>
          <template #img="{ field }">
            <div class="flex flex-col items-center">
              <div class="h-16 w-16 bg-gray-200">
                <img
                  v-if="userInfo.img"
                  class="mb-2 h-16 w-16 rounded-full"
                  :src="userInfo.img"
                  alt="Avatar"
                />
              </div>

              <!-- <ElUpload
                class="avatar-uploader"
                :show-file-list="false"
                :action="apiURL + '/web/upload'"
                :on-success="handleAvatarSuccess"
                :on-error="handleAvatarError"
              >
                <img v-if="field.value" :src="field.value" class="avatar" />
                <ElIcon v-else class="avatar-uploader-icon"><Plus /></ElIcon> -->
              <!-- <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon> -->
              <!-- </ElUpload> -->
            </div>
          </template>
        </Form>
      </template>
      <template #footer>
        <div class="flex justify-end">
          <VbenButton type="primary" @click="handleEdit()"> 修改 </VbenButton>
        </div>
      </template>
    </ElCard>
    <FormDrawer @onUpdated="handleUpdate" />
  </Page>
</template>
<script lang="ts" setup>
import { ref, onMounted, h } from 'vue';
import { useRouter } from 'vue-router';
import { useAppConfig } from '@vben/hooks';
const { apiURL } = useAppConfig(import.meta.env, import.meta.env.PROD);

import { getAccountInfoApi } from '#/api';
import { Page, useVbenDrawer, VbenButton } from '@vben/common-ui';

import { Plus } from '@vben/icons';
import Edit from './edit.vue';
const [FormDrawer, formDrawerApi] = useVbenDrawer({
  connectedComponent: Edit,
});

import { ElButton, ElCard, ElMessage, ElUpload, ElIcon } from 'element-plus';

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
  wrapperClass: 'grid-cols-1 md:grid-cols-3',
  handleSubmit: (values) => {
    ElMessage.success(`表单数据：${JSON.stringify(values)}`);
  },
  schema: [
    {
      component: 'Upload',
      fieldName: 'img',
      label: '企业图示',
      formItemClass: 'row-span-2',
      componentProps: {},
    },
    {
      component: 'Span',
      fieldName: 'name',
      label: '企业名称',
      componentProps: {},
    },
    {
      component: 'Span',
      fieldName: 'code',
      label: '企业注册号',
    },
    {
      component: 'Span',
      fieldName: 'law_person',
      label: '法人',
      componentProps: {},
    },
    {
      component: 'Span',
      fieldName: 'phone',
      label: '手机号',
    },
    {
      component: 'Divider',
      fieldName: '_divider',
      formItemClass: 'col-span-3',
      hideLabel: true,
      renderComponentContent: () => {
        return {
          default: () => h('div', '包装回收信息'),
        };
      },
    },
    {
      component: 'Span',
      fieldName: 'receive_person',
      label: '收货人',
    },
    {
      component: 'Span',
      fieldName: 'receive_phone',
      label: '手机号',
    },
    {
      component: 'Span',
      fieldName: 'receive_address',
      label: '收货地址',
    },
  ],
});
const userInfo = ref({});
const init = () => {
  getAccountInfoApi().then((res: any) => {
    console.log(res);
    userInfo.value = res;
    formApi.setValues(userInfo.value);
  });
};

// 编辑
function handleEdit() {
  handleSetData(userInfo.value);
}

const handleSetData = (row: any) => {
  formDrawerApi
    .setData({
      values: { ...row },
    })
    .open();
};
const handleUpdate = () => {
  init();
};

onMounted(() => {
  init();
});
</script>
<style lang="scss" scoped>
.avatar-uploader .avatar {
  display: block;
  width: 178px;
  height: 178px;
}
</style>
<style>
.avatar-uploader .el-upload {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.avatar-uploader-icon {
  width: 178px;
  height: 178px;
  font-size: 28px;
  color: #8c939d;
  text-align: center;
}
</style>
