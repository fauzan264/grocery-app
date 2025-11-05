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

interface OrderCardProps {
    selectedPayment: PaymentMethod;
    setSelectedPayment: (method: PaymentMethod) => void;
}

export default function OrderCard({selectedPayment, setSelectedPayment }: OrderCardProps) {
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
                        selected={selectedPayment}
                        onSelect={setSelectedPayment}
                        methods={methods}
                    />
                </div>
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
