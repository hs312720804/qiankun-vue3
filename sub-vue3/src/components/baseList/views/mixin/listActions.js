var mixin = {
  methods: {
    batchDelete () {
      if (this.selected < 1) {
        this.$message({
          type: 'error',
          message: '请选择数据，再删除'
        })
        return
      }
      this.$confirm('确定要删除吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.baseIndex.baseListFetch({
          apiJson: this.api,
          apiKey: 'delete'
        })
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // })
        this.$emit('go-back')
      })
    },
    batchDeleteUser () {
      if (this.selected < 1) {
        this.$message({
          type: 'error',
          message: '请选择数据，再删除'
        })
        return
      }
      this.$confirm('确定要删除吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.baseIndex.baseListFetch({
          apiJson: this.api,
          apiKey: 'delete'
        })
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // })
        this.$emit('go-back')
      })
    },
    /**
     * 单项删除
     * */
    singleDel ({ row }) {
      const idKey = this.baseIndex.primaryKey
      const params = {
        id: row[idKey]
      }
      this.rowDelete({ data: params, params })
    },
    /**
     * 行内删除
     * */
    rowDelete ({ data, params, isJSON = true }) {
      this.$confirm('确定要删除吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.baseIndex.baseListFetch({
          apiJson: this.api,
          apiKey: 'delete',
          data,
          params
        })
          .then((e) => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.clearSelected()
            this.fetchData()
          }).catch((e) => {
            this.$notify.error({
              title: '错误提示',
              message: e.message
            })
          })
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // })
      })
    }
  }
}
export default mixin
