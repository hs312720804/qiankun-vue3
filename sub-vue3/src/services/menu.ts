
import { CTableRender, CSelectionType } from '@ccprivate/admin-toolkit-plus'
import fetch from './fetch'

export type MenuApi = {
  [key in 'add' | 'delete' | 'detail' | 'list' | 'update' | 'department' ]: [string, 'post' | 'get' | '']
}
export interface MenuExtra {
  actions?: string // Array<CButtonAction>
  listDataMap: string
  resource: string
  selectionType: CSelectionType | 'none'
  itemActions?: string
}
export type MenuFieldUse = 1 | 2 | 3
export type MenuFieldType = 'enum' | 'image' | 'date' | 'number' | 'string'
export interface MenuFields<T> {
  inputType: MenuFieldType // 字段类型，当 render 存在时，忽略该字段
  format?: string // 当 inputType 为 date 时该字段才存在，用于格式化时间
  label: string
  options: string // 枚举code，会根据该code从store中的 getEnumOptions 获取对应的code选项
  prop: string // keyof T
  queryExclude: boolean // 是否从筛选组件 CListFilter 中排除
  render: string | CTableRender<T>  // 该字段在表格（c-table）中自定义渲染函数
  use: Array<MenuFieldUse> // 该字段在列表表格（1）、列表筛选（2）、编辑页（3）中显示，eg: [1,3]，表示只在列表表格和编辑页中显示，不在列表筛选中显示
  width: string // 字段在表格中的宽度 eg: '100px'
  primaryKey: 1 | 0 // 是否主键; 1:是,0:否
  required?: boolean | undefined
}
export interface MenuDetailType {
  /**
   * JSON.stringify(MenuApi[])
   */
  id: number
  api: string
  /**
   * JSON.stringify(MenuExtra)
   */
  extra: string
  /**
   * JSON.stringify(MenuFields[])
   */
  fields: string
  children: MenuDetailType[] | null
  template?: string,
  apiJson: string,
  extraJson: string
}

export const getMenusDetail = (params: { id: string | number; }) => {
  return fetch<MenuDetailType>({
    method: 'get',
    url: 'auth/menu/detail',
    params
  }).then(res => {
    return res as MenuDetailType
  })
}

// function removeEmptyChildren (menus: Array<MenuDetail>) {
//   menus.forEach(item => {
//     if (item.children) {
//       if (item.children.length === 0) {
//         item.children = null
//       } else {
//         removeEmptyChildren(item.children)
//       }
//     }
//   })
// }

// export function menuGetListService (params: undefined) {
//   return fetch<Array<MenuDetail>>({
//     url: 'auth/menu/index',
//     params
//   }).then(data => {
//     removeEmptyChildren(data as Array<MenuDetail>)
//     return data
//   })
// }


// export function menuUpsertService (data) {
//   const url = data.id
//     ? 'auth/menu/update'
//     : 'auth/menu/add'
//   return fetch({
//     method: 'post',
//     url,
//     isJSON: false,
//     data
//   })
// }

// export function menuDelete (data) {
//   return fetch({
//     method: 'post',
//     url: 'auth/menu/delete',
//     isJSON: false,
//     data: {
//       id: data.id
//     }
//   })
// }


/**
 *
 */
// export const menuDeleteService = (data: { id: string; }) => {
//   return fetch({
//     method: 'post',
//     url: 'auth/menu/delete',
//     isJSON: false,
//     data: {
//       id: data.id
//     }
//   })
// }
