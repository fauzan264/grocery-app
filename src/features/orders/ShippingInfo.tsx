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
            <div className="flex justify-between items-center gap-2 mt-1 w-full">
                <div className="flex items-center border border-gray-300 text-sm text-gray-500 rounded p-3 gap-3 flex-1">
                    <FaMapMarkerAlt size={20} />
                    {currentAddress
                        ? `${currentAddress.address}, ${currentAddress.district.name}, ${currentAddress.city.name}, ${currentAddress.province.name}`
                        : "No address found"}
                </div>
                <button
                    onClick={onChangeAddress}
                    className="border text-xs px-3 py-1 rounded hover:bg-gray-100"
                >
                    Change
                </button>
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
            <div className="flex justify-between items-center gap-2 mt-1 w-full">
                <div className="flex items-center border text-sm text-gray-500 rounded p-3 gap-3 flex-1">
                    <MdLocalShipping size={20} />
                    {currentShipping
                        ? `${currentShipping.name}, ${currentShipping.description}, Estimated: ${currentShipping.etd}, Price: ${currentShipping.cost}`
                        : "No shipping found"}
                </div>
                <button
                    onClick={onChangeShipping}
                    className="border text-xs px-3 py-1 rounded hover:bg-gray-100"
                >
                    Change
                </button>
            </div>
        </div>
    );
}
