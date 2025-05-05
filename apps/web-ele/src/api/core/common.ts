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
  return requestClient.post<LoginResult>('/web/login', data);
}

/**
 * 退出登录
 */
export async function handleLogout() {
  return requestClient.post<LoginResult>('/web/logout');
}

/**
 * 注册
 */
export async function handleRegister(data: any) {
  return requestClient.post<{ msg: string; code: number }>('/web/register', data);
}
/**
 * 发送短信验证码
 */
export async function sendSmsApi(phone: string, code: string) {
  return baseRequestClient.post<{ msg: string; code: number }>('/web/sendSMS', { phone,code });
}

/**
 * 获取用户信息
 */
export async function getUserInfo() {
  return requestClient.get<LoginResult['data']['user']>('/web/user');
}
/**
 * 上传图片
 */
export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  return baseRequestClient.post<{ url: string; msg: string; code: number }>('/web/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

/**
 * 首页数据
 * @description 首页数据
 * @param {object} params - 请求参数
 *
  */
export async function getHomeData() {
  return requestClient.get<{ msg: string; code: number; data: any,bound_list:any}>('/web/index');
}    
