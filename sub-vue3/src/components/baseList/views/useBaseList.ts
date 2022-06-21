import { ref, reactive, computed, nextTick, watch, h } from 'vue'
import { evil } from '@/utils/consts.js'
import { ElTag, ElImage } from 'element-plus'
import { renderMethods } from './renderMethods'
import { MenuDetailType} from '@/services/menu'


export default function useUserRepositories(menu: MenuDetailType, primaryKey: string, table: tableType, handleResource: handleResourceType, fetchData:Function, handleTodo:Function, handleAction:Function) {

  // const repositories = ref([])
  // const getUserRepositories = async () => {
  //   repositories.value = 1223
  // }

  // onMounted(() => {
  //   getUserRepositories
  // })
  // watch(user, getUserRepositories)
  console.log('handleResource======', handleResource)

  let disabled = ref(false)

  let pagination = reactive({
    pageSize: 10,
    currentPage: 1
  })
  // let selected = ref([])
  // let showInfo = ref(false)
  // let showList = ref(false)

  let renderMethodsUtils = computed(() => {
    return {
      ...handleResource.renderMethods,
      ...renderMethods
    }
  }) 

  let tableHeader = computed(() => {
    let header = JSON.parse(JSON.stringify(table.header))
    table.header.forEach((item, key) => {
      if (typeof item.render === 'string') {
        // 如果是新的按钮生成逻辑，则走 commonOperation 方法
        if (item.btnConfig) {
          header[key].render = renderMethodsUtils.value.commonOperation(item.btnConfig, handleTodo, handleAction)
          // header[key].render = renderMethodsUtils.value.commonOperation(item.btnConfig)
        }
        //  else if (item.render) {
        //   const _this = this // eval 中会使用 _this 这个变量，不能删除
        //   Object.keys(renderMethodsUtils).forEach(key => {
        //     _this[key] = renderMethodsUtils[key].bind(this)
        //   })
        //   // eslint-disable-next-line no-eval
        //   header[key].render = eval('(' + item.render + ')') // todo 源代码，会使用 _this 这个变量
        // }
      }

      if (item.inputType === 'enum' && (!('render' in item) || !item.render)) {
        header[key].render = function ({ row }) {
          const optionsText: { [key: string]: string; } = {}

          const tagType = ['', 'success', 'info', 'warning', 'danger']
          item.options.forEach(option => {
            optionsText[option.value] = option.label
          })
          let tags = [row[item.prop]]
          if (typeof row[item.prop] === 'string') {
            tags = row[item.prop].split(',')
          }
          const tagVNodes = tags.map(value => h(
            ElTag,
             // {
            //   style: { margin: '5px' },
            //   props: {
            //     type: tagType[key] || ''
            //   }
            // },
            {
              effect: 'plain',
              type: tagType[value] || '',
              style: {
                margin: '5px',
                // border: '1px solid ' + (borderColor || color || '#909399'), // 设有设置颜色用默认颜色，默认颜色用完用灰色
                // color: '#909399',
                // color: color || '#909399',
              },
            },
            optionsText[value]
          ))
          return h('div', { style: { lineHeight: '32px' } }, tagVNodes)
        }
      }
      if (item.inputType === 'image' && (!('render' in item) || !item.render)) {
        header[key].render = function ({ row }) {
          return h(
            ElImage,
            // {
            //   attrs: {
            //     src: row[item.prop],
            //     fit: 'contain'
            //   },
            //   style: {
            //     height: '50px'
            //   }
            // },
            {
              src: row[item.prop],
              fit: 'contain',
              style: {
                height: '50px'
              }
            },
            ''
          )
        }
      }
    })
    return header
  })
console.log('menu===', menu)
  let api = computed(() => {
    return evil(menu.apiJson)
  })
  // 权限资源
  let resource = computed(() => {
    return evil(menu.extraJson).resource
  })
  // 列表数据映射
  let listDataMap = computed(() => {
    return evil(menu.extraJson).listDataMap
  })
  let selectionType = computed(() => {
    return evil(menu.extraJson).selectionType
  })
  

  function selectChange () {
    disabled.value = true
    nextTick(() => {
      disabled.value = false
    })
  }
  // function setHeight () {
  //   const tableEl = this.$refs.table.$refs.table.$el
  //   const tableRect = tableEl.getBoundingClientRect()
  //   const height = window.innerHeight - tableRect.top - 76
  //   table.props = {
  //     'max-height': height,
  //     'height': height
  //   }
  //   this.$refs.table.$refs.table.doLayout()
  // }
  // function listHeightChange () {
  //   const elTable = document.querySelector('.el-table') ? document.querySelector('.el-table') : ''
  //   const height = document.querySelector('.el-main').clientHeight
  //   if (!height) {
  //     table.props = {
  //       ...table.props,
  //       'max-height': this.$store.state.app.listHeight
  //     }
  //     // this.tableDoLayout()
  //   } else {
  //     elTable.style.maxHeight = (height - 107) + 'px'
  //   }
  // }
  function handleSizeChange (val) {
    // this.pageSize = val
    fetchData()
  }
  // 页码变更, 如第1页变成第2页时,val=2
  function handleCurrentChange (val) {
    // this.currentPage = val
    fetchData()
  }
  // function handleRowSelectionAdd (targetItem) {
  //   selected.value.push(targetItem)
  //   updateTableSelected()
  // }
  // function handleRowSelectionRemove (targetItem) {
  //   selected.value = selected.value.filter(item => {
  //     return item[primaryKey] !== targetItem[primaryKey]
  //   })
  //   updateTableSelected()
  // }
  // function handleAllRowSelectionChange (value) {
  //   if (value) {
  //     table.data.forEach(handleRowSelectionAdd)
  //   } else {
  //     handleAllRowSelectionRemove()
  //   }
  // }
  // function handleAllRowSelectionRemove () {
  //   const currentPageSelected = table.data.map(e => {
  //     return e[primaryKey]
  //   })
  //   selected.value = selected.value.filter(e => {
  //     return !currentPageSelected.includes(e[primaryKey])
  //   })
  //   table.selected = []
  // }
  // function updateTableSelected () {
  //   const table = table
  //   const newSelectedIndex = selected.value.reduce((result, item) => {
  //     result[item[primaryKey]] = true
  //     return result
  //   }, {})
  //   table.selected = table.data.reduce((result, item, index) => {
  //     if (newSelectedIndex[item[primaryKey]]) {
  //       result.push(index)
  //     }
  //     return result
  //   }, [])
  // }
  // function clearSelected () {
  //   selected.value = []
  //   table.selected = []
  //   updateTableSelected()
  // }
  function handleFilterChange (type) {
    if (type === 'query') {
      if (pagination) {
        pagination.currentPage = 1
      }
    }
    fetchData()
  }
  function parseFilter () {
    // const {
    //   filter,
    //   pagination
    // } = this
    if (pagination) {
      filter.page = pagination.currentPage
      filter.pageSize = pagination.pageSize
    }
    return filter
  }

  return {
    disabled,
    pagination,
    selected: [],
    showInfo: false,
    showList: false,
    tableHeader,
    api,
    resource,
    listDataMap,
    selectionType,
    selectChange,
    // setHeight,
    // listHeightChange,
    handleSizeChange,
    handleCurrentChange,
    // handleRowSelectionAdd,
    // handleRowSelectionRemove,
    // handleAllRowSelectionChange ,
    // handleAllRowSelectionRemove,
    // updateTableSelected,
    // clearSelected,
    handleFilterChange,
    parseFilter
  }
}