<template>
  <el-dialog
    v-model="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    :modal-append-to-body="false"
    width="30%"
    @close="handleClose"
  >
    <!-- <div slot="title">重新登录后刷新</div> -->
    <template>
      <div class="my-header">
        <div>重新登录后刷新</div>{{ dialogVisible }}
      </div>
    </template>

    <el-alert v-if="isError" type="error" style="margin-bottom:10px" :closable="false">{{ reLoginMsg }}</el-alert>
    <el-form ref="loginRef" :model="adminForm" label-width="80px">
      <el-form-item
        label="账号"
        prop="username"
        :rules="[
          { required: true, message: '帐号不能为空', trigger: 'change' },
        ]"
      >
        <el-input
          v-model="adminForm.username"
          :prefix-icon="User"
          auto-complete="off"
          placeholder="请输入帐号"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="密码"
        prop="password"
        :rules="[
          { required: true, message: '密码不能为空', trigger: 'change' },
        ]"
      >
        <el-input
          type="password"
          v-model="adminForm.password"
          :prefix-icon="Lock"
          auto-complete="off"
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>
    </el-form>
    <!-- <div slot="footer" class="dialog-footer">
      <el-button v-if="!isError" @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleLogin">确 定</el-button>
    </div> -->
    <template #footer class="dialog-footer">
      <el-button v-if="!isError" @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleLogin">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
  import { computed, watch, ref, toRefs, reactive } from 'vue'
  import Storage from '@/utils/storage'
  import { loginService } from '@/services/common'
  import { ElForm } from 'element-plus'
  import { User, Lock } from '@element-plus/icons-vue'

  // -------初始化---------start
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false,
    },
    reLoginMsg: {
      type: String,
      default: '',
    }
  })

  const emits = defineEmits(['update:modelValue'])

  let dialogVisible = ref(false)
  let adminForm = reactive({
    username: '',
    password: '',
    grant_type: 'password'
  })

  const { reLoginMsg, modelValue } = toRefs(props)
  // -------初始化---------end


  let isError = computed(() => !!reLoginMsg.value)

  watch(
    () => modelValue.value,
    (val, prevValue) => {
      dialogVisible.value = val
    }
  )

  function handleClose () {
    emits('update:modelValue', false)
  }

  // InstanceType<T> - 获取构造函数的实例类型
  const loginRef = ref<InstanceType<typeof ElForm>>()

  function handleLogin () {
    loginRef.value?.validate((isValid: boolean) => {
      if (isValid) {
        loginService(adminForm).then((res) => {
          Storage.$set('user', res)
          Storage.$set('userLogin', adminForm.username)
          window.location.reload()
        })
      }
    })
  }

</script>
<style scoped lang="stylus"></style>
