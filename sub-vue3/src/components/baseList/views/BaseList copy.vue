<script setup>
  import { ref, reactive, computed, toRefs, onMounted } from 'vue'
  import { evil } from '@/utils/consts.js'

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
  onMounted(() => {
    console.log('menu222222===', menu)
  })
  let disabled = ref(false)

  let pagination = reactive({
    pageSize: 10,
    currentPage: 1
  })
  let selected = ref([])
  let showInfo = ref(false)
  let showList = ref(false)

  let tableHeader = computed(() => {
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
  })

  let api = computed(() => {
    console.log('menu.value.apiJson====', menu.value)
    return evil(menu.value.apiJson)
  })
  // 权限资源
  let resource = computed(() => {
    return evil(menu.value.extraJson).resource
  })
  // 列表数据映射
  let listDataMap = computed(() => {
    return evil(menu.value.extraJson).listDataMap
  })
  let selectionType = computed(() => {
    return evil(menu.value.extraJson).selectionType
  })
  let primaryKey = computed(() => {
    return primaryKey
  })
  
  
  function selectChange () {
    this.disabled = true
    this.$nextTick(() => {
      this.disabled = false
    })
  }
  function setHeight () {
    const tableEl = this.$refs.table.$refs.table.$el
    const tableRect = tableEl.getBoundingClientRect()
    const height = window.innerHeight - tableRect.top - 76
    this.table.props = {
      'max-height': height,
      'height': height
    }
    this.$refs.table.$refs.table.doLayout()
  }
  function listHeightChange () {
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
  }
  function handleSizeChange (val) {
    this.pageSize = val
    this.fetchData()
  }
  // 页码变更, 如第1页变成第2页时,val=2
  function handleCurrentChange (val) {
    this.currentPage = val
    this.fetchData()
  }
  function handleRowSelectionAdd (targetItem) {
    this.selected.push(targetItem)
    this.updateTableSelected()
  }
  function handleRowSelectionRemove (targetItem) {
    this.selected = this.selected.filter(item => {
      return item[this.primaryKey] !== targetItem[this.primaryKey]
    })
    this.updateTableSelected()
  }
  function handleAllRowSelectionChange (value) {
    if (value) {
      this.table.data.forEach(this.handleRowSelectionAdd)
    } else {
      this.handleAllRowSelectionRemove()
    }
  }
  function handleAllRowSelectionRemove () {
    const currentPageSelected = this.table.data.map(e => {
      return e[this.primaryKey]
    })
    this.selected = this.selected.filter(e => {
      return !currentPageSelected.includes(e[this.primaryKey])
    })
    this.table.selected = []
  }
  function updateTableSelected () {
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
  }
  function clearSelected () {
    this.selected = []
    this.table.selected = []
    this.updateTableSelected()
  }
  function handleFilterChange (type) {
    if (type === 'query') {
      if (this.pagination) {
        this.pagination.currentPage = 1
      }
    }
    this.fetchData()
  }
  function parseFilter () {
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
  
  defineExpose({
    aaa: 1,
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
    primaryKey,
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
  })
</script>
