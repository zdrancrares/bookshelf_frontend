<template>
  <div class="auth-page">
    <div class="auth-left">
      <div class="auth-left-content">
        <div class="auth-brand">
          <div class="brand-icon-lg"><i class="pi pi-book"></i></div>
          <span class="brand-name-lg">Bookshelf</span>
        </div>
        <h1 class="auth-headline">Your personal<br />library, organized.</h1>
        <p class="auth-sub">Track, manage, and discover books you love. All in one elegant place.</p>
        <div class="auth-features">
          <div class="feature"><i class="pi pi-check-circle"></i> Full CRUD book management</div>
          <div class="feature"><i class="pi pi-check-circle"></i> Genre filtering & sorting</div>
          <div class="feature"><i class="pi pi-check-circle"></i> Open Library integration</div>
        </div>
      </div>
      <div class="auth-books-decoration">
        <div class="deco-book" v-for="b in decoBooks" :key="b.title" :style="{ background: b.color, height: b.height }">
          <span>{{ b.title.charAt(0) }}</span>
        </div>
      </div>
    </div>

    <div class="auth-right">
      <div class="auth-card">
        <div class="auth-card-header">
          <h2>Welcome back</h2>
          <p>Sign in to your account</p>
        </div>

        <form class="auth-form" @submit.prevent="handleLogin">
          <div class="field">
            <label>Username</label>
            <div class="input-wrap">
              <i class="pi pi-user input-icon"></i>
              <input
                  v-model="form.username"
                  type="text"
                  class="auth-input"
                  placeholder="Enter your username"
                  autocomplete="username"
              />
            </div>
            <small class="field-error" v-if="errors.username">{{ errors.username }}</small>
          </div>

          <div class="field">
            <label>Password</label>
            <div class="input-wrap">
              <i class="pi pi-lock input-icon"></i>
              <input
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  class="auth-input"
                  placeholder="Enter your password"
                  autocomplete="current-password"
              />
              <button type="button" class="toggle-pass" @click="showPassword = !showPassword">
                <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
              </button>
            </div>
            <small class="field-error" v-if="errors.password">{{ errors.password }}</small>
          </div>

          <div class="field-error global-error" v-if="authError">
            <i class="pi pi-exclamation-circle"></i> {{ authError }}
          </div>

          <button type="submit" class="submit-btn" :class="{ loading }" :disabled="loading">
            <span v-if="!loading">Sign In <i class="pi pi-arrow-right"></i></span>
            <span v-else><i class="pi pi-spin pi-spinner"></i> Signing in…</span>
          </button>
        </form>

        <div class="auth-footer">
          Don't have an account?
          <RouterLink to="/register" class="auth-link">Create one</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { login, loading, error: authError } = useAuth()

const form = ref({ username: '', password: '' })
const errors = ref({})
const showPassword = ref(false)

const decoBooks = [
  { title: 'Clean Code', color: '#6366f1', height: '140px' },
  { title: 'DUNE', color: '#c8975a', height: '180px' },
  { title: 'Sapiens', color: '#10b981', height: '120px' },
  { title: '1984', color: '#ec4899', height: '160px' },
  { title: 'The Pragmatic Programmer', color: '#8b5cf6', height: '145px' },
  { title: 'Cosmos', color: '#f59e0b', height: '130px' },
]

function validate() {
  errors.value = {}
  if (!form.value.username.trim()) errors.value.username = 'Username is required'
  if (!form.value.password) errors.value.password = 'Password is required'
  return Object.keys(errors.value).length === 0
}

async function handleLogin() {
  if (!validate()) return
  try {
    await login(form.value)
    router.push('/dashboard')
  } catch {}
}
</script>

<style scoped>
.auth-page { display: flex; min-height: 100vh; }

.auth-left {
  flex: 1; background: linear-gradient(160deg, #1a1a2e 0%, #2d1b69 60%, #1a1a2e 100%);
  display: flex; flex-direction: column; justify-content: space-between;
  padding: 56px 48px 40px; position: relative; overflow: hidden;
}
.auth-left::before {
  content: ''; position: absolute; inset: 0;
  background: radial-gradient(circle at 30% 40%, rgba(200,151,90,0.15) 0%, transparent 50%);
}

.auth-left-content { position: relative; z-index: 1; }

.auth-brand { display: flex; align-items: center; gap: 14px; margin-bottom: 56px; }
.brand-icon-lg {
  width: 48px; height: 48px; border-radius: 14px;
  background: linear-gradient(135deg, #c8975a, #8b4513);
  display: flex; align-items: center; justify-content: center;
  color: white; font-size: 20px; box-shadow: 0 6px 20px rgba(200,151,90,0.4);
}
.brand-name-lg { font-family: var(--font-display); font-size: 26px; color: #fff; font-weight: 700; }

.auth-headline {
  font-family: var(--font-display); font-size: 48px; font-weight: 700; color: #fff;
  line-height: 1.15; margin-bottom: 20px;
}
.auth-sub { font-size: 16px; color: rgba(255,255,255,0.6); line-height: 1.6; margin-bottom: 40px; max-width: 360px; }

.auth-features { display: flex; flex-direction: column; gap: 12px; }
.feature { display: flex; align-items: center; gap: 10px; color: rgba(255,255,255,0.7); font-size: 14px; }
.feature i { color: #c8975a; }

.auth-books-decoration {
  display: flex; align-items: flex-end; gap: 8px;
  position: relative; z-index: 1; padding-top: 20px;
}
.deco-book {
  width: 42px; border-radius: 4px 8px 8px 4px;
  display: flex; align-items: flex-end; justify-content: center;
  padding-bottom: 10px; opacity: 0.7; transition: opacity 0.2s;
  box-shadow: 4px 4px 12px rgba(0,0,0,0.3);
}
.deco-book:hover { opacity: 1; }
.deco-book span { font-family: var(--font-display); font-size: 16px; font-weight: 700; color: rgba(255,255,255,0.9); writing-mode: vertical-rl; transform: rotate(180deg); }

.auth-right {
  width: 480px; display: flex; align-items: center; justify-content: center;
  padding: 40px; background: var(--bg);
}

.auth-card { width: 100%; max-width: 400px; }

.auth-card-header { margin-bottom: 36px; }
.auth-card-header h2 { font-family: var(--font-display); font-size: 32px; font-weight: 700; color: var(--text); }
.auth-card-header p { font-size: 15px; color: var(--text2); margin-top: 6px; }

.auth-form { display: flex; flex-direction: column; gap: 20px; }

.field { display: flex; flex-direction: column; gap: 8px; }
label { font-size: 13px; font-weight: 600; color: var(--text); }

.input-wrap { position: relative; }
.input-icon {
  position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
  color: var(--text2); font-size: 15px; pointer-events: none;
}
.auth-input {
  width: 100%; padding: 13px 44px 13px 42px;
  border: 1.5px solid var(--border); border-radius: 10px;
  background: var(--card-bg); color: var(--text);
  font-family: var(--font-body); font-size: 15px; outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.auth-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(200,151,90,0.12); }
.auth-input::placeholder { color: var(--text2); opacity: 0.6; }

.toggle-pass {
  position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
  background: none; border: none; color: var(--text2); cursor: pointer; padding: 2px;
  font-size: 15px; transition: color 0.2s;
}
.toggle-pass:hover { color: var(--accent); }

.field-error { font-size: 12px; color: #ef4444; }
.global-error {
  display: flex; align-items: center; gap: 8px;
  background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px;
  padding: 10px 14px; font-size: 13px; color: #dc2626;
}

.submit-btn {
  width: 100%; padding: 14px;
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  color: white; border: none; border-radius: 10px;
  font-family: var(--font-body); font-size: 15px; font-weight: 600;
  cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
  transition: opacity 0.2s, transform 0.15s;
  box-shadow: 0 4px 14px rgba(200,151,90,0.35);
  margin-top: 4px;
}
.submit-btn:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); }
.submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

.auth-footer { margin-top: 28px; text-align: center; font-size: 14px; color: var(--text2); }
.auth-link { color: var(--accent); font-weight: 600; text-decoration: none; margin-left: 4px; }
.auth-link:hover { text-decoration: underline; }

@media (max-width: 900px) {
  .auth-left { display: none; }
  .auth-right { width: 100%; }
}
</style>