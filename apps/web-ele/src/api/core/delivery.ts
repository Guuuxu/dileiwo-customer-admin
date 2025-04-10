import { requestClient } from '#/api/request';

export function getOutboundList(params: Record<string, any>) {
  return requestClient.get(`/admin/bound/outbound`, { params });
}

/**
 * 新增/编辑包装出库
 * @param data - 包含配送信息的对象，类型为任意类型
 * id 出库id 新增时不传      编辑时传
 * client_custom_id 客户id
 * @returns
 */
export function updateDelivery(data: any) {
  return requestClient.post('/web/bound/outbound/store', data);
}

/**
 * 获取详情
 * @param outbound - 详情的唯一标识符
 * @returns
 */
export function getDeliveryDetails(outbound: string) {
  return requestClient.get(`/web/bound/outbound/${outbound}`);
}

/**
 * 删除出库记录
 * @param id - 要删除的出库记录的唯一标识符
 * @returns
 */
export function deleteDelivery(id: number) {
  return requestClient.post(`/web/bound/outbound/${id}/delete`);
}

/**
 * 出库扫码
 * @param barcode - 扫描的条形码
 * @returns
 */
export function scanOutboundBarcode(outbound: number, detail_no: string) {
  return requestClient.post(`/web/bound/outbound/${outbound}/scan`, {
    detail_no,
  });
}

/**
 * 发送手机
 * @param
 * @returns
 */
export function sendPhoneMessage(id: number) {
  return requestClient.post(`/web/bound/outbound/${id}/send`);
}

/**
 * 获取出库记录列表
 * @param params - 查询参数，类型为任意类型
 * @returns
 */
export function getOutboundRecords(params: any) {
  return requestClient.get('/web/bound/outbound', { params });
}

/**
 * 导出数据接口
 * @param data - 包含导出条件的对象，类型为任意类型
 * @returns
 */
export function exportData(data: any) {
  return requestClient.post('/web/bound/outbound/export', data);
}

/**
 * 使用记录列表
 * @param params - 查询参数，类型为任意类型
 * @returns
 */
export function getInventoryRecords(params: any) {
  return requestClient.get('/web/bound/outbound/inventory', { params });
}
