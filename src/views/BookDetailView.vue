<template>
  <div class="detail-view" v-if="store.selectedBook">
    <div class="back-row">
      <Button icon="pi pi-arrow-left" text label="Back to Library" @click="router.push('/books')" size="small" />
    </div>

    <div class="detail-layout">
      <!-- Book cover card -->
      <div class="cover-card card">
        <div class="cover-art" :style="{ background: `linear-gradient(135deg, ${spineColor(store.selectedBook.genre)}, ${spineColorDark(store.selectedBook.genre)})` }">
          <span class="cover-letter">{{ store.selectedBook.title.charAt(0) }}</span>
        </div>
        <div class="cover-info">
          <span class="genre-tag" :class="`genre-${store.selectedBook.genre}`" v-if="store.selectedBook.genre">
            {{ store.selectedBook.genre }}
          </span>
          <div class="cover-price">${{ store.selectedBook.price?.toFixed(2) }}</div>
          <div class="cover-date">Added {{ formatDate(store.selectedBook.createdAt) }}</div>
        </div>
        <div class="cover-actions">
          <Button label="Edit Book" icon="pi pi-pencil" class="w-full" outlined @click="openEdit" />
          <Button label="Delete" icon="pi pi-trash" class="w-full" severity="danger" text @click="confirmDelete" />
        </div>
      </div>

      <!-- Book details -->
      <div class="detail-main">
        <div class="card detail-card">
          <h1 class="book-big-title">{{ store.selectedBook.title }}</h1>
          <p class="book-big-author">by {{ store.selectedBook.author }}</p>

          <div class="meta-grid">
            <div class="meta-item">
              <span class="meta-label"><i class="pi pi-user"></i> Author</span>
              <span class="meta-value">{{ store.selectedBook.author }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label"><i class="pi pi-tag"></i> Genre</span>
              <span class="meta-value">{{ store.selectedBook.genre || 'Not set' }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label"><i class="pi pi-dollar"></i> Price</span>
              <span class="meta-value">${{ store.selectedBook.price?.toFixed(2) }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label"><i class="pi pi-calendar"></i> Added</span>
              <span class="meta-value">{{ formatDate(store.selectedBook.createdAt) }}</span>
            </div>
          </div>
        </div>

        <!-- External info panel -->
        <div class="card external-card">
          <div class="ext-header">
            <div>
              <h3>Open Library Info</h3>
              <p>Fetch information from external API</p>
            </div>
            <Button
              label="Fetch Info"
              icon="pi pi-globe"
              :loading="extLoading"
              @click="fetchExternal"
              size="small"
            />
          </div>
          <div class="ext-result" v-if="externalData">
            <div class="ext-found" v-if="externalData.numFound > 0">
              <div class="ext-stat">
                <i class="pi pi-check-circle"></i>
                <span><strong>{{ externalData.numFound }}</strong> results found on Open Library</span>
              </div>
              <div class="ext-first" v-if="externalData.docs?.[0]">
                <div class="ext-row" v-if="externalData.docs[0].first_publish_year">
                  <span class="ext-label">First Published</span>
                  <span>{{ externalData.docs[0].first_publish_year }}</span>
                </div>
                <div class="ext-row" v-if="externalData.docs[0].edition_count">
                  <span class="ext-label">Editions</span>
                  <span>{{ externalData.docs[0].edition_count }}</span>
                </div>
                <div class="ext-row" v-if="externalData.docs[0].language">
                  <span class="ext-label">Languages</span>
                  <span>{{ externalData.docs[0].language.slice(0,4).join(', ') }}</span>
                </div>
              </div>
            </div>
            <div class="ext-empty" v-else>
              <i class="pi pi-info-circle"></i> No results found on Open Library.
            </div>
          </div>
          <div class="ext-placeholder" v-else>
            <i class="pi pi-globe"></i>
            <span>Click "Fetch Info" to search Open Library for this title</span>
          </div>
        </div>
      </div>
    </div>

    <BookFormDialog
      v-model:visible="dialogVisible"
      :book="store.selectedBook"
      :loading="store.loading"
      @submit="handleEdit"
    />
  </div>

  <div class="loading-center" v-else-if="store.loading">
    <ProgressSpinner />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner'
import { useBooksStore } from '@/stores/booksStore'
import { useBooks } from '@/composables/useBooks'
import BookFormDialog from '@/components/BookFormDialog.vue'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const confirm = useConfirm()
const store = useBooksStore()
const { fetchExternal: fetchExt } = useBooks()

const dialogVisible = ref(false)
const externalData = ref(null)
const extLoading = ref(false)

onMounted(() => store.loadBook(route.params.id))

const spineColors = {
  FICTION: '#6366f1', TECHNOLOGY: '#10b981', SCIENCE: '#f59e0b',
  HISTORY: '#ec4899', NON_FICTION: '#8b5cf6', default: '#c8975a'
}
const spineColorsDark = {
  FICTION: '#4338ca', TECHNOLOGY: '#059669', SCIENCE: '#d97706',
  HISTORY: '#be185d', NON_FICTION: '#7c3aed', default: '#a16207'
}
const spineColor = (g) => spineColors[g] || spineColors.default
const spineColorDark = (g) => spineColorsDark[g] || spineColorsDark.default

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'

function openEdit() { dialogVisible.value = true }

async function handleEdit(data) {
  try {
    await store.editBook(store.selectedBook.id, data)
    await store.loadBook(route.params.id)
    dialogVisible.value = false
    toast.add({ severity: 'success', summary: 'Updated', detail: 'Book updated', life: 3000 })
  } catch (e) {
    toast.add({ severity: 'error', summary: 'Error', detail: e.userMessage, life: 4000 })
  }
}

function confirmDelete() {
  confirm.require({
    message: `Delete "${store.selectedBook.title}"?`,
    header: 'Confirm Delete',
    icon: 'pi pi-exclamation-triangle',
    acceptProps: { label: 'Delete', severity: 'danger' },
    rejectProps: { label: 'Cancel', text: true },
    accept: async () => {
      try {
        await store.removeBook(store.selectedBook.id)
        router.push('/books')
        toast.add({ severity: 'warn', summary: 'Deleted', detail: 'Book removed', life: 3000 })
      } catch (e) {
        toast.add({ severity: 'error', summary: 'Error', detail: e.userMessage, life: 4000 })
      }
    }
  })
}

async function fetchExternal() {
  extLoading.value = true
  try {
    const raw = await fetchExt(store.selectedBook.title)
    externalData.value = typeof raw === 'string' ? JSON.parse(raw) : raw
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch external info', life: 3000 })
  } finally {
    extLoading.value = false
  }
}
</script>

<style scoped>
.back-row { margin-bottom: 20px; }

.detail-layout { display: flex; gap: 24px; align-items: flex-start; }

.cover-card { width: 240px; flex-shrink: 0; padding: 24px; display: flex; flex-direction: column; gap: 20px; }
.cover-art {
  width: 100%; aspect-ratio: 2/3; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 12px 40px rgba(0,0,0,0.2);
}
.cover-letter { font-family: var(--font-display); font-size: 72px; font-weight: 700; color: rgba(255,255,255,0.9); }
.cover-info { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 8px; }
.cover-price { font-family: var(--font-display); font-size: 28px; font-weight: 700; color: var(--accent); }
.cover-date { font-size: 12px; color: var(--text2); }
.cover-actions { display: flex; flex-direction: column; gap: 8px; }
.w-full { width: 100%; }

.detail-main { flex: 1; display: flex; flex-direction: column; gap: 20px; min-width: 0; }

.detail-card { padding: 32px; }
.book-big-title { font-family: var(--font-display); font-size: 36px; font-weight: 700; color: var(--text); line-height: 1.2; }
.book-big-author { font-size: 18px; color: var(--text2); margin: 8px 0 28px; }

.meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.meta-item { display: flex; flex-direction: column; gap: 4px; }
.meta-label { font-size: 12px; color: var(--text2); font-weight: 500; display: flex; align-items: center; gap: 6px; }
.meta-value { font-size: 15px; font-weight: 500; color: var(--text); }

.external-card { padding: 24px; }
.ext-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.ext-header h3 { font-family: var(--font-display); font-size: 18px; font-weight: 600; }
.ext-header p { font-size: 13px; color: var(--text2); }

.ext-placeholder { display: flex; align-items: center; gap: 10px; color: var(--text2); font-size: 14px; padding: 16px 0; }
.ext-placeholder i { font-size: 20px; opacity: 0.4; }

.ext-stat { display: flex; align-items: center; gap: 8px; color: #10b981; font-size: 14px; margin-bottom: 16px; }
.ext-stat i { font-size: 18px; }
.ext-first { display: flex; flex-direction: column; gap: 10px; }
.ext-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--border); font-size: 14px; }
.ext-label { color: var(--text2); font-weight: 500; }
.ext-empty { color: var(--text2); font-size: 14px; display: flex; align-items: center; gap: 8px; }

.loading-center { display: flex; justify-content: center; padding: 100px; }

@media (max-width: 800px) {
  .detail-layout { flex-direction: column; }
  .cover-card { width: 100%; }
}
</style>
