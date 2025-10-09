"use client";
import LoadingThreeDotsPulse from "@/components/ui/loading";
import OrderStatusBadge from "@/features/orders/OrderStatusBedge";
import { OrderStatus } from "@/features/orders/type";
import UploadPayment from "@/features/orders/UploadPayment";
import AuthGuard from "@/hoc/AuthGuard";
import { cancelOrder, confirmOrder, getOrderDetail } from "@/services/order";
import useAuthStore from "@/store/useAuthStore";
import { useOrderStore } from "@/store/userOrderStore";
import { formatDateWithTime } from "@/utils/formatDate";
import { formatPrice } from "@/utils/formatPrice";
import { normalizeOrderStatus } from "@/utils/normalizeOrderStatus";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import { size } from "lodash";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function OrderDetail() {
  const { id } = useParams();
  const { currentOrder, setCurrentOrder } = useOrderStore();
  const { currentShipping, currentAddress } = useOrderStore();
  const { token } = useAuthStore();
  const normalizedStatus = normalizeOrderStatus(currentOrder?.status ?? "");
  const [loading, setLoading] = useState(true);

  // Fetch order & polling tiap 30 detik
  useEffect(() => {
    if (!id || !token) return;
    const fetchOrder = async () => {
      setLoading(true);
      const order = await getOrderDetail(id as string, token);
      console.log("🔍 Fetched Order:", order);
      setCurrentOrder(order);
      setLoading(false);
      console.log(order);
    };

    fetchOrder();
    const interval = setInterval(fetchOrder, 30000);
    return () => clearInterval(interval);
  }, [id, token, setCurrentOrder]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingThreeDotsPulse />
      </div>
    );

  const isWaitingForPayment =
    normalizedStatus === OrderStatus.WAITING_FOR_PAYMENT;
  const isCancelled = normalizedStatus === OrderStatus.CANCELLED;
  const isWaitingConfirmation =
    normalizedStatus === OrderStatus.WAITING_CONFIRMATION_PAYMENT;
  const isInProcess = normalizedStatus === OrderStatus.IN_PROCESS;
  const isDelivered = normalizedStatus === OrderStatus.DELIVERED;
  const isFinished = normalizedStatus === OrderStatus.ORDER_CONFIRMATION;

  const refreshOrder = async () => {
    if (token) {
      const updatedOrder = await getOrderDetail(id as string, token);
      setCurrentOrder(updatedOrder);
    }
  };

  const handleCancelOrder = async () => {
    if (!token) return;

    const confirmCancel = confirm(
      "Are you sure you want to cancel this order?"
    );
    if (!confirmCancel) return;

    try {
      await cancelOrder(id as string, token);
      toast.success("Order cancelled successfully!");
      refreshOrder();
    } catch (err) {
      console.error(err);
      toast.error("Failed to cancel order");
    }
  };

  const handleConfirmOrder = async () => {
    if (!token) return;

    const confirmReceive = confirm(
      "Are you sure you have received your order?"
    );
    if (!confirmReceive) return;

    try {
      await confirmOrder(id as string, token);
      toast.success("Order confirmed! Thank you.");
      refreshOrder();
    } catch (err) {
      console.error(err);
      toast.error("Failed to confirm order");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 mx-auto mt-15 p-6 max-w-3xl">
      <h1 className="font-bold text-xl mb-4">Order Detail</h1>

      <div className="grid grid-cols-1 gap-4">
        <Section>
          <div className="flex justify-between">
            <span className="font-bold">Order Status:</span>
            <OrderStatusBadge status={normalizedStatus} />
          </div>
          <div className="flex justify-between">
            <span>Order ID</span>
            <span>{currentOrder?.id}</span>
          </div>
          <div className="flex justify-between">
            <span>Order Date</span>
            <span>{formatDateWithTime(currentOrder?.createdAt ?? "")}</span>
          </div>
        </Section>
        <Section>
          <span className="font-semibold">Shipment</span>

          <div className="grid grid-cols-[120px_20px_1fr] gap-y-2">
            <span>Courier</span>
            <span>:</span>
            <span>{currentShipping?.name}</span>

            <span>Tracking Number</span>
            <span>:</span>
            <span>-</span>

            <span>Address</span>
            <span>:</span>
            <div className="flex flex-col">
              <span>{currentOrder?.user?.receiverName}</span>
              <span>{currentOrder?.user?.receiverPhone}</span>
              <span>{currentAddress?.address}</span>
            </div>
          </div>
        </Section>

        <Section>
          <h1 className="font-bold">Payment Detail</h1>
          <div className="flex justify-between border-b border-dashed pb-2 mb-2">
            <span>Payment Method</span>
            <span>{currentOrder?.paymentMethod}</span>
          </div>
          <div className="flex justify-between">
            <span>Items Subtotal</span>
            <span>{formatPrice(currentOrder?.sub_total ?? 0)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipment Cost</span>
            <span>{formatPrice(currentShipping?.cost ?? 0)}</span>
          </div>
          <div className="flex justify-between border-b border-dashed pb-2 mb-2">
            <span>Discount</span>
            <span>- ({formatPrice(currentOrder?.discount ?? 0)})</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total Order</span>
            <span>{formatPrice(currentOrder?.finalPrice ?? 0)}</span>
          </div>

          {isWaitingForPayment ? (
            <>
              <UploadPayment onSuccess={refreshOrder} />

              <button
                onClick={handleCancelOrder}
                className="font-semibold py-2 px-4 rounded-md w-full bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed mt-2"
                disabled={!isWaitingForPayment}
              >
                Cancel Order
              </button>
            </>
          ) : isCancelled ? (
            <div className="p-4 bg-red-100 text-red-700 rounded-md text-center font-medium">
              Order has been canceled due to unpaid after 1 hour.
            </div>
          ) : isWaitingConfirmation ? (
            <div className="p-4 bg-yellow-100 text-yellow-700 rounded-md text-center font-medium">
              Waiting for payment confirmation by admin.
            </div>
          ) : isInProcess ? (
            <div className="p-4 bg-blue-100 text-blue-700 rounded-md text-center font-medium">
              Payment confirmed. Your order is being processed.
            </div>
          ) : isDelivered ? (
            <div className="p-4 bg-green-100 text-green-700 rounded-md text-center font-medium">
              <p>
                Your order is being delivered to your location. <br />
                Please confirm your order after receiving the items.
              </p>

              <button
                onClick={handleConfirmOrder}
                className="mt-3 font-semibold py-2 px-4 rounded-md w-full bg-green-600 text-white hover:bg-green-700"
              >
                Confirm Received
              </button>
            </div>
          ) : isFinished ? (
            <div className="flex flex-col items-center p-4 bg-green-100 text-green-700 rounded-md text-center font-medium">
              <CheckBadgeIcon className="h-24 w-24" />
              <p>
                Order received — thank you! <br />
                Don’t forget to check out our latest products for your next
                order
              </p>
            </div>
          ) : null}
        </Section>
      </div>
    </div>
  );
}

function Section({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white p-4 rounded-md shadow space-y-2">{children}</div>
  );
}

export default AuthGuard(OrderDetail, ["CUSTOMER"]);
