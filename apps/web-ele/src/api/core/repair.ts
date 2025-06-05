import { requestClient } from '#/api/request';
import type { RequestClientConfig } from '@vben/request';

interface data {
  order_no: string;
}
/**
 * 新增/编辑待处理记录
 * @param data - 包含损坏信息的对象，类型为任意类型
 * @returns
 */
export function updateRepair(data: any) {
  return requestClient.post('/web/repair/store', data);
}

/**
 * 获取待处理列表
 * @param data - 包含查询条件的对象，类型为任意类型
 * @returns
 */
export function getRepairVerifyList(data: data) {
  return requestClient.get('/web/repair/verify', { params: data });
}
/**
 * 获取已提交列表
 * @param data - 包含查询条件的对象，类型为任意类型
 * @returns
 */
export function getRepairSendList(data: data) {
  return requestClient.get('/web/repair/send', { params: data });
}

/**
 * 获取损坏详情
 * @param id - 损坏记录的唯一标识
 * @returns
 */
export function getRepairDetail(id: string) {
  return requestClient.get(`/web/repair/${id}`);
}

/**
 * 寄出
 * @param id - 损坏记录的唯一标识
 * @returns
 */
export function sendRepair({id,transfer_no}: {id: number,transfer_no: string}) {
  return requestClient.post(`/web/repair/send/${id}`,{transfer_no});
}

/**
 * 扫码
 * @param code - 扫码的唯一标识码
 * @returns
 */
export function scanRepair(data: { detail_no: string }) {
  return requestClient.post(`/web/repair/scan`, data);
}
