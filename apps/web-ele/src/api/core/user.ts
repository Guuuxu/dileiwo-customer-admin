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
  return requestClient.get<LoginResult['data']['user']>('/admin/user');
}


/**
 * 获取管理员用户列表
 */
export async function getAdminUserListApi(params:any) {
  return requestClient.get<UserInfo[]>('/admin/system',{params});
}

/**
 * 获取管理员详情
 */
export async function getAdminUserDetailApi(userId: string) {
  return requestClient.get<UserInfo>(`/admin/system/${userId}`);
}

/**
 * 新增管理员用户
 */
export async function addAdminUserApi(userData: Partial<UserInfo>) {
  return requestClient.post('/admin/system/store', userData);
}

/**
 * 删除管理员用户
 */
export async function deleteAdminUserApi(userId: string) {
  return requestClient.post(`/admin/system/${userId}/delete`);
}
