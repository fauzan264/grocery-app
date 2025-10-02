"use client";
import { useState, useEffect } from "react";
import useDebounce from "@/app/hooks/useDebounce";

export interface FilterValues {
    orderId?: string;
    startDate?: string;
    endDate?: string;
}

interface Props {
    onApply: (filters: FilterValues) => void;
}

export default function OrderFilterBar({ onApply }: Props) {
    const [orderId, setOrderId] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const debouncedOrderId = useDebounce(orderId, 400);

    // Tombol Apply untuk memicu filter
    const handleApply = () => {
        onApply({
            orderId: debouncedOrderId || undefined,
            startDate: startDate || undefined,
            endDate: endDate || undefined,
        });
    };

    return (
        <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="flex gap-4">
                <input
                    type="text"
                    placeholder="Filter by Order ID"
                    className="input input-bordered w-full"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                />
                <input
                    type="date"
                    className="input input-bordered"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <input
                    type="date"
                    className="input input-bordered"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
            </div>
            <button className="btn btn-primary w-32" onClick={handleApply}>
                Apply Filter
            </button>
        </div>
    );
}
