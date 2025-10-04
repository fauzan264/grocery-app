// components/order/PaymentSelector.tsx
import Image from "next/image";
import { PaymentMethod } from "./type";

interface PaymentPopupProps {
    methods: { id: PaymentMethod; label: string; icon: string }[];
    selected: PaymentMethod;
    onSelect: (method: PaymentMethod) => void;
}

export function PaymentSelector({ selected, onSelect }: PaymentPopupProps) {
    const methods = [
        {
            id: PaymentMethod.BANK_TRANSFER,
            label: "Transfer Manual",
            icon: "/bank-transfer-logo.png",
        },
        { id: PaymentMethod.SNAP, label: "GoPay", icon: "/GoPay-Logo.png" },
    ];

    return (
        <div className="flex flex-col items-start gap-2">
            <div>Payment Method</div>
            <div className="flex gap-3 mt-1">
                {methods.map((m) => (
                    <button
                        key={m.id}
                        onClick={() => onSelect(m.id)}
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
            {selected === PaymentMethod.BANK_TRANSFER && (
                <div className="text-sm text-gray-600 mt-2 bg-gray-50 border border-gray-200 rounded p-3">
                    <p className="font-semibold">Payment Instructions:</p>
                    <p>
                        Please transfer the total amount to the following bank
                        account:
                    </p>
                    <ul className="mt-1">
                        <li>
                            Bank: <strong>BCA</strong>
                        </li>
                        <li>
                            Account Number: <strong>1234567890</strong>
                        </li>
                        <li>
                            Account Holder: <strong>PT Sample Store</strong>
                        </li>
                    </ul>
                    <p className="mt-1">
                        After completing the transfer, please upload your
                        payment proof on the order detail page.
                    </p>
                </div>
            )}
        </div>
    );
}
