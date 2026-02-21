import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useBooks } from '@/composables/useBooks'

export const useBooksStore = defineStore('books', () => {
  const books = ref([])
  const grouped = ref({})
  const cheapest = ref(null)
  const selectedBook = ref(null)

  const { loading, error, fetchAll, fetchById, createBook, updateBook, deleteBook, fetchGrouped, fetchCheapest } = useBooks()

  const totalBooks = computed(() => books.value.length)
  const genreCount = computed(() => Object.keys(grouped.value).length)
  const avgPrice = computed(() => {
    const prices = books.value.filter(b => b.price).map(b => b.price)
    return prices.length ? (prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2) : 0
  })

  async function loadBooks() {
    books.value = await fetchAll()
  }

  async function loadGrouped() {
    grouped.value = await fetchGrouped()
  }

  async function loadCheapest() {
    cheapest.value = await fetchCheapest()
  }

  async function loadBook(id) {
    selectedBook.value = await fetchById(id)
  }

  async function addBook(data) {
    const book = await createBook(data)
    books.value.push(book)
    return book
  }

  async function editBook(id, data) {
    const book = await updateBook(id, data)
    const idx = books.value.findIndex(b => b.id === id)
    if (idx !== -1) books.value[idx] = book
    return book
  }

  async function removeBook(id) {
    await deleteBook(id)
    books.value = books.value.filter(b => b.id !== id)
  }

  return {
    books, grouped, cheapest, selectedBook,
    loading, error,
    totalBooks, genreCount, avgPrice,
    loadBooks, loadGrouped, loadCheapest, loadBook,
    addBook, editBook, removeBook
  }
})
