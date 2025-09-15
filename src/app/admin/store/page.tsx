import Link from "next/link";

export default function StorePage() {
  return (
    <div className="mx-auto w-11/12 my-10">
      <div className="flex">
        <h1 className="text-2xl text-gray-700">Store Management</h1>
        <Link
          href={"/admin/store/crate"}
          className="btn btn-sm ml-auto bg-amber-400 text-white text-sm rounded-md hover:bg-amber-500 active:bg-amber-500 transition ease-in-out duration-300 focus:outline-none focus:ring-0 border-0"
        >
          Create Store
        </Link>
      </div>
      <div className="card bg-slate-50 my-5 shadow-md rounded-lg">
        <div className="card-body">
          <div className="overflow-x-auto">
            <table className="table border-gray-100">
              <thead className="text-slate-900">
                <tr>
                  <th>Name</th>
                  <th>City</th>
                  <th>Province</th>
                  <th>#</th>
                </tr>
              </thead>
              <tbody className="text-slate-900">
                <tr>
                  <td>Lorem</td>
                  <td>Lorem</td>
                  <td>Lorem</td>
                  <td className="flex space-x-2">
                    <Link
                      href={"admin/store/detail"}
                      className="btn btn-sm bg-emerald-500 text-white hover:shadow-md m-1 px-3 py-1 text-sm rounded-md"
                    >
                      Detail
                    </Link>
                    <Link
                      href={"admin/store/edit"}
                      className="btn btn-sm bg-amber-400 text-white hover:shadow-md m-1 px-3 py-1 text-sm rounded-md"
                    >
                      Edit
                    </Link>
                    <Link
                      href={"admin/store/edit"}
                      className="btn btn-sm bg-red-500 text-white hover:shadow-md m-1 px-3 py-1 text-sm rounded-md"
                    >
                      Delete
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
