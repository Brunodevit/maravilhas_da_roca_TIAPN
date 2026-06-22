import axios from "axios"

const api = axios.create({
  baseURL: "https://maravilhas-da-roca-tiapn.onrender.com",
  withCredentials: true
})

// INTERCEPTOR DE ENVIAR O TOKEN (Você já tinha feito, tá perfeito!)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// NOVO: INTERCEPTOR DE RESPOSTA (Captura o token expirado)
api.interceptors.response.use(
  (response) => {
    // Se a requisição deu certo, apenas passa a resposta adiante
    return response
  },
  (error) => {
    // Se o erro for 401 (Não autorizado / Token Expirado)
    if (error.response && error.response.status === 401) {
      console.warn("Token expirado ou inválido. Deslogando usuário...")
      
      // 1. Limpa o token velho do navegador
      localStorage.removeItem("token")
      
      // 2. Redireciona o usuário para a tela de login
      // (Usamos o window.location puro aqui porque este arquivo está fora do ecossistema do Vue Router)
      window.location.href = "/login"
    }

    // Retorna o erro para caso algum componente ainda queira tratar no catch
    return Promise.reject(error)
  }
)

export default api