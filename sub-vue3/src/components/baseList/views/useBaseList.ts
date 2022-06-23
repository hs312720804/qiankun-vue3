import { ref, reactive, computed, nextTick, watch, h } from 'vue'
import { evil } from '@/utils/consts.js'
import { ElTag, ElImage } from 'element-plus'
import { renderMethods } from './renderMethods'
import { MenuDetailType} from '@/services/menu'

// 在 Vue 2 中，mixin 是将部分组件逻辑抽象成可重用块的主要工具。但是，他们有几个问题：

//     1、Mixin 很容易发生冲突：因为每个 mixin 的 property 都被合并到同一个组件中，所以为了避免 property 名冲突，你仍然需要了解其他每个特性。

//     2、可重用性是有限的：我们不能向 mixin 传递任何参数来改变它的逻辑，这降低了它们在抽象逻辑方面的灵活性。

// 为了解决这些问题，我们添加了一种通过逻辑关注点组织代码的新方法：组合式 API。

export default function useUserRepositories(menu: MenuDetailType, primaryKey: string, table: tableType, handleResource: handleResourceType, fetchData:Function, handleTodo:Function, handleAction:Function) {

  // const repositories = ref([])
  // const getUserRepositories = async () => {
  //   repositories.value = 1223
  // }

  // onMounted(() => {
  //   getUserRepositories
  // })
  // watch(user, getUserRepositories)

  let disabled = ref(false)

  let pagination = reactive({
    pageSize: 10,
    currentPage: 1
  })

  let renderMethodsUtils = computed(() => {
    return {
      ...handleResource.renderMethods, // 我们自己编写的页面上的方法，自定义的方法
      ...renderMethods  // 
    }
  }) 

  let tableHeader = computed(() => {
    let header = JSON.parse(JSON.stringify(table.header))
 
    table.header.forEach((item, index) => {
      if (typeof item.render === 'string') {
        // 如果是新的按钮生成逻辑，则走 commonOperation 方法
        if (item.btnConfig) {
          header[index].render = renderMethodsUtils.value.commonOperation(item.btnConfig, handleTodo, handleAction)
        }
      }

      if (item.inputType === 'enum' && (!('render' in item) || !item.render)) {
        header[index].render = function ({ row }) {
          const optionsText: { [index: string]: string; } = {}

          const tagType = ['', 'success', 'info', 'warning', 'danger']
          item.options.forEach((option:any) => {
            optionsText[option.value] = option.label
          })
          let tags = [row[item.prop]]
          if (typeof row[item.prop] === 'string') {
            tags = row[item.prop].split(',')
          }
          const tagVNodes = tags.map(value => h(
            ElTag,
            {
              effect: 'plain',
              type: tagType[value] || '',
              style: {
                margin: '5px',
              },
            },
            optionsText[value]
          ))
          return h('div', { style: { lineHeight: '32px' } }, tagVNodes)
        }
      }
      
      if (item.inputType === 'image' && (!('render' in item) || !item.render)) {
        header[index].render = function ({ row }) {
          return h(
            ElImage,
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

  function handleSizeChange (val) {
    // this.pageSize = val
    fetchData()
  }
  // 页码变更, 如第1页变成第2页时,val=2
  function handleCurrentChange (val) {
    // this.currentPage = val
    fetchData()
  }
  
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
    handleSizeChange,
    handleCurrentChange,
    handleFilterChange,
    parseFilter
  }
}