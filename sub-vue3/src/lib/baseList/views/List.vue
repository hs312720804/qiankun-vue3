<template>
  <c-card ref="contentCard" class="content">
    <div v-show="showInfo">{{ $t('message.pageConfiguration') }}</div>
    <c-content-wrapper
      v-show="showList"
      :filter="filter"
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
            @action="actionOption"
            @todo="actionTodo"
          ></Actions>
        </div>
        <template v-if="filterFields.length > 0">
          <c-list-filter
            ref="expandForm"
            :options="filterFields"
            :length="3"
            :form-data="filter"
            :is-expand="filterExpand"
            :button-text="buttonText"
            :hidden-expand-button="filterFields.length <= 3"
            v-if="!filterExpand"
            @filter="handleSearch"
            @reset="handleResetSearch"
            @filter-expand="handlefilterExpand"
          >
          </c-list-filter>
        </template>
      </div>
      <div class="filter-expand">
        <c-list-filter
          ref="expandForm"
          :options="filterFields"
          :form-data="filter"
          :is-expand="filterExpand"
          :button-text="buttonText"
          v-if="filterExpand"
          @filter="handleSearch"
          @reset="handleResetSearch"
          @filter-expand="handlefilterExpand"
        >
        </c-list-filter>
      </div>
      <c-table
        :key="$route.path"
        v-if="tableType==='list'"
        :props="table.props"
        ref="table"
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
        ref="table"
        :header="tableHeader"
        :data="table.data"
        :selected="table.selected"
        :selection-type="selectionType"
        @row-selection-add="handleRowSelectionAdd"
        @row-selection-remove="handleRowSelectionRemove"
        @all-row-selection-change="handleAllRowSelectionChange"
      ></c-table-tree>
    </c-content-wrapper>
  </c-card>
</template>
<script>
import BaseList from './BaseList'
import Actions from './Actions.vue'
import listActions from './mixin/listActions'
// import { renderMethods } from './renderMethods'
import _ from 'lodash'
export default {
  extends: BaseList,
  components: {
    Actions
  },
  data () {
    return {
      filterFields: [],
      filter: {},
      isExpand: false,
      filterExpand: false,
      filterType: '',
      filterTypeLabel: '',
      buttonText: {
        query: this.$t('btn.search'),
        reset: this.$t('btn.reset'),
        expand: this.$t('btn.expand'),
        packUp: this.$t('btn.packUp')
      },
      table: {
        props: {
          border: true,
          stripe: true
        },
        header: [],
        data: [],
        selected: []
      },
      template: '',
      actions: [],
      actionsMethods: {}
    }
  },
  computed: {
    tableType () {
      if (this.$constants.evil(this.menu.extraJson).tableType) {
        return this.$constants.evil(this.menu.extraJson).tableType
      } else {
        return 'list'
      }
    }
  },
  created () {
    if (this.tableType === 'tree') {
      let rowKey = this.primaryKey
      this.table.props = {
        'default-expand-all': false,
        'tree-props': { children: 'children' },
        'row-key': rowKey
      }
    }
    this.pageSetting(this.menu)
  },
  methods: {
    // ...renderMethods,
    actionOption (data) {
      this.$emit('action', data)
    },
    actionTodo (msg) {
      const { row, option } = msg
      const actions = { ...this.baseIndex.handleResource.todo, ...listActions.methods } // 合并传入的Todo
      Object.keys(actions).forEach(key => {
        this[key] = actions[key]
      })
      const operate = option[2]
      if (operate.indexOf('(') > -1) { // 判断是否有参数
        const arg = operate.slice(operate.indexOf('(') + 1, operate.indexOf(')'))
        const fun = operate.slice(0, operate.indexOf('('))
        if (this[fun]) {
          this[fun]({ arg, row, option })
        } else {
          this.$message.error('请正确设置操作方法或者联系开发人员')
        }
      } else {
        if (this[option[2]]) {
          this[option[2]](msg)
        } else {
          this.$message.error('请正确设置操作方法或者联系开发人员')
        }
      }
    },
    handleSearch () {
      let params = {
        page: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      }
      this.getListData(this.api.list, { ...this.filter, ...params })
    },
    handleResetSearch () {
      Object.keys(this.filter).forEach(key => {
        this.filter[key] = ''
      })
      this.handleSearch()
    },
    handlefilterExpand (msg) {
      this.filterExpand = msg
    },
    handleExpand (val) {
      this.isExpand = val
    },
    handleFilterQuery (value) {
      this.filter = value
      this.handleFilterChange('query')
    },
    hancleClearFilter () {
      this.filter = {}
    },
    pageSetting (data) {
      let params = {
        page: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      }
      if (data.fieldsJson) {
        const fields = this.$constants.evil(data.fieldsJson)
        this.filterFields = this.baseIndex.disposalField(fields, 2)
        this.handleOptions(this.filterFields)
        this.table.header = this.baseIndex.disposalField(fields, 1)
        this.table.header.length > 0 ? this.showList = true : this.showInfo = true
        this.getListData(this.api.list, params)
      }
      if (data.extraJson) {
        const extra = this.$constants.evil(data.extraJson)
        this.actions = 'actions' in extra ? this.$constants.evil(extra.actions) : []
      }
    },
    getListData (url, params) {
      // const filter = this.parseFilter()
      const _this = this
      return new Promise((resolve, reject) => {
        _this.baseIndex.baseListFetch({
          apiJson: _this.api,
          apiKey: 'list',
          params
        }).then(({ data }) => {
          let listData = this.listDataMap ? _.get(data, this.listDataMap) : data // 获取映射数据
          if (listData.list.length < 1 && listData.total > 0) {
            _this.pagination.currentPage = _this.pagination.currentPage - 1
            _this.fetchData()
          } else {
            // resolve(data.pageInfo)
            this.table.data = listData.list
            this.pagination.total = listData.total
          }
        }).catch(e => {
          this.$notify({
            title: '获取数据失败',
            type: 'error',
            message: e.message
          })
        })
      })
    },
    fetchData () {
      let params = {
        page: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      }
      if (this.api) {
        this.getListData(this.api.list, { ...this.filter, ...params })
      }
    },
    /**
     * 处理选项filterFields数据
     * @param options = this.filterFields
     * */
    async handleOptions (options) {
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
                  this.baseIndex.fetchMethod({
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
