<script lang="ts" setup>
import type { VbenFormSchema } from '@vben/common-ui';
import type { Recordable } from '@vben/types';
import { useRouter } from 'vue-router';
import { computed, ref } from 'vue';

import { AuthenticationCodeLogin, z } from '@vben/common-ui';
import { useAuthStore } from '#/store';
import { sendSmsApi } from '#/api';
import { $t } from '@vben/locales';
import { ElMessage, ElButton } from 'element-plus';

defineOptions({ name: 'CodeLogin' });
const authStore = useAuthStore();
const router = useRouter();

const loading = ref(false);
const CODE_LENGTH = 6;

const formSchema = computed((): VbenFormSchema[] => {
  return [
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: $t('authentication.mobile'),
      },
      fieldName: 'phone',
      label: $t('authentication.mobile'),
      defaultValue: '13800000000',
      rules: z
        .string()
        .min(1, { message: $t('authentication.mobileTip') })
        .refine((v) => /^\d{11}$/.test(v), {
          message: $t('authentication.mobileErrortip'),
        }),
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
          const phone = formSchema.value.find((item) => item.fieldName === 'phone')?.defaultValue;
          console.log('Current phone number:', phone);
          try {
            await sendSmsApi(phone)
            ElMessage.success('已发送');
            loading.value = false;
          }catch (error) {
            loading.value = false;
            console.error('Error sending verification code:', error);
          }
        },
        defaultValue: '123456',
        placeholder: $t('authentication.code'),
      },
      fieldName: 'code',
      label: $t('authentication.code'),
      rules: z.string().length(CODE_LENGTH, {
        message: $t('authentication.codeTip', [CODE_LENGTH]),
      }),
    },
  ];
});
/**
 * 异步处理登录操作
 * Asynchronously handle the login process
 * @param values 登录表单数据
 */
async function handleLogin(values: Recordable<any>) {
  // eslint-disable-next-line no-console
  console.log(values);

}
const goReg = ()=>{
  router.push('/auth/register');
}
</script>

<template>
  <AuthenticationCodeLogin
    :form-schema="formSchema"
    :loading="authStore.loginLoading"
    @submit="authStore.authLogin"
  />
  <div  class="w-full mt-3 text-right" type="primary" @click="goReg()">
    新商户注册
  </div>
</template>
