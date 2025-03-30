import { baseRequestClient, requestClient } from '#/api/request';

 interface LoginParams {
  code?: string;
  phone?: string;
}

/** 登录接口返回值 */
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
 * 登录
 */
export async function handleLogin(data: LoginParams) {
  return requestClient.post<LoginResult>('/admin/login', data);
}

/**
 * 退出登录
 */
export async function handleLogout() {
  return requestClient.post<LoginResult>('/admin/logout');
}

/**
 * 发送短信验证码
 */
export async function sendSmsApi(phone: string) {
  return baseRequestClient.post<{ msg: string; code: number }>('/admin/sendSMS', { phone });
}

/**
 * 获取用户信息
 */
export async function getUserInfo() {
  return requestClient.get<LoginResult['data']['user']>('/admin/user');
}
