<template>
  <div>
    <c-card ref="contentCard" class="content">
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
  import { computed, ref, reactive, toRefs, onMounted, inject } from 'vue'
  import { evil } from '@/utils/consts.js'
  import {baseListFetch} from '@/utils/listFetch.js'
  // import Index from './Index.vue'
  // import helloword from './HelloWorld.vue'
  import useBaseList from './useBaseList'
  import { ElNotification } from 'element-plus'
  import _ from 'lodash'
  import Actions from './Actions.vue'
  import useToDo from './mixin/listActions'
  import { MenuDetailType} from '@/services/menu'
 
  const primaryKey = inject<String>('primaryKey')
  const disposalField = inject<Function>('disposalField')
  const fetchMethod = inject<Function>('fetchMethod')
  const handleResource = inject<Function>('handleResource')

  // -------初始化---------start
  
  const emits = defineEmits(['action', 'todo', 'go-back'])
  const props = defineProps({
    menuId: {
      type: Number
    },
    menu: {
      type: Object,
      default: {}
    }
  })
  defineExpose({
    fetchData
  })

  
  let { menu } = toRefs(props)
  
  const $route = useRoute()

  let filterFields = ref([])
  let filter = reactive({})
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


  const tableType = computed(() => {
    if (evil(menu.value.extraJson).tableType) {
      return evil(menu.value.extraJson).tableType
    } else {
      return 'list'
    }
  })
  const menuValue:MenuDetailType = menu.value

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
  } = useBaseList(menuValue, primaryKey, table, handleResource, fetchData, handleTodo, handleAction )

  console.log('listDataMap', listDataMap)
  /**
   * 处理选项filterFields数据
   * @param options = this.filterFields
   * */
  const handleOptions = async (options) => {
    console.log('options==', options)
    let apiOptions = []
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
                fetchMethod({
                  url: item.optionsApi.url,
                  method: item.optionsApi.method || 'get'
                }).then(({ data }) => {
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
    console.log('apiOptions===', apiOptions)
    for (let i = 0; i < apiOptions.length; i++) {
      const option = apiOptions[i]
      const newOptions = []
      option.httpData.forEach(item => {
        newOptions.push({
          label: item[option.labelKey],
          value: item[option.valueKey],
          item
        })
      })
      filterFields[option.resourceIndex].options = newOptions
    }
  }

  pageSetting(menu.value)
  
  // -------初始化---------end

  

  function pageSetting (data) {
    let params = {
      page: pagination.currentPage,
      pageSize: pagination.pageSize
    }
    if (data.fieldsJson) {
      const fields = evil(data.fieldsJson)
      filterFields = disposalField(fields, 2) // 过滤出查询字段  "use": [2]
      handleOptions(filterFields)
      table.header = disposalField(fields, 1)  // 过滤出表格展示字段  "use": [1]
      table.header.length > 0 ? showList = true : showInfo = true
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

  function getListData (url:string, params) {
    return new Promise((resolve, reject) => {
      console.log('baseListFetch===', baseListFetch)
      
      baseListFetch({
        apiJson: api.value,
        apiKey: 'list',
        params,
        fetchMethod: fetchMethod.value
      }).then(({ data }) => {
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

      }).catch(e => {
        ElNotification({
          title: '获取数据失败',
          type: 'error',
          message: e.message
        })
      })
    })
  }
  
  
  // 需要在 Index 页面实现的功能:   自定义方法：主要是页面跳转、弹窗展开等
  function handleAction (data) {
    emits('action', data)
  }

  type BaseListRow = { [key: string]: any; }
  // 新增、批量删除等按钮的方法（包括列表操作列上的删除、预览等按钮）
  const toDoActions = useToDo<BaseListRow>({ fetchData, api: api.value, selected: selected.value, goBack, primaryKey: primaryKey.value })

  // 在当前页面就能实现的功能:   主要是批量删除、删除、编辑等 
  function handleTodo (data: any) {
    const { row = '', option } = data
    const operate = option[2]
    toDoActions[operate as CToDoActionNotRow](row)
  }

  function goBack () {
    emits('go-back')
  }

  function handlefilterExpand (msg) {
    filterExpand = msg
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
    getListData(api.list, { ...filter, ...params })
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
