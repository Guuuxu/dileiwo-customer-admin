import type { UserInfo } from '@vben/types';

import { requestClient } from '#/api/request';
interface LoginResult {
  data:{
    accessToken: string;
    token: string;
    user: {
      id: string;
      name: string;
      type: string; // 权限类型 0超级管理员
      phone: string;
      created_at: string;
      updated_at: string;
    }
  }
  msg: string;
  code: number;
}
/**
 * 获取用户信息
 */
export async function getUserInfoApi() {
  return requestClient.get<LoginResult['data']['user']>('/web/user');
}

/**
 * 获取用户信息
 */
export async function getAccountApi() {
  return requestClient.get<UserInfo>('/web/client');
}

/**
 * 获取账户信息
 */
export async function getAccountInfoApi() {
  return requestClient.get<UserInfo>('/web/clientInfo');
}

/**
 * 更新账户信息
 */
export async function editClient(data) {
  return requestClient.post<UserInfo>('/web/editClient',data);
}
/**
 * 获取管理员用户列表
 */
export async function getAdminUserListApi(params:any) {
  return requestClient.get<UserInfo[]>('/web/system',{params});
}

/**
 * 获取管理员详情
 */
export async function getAdminUserDetailApi(userId: string) {
  return requestClient.get<UserInfo>(`/web/system/${userId}`);
}

/**
 * 新增管理员用户
 */
export async function addAdminUserApi(userData: Partial<UserInfo>) {
  return requestClient.post('/web/system/store', userData);
}

/**
 * 删除管理员用户
 */
export async function deleteAdminUserApi(userId: string) {
  return requestClient.post(`/web/system/${userId}/delete`);
}
