type CActionName = string // 按钮名称
type CActionTemplateType = 'Page' | 'Dialog' | ''
type CActionHandleType = 'Todo'
type CActionType = CActionTemplateType | CActionHandleType  // 按钮类型
type CActionTemplate = 'Edit' | ''
type CActionTemplateTrueName = `${CActionTemplate}${CActionTemplateType}`
type CToDoActionWithRow = 'rowDelete' | 'roleDelete' | 'userDelete' | 'enumDelete' | 'singleDel' | 'sSingleDel'
type CToDoActionNotRow = 'batchDelete' | 'batchDeleteUser' | 'handleRefresh'
type CToDoAction = CToDoActionWithRow | CToDoActionNotRow
type CActionPermission = 'add'
type CActionMode = 'read' | 'create' | 'edit' | 'copy' | 'list'

type CToDoActionHandles<T> = {
  [k in CToDoActionWithRow]: (row: T) => void
} & { [k in CToDoActionNotRow]: () => void }
interface COptionActions<T> {
  ({ row, option, selected }: { row?: T; option: CButtonActionList; selected?: [] }): void
}

// ["新建","Page","Edit","add","edit"]
type CButtonActionList =
  [CActionName, CActionTemplateType, CActionTemplate, CActionPermission, CActionMode] |
  [CActionName, CActionHandleType, CToDoAction, CActionPermission, CActionMode]

// ["新建:Page:Edit:add:edit","删除:Todo:batchDelete:delete","刷新:Todo:handleRefresh:select"]
type CButtonAction =
  `${CButtonActionList[0]}:${CButtonActionList[1]}:${CButtonActionList[2]}` |
  `${CButtonActionList[0]}:${CButtonActionList[1]}:${CButtonActionList[2]}:${CButtonActionList[3]}` |
  `${CButtonActionList[0]}:${CButtonActionList[1]}:${CButtonActionList[2]}:${CButtonActionList[3]}:${CButtonActionList[4]}`


type RBACActionMode = 'add' | 'update' | 'delete' | 'del' | 'read' | 'select' | 'edit' | 'preview' | 'copy' | 'create'
type RBACActionModeEvent = 'create' | 'edit' | 'delete' | 'read' | 'select' | 'edit' | 'preview' | 'copy'
type CRBACButtonType = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text' | 'default'
interface CRBACButtonAction {
  label: string
  value: string
  type?: CRBACButtonType
}

interface CRBACApiParam {
  pageNo: number
  pageSize: number
  sign?: string
}
interface CRBACApiResData<T> {
  pageInfo: {
    total: number
    list: Array<T>
  }
}

interface COptions {
  label: string
  value: string
  disabled: CRBACButtonType
}

interface tableType {
  props: {
    border: Boolean,
    stripe: Boolean
  },
  header: Array,
  data: Array
  selected: Array
}

type BaseListRow = { [key: string]: any; }

interface handleResourceType {
  pages?: any,
  dialogs?: any,
  todo?: any,
  renderMethods?: any
  // [key: string]: any
}

type optionsType = {
  label: string
  value: string
}
interface tableHeaderItemType {
  inputType: string
  label: string
  prop: string
  render: string
  required: Boolean
  use: Array<string | number>
  width: string
  btnConfig?: null | string | Array<string | number>
  options: optionsType[],
  optionsApi: {
    use: Array<string | number>
    url: string
    label: string
    value: string | number
    method: string
  }
}

type fetchMethodType = () => {

}

interface serviceMapType {
  // add?: (data, params, ...config) => {}
  // camPolicyList?: (data, params, ...config) => {}
  // delete?: (data, params, ...config) => {}
  // detail?: (data, params, ...config) => {}
  // genAppIdSecret?: (data, params, ...config) => {}
  // list?: (data, params, ...config) => {}
  // update?: (data, params, ...config) => {}
  // updateAppIdSecret?: (data, params, ...config) => {}

  [key: string]: (data, params, ...config) => {}, // 字段扩展声明
}

interface apiType {
  [k: string]: any
}

type promiseParamsType = {
  [key: string]: string | boolean | Object
}