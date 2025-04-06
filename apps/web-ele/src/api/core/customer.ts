import { requestClient } from '#/api/request';

interface data {
  order_no: string;
}

export function getCustomerList(params: Record<string, any>) {
  return requestClient.get('/web/client', {params});
}

export function getCustomerDetails(customerId: number) {
  return requestClient.get(`/web/client/${customerId}`);
}

export function updateCustomer(data: any) {
  return requestClient.post('/web/client/store', data);
}

/**
 * 删除指定客户的信息
 * @param {string} customerId - 要删除的客户的唯一标识符
 * @returns
 */ export function deleteCustomer(customerId: number) {
  return requestClient.post(`/web/client/${customerId}/delete`);
}


