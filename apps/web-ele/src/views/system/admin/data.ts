import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';
import { ElMessage } from 'element-plus';
import type { VbenFormSchema } from '#/adapter/form';
import { globalShareState,z } from '@vben/common-ui';



/**
 * 获取编辑表单的字段配置。如果没有使用多语言，可以直接export一个数组常量
 */
export function useSchema(): VbenFormSchema[] {
  return [
    
  ];
}

/**
 * 获取表格列配置
 * @description 使用函数的形式返回列数据而不是直接export一个Array常量，是为了响应语言切换时重新翻译表头
 * @param onActionClick 表格操作按钮点击事件
 */
