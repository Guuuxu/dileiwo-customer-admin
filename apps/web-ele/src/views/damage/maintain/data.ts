import type { VbenFormSchema } from '#/adapter/form';

import { damageReasons } from '#/views/dict';

/**
 * 获取编辑表单的字段配置。如果没有使用多语言，可以直接export一个数组常量
 */
export function useSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'category',
      label: '请扫码损坏品包装编码',
      labelWidth: 150, // 设置label宽度
      rules: 'required',
    },
  ];
}

export function useSchemaReason(): VbenFormSchema[] {
  return [
    {
      component: 'Select',
      formItemClass: 'pb-0',
      componentProps: {
        placeholder: '请选择',
        options: damageReasons,
      },
      fieldName: 'reason',
      label: '请选择损坏原因',
      labelWidth: 150, // 设置label宽度
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'remark',

      componentProps: {
        type: 'textarea',
        rows: '3',
        placeholder: '请输入损坏情况',
      },
      label: '',
      dependencies: {
        if(values) {
          return values.reason == '7'; // 通过Dom控制销毁
        },
        // 只有指定的字段改变时，才会触发
        triggerFields: ['reason'],
      },
    },
  ];
}

/**
 * 获取表格列配置
 * @description 使用函数的形式返回列数据而不是直接export一个Array常量，是为了响应语言切换时重新翻译表头
 * @param onActionClick 表格操作按钮点击事件
 */
