interface IStock {
  id: string;
  productId: string;
  storeId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

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
    stocks : IStock[]
    weight_g : number
    images?: {
      url: string
      isPrimary: boolean
    }[]
  }
}


