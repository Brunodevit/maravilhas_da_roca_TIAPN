import api from "./api"

export const addToCart = (product_id: number, quantity = 1) => {
  return api.post("/cart/add", { product_id, quantity })
}

export const getCart = () => {
  return api.get("/cart")
}

// ➕ FUNÇÕES QUE ESTAVAM FALTANDO:
export const updateCartItem = (product_id: number, quantity: number) => {
  return api.put("/cart/update", { product_id, quantity })
}

export const removeItemFromCart = (product_id: number) => {
  return api.delete(`/cart/remove/${product_id}`)
}