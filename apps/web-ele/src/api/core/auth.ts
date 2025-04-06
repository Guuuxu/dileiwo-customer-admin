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
  return requestClient.post<AuthApi.LoginResult>('/web/login', data);
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
  return baseRequestClient.post('/web/logout', {
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
  return requestClient.get<string[]>('/web/bound/inbound', { params });
}

/**
 * 初始认证确认
 * @param params 查询参数
 */
export async function handleConfirmAuth(id: number) {
  return requestClient.post<any>(`/web/bound/inbound/${id}/confirm`);
}


/**
 * 获取维修品认证列表
 * @param params 查询参数
 */
export async function getAuthRepairListApi(params: Record<string, any>) {
  return requestClient.get<string[]>('/web/bound/inbound/repair', { params });
}

interface scanType {
  id: number; //初始认证id 新品id/维修id/回收时不传
  type: number; //认证类型 1新品 2维修 3回收
  detail_no: string; //详情编码
}

/**
 * 扫码认证
 * @param params 查询参数
 */
export async function handleAuthScan(outbound: number, detail_no: string) {
  return requestClient.post<any>(`/web/bound/inbound/${outbound}/scan`,{detail_no});
}

/**
 * 扫描结果
 * @param params 查询参数
 * 
 */
export async function handleAuthScanResult(outbound: number) {
  return requestClient.get<any>(`/web/bound/inbound/${outbound}/inboundResult`);
}

/**
 * 回收扫描
 * @param 
 * @param detail_no 详情编码
 */
export async function handleRecycleScan(detail_no: string) {
  return requestClient.post<any>(`/web/bound/inbound/recycle`, { detail_no });
}
