<template>
  <div class="search-view">
    <div class="page-header">
      <h1>Open Library</h1>
    </div>

    <div class="search-hero card">
      <div class="hero-inner">
        <i class="pi pi-globe hero-icon"></i>
        <h2>Search Open Library</h2>
        <div class="search-bar">
          <input
            v-model="query"
            class="hero-input"
            placeholder="Search for a book title…"
            @keyup.enter="search"
          />
          <Button label="Search" icon="pi pi-search" :loading="loading" @click="search" />
        </div>
      </div>
    </div>

    <!-- Results -->
    <div v-if="result" class="results-section">
      <div class="results-header">
        <h3>Results for "{{ lastQuery }}"</h3>
        <span class="result-count" v-if="result.numFound">{{ result.numFound.toLocaleString() }} matches</span>
      </div>

      <div class="result-grid" v-if="result.docs?.length">
        <div class="result-card card" v-for="book in result.docs.slice(0, 12)" :key="book.key">
          <div class="result-cover" :style="{ background: randomColor(book.key) }">
            {{ (book.title || '?').charAt(0) }}
          </div>
          <div class="result-body">
            <div class="result-title">{{ book.title }}</div>
            <div class="result-author" v-if="book.author_name">{{ book.author_name.slice(0,2).join(', ') }}</div>
            <div class="result-meta">
              <span v-if="book.first_publish_year" class="meta-chip"><i class="pi pi-calendar"></i> {{ book.first_publish_year }}</span>
              <span v-if="book.edition_count" class="meta-chip"><i class="pi pi-copy"></i> {{ book.edition_count }} editions</span>
            </div>
          </div>
          <div class="result-actions">
            <Button
              icon="pi pi-plus"
              size="small"
              text
              v-tooltip.top="'Add to library'"
              @click="openAddDialog(book)"
            />
          </div>
        </div>
      </div>

      <div class="no-results card" v-else>
        <i class="pi pi-search"></i>
        <p>No results found for "{{ lastQuery }}"</p>
      </div>
    </div>

    <BookFormDialog
      v-model:visible="dialogVisible"
      :book="prefillBook"
      :loading="store.loading"
      @submit="handleAdd"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import Button from 'primevue/button'
import { useBooks } from '@/composables/useBooks'
import { useBooksStore } from '@/stores/booksStore'
import BookFormDialog from '@/components/BookFormDialog.vue'

const toast = useToast()
const store = useBooksStore()
const { fetchExternal, loading } = useBooks()

const query = ref('')
const lastQuery = ref('')
const result = ref(null)
const dialogVisible = ref(false)
const prefillBook = ref(null)

async function search() {
  if (!query.value.trim()) return
  try {
    lastQuery.value = query.value
    const raw = await fetchExternal(query.value)
    result.value = typeof raw === 'string' ? JSON.parse(raw) : raw
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch from Open Library', life: 3000 })
  }
}

const palette = ['#6366f1','#10b981','#f59e0b','#ec4899','#8b5cf6','#06b6d4','#ef4444','#c8975a']
const colorMap = {}
function randomColor(key) {
  if (!colorMap[key]) colorMap[key] = palette[Object.keys(colorMap).length % palette.length]
  return colorMap[key]
}

function openAddDialog(book) {
  prefillBook.value = {
    title: book.title || '',
    author: book.author_name?.[0] || '',
    price: null,
    genre: null
  }
  dialogVisible.value = true
}

async function handleAdd(data) {
  try {
    await store.addBook(data)
    dialogVisible.value = false
    toast.add({ severity: 'success', summary: 'Added!', detail: `"${data.title}" added to your library`, life: 3000 })
  } catch (e) {
    toast.add({ severity: 'error', summary: 'Error', detail: e.userMessage, life: 4000 })
  }
}
</script>

<style scoped>
.search-hero {
  margin-bottom: 32px;
  background: linear-gradient(135deg, #1a1a2e 0%, #2d1b69 100%);
  border: none;
  overflow: hidden;
  position: relative;
}
.search-hero::before {
  content: '';
  position: absolute; inset: 0;
  background: radial-gradient(circle at 70% 50%, rgba(200,151,90,0.15) 0%, transparent 60%);
}

.hero-inner {
  position: relative; z-index: 1;
  padding: 48px;
  display: flex; flex-direction: column; align-items: center; text-align: center; gap: 12px;
}

.hero-icon { font-size: 40px; color: var(--accent); margin-bottom: 8px; }
.hero-inner h2 { font-family: var(--font-display); font-size: 28px; color: #fff; font-weight: 700; }
.hero-inner p { font-size: 14px; color: rgba(255,255,255,0.6); max-width: 480px; }

.search-bar { display: flex; gap: 12px; width: 100%; max-width: 540px; margin-top: 12px; }
.hero-input {
  flex: 1; padding: 12px 16px;
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 10px; background: rgba(255,255,255,0.08);
  color: #fff; font-family: var(--font-body); font-size: 15px; outline: none;
  transition: border 0.2s;
}
.hero-input::placeholder { color: rgba(255,255,255,0.4); }
.hero-input:focus { border-color: var(--accent); }

.results-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.results-header h3 { font-family: var(--font-display); font-size: 22px; color: var(--text); }
.result-count { font-size: 13px; color: var(--text2); background: var(--border); padding: 4px 12px; border-radius: 20px; }

.result-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }

.result-card {
  display: flex; align-items: flex-start; gap: 14px; padding: 16px;
  transition: transform 0.2s, box-shadow 0.2s;
}
.result-card:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,0.1); }

.result-cover {
  width: 44px; height: 60px; border-radius: 6px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-display); font-size: 22px; font-weight: 700; color: white;
}

.result-body { flex: 1; min-width: 0; }
.result-title { font-size: 14px; font-weight: 600; color: var(--text); margin-bottom: 4px; }
.result-author { font-size: 12px; color: var(--text2); margin-bottom: 8px; }
.result-meta { display: flex; gap: 6px; flex-wrap: wrap; }
.meta-chip { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; color: var(--text2); background: var(--bg); padding: 2px 8px; border-radius: 10px; border: 1px solid var(--border); }

.result-actions { flex-shrink: 0; }

.no-results { padding: 60px; text-align: center; color: var(--text2); display: flex; flex-direction: column; align-items: center; gap: 12px; }
.no-results i { font-size: 36px; opacity: 0.3; }
</style>
