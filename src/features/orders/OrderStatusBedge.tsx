import { ORDER_STATUS_STYLE } from "@/constants/orderStatusStyle";
import { OrderStatus } from "@/features/orders/type";

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const style = ORDER_STATUS_STYLE[status];

  if (!style) {
    return (
      <span className="badge badge-neutral text-sm">
        Unknown
      </span>
    );
  }

  const { className, label, Icon } = style;

  return (
    <span className={`flex items-center gap-1 ${className} text-sm`}>
      <Icon className="w-4 h-4" />
      {label}
    </span>
  );
}
