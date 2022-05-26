
 import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
 import apiFetch from '@/services/fetch'
 import { MenuApi } from '@/services/menu'
 
 interface Params<T> {
   fetchData: () => void
   goBack: () => void
   api: MenuApi
   selected: Array<T>
   primaryKey: string // this.baseIndex.primaryKey
 }
//  export default function useToDoActions<T extends { [key: string]: any; }> ({ fetchData, api, selected, goBack, primaryKey }: Params<T>): CToDoActionHandles<T> {
  export function batchDelete () {
    if (selected.length < 1) {
      return ElMessage.error('请选择数据，再删除')
    }
    ElMessageBox.confirm('确定要删除吗, 是否继续?', '提示', { type: 'warning' }).then(() => {
      apiFetch({
        method: 'post',
        url: api.delete[0]
      })
      ElMessage.success('删除成功!')
    }).catch(() => {
      ElMessage.info('已取消删除')
      goBack()
      // this.$emit('go-back')
    })
  }
  export function batchDeleteUser () {
    if (selected.length < 1) {
      return ElMessage.error('请选择数据，再删除')
    }
    ElMessageBox.confirm('确定要删除吗, 是否继续?', '提示', { type: 'warning' }).then(() => {
      apiFetch({
        method: api.delete[1],
        url: api.delete[0]
      })
      ElMessage.success('删除成功!')
    }).catch(() => {
      ElMessage.info('已取消删除')
      goBack()
      // this.$emit('go-back')
    })
  }


  export function tableDelete ({ data, params, isJSON = true }: { data?: any; params?: any; isJSON?: boolean; }) {
    ElMessageBox.confirm('确定要删除吗, 是否继续?', '提示', { type: 'warning' }).then(() => {
      apiFetch({
        method: api.delete[1],
        url: api.delete[0],
        data,
        params,
        isJSON
      }).then(e => {
        ElMessage.success('删除成功!')
        fetchData()
      }).catch(e => {
        ElNotification({
          title: '错误提示',
          type: 'error',
          message: e.message
        })
      })
    }).catch(() => {
      ElMessage.info('已取消删除')
    })
  }


  // 删除行，需要保证详情、编辑、删除等使用的请求参数key一致
  export function rowDelete (row: T) {
    tableDelete(
      {
        params: {
          [primaryKey]: row[primaryKey]
        }
      }
    )
  }
  // 删除角色
  export function roleDelete (row: T) {
    tableDelete(
      {
        params: {
          roleId: row[primaryKey]
        }
      }
    )
  }
  // 删除用户
  export function userDelete (row: T) {
    tableDelete(
      {
        params: {
          userId: row[primaryKey]
        }
      }
    )
  }
  // 删除枚举字典
  export function enumDelete (row: T) {
    tableDelete(
      {
        params: {
          enumId: row[primaryKey]
        }
      }
    )
  }
  export function handleRefresh () {
    fetchData()
  }

  export default {
    batchDelete,
    batchDeleteUser,
    rowDelete,
    roleDelete,
    userDelete,
    enumDelete,
    handleRefresh
  }
  //  return {
  //    batchDelete,
  //    batchDeleteUser,
  //    rowDelete,
  //    roleDelete,
  //    userDelete,
  //    enumDelete,
  //    handleRefresh
  //  }
 
 