<script lang="ts" setup>
import { ref, onMounted, h,useTemplateRef } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';

import { ElTabs, ElTabPane, ElUpload, ElRow, ElCol, ElImage,ElMessage,ElLoading } from 'element-plus';
import { useVbenForm } from '#/adapter/form';

import type { VxeGridProps } from '#/adapter/vxe-table';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
defineOptions({
  name: 'FormDrawer',
});
import { AuthenticationCodeLogin, z } from '@vben/common-ui';
import { $t } from '@vben/locales';
import { regionData } from '#/utils/index'
const loading = ref(false);
const CODE_LENGTH = 6;
const loginRef =
  useTemplateRef<InstanceType<typeof AuthenticationCodeLogin>>('loginRef');
function sendCodeApi(phoneNumber: string) {
  const loadingFull = ElLoading.service({
    fullscreen: true,
    text: '正在发送验证码',
    target:'sending-code',
    background: 'rgba(0, 0, 0, 0)',
    customClass: 'send-loading',
  })
  setTimeout(() => {
    loadingFull.close();
  }, 2000);
  return new Promise((resolve) => {
    setTimeout(() => {
      ElMessage.success({

        message: '验证码已发送',
        duration: 3,
        key: 'sending-code',
      });
      resolve({ code: '123456', phoneNumber });
    }, 3000);
  });
}
const [BaseForm, BaseFormApi] = useVbenForm({
  // 大屏一行显示3个，中屏一行显示2个，小屏一行显示1个
  wrapperClass: 'grid-cols-1',
  schema: [
    {
      component: 'Image',
      componentProps: {
        placeholder: '请输入',

        class: 'avatar',
        src: 'https://egclub.nyc3.digitaloceanspaces.com/production/users/avatars/Te5VsbCnuaXRzyRTnu5hKhln6yqtACHqYggVE64t.png', // Add the source URL for the image here
      },
      fieldName: 'enterpriseLogo',
      label: '用户头像',
    },

    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'phone',
      label: '法人手机号',
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
          await sendCodeApi(phoneNumber);
          loading.value = false;
        },
        placeholder: $t('authentication.code'),
      },
      fieldName: 'code',
      label: $t('authentication.code'),
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
      fieldName: 'receiveInfo',
      label: '收货人',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'recharge',
      label: '收货人姓名',
    },

    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'isRecommend',
      label: '手机号',
    },
    {
      component: 'Cascader',
      componentProps: {
        placeholder: '请选择省市区',
        options: regionData,
        class: 'w-full',
        props: {
          label:'name',
          value:'code',
          children:'children'
        }
      },
      fieldName: 'region',
      label: '省市区',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入详细地址',
        type: 'textarea',
        rows: 3,
      },
      fieldName: 'address',
      label: '',
    },
  ],
  showDefaultActions: false,
});

const [Drawer, drawerApi] = useVbenDrawer({
  onCancel() {
    drawerApi.close();
  },
  onConfirm: async () => {
    const values = await BaseFormApi.validate();
    drawerApi.close();
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const { values } = drawerApi.getData<Record<string, any>>();
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
};
const handleAvatarError = (err: any) => {
  console.log(err);
}

const srcList = [
  'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
];
</script>
<template>
  <Drawer>
    <BaseForm>
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

::v-deep{
    .el-loading-spinner{
      top: 20px;
    }
  }
</style>
