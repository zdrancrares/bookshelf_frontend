import { ref, computed } from 'vue'
import api from './useApi'

export function useBooks() {
  const loading = ref(false)
  const error = ref(null)

  async function execute(fn) {
    loading.value = true
    error.value = null
    try {
      return await fn()
    } catch (err) {
      error.value = err.userMessage
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchAll = () => execute(() => api.get('/books').then(r => r.data))
  const fetchById = (id) => execute(() => api.get(`/books/${id}`).then(r => r.data))
  const createBook = (data) => execute(() => api.post('/books', data).then(r => r.data))
  const updateBook = (id, data) => execute(() => api.put(`/books/${id}`, data).then(r => r.data))
  const deleteBook = (id) => execute(() => api.delete(`/books/${id}`))
  const fetchGrouped = () => execute(() => api.get('/books/grouped-by-genre').then(r => r.data))
  const fetchCheapest = () => execute(() => api.get('/books/cheapest').then(r => r.data))
  const fetchExternal = (title) => execute(() => api.get(`/books/external/${encodeURIComponent(title)}`).then(r => r.data))

  return { loading, error, fetchAll, fetchById, createBook, updateBook, deleteBook, fetchGrouped, fetchCheapest, fetchExternal }
}
