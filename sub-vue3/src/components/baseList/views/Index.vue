<template>
  <!-- <div>isShowList - {{ isShowList }}</div>
  <div>optionType - {{ optionType }}</div>
  <div>mode - {{ mode }}</div>
  <div>id - {{ id }}</div> -->
  <div class="page-code--child">
    <div style="position:relative">
      <List
        ref="list"
        :style="{'display': isShowList ? 'block' : 'none'}"
        :menu="menuDetail"
        v-if="menuDetail"
        @action="handleAction"
      ></List>

      <Page
        v-if="!isShowList || optionType === 'Confirm'"
        :mode="mode"
        :id="id"
        :menu-id="menuId"
        :menu="menuDetail"
        :template="template"
        :content-props="contentProps"
        :title="title"
        :option-type="optionType"
        :selected="selected"
        @upsert-end="handleUpsertEnd"
        @go-back="goBack"
      ></Page>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { toRefs, getCurrentInstance, ref, provide, nextTick } from 'vue'
  import List from './List.vue'
  import Page from './Page.vue'
  import { evil } from '@/utils/consts.js'

  const props = defineProps({
    menuId: {
      type: Number
    },
    type: {
      type: String,
      default: ''
    },
    fetchMethod: {
      type: Function,
      default: () => {}
    },
    menuDetailMethod: {
      type: Function,
      default: () => {}
    },
    handleResource: {
      type: Object,
      default: () => {
        return {
          pages: {},
          dialogs: {},
          todo: {},
          renderMethods: {}
        }
      }
    }
  })
  console.log('props=====', props)
  // -------初始化---------start
  // const instance = getCurrentInstance() as any; //获取上下文实例，ctx = vue2的this
  // const globalProperties = instance.appContext.config.globalProperties

  const { menuId, menuDetailMethod, fetchMethod, handleResource } = toRefs(props) as any //  获取 props 传参

  let isShowList = ref(true)
  let id = ref()
  let mode = ref('create')
  let template = ref('')
  let title = ref('')
  let dialogVisible = ref(false)
  let optionType = ref('')
  let selected = ref([])
  // let dialogChang = ref(false) // 弹窗数据改
  let menuDetail = ref()
  let primaryKey = ref<string>('')// 主键

  const disposalField = (fields, useType) => {
    return fields.filter((item) => {
      if ('use' in item && item.use.length > 0) {
        const bool = item.use.some((num) => {
          return num === useType
        })
        if (bool) {
          return item
        }
      } else {
        return item
      }
    })
  }

  provide('primaryKey', primaryKey)
  provide('disposalField', disposalField)
  provide('fetchMethod', fetchMethod)
  provide('handleResource', handleResource)

  fetchMenuData(menuId.value)

  // -------初始化---------end

  function fetchMenuData (id: Number) {
    menuDetailMethod.value({ id }).then(({ data }: any) => {
      menuDetail.value = data
      const fields = evil(menuDetail.value.fieldsJson)
      const primaryField = fields.filter((field: any) => {
        return 'primaryKey' in field && field.primaryKey === 1
      })
      primaryKey.value = primaryField.length > 0 ? primaryField[0].prop : 'id'
    })
  }

  const list = ref()
  const handleUpsertEnd = () => {
    isShowList.value = true
    mode.value = 'list'
    console.log('list===', list)
    list.value.fetchData()
  }

  const dialogForm = ref()

  // const handleOption = (data) => {
  //   template.value = data.option[2]
  //   title.value = data.option[0]
  //   mode.value = data.option[3]
  //   if ('row' in data) {
  //     row = data.row
  //     id.value = data.row[primaryKey.value]
  //   }
  //   optionType.value = data.option[1]
  //   if (data.option[1] === 'Page') {
  //     isShowList.value = false
  //   }
  //   if (data.option[1] === 'Dialog') {
  //     dialogVisible.value = true
  //     nextTick(() => {
  //       dialogForm.value.fetchData && dialogForm.value.fetchData()
  //     })
  //   }
  // }
  // handleOption  -- 表格里面的自定义方法：主要是页面跳转、弹窗展开等需要在 Index 页面实现的功能
  // handleOption 和 handleAction 合并成一个函数
  const handleAction = (data: any) => {
    template.value = data.option[2]
    title.value = data.option[0]
    mode.value = data.option[3] || data.option[4]

    if ('row' in data) {
      id.value = data.row[primaryKey.value]
    }
    if ('selected' in data) {
      selected = data.selected
    }
    optionType.value = data.option[1]
    if (data.option[1] === 'Page') {
      isShowList.value = false
    }
    if (data.option[1] === 'Dialog') {
      dialogVisible.value = true
    }
  }


  const goBack = () => {
    isShowList.value = true
    mode.value = 'list'
    optionType.value = ''
    id.value = undefined
  }

  // const hiddenDialog = (val) => {
  //   this.$refs.dialogForm.clearForm && this.$refs.dialogForm.clearForm()
  //   this.mode = 'list'
  //   this.optionType = ''
  //   this.id = undefined
  //   this.dialogVisible = false
  //   if (val === 'ok' || this.dialogChang) {
  //     this.$refs.list.fetchData()
  //   }
  //   if (this.dialogChang) {
  //     this.dialogChang = false
  //   }
  // }

  // const handleDialogChange = (msg) => {
  //   this.dialogChang = msg
  // }

  
</script>

<style lang="stylus" scoped>
:deep(.el-dialog__header){
  border-bottom 1px solid #EBEEF5
}
:deep(.el-dialog__body)
  padding 20px 20px
:deep(.el-main)
  height 100vh
</style>
