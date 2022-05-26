<script lang="ts">
import { ElButton, ElButtonGroup } from 'element-plus'
import { defineComponent, PropType, h, resolveDirective, withDirectives, Directive } from 'vue'
export default defineComponent({
  name: 'ListActions',
  props: {
    resource: {
      type: String,
      default: ''
    },
    actions: {
      type: Array as PropType<CButtonAction[]>,
      default: () => {
        return []
      }
    }
  },
  emits: {
    todo: (option: CButtonActionList) => true,
    action: ({ option }: { option: CButtonActionList; }) => true
  },
  render () {
    // let arr = ["新建:Page:Edit:add:edit","删除:Todo:batchDelete:delete","刷新:Todo:handleRefresh:select"]
    const buttons = this.actions.map((item, index) => {
      let option = item.split(':') as CButtonActionList
      // if (this.access.indexOf(option[3]) > -1) {
      // https://v3.cn.vuejs.org/api/global-api.html#withdirectives
      return h(
          ElButton,
          {
            type: 'primary',
            // // 不与权限关联时不需要指令，mode的索引变成3
            // directives: [{
            //   name: 'permission',
            //   value: `${this.resource}:${option[3]}`
            // }],
            onClick: () => {
              if (option[1] === 'Todo') {
                this.$emit('todo', option)
              } else {
                this.$emit('action', { option })
              }
            }
          },
          option[0]
        )
      // }
    })
    return h(ElButtonGroup, {}, buttons)
  }
})
</script>
