<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useVbenDrawer, VbenButton } from '@vben/common-ui';

import { ElInput } from 'element-plus';
import { useVbenForm } from '#/adapter/form';

defineOptions({
  name: 'FormDrawer',
});

const [BaseForm, BaseFormApi] = useVbenForm({
  schema: useSchema(),
  showDefaultActions: false,
});

import { useSchema } from './data';

const [Drawer, drawerApi] = useVbenDrawer({
  onCancel() {
    drawerApi.close();
  },
  onConfirm: async () => {
    const values = await BaseFormApi.getValues();
    console.log('25', values);
    await BaseFormApi.submitForm();
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
const handleSend = ()=>{

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
