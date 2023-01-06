import { h, withDirectives } from 'vue'
import { toBtnConfig } from '@/utils/comm.ts'
import { ElButton } from 'element-plus'

function commonOperation (arr, handleTodo, handleAction) {
  // 不与权限关联时用例：["编辑:Page:Edit:edit","查看:Page:Edit:read","删除:Todo:rowDelete","自定义Page:Page:AA","DialogPage:Dialog:AAADialog"]
  // 与权限关联时用例：["编辑:Page:Edit:update:edit","查看:Page:Edit:detail:read","删除:Todo:rowDelete:delete","自定义Page:Page:AA","DialogPage:Dialog:AAADialog"]
  return ({ row }) => {
    return arr.map((item) => {
      const option = item.split(':')
      const { label, type, methodName, rule, powerCode } = toBtnConfig(item)
      // if (this.resourceAccess.indexOf(option[3]) > -1) { // 权限是否存在判断
      // eslint-disable-next-line no-eval
      if (rule && eval(rule)) return ''
      return withDirectives(h( // h 由 vue 全局导入，并且，VNode 有一个扁平的 prop 结构
        ElButton, {
          type: 'primary',
          text: true, // element-plus 的文字按钮属性和 element-UI 不一样
          size: 'small',
          onClick: () => {
            if (type === 'Todo') {
              handleTodo({ row, option })
            } else {
              handleAction({ row, option })
            }
          }

        },
        label
      ),[
      ])
    })
  }
}


function stringHidden (prop, frontLen, endLen) {
  return ({ row }) => {
    return h(
      'span',
      {},
      this.$cUtils.format.hidden(row[prop], frontLen, endLen)
    )
  }
}

// 数据埋点事件管理列表操作

const renderMethods = {
  // handleOperation,
  stringHidden,
  commonOperation
}
// 方法名:说明
const renderMap = {
  handleOperation: '普通列表操作',
  stringHidden: '字符串隐藏',
  cellEdit: '单元格编辑'
}
export default renderMethods
export { renderMethods, renderMap }
