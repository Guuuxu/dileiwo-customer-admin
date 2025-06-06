export const packageType: any = {
  0: '月卡',
  1: '季卡',
  2: '年卡',
  3: '连续包月',
  4: '连续包年',
};
export const damageReasons: any = [
  { label: '外观破损', value: '1' },
  { label: '内层破损', value: '2' },
  { label: '表面割裂', value: '3' },
  { label: '拉链损坏', value: '4' },
  { label: '拼接块脱落', value: '5' },
  { label: '恶意涂鸦', value: '6' },
  { label: '其他', value: '7' },
];

export const yesOrNoOption: any = [
  { label: '是', value: '1' },
  { label: '否', value: '2' },
];

export const roleOptions = [
  { label: '管理员', value: 1 },
  { label: '操作员', value: 2 },
  { label: '法人', value: 3 },
];

// 损坏上报状态
export const damageReportStatusOptions = [
  { label: '待验证', value: 0 },
  { label: '已验证', value: 1 },
  { label: '已寄出', value: 2 },
  { label: '已完成', value: 3 },
];

export const countryCodeOptions = [
  {
    label: '+86 中国',
    value: '+86', // 中国大陆手机号码 11 位，以 1 开头
    regex: /^1[3-9]\d{9}$/,
  },
  {
    label: '+886 台湾地区(中国)',
    value: '+886', // 台湾手机号一般为 09 开头的 10 位数字，去掉 0 后是 9 位
    regex: /^9\d{8}$/,
  },
  {
    label: '+852 香港特别行政区(中国)',
    value: '+852', // 香港手机号为 8 位数字
    regex: /^\d{8}$/,
  },
  {
    label: '+853 澳门特别行政区(中国)',
    value: '+853', // 澳门手机号为 8 位数字
    regex: /^\d{8}$/,
  },
];

/**
 * 库存使用类型
 */
export const inventoryUseType = [
  { label: '未认证', value: 0 },
  { label: '出库', value: 1 },
  { label: '回收', value: 2 },
  { label: '损坏', value: 3 },
  { label: '已认证', value: 4 },
];
