<template>
  <div>
    <c-card
      :title="title"
      @go-back="$emit('go-back')"
      v-if="!showIcon"
      class="add-page"
    >
      <component
        :is="templateComponents[pageName]"
        :mode="mode"
        :id="id"
        :menu-id="menuId"
        :menu="menu"
        @upsert-end="$emit('upsert-end')"
        @go-back="$emit('go-back')"
      >
      </component>
    </c-card>
  </div>
</template>
<script>
import DefaultPages from './pages/index.js'
import { Message } from 'element-ui'
export default {
  inject: ['baseIndex'],
  components: {},
  data () {
    return {
      showIcon: false,
      templateComponents: {
        ...this.baseIndex.handleResource.pages,
        ...DefaultPages
      }
    }
  },
  props: ['id', 'menuId', 'menu', 'mode', 'template', 'title', 'optionType', 'selected'],
  computed: {
    pageName () {
      const pageName = this.template + this.optionType
      if (this.templateComponents[pageName]) { // 判断Page是否已存在，如不存在使用默认Page, 并提示
        return pageName
      } else {
        Message.warning(`不存在${pageName}，请检查是否已传入，将使用DefaultPage。`)
        return 'DefaultPage'
      }
    }
  },
  created () {
  }
}
</script>
<style lang="stylus" scoped>
.show-one-line
  display flex
  >>> button
    height 32px
    margin-left 10px
.el-dialog--height
  max-height 400px
  overflow auto
</style>
