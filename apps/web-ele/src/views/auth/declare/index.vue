<script lang="ts" setup>
import { useAppConfig } from '@vben/hooks';
const { apiURL } = useAppConfig(import.meta.env, import.meta.env.PROD);

import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { Page, useVbenDrawer, VbenButton } from '@vben/common-ui';
import { z } from '#/adapter/form';
import { ElButton, ElCard, ElMessage, ElTag } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { updateRepair } from '#/api';
import { $t } from '#/locales';
import { scanRepair } from '#/api';

const router = useRouter();
const main_img = ref('');
const first_img = ref('');
const second_img = ref('');

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
  wrapperClass: 'grid-cols-2',

  handleSubmit: (values) => {
    ElMessage.success(`表单数据：${JSON.stringify(values)}`);
  },
  schema: [
    {
      component: 'Input',
      fieldName: 'code',
      label: '维修品包装编码',
      formItemClass: 'col-span-1',
      labelWidth: 150,
      componentProps: {
        placeholder: '请输入维修品包装编码',
        onKeyup(e: KeyboardEvent) {
          if (e.key === 'Enter') {
            // 如果按下回车键，调用 handleEnterInput 函数
            handleEnterInput();
          }
        },
      },
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'reason',
      formItemClass: 'col-span-2',
      label: '瑕疵原因',
      labelWidth: 150,
      componentProps: {
        type: 'textarea',
        rows: 4,
      },
      rules: 'required',
    },
    {
      component: 'Upload',
      componentProps: {
        placeholder: '请上传文件',
        class: 'avatar-uploader',
        action: apiURL + '/web/upload',
        accept: 'image/*',
        name: 'file',
        
        fit:'cover',
        listType: 'picture-card',
        showUploadList: false,
        beforeUpload: (file: File) => {
          console.log(file);
          const isJPG = file.type === 'image/jpeg';
          const isPNG = file.type === 'image/png';
          const isGIF = file.type === 'image/gif';

          if (!isJPG && !isPNG && !isGIF) {
            ElMessage.error({
              message: $t('ui.formRules.fileTypeError'),
            });
          }
          return isJPG || isPNG || isGIF;
        },
        onSuccess: (res: any, file: File) => {
          console.log(res, file);
          if (res.code === 200) {
            main_img.value = res.data.url;
          } 
        },
      },
      fieldName: 'main_img',
      label: '包装整体含编码图',
      labelWidth: 150,
      formItemClass: 'col-span-2',

      renderComponentContent: () => {
        return {
          default: () => '+',
        };
      },
    },
    {
      component: 'Upload',
      componentProps: {
        placeholder: '请上传文件',
        class: 'avatar-uploader',
        action: apiURL + '/web/upload',
        accept: 'image/*',
        name: 'file',
        
        fit:'cover',
        listType: 'picture-card',
        showUploadList: false,
        beforeUpload: (file: File) => {
          console.log(file);
          const isJPG = file.type === 'image/jpeg';
          const isPNG = file.type === 'image/png';
          const isGIF = file.type === 'image/gif';

          if (!isJPG && !isPNG && !isGIF) {
            ElMessage.error({
              message: $t('ui.formRules.fileTypeError'),
            });
          }
          return isJPG || isPNG || isGIF;
        },
        onSuccess: (res: any, file: File) => {
          console.log(res, file);
          if (res.code === 200) {
            first_img.value = res.data.url;
          } else {
            ElMessage.error({
              message: $t('ui.formRules.fileUploadError'),
            });
          }
        },
      },
      fieldName: 'first_img',
      label: '包装瑕疵细部图',
      labelWidth: 150,
      formItemClass: 'col-span-2',

      renderComponentContent: () => {
        return {
          default: () => '+',
        };
      },
    },
    {
      component: 'Upload',
      componentProps: {
        placeholder: '请上传文件',
        class: 'avatar-uploader',
        action: apiURL + '/web/upload',
        accept: 'image/*',
        name: 'file',
        
        fit:'cover',
        listType: 'picture-card',
        showUploadList: false,
        beforeUpload: (file: File) => {
          console.log(file);
          const isJPG = file.type === 'image/jpeg';
          const isPNG = file.type === 'image/png';
          const isGIF = file.type === 'image/gif';

          if (!isJPG && !isPNG && !isGIF) {
            ElMessage.error({
              message: $t('ui.formRules.fileTypeError'),
            });
          }
          return isJPG || isPNG || isGIF;
        },
        onSuccess: (res: any, file: File) => {
          console.log(res, file);
          if (res.code === 200) {
            second_img.value = res.data.url;
          } else {
            ElMessage.error({
              message: $t('ui.formRules.fileUploadError'),
            });
          }
        },
      },
      fieldName: 'second_img',
      label: '包装瑕疵细部图2',
      labelWidth: 150,
      formItemClass: 'col-span-2',

      renderComponentContent: () => {
        return {
          default: () => '+',
        };
      },
    },
  ],
});

const detail = ref({});
// 输入确认
const handleEnterInput = async () => {
  const formValues = await formApi.getValues();
  const res = await scanRepair({ detail_no: formValues.code });
  console.log('res', res);
  detail.value = res;
  ElMessage.success('操作完成！');
};

const handleSubmit = async () => {
  const { valid } = await formApi.validate();
  if (valid) {
    const values = await formApi.getValues();
    console.log('values', values);
    if (!detail.value.id) {
      ElMessage.error('请先扫描维修品包装编码');
      return;
    }
    await updateRepair({
      first_img: first_img.value,
      main_img: main_img.value,
      second_img: second_img.value,
      broken_reason: [0],
      model_detail_id: detail.value.id,
    }).then((res) => {
      console.log('res', res);
      ElMessage.success('提交成功');
      formApi.resetForm();
    });
  }
};
</script>
<template>
  <Page auto-content-height :title="$t(router.currentRoute.value.meta.title)">
    <ElCard>
      <h3 class="mb-2 text-[red]">请留意，疑品为初始认证后7日内申报有效！</h3>
      <Form></Form>
      <template #footer>
        <div class="text-right">
          <VbenButton @click="handleSubmit">完成</VbenButton>
        </div>
      </template>
    </ElCard>
  </Page>
</template>
