<script lang="ts" setup>
import { ref, onMounted, h } from 'vue';
import { useVbenDrawer, VbenButton } from '@vben/common-ui';

import { ElButton, ElMessage } from 'element-plus';
import { useVbenForm } from '#/adapter/form';
import {updateDelivery,scanOutboundBarcode,sendPhoneMessage } from '#/api';

defineOptions({
  name: 'FormDrawer',
});
const row = ref({})
const step = ref('0');
const [BaseForm, BaseFormApi] = useVbenForm({
  schema: useSchema(),
  showDefaultActions: false,
});
const [BaseForm2, BaseFormApi2] = useVbenForm({
  schema: [
  {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
        onKeyup(e: any) {
          console.log(e);
          if (e.key === 'Enter') {
            handleEnterInput();
          }
        },
      },
      fieldName: 'code',
      label: '请扫描包装编码',
      suffix: () => h('span', { class: 'text-[12px]'}, '点击发送移转⼿机APP端扫码'),
      renderComponentContent: () => ({
      append: () => h(ElButton, { 
          class: 'text-[12px]', 
          onClick: () => {
            console.log('Append 被点击');
            // 可以根据需要调用相应的处理函数
            sendPhoneMessage(boundData.value.id).then((res)=>{
              console.log(res);
              ElMessage.success('操作成功');
            })
          } 
        }, '发送'),
      }),
    },
  ],
  layout: 'vertical',
  showDefaultActions: false,
});

// 定义自定义事件
const emits = defineEmits(['onUpdated']);
import { useSchema } from './data';
const id = ref('')
const boundData = ref({})
const [Drawer, drawerApi] = useVbenDrawer({
  confirmText: '下一步',
  onCancel() {
    drawerApi.close();
  },
  onConfirm: async () => {
    console.log(step.value)
    if (step.value == '0') {
      const {valid} = await BaseFormApi.validate();

      if(valid){
      const params = await BaseFormApi.getValues();
        params.id = id.value;
        console.log(params);
        const res = await updateDelivery(params);
        boundData.value = res;
        ElMessage.success('操作成功');        
        step.value = '1';
        drawerApi.setState({ confirmText: '完成' }); // 更新 drawer 的状态

      }
      
    } else {
      console.log(step.value)
      BaseFormApi.resetForm();
      BaseFormApi2.resetForm();
      step.value = '0';
      emits('onUpdated');
      drawerApi.close();
    }
    
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const { values } = drawerApi.getData<Record<string, any>>();
      if (values) {
        id.value = values.id;
        row.value = values
        BaseFormApi.setValues({
          ...values,
        });
      }
    }else{
      step.value = '0';
      BaseFormApi.resetForm();
      BaseFormApi2.resetForm();
    }
  },
  title: '详情',
});
// 输入确认
const handleEnterInput = async () => {
  const formValues = await BaseFormApi2.getValues()
  console.log('handleEnterInput',formValues );


  const res = await scanOutboundBarcode(boundData.value.id,formValues.code)
    ElMessage.success('操作完成！')
    // 触发自定义事件通知父组件
    emits('onUpdated', params);
};
</script>
<template>
  <Drawer>
    <BaseForm v-if="step === '0'" >
      
    </BaseForm>
    <BaseForm2 v-if="step === '1'" />
    
  </Drawer>
</template>
<style lang="scss" scoped>
.grid-content {
  width: 116px;
  height: 116px;
}

.player-card {
  font-size: 14px;
  line-height: 25px;
}

::v-deep .vxe-grid {
  padding: 0;
}
</style>
