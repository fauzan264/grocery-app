"use client";
import { useState } from "react";
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

    const handleApply = () => {
        onApply({
            orderId: debouncedOrderId || undefined,
            startDate: startDate || undefined,
            endDate: endDate || undefined,
        });
    };

    const handleReset = () => {
        setOrderId("");
        setStartDate("");
        setEndDate("");
        onApply({});
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

            <button
                className="bg-emerald-600 hover:bg-emerald-700 text-sm text-white py-2 rounded-lg font-semibold w-32"
                onClick={handleApply}
            >
                Apply Filter
            </button>
            <button
                className="bg-gray-200 text-sm text-gray-600 py-2 rounded-lg font-semibold w-32 
             hover:bg-gray-300 hover:text-gray-700"
                onClick={handleReset}
            >
                Reset
            </button>
        </div>
    );
}
