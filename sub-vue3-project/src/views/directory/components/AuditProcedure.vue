<template>
  <div>
    <el-button
      v-if="processRoles.length < MAX_AUDIT_PROCESS"
      type="primary"
      :icon="Plus"
      @click="addProcessRoles"
    >
      审核流程
    </el-button>
    <div class="procedure" v-if="processRoles.length">
      <div
        class="procedure-item"
        v-for="(item, index) in processRoles"
        :key="index"
      >
        <div class="name">
          {{ numberChinese(index + 1) }}级审核
          <!-- <span
            v-if="processRoles.length > 1"
            class="el-icon-delete"
            @click="delProcessRoles(index)"
            style="cursor: pointer"
          ></span> -->
          <el-icon
            v-if="processRoles.length > 1"
            class="el-icon-delete"
            @click="delProcessRoles(index)"
            style="cursor: pointer"
          ><Delete /></el-icon>
        </div>
        <div class="select">
          <el-select
            v-model="item.roleId"
            placeholder="请选择审核角色"
            size="mini"
            class="select-custom"
            filterable
            @change="val=>changeProcessRoles(processRoles[index],val)"
          >
            <el-option
              v-for="(data, key) in roles"
              :key="key"
              :label="data.policyName"
              :value="data.id"
              :disabled="getAvailableRole(data.id)"
            ></el-option>
          </el-select>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, toRefs } from 'vue'
import { numberChinese, getEnumFieldOptions } from '@/utils/comm.ts'
import { evil, MAX_AUDIT_PROCESS } from '@/utils/consts.js'
import { Plus, Delete } from '@element-plus/icons-vue'

const props = defineProps({
  id: {
    required: true,
    type: Number,
    default: null
  },
  menu: {
    required: true,
    type: Object,
    default () {
      return { }
    }
  },
  roles: {
    type: Array,
    default: () => []
  },
  processRoles: {
    type: Array,
    default: () => []
  }
})

const { menu, roles, processRoles } = toRefs(props)
console.log('role===', roles)
console.log('processRoles===', processRoles)
const modelList = ref([])
const apiJson = computed(() => {
  return evil(menu.value.apiJson)
})

const fieldsJson = () => {
  return evil(menu.value.fieldsJson)
}
const statusOptions = () => {
  return getEnumFieldOptions(fieldsJson.value, 'auditStatus')
}

const statusText = () => {
  const textMap = {}
  statusOptions.value.forEach(ele => {
    textMap[ele.value] = ele.label
  })
  return textMap
}
function getRoleById (roleId) {
  return roles.value.find(ele => ele.id === roleId)
}
function addProcessRoles () {
  processRoles.value.push({
    auditLevel: processRoles.value.length + 1,
    // id: undefined, // 自增ID
    roleId: undefined,
    roleName: ''
  })
}
function delProcessRoles (index) {
  // $delete(props.processRoles, index)
  processRoles.value.splice(index, 1)
}
function changeProcessRoles (item, id) {
  const role = getRoleById(id)
  item.roleName = role.policyName
}
function getAvailableRole (id) {
  const arr = processRoles.value.map(item => item.roleId)
  return arr.includes(id)
}
// export default defineComponent({
//   props: {
//     roles: {
//       required: true,
//       type: Array,
//       default () {
//         return []
//       }
//     },
//     processRoles: {
//       required: true,
//       type: Array,
//       default () {
//         return []
//       }
//     }
//   },
//   setup (props) {
//     function getRoleById (roleId) {
//       return props.roles.find(ele => ele.id === roleId)
//     }
//     function addProcessRoles () {
//       props.processRoles.push({
//         auditLevel: props.processRoles.length + 1,
//         // id: undefined, // 自增ID
//         roleId: undefined,
//         roleName: ''
//       })
//     }
//     function delProcessRoles (index) {
//       this.$delete(props.processRoles, index)
//     }
//     function changeProcessRoles (item, id) {
//       const role = getRoleById(id)
//       item.roleName = role.policyName
//     }
//     function getAvailableRole (id) {
//       const arr = props.processRoles.map(item => item.roleId)
//       return arr.includes(id)
//     }
//     return {
//       MAX_AUDIT_PROCESS,
//       addProcessRoles,
//       delProcessRoles,
//       changeProcessRoles,
//       getAvailableRole,
//       numberChinese
//     }
//   }
// })
</script>
<style lang="stylus" scoped>
.procedure
  display flex
  border-top 1px solid #DCDFE6
  border-left 1px solid #DCDFE6
  margin-top 10px
  .name
    border-bottom 1px solid #DCDFE6
    text-align center
    line-height 30px
    font-size 13px
    color #666
  .select
    padding 5px
  .procedure-item
    flex 1
    border-right 1px solid #DCDFE6
    border-bottom 1px solid #DCDFE6
.select-custom
  width 100%
</style>
