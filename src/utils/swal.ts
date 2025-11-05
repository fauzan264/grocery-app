import Swal from "sweetalert2";


export const confirmCancelOrder = async () => {
  const result = await Swal.fire({
    title: "Cancel this order?",
    text: "Are you sure you want to cancel this order? This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, cancel it",
    cancelButtonText: "No, keep it",
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#6b7280",
  });

  if (result.isConfirmed) {
    await Swal.fire({
      title: "Order cancelled",
      text: "Your order has been successfully canceled.",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });
    return true;
  }

  return false;
};

export const confirmReceiveOrder = async () => {
  const result = await Swal.fire({
    title: "Confirm order received?",
    text: "Are you sure you have received your order in good condition?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes, confirm it",
    cancelButtonText: "Not yet",
    confirmButtonColor: "#16a34a",
    cancelButtonColor: "#6b7280",
  });

  if (result.isConfirmed) {
    await Swal.fire({
      title: "Order confirmed",
      text: "Thank you! Your order has been marked as received.",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });
    return true;
  }

  return false;
};

