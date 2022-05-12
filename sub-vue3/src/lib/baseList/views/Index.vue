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
      <ResourceContent
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
      ></ResourceContent>
      <el-dialog
        :title="title"
        :visible.sync="dialogVisible"
        width="50%"
        @close="hiddenDialog"
      >
        <component
          ref="dialogForm"
          :is="dialogComponents[`${template}Dialog`]"
          :mode="mode"
          :id="id"
          :row="row"
          :menu-id="menuId"
          :menu="menuDetail"
          @set-change="handleDialogChange"
          @set-end="hiddenDialog('ok')"
          @set-cancel="hiddenDialog"
        >
        </component>
        <!-- <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">{{ $t('btn.cancel') }}</el-button>
          <el-button type="primary" @click="dialogVisible = false">{{ $t('btn.ok') }}</el-button>
        </span> -->
      </el-dialog>
    </div>
  </div>
</template>
<script>
import ResourceContent from './Page'
import ResourceList from './List'
import DialogPage from './dialog/index.js'
import baseListFetch from '../../utils/listFetch'
export default {
  provide () {
    return {
      baseIndex: this
    }
  },
  components: {
    ResourceList,
    ResourceContent
  },
  props: {
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
  },
  data () {
    return {
      isShowList: true,
      id: undefined,
      mode: 'create',
      template: '',
      title: '',
      row: '',
      menuDetail: '',
      dialogVisible: false,
      dialogComponents: {
        ...this.handleResource.dialogs,
        ...DialogPage
      },
      optionType: '',
      selected: [],
      primaryKey: '', // 主键
      dialogChang: false // 弹窗数据改动后是否有保存，如果已保存设置为true, 关闭弹窗后重新加载页面。
    }
  },
  computed: {
    contentProps () {
      return {
      }
    }
  },
  methods: {
    ...baseListFetch,
    disposalField (fields, useType) {
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
    },
    fetchMenuData (id) {
      this.menuDetailMethod({ id }).then(({ data }) => {
        this.menuDetail = data
        const fields = this.$constants.evil(this.menuDetail.fieldsJson)
        const primaryField = fields.filter((field) => {
          return 'primaryKey' in field && field.primaryKey === 1
        })
        this.primaryKey = primaryField.length > 0 ? primaryField[0].prop : 'id'
      })
    },
    handleUpsertEnd () {
      this.isShowList = true
      this.mode = 'list'
      this.$refs.list.fetchData()
    },
    handleOption (data) {
      this.template = data.option[2]
      this.title = data.option[0]
      this.mode = data.option[3]
      if ('row' in data) {
        this.row = data.row
        this.id = data.row[this.primaryKey]
      }
      this.optionType = data.option[1]
      if (data.option[1] === 'Page') {
        this.isShowList = false
      }
      if (data.option[1] === 'Dialog') {
        this.dialogVisible = true
        this.$nextTick(() => {
          this.$refs.dialogForm.fetchData && this.$refs.dialogForm.fetchData()
        })
      }
    },
    handleAction (data) {
      this.template = data.option[2]
      this.title = data.option[0]
      this.mode = data.option[4]
      if ('row' in data) {
        this.id = data.row[this.primaryKey]
      }
      if ('selected' in data) {
        this.selected = data.selected
      }
      this.optionType = data.option[1]
      if (data.option[1] === 'Page') {
        this.isShowList = false
      }
      if (data.option[1] === 'Dialog') {
        this.dialogVisible = true
      }
    },
    goBack () {
      this.isShowList = true
      this.mode = 'list'
      this.optionType = ''
      this.id = undefined
    },
    hiddenDialog (val) {
      this.$refs.dialogForm.clearForm && this.$refs.dialogForm.clearForm()
      this.mode = 'list'
      this.optionType = ''
      this.id = undefined
      this.dialogVisible = false
      if (val === 'ok' || this.dialogChang) {
        this.$refs.list.fetchData()
      }
      if (this.dialogChang) {
        this.dialogChang = false
      }
    },
    handleDialogChange (msg) {
      this.dialogChang = msg
    }
  },
  created () {
    this.fetchMenuData(this.menuId)
    this.$bus.$on('go-back', () => {
      this.isShowList = true
    })
  }
}
</script>
<style lang="stylus" scoped>
>>>.el-dialog__header
  border-bottom 1px solid #EBEEF5
>>>.el-dialog__body
  padding 20px 20px
>>>.el-main
  height 100vh
</style>
