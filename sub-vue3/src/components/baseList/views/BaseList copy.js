import { renderMethods } from './renderMethods'
export default {
  inject: ['baseIndex'],
  props: {
    menuId: {
      type: Number
    },
    menu: {
      type: Object,
      default: {}
    }
  },
  data () {
    return {
      disabled: false,
      pagination: {
        pageSize: 10,
        currentPage: 1
      },
      selected: [],
      showInfo: false,
      showList: false
    }
  },
  computed: {
    renderMethods () {
      return {
        ...this.baseIndex.handleResource.renderMethods,
        ...renderMethods
      }
    },
    tableHeader () {
      let header = JSON.parse(JSON.stringify(this.table.header))
      this.table.header.forEach((item, key) => {
        if (typeof item.render === 'string') {
          // 如果是新的按钮生成逻辑，则走 commonOperation 方法
          if (item.btnConfig) {
            header[key].render = this.renderMethods.commonOperation.call(this, item.btnConfig)
          } else if (item.render) {
            const _this = this // eval 中会使用 _this 这个变量，不能删除
            Object.keys(this.renderMethods).forEach(key => {
              _this[key] = this.renderMethods[key].bind(this)
            })
            // eslint-disable-next-line no-eval
            header[key].render = eval('(' + item.render + ')') // todo 源代码，会使用 _this 这个变量
          }
        }

        if (item.inputType === 'enum' && (!('render' in item) || !item.render)) {
          header[key].render = function (h, { row }) {
            const optionsText = {}
            const tagType = ['', 'success', 'info', 'warning', 'danger', 'danger', 'warning', 'success', 'info']
            item.options.forEach(option => {
              optionsText[option.value] = option.label
            })
            let tags = [row[item.prop]]
            if (typeof row[item.prop] === 'string') {
              tags = row[item.prop].split(',')
            }
            const tagVNodes = tags.map(key => h(
              'el-tag',
              {
                style: { margin: '5px' },
                props: {
                  type: tagType[key] || ''
                }
              },
              optionsText[key]
            ))
            return h('div', { style: { lineHeight: '32px' } }, tagVNodes)
          }
        }
        if (item.inputType === 'image' && (!('render' in item) || !item.render)) {
          header[key].render = function (h, { row }) {
            return h(
              'el-image',
              {
                attrs: {
                  src: row[item.prop],
                  fit: 'contain'
                },
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
    },
    api () {
      return this.$constants.evil(this.menu.apiJson)
    },
    resource () { // 权限资源
      return this.$constants.evil(this.menu.extraJson).resource
    },
    listDataMap () { // 列表数据映射
      return this.$constants.evil(this.menu.extraJson).listDataMap
    },
    selectionType () {
      return this.$constants.evil(this.menu.extraJson).selectionType
    },
    primaryKey () {
      return this.baseIndex.primaryKey
    }
  },
  methods: {
    selectChange () {
      this.disabled = true
      this.$nextTick(() => {
        this.disabled = false
      })
    },
    setHeight () {
      const tableEl = this.$refs.table.$refs.table.$el
      const tableRect = tableEl.getBoundingClientRect()
      const height = window.innerHeight - tableRect.top - 76
      this.table.props = {
        'max-height': height,
        'height': height
      }
      this.$refs.table.$refs.table.doLayout()
    },
    listHeightChange () {
      const elTable = document.querySelector('.el-table') ? document.querySelector('.el-table') : ''
      const height = document.querySelector('.el-main').clientHeight
      if (!height) {
        this.table.props = {
          ...this.table.props,
          'max-height': this.$store.state.app.listHeight
        }
        this.tableDoLayout()
      } else {
        elTable.style.maxHeight = (height - 107) + 'px'
      }
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.fetchData()
    },
    // 页码变更, 如第1页变成第2页时,val=2
    handleCurrentChange (val) {
      this.currentPage = val
      this.fetchData()
    },
    handleRowSelectionAdd (targetItem) {
      this.selected.push(targetItem)
      this.updateTableSelected()
    },
    handleRowSelectionRemove (targetItem) {
      this.selected = this.selected.filter(item => {
        return item[this.primaryKey] !== targetItem[this.primaryKey]
      })
      this.updateTableSelected()
    },
    handleAllRowSelectionChange (value) {
      if (value) {
        this.table.data.forEach(this.handleRowSelectionAdd)
      } else {
        this.handleAllRowSelectionRemove()
      }
    },
    handleAllRowSelectionRemove () {
      const currentPageSelected = this.table.data.map(e => {
        return e[this.primaryKey]
      })
      this.selected = this.selected.filter(e => {
        return !currentPageSelected.includes(e[this.primaryKey])
      })
      this.table.selected = []
    },
    updateTableSelected () {
      const table = this.table
      const newSelectedIndex = this.selected.reduce((result, item) => {
        result[item[this.primaryKey]] = true
        return result
      }, {})
      table.selected = table.data.reduce((result, item, index) => {
        if (newSelectedIndex[item[this.primaryKey]]) {
          result.push(index)
        }
        return result
      }, [])
    },
    clearSelected () {
      this.selected = []
      this.table.selected = []
      this.updateTableSelected()
    },
    handleFilterChange (type) {
      if (type === 'query') {
        if (this.pagination) {
          this.pagination.currentPage = 1
        }
      }
      this.fetchData()
    },
    parseFilter () {
      const {
        filter,
        pagination
      } = this
      if (pagination) {
        filter.page = pagination.currentPage
        filter.pageSize = pagination.pageSize
      }
      return filter
    }
  },
  created () {
    // document.onkeypress = (e) => {
    //   this.disabled = false
    //   if (e.keyCode === 13) {
    //     if (typeof (this.fetchData) !== 'undefined') {
    //       this.fetchData()
    //     }
    //   }
    // }
  },
  beforeMount () {
    window.addEventListener('resize', this.setHeight)
  },
  mounted () {
    this.setHeight()
  },
  destroyed () {
    window.removeEventListener('resize', this.setHeight)
  },
  activated () {
    this.listHeightChange()
  }
}
