import Link from "next/link";
import { FaCheck } from "react-icons/fa6";

export default function AddressComponent() {
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
          <tr>
            <td>71447 Milan Shoal</td>
            <td>
              <FaCheck />
            </td>
            <td>
              <Link
                href={`/admin/profile/edit/address/id`}
                className="btn btn-sm bg-amber-400 text-white hover:shadow-md m-1 px-3 py-1 text-sm rounded-md"
              >
                Edit
              </Link>
            </td>
          </tr>
          <tr>
            <td>805 Stacey Road</td>
            <td></td>
            <td>
              <Link
                href={`/admin/profile/edit/address/id`}
                className="btn btn-sm bg-amber-400 text-white hover:shadow-md m-1 px-3 py-1 text-sm rounded-md"
              >
                Edit
              </Link>
            </td>
          </tr>
          <tr>
            <td>281 Auer Shore</td>
            <td></td>
            <td>
              <Link
                href={`/admin/profile/edit/address/id`}
                className="btn btn-sm bg-amber-400 text-white hover:shadow-md m-1 px-3 py-1 text-sm rounded-md"
              >
                Edit
              </Link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
