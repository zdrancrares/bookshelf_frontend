<template>
  <div class="auth-page">
    <div class="auth-left">
      <div class="auth-left-content">
        <div class="auth-brand">
          <div class="brand-icon-lg"><i class="pi pi-book"></i></div>
          <span class="brand-name-lg">Bookshelf</span>
        </div>
        <h1 class="auth-headline">Start building<br />your library today.</h1>
        <p class="auth-sub">Create a free account and start organizing your book collection in minutes.</p>
        <div class="auth-steps">
          <div class="step"><span class="step-num">1</span><span>Create your account</span></div>
          <div class="step-line"></div>
          <div class="step"><span class="step-num">2</span><span>Add your books</span></div>
          <div class="step-line"></div>
          <div class="step"><span class="step-num">3</span><span>Enjoy your library</span></div>
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
          <h2>Create account</h2>
          <p>Join and start your collection</p>
        </div>

        <form class="auth-form" @submit.prevent="handleRegister">
          <div class="field">
            <label>Username</label>
            <div class="input-wrap">
              <i class="pi pi-user input-icon"></i>
              <input v-model="form.username" type="text" class="auth-input" placeholder="Choose a username" />
            </div>
            <small class="field-error" v-if="errors.username">{{ errors.username }}</small>
          </div>

          <div class="field">
            <label>Email</label>
            <div class="input-wrap">
              <i class="pi pi-envelope input-icon"></i>
              <input v-model="form.email" type="email" class="auth-input" placeholder="your@email.com" />
            </div>
            <small class="field-error" v-if="errors.email">{{ errors.email }}</small>
          </div>

          <div class="field">
            <label>Password</label>
            <div class="input-wrap">
              <i class="pi pi-lock input-icon"></i>
              <input
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  class="auth-input"
                  placeholder="At least 6 characters"
              />
              <button type="button" class="toggle-pass" @click="showPassword = !showPassword">
                <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
              </button>
            </div>
            <div class="password-strength" v-if="form.password">
              <div class="strength-bars">
                <div class="bar" :class="strengthClass(1)"></div>
                <div class="bar" :class="strengthClass(2)"></div>
                <div class="bar" :class="strengthClass(3)"></div>
              </div>
              <span class="strength-label">{{ strengthLabel }}</span>
            </div>
            <small class="field-error" v-if="errors.password">{{ errors.password }}</small>
          </div>

          <div class="field-error global-error" v-if="authError">
            <i class="pi pi-exclamation-circle"></i> {{ authError }}
          </div>

          <button type="submit" class="submit-btn" :disabled="loading">
            <span v-if="!loading">Create Account <i class="pi pi-arrow-right"></i></span>
            <span v-else><i class="pi pi-spin pi-spinner"></i> Creating account…</span>
          </button>
        </form>

        <div class="auth-footer">
          Already have an account?
          <RouterLink to="/login" class="auth-link">Sign in</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { register, loading, error: authError } = useAuth()

const form = ref({ username: '', email: '', password: '' })
const errors = ref({})
const showPassword = ref(false)

const decoBooks = [
  { title: 'Harry Potter', color: '#8b5cf6', height: '155px' },
  { title: 'The Hobbit', color: '#10b981', height: '175px' },
  { title: 'Atomic Habits', color: '#f59e0b', height: '135px' },
  { title: 'Deep Work', color: '#6366f1', height: '160px' },
  { title: 'Born to Run', color: '#ec4899', height: '125px' },
  { title: 'Meditations', color: '#c8975a', height: '150px' },
]

const passwordStrength = computed(() => {
  const p = form.value.password
  if (!p) return 0
  let score = 0
  if (p.length >= 6) score++
  if (p.length >= 10) score++
  if (/[A-Z]/.test(p) && /[0-9]/.test(p)) score++
  return score
})

const strengthLabel = computed(() => ['Weak', 'Fair', 'Strong'][passwordStrength.value - 1] || 'Weak')
const strengthClass = (level) => {
  if (level > passwordStrength.value) return ''
  return ['bar--weak', 'bar--fair', 'bar--strong'][passwordStrength.value - 1]
}

function validate() {
  errors.value = {}
  if (!form.value.username.trim()) errors.value.username = 'Username is required'
  if (!form.value.email.trim()) errors.value.email = 'Email is required'
  else if (!/\S+@\S+\.\S+/.test(form.value.email)) errors.value.email = 'Invalid email'
  if (!form.value.password) errors.value.password = 'Password is required'
  else if (form.value.password.length < 6) errors.value.password = 'Password must be at least 6 characters'
  return Object.keys(errors.value).length === 0
}

async function handleRegister() {
  if (!validate()) return
  try {
    await register(form.value)
    router.push('/dashboard')
  } catch {}
}
</script>

<style scoped>
/* Reuse all auth-page styles from LoginView */
.auth-page { display: flex; min-height: 100vh; }

.auth-left {
  flex: 1; background: linear-gradient(160deg, #0f2027 0%, #203a43 50%, #2c5364 100%);
  display: flex; flex-direction: column; justify-content: space-between;
  padding: 56px 48px 40px; position: relative; overflow: hidden;
}
.auth-left::before {
  content: ''; position: absolute; inset: 0;
  background: radial-gradient(circle at 60% 30%, rgba(16,185,129,0.1) 0%, transparent 50%);
}

.auth-left-content { position: relative; z-index: 1; }
.auth-brand { display: flex; align-items: center; gap: 14px; margin-bottom: 56px; }
.brand-icon-lg {
  width: 48px; height: 48px; border-radius: 14px;
  background: linear-gradient(135deg, #10b981, #059669);
  display: flex; align-items: center; justify-content: center;
  color: white; font-size: 20px; box-shadow: 0 6px 20px rgba(16,185,129,0.35);
}
.brand-name-lg { font-family: var(--font-display); font-size: 26px; color: #fff; font-weight: 700; }

.auth-headline { font-family: var(--font-display); font-size: 48px; font-weight: 700; color: #fff; line-height: 1.15; margin-bottom: 20px; }
.auth-sub { font-size: 16px; color: rgba(255,255,255,0.6); line-height: 1.6; margin-bottom: 40px; max-width: 360px; }

.auth-steps { display: flex; align-items: center; gap: 0; }
.step { display: flex; align-items: center; gap: 10px; color: rgba(255,255,255,0.7); font-size: 13px; }
.step-num {
  width: 28px; height: 28px; border-radius: 50%; border: 2px solid #10b981;
  display: flex; align-items: center; justify-content: center;
  color: #10b981; font-weight: 700; font-size: 12px; flex-shrink: 0;
}
.step-line { width: 32px; height: 1px; background: rgba(255,255,255,0.2); margin: 0 8px; }

.auth-books-decoration {
  display: flex; align-items: flex-end; gap: 8px;
  position: relative; z-index: 1; padding-top: 20px;
}
.deco-book {
  width: 42px; border-radius: 4px 8px 8px 4px;
  display: flex; align-items: flex-end; justify-content: center;
  padding-bottom: 10px; opacity: 0.65; box-shadow: 4px 4px 12px rgba(0,0,0,0.3);
  transition: opacity 0.2s;
}
.deco-book:hover { opacity: 1; }
.deco-book span { font-family: var(--font-display); font-size: 16px; font-weight: 700; color: rgba(255,255,255,0.9); writing-mode: vertical-rl; transform: rotate(180deg); }

.auth-right { width: 480px; display: flex; align-items: center; justify-content: center; padding: 40px; background: var(--bg); }
.auth-card { width: 100%; max-width: 400px; }
.auth-card-header { margin-bottom: 36px; }
.auth-card-header h2 { font-family: var(--font-display); font-size: 32px; font-weight: 700; color: var(--text); }
.auth-card-header p { font-size: 15px; color: var(--text2); margin-top: 6px; }

.auth-form { display: flex; flex-direction: column; gap: 20px; }
.field { display: flex; flex-direction: column; gap: 8px; }
label { font-size: 13px; font-weight: 600; color: var(--text); }
.input-wrap { position: relative; }
.input-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text2); font-size: 15px; pointer-events: none; }
.auth-input {
  width: 100%; padding: 13px 44px 13px 42px;
  border: 1.5px solid var(--border); border-radius: 10px;
  background: var(--card-bg); color: var(--text);
  font-family: var(--font-body); font-size: 15px; outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.auth-input:focus { border-color: #10b981; box-shadow: 0 0 0 3px rgba(16,185,129,0.12); }
.auth-input::placeholder { color: var(--text2); opacity: 0.6; }
.toggle-pass { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--text2); cursor: pointer; font-size: 15px; }

.password-strength { display: flex; align-items: center; gap: 10px; margin-top: 6px; }
.strength-bars { display: flex; gap: 4px; }
.bar { width: 40px; height: 4px; border-radius: 2px; background: var(--border); transition: background 0.3s; }
.bar--weak { background: #ef4444; }
.bar--fair { background: #f59e0b; }
.bar--strong { background: #10b981; }
.strength-label { font-size: 11px; color: var(--text2); }

.field-error { font-size: 12px; color: #ef4444; }
.global-error { display: flex; align-items: center; gap: 8px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 10px 14px; font-size: 13px; color: #dc2626; }

.submit-btn {
  width: 100%; padding: 14px;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white; border: none; border-radius: 10px;
  font-family: var(--font-body); font-size: 15px; font-weight: 600;
  cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
  transition: opacity 0.2s, transform 0.15s;
  box-shadow: 0 4px 14px rgba(16,185,129,0.3);
  margin-top: 4px;
}
.submit-btn:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); }
.submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

.auth-footer { margin-top: 28px; text-align: center; font-size: 14px; color: var(--text2); }
.auth-link { color: #10b981; font-weight: 600; text-decoration: none; margin-left: 4px; }
.auth-link:hover { text-decoration: underline; }

@media (max-width: 900px) {
  .auth-left { display: none; }
  .auth-right { width: 100%; }
}
</style>