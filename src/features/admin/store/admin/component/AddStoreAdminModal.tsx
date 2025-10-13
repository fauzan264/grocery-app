import { IUser } from "@/app/types/user";
import { ErrorResponse } from "@/components/error/types";
import { getUsers } from "@/services/user";
import { AxiosError } from "axios";
import { useFormik } from "formik";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { addAdminStoreSchema } from "../schemas/addAdminStoreSchema";
import { assignStoreAdmin } from "@/services/store";

export default function AddStoreAdminModal({
  id,
  token,
  onSuccess,
}: {
  id: string;
  token: string;
  onSuccess?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [adminOptions, setAdminOptions] = useState<
    Pick<IUser, "id" | "full_name">[]
  >([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchAdmins = async () => {
        try {
          setLoading(true);
          const res = await getUsers({ q: "", role: "ADMIN_STORE", token });
          setAdminOptions(res.data.data.data);
        } catch (error) {
          const err = error as AxiosError<ErrorResponse>;
          toast.error(err.response?.data.message || "Error fetching admins");
        } finally {
          setLoading(false);
        }
      };
      fetchAdmins();
    }
  }, [isOpen, token]);

  const formik = useFormik({
    initialValues: { userId: "" },
    validationSchema: addAdminStoreSchema,
    onSubmit: async ({ userId }) => {
      try {
        const res = await assignStoreAdmin({ id, userId, token });
        toast.success(res.data.message);
        onSuccess?.();
        handleClose();
      } catch (error) {
        const err = error as AxiosError<ErrorResponse>;
        toast.error(err.response?.data.message || "Error adding admin");
      }
    },
  });

  const handleClose = () => {
    setIsOpen(false);
    formik.resetForm();
  };

  const selectedAdmin = adminOptions.find((a) => a.id === formik.values.userId);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="btn btn-sm bg-emerald-500 hover:bg-emerald-600 text-white rounded-md border-0"
      >
        Add Store Admin
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900">
                Add Store Admin
              </h2>
              <button
                onClick={handleClose}
                className="text-slate-500 hover:text-slate-700"
              >
                <X size={24} />
              </button>
            </div>

            {!loading && (
              <form onSubmit={formik.handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Select Store Admin *
                  </label>
                  <select
                    value={formik.values.userId}
                    onChange={(e) =>
                      formik.setFieldValue("userId", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Choose Admin --</option>
                    {adminOptions.map((admin) => (
                      <option key={admin.id} value={admin.id}>
                        {admin.full_name}
                      </option>
                    ))}
                  </select>
                  {formik.touched.userId && formik.errors.userId && (
                    <p className="text-red-600 text-sm mt-1">
                      {formik.errors.userId}
                    </p>
                  )}
                </div>

                {selectedAdmin && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-slate-600">Admin Selected:</p>
                    <p className="text-lg font-semibold text-slate-900">
                      {selectedAdmin.full_name}
                    </p>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!selectedAdmin}
                    className={`flex-1 px-4 py-2 font-medium rounded-lg transition ${
                      selectedAdmin
                        ? "bg-slate-600 hover:bg-slate-700 text-white"
                        : "bg-slate-300 text-slate-500 cursor-not-allowed"
                    }`}
                  >
                    Add
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
