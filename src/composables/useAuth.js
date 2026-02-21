import { ref } from 'vue'
import api from './useApi'
import { useAuthStore } from '@/stores/authStore'

export function useAuth() {
    const loading = ref(false)
    const error = ref(null)
    const authStore = useAuthStore()

    async function register(data) {
        loading.value = true
        error.value = null
        try {
            const res = await api.post('/auth/register', data)
            authStore.setAuth(res.data)
            return res.data
        } catch (err) {
            error.value = err.userMessage || 'Registration failed'
            throw err
        } finally {
            loading.value = false
        }
    }

    async function login(data) {
        loading.value = true
        error.value = null
        try {
            const res = await api.post('/auth/login', data)
            authStore.setAuth(res.data)
            return res.data
        } catch (err) {
            error.value = err.userMessage || 'Invalid username or password'
            throw err
        } finally {
            loading.value = false
        }
    }

    return { loading, error, register, login }
}