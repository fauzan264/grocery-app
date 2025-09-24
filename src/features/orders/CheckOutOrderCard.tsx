"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoChevronBack } from "react-icons/io5";
import Image from "next/image";
import { FaMapMarkerAlt } from "react-icons/fa";

import useAuthStore from "@/store/useAuthStore";
import useCartStore from "@/store/useCartStore";
import { PaymentMethod } from "./type";
import {
    getUserProfileWithAddress,
    IUserProfile,
    IUserAddress,
} from "@/services/profile";
import { createOrders } from "@/services/order";
import { createGatewayPayment } from "@/services/payment";

export default function OrderCard() {
    const router = useRouter();
    const { token } = useAuthStore();
    const { cartItems } = useCartStore();

    const [selected, setSelected] = useState<PaymentMethod>(
        PaymentMethod.BANK_TRANSFER
    );
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState<IUserProfile | null>(null);
    const [showAddressPopup, setShowAddressPopup] = useState(false);
    const [currentAddress, setCurrentAddress] = useState<IUserAddress | null>(
        null
    );

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

    const handleAddressSelect = (addr: IUserAddress) => {
        setCurrentAddress(addr);
        setShowAddressPopup(false);
    };

    const handleCreateOrder = async () => {
        if (!token) return alert("User not authenticated");

        try {
            setLoading(true);

            const payload = {
                storeId: "c47f42fb-4620-4eb4-bf4e-8136610eff71",
                couponCodes: [],
                paymentMethod: selected,
            };

            // 1. Create order
            const order = await createOrders(payload, token);

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
                    <div className="flex flex-col items-start gap-2">
                        <div>Shipping to</div>
                        <span className="text-sm text-gray-500">
                            {profile.full_name} ({profile.phone_number})
                        </span>
                        <div className="flex justify-between items-center gap-2 mt-1">
                            <div className="flex items-center justify-center border border-gray-300 text-sm text-gray-500 rounded p-3 gap-3">
                                <FaMapMarkerAlt size={20} />
                                {currentAddress
                                    ? `${currentAddress.address}, ${currentAddress.subdistrict}, ${currentAddress.district}, ${currentAddress.city}, ${currentAddress.province}`
                                    : "No address found"}
                            </div>
                            <button
                                onClick={() => setShowAddressPopup(true)}
                                className="border border-gray-300 text-xs px-3 py-1 rounded hover:bg-gray-100"
                            >
                                Change
                            </button>
                        </div>
                    </div>
                )}

                {/* Payment Method selector */}
                <div className="flex flex-col items-start gap-2">
                    <div>Payment Method</div>
                    <div className="flex gap-3 mt-1">
                        {methods.map((m) => (
                            <button
                                key={m.id}
                                onClick={() => setSelected(m.id)}
                                className={`flex items-center justify-center border rounded-lg w-20 h-10 transition ${
                                    selected === m.id
                                        ? "border-lime-400 bg-lime-50"
                                        : "border-gray-200 bg-white"
                                }`}
                            >
                                <Image
                                    src={m.icon}
                                    alt={m.label}
                                    width={40}
                                    height={40}
                                    className="object-contain"
                                />
                            </button>
                        ))}
                    </div>
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
                <div className="absolute top-0 left-0 w-full h-full bg-black/30 flex justify-center items-center z-50">
                    <div className="bg-white p-4 rounded-lg max-h-80 overflow-y-auto w-80">
                        <h3 className="font-semibold mb-2">Select Address</h3>
                        {profile.UserAddress.map((addr) => {
                            const isSelected = currentAddress?.id === addr.id;
                            return (
                                <div
                                    key={addr.id}
                                    className={`flex items-center gap-3 border p-2 mb-2 rounded cursor-pointer hover:bg-gray-100 ${
                                        isSelected
                                            ? "bg-lime-50 border-lime-400"
                                            : "border-gray-200"
                                    }`}
                                    onClick={() => handleAddressSelect(addr)}
                                >
                                    <div
                                        className={`w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center ${
                                            isSelected
                                                ? "border-lime-400 bg-lime-400"
                                                : "border-gray-400 bg-white"
                                        }`}
                                    />
                                    <span className="text-sm">
                                        {`${addr.address}, ${addr.subdistrict}, ${addr.district}, ${addr.city}, ${addr.province}`}
                                    </span>
                                </div>
                            );
                        })}
                        <button
                            className="mt-2 px-4 py-1 border rounded hover:bg-gray-200"
                            onClick={() => setShowAddressPopup(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
