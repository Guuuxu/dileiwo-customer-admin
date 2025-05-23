<script lang="ts" setup>
import { ref, onMounted, h, useTemplateRef } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { useAppConfig } from '@vben/hooks';
const { apiURL } = useAppConfig(import.meta.env, import.meta.env.PROD);
import {
  ElUpload,
  ElRow,
  ElCol,
  ElImage,
  ElMessage,
  ElLoading,
  ElIcon,
} from 'element-plus';
import { Plus } from '@vben/icons';
import { useVbenForm } from '#/adapter/form';
import { countryCodeOptions } from '#/views/dict';
import { sendSmsApi, editClient } from '#/api';
defineOptions({
  name: 'FormDrawer',
});
import { AuthenticationCodeLogin, z } from '@vben/common-ui';
import { $t } from '@vben/locales';

const loading = ref(false);
const CODE_LENGTH = 6;
const loginRef =
  useTemplateRef<InstanceType<typeof AuthenticationCodeLogin>>('loginRef');

const [BaseForm, BaseFormApi] = useVbenForm({
  // 大屏一行显示3个，中屏一行显示2个，小屏一行显示1个
  wrapperClass: 'grid-cols-1',
  schema: [
    {
      component: 'Image',
      componentProps: {
        placeholder: '请输入',

        class: 'avatar',
      },
      fieldName: 'img',
      label: '企业图示',
    },
    {
      component: 'VbenSelect',
      componentProps: {
        options: countryCodeOptions,
      },
      fieldName: 'law_countryCode',
      label: '国际编码',
      defaultValue: countryCodeOptions?.[0]?.value || '',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'law_phone',
      label: '法人手机号',
      rules: z
        .string()
        .min(1, { message: $t('authentication.mobileTip') })
        // 根据不同国际编码调整正则表达式，这里以中国为例
        .refine(
          async (v) => {
            const { law_countryCode } = await BaseFormApi.getValues();
            console.log('Current law_countryCode:', law_countryCode);
            const currentCountryCode = countryCodeOptions.find(
              (item) => item.value === law_countryCode,
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
          console.log('模拟发送验证码');
          loading.value = true;
          if (!BaseFormApi) {
            loading.value = false;
            throw new Error('formApi is not ready');
          }
          const isPhoneReady = await BaseFormApi.isFieldValid('law_phone');
          console.log('isPhoneReady', isPhoneReady);
          if (!isPhoneReady) {
            loading.value = false;
            throw new Error('law_phone number is not Ready');
          }
          const { law_phone, law_countryCode } = await BaseFormApi.getValues();
          try {
            await sendSmsApi(law_phone, law_countryCode);
            ElMessage.success('已发送');
          } catch (error) {
            loading.value = false;
          }
          loading.value = false;
        },
        defaultValue: '',
        placeholder: $t('authentication.code'),
      },
      fieldName: 'law_code',
      label: $t('authentication.code'),
      defaultValue: '',
      rules: z.string().length(CODE_LENGTH, {
        message: $t('authentication.codeTip', [CODE_LENGTH]),
      }),
    },
    {
      component: 'Divider',
      fieldName: '_divider',
      hideLabel: true,
      renderComponentContent: () => {
        return {
          default: () => h('div', '收货信息修改'),
        };
      },
    },
    {
      component: 'Input',
      fieldName: 'receive_person',
      label: '收货人',
    },

    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'receive_phone',
      label: '手机号',
    },
    // {
    //   component: 'Cascader',
    //   componentProps: {
    //     placeholder: '请选择省市区',
    //     options: regionData,
    //     class: 'w-full',
    //     props: {
    //       label: 'name',
    //       value: 'code',
    //       children: 'children',
    //     },
    //   },
    //   fieldName: 'receive_address',
    //   label: '省市区',
    // },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'receive_address',
      label: '收货地址',
    },
  ],
  showDefaultActions: false,
});
// 定义自定义事件
const emits = defineEmits(['onUpdated']);
const [Drawer, drawerApi] = useVbenDrawer({
  onCancel() {
    drawerApi.close();
  },
  onConfirm: async () => {
    const values = await BaseFormApi.getValues();
    console.log('values', values);
    const { valid } = await BaseFormApi.validate();
    if (!valid) {
      return;
    }
    await editClient(values);
    emits('onUpdated');
    drawerApi.close();
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const { values } = drawerApi.getData<Record<string, any>>();
      console.log('values', values);
      if (values) {
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
const handleAvatarSuccess = (response: any, file: any) => {
  console.log(response, file);
  BaseFormApi.setValues({
    img: response.data.url,
  });
};
const handleAvatarError = (err: any) => {
  console.log(err);
};
</script>
<template>
  <Drawer>
    <BaseForm>
      <template #img="{ field }">
        <div class="flex flex-col items-center">
          <!-- <img class="w-16 h-16 rounded-full mb-2" :src="userInfo.avatar" alt="Avatar"> -->
          <ElUpload
            class="avatar-uploader"
            :show-file-list="false"
            :action="apiURL + '/web/upload'"
            :on-success="handleAvatarSuccess"
            :on-error="handleAvatarError"
          >
            <img v-if="field.value" :src="field.value" class="avatar" />
            <ElIcon v-else class="avatar-uploader-icon"><Plus /></ElIcon>
            <!-- <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon> -->
          </ElUpload>
        </div>
      </template>
    </BaseForm>
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
  width: 140px;
  height: 140px;
  object-fit: cover;
  border-radius: 10px;
}

::v-deep {
  .el-loading-spinner {
    top: 20px;
  }
}
</style>
