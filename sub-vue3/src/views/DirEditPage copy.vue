<template>
<el-form class="modelForm" ref="modelFormEl" :model="modelState.data" :rules="modelState.rules" label-width="120px">
  <el-form-item v-if="isRootDir" label="AppID" prop="appId">
    <span>{{modelState.data.appId}}<span class="text__edit ml10" @click="handleCopy(modelState.data.appId)">复制</span></span>
    <!-- <el-input v-model="modelState.data.appId" disabled>
      <span class="text__edit" slot="suffix" @click="handleCopy(modelState.data.appId)">复制</span>
    </el-input> -->
  </el-form-item>
  <el-form-item v-if="isRootDir" label="AppSecret" prop="appSecret">
    <span>{{modelState.data.appSecret}}<span class="text__edit ml10" @click="handleCopy(modelState.data.appSecret)">复制</span></span>
    <el-button v-if="isEdit" type="text" class="ml10" @click="updateAppIdSecret">重新生成</el-button>
    <!-- <el-input v-model="modelState.data.appSecret" disabled>
      <span class="text__edit" slot="suffix" @click="handleCopy(modelState.data.appSecret)">复制</span>
    </el-input> -->
  </el-form-item>
  <el-form-item label="目录名称" prop="dirName">
    <el-input v-model="modelState.data.dirName" :disabled="isEdit" placeholder="请输入英文、数字、下划线组成的字符串"></el-input>
  </el-form-item>
  <el-form-item label="中文名称" prop="dirShowName">
    <el-input v-model="modelState.data.dirShowName"></el-input>
  </el-form-item>
  <el-form-item v-if="isRootDir" label="审核配置" prop="auditType">
    <el-radio-group v-model="modelState.data.auditType">
      <el-radio v-for="auditType in auditTypeOptions" :key="auditType.value" :label="Number(auditType.value)" >{{auditType.label}}</el-radio>
    </el-radio-group>
  </el-form-item>
  <el-form-item v-if="isRootDir && isSelfAudit" label="审核流程设置" prop="selfAuditLevelVO">
    <!-- <audit-procedure :roles="modelState.roleList" :process-roles="modelState.data.selfAuditLevelVO"></audit-procedure> -->
  </el-form-item>
  <el-form-item v-if="isRootDir" label="回调地址" prop="callbackUrl">
    <el-input v-model="modelState.data.callbackUrl"></el-input>
  </el-form-item>
  <el-form-item v-if="isRootDir" label="域名配置" prop="domainName">
    <el-input v-model="modelState.data.domainName"></el-input>
  </el-form-item>
  <el-form-item v-if="isRootDir" label="查阅权限">
    <el-transfer
      filterable
      filter-placeholder="请输入角色名称"
      :titles="['所有角色', '允许查询的角色']"
      :props="{
        key: 'id',
        label: 'policyName'
      }"
      v-model="modelState.roleIds"
      :data="modelState.roleList">
    </el-transfer>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="handleSave">提交</el-button>
    <el-button @click="$emit('go-back')">取消</el-button>
  </el-form-item>
</el-form>
</template>
<script>
import { computed, defineComponent, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
// import AuditProcedure from '../components/AuditProcedure.vue'
import { genApiService } from '@/services/common'
import { evil, getEnumFieldOptions, doCopy } from '@/utils/common'
import { ROOT_DIR_ID, AUDIT_TYPE_NONE, AUDIT_TYPE_SELF, STRORE_ADDR_FTP } from '@/utils/const'

export default defineComponent({
  // components: { AuditProcedure },
  props: {
    id: {
      type: Number,
      default: null
    },
    mode: {
      type: String,
      default: ''
    },
    menu: {
      required: true,
      type: Object,
      default () {
        return { }
      }
    }
  },
  setup (props, { emit }) {
    const isEdit = computed(() => evil(props.mode === 'edit'))
    const fieldsJson = computed(() => evil(props.menu.fieldsJson))
    const apiJson = computed(() => evil(props.menu.apiJson))
    const apiServer = genApiService(apiJson.value)
    const auditTypeOptions = computed(() => getEnumFieldOptions(fieldsJson.value, 'auditType'))
    const modelState = reactive({
      data: {
        rootId: 0, // 默认为0，即代表处于根目录
        pid: ROOT_DIR_ID, // 父级目录id，默认为0，即代表处于根目录
        dirName: '',
        dirShowName: '',
        appId: '',
        appSecret: '',
        auditType: AUDIT_TYPE_NONE,
        permitsRoleIds: '', // 查询角色ID
        selfAuditLevelVO: [], // 自审流程
        stroreAddrId: STRORE_ADDR_FTP, // 存储位置，1：FTP ，2：CORS（目前只支持FTP）
        absPath: '' // 相对路径
      },
      rules: {
        dirName: [
          { required: true, message: '请输入目录名称' },
          { min: 3, max: 30, message: '长度在 3 到 30 个字符' },
          {
            validator: (rule, value, callback) => {
              // eslint-disable-next-line prefer-regex-literals
              const regex = new RegExp('^[a-zA-Z0-9_]*$')
              if (!regex.test(value)) {
                callback(new Error('仅支持字母、数字、下划线'))
              } else {
                callback()
              }
            }
          }
        ],
        dirShowName: [
          { required: true, message: '请输入中文名称' },
          { min: 3, max: 30, message: '长度在 3 到 30 个字符' }
        ],
        selfAuditLevelVO: [{ required: true, message: '请设置审核流程' }]
      },
      roleIds: [],
      roleList: []
    })

    const isRootDir = computed(() => modelState.data.pid === ROOT_DIR_ID)
    const isSelfAudit = computed(() => modelState.data.auditType === AUDIT_TYPE_SELF) // 是否自审核
    const isNoneAudit = computed(() => modelState.data.auditType === AUDIT_TYPE_NONE) // 是否不审
    const modelFormEl = ref()
    function validSelfAuditLevelVO (selfAuditLevelVO = []) {
      return isRootDir.value && isSelfAudit.value && selfAuditLevelVO.some(ele => ele.roleId === undefined)
    }
    function handleSave () {
      // modelFormEl.
      modelFormEl.value.validate(valid => {
        if (valid) {
          if (validSelfAuditLevelVO(modelState.data.selfAuditLevelVO)) {
            return ElMessage.warning('请完善审核流程')
          }
          saveData(modelState.data)
        } else {
          ElMessage.warning('表单有误')
        }
      })
    }

    function saveData (data) {
      data.permitsRoleIds = modelState.roleIds.toString()
      // 如果不审核
      if (isNoneAudit.value) {
        data.selfAuditLevelVO = [] // 删除审核流程
      }
      if (isRootDir.value) {
        data.absPath = data.dirName // 修改根目录的相对路径
      }
      if (isEdit.value) {
        // update
        apiServer('update')({ data }).then(() => emit('upsert-end'))
      } else {
        // add
        apiServer('add')({ data }).then(() => emit('upsert-end'))
      }
    }

    function handleCopy (content) {
      doCopy(content)
    }

    function updateAppIdSecret () {
      apiServer('updateAppIdSecret')({
        isJSON: false,
        data: {
          dirName: modelState.data.dirName,
          oldAppId: modelState.data.appId,
          oldAppSecret: modelState.data.appSecret
        }
      }).then(data => {
        modelState.data.appId = data.appId
        modelState.data.appSecret = data.appSecret
      })
    }

    function init () {
      if (props.id !== undefined && props.id !== null) {
        apiServer('detail')({ params: { id: props.id } }).then(data => {
          modelState.data = data
          modelState.roleIds = typeof data.permitsRoleIds === 'string' ? data.permitsRoleIds.split(',').map(Number) : []
        })
      } else {
        // 新增时必须生成appid和Secret
        apiServer('genAppIdSecret')().then(data => {
          modelState.data.appId = data.appId
          modelState.data.appSecret = data.appSecret
        })
      }
      apiServer('camPolicyList')({ params: { page: 1, pageSize: 9999 } }).then(res => {
        modelState.roleList = res.list
      })
    }

    init()

    return {
      isEdit,
      isRootDir,
      isSelfAudit,
      auditTypeOptions,
      modelState,
      modelFormEl,
      handleSave,
      handleCopy,
      updateAppIdSecret
    }
  }
})
</script>
<style lang="stylus" scoped>
$formLabelWidth = 120px
$formContentWidth = 562px // 为使 el-transfer 能够一行显示的最小宽度
.modelForm
  modelFormMixin($formLabelWidth,$formContentWidth)
</style>
