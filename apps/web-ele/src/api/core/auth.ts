import { baseRequestClient, requestClient } from '#/api/request';

export namespace AuthApi {
  /** 登录接口参数 */
  export interface LoginParams {
    password?: string;
    username?: string;
  }

    /** 登录接口参数 */
    export interface LoginCodeParams {
      phoneNumber?: string;
      code?: string;
    }

  /** 登录接口返回值 */
  export interface LoginResult {
    accessToken: string;
  }

  export interface RefreshTokenResult {
    data: string;
    status: number;
  }
}

/**
 * 登录
 */

export async function loginApi(data: AuthApi.LoginParams) {
  return requestClient.post<AuthApi.LoginResult>('/admin/login', data);
}

/**
 * 刷新accessToken
 */
export async function refreshTokenApi() {
  return baseRequestClient.post<AuthApi.RefreshTokenResult>('/auth/refresh', {
    withCredentials: true,
  });
}

/**
 * 退出登录
 */
export async function logoutApi() {
  return baseRequestClient.post('/admin/logout', {
    withCredentials: true,
  });
}

/**
 * 获取用户权限码
 */
export async function getAccessCodesApi() {
  return []
}

// ======= 初始认证 ========
/**
 * 获取认证列表
 * @param params 查询参数
 */
export async function getAuthNewListApi(params: Record<string, any>) {
  return requestClient.get<string[]>('/admin/bound/inbound/new', { params });
}


/**
 * 获取维修品认证列表
 * @param params 查询参数
 */
export async function getAuthRepairListApi(params: Record<string, any>) {
  return requestClient.get<string[]>('/admin/bound/inbound/repair', { params });
}
interface scanType {
  id: number; //初始认证id 新品id/维修id/回收时不传
  type: number; //认证类型 1新品 2维修 3回收
  detail_no: string; //详情编码
}

export async function handleScan(data: scanType) {
  return requestClient.post<any>('/admin/bound/inbound/scan', data);
}
