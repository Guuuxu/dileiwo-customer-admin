<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useVbenDrawer, VbenButton } from '@vben/common-ui';

import { ElInput,ElMessage } from 'element-plus';
import { useVbenForm } from '#/adapter/form';
import {addAdminUserApi} from '#/api'
// 定义自定义事件
const emits = defineEmits(['onUpdated']);
defineOptions({
  name: 'FormDrawer',
});

const [BaseForm, BaseFormApi] = useVbenForm({
  schema: useSchema(),
  showDefaultActions: false,
});

import { useSchema } from './data';
const id = ref('')
const [Drawer, drawerApi] = useVbenDrawer({
  onCancel() {
    drawerApi.close();
  },
  onConfirm: async () => {
    const {valid} = await BaseFormApi.validate();
    if (!valid) {
      return;
    }
    const params = await BaseFormApi.getValues();
    params.id = id.value;
    console.log('25', params);
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
    }
  },
  title: '详情',
});
const handleSend = ()=>{
  console.log('40', '发送');
}
</script>
<template>
  <Drawer>
    <BaseForm>
      
      <template #phone="slotProps">
            <ElInput v-bind="slotProps">
              <template #append>
                <span class="cursor-pointer" @click="handleSend">发送</span>

      </template>
            </ElInput>
            
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
  line-height: 25px;
}

::v-deep {
  .vxe-grid {
    padding: 0;
  }

  .avatar-uploader {
    .el-upload--picture-card {
      width: 80px;
      height: 80px;
    }
  }
}
</style>
