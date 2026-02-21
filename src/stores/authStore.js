import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/composables/useApi'

export const useAuthStore = defineStore('auth', () => {
    const token = ref(localStorage.getItem('token') || null)
    const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))

    const isAuthenticated = computed(() => !!token.value)

    function setAuth(authResponse) {
        token.value = authResponse.token
        user.value = {
            username: authResponse.username,
            email: authResponse.email,
            role: authResponse.role
        }
        localStorage.setItem('token', authResponse.token)
        localStorage.setItem('user', JSON.stringify(user.value))
        api.defaults.headers.common['Authorization'] = `Bearer ${authResponse.token}`
    }

    function logout() {
        token.value = null
        user.value = null
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        delete api.defaults.headers.common['Authorization']
    }

    // Restore token on page reload
    function init() {
        if (token.value) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
        }
    }

    return { token, user, isAuthenticated, setAuth, logout, init }
})