<template>
  <div class="books-view">
    <div class="page-header">
      <div>
        <h1>Library</h1>
        <p>Manage your book collection</p>
      </div>
      <Button label="Add Book" icon="pi pi-plus" @click="openCreate" />
    </div>

    <!-- Toolbar -->
    <div class="toolbar card">
      <div class="search-wrap">
        <i class="pi pi-search search-icon"></i>
        <input v-model="search" class="search-input" placeholder="Search by title or author..." />
      </div>
      <div class="filters">
        <button
          v-for="g in ['ALL', ...genres]" :key="g"
          class="filter-btn"
          :class="{ active: activeGenre === g }"
          @click="activeGenre = g"
        >
          {{ g }}
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div class="loading-overlay" v-if="store.loading">
      <ProgressSpinner />
    </div>

    <!-- Table -->
    <div class="card table-card" v-else>
      <DataTable
        :value="filteredBooks"
        :rows="10"
        paginator
        :rowsPerPageOptions="[5, 10, 20]"
        removableSort
        :globalFilterFields="['title', 'author']"
        row-hover
        @rowClick="e => goToDetail(e.data.id)"
        class="books-table"
      >
        <template #empty>
          <div class="table-empty">
            <i class="pi pi-book"></i>
            <p>No books found. Try a different search or add a new book.</p>
          </div>
        </template>

        <Column header="#" style="width: 56px">
          <template #body="{ index }">
            <span class="row-num">{{ index + 1 }}</span>
          </template>
        </Column>

        <Column field="title" header="Title" sortable>
          <template #body="{ data }">
            <div class="book-cell">
              <div class="book-avatar" :style="{ background: spineColor(data.genre) }">
                {{ data.title.charAt(0) }}
              </div>
              <div>
                <div class="book-title">{{ data.title }}</div>
                <div class="book-author-small">{{ data.author }}</div>
              </div>
            </div>
          </template>
        </Column>

        <Column field="author" header="Author" sortable />

        <Column field="genre" header="Genre" sortable>
          <template #body="{ data }">
            <span v-if="data.genre" class="genre-tag" :class="`genre-${data.genre}`">{{ data.genre }}</span>
            <span v-else class="text-muted">—</span>
          </template>
        </Column>

        <Column field="price" header="Price" sortable>
          <template #body="{ data }">
            <span class="price-badge">${{ data.price?.toFixed(2) }}</span>
          </template>
        </Column>

        <Column field="createdAt" header="Added" sortable>
          <template #body="{ data }">
            <span class="date-text">{{ formatDate(data.createdAt) }}</span>
          </template>
        </Column>

        <Column header="Actions" style="width: 120px">
          <template #body="{ data }">
            <div class="actions" @click.stop>
              <Button icon="pi pi-pencil" text size="small" @click="openEdit(data)" v-tooltip.top="'Edit'" />
              <Button icon="pi pi-trash" text size="small" severity="danger" @click="confirmDelete(data)" v-tooltip.top="'Delete'" />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <BookFormDialog
      v-model:visible="dialogVisible"
      :book="editingBook"
      :loading="store.loading"
      @submit="handleFormSubmit"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import ProgressSpinner from 'primevue/progressspinner'
import { useBooksStore } from '@/stores/booksStore'
import BookFormDialog from '@/components/BookFormDialog.vue'

const store = useBooksStore()
const router = useRouter()
const toast = useToast()
const confirm = useConfirm()

const search = ref('')
const activeGenre = ref('ALL')
const dialogVisible = ref(false)
const editingBook = ref(null)
const genres = ['FICTION', 'NON_FICTION', 'SCIENCE', 'HISTORY', 'TECHNOLOGY']

const spineColors = {
  FICTION: '#6366f1', TECHNOLOGY: '#10b981', SCIENCE: '#f59e0b',
  HISTORY: '#ec4899', NON_FICTION: '#8b5cf6', default: '#c8975a'
}
const spineColor = (genre) => spineColors[genre] || spineColors.default

const filteredBooks = computed(() => {
  return store.books.filter(b => {
    const matchesSearch = !search.value ||
      b.title.toLowerCase().includes(search.value.toLowerCase()) ||
      b.author.toLowerCase().includes(search.value.toLowerCase())
    const matchesGenre = activeGenre.value === 'ALL' || b.genre === activeGenre.value
    return matchesSearch && matchesGenre
  })
})

const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

onMounted(() => store.loadBooks())

function goToDetail(id) { router.push(`/books/${id}`) }

function openCreate() { editingBook.value = null; dialogVisible.value = true }
function openEdit(book) { editingBook.value = book; dialogVisible.value = true }

async function handleFormSubmit(data) {
  try {
    if (editingBook.value) {
      await store.editBook(editingBook.value.id, data)
      toast.add({ severity: 'success', summary: 'Updated', detail: 'Book updated successfully', life: 3000 })
    } else {
      await store.addBook(data)
      toast.add({ severity: 'success', summary: 'Created', detail: 'Book added to library', life: 3000 })
    }
    dialogVisible.value = false
  } catch (e) {
    toast.add({ severity: 'error', summary: 'Error', detail: e.userMessage, life: 4000 })
  }
}

function confirmDelete(book) {
  confirm.require({
    message: `Delete "${book.title}"? This cannot be undone.`,
    header: 'Confirm Delete',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: { label: 'Cancel', text: true },
    acceptProps: { label: 'Delete', severity: 'danger' },
    accept: async () => {
      try {
        await store.removeBook(book.id)
        toast.add({ severity: 'warn', summary: 'Deleted', detail: `"${book.title}" removed`, life: 3000 })
      } catch (e) {
        toast.add({ severity: 'error', summary: 'Error', detail: e.userMessage, life: 4000 })
      }
    }
  })
}
</script>

<style scoped>
.page-header { display: flex; align-items: flex-start; justify-content: space-between; }

.toolbar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.search-wrap { position: relative; flex: 1; min-width: 200px; }
.search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text2); font-size: 14px; }
.search-input {
  width: 100%; padding: 9px 12px 9px 36px;
  border: 1px solid var(--border); border-radius: 8px;
  background: var(--bg); color: var(--text);
  font-family: var(--font-body); font-size: 14px;
  outline: none; transition: border 0.2s;
}
.search-input:focus { border-color: var(--accent); }

.filters { display: flex; gap: 6px; flex-wrap: wrap; }
.filter-btn {
  padding: 6px 12px; border-radius: 20px; border: 1px solid var(--border);
  background: none; color: var(--text2); font-size: 12px; font-weight: 500;
  cursor: pointer; transition: all 0.15s; font-family: var(--font-body);
}
.filter-btn:hover { border-color: var(--accent); color: var(--accent); }
.filter-btn.active { background: var(--accent); border-color: var(--accent); color: white; }

.table-card { overflow: hidden; }
.loading-overlay { display: flex; justify-content: center; padding: 80px; }

.row-num { font-size: 12px; color: var(--text2); font-weight: 500; }

.book-cell { display: flex; align-items: center; gap: 12px; cursor: pointer; }
.book-avatar {
  width: 36px; height: 48px; border-radius: 4px;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-display); font-size: 16px; font-weight: 700; color: white;
  flex-shrink: 0;
}
.book-title { font-size: 14px; font-weight: 500; color: var(--text); }
.book-author-small { font-size: 12px; color: var(--text2); }

.price-badge { font-weight: 600; color: var(--accent); font-size: 14px; }
.date-text { font-size: 13px; color: var(--text2); }
.text-muted { color: var(--text2); }

.actions { display: flex; gap: 4px; }

.table-empty { text-align: center; padding: 48px; color: var(--text2); }
.table-empty i { font-size: 32px; opacity: 0.3; display: block; margin-bottom: 12px; }
</style>
