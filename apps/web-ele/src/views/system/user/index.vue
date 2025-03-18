<template>
  <Page auto-content-height :title="$t(router.currentRoute.value.meta.title)">
    <ElCard auto-content-height>
      <template #default>
        <Form>
          <template #enterpriseLogo="{field}">
            <div class="flex flex-col items-center">
              <!-- <img class="w-16 h-16 rounded-full mb-2" :src="userInfo.avatar" alt="Avatar"> -->
              <ElUpload
                class="avatar-uploader"
                :show-file-list="false"
                action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                :on-success="handleAvatarSuccess"
                :on-error="handleAvatarError"
              >
              <img v-if="field.value" :src="field.value" class="avatar" />
              <ElIcon v-else class="avatar-uploader-icon"><Plus /></ElIcon>
                <!-- <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon> -->
              </ElUpload>
            </div>
            </template>
        </Form>
        
      </template>
      <template #footer>
        <div class="flex justify-end">
          <VbenButton type="primary" @click="handleEdit()">
          修改
        </VbenButton>
        </div>
      </template>
    </ElCard>
    <FormDrawer />
  </Page>
</template>
<script lang="ts" setup>
import { ref, onMounted, h } from 'vue';
import { useRouter } from 'vue-router';
import type { VxeGridProps } from '#/adapter/vxe-table';
import { useVbenVxeGrid } from '#/adapter/vxe-table';

import { Page, useVbenDrawer, VbenButton } from '@vben/common-ui';

import { Plus } from '@vben/icons';
import Edit from './edit.vue';
const [FormDrawer, formDrawerApi] = useVbenDrawer({
  connectedComponent: Edit,
});


import {
  ElButton,
  ElCard,
  ElMessage,
  ElUpload,
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
  wrapperClass: 'grid-cols-1 md:grid-cols-3',
  handleSubmit: (values) => {
    ElMessage.success(`表单数据：${JSON.stringify(values)}`);
  },
  schema: [
    {
      component: 'Upload',
      fieldName: 'enterpriseLogo',
      label: '企业图示',
      formItemClass: 'row-span-2',
      componentProps: {
      },
    },
    {
      component: 'Input',
      fieldName: 'name',
      label: '企业名称',
      componentProps: {
      },
    },
    {
      component: 'Input',
      fieldName: 'regNo',
      label: '企业注册号',
    },
    {
      component: 'Input',
      fieldName: 'legalPerson',
      label: '法人',
      componentProps: {
        
      }
    },
    {
      component: 'Input',
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
      component: 'Input',
      fieldName: 'receivePerson',
      label: '收货人',
    },
    {
      component: 'Input',
      fieldName: 'receivePhone',
      label: '手机号',
    },
    {
      component: 'Input',
      fieldName: 'receiveAddress',
      label: '收货地址',
    },
  ],
});
const userInfo = ref({
  name: '张三',
  legalPerson: '刀疤',
  address: '北京市海淀区',
  phone: '13888888888',
  email: 'zhangsan@example.com',
  gender: '男',
  birthday: '2000-01-01',
  receivePerson: '李四',
  receiveAddress: '北京市朝阳区',
  receivePhone: '13999999999',
  enterpriseLogo: 'https://avatars.githubusercontent.com/u/95928385',
})
formApi.setValues(userInfo.value);


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
const handleAvatarSuccess = (response: any) => {
  ElMessage.success('上传成功');
};
const handleAvatarError = (error: any) => {
  ElMessage.error('上传失败');
}
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
