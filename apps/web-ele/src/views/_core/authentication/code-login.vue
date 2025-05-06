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
import { countryCodeOptions } from '#/views/dict';

defineOptions({ name: 'CodeLogin' });
const authStore = useAuthStore();
const router = useRouter();

const loading = ref(false);
const CODE_LENGTH = 6;
// 定义国际编码选项
const countryCodes = ref(countryCodeOptions);
// 默认选中的国际编码
const selectedCountryCode = ref(countryCodes.value?.[0]?.value || '');
// 定义表单引用
const form = ref<InstanceType<typeof AuthenticationCodeLogin>>();
const formSchema = computed((): VbenFormSchema[] => {
  return [
    {
      component: 'VbenSelect',
      componentProps: {
        options: countryCodes.value,
      },
      fieldName: 'countryCode',
      label: '国际编码',
      defaultValue: selectedCountryCode.value,
    },
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: $t('authentication.mobile'),
      },
      fieldName: 'phone',
      label: $t('authentication.mobile'),
      defaultValue: '',
      rules: z
        .string()
        .min(1, { message: $t('authentication.mobileTip') })
        // 根据不同国际编码调整正则表达式，这里以中国为例
        .refine(
          async (v) => {
            const values = await getFormValues();
            console.log('Current phone number:', values);
            const currentCountryCode = countryCodes.value.find(
              (item) => item.value === values?.countryCode,
            );
            console.log('currentCountryCode', currentCountryCode);
            if (currentCountryCode) {
              return currentCountryCode.regex.test(v);
            }
            return false;
          },
          {
            message: $t('authentication.mobileErrortip'),
          },
        ),
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
          const values = await getFormValues();
          const phone = values?.phone;
          // 验证手机号是否填写且格式正确
          if (form.value) {
            const formApi = form.value.getFormApi();
            const values = await formApi.getValues();
            await formApi.validateField('phone');
            const isPhoneReady = await formApi.isFieldValid('phone');
            if (!isPhoneReady) {
              loading.value = false;
              throw new Error('Phone number is not Ready');
            }
            try {
              await sendSmsApi(phone, values?.countryCode);
              ElMessage.success('已发送');
              loading.value = false;
            } catch (error) {
              loading.value = false;
              console.error('Error sending verification code:', error);
            }
          }
        },
        defaultValue: '',
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

// 定义获取表单值的方法
async function getFormValues() {
  if (form.value) {
    const formApi = form.value.getFormApi();
    const values = await formApi.getValues();
    console.log('Form values:', values);
    return values;
  }
  return null;
}
const goReg = () => {
  router.push('/auth/register');
};
</script>

<template>
  <div>
    <AuthenticationCodeLogin
      ref="form"
      :form-schema="formSchema"
      :loading="authStore.loginLoading"
      @submit="authStore.authLogin"
    />
    <div class="mt-3 w-full text-right" type="primary" @click="goReg()">
      新商户注册
    </div>
  </div>
</template>
