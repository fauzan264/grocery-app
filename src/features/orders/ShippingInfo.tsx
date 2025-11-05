import { MdLocalShipping } from "react-icons/md";
import { RajaOngkirDataResponse } from "../shipping/types";
import { IAddress } from "../user/address/types";
import { IUserProfile } from "@/services/profile";
import { FaMapMarkerAlt } from "react-icons/fa";

interface ShippingSectionProps {
    profile: IUserProfile;
    currentAddress: IAddress | null;
    courier: string;
    setCourier: (c: string) => void;
    currentShipping: RajaOngkirDataResponse | null;
    onChangeAddress: () => void;
    onChangeShipping: () => void;
}

export function ShippingSection({
    profile,
    currentAddress,
    courier,
    setCourier,
    currentShipping,
    onChangeAddress,
    onChangeShipping,
}: ShippingSectionProps) {
    return (
        <div className="flex flex-col items-start gap-2">
            <h1>Shipping to</h1>
            <span className="text-sm text-gray-500">
                {profile.full_name} ({profile.phone_number})
            </span>

            {/* Address */}
            {/* Address */}
            <div className="mt-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 p-4 border border-gray-200 rounded-lg bg-gray-50 hover:border-gray-300 transition-colors">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="mt-0.5 text-gray-400">
                            <FaMapMarkerAlt size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-500 mb-1">
                                Shipping Address
                            </p>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                {currentAddress
                                    ? `${currentAddress.address}, ${currentAddress.district.name}, ${currentAddress.city.name}, ${currentAddress.province.name}`
                                    : "No address selected"}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onChangeAddress}
                        className="self-start sm:self-center px-4 py-2 text-sm font-medium text-emerald-700 border border-emerald-700 rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap"
                    >
                        {currentAddress ? "Change" : "Select"}
                    </button>
                </div>
            </div>

            {/* Courier */}
            <h1>Courier</h1>
            <select
                className="select w-full"
                value={courier}
                onChange={(e) => setCourier(e.currentTarget.value)}
            >
                <option value="" disabled>
                    Select a Courier
                </option>
                <option value="sicepat">Si Cepat</option>
                <option value="jnt">J&T Express Indonesia</option>
                <option value="ninja">Ninja Xpress</option>
                <option value="tiki">TIKI</option>
                <option value="anteraja">Anteraja</option>
                <option value="jne">JNE</option>
            </select>

            {/* Shipping Cost */}
            <div className="mt-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 p-4 border border-gray-200 rounded-lg bg-gray-50 hover:border-gray-300 transition-colors">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="mt-0.5 text-gray-400">
                            <MdLocalShipping size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-500 mb-1">
                                Shipping Method
                            </p>
                            {currentShipping ? (
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-700">
                                        {currentShipping.name}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                        {currentShipping.description}
                                    </p>
                                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 mt-1.5">
                                        <span className="flex items-center gap-1">
                                            <span className="font-medium">
                                                Estimated:
                                            </span>{" "}
                                            {currentShipping.etd}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <span className="font-medium">
                                                Price:
                                            </span>{" "}
                                            {currentShipping.cost}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-700">
                                    No shipping method selected
                                </p>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onChangeShipping}
                        className="self-start sm:self-center px-4 py-2 text-sm font-medium text-emerald-700 border border-emerald-700 rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap"
                    >
                        {currentShipping ? "Change" : "Select"}
                    </button>
                </div>
            </div>
        </div>
    );
}
