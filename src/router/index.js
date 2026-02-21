import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import DashboardView from '@/views/DashboardView.vue'
import BooksView from '@/views/BooksView.vue'
import BookDetailView from '@/views/BookDetailView.vue'
import ExternalSearchView from '@/views/ExternalSearchView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Public routes
    { path: '/login',    name: 'login',    component: LoginView,    meta: { public: true } },
    { path: '/register', name: 'register', component: RegisterView, meta: { public: true } },

    // Protected routes
    { path: '/',         redirect: '/dashboard' },
    { path: '/dashboard',name: 'dashboard',component: DashboardView },
    { path: '/books',    name: 'books',    component: BooksView },
    { path: '/books/:id',name: 'book-detail', component: BookDetailView },
    { path: '/search',   name: 'external-search', component: ExternalSearchView }
  ]
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (!to.meta.public && !auth.isAuthenticated) {
    return { name: 'login' }
  }
  if (to.meta.public && auth.isAuthenticated) {
    return { name: 'dashboard' }
  }
})

export default router