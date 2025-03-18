import type { VbenFormSchema } from '#/adapter/form';
import { yesOrNoOption } from '#/views/dict' 

/**
 * 获取编辑表单的字段配置。如果没有使用多语言，可以直接export一个数组常量
 */
export function useSchema(): VbenFormSchema[] {
  return [
    {
      component: 'RadioGroup',
      componentProps: {
        placeholder: '请输入',
        options: yesOrNoOption,
      },
      fieldName: 'packageNum',
      label: '请核对包装数量是否正确',
      labelWidth: 170,
      rules: 'required'
    },
    {
      component: 'RadioGroup',
      componentProps: {
        placeholder: '请输入',
        options: yesOrNoOption,
      },
      fieldName: 'packageType',
      label: '请核对包装型号是否正确',
      labelWidth: 170,
      rules: 'required'
    },
    {
      component: 'RadioGroup',
      componentProps: {
        placeholder: '请输入',
        options: yesOrNoOption,
      },
      fieldName: 'isUndefined',
      label: '请核对是否有疑品包装',
      labelWidth: 170,
      rules: 'required'
    },
  ];
}

// 输入确认
const handleEnterInput = (val: string) => {
  console.log('handleEnterInput', '确认了');
};
export function useSchemaScan(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
        onKeyup(e: any) {
          if (e.key === 'Enter') {
            handleEnterInput((e.target as HTMLInputElement).value);
          }
        },
      },
      fieldName: 'category',
      label: '请扫描损坏品包装编码',
      labelWidth: 150, // 设置label宽度
      rules: 'required',
    },
  ];
}

/**
 * 获取表格列配置
 * @description 使用函数的形式返回列数据而不是直接export一个Array常量，是为了响应语言切换时重新翻译表头
 * @param onActionClick 表格操作按钮点击事件
 */
