<script>
import { toBtnConfig } from '@/utils/comm'
export default {
  name: 'ListActions',
  props: {
    resource: {
      type: String,
      default: ''
    },
    actions: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {}
  },
  computed: {
    selectedRow () {
      return this.rows.filter((item, index) => {
        const b = this.selected.some((select, key) => {
          return select === index
        })
        if (b) {
          return item
        }
      })
    }
  },
  methods: {},
  render (createElement) {
    // let arr = ["新建:Page:Edit:add:edit","删除:Todo:batchDelete:delete","刷新:Todo:handleRefresh:select"]
    const h = createElement
    const buttons = this.actions.map((item, index) => {
      const option = item.split(':')
      // // if (this.access.indexOf(option[3]) > -1) {
      const { label, type, powerCode } = toBtnConfig(item)
      return h(
        'el-button',
        {
          props: {
            type: 'primary'
          },
          directives: [{
            name: 'permission',
            value: powerCode
          }],
          on: {
            click: () => {
              if (type === 'Todo') {
                this.$emit('todo', { option })
              } else {
                this.$emit('action', { option })
              }
            }
          }
        },
        label // option[0]
      )
      // }
    })
    return h('el-button-group', {}, buttons)
  }
}
</script>
