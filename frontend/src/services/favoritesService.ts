import api from "./api"

export const addToFavorites = (ProCodigo: number) => {
  return api.post("/favoritos", { ProCodigo })
}

export const getFavorites = () => {
  return api.get("/favoritos")
}

export const removeFromFavorites = (FavCodigo: number) => {
  return api.delete(`/favoritos/${FavCodigo}`)
}