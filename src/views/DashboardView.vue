<template>
  <div class="dashboard">
    <div class="page-header">
      <h1>Dashboard</h1>
      <p>Your library at a glance</p>
    </div>

    <!-- Stat cards -->
    <div class="stats-grid">
      <div class="stat-card card">
        <div class="stat-icon stat-icon--books"><i class="pi pi-book"></i></div>
        <div class="stat-body">
          <div class="stat-value">{{ store.totalBooks }}</div>
          <div class="stat-label">Total Books</div>
        </div>
      </div>
      <div class="stat-card card">
        <div class="stat-icon stat-icon--genres"><i class="pi pi-tags"></i></div>
        <div class="stat-body">
          <div class="stat-value">{{ store.genreCount }}</div>
          <div class="stat-label">Genres</div>
        </div>
      </div>
      <div class="stat-card card">
        <div class="stat-icon stat-icon--price"><i class="pi pi-dollar"></i></div>
        <div class="stat-body">
          <div class="stat-value">${{ store.avgPrice }}</div>
          <div class="stat-label">Avg. Price</div>
        </div>
      </div>
      <div class="stat-card card" v-if="store.cheapest">
        <div class="stat-icon stat-icon--deal"><i class="pi pi-star"></i></div>
        <div class="stat-body">
          <div class="stat-value">${{ store.cheapest.price }}</div>
          <div class="stat-label">Best Deal — {{ store.cheapest.title }}</div>
        </div>
      </div>
    </div>

    <!-- Genre breakdown -->
    <div class="section-row">
      <div class="card genre-card" style="flex:1">
        <div class="card-header">
          <h2>Books by Genre</h2>
        </div>
        <div class="genre-rows" v-if="Object.keys(store.grouped).length">
          <div class="genre-row" v-for="(books, genre) in store.grouped" :key="genre">
            <span class="genre-tag" :class="`genre-${genre}`">{{ genre }}</span>
            <div class="genre-bar-wrap">
              <div class="genre-bar" :style="{ width: barWidth(books.length) + '%' }"></div>
            </div>
            <span class="genre-count">{{ books.length }}</span>
          </div>
        </div>
        <div class="empty-state" v-else>
          <i class="pi pi-info-circle"></i>
          <span>No books yet. Add some in the Library.</span>
        </div>
      </div>

      <!-- Recent books -->
      <div class="card recent-card" style="flex:1">
        <div class="card-header">
          <h2>Recent Books</h2>
          <RouterLink to="/books" class="see-all">See all <i class="pi pi-arrow-right"></i></RouterLink>
        </div>
        <div class="recent-list">
          <RouterLink
            v-for="book in recentBooks"
            :key="book.id"
            :to="`/books/${book.id}`"
            class="recent-item"
          >
            <div class="book-spine" :style="{ background: spineColor(book.genre) }">
              {{ book.title.charAt(0) }}
            </div>
            <div class="recent-info">
              <div class="recent-title">{{ book.title }}</div>
              <div class="recent-author">{{ book.author }}</div>
            </div>
            <div class="recent-price">${{ book.price }}</div>
          </RouterLink>
        </div>
        <div class="empty-state" v-if="!recentBooks.length">
          <i class="pi pi-book"></i>
          <span>No books in your library yet.</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useBooksStore } from '@/stores/booksStore'

const store = useBooksStore()

onMounted(async () => {
  await Promise.all([store.loadBooks(), store.loadGrouped(), store.loadCheapest()])
})

const recentBooks = computed(() => [...store.books].slice(-5).reverse())

const maxBooks = computed(() => {
  const vals = Object.values(store.grouped).map(b => b.length)
  return Math.max(...vals, 1)
})

const barWidth = (count) => (count / maxBooks.value) * 100

const spineColors = {
  FICTION: '#6366f1', TECHNOLOGY: '#10b981', SCIENCE: '#f59e0b',
  HISTORY: '#ec4899', NON_FICTION: '#8b5cf6', default: '#c8975a'
}
const spineColor = (genre) => spineColors[genre] || spineColors.default
</script>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 18px;
  transition: transform 0.2s, box-shadow 0.2s;
}
.stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,0.1); }

.stat-icon {
  width: 52px; height: 52px;
  border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px;
}
.stat-icon--books { background: #dbeafe; color: #2563eb; }
.stat-icon--genres { background: #dcfce7; color: #16a34a; }
.stat-icon--price { background: #fef9c3; color: #ca8a04; }
.stat-icon--deal { background: #fce7f3; color: #db2777; }
.dark-mode .stat-icon--books { background: #1e3a5f; color: #93c5fd; }
.dark-mode .stat-icon--genres { background: #14532d; color: #86efac; }
.dark-mode .stat-icon--price { background: #3f2d00; color: #fde047; }
.dark-mode .stat-icon--deal { background: #500724; color: #f9a8d4; }

.stat-value { font-family: var(--font-display); font-size: 28px; font-weight: 700; color: var(--text); line-height: 1; }
.stat-label { font-size: 13px; color: var(--text2); margin-top: 4px; }

.section-row { display: flex; gap: 20px; }

.card-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 22px 24px 16px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 4px;
}
.card-header h2 { font-family: var(--font-display); font-size: 18px; font-weight: 600; color: var(--text); }

.see-all { font-size: 13px; color: var(--accent); text-decoration: none; display: flex; align-items: center; gap: 4px; }

.genre-rows { padding: 16px 24px; display: flex; flex-direction: column; gap: 14px; }
.genre-row { display: flex; align-items: center; gap: 14px; }
.genre-bar-wrap { flex: 1; height: 8px; background: var(--border); border-radius: 4px; overflow: hidden; }
.genre-bar { height: 100%; background: linear-gradient(90deg, var(--accent), var(--accent2)); border-radius: 4px; transition: width 0.6s ease; }
.genre-count { font-size: 13px; font-weight: 600; color: var(--text2); min-width: 20px; text-align: right; }

.recent-list { padding: 8px 16px 16px; display: flex; flex-direction: column; gap: 4px; }
.recent-item {
  display: flex; align-items: center; gap: 14px;
  padding: 10px 8px; border-radius: 10px;
  text-decoration: none; color: var(--text);
  transition: background 0.15s;
}
.recent-item:hover { background: var(--bg); }
.book-spine {
  width: 36px; height: 48px; border-radius: 4px;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-display); font-size: 18px; font-weight: 700; color: white;
  flex-shrink: 0;
}
.recent-info { flex: 1; min-width: 0; }
.recent-title { font-size: 14px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.recent-author { font-size: 12px; color: var(--text2); }
.recent-price { font-size: 14px; font-weight: 600; color: var(--accent); }

.empty-state { padding: 40px; text-align: center; color: var(--text2); display: flex; flex-direction: column; align-items: center; gap: 10px; font-size: 14px; }
.empty-state i { font-size: 28px; opacity: 0.4; }

@media (max-width: 1200px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .section-row { flex-direction: column; }
}
</style>
