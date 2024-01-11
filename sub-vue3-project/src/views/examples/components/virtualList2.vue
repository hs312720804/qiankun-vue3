<template>
  <div
    ref="list"
    style="height: 500px; border: 1px solid red"
    class="infinite-list-container"
    @scroll="scrollEvent($event)"
  >
    <div ref="phantom" class="infinite-list-phantom"></div>
    <div ref="content" class="infinite-list">
      <div
        class="infinite-list-item"
        :ref="setRef"
        :id="item._index"
        :key="item._index"
        v-for="item in visibleData"
      >
        <!-- {{ item.item }} -->
        <!-- <slot ref="slot" :item="item.item"></slot> -->
        <Item :item="item.item"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, toRefs, ref, reactive, onMounted, onUpdated, nextTick, onBeforeUpdate } from 'vue'
import Item from './item.vue'

const props = defineProps({
  // 所有列表数据
  listData: {
    type: Array,
    default: () => []
  },
  // 预估高度
  estimatedItemSize: {
    type: Number,
    required: true
  },
  // 容器高度 100px or 50vh
  height: {
    type: String,
    default: '100%'
  }
})

// ----------------- props & data ----------------
const { listData, estimatedItemSize, height } = toRefs(props)
// console.log('listData', listData.value.length)
// 可视区域高度
const screenHeight = ref(0)
// 起始索引
const start = ref(0)
// 结束索引
const end = ref(50)

let positions = reactive([])

const list = ref(null)
const phantom = ref(null)
const content = ref(null)

const items = ref([])
const setRef = (el) => {
  console.log('el.id', el)
  console.log('items.value-->', items.value)
  if (el && !items.value[el.id]) {
    items.value.push(el)
  }
}
// ----------------- props & data --end--------------

// -----------------computed----------------

const _listData = computed(() =>
  listData.value.map((item, index) => {
    return {
      _index: `_${index}`,
      item
    }
  })
)
// 可显示的列表项数
const visibleCount = computed(() => Math.ceil(screenHeight.value / estimatedItemSize.value))
// 获取真实显示列表数据
const visibleData = computed(() => _listData.value.slice(start.value, end.value))

console.log('visibleData--------->', visibleData)
// -----------------computed end----------------

// -----------------method----------------
// function scrollEvent () {
//   // 当前滚动位置
//   const scrollTop = list.value.scrollTop
//   // 此时的开始索引
//   start.value = Math.floor(scrollTop / itemSize.value)
//   // 此时的结束索引
//   end.value = start.value + visibleCount.value
//   // 此时的偏移量
//   startOffset = scrollTop - (scrollTop % itemSize.value)
// }
initPositions()

function initPositions () {
  positions = listData.value.map((d, index) => ({
    index,
    height: estimatedItemSize.value,
    top: index * estimatedItemSize.value,
    bottom: (index + 1) * estimatedItemSize.value
  }))

  console.log('estimatedItemSize----------->', estimatedItemSize)
  console.log('positions----------->', positions)
}

// 获取列表起始索引
function getStartIndex (scrollTop = 0) {
  // 二分法查找
  return binarySearch(positions, scrollTop)
}
// 二分法查找
function binarySearch (list, value) {
  let start = 0
  let end = list.length - 1
  let tempIndex = null
  while (start <= end) {
    const midIndex = parseInt((start + end) / 2)
    const midValue = list[midIndex].bottom
    if (midValue === value) {
      return midIndex + 1
    } else if (midValue < value) {
      start = midIndex + 1
    } else if (midValue > value) {
      if (tempIndex === null || tempIndex > midIndex) {
        tempIndex = midIndex
      }
      end = end - 1
    }
  }
  return tempIndex
}
// 获取列表项的当前尺寸
function updateItemsSize () {
  const nodes = items
  console.log('nodes--->', nodes)
  nodes.value.forEach(node => {
    const rect = node.getBoundingClientRect()
    const height = rect.height
    const index = +node.id.slice(1)
    const oldHeight = positions[index].height
    const dValue = oldHeight - height
    // 存在差值
    if (dValue) {
      positions[index].bottom = positions[index].bottom - dValue
      positions[index].height = height

      for (let k = index + 1; k < positions.length; k++) {
        positions[k].top = positions[k - 1].bottom
        positions[k].bottom = positions[k].bottom - dValue
      }
    }
  })
}
// 获取当前的偏移量
function setStartOffset () {
  const startOffset = start.value >= 1 ? positions[start.value - 1].bottom : 0

  content.value.style.transform = `translate3d(0,${startOffset}px,0)`
}

// 滚动事件
function scrollEvent () {
  // console.log('------ scrollEvent ------')
  // 当前滚动位置
  const scrollTop = list.value.scrollTop

  // 此时的开始索引
  start.value = getStartIndex(scrollTop)
  // 此时的结束索引
  end.value = start.value + visibleCount.value
  // 此时的偏移量
  setStartOffset()
}

// -----------------method end----------------

onMounted(() => {
  console.log('items--------->', items.value)

  // screenHeight.value = $el.clientHeight
  screenHeight.value = 500
  start.value = 0
  end.value = start.value + visibleCount.value
})
// ref 获取 v-for 遍历的DOM元素，需要在组件更新的时候重置接受dom元素的数组。
onBeforeUpdate(() => {
  items.value = []
})
onUpdated(() => {
  nextTick(() => {
    console.log('items---------------->', items)
    if (!items.value || !items.value.length) {
      return
    }
    // 获取真实元素大小，修改对应的尺寸缓存
    updateItemsSize()
    // 更新列表总高度
    const height = positions[positions.length - 1].bottom
    phantom.value.style.height = height + 'px'
    // 更新真实偏移量
    setStartOffset()
  })
})
</script>

<style scoped>
.infinite-list-container {
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
}

.infinite-list-item {
  padding: 5px;
  color: #555;
  box-sizing: border-box;
  border-bottom: 1px solid #999;
  /* height:200px; */
}
</style>
