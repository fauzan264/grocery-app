"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoChevronBack } from "react-icons/io5";
import useAuthStore from "@/store/useAuthStore";
import useCartStore from "@/store/useCartStore";
import { PaymentMethod } from "./type";
import { getUserProfileWithAddress, IUserProfile } from "@/services/profile";
import { createOrders } from "@/services/order";
import { createGatewayPayment } from "@/services/payment";
import { useOrderStore } from "@/store/userOrderStore";
import { IAddress } from "../user/address/types";
import { RajaOngkirDataResponse } from "../shipping/types";
import { getShippingCost } from "@/services/shipping";
import AddressPopup from "./AddressPopUp";
import ShippingPopup from "./ShippingPopUp";
import { ShippingSection } from "./ShippingInfo";
import { PaymentSelector } from "./PaymentMethod";

import useLocationStore from "@/store/useLocationStore";
import LoadingThreeDotsPulse from "@/components/ui/loading";
import toast from "react-hot-toast";

export default function OrderCard() {
    const router = useRouter();
    const { token } = useAuthStore();
    const { cartItems } = useCartStore();
    const { selectedStore } = useLocationStore();
    const setCurrentOrder = useOrderStore((state) => state.setCurrentOrder);
    const currentShipping = useOrderStore((state) => state.currentShipping);
    const setCurrentShipping = useOrderStore(
        (state) => state.setCurrentShipping
    );
    const currentAddress = useOrderStore((state) => state.currentAddress);
    const setCurrentAddress = useOrderStore((state) => state.setCurrentAddress);

    const [selected, setSelected] = useState<PaymentMethod>(
        PaymentMethod.BANK_TRANSFER
    );
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState<IUserProfile | null>(null);
    const [showAddressPopup, setShowAddressPopup] = useState(false);
    const [showShippingPopup, setShowShippingPopup] = useState(false);
    const [courier, setCourier] = useState("jne");
    const [shipping, setShipping] = useState<RajaOngkirDataResponse[] | null>(
        null
    );

    const onGetShipping = async ({
        origin,
        destination,
        weight,
        courier,
    }: {
        origin: string;
        destination: string;
        weight: string;
        courier: string;
    }) => {
        const response = await getShippingCost({
            origin,
            destination,
            weight,
            courier,
        });

        if (shipping) {
            setShipping(null);
            setShipping(response.data.data);
        } else {
            setShipping(response.data.data);
        }
    };

    const methods = [
        {
            id: PaymentMethod.BANK_TRANSFER,
            label: "Transfer Manual",
            icon: "/bank-transfer-logo.png",
        },
        { id: PaymentMethod.SNAP, label: "GoPay", icon: "/GoPay-Logo.png" },
    ];

    useEffect(() => {
        if (!token && !cartItems) return;
        (async () => {
            try {
                setLoading(true);
                const data = await getUserProfileWithAddress(token);
                setProfile(data);
                if (data.UserAddress && data.UserAddress[0]) {
                    setCurrentAddress(data.UserAddress[0]);
                }
            } catch (err) {
                console.error("Failed to fetch user", err);
            } finally {
                setLoading(false);
            }
        })();
    }, [token, cartItems]);

    const totalWeight_g = cartItems.reduce((acc, item) => {
        return acc + item.quantity * item.product.weight_g;
    }, 0);

    const handleAddressSelect = (addr: IAddress) => {
        if (!selectedStore) return;
        setCurrentAddress(addr);
        onGetShipping({
            origin: String(selectedStore.district?.id),
            destination: addr.district.id,
            weight: totalWeight_g.toString(),
            courier,
        });

        setCurrentShipping(null);
        setShowAddressPopup(false);
    };

    const handleShippingSelect = (shipping: RajaOngkirDataResponse) => {
        setCurrentShipping(shipping);
        setShowShippingPopup(false);
    };

    const handleCreateOrder = async () => {
        if (!token) return toast.error("User not authenticated", {position : "top-right"});
        if (!currentAddress)
            return toast.error("Please select a shipping address", {position : "top-right"});
        if (!currentShipping)
            return toast.error("Please select a shipping method", {position : "top-right"});

        console.log("🔍 Current Address:", currentAddress);
        console.log("🔍 Current Shipping:", currentShipping);
        console.log("🔍 Selected Store:", selectedStore);

        try {
            setLoading(true);

            if (!selectedStore?.id) return;

            const shippingDays = currentShipping.etd
                ? currentShipping.etd.split("-")[0]
                : "0";

            const payload = {
                storeId: selectedStore.id,
                couponCodes: [],
                paymentMethod: selected,
                shipment: {
                    courier: currentShipping.name,
                    service: currentShipping.service,
                    shipping_cost: currentShipping.cost,
                    shipping_days: shippingDays,
                    address: currentAddress.address ?? "",
                    province_name: currentAddress.province.name ?? "",
                    city_name: currentAddress.city.name ?? "",
                    district_name: currentAddress.district.name ?? "",
                },
            };

            console.log("Order Payload:", payload);

            // 1. Create order
            const order = await createOrders(payload, token);
            console.log("Order Payload:", payload);
            setCurrentOrder(order);
            toast.success("Order created successfully!", {
                className: "toast-order-success",
            });

            if (selected === PaymentMethod.SNAP) {
                const { redirect_url } = await createGatewayPayment(
                    order.id,
                    token
                );
                window.location.href = redirect_url;
            } else {
                router.push(`/orders/${order.id}`);
            }
        } catch (err) {
            console.error(err);
            alert("Failed to create order");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentAddress && courier && selectedStore) {
            onGetShipping({
                origin: String(selectedStore.district?.id),
                destination: currentAddress.district.id,
                weight: totalWeight_g.toString(),
                courier,
            });
        }
    }, [currentAddress, courier, selectedStore]);

    return (
        <div className="bg-white p-4 rounded-lg shadow relative">
            <div className="flex flex-col items-start gap-4">
                <button
                    onClick={() => router.push("/cart")}
                    className="flex items-center gap-3"
                >
                    <IoChevronBack /> Back
                </button>

                {/* Shipping info */}
                {profile && (
                    <ShippingSection
                        profile={profile}
                        currentAddress={currentAddress}
                        courier={courier}
                        setCourier={setCourier}
                        currentShipping={currentShipping}
                        onChangeAddress={() => setShowAddressPopup(true)}
                        onChangeShipping={() =>
                            courier
                                ? setShowShippingPopup(true)
                                : alert("Select courier first")
                        }
                    />
                )}

                {/* Payment Method selector */}
                <div className="flex flex-col items-start gap-2">
                    <PaymentSelector
                        selected={selected}
                        onSelect={setSelected}
                        methods={methods}
                    />
                </div>

                {/* Create Order button */}
                <button
                    onClick={handleCreateOrder}
                    disabled={loading || !cartItems.length}
                    className="w-full bg-amber-400 text-white text-sm py-2 rounded-lg font-semibold hover:bg-green-600 disabled:opacity-50"
                >
                    {loading ? "Creating..." : "Create Order"}
                </button>
            </div>

            {/* Address Popup */}
            {showAddressPopup &&
                (profile?.UserAddress && profile.UserAddress.length > 0 ? (
                    <AddressPopup
                        addresses={profile.UserAddress}
                        currentAddress={currentAddress}
                        onSelect={handleAddressSelect}
                        onClose={() => setShowAddressPopup(false)}
                    />
                ) : (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
                            <p className="text-gray-700 mb-4">
                                No address found. Please add an address in your
                                profile first.
                            </p>
                            <button
                                onClick={() => setShowAddressPopup(false)}
                                className="w-full bg-amber-400 text-white py-2 rounded-lg font-semibold hover:bg-amber-500"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                ))}

            {/* Shipping Popup */}
            {showShippingPopup && shipping && (
                <ShippingPopup
                    shippings={shipping}
                    currentShipping={currentShipping}
                    onSelect={handleShippingSelect}
                    onClose={() => setShowShippingPopup(false)}
                />
            )}
        </div>
    );
}
