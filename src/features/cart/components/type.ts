export interface ICartItems {
  id: string
  quantity: number
  price: number
  subTotal: number
  product: {
    name: string
    price: number
  }
}

