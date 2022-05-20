<template>
  <div class="container">
    <c-form
      label-width="150px"
      :model="form"
      ref="form"
      :rules="rules"
      :readonly="isReadonly"
    >
      <div v-if="fields.length > 0">
        <div v-for="(item, key) in fields" :key="key">
          <div
            v-if="item.inputType === 'string'"
            :key="key"
          >
            <c-form-string
              :label="item.label"
              :placeholder="$t('pleaseEnter', [item.label])"
              :rules="setItemRule(item.required)"
              :prop="item.prop"
              v-model="form[item.prop]"
              class="el-item-width"
            ></c-form-string>
          </div>
          <div
            v-if="item.inputType === 'enum'"
          >
            <c-form-enum
              :label="item.label"
              v-model="form[item.prop]"
              :options="item.options"
              :rules="setItemRule(item.required)"
              :prop="item.prop"
              placeholder="请选择"
            ></c-form-enum>
          </div>
          <el-form-item
            v-if="item.inputType === 'date'"
            :label="item.label"
            :rules="setItemRule(item.required)"
          >
            <el-date-picker
              v-model="form[item.prop]"
              type="date"
              :placeholder="$t('pleaseSelect', [$t('date.date')])"
            >
            </el-date-picker>
          </el-form-item>
        </div>
      </div>
      <el-form-item v-if="!isReadonly">
        <el-button type="success" @click="$emit('go-back')">{{ $t('btn.cancel') }}</el-button>
        <el-button type="primary" @click="saveForm">{{ $t('btn.save') }}</el-button>
      </el-form-item>
    </c-form>
  </div>
</template>
<script>
export default {
  inject: ['baseIndex'],
  props: ['mode', 'id', 'menuId', 'menu'],
  data () {
    return {
      roleIdsOption: [],
      defaultProps: {
        children: 'child',
        label: 'name'
      },
      dialogVisible: false,
      isReadonly: false,
      fields: [],
      api: {},
      form: {},
      rules: {
        noEmpty: [
          { required: true, message: this.$t('message.noEmpty'), trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  components: {
  },
  methods: {
    setItemRule (required) {
      const rule = required ? this.rules.noEmpty : []
      return rule
    },
    parseFormField (menu) {
      const fields = this.$constants.evil(menu.fieldsJson)
      this.api = this.$constants.evil(menu.apiJson)
      this.fields = this.baseIndex.disposalField(fields, 3)
      if (this.mode !== 'create' && this.id) {
        this.fetchData()
      }
    },
    fetchData () {
      const params = {}
      params[this.baseIndex.primaryKey] = this.id
      this.baseIndex.baseListFetch({
        apiJson: this.api,
        apiKey: 'detail',
        params
      }).then(({ data }) => {
        // 对enum类型数据进行处理（数字——>字符串）
        this.fields.forEach((item, index) => {
          if (item.inputType === 'enum') {
            data[item.prop] = JSON.stringify(data[item.prop])
          }
        })
        this.form = data
      }).catch((e) => {
        this.$notify.error({
          title: '错误提示',
          message: e.message
        })
      })
    },
    saveForm () {
      this.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          const form = JSON.parse(JSON.stringify(this.form))
          form.id = this.id
          if (form.id) {
            this.baseIndex.baseListFetch({
              apiJson: this.api,
              apiKey: 'update',
              data: form,
              isJSON: false
            }).then(() => {
              this.$message.success(this.$t('message.editSuccess'))
              this.$emit('upsert-end')
            }).catch((e) => {
              this.$notify.error({
                title: '错误提示',
                message: e.message
              })
            })
          } else {
            this.baseIndex.baseListFetch({
              apiJson: this.api,
              apiKey: 'add',
              data: form,
              isJSON: false
            }).then(() => {
              this.$message.success(this.$t('message.newSuccess'))
              this.$emit('upsert-end')
            }).catch((e) => {
              this.$notify.error({
                title: '错误提示',
                message: e.message
              })
            })
          }
        }
      })
    }

  },
  created () {
    this.mode === 'read' ? this.isReadonly = true : this.isReadonly = false
    this.parseFormField(this.menu)
  }
}
</script>
<style lang="stylus" scoped>
.container
  padding-bottom 20px
  padding-left 20px

.el-input
  margin-right 10px

.el-inline
  display inline-block

.el-row .el-input
  display: inline-block
  max-width 300px
  min-width 200px

.el-form-item
  max-width 500px
  min-width 200px

.el-select
  width 100%
</style>
