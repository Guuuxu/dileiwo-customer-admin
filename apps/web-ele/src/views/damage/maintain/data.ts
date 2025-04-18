import type { VbenFormSchema } from '#/adapter/form';
import { ref } from 'vue';
import { useAppConfig } from '@vben/hooks';
const { apiURL } = useAppConfig(import.meta.env, import.meta.env.PROD);

import { damageReasons } from '#/views/dict';
import { $t } from '#/locales';
import { ElMessage } from 'element-plus';

/**
 * 获取编辑表单的字段配置。如果没有使用多语言，可以直接export一个数组常量
 */
export function useSchema(): VbenFormSchema[] {
  return [];
}


export const mainImg = ref('');
export const firstImg = ref('');
export const secondImg = ref('');
/**
 * 获取编辑表单的字段配置。如果没有使用多语言，可以直接export一个数组常量
**/
export function useSchemaReason(): VbenFormSchema[] {
  return [
    {
      component: 'Select',
      formItemClass: 'pb-0',
      componentProps: {
        placeholder: '请选择',
        options: damageReasons,
        multiple: true,
        clearable: true,
      },
      fieldName: 'broken_reason',
      label: '请选择损坏原因',
      labelWidth: 150, // 设置label宽度
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'reason',

      componentProps: {
        type: 'textarea',
        rows: '3',
        placeholder: '请输入损坏情况',
      },
      label: '',
      dependencies: {
        if(values) {
          console.log(values.broken_reason);
          return values.broken_reason && values.broken_reason.includes('7'); // 通过Dom控制销毁
        },
        // 只有指定的字段改变时，才会触发
        triggerFields: ['broken_reason'],
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
            mainImg.value = res.data.url;
          } 
        },
      },
      fieldName: 'main_img',
      label: '包装整体含编码图',
      labelWidth: 120, // 设置label宽度
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
            firstImg.value = res.data.url;
          }
        },
      },
      fieldName: 'first_img',
      labelWidth: 120, // 设置label宽度
      label: '包装瑕疵细部图',
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
            secondImg.value = res.data.url;
          }
        },
      },
      fieldName: 'second_img',
      labelWidth: 120, // 设置label宽度
      label: '包装瑕疵细部图2',
      renderComponentContent: () => {
        return {
          default: () => '+',
        };
      },
    },
  ];
}

/**
 * 获取表格列配置
 * @description 使用函数的形式返回列数据而不是直接export一个Array常量，是为了响应语言切换时重新翻译表头
 * @param onActionClick 表格操作按钮点击事件
 */
