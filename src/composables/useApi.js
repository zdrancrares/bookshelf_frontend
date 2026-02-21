import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
    headers: { 'Content-Type': 'application/json' }
})

api.interceptors.response.use(
    res => res,
    err => {
        const message = err.response?.data?.detail || err.response?.data?.message || 'An error occurred'
        if (err.response?.status === 401) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.href = '/login'
        }
        return Promise.reject({ ...err, userMessage: message })
    }
)

export default api