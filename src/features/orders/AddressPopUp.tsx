"use client";
import { IAddress } from "@/features/user/address/types";

interface AddressPopupProps {
  addresses: IAddress[];
  currentAddress: IAddress | null;
  onSelect: (addr: IAddress) => void;
  onClose: () => void;
}

export default function AddressPopup({
  addresses,
  currentAddress,
  onSelect,
  onClose,
}: AddressPopupProps) {
  return (
    <div className="absolute top-0 left-0 w-full h-full bg-black/30 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-lg max-h-80 overflow-y-auto w-80">
        <h3 className="font-semibold mb-2">Select Address</h3>
        {addresses.map((addr) => {
          const isSelected = currentAddress?.id === addr.id;
          return (
            <div
              key={addr.id}
              className={`flex items-center gap-3 border p-2 mb-2 rounded cursor-pointer hover:bg-gray-100 ${
                isSelected ? "bg-lime-50 border-lime-400" : "border-gray-200"
              }`}
              onClick={() => onSelect(addr)}
            >
              <div
                className={`w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center ${
                  isSelected
                    ? "border-lime-400 bg-lime-400"
                    : "border-gray-400 bg-white"
                }`}
              />
              <span className="text-sm">
                {`${addr.address}, ${addr.district.name}, ${addr.city.name}, ${addr.province.name}`}
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
