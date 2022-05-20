<template>
  <helloword ref="hello"></helloword>
  <button @click="helloClick">{{ primaryKey }}</button>
  <!-- <BaseList ref="baseList"></BaseList> -->
  <button @click="baseListClick" >baseListClick</button>
  <c-card ref="contentCard" class="content">
    <!-- 111111111111111- {{showList}}
    111111111111111- {{pagination}}
    111111111111111- {{table}} -->
    <!-- {{table}} -->
    <!-- {{pagination}} -->
    <!-- <div style="border: 1px solid red">{{tableHeader}}</div>
    {{table.data}} -->
    <c-content-wrapper
      v-show="showList"
      :pagination="pagination"
      @filter-change="handleFilterChange"
    >
      <c-table
        :key="$route.path"
        v-if="tableType==='list'"
        :props="table.props"
        :header="tableHeader"
        :data="table.data"
        :selected="table.selected"
        :selection-type="selectionType"
        @row-selection-add="handleRowSelectionAdd"
        @row-selection-remove="handleRowSelectionRemove"
        @all-row-selection-change="handleAllRowSelectionChange"
      ></c-table>

      <c-table-tree
        v-if="tableType==='tree'"
        :props="table.props"
        :header="tableHeader"
        :data="table.data"
        :selected="table.selected"
        :selection-type="selectionType"
        @row-selection-add="handleRowSelectionAdd"
        @row-selection-remove="handleRowSelectionRemove"
        @all-row-selection-change="handleAllRowSelectionChange"
      >
      ppppppppppppp</c-table-tree>
    </c-content-wrapper>
  </c-card>
  
</template>
<script setup lang="ts">
  import { useRoute } from 'vue-router'
  import { computed, ref, reactive, toRefs, onMounted, inject } from 'vue'
  import { evil } from '@/utils/consts.js'
  import {baseListFetch} from '@/utils/listFetch.js'
  import Index from './Index.vue'
  import helloword from './HelloWorld.vue'
  import useRepositoryNameSearch from './useRepositoryNameSearch.js'
  import { ElNotification } from 'element-plus'
  import _ from 'lodash'
  // const hello = ref(null)
  // const helloClick = () => {
  //   console.log(hello.value) // 123456
  // }
  const primaryKey = inject('primaryKey')
  const disposalField = inject<Function>('disposalField')
  const fetchMethod = inject<Function>('fetchMethod')
  const handleResource = inject<Function>('handleResource')


  
  // -------初始化---------start
  const props = defineProps({
    menuId: {
      type: Number
    },
    menu: {
      type: Object,
      default: {}
    }
  })

  
  let { menu } = toRefs(props)
  
  const $route = useRoute()

  let filterFields = ref([])
  let filter = reactive({})
  let isExpand = ref(false)
  let filterType = ref<string>('')
  let filterTypeLabel = ref<string>('')
  const buttonText = reactive({
    query: '1',
    reset: '1',
    expand: '1',
    packUp: '1',
  })

  let table = reactive({
    props: {
      border: true,
      stripe: true
    },
    header: [],
    data: [],
    selected: []
  })
  let template = ref<string>('')
  let actions = ref([])
  let actionsMethods = reactive({})


  const tableType = computed(() => {
    if (evil(menu.value.extraJson).tableType) {
      return evil(menu.value.extraJson).tableType
    } else {
      return 'list'
    }
  })

  let {
    disabled,
    pagination,
    selected,
    showInfo,
    showList,
    tableHeader,
    api,
    resource,
    listDataMap,
    selectionType,
    selectChange,
    setHeight,
    listHeightChange,
    handleSizeChange,
    handleCurrentChange,
    handleRowSelectionAdd,
    handleRowSelectionRemove,
    handleAllRowSelectionChange ,
    handleAllRowSelectionRemove,
    updateTableSelected,
    clearSelected,
    handleFilterChange,
    parseFilter
  } = useRepositoryNameSearch(menu, primaryKey, table, handleResource)

  console.log('listDataMap', listDataMap)
  /**
   * 处理选项filterFields数据
   * @param options = this.filterFields
   * */
  const handleOptions = async (options) => {
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
      this.filterFields[option.resourceIndex].options = newOptions
    }
  }

  pageSetting(menu.value)
  // pageSetting(menu)
  
  // -------初始化---------end

  // const baseList = ref(null)
  // const baseListClick = () => {
  //   console.log(baseList.value) // 123456
  // }
  

  

  

  function pageSetting (data) {
    let params = {
      page: pagination.currentPage,
      pageSize: pagination.pageSize
    }
    if (data.fieldsJson) {
      const fields = evil(data.fieldsJson)
      let filterFields = disposalField(fields, 2)
      handleOptions(filterFields)
      table.header = disposalField(fields, 1)
      table.header.length > 0 ? showList = true : showInfo = true
      getListData(api.value.list, params)
    }
    if (data.extraJson) {
      const extra = evil(data.extraJson)
      actions.value = 'actions' in extra ? evil(extra.actions) : []
    }
  }

  function getListData (url:string, params) {
    // const filter = this.parseFilter()
    return new Promise((resolve, reject) => {
      console.log('baseListFetch===', baseListFetch)
      
      baseListFetch({
        apiJson: api.value,
        apiKey: 'list',
        params,
        fetchMethod: fetchMethod.value
      }).then(({ data }) => {
        console.log('data===', data)
        debugger
        let listData = listDataMap.value ? _.get(data, listDataMap.value) : data // 获取映射数据
        if (listData.list.length < 1 && listData.total > 0) {
          pagination.currentPage = pagination.currentPage - 1
          fetchData()
        } else {
          debugger
          // resolve(data.pageInfo)
          table.data = listData.list
          pagination.total = listData.total
        }

        console.log('tableaaa================', table)
      }).catch(e => {
        ElNotification({
          title: '获取数据失败',
          type: 'error',
          message: e.message
        })
      })
    })
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

  


  

</script>

<style lang="stylus" scoped>
>>>.content-list
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
>>>.data-form
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
