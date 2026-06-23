<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

const nome = ref('')
const email = ref('')
const senha = ref('')
const confirmarSenha = ref('')
const loading = ref(false)
const error = ref('')

const cadastrar = async () => {
  error.value = ''

  // 1. Verifica se as senhas coincidem
  if (senha.value !== confirmarSenha.value) {
    error.value = 'As senhas não coincidem'
    return
  }

  // 2. Verifica a força da senha antes de chamar a API
  const senhaForteRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  if (!senhaForteRegex.test(senha.value)) {
    error.value = 'Sua senha é fraca. Use pelo menos 8 caracteres, incluindo maiúsculas, minúsculas, números e símbolos.'
    return
  }

  loading.value = true

  try {
    await axios.post('https://maravilhas-da-roca-tiapn.onrender.com/usuarios', {
      nome: nome.value,
      email: email.value,
      senha: senha.value
    })

    router.push('/login')

  } catch (err: any) {
    const data = err?.response?.data;
    if (data?.errors && Array.isArray(data.errors)) {
      error.value = data.errors[0]?.message || "Dados inválidos";
    } else if (data?.message) {
      error.value = data.message;
    } else {
      error.value = "Erro ao criar conta";
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
<div class="min-h-screen flex items-center justify-center bg-[#F6EFE6] px-6 py-16">

  <div class="w-full max-w-2xl">

    <div class="bg-white/85 backdrop-blur-xl border border-[#EED9C4]/60 shadow-[0_40px_120px_rgba(0,0,0,0.12)] rounded-[3rem] p-14">

      <div class="text-center">

        <div class="text-6xl mb-4">🌾</div>

        <h1 class="text-5xl font-black font-serif text-[#2E1F16]">
          Crie sua conta
        </h1>

        <p v-if="error" class="mt-4 text-red-600 font-semibold text-sm">
          {{ error }}
        </p>

      </div>

      <div class="mt-10 space-y-6">

        <input
          v-model="nome"
          type="text"
          placeholder="Nome completo"
          class="w-full px-5 py-4 rounded-2xl bg-[#F7F1E8] border border-[#EED9C4] outline-none focus:ring-2 focus:ring-[#C49A55]/60"
        />

        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="w-full px-5 py-4 rounded-2xl bg-[#F7F1E8] border border-[#EED9C4] outline-none focus:ring-2 focus:ring-[#C49A55]/60"
        />

        <input
          v-model="senha"
          type="password"
          placeholder="Senha"
          class="w-full px-5 py-4 rounded-2xl bg-[#F7F1E8] border border-[#EED9C4] outline-none focus:ring-2 focus:ring-[#C49A55]/60"
        />

        <input
          v-model="confirmarSenha"
          type="password"
          placeholder="Confirmar senha"
          class="w-full px-5 py-4 rounded-2xl bg-[#F7F1E8] border border-[#EED9C4] outline-none focus:ring-2 focus:ring-[#C49A55]/60"
        />

      </div>

      <button
        @click="cadastrar"
        :disabled="loading"
        class="mt-10 w-full py-5 rounded-2xl font-bold bg-[#2E1F16] hover:bg-[#C49A55] text-white transition disabled:opacity-50"
      >
        {{ loading ? 'Criando sua conta...' : 'CRIAR CONTA' }}
      </button>

      <p class="text-center mt-8 text-sm text-[#6B4B36]">
        Já tem conta?
        <RouterLink to="/login" class="text-[#C49A55] font-bold hover:underline">
          Entrar agora
        </RouterLink>
      </p>

    </div>

  </div>

</div>
</template>