export function evil (fn) {
  var Fn = Function // 一个变量指向Function，防止有些前端编译工具报错
  return new Fn('return ' + fn)()
}

export const ROOT_DIR_ID = 0 // 根目录ID
export const AUDIT_TYPE_NONE = 1 // 不审
export const AUDIT_TYPE_SELF = 2 // 自审
export const MAX_AUDIT_PROCESS = 5 // 最大审核流程步骤数
export const STRORE_ADDR_FTP = 1 // 存储位置，1：FTP ，2：CORS（目前只支持FTP）
export const STRORE_ADDR_CORS = 2 // 存储位置，1：FTP ，2：CORS（目前只支持FTP）
export const AUDTI_STATUS_REJECT = 3
export const AUDTI_STATUS_PASS = 4