<template>
  <!-- 虚拟列表（列表项固定高度） -->
  <div ref="list" class="infinite-list-container" @scroll="scrollEvent($event)" style="height: 500px">
    <div class="infinite-list-phantom" :style="{ height: listHeight + 'px' }"></div>
    <div class="infinite-list" :style="{ transform: getTransform }">
      <div ref="items"
        class="infinite-list-item"
        v-for="item in visibleData"
        :key="item.id"
        :style="{ height: itemSize + 'px',lineHeight: itemSize + 'px' }"
      >{{ item.value }}</div>
    </div>

  </div>
</template>

<script setup>
import { computed, toRefs, ref, onMounted } from 'vue'

const props = defineProps({
  // 所有列表数据
  listData: {
    type: Array,
    default: () => []
  },
  // 每项高度
  itemSize: {
    type: Number,
    default: 200
  }
})

// ----------------- props & data ----------------
const { listData, itemSize } = toRefs(props)
// console.log('listData', listData.value.length)
// 可视区域高度
const screenHeight = ref(0)
// 偏移量
const startOffset = ref(0)
// 起始索引
const start = ref(0)
// 结束索引
const end = ref(50)

const list = ref(null)
// ----------------- props & data --end--------------

// -----------------computed----------------

// 列表总高度
const listHeight = computed(() => listData.value.length * itemSize.value)
// 可显示的列表项数
const visibleCount = computed(() => Math.ceil(screenHeight.value / itemSize.value))
// 偏移量对应的style
const getTransform = computed(() => `translate3d(0,${startOffset.value}px,0)`)
// 获取真实显示列表数据
const visibleData = computed(() => listData.value.slice(start.value, Math.min(end.value, listData.value.length)))
// -----------------computed end----------------

// console.log('listHeight', listHeight)
// console.log('visibleCount', visibleCount)
// console.log('getTransform', getTransform)
// console.log('visibleData', visibleData)
// console.log('start', start)
// console.log('end', end)
// console.log('Math.min(end, listData.value.length)', Math.min(end, listData.value.length))

// -----------------method----------------
function scrollEvent () {
  // 当前滚动位置
  const scrollTop = list.value.scrollTop
  // 此时的开始索引
  start.value = Math.floor(scrollTop / itemSize.value)
  // 此时的结束索引
  end.value = start.value + visibleCount.value
  // 此时的偏移量
  this.startOffset = scrollTop - (scrollTop % itemSize.value)
}
// -----------------method end----------------

onMounted(() => {
  // screenHeight.value = $el.clientHeight
  screenHeight.value = 500
  start.value = 0
  end.value = start.value + visibleCount.value
})

</script>

<style scoped>
.infinite-list-container {
  height: 100%;
  overflow: auto;
  position: relative;
  -webkit-overflow-scrolling: touch;
}

.infinite-list-phantom {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  z-index: -1;
}

.infinite-list {
  left: 0;
  right: 0;
  top: 0;
  position: absolute;
  text-align: center;
}

.infinite-list-item {
  padding: 10px;
  color: #555;
  box-sizing: border-box;
  border-bottom: 1px solid #999;
}

</style>
