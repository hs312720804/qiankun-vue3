<template>
  <div>
    <c-card
      :title="title"
      @go-back="emits('go-back')"
      v-if="!showIcon"
      class="add-page"
    >
      <component
        :is="templateComponents[pageName]"
        :mode="mode"
        :id="id"
        :menu-id="menuId"
        :menu="menu"
        @upsert-end="emits('upsert-end')"
        @go-back="emits('go-back')"
      >
      </component>
    </c-card>
  </div>
</template>
<script setup lang="ts">
import DefaultPages from './pages/index.ts'
import { ElMessage } from 'element-plus'
import { inject, computed, ref, toRefs } from 'vue'
import { handleResourceKey } from './injection.ts'


// const handleResource = inject<handleResourceType>('handleResource')
const handleResource = inject(handleResourceKey, {} as handleResourceType)


const props = defineProps({
  id: {
    type: Number
  },
  menuId: {
    type: Number
  },
  menu: {
    type: Object
  },
  mode: {
    type: String,
    default: ''
  },
  template: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  optionType: {
    type: String,
    default: ''
  },
  selected: {
    type: Array,
    default: () => []
  }
})
const emits = defineEmits(['go-back', 'upsert-end'])

const { template,optionType } = toRefs(props)
// props: ['id', 'menuId', 'menu', 'mode', 'template', 'title', 'optionType', 'selected'],
let templateComponents = computed(() => {
  return {
    ...handleResource?.value.pages,
    ...DefaultPages
  }
})
let pageName = computed(() => {
  const pageName = template.value + optionType.value
  console.log(templateComponents)
  console.log(template)
  console.log(optionType)
  console.log('pageName===', pageName)
  if (templateComponents.value[pageName]) { // 判断Page是否已存在，如不存在使用默认Page, 并提示
    return pageName
  } else {
    ElMessage.warning(`不存在${pageName}，请检查是否已传入，将使用DefaultPage。`)
    return 'DefaultPage'
  }
})
let showIcon = ref(false)
// export default {
//   inject: ['baseIndex'],
//   components: {},
//   data () {
//     return {
//       showIcon: false,
//       templateComponents: {
//         ...this.baseIndex.handleResource.pages,
//         ...DefaultPages
//       }
//     }
//   },
//   props: ['id', 'menuId', 'menu', 'mode', 'template', 'title', 'optionType', 'selected'],
//   computed: {
//     pageName () {
//       const pageName = this.template + this.optionType
//       if (this.templateComponents[pageName]) { // 判断Page是否已存在，如不存在使用默认Page, 并提示
//         return pageName
//       } else {
//         ElMessage.warning(`不存在${pageName}，请检查是否已传入，将使用DefaultPage。`)
//         return 'DefaultPage'
//       }
//     }
//   },
//   created () {
//   }
// }
</script>
<style lang="stylus" scoped>
.show-one-line
  display flex
  :deep(button)
    height 32px
    margin-left 10px
.el-dialog--height
  max-height 400px
  overflow auto
</style>
