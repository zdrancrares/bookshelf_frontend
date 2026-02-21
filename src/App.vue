<template>
  <div class="app-shell" :class="{ 'dark-mode': isDark }">

    <!-- Auth pages - no sidebar -->
    <template v-if="!authStore.isAuthenticated">
      <RouterView />
    </template>

    <!-- App shell with sidebar -->
    <template v-else>
      <aside class="sidebar">
        <div class="sidebar-brand">
          <span class="brand-icon"><i class="pi pi-book"></i></span>
          <span class="brand-name">Bookshelf</span>
        </div>

        <nav class="sidebar-nav">
          <RouterLink to="/dashboard" class="nav-item" active-class="nav-item--active">
            <i class="pi pi-chart-bar"></i><span>Dashboard</span>
          </RouterLink>
          <RouterLink to="/books" class="nav-item" active-class="nav-item--active">
            <i class="pi pi-book"></i><span>Library</span>
          </RouterLink>
          <RouterLink to="/search" class="nav-item" active-class="nav-item--active">
            <i class="pi pi-globe"></i><span>Open Library</span>
          </RouterLink>
        </nav>

        <div class="sidebar-footer">
          <!-- User info -->
          <div class="user-card">
            <div class="user-avatar">{{ authStore.user?.username?.charAt(0).toUpperCase() }}</div>
            <div class="user-info">
              <div class="user-name">{{ authStore.user?.username }}</div>
              <div class="user-role">{{ authStore.user?.role }}</div>
            </div>
          </div>

          <button class="theme-toggle" @click="toggleDark">
            <i :class="isDark ? 'pi pi-sun' : 'pi pi-moon'"></i>
            <span>{{ isDark ? 'Light' : 'Dark' }} mode</span>
          </button>

          <button class="logout-btn" @click="handleLogout">
            <i class="pi pi-sign-out"></i>
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      <main class="main-content">
        <RouterView v-slot="{ Component }">
          <Transition name="page" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </main>
    </template>

    <Toast position="bottom-right" />
    <ConfirmDialog />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const router = useRouter()
const isDark = ref(false)
const toggleDark = () => { isDark.value = !isDark.value }

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #f7f5f0;
  --bg2: #ffffff;
  --sidebar-bg: #1a1a2e;
  --sidebar-text: #a8b2d8;
  --sidebar-active: #e8d5b7;
  --sidebar-active-bg: rgba(232, 213, 183, 0.12);
  --text: #1a1a2e;
  --text2: #6b7280;
  --accent: #c8975a;
  --accent2: #8b4513;
  --card-bg: #ffffff;
  --border: #e5e0d8;
  --shadow: 0 4px 24px rgba(0,0,0,0.07);
  --font-display: 'Playfair Display', serif;
  --font-body: 'DM Sans', sans-serif;
  --radius: 14px;
  --tag-fiction: #dbeafe; --tag-fiction-text: #1d4ed8;
  --tag-technology: #dcfce7; --tag-technology-text: #15803d;
  --tag-science: #fef9c3; --tag-science-text: #a16207;
  --tag-history: #fce7f3; --tag-history-text: #be185d;
  --tag-non_fiction: #f3e8ff; --tag-non_fiction-text: #7e22ce;
}

.dark-mode {
  --bg: #0f0f1a; --bg2: #161628; --sidebar-bg: #0a0a14;
  --sidebar-text: #6b7a9d; --sidebar-active: #e8d5b7;
  --sidebar-active-bg: rgba(232, 213, 183, 0.1);
  --text: #e8e0f0; --text2: #8892b0; --accent: #c8975a;
  --card-bg: #161628; --border: #252540; --shadow: 0 4px 24px rgba(0,0,0,0.3);
  --tag-fiction: #1e3a5f; --tag-fiction-text: #93c5fd;
  --tag-technology: #14532d; --tag-technology-text: #86efac;
  --tag-science: #3f2d00; --tag-science-text: #fde047;
  --tag-history: #500724; --tag-history-text: #f9a8d4;
  --tag-non_fiction: #3b0764; --tag-non_fiction-text: #d8b4fe;
}

body { font-family: var(--font-body); background: var(--bg); color: var(--text); transition: background 0.3s, color 0.3s; }

.app-shell { display: flex; min-height: 100vh; }

.sidebar {
  width: 240px; min-height: 100vh; background: var(--sidebar-bg);
  display: flex; flex-direction: column; padding: 28px 0;
  position: fixed; top: 0; left: 0; bottom: 0; z-index: 100;
  border-right: 1px solid rgba(255,255,255,0.05);
}

.sidebar-brand {
  display: flex; align-items: center; gap: 12px;
  padding: 0 24px 32px; border-bottom: 1px solid rgba(255,255,255,0.06);
  margin-bottom: 16px;
}

.brand-icon {
  width: 38px; height: 38px;
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  border-radius: 10px; display: flex; align-items: center; justify-content: center;
  color: white; font-size: 16px; box-shadow: 0 4px 14px rgba(200, 151, 90, 0.4);
}

.brand-name { font-family: var(--font-display); font-size: 20px; color: #fff; font-weight: 600; }

.sidebar-nav { display: flex; flex-direction: column; gap: 4px; padding: 0 12px; flex: 1; }

.nav-item {
  display: flex; align-items: center; gap: 12px; padding: 11px 14px; border-radius: 10px;
  color: var(--sidebar-text); text-decoration: none; font-size: 14px; font-weight: 500;
  transition: all 0.2s;
}
.nav-item:hover { background: rgba(255,255,255,0.06); color: #fff; }
.nav-item--active { background: var(--sidebar-active-bg) !important; color: var(--sidebar-active) !important; }
.nav-item--active i { color: var(--accent); }

.sidebar-footer { padding: 16px 12px 0; border-top: 1px solid rgba(255,255,255,0.06); display: flex; flex-direction: column; gap: 4px; }

.user-card {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 12px; border-radius: 10px;
  background: rgba(255,255,255,0.04); margin-bottom: 8px;
}
.user-avatar {
  width: 34px; height: 34px; border-radius: 50%;
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  display: flex; align-items: center; justify-content: center;
  color: white; font-size: 14px; font-weight: 700; flex-shrink: 0;
}
.user-name { font-size: 13px; font-weight: 600; color: #fff; }
.user-role { font-size: 11px; color: var(--sidebar-text); }

.theme-toggle, .logout-btn {
  width: 100%; display: flex; align-items: center; gap: 10px;
  padding: 10px 14px; border-radius: 10px; background: none; border: none;
  color: var(--sidebar-text); font-size: 13px; cursor: pointer;
  transition: all 0.2s; font-family: var(--font-body); text-align: left;
}
.theme-toggle:hover { background: rgba(255,255,255,0.06); color: #fff; }
.logout-btn:hover { background: rgba(239,68,68,0.1); color: #f87171; }

.main-content { margin-left: 240px; flex: 1; min-height: 100vh; padding: 40px; background: var(--bg); }

.page-enter-active, .page-leave-active { transition: all 0.25s ease; }
.page-enter-from { opacity: 0; transform: translateY(12px); }
.page-leave-to { opacity: 0; transform: translateY(-8px); }

.page-header { margin-bottom: 36px; }
.page-header h1 { font-family: var(--font-display); font-size: 32px; font-weight: 700; color: var(--text); }
.page-header p { font-size: 15px; color: var(--text2); margin-top: 6px; }

.card { background: var(--card-bg); border-radius: var(--radius); border: 1px solid var(--border); box-shadow: var(--shadow); }

.genre-tag { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; }
.genre-FICTION { background: var(--tag-fiction); color: var(--tag-fiction-text); }
.genre-TECHNOLOGY { background: var(--tag-technology); color: var(--tag-technology-text); }
.genre-SCIENCE { background: var(--tag-science); color: var(--tag-science-text); }
.genre-HISTORY { background: var(--tag-history); color: var(--tag-history-text); }
.genre-NON_FICTION { background: var(--tag-non_fiction); color: var(--tag-non_fiction-text); }
</style>