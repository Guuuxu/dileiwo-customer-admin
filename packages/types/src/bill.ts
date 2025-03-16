interface List {
  /**
   * 总金额
   */
  amount: string;
  /**
   * 已销账金额
   */
  balance: string;
  /**
   * 币种
   */
  currency: number;
  due: string;
  /**
   * hbl no
   */
  hbl_no?: string;
  id: number;
  /**
   * 发票号
   */
  invoice_no?: string;
  /**
   * 发票类型
   */
  invoice_type?: string;
  issued: string;
  last_payment: string;
  /**
   * 文件地址
   */
  path: string;
  /**
   * 关联 sea_orders 表
   */
  sea_order_id: number;
  /**
   * 状态 0未支付 1已支付
   */
  status: number;
}

interface Meta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}
interface Data {
  list: List[];
  meta?: Meta;
}
interface BillResponse {
  code: number;
  data: Data;
  msg: string;
}

export type { BillResponse, Data };
