import { requestClient } from '#/api/request';

interface data {
  order_no: string;
}

export function getCustomerList(params: Record<string, any>) {
  return requestClient.get('/admin/client', {params});
}

export function getCustomerDetails(customerId: number) {
  return requestClient.get(`/admin/client/${customerId}`);
}

export function updateCustomer(data: any) {
  return requestClient.post('/admin/client/store', data);
}

/**
 * 删除指定客户的信息
 * @param {string} customerId - 要删除的客户的唯一标识符
 * @returns
 */ export function deleteCustomer(customerId: number) {
  return requestClient.post(`/admin/client/${customerId}/delete`);
}

/**
 * 获取客户的指标信息
 * @param {string} customerId - 客户的唯一标识符
 * @returns
 */
export function getCustomerMetrics(customerId: number | string) {
  return requestClient.get(`/admin/client/${customerId}/metric`);
}

/**
 * 导出客户数据
 * @data {object} data - 导出的查询参数
 * @returns
 */
export function exportCustomerData(data: Record<string, any>) {
  return requestClient.post('/admin/client/export', data);
}
