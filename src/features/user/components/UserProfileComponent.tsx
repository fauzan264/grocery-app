import AddressComponent from "../address/AddressComponent";

export default function UserProfileComponent() {
  return (
    <div className="tabs tabs-box bg-slate-50 my-5 shadow-md rounded-md h-10/12">
      <input
        type="radio"
        name="my_tabs_6"
        className="tab"
        aria-label="Profile"
        defaultChecked
      />
      <div className="tab-content bg-slate-100 p-6">Tab content 2</div>

      <input
        type="radio"
        name="my_tabs_6"
        className="tab"
        aria-label="Address"
      />
      <div className="tab-content bg-slate-100 p-6">
        <AddressComponent />
      </div>
    </div>
  );
}
