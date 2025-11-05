"use client";
import { IAddress } from "@/features/user/address/types";
import { FaMapMarkerAlt, FaTimes } from "react-icons/fa";

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
    <div 
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Select Shipping Address</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            aria-label="Close"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Address List */}
        <div className="overflow-y-auto flex-1 p-5">
          {addresses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FaMapMarkerAlt size={40} className="mx-auto mb-3 text-gray-300" />
              <p>No addresses available</p>
            </div>
          ) : (
            <div className="space-y-3">
              {addresses.map((addr) => {
                const isSelected = currentAddress?.id === addr.id;
                return (
                  <div
                    key={addr.id}
                    className={`relative flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      isSelected
                        ? "border-emerald-700 bg-green-50 shadow-sm"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                    }`}
                    onClick={() => onSelect(addr)}
                  >
                    {/* Radio Button */}
                    <div className="pt-0.5">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected
                            ? "border-emerald-700"
                            : "border-gray-300"
                        }`}
                      >
                        {isSelected && (
                          <div className="w-3 h-3 rounded-full bg-emerald-700" />
                        )}
                      </div>
                    </div>

                    {/* Address Content */}
                    <div className="flex-1 min-w-0">
                      {isSelected && (
                        <span className="inline-block text-xs font-medium text-emerald-700 bg-green-100 px-2 py-0.5 rounded mb-2">
                          Current
                        </span>
                      )}
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {addr.address}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {addr.district.name}, {addr.city.name}, {addr.province.name}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-200 flex gap-3">
          <button
            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-emerald-700 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            onClick={onClose}
            disabled={!currentAddress}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}