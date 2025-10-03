<script setup>
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const HARD_CODED_CREDENTIALS = {
  username: 'admin',
  password: '123456'
}

const form = reactive({
  username: '',
  password: ''
})

const loading = ref(false)
const errorMessage = ref('')

const authenticate = () => {
  return (
    form.username === HARD_CODED_CREDENTIALS.username &&
    form.password === HARD_CODED_CREDENTIALS.password
  )
}

const handleSubmit = () => {
  if (loading.value) return

  errorMessage.value = ''

  if (!form.username || !form.password) {
    errorMessage.value = 'Please enter username and password.'
    return
  }

  loading.value = true

  if (authenticate()) {
    localStorage.setItem('ts-authenticated', 'true')
    localStorage.setItem('ts-username', form.username)

    const redirectTarget =
      typeof route.query.redirect === 'string' && route.query.redirect !== '/login'
        ? route.query.redirect
        : '/'

    router.replace(redirectTarget)
  } else {
    errorMessage.value = 'Incorrect username or password.'
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <h1>TradeSense Login</h1>
      <p class="login-card__subtitle">Sign in with the test account to access the console.</p>
      <el-alert
        v-if="errorMessage"
        type="error"
        :closable="false"
        show-icon
        class="login-card__alert"
      >
        {{ errorMessage }}
      </el-alert>
      <el-form
        :model="form"
        label-position="top"
        class="login-form"
        size="large"
      >
        <el-form-item label="Username">
          <el-input
            v-model="form.username"
            placeholder="admin"
            autocomplete="username"
            clearable
          />
        </el-form-item>
        <el-form-item label="Password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="123456"
            autocomplete="current-password"
            show-password
          />
        </el-form-item>
        <el-button
          type="primary"
          class="login-form__submit"
          :loading="loading"
          @click="handleSubmit"
        >
          Log in
        </el-button>
      </el-form>
      <p class="login-card__hint">Demo account: admin / 123456</p>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f83ff 0%, #3dd9eb 100%);
  padding: 24px;
}

.login-card {
  width: 100%;
  max-width: 420px;
  padding: 48px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 18px 45px rgba(15, 131, 255, 0.18);
}

.login-card h1 {
  margin: 0 0 8px;
  font-size: 28px;
  font-weight: 600;
  text-align: center;
}

.login-card__subtitle {
  margin: 0 0 24px;
  text-align: center;
  color: #606266;
}

.login-card__alert {
  margin-bottom: 16px;
}

.login-form__submit {
  width: 100%;
  margin-top: 8px;
}

.login-card__hint {
  margin: 24px 0 0;
  text-align: center;
  color: #909399;
  font-size: 13px;
}

@media (max-width: 480px) {
  .login-card {
    padding: 32px 24px;
  }

  .login-card h1 {
    font-size: 24px;
  }

  .login-card__subtitle {
    font-size: 14px;
  }
}

</style>
