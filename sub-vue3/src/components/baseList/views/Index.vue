<template>
  <div class="page-code--child">
    <div style="position:relative">
      <ResourceList
        ref="list"
        :style="{'visibility': isShowList ? 'visible' : 'hidden'}"
        :menu="menuDetail"
        v-if="menuDetail"
        @option="handleOption"
        @action="handleAction"
      ></ResourceList>
      <!-- <ResourceContent
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
      ></ResourceContent> -->
    </div>
  </div>
</template>
<script setup lang="ts">
  import { toRefs, getCurrentInstance, ref, provide } from 'vue'
  import ResourceList from './List.vue'
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
  // -------初始化---------start
  // const instance = getCurrentInstance() as any; //获取上下文实例，ctx = vue2的this
  // const globalProperties = instance.appContext.config.globalProperties

  const { menuId, menuDetailMethod, fetchMethod, handleResource } = toRefs(props) as any //  获取 props 传参
  let menuDetail = ref()
  let primaryKey = ref<string>('')
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
  console.log('primaryKey===', primaryKey)
  
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

  
  
  
  

  

  // defineExpose({
  //   disposalField
  // })

  // const handleUpsertEnd = () => {
  //   this.isShowList = true
  //   this.mode = 'list'
  //   this.$refs.list.fetchData()
  // }

  // const handleOption = (data) => {
  //   this.template = data.option[2]
  //   this.title = data.option[0]
  //   this.mode = data.option[3]
  //   if ('row' in data) {
  //     this.row = data.row
  //     this.id = data.row[primaryKey.value]
  //   }
  //   this.optionType = data.option[1]
  //   if (data.option[1] === 'Page') {
  //     this.isShowList = false
  //   }
  //   if (data.option[1] === 'Dialog') {
  //     this.dialogVisible = true
  //     this.$nextTick(() => {
  //       this.$refs.dialogForm.fetchData && this.$refs.dialogForm.fetchData()
  //     })
  //   }
  // }

  // const handleAction = (data) => {
  //   this.template = data.option[2]
  //   this.title = data.option[0]
  //   this.mode = data.option[4]
  //   if ('row' in data) {
  //     this.id = data.row[primaryKey.value]
  //   }
  //   if ('selected' in data) {
  //     this.selected = data.selected
  //   }
  //   this.optionType = data.option[1]
  //   if (data.option[1] === 'Page') {
  //     this.isShowList = false
  //   }
  //   if (data.option[1] === 'Dialog') {
  //     this.dialogVisible = true
  //   }
  // }

  // const goBack = () => {
  //   this.isShowList = true
  //   this.mode = 'list'
  //   this.optionType = ''
  //   this.id = undefined
  // }

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
