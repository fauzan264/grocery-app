import { deleteAddress, getAddresses } from "@/services/user";
import camelcaseKeys from "camelcase-keys";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { IAddress } from "../types";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/components/error/types";
import { toast } from "react-toastify";
import DeleteModal from "@/components/modals/DeleteModal";
import Pagination from "@/components/ui/Pagination";
import { IPagination } from "@/app/types/pagination";
import { useRouter, useSearchParams } from "next/navigation";
import _ from "lodash";
import { IStoreProvince } from "@/features/admin/store/types";
import { getProvinces } from "@/services/shipping";

export default function AddressTable({
  token,
  userId,
  role,
}: {
  token: string;
  userId: string;
  role: string;
}) {
  const router = useRouter();
  const [addresses, setAddresses] = useState<IAddress[] | null>(null);
  const [pagination, setPagination] = useState<IPagination | null>();
  const [provinces, setProvinces] = useState<IStoreProvince[]>([]);
  const [page, setPage] = useState(1);
  const searchParams = useSearchParams();
  const [selectedProvince, setSelectedProvince] = useState("");
  const provinceId = searchParams.get("province_id");
  const search = searchParams.get("search");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IAddress | null>(null);

  const onGetProvince = async () => {
    const response = await getProvinces();
    setProvinces(response.data.data);
  };

  const handleDeleteClick = (address: IAddress) => {
    setSelectedItem(address);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (!selectedItem?.id) return false;
      setIsLoading(true);
      const response = await deleteAddress({
        token,
        userId,
        addressId: selectedItem.id,
      });

      toast.success(response.data.message);
      await debounceFetch(search, provinceId, page, token);

      setIsLoading(false);
      setIsModalOpen(false);
      setSelectedItem(null);
    } catch (error: unknown) {
      const err = error as AxiosError<ErrorResponse>;
      if (err.response) {
        toast.error(err.response.data.message);
      }
    }
  };

  const handleCloseModal = () => {
    if (!isLoading) {
      setIsModalOpen(false);
      setSelectedItem(null);
    }
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedProvince(value);

    const params = new URLSearchParams(searchParams.toString() ?? "");
    if (value) {
      params.set("province_id", value);
    } else {
      params.delete("province_id");
    }
    router.push(`?${params.toString()}`);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString() ?? "");
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    router.push(`?${params.toString()}`);
  };

  const debounceFetch = useMemo(
    () =>
      _.debounce(
        async (
          searchValue: string | null,
          provinceId: string | null,
          pageValue: number,
          token: string
        ) => {
          try {
            const response = await getAddresses({
              search: searchValue || "",
              provinceId: Number(provinceId),
              page: pageValue,
              limit: 10,
              token,
              userId,
            });

            if (response.data.success) {
              setAddresses(camelcaseKeys(response.data.data.addresses));
              setPagination(camelcaseKeys(response.data.data.pagination));
            }
          } catch (error: unknown) {
            toast.error(String(error));
          }
        },
        100
      ),
    [getAddresses, setAddresses, userId, setPagination, toast, camelcaseKeys]
  );

  useEffect(() => {
    const pageFromUrl = parseInt(searchParams.get("page") || "1", 10);
    setPage(pageFromUrl);
  }, [searchParams]);

  useEffect(() => {
    if (userId && token) {
      debounceFetch(search, provinceId, page, token);

      return () => debounceFetch.cancel();
    }
  }, [search, provinceId, page, debounceFetch, userId, token]);

  useEffect(() => {
    onGetProvince();
  }, []);

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 py-2 justify-between items-start md:items-center">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <input
            type="search"
            name="search"
            id="search"
            placeholder="Search address..."
            onChange={handleSearch}
            className="w-full sm:w-64 border border-gray-300 rounded-lg text-sm px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          />
          <select
            id="storeFilter"
            value={selectedProvince}
            onChange={handleProvinceChange}
            className="w-full sm:w-48 border border-gray-300 rounded-lg text-sm px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          >
            <option value="">Select Province</option>
            {provinces.map((province) => (
              <option key={province.id} value={province.id}>
                {province.name}
              </option>
            ))}
          </select>
        </div>
        <Link
          href={"/profile/address/create"}
          className="btn btn-sm bg-emerald-500 hover:bg-emerald-600 text-white rounded-md border-0 transition duration-300"
        >
          Create Address
        </Link>
      </div>
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
                    <button
                      className="btn btn-sm bg-red-500 text-white hover:shadow-md m-1 px-3 py-1 text-sm rounded-md"
                      onClick={() => {
                        handleDeleteClick(address);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <Pagination
          currentPage={
            pagination?.currentPage ? Number(pagination?.currentPage) : 1
          }
          totalPages={pagination?.totalPage ? Number(pagination?.totalPage) : 1}
          onPageChange={(page) => {
            setPage(page);
            const params = new URLSearchParams(searchParams);
            params.set("page", String(page));
            router.push(`?${params.toString()}`);
          }}
        />
        <DeleteModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirmDelete}
          itemName={selectedItem?.district.name || selectedItem?.address}
          isLoading={isLoading}
        />
      </div>
    </>
  );
}
