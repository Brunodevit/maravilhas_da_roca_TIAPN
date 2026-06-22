import axios from "axios"

const api = axios.create({
  baseURL: "https://maravilhas-da-roca-tiapn.onrender.com",
  withCredentials: true
})

// INTERCEPTOR DE ENVIAR O TOKEN
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// INTERCEPTOR DE RESPOSTA (Captura o token expirado)
api.interceptors.response.use(
  (response) => {
    // Se a requisição deu certo, apenas passa a resposta adiante
    return response
  },
  (error) => {
    const urlDaRequisicao = error.config?.url || ''
    const ehRotaDeLogin = urlDaRequisicao.includes('/auth/login')

    // 🔑 CORREÇÃO: Só desloga se for 401 E NÃO for a rota de login
    if (error.response && error.response.status === 401 && !ehRotaDeLogin) {
      console.warn("Token expirado ou inválido. Deslogando usuário...")
      
      // 1. Limpa o token velho do navegador
      localStorage.removeItem("token")
      localStorage.removeItem("user_role")
      
      // 2. Redireciona o usuário para a tela de login
      window.location.href = "/login"
    }

    // Retorna o erro para o bloco catch do componente poder ler
    return Promise.reject(error)
  }
)

export default api