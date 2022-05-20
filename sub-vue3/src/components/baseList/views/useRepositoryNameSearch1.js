
import { ref, computed } from 'vue'

export default function useRepositoryNameSearch(repositories) {
  const searchQuery = ref('')
  const repositoriesMatchingSearchQuery = computed(() => {
    return repositories.value
  })

  return {
    searchQuery,
    repositoriesMatchingSearchQuery
  }
}