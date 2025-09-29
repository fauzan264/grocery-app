// src/constants/orderStatusStyle.ts
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
    className: "badge badge-warning",
    label: "Waiting for Payment",
    Icon: ClockIcon,
  },
  [OrderStatus.WAITING_CONFIRMATION_PAYMENT]: {
    className: "badge badge-info",
    label: "Waiting for Payment Confirmation ",
    Icon: CreditCardIcon,
  },
  [OrderStatus.IN_PROCESS]: {
    className: "badge badge-secondary",
    label: "In Process",
    Icon: Cog6ToothIcon,
  },
  [OrderStatus.DELIVERED]: {
    className: "badge badge-success",
    label: "Delivered",
    Icon: TruckIcon,
  },
  [OrderStatus.ORDER_CONFIRMATION]: {
    className: "badge badge-accent",
    label: "Done",
    Icon: CheckBadgeIcon,
  },
  [OrderStatus.CANCELLED]: {
    className: "badge badge-error",
    label: "Cancelled",
    Icon: XCircleIcon,
  },
};
