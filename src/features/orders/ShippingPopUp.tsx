"use client";
import React from "react";
import { RajaOngkirDataResponse } from "@/features/shipping/types";

interface ShippingPopupProps {
    shippings: RajaOngkirDataResponse[];
    currentShipping: RajaOngkirDataResponse | null;
    onSelect: (ship: RajaOngkirDataResponse) => void;
    onClose: () => void;
}

export default function ShippingPopup({
    shippings,
    currentShipping,
    onSelect,
    onClose,
}: ShippingPopupProps) {
    return (
        <div className="absolute top-0 left-0 w-full h-full bg-black/30 flex justify-center items-center z-50">
            <div className="bg-white p-4 rounded-lg max-h-80 overflow-y-auto w-80">
                <h3 className="font-semibold mb-2">Select Shipping</h3>
                {shippings.map((ship) => {
                    const isSelected =
                        currentShipping?.service === ship.service;
                    return (
                        <div
                            key={ship.service}
                            className={`flex items-center gap-3 border p-2 mb-2 rounded cursor-pointer hover:bg-gray-100 ${
                                isSelected
                                    ? "bg-lime-50 border-lime-400"
                                    : "border-gray-200"
                            }`}
                            onClick={() => onSelect(ship)}
                        >
                            <div
                                className={`w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center ${
                                    isSelected
                                        ? "border-lime-400 bg-lime-400"
                                        : "border-gray-400 bg-white"
                                }`}
                            />
                            <span className="text-sm">
                                {`${ship.name}, ${ship.description}, ETA: ${ship.etd}, Price: ${ship.cost}`}
                            </span>
                        </div>
                    );
                })}
                <button
                    className="mt-2 px-4 py-1 border rounded hover:bg-gray-200"
                    onClick={onClose}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}
