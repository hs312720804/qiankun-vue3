// import CellEdit from '../../components/CellEdit.vue'
import { h, withDirectives } from 'vue'
import { toBtnConfig } from '@/utils/comm.ts'
import { ElButton } from 'element-plus'

function commonOperation (arr, handleTodo, handleAction) {
  // 不与权限关联时用例：["编辑:Page:Edit:edit","查看:Page:Edit:read","删除:Todo:rowDelete","自定义Page:Page:AA","DialogPage:Dialog:AAADialog"]
  // 与权限关联时用例：["编辑:Page:Edit:update:edit","查看:Page:Edit:detail:read","删除:Todo:rowDelete:delete","自定义Page:Page:AA","DialogPage:Dialog:AAADialog"]
  return ({ row }) => {
    return arr.map((item, index) => {
      const option = item.split(':')
      const { label, type, methodName, rule, powerCode } = toBtnConfig(item)
      // if (this.resourceAccess.indexOf(option[3]) > -1) { // 权限是否存在判断
      // eslint-disable-next-line no-eval
      if (rule && eval(rule)) return ''
      return withDirectives(h(
        ElButton, {
          type: 'primary',
          text: true,
          size: 'small',
          onClick: () => {
            if (type === 'Todo') {
              // this.actionTodo({ row, option })
              // handleTodo[methodName]({ row })
              handleTodo({ row, option })
            } else {
              // this.$emit('option', {
              //   row,
              //   option
              // })
              handleAction({ row, option })
            }
          }
          // directives: [{
          //   name: 'permission',
          //   value: powerCode
          // }],
          // onClick: () => {
          //   if (option[1] === 'Todo') {
          //     toDoActions({ row, option })
          //     // this[option[2]](row)
          //   } else {
          //     optionActions({ row, option })
          //     // this.$emit('option', {
          //     //   row,
          //     //   option
          //     // })
          //   }
          // }
          // on: {
          //   click: () => {
          //     if (option[1] === 'Todo') {
          //       this.actionTodo({ row, option })
          //     } else {
          //       this.$emit('option', {
          //         row,
          //         option
          //       })
          //     }
          //   }
          // }
        },
        label
      ),[
        // 不与权限关联时不需要指令，mode的索引变成3
        // [permissionDirective, `${resource}:${option[3]}`]
      ])
      // }
    })
  }
}

/**
 * @deprecated 当前方法已经废弃，已改用 commonOperation，为了兼容旧的数据，改方法不能删除
 * @param {*} arr
 * @returns
 */
function handleOperation (arr) {
  // 不与权限关联时用例：["编辑:Page:Edit:edit","查看:Page:Edit:read","删除:Todo:rowDelete","自定义Page:Page:AA","DialogPage:Dialog:AAADialog"]
  // 与权限关联时用例：["编辑:Page:Edit:update:edit","查看:Page:Edit:detail:read","删除:Todo:rowDelete:delete","自定义Page:Page:AA","DialogPage:Dialog:AAADialog"]
  return ({ row }) => {
    return arr.map((item, index) => {
      const option = item.split(':')
      const { label, type, methodName, rule, powerCode } = toBtnConfig(item)
      // if (this.resourceAccess.indexOf(option[3]) > -1) { // 权限是否存在判断
      // eslint-disable-next-line no-eval
      if (rule && eval(rule)) return ''
      return h(
        'ElButton', {
          type: 'text',
          size: 'mini',
          // directives: [{
          //   name: 'permission',
          //   value: powerCode
          // }],
          // on: {
          //   click: () => {
          //     if (type === 'Todo') {
          //       // this[methodName](row)
          //       this.actionTodo({ row, option })
          //     } else {
          //       this.$emit('option', {
          //         row,
          //         option
          //       })
          //     }
          //   }
          // }
        },
        label
      )
      // }
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
// function cellEdit (prop) {
//   return (h, { row }) => {
//     return h(
//       CellEdit,
//       {
//         props: {
//           initValue: row[prop]
//         },
//         on: {
//           blur: (val) => {
//             console.log(val)
//           }
//         }
//       }

//     )
//   }
// }
// 数据埋点事件管理列表操作

const renderMethods = {
  handleOperation,
  stringHidden,
  // cellEdit,
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
