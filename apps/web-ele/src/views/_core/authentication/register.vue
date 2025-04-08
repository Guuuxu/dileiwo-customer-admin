<script lang="ts" setup>
import type { VbenFormSchema } from '@vben/common-ui';
import type { Recordable } from '@vben/types';
import { useRouter } from 'vue-router';
import { useAppConfig } from '@vben/hooks';
import { computed, h, ref } from 'vue';
const { apiURL } = useAppConfig(import.meta.env, import.meta.env.PROD);
import { ElButton, ElMessage, ElIcon, ElUpload } from 'element-plus';
import { Plus } from '@vben/icons';
import { AuthenticationRegister, z } from '@vben/common-ui';
import { handleRegister } from '#/api';
import { $t } from '@vben/locales';
const router = useRouter();
defineOptions({ name: 'Register' });

const loading = ref(false);
const CODE_LENGTH = 6;
const formSchema = computed((): VbenFormSchema[] => {
  return [
    {
      component: 'Select',
      fieldName: 'type',
      label: '注册类型',
      componentProps: {
        options: [
          { label: '租赁/购买方', value: 1 },
          { label: '中转使用方', value: 2 },
        ],
      },
      rules: 'required',
    },
    {
      component: 'Divider',
      fieldName: '_divider',
      formItemClass: 'col-span-1',
      hideLabel: true,
      renderComponentContent: () => {
        return {
          default: () => h('div', '商户认证信息填写'),
        };
      },
    },
    {
      component: 'Input',
      fieldName: 'name',
      label: '企业名称',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'code',
      label: '企业注册号',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'img',
      label: '上传登记证（正面）',
    },
    {
      component: 'Input',
      componentProps: {},
      fieldName: 'law_person',
      label: '法人名',
      rules: z.string().min(1, { message: $t('authentication.usernameTip') }),
    },
    {
      component: 'Input',
      fieldName: 'law_phone',
      label: '手机号',
      rules: 'required',
    },
    {
      component: 'VbenPinInput',
      componentProps: {
        codeLength: CODE_LENGTH,
        createText: (countdown: number) => {
          const text =
            countdown > 0
              ? $t('authentication.sendText', [countdown])
              : $t('authentication.sendCode');
          return text;
        },
        handleSendCode: async () => {
          // 模拟发送验证码
          // Simulate sending verification code
          loading.value = true;
          if (!BaseFormApi) {
            loading.value = false;
            throw new Error('formApi is not ready');
          }
          await BaseFormApi.validateField('phoneNumber');
          const isPhoneReady = await BaseFormApi.isFieldValid('phoneNumber');
          if (!isPhoneReady) {
            loading.value = false;
            throw new Error('Phone number is not Ready');
          }
          const { phoneNumber } = await BaseFormApi.getValues();
          // await sendCodeApi(phoneNumber);
          loading.value = false;
        },
        placeholder: $t('authentication.code'),
      },
      fieldName: 'law_code',
      label: $t('authentication.code'),
      rules: z.string().length(CODE_LENGTH, {
        message: $t('authentication.codeTip', [CODE_LENGTH]),
      }),
    },
    {
      component: 'Divider',
      fieldName: '_divider',
      formItemClass: 'col-span-1',
      hideLabel: true,
      renderComponentContent: () => {
        return {
          default: () => h('div', '系统管理员信息填写'),
        };
      },
    },
    {
      component: 'Input',
      componentProps: {},
      fieldName: 'admin_person',
      label: '管理员姓名',
      rules: z.string().min(1, { message: $t('authentication.usernameTip') }),
    },
    {
      component: 'Input',
      fieldName: 'admin_phone',
      label: '手机号',
    },
    {
      component: 'VbenPinInput',
      componentProps: {
        codeLength: CODE_LENGTH,
        createText: (countdown: number) => {
          const text =
            countdown > 0
              ? $t('authentication.sendText', [countdown])
              : $t('authentication.sendCode');
          return text;
        },
        handleSendCode: async () => {
          // 模拟发送验证码
          // Simulate sending verification code
          loading.value = true;
          if (!BaseFormApi) {
            loading.value = false;
            throw new Error('formApi is not ready');
          }
          await BaseFormApi.validateField('phoneNumber');
          const isPhoneReady = await BaseFormApi.isFieldValid('phoneNumber');
          if (!isPhoneReady) {
            loading.value = false;
            throw new Error('Phone number is not Ready');
          }
          const { phoneNumber } = await BaseFormApi.getValues();
          // await sendCodeApi(phoneNumber);
          loading.value = false;
        },
        placeholder: $t('authentication.code'),
      },
      fieldName: 'admin_code',
      label: $t('authentication.code'),
      rules: z.string().length(CODE_LENGTH, {
        message: $t('authentication.codeTip', [CODE_LENGTH]),
      }),
    },
    {
      component: 'Divider',
      fieldName: '_divider',
      formItemClass: 'col-span-1',
      hideLabel: true,
      renderComponentContent: () => {
        return {
          default: () => h('div', '收货人信息填写'),
        };
      },
    },
    {
      component: 'Input',
      componentProps: {},
      fieldName: 'receive_person',
      label: '收货人姓名',
      rules: z.string().min(1, { message: $t('authentication.usernameTip') }),
    },
    {
      component: 'Input',
      fieldName: 'receive_phone',
      label: '手机号',
    },
    {
      component: 'Input',
      fieldName: 'receive_address',
      label: '地址',
    },
    // {
    //   component: 'VbenCheckbox',
    //   fieldName: 'agreePolicy',
    //   renderComponentContent: () => ({
    //     default: () =>
    //       h('span', [
    //         $t('authentication.agree'),
    //         h(
    //           'a',
    //           {
    //             class: 'vben-link ml-1 ',
    //             href: '',
    //           },
    //           `${$t('authentication.privacyPolicy')} & ${$t('authentication.terms')}`,
    //         ),
    //       ]),
    //   }),
    //   rules: z.boolean().refine((value) => !!value, {
    //     message: $t('authentication.agreeTip'),
    //   }),
    // },
  ];
});
import { useVbenForm } from '#/adapter/form';
const [BaseForm, BaseFormApi] = useVbenForm({
  schema: formSchema.value,
  showDefaultActions: false,
});

const handleAvatarSuccess = (response: any) => {
  ElMessage.success('上传成功');
};
const handleAvatarError = (error: any) => {
  ElMessage.error('上传失败');
};
async function handleSubmit(value: Recordable<any>) {
  const values = await BaseFormApi.getValues();
  console.log('BaseFormApi:', BaseFormApi);
  console.log('register submit:', values);
  handleRegister(values).then((res: any) => {
    ElMessage.success('注册成功');
    router.replace('/');
  });
}
const goToLogin = () => {
  router.push('/auth/code-login');
};
</script>

<template>
  <div class="reg-wrap h-full w-full">
    <BaseForm>
      <template #default="{ form, formProps }">
        <ElButton
          type="primary"
          class="reg-title text-center text-3xl font-bold"
          @click="handleSubmit"
        >
          注册
        </ElButton>
      </template>
      <template #img="{ field }">
        <div class="flex flex-col items-center">
          <!-- <img
            class="mb-2 h-16 w-16 rounded-full"
            :src="field.value"
            alt="Avatar"
          /> -->
          <ElUpload
            class="avatar-uploader"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :on-error="handleAvatarError"
            :before-upload="(file: File) => {
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
            }"
            
            :action="apiURL + '/web/upload'"
          >
            <img v-if="field.value" :src="field.value" class="avatar" />
            <ElIcon v-else class="avatar-uploader-icon"><Plus /></ElIcon>
            <!-- <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon> -->
          </ElUpload>
        </div>
      </template>
    </BaseForm>
    <div class="mt-4 text-center text-sm">
      {{ $t('authentication.alreadyHaveAccount') }}
      <span class="vben-link text-sm font-normal" @click="goToLogin()">
        {{ $t('authentication.goToLogin') }}
      </span>
    </div>
  </div>
</template>
<style scoped>
::v-deep .avatar {
  width: 140px;
  height: 140px;
  object-fit: cover;
  border-radius: 10px;
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
