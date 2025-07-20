<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useVbenDrawer, VbenButton, z } from '@vben/common-ui';

import { countryCodeOptions } from '#/views/dict';
import { $t } from '@vben/locales';
import { ElInput, ElMessage } from 'element-plus';
import { useVbenForm } from '#/adapter/form';
import { addAdminUserApi, sendSmsApi } from '#/api';
// 定义自定义事件
const emits = defineEmits(['onUpdated']);
defineOptions({
  name: 'FormDrawer',
});

const [BaseForm, BaseFormApi] = useVbenForm({
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'name',
      label: '姓名',
      rules: 'required',
    },
    {
      component: 'Select',
      componentProps: {
        placeholder: '请选择',
        options: [
          { label: '总管员', value: 0 },
          { label: '管理员', value: 1 },
          { label: '操作员', value: 2 },
        ],
      },
      fieldName: 'type',
      label: '角色',
      rules: 'required',
    },
    {
      component: 'VbenSelect',
      componentProps: {
        options: countryCodeOptions,
      },
      fieldName: 'countryCode',
      label: '国际编码',
      defaultValue: countryCodeOptions?.[0]?.value || '',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'phone',
      label: '手机号',
      rules: z
        .string()
        .min(1, { message: $t('authentication.mobileTip') })
        // 根据不同国际编码调整正则表达式，这里以中国为例
        .refine(
          async (v) => {
            const { countryCode } = await BaseFormApi.getValues();
            console.log('Current law_countryCode:', countryCode);
            const currentCountryCode = countryCodeOptions.find(
              (item) => item.value === countryCode,
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
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
        type: 'number',
      },
      fieldName: 'code',
      label: '验证码',
      rules: 'required',
    },
  ],
  showDefaultActions: false,
});

const id = ref('');
const loading = ref(false);
// 定义倒计时变量，初始值为 0
const countdown = ref(0);
// 定义定时器变量
let timer: NodeJS.Timeout | null = null;
const [Drawer, drawerApi] = useVbenDrawer({
  onCancel() {
    drawerApi.close();
  },
  onConfirm: async () => {
    const { valid } = await BaseFormApi.validate();
    if (!valid) {
      return;
    }
    const params = await BaseFormApi.getValues();
    params.id = id.value;
    await addAdminUserApi(params);
    ElMessage.success('操作成功');
    // 触发自定义事件通知父组件
    emits('onUpdated');
    drawerApi.close();
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const { values } = drawerApi.getData<Record<string, any>>();
      if (values) {
        id.value = values.id;
        BaseFormApi.setValues(values);
      }
    } else {
      if (timer) {
        countdown.value = 0;
        clearInterval(timer);
        timer = null;
      }
    }
  },
  title: '详情',
});
const handleSend = async () => {
  if (countdown.value > 0) return;
  const params = await BaseFormApi.getValues();
  console.log('40', params);
  await BaseFormApi.validateField('phone');
  const isPhoneReady = await BaseFormApi.isFieldValid('phone');
  if (!isPhoneReady) {
    loading.value = false;
    throw new Error('Phone number is not Ready');
  }
  try {
    loading.value = true;
    await sendSmsApi(params.phone, params.countryCode);
    ElMessage.success('已发送');
    // 设置倒计时时长，这里设为 60 秒
    countdown.value = 60;
    timer = setInterval(() => {
      countdown.value--;
      if (countdown.value <= 0) {
        clearInterval(timer!);
        timer = null;
      }
    }, 1000);
  } catch (error) {
    console.error('Error sending verification code:', error);
  } finally {
    loading.value = false;
  }
};
</script>
<template>
  <Drawer>
    <BaseForm class="admin-form">
      <template #phone="slotProps">
        <ElInput v-bind="slotProps">
          <template #append>
            <span
              class="cursor-pointer"
              @click="handleSend"
              :loading="loading"
              :disabled="countdown > 0"
            >
              {{ countdown > 0 ? `${countdown}s 后重试` : '发送' }}
            </span>
          </template>
        </ElInput>
      </template>
    </BaseForm>
  </Drawer>
</template>
<style lang="scss" scoped>
.admin-form {
  ::v-deep {
    .el-input-group__append {
      color: #fff;
      background-color: #409eff;
    }
  }
}
</style>
