
import { OrderStatus } from "@/features/orders/type";
import {
  ClockIcon,
  CreditCardIcon,
  Cog6ToothIcon,
  TruckIcon,
  CheckBadgeIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";


export const ORDER_STATUS_STYLE: Record<
  OrderStatus,
  { className: string; label: string; Icon: React.FC<React.SVGProps<SVGSVGElement>> }
> = {
  [OrderStatus.WAITING_FOR_PAYMENT]: {
    className: "bg-yellow-100 text-yellow-700 border border-yellow-300",
    label: "Waiting for Payment",
    Icon: ClockIcon,
  },
  [OrderStatus.WAITING_CONFIRMATION_PAYMENT]: {
    className: "bg-blue-100 text-blue-700 border border-blue-300",
    label: "Payment Confirmation",
    Icon: CreditCardIcon,
  },
  [OrderStatus.IN_PROCESS]: {
    className: "bg-purple-100 text-purple-700 border border-purple-300",
    label: "In Process",
    Icon: Cog6ToothIcon,
  },
  [OrderStatus.DELIVERED]: {
    className: "bg-emerald-100 text-emerald-700 border border-emerald-300",
    label: "Delivered",
    Icon: TruckIcon,
  },
  [OrderStatus.ORDER_CONFIRMATION]: {
    className: "bg-green-100 text-green-700 border border-green-300",
    label: "Completed",
    Icon: CheckBadgeIcon,
  },
  [OrderStatus.CANCELLED]: {
    className: "bg-red-100 text-red-700 border border-red-300 rounded-md",
    label: "Cancelled",
    Icon: XCircleIcon,
  },
};
