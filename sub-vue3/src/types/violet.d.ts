type CActionName = string // 按钮名称
type CActionTemplateType = 'Page' | 'Dialog' | ''
type CActionHandleType = 'Todo'
type CActionType = CActionTemplateType | CActionHandleType  // 按钮类型
type CActionTemplate = 'Edit' | ''
type CActionTemplateTrueName = `${CActionTemplate}${CActionTemplateType}`
type CToDoActionWithRow = 'rowDelete' | 'roleDelete' | 'userDelete' | 'enumDelete'
type CToDoActionNotRow = 'batchDelete' | 'batchDeleteUser' | 'handleRefresh'
type CToDoAction = CToDoActionWithRow | CToDoActionNotRow
type CActionPermission = 'add'
type CActionMode = 'read' | 'create' | 'edit' | 'copy' | 'list'

type CToDoActionHandles<T> = {
  [k in CToDoActionWithRow]: (row: T) => void
} & { [k in CToDoActionNotRow]: () => void }
interface COptionActions<T> {
  ({ row, option }: { row?: T; option: CButtonActionList; }): void
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
