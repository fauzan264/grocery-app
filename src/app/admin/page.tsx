"use client";

import useAuthStore from "@/store/useAuthStore";

export default function AdminPage() {
  const { fullName } = useAuthStore();
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Home</h1>
          </div>
        </header>

        {/* Main Content */}
        <section>
          <h1 className="text-xl font-medium">Hello, {fullName}</h1>
        </section>
      </div>
    </div>
  );
}
