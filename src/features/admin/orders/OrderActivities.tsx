import React from "react";

export default function OrderActivitySidebar() {
    return (
        <>
            {/* Notes Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="font-semibold text-lg text-gray-800 mb-3">
                    Notes
                </h3>
                <p className="text-sm text-gray-600">
                    Order Canceled Due to Unpaid Order within 1 Hour
                </p>
            </div>

            {/* Activity Section (Timeline) */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="font-semibold text-lg text-gray-800 mb-4">
                    Activity
                </h3>

                {/* Activity Item 1 */}
                <div className="flex mb-4">
                    {/* Indikator Timeline */}
                    <div className="flex-shrink-0 w-3 h-3 rounded-full bg-blue-500 mt-1 mr-3"></div>
                    <div>
                        <p className="text-xs text-gray-700">
                            17 Aug 2023, 11:25 PM
                        </p>
                        <p className="font-medium text-gray-800">
                            Notes Updated
                        </p>
                        <p className="text-sm text-gray-600">
                            (Product Delivered)
                        </p>
                    </div>
                </div>

                {/* Activity Item 2 */}
                <div className="flex mb-4">
                    {/* Indikator Timeline */}
                    <div className="flex-shrink-0 w-3 h-3 rounded-full bg-blue-500 mt-1 mr-3"></div>
                    <div>
                        <p className="text-xs text-gray-700">
                            17 Aug 2023, 11:51 PM
                        </p>
                        <p className="font-medium text-gray-800">
                            Order Shipped
                        </p>
                        <p className="text-sm text-blue-600 hover:underline">
                            
                        </p>
                    </div>
                </div>

                {/* Activity Item 3 */}
                <div className="flex mb-4">
                    {/* Indikator Timeline */}
                    <div className="flex-shrink-0 w-3 h-3 rounded-full bg-blue-500 mt-1 mr-3"></div>
                    <div>
                        <p className="text-xs text-gray-700">
                            17 Aug 2023, 11:53 PM
                        </p>
                        <p className="font-medium text-gray-800">
                            Order Delivered
                        </p>
                        <p className="text-sm text-blue-600 hover:underline">
                            
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
