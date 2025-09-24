import { ICreateOrderPayload } from "@/features/orders/type"
import { axiosInstance } from "@/lib/axiosInstances"

const ORDER_URL = "/orders"
export const createOrders = async (payload : ICreateOrderPayload, token:string )=> {
    const res = await axiosInstance.post(`${ORDER_URL}/checkout`, payload, {
        headers: { Authorization: `Bearer ${token}` },
    })
    return res.data.data
}