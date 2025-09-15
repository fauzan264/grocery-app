export interface ICartItems {
  id: string
  cartId : string
  productId : string
  quantity: number
  price: number
  subTotal: number
  product: {
    name: string
    price: number
  }
}


