<template>
  <div>
    <c-card ref="contentCard" class="content">
      <div v-show="showInfo">{{ $t('message.pageConfiguration') }}</div>

      <!-- <div style="border: 1px solid red">{{tableHeader}}</div>
      <div style="border: 1px solid red">{{table.data}}</div> -->
      <!-- <div style="border: 1px solid red">{{table.props}}</div> -->
      <!-- <div style="border: 1px solid red">{{pagination}}</div> -->
      <!-- <div style="border: 1px solid red">{{ showList }}</div> -->
      <!-- <div style="border: 1px solid red">{{ actions }}</div>
      <div style="border: 1px solid red">{{ actionTodo }}</div> -->
      <c-content-wrapper
        v-show="showList"
        :pagination="pagination"
        @filter-change="handleFilterChange"
      >
        <div class="list-option clearfix">
          <div class="action-list">
            <Actions
              :selected="table.selected"
              :actions="actions"
              :rows="table.data"
              :resource="resource"
              @action="handleAction"
              @todo="handleTodo"
            ></Actions>
          </div>
        
          <template v-if="filterFields.length > 0">
            <c-list-filter
              v-if="!filterExpand"
              ref="expandForm"
              :options="filterFields"
              :length="3"
              :form-data="filter"
              :is-expand="filterExpand"
              :button-text="buttonText"
              :hidden-expand-button="filterFields.length <= 3"
              @filter="handleSearch"
              @reset="handleResetSearch"
              @filter-expand="handlefilterExpand"
            >
            </c-list-filter>
          </template>
        </div>
        <div class="filter-expand">
          <c-list-filter
            v-if="filterExpand"
            ref="expandForm"
            :options="filterFields"
            :form-data="filter"
            :is-expand="filterExpand"
            :button-text="buttonText"
            @filter="handleSearch"
            @reset="handleResetSearch"
            @filter-expand="handlefilterExpand"
          >
          </c-list-filter>
        </div>
        
        <c-table
          :key="$route.path"
          :props="table.props"
          :header="tableHeader"
          :data="table.data"
          :selected="table.selected"
          :selection-type="selectionType"
        ></c-table>
  
      </c-content-wrapper>
    </c-card>

  </div>

  
</template>
<script setup lang="ts">
  import { useRoute } from 'vue-router'
  import { ref, reactive, toRefs, inject, Ref } from 'vue'
  import { evil } from '@/utils/consts.js'
  import { baseListFetch } from '@/utils/listFetch.ts'
  // import Index from './Index.vue'
  // import helloword from './HelloWorld.vue'
  import useBaseList from './useBaseList.ts'
  import { ElNotification } from 'element-plus'
  import _ from 'lodash'
  import Actions from './Actions.vue'
  import useToDo from './mixin/listActions.ts'
  import { MenuDetailType} from '@/services/menu.ts'

  import { primaryKeyKey, disposalFieldKey, fetchMethodKey, handleResourceKey } from './injection.ts'

  const primaryKey = inject(primaryKeyKey)
  const disposalField = inject(disposalFieldKey) 
  const fetchMethod = inject(fetchMethodKey)
  const handleResource = inject(handleResourceKey) as Ref<handleResourceType>

  console.log('1122primaryKey===', primaryKey)
  console.log('1122disposalField===', disposalField)
  console.log('1122fetchMethod===', fetchMethod)
  console.log('1122handleResource===', primaryKey)
  // -------初始化---------start
  
  const emits = defineEmits(['action', 'todo', 'go-back'])
  const props = defineProps<{
    menuId: number
    menu: MenuDetailType
  }>()
  

  defineExpose({
    fetchData
  })

  
  let { menu } = toRefs(props)
  
  const $route = useRoute()

  interface newOptionsType {
    label: string 
    value: string | number
    item: object
  }
  // interface filterFieldsType {
  //   options: newOptionsType[]
  // }

  // let filterFields = ref<filterFieldsType[]>([])
  let filterFields = ref([])
  let filter = reactive<apiType>({}) 
  // let isExpand = ref(false)
  let filterExpand = ref(false)
  // let filterType = ref<string>('')
  // let filterTypeLabel = ref<string>('')
  const buttonText = reactive({
    query: '查询',
    reset: '重置',
    expand: '展开',
    packUp: '收起',
  })

  let table = reactive<tableType>({
    props: {
      border: true,
      stripe: true
    },
    header: [],
    data: [],
    selected: []
  })
  // let template = ref<string>('')
  let actions = ref([])
  // let actionsMethods = reactive({})


  // const tableType = computed(() => {
  //   if (evil(menu.value.extraJson).tableType) {
  //     return evil(menu.value.extraJson).tableType
  //   } else {
  //     return 'list'
  //   }
  // })
  // 在当前页面就能实现的功能:   主要是批量删除、删除、编辑等 
  const handleTodo:COptionActions<BaseListRow> = (data) =>{
    const { row = '', option } = data
    const operate = option[2]
    toDoActions[operate as CToDoActionNotRow](row)
  }
  
    // 响应式数据变化，Vue确实可以在数据变化的时候，响应式系统可以立刻得知。但是如何每个属性都添加 watcher 的话，性能会非常的差。
    // 粒度过细，会导致更新不精准
    // watcher + Diff

    // $attr 实现批量数据传递
    // 插件中，跨级数据传递

    // 批量数据传递
    // <slot></slot>
    // slot-scope="{row}"

    // 启动的时候不用打包，不用分析模块与模块之间的依赖关系，不用进行编译

    // 模块化交给浏览器，不用担心


    


  let {
    pagination,
    selected,
    showList,
    tableHeader,
    api,
    resource,
    listDataMap,
    selectionType,
    handleFilterChange,
  } = useBaseList(menu.value, primaryKey, table, handleResource, fetchData, handleTodo, handleAction, filter )

  const showInfo = ref(false)
  /**
   * 处理选项filterFields数据
   * @param options = this.filterFields
   * */
  interface apiOptionsType{
    resourceIndex: number
    labelKey: string
    valueKey: string | number
    item: tableHeaderItemType
    httpData: {
      [k: string]: any
    }
  }
  const handleOptions = async (options: tableHeaderItemType[]) => {
    console.log('333options====', options)

    let apiOptions:apiOptionsType[] = []
    for (let i = 0; i < options.length; i++) {
      const item = options[i]
      if (item.optionsApi && item.optionsApi.use) {
        if (item.optionsApi.url) {
          try {
            apiOptions.push({
              resourceIndex: i,
              labelKey: item.optionsApi.label,
              valueKey: item.optionsApi.value,
              item,
              httpData: await new Promise((resolve, reject) => {
                fetchMethod?.value({
                  url: item.optionsApi.url,
                  method: item.optionsApi.method || 'get'
                }).then(({ data }: any) => {
                  resolve(data)
                })
              })
            })
          } catch (e) {
            console.error('获取远程数据失败', e)
          }
        }
      }
    }
    for (let i = 0; i < apiOptions.length; i++) {
      const option = apiOptions[i]
      const newOptions = [] as newOptionsType[]
      option.httpData.forEach((item: any) => {
        newOptions.push({
          label: item[option.labelKey],
          value: item[option.valueKey],
          item
        })
      })
      filterFields.value[option.resourceIndex].options = newOptions
    }
  }

  pageSetting(menu.value)
  
  // -------初始化---------end

  
  // Vue 的 diff 算法是平级比较，不考虑跨级比较的情况。内部采用深度递归的方式 + 双指针方式比较

  //  先比较两个节点是不是相同节点
  //  相同节点比较属性，复用老节点
  //  先比较儿子节点，考虑老节点和新节点儿子的情况
  //  优化比较：头头、尾尾、头尾、尾头
  //  比对查找，进行复用

  // > key 工作原理： 为了更高效的更新虚拟 DOM
  // 原理是 vue 在 patch 过程中通过 key 可以精准的判断两个节点是否是同一个，从而避免频繁更新不同元素，
  // 使得整个 patch 过程更加高效，减少了 dom 的操作量，提高性能。
  






  function pageSetting (data:MenuDetailType) {

    let params = {
      page: pagination.currentPage,
      pageSize: pagination.pageSize
    }
    if (data.fieldsJson) {
      const fields = evil(data.fieldsJson)

      filterFields.value = disposalField?.(fields, 2) as []// 过滤出查询字段  "use": [2]

      handleOptions(filterFields.value)
      table.header = disposalField?.(fields, 1)  // 过滤出表格展示字段  "use": [1]
      table.header.length > 0 ? showList = true : showInfo.value = true
      getListData(api.value.list, params)
    }
    if (data.extraJson) {
      const extra = evil(data.extraJson)
      actions.value = 'actions' in extra ? evil(extra.actions) : []
    }
  }
  function fetchData () {
    let params = {
      page: pagination.currentPage,
      pageSize: pagination.pageSize
    }
    if (api) {
      getListData(api.value.list, { ...filter, ...params })
    }
  }

  function getListData (url:string, params: apiType) {
    return new Promise((resolve, reject) => {
      baseListFetch({
        apiJson: api.value,
        apiKey: 'list',
        params,
        fetchMethod: fetchMethod?.value
      }).then(({ data }: any) => {
        console.log('data===', data)
        let listData = listDataMap.value ? _.get(data, listDataMap.value) : data // 获取映射数据
        if (listData.list.length < 1 && listData.total > 0) {
          pagination.currentPage = pagination.currentPage - 1
          fetchData()
        } else {
          // resolve(data.pageInfo)
          table.data = listData.list
          pagination.total = listData.total
        }

      }).catch((e: Error) => {
        ElNotification({
          title: '获取数据失败',
          type: 'error',
          message: e.message
        })
      })
    })
  }
  
  
  // 需要在 Index 页面实现的功能:   自定义方法：主要是页面跳转、弹窗展开等
  function handleAction (data: COptionActions<BaseListRow>) {
    emits('action', data)
  }


  // 新增、批量删除等按钮的方法（包括列表操作列上的删除、预览等按钮）
  const toDoActions = useToDo<BaseListRow>({ fetchData, api: api.value, selected: selected, goBack, primaryKey: primaryKey?.value || '' })

  

  function goBack () {
    emits('go-back')
  }

  function handlefilterExpand (msg: boolean) {
    filterExpand.value = msg
  }
  // function handleExpand (val) {
  //   isExpand = val
  // }
  // function handleFilterQuery (value) {
  //   filter = value
  //   handleFilterChange('query')
  // }
  // function hancleClearFilter () {
  //   filter = {}
  // }
  function handleResetSearch () {
    Object.keys(filter).forEach(key => {
      filter[key] = ''
    })
    handleSearch()
  }
  function handleSearch () {
    let params = {
      page: pagination.currentPage,
      pageSize: pagination.pageSize
    }
    // 有可能有问题 api.value.list
    getListData(api.value.list, { ...filter, ...params })
  }


</script>

<style lang="stylus" scoped>
:deep(.content-list)
  margin-top 0
  .el-pagination
    padding 15px 0 0
    margin-top 0
    border none
table
  border 1px solid #EBEEF5
  border-collapse collapse
  width 100%
  font-size 12px
  i
    cursor pointer
  thead
    tr
      th
        color #909399
        text-align left
  tbody
    color #606266
th, td
  border 1px solid #EBEEF5
  padding 8px
:deep(.data-form)
  .el-form-item--small.el-form-item
    margin-bottom 14px
.list-option
  .action-list
    float left
    .el-button-group:empty
      display none
    .el-button-group:not(:empty)
      margin-right 20px
      margin-bottom 14px
  .filter-form
    float left
</style>
