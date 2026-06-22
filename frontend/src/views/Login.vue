<script setup lang="ts">
import { ref } from "vue";
import api from "../services/api";
import { useRouter } from "vue-router";

const router = useRouter();

const email = ref("");
const senha = ref("");
const loading = ref(false);
const error = ref("");

const entrar = async () => {
  loading.value = true;
  error.value = "";

  try {
    const response = await api.post("/auth/login", {
      email: email.value,
      senha: senha.value,
    });

    const token = response.data.token;
    const role = response.data.role || response.data.user?.role || "cliente";

    localStorage.setItem("token", token);
    localStorage.setItem("user_role", role);

    if (role === "admin") {
      router.push("/admin/pedidos");
    } else {
      router.push("/");
    }
  } catch (err: any) {
    error.value = err?.response?.data?.message || "Erro ao fazer login";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen grid lg:grid-cols-2 bg-[#F6EFE6]">
    <div class="relative hidden lg:block overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1542838132-92c53300491e"
        class="absolute inset-0 w-full h-full object-cover scale-105"
      />
      <div class="absolute inset-0 bg-black/30"></div>
      <div class="absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent"></div>

      <div class="relative h-full flex items-center px-16">
        <div class="max-w-md text-white bg-black/20 backdrop-blur-md p-8 rounded-2xl border border-white/10">
          <span class="text-xs tracking-[0.35em] uppercase text-[#E7CFA7] font-bold">
            Maravilhas da Roça
          </span>
          <h1 class="mt-6 text-6xl font-black font-serif leading-[1.05] text-[#FFF6E9]">
            O sabor que nasce<br />da terra viva
          </h1>
          <p class="mt-6 text-white/90 text-lg leading-relaxed">
            Produtos artesanais feitos com cuidado, tradição e ingredientes naturais direto da origem.
          </p>
        </div>
      </div>
    </div>

    <div class="flex items-center justify-center px-8">
      <div class="w-full max-w-md">
        <div class="bg-white/80 backdrop-blur-xl border border-[#EED9C4]/50 shadow-2xl rounded-[2.5rem] p-10">
          <div class="text-center mb-10">
            <div class="text-4xl mb-3">🌾</div>
            <h2 class="text-3xl font-black font-serif text-[#2E1F16]">
              Bem-vindo de volta
            </h2>
            <p class="text-sm text-[#6B4B36] mt-2">
              Entre para acessar sua experiência da roça
            </p>
            <p v-if="error" class="mt-4 text-red-600 text-sm">
              {{ error }}
            </p>
          </div>

          <div class="space-y-5">
            <input
              v-model="email"
              type="email"
              placeholder="Email"
              class="w-full px-5 py-4 rounded-2xl bg-[#F7F1E8] border border-[#EED9C4] outline-none focus:ring-2 focus:ring-[#C49A55]/60 transition"
            />
            <input
              v-model="senha"
              type="password"
              placeholder="Senha"
              class="w-full px-5 py-4 rounded-2xl bg-[#F7F1E8] border border-[#EED9C4] outline-none focus:ring-2 focus:ring-[#C49A55]/60 transition"
            />
          </div>

          <button
            @click="entrar"
            :disabled="loading"
            class="mt-8 w-full py-4 rounded-2xl font-bold tracking-widest bg-[#2E1F16] hover:bg-[#C49A55] text-white transition-all disabled:opacity-50"
          >
            {{ loading ? "Entrando..." : "Entrar" }}
          </button>

          <p class="text-center mt-6 text-sm text-[#6B4B36]">
            Não tem conta?
            <RouterLink
              to="/cadastro"
              class="text-[#C49A55] font-bold hover:underline"
            >
              Criar agora
            </RouterLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>