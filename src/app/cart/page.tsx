"use client";
import { useCallback, useEffect, useState } from "react";
import CartItems from "@/features/cart/components/CartItems";
import useAuthStore from "@/store/useAuthStore";
import useCartStore from "@/store/useCartStore";
import { formatPrice } from "@/utils/formatPrice";
import {
  deleteCartItem,
  getCartItems,
  updateCartItemQty,
} from "@/services/cart";
import { FaArrowLeft, FaShoppingCart } from "react-icons/fa";
import { useRouter } from "next/navigation";
import LoadingThreeDotsPulse from "@/components/ui/loading";
import AuthGuard from "@/hoc/AuthGuard";
import toast from "react-hot-toast";
import { BsCartX } from "react-icons/bs";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/components/error/types";

function Cart() {
  const { token } = useAuthStore();
  const router = useRouter();
  const { cartItems, setCartItems } = useCartStore();
  const [loadingIds, setLoadingIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const onChangeItemQty = useCallback(
    async (id: string, action: "increment" | "decrement") => {
      const oldItems = [...cartItems];

      setCartItems(
        cartItems.map((item) =>
          item.id === id
            ? {
                ...item,
                quantity:
                  action === "increment"
                    ? item.quantity + 1
                    : item.quantity - 1,
                subTotal:
                  (action === "increment"
                    ? item.quantity + 1
                    : item.quantity - 1) * item.price,
                product: item.product,
              }
            : item
        )
      );

      setLoadingIds((prev) => [...prev, id]);

      try {
        const updatedItem = await updateCartItemQty(id, action, token);

        if (updatedItem.message === "Item removed from cart") {
          setCartItems(cartItems.filter((item) => item.id !== id));
          toast.success("Item removed from cart", {
            position: "top-right",
          });
        } else {
          setCartItems(
            cartItems.map((item) =>
              item.id === id
                ? {
                    ...item,
                    ...updatedItem,
                    product: item.product,
                  }
                : item
            )
          );
        }
      } catch (err) {
        console.error(err);
        setCartItems(oldItems);
      } finally {
        setLoadingIds((prev) => prev.filter((lid) => lid !== id));
      }
    },
    [cartItems, setCartItems, token]
  );

  const onRemoveItem = useCallback(
    async (id: string) => {
      const oldItems = [...cartItems];
      setCartItems(cartItems.filter((item) => item.id !== id));
      try {
        await deleteCartItem(id, token);
        toast.success("Item removed from cart");
      } catch (err) {
        console.error(err);
        setCartItems(oldItems);
      }
    },
    [setCartItems, token]
  );

  const onGetCartItems = async ({ token }: { token: string }) => {
    try {
      setLoading(true);
      const items = await getCartItems(token);
      setCartItems(items);
    } catch (error: unknown) {
      const err = error as AxiosError<ErrorResponse>;
      if (err.response) toast.error(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    onGetCartItems({ token });
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingThreeDotsPulse />
      </div>
    );
  }

  const total = cartItems.reduce((acc, item) => acc + Number(item.subTotal), 0);

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const goToShopping = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6">Cart</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            {cartItems.length > 0 ? (
              <>
                {cartItems.map((item) => (
                  <CartItems
                    key={item.id}
                    item={item}
                    loading={loadingIds.includes(item.id)}
                    onChangeQuantity={onChangeItemQty}
                    onRemove={onRemoveItem}
                  />
                ))}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-[60vh] gap-5">
                <BsCartX size={180} className="text-6xl text-gray-400 mb-4" />
                <h2 className="font-bold ">Your Cart is empty</h2>
                <p>Find your favorite products and add to your cart</p>
                <button
                  onClick={goToShopping}
                  className="flex btn bg-emerald-700 text-white py-2 rounded-lg font-semibold"
                >
                  <FaArrowLeft />
                  Go to Shopping
                </button>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow h-fit">
            <h2 className="text-lg font-semibold mb-4">Cart Summary</h2>
            <div className="flex flex-col  mb-4">
              <span>Total Items ({totalItems})</span>
              <div className="flex justify-between mb-4">
                <span>Total</span>
                <span className="font-bold">{formatPrice(total)}</span>
              </div>
            </div>
            <button
              onClick={() => router.push("/orders")}
              disabled={cartItems.length === 0}
              className={`w-full text-white py-2 rounded-lg font-semibold transition 
        ${
          cartItems.length === 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-amber-400 hover:bg-emerald-700"
        }`}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthGuard(Cart, ["CUSTOMER"]);
