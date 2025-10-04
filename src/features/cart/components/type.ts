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
    stock : number
    weight_g : number
    images?: {
      url: string
      isPrimary: boolean
    }[]
  }
}


