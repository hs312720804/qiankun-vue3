<template>
  {{repositoriesMatchingSearchQuery}} 1----------
</template>
<script lang="ts">
  import useRepositoryNameSearch from './useRepositoryNameSearch1.js'
  import { toRefs, ref } from 'vue'

  export default {
    props: {
      user: {
        type: String,
        required: true
      }
    },
    setup (props) {
      const { user } = toRefs(props)
      const a = ref('124')

      const {
        searchQuery,
        repositoriesMatchingSearchQuery
      } = useRepositoryNameSearch(a)

      console.log('repositoriesMatchingSearchQuery=======', repositoriesMatchingSearchQuery)
      return {
        // 因为我们并不关心未经过滤的仓库
        // 我们可以在 `repositories` 名称下暴露过滤后的结果
        repositories: repositoriesMatchingSearchQuery,
        repositoriesMatchingSearchQuery
      }
    }
    
  }
</script>
