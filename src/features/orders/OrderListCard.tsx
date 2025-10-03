import { ShoppingBagIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { IOrderResponse} from "./type";
import { formatDateWithTime } from "@/utils/formatDate";
import OrderStatusBadge from "./OrderStatusBedge";
import { normalizeOrderStatus } from "@/utils/normalizeOrderStatus";
import { useRouter } from "next/navigation";

interface OrderListCardProps {
    order: IOrderResponse;
}
export default function OrderListCard({ order }: OrderListCardProps) {
    const normalizedStatus = normalizeOrderStatus(order?.status ?? "");
    const router = useRouter();

    const goToDetail = () => {
        router.push(`/orders/${order.id}`);
    };

    return (
        <div className="card w-full mx-auto bg-base-100 shadow-md border-gray-200 mb-4">
            <div className="card-body p-4">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                        <ShoppingBagIcon className="w-5 h-5" />
                        <div className="text-sm text-gray-500">
                            {formatDateWithTime(order.createdAt)}
                        </div>
                    </div>
                    <OrderStatusBadge status={normalizedStatus} />
                </div>
                <div>Order Id : {order.id}</div>

                {/* Product */}
                <div className="flex justify-between items-center gap-3">
                    {/* Kiri: Gambar + Info Produk */}
                    <div className="flex items-center gap-3">
                        <Image
                            src="/grocery.jpg"
                            alt="Sample Product"
                            width={64}
                            height={64}
                            className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex flex-col">
                            <div className="text-sm font-medium">
                                {order.items?.[0].product.name}
                            </div>
                            <div className="text-xs text-gray-500">
                                {order.items?.[0].quantity} x{" "}
                                {order.items?.[0].price}
                            </div>
                        </div>
                    </div>

                    {/* Kanan: Total */}
                    <div className="text-right">
                        <div className="text-sm">Total</div>
                        <div className="font-bold">Rp 150.000</div>
                        <div className="text-xs text-gray-500">
                            {order.totalItems} Items
                        </div>
                    </div>
                </div>

                {/* Footer */}

                <div className="w-full flex justify-end mt-4">
                    <button 
                    className="btn btn-outline btn-success"
                    onClick={goToDetail}>
                        Order Detail
                    </button>
                </div>
            </div>
        </div>
    );
}
