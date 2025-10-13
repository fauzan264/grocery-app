import { getAddresses } from "@/services/user";
import camelcaseKeys from "camelcase-keys";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { IAddress } from "../types";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/components/error/types";
import { toast } from "react-toastify";

export default function AddressTable({
  token,
  userId,
  role,
}: {
  token: string;
  userId: string;
  role: string;
}) {
  const [addresses, setAddresses] = useState<IAddress[] | null>(null);

  const onGetAddresses = async ({
    token,
    userId,
  }: {
    token: string;
    userId: string;
  }) => {
    try {
      const response = await getAddresses({ token, userId });
      setAddresses(camelcaseKeys(response.data.data));
    } catch (error: unknown) {
      const err = error as AxiosError<ErrorResponse>;
      if (err.response) {
        toast.error(err.response.data.message);
      }
    }
  };

  useEffect(() => {
    if (token && userId) {
      onGetAddresses({ token, userId });
    }
  }, [token, userId]);

  return (
    <div className="overflow-x-auto ">
      <table className="table border-border-slate-100">
        <thead>
          <tr>
            <th className="text-slate-900">Address</th>
            <th className="text-slate-900">Default</th>
            <th className="text-slate-900">#</th>
          </tr>
        </thead>
        <tbody>
          {addresses &&
            addresses.map((address) => (
              <tr key={address.id}>
                <td>{address.address}</td>
                <td>{address.isDefault && <FaCheck />}</td>
                <td>
                  <Link
                    href={
                      role == "CUSTOMER"
                        ? `/profile/address/edit/${address.id}`
                        : `/admin/profile/address/edit/${address.id}`
                    }
                    className="btn btn-sm bg-amber-400 text-white hover:shadow-md m-1 px-3 py-1 text-sm rounded-md"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
