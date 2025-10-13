"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoChevronBack } from "react-icons/io5";
import Image from "next/image";
import { FaMapMarkerAlt } from "react-icons/fa";
import useAuthStore from "@/store/useAuthStore";
import useCartStore from "@/store/useCartStore";
import { PaymentMethod } from "./type";
import { getUserProfileWithAddress, IUserProfile } from "@/services/profile";
import { createOrders } from "@/services/order";
import { createGatewayPayment } from "@/services/payment";
import { useOrderStore } from "@/store/userOrderStore";
import { IAddress } from "../user/address/types";
import { MdLocalShipping } from "react-icons/md";
import { RajaOngkirDataResponse } from "../shipping/types";
import { getShippingCost } from "@/services/shipping";
import AddressPopup from "./AddressPopUp";
import ShippingPopup from "./ShippingPopUp";
import { ShippingSection } from "./ShippingInfo";
import { PaymentSelector } from "./PaymentMethod";
import { toast } from "react-toastify";
import useLocationStore from "@/store/useLocationStore";

export default function OrderCard() {
    const router = useRouter();
    const { token } = useAuthStore();
    const { cartItems } = useCartStore();
    const {selectedStore} = useLocationStore()
    const {currentOrder} = useOrderStore()
    
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
        if (!token) return;

        (async () => {
            try {
                setLoading(true);
                const data = await getUserProfileWithAddress(token);
                setProfile(data);
                if (data.UserAddress[0]) setCurrentAddress(data.UserAddress[0]);
            } catch (err) {
                console.error("Failed to fetch user", err);
            } finally {
                setLoading(false);
            }
        })();
    }, [token]);

    const totalWeight_g = cartItems.reduce((acc, item) => {
        return acc + item.quantity * item.product.weight_g;
    }, 0);

    const handleAddressSelect = (addr: IAddress) => {
        setCurrentAddress(addr);
        onGetShipping({
            origin: String(selectedStore?.districtId), // location store nya belom di set dari order
            destination: addr.district.id, //location user
            weight: totalWeight_g.toString(), // weight nya belom di set dari order
            courier,
        });

        setCurrentShipping(null);
        setShowAddressPopup(false);
    };

    const handleShippingSelect = (shipping: RajaOngkirDataResponse) => {
        console.log("Selected shipping:", shipping);
        
        setCurrentShipping(shipping);
        setShowShippingPopup(false);
    };

    const handleCreateOrder = async () => {
        console.log("🚀 handleCreateOrder triggered");
        console.log(selectedStore)
        console.log(currentOrder)
        console.log(currentShipping)
        console.log(currentAddress)
        if (!token)
            return toast.error("User not authenticated", {
                className: "toast-order-error",
            });
        if (!currentAddress)
            return toast.error("Please select a shipping address", {
                className: "toast-order-error",
            });
        if (!currentShipping)
            return toast.error("Please select a shipping method", {
                className: "toast-order-error",
            });

        try {
            setLoading(true);

            if (!selectedStore?.id) return

            const payload = {
                storeId: selectedStore.id,
                couponCodes: [],
                paymentMethod: selected,
            };

            // 1. Create order
            const order = await createOrders(payload, token);
            setCurrentOrder(order);
            toast.success("Order created successfully!", {
                className: "toast-order-success",
            });

            if (selected === PaymentMethod.SNAP) {
                // 2. Generate Snap transaction
                const { redirect_url } = await createGatewayPayment(
                    order.id,
                    token
                );

                // 3. Redirect user langsung ke Snap GoPay page
                window.location.href = redirect_url;
            } else {
                // BANK_TRANSFER → ke order detail
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
        console.log("Trigger onGetShipping for", currentAddress, courier);
        if (currentAddress && courier) {
            onGetShipping({
                origin: String(selectedStore?.districtId),
                destination: currentAddress.district.id, 
                weight: totalWeight_g.toString(), 
                courier,
            });
        }
    }, [currentAddress, courier]);

    if (loading && !profile)
        return <div className="p-4 text-center">Loading profile...</div>;

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
            {showAddressPopup && profile?.UserAddress.length ? (
                <AddressPopup
                    addresses={profile.UserAddress}
                    currentAddress={currentAddress}
                    onSelect={handleAddressSelect}
                    onClose={() => setShowAddressPopup(false)}
                />
            ) : null}

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
