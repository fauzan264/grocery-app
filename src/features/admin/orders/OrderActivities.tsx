import React from "react";
import { IStatusLogs } from "./type";
import { IOrderAdminResponse } from "@/features/admin/orders/type";
import { formatDateWithTime } from "@/utils/formatDate";

interface OrderActivitySidebarProps {
    order: IOrderAdminResponse;
    logs: IStatusLogs[];
}

export default function OrderActivitySidebar({
    order,
    logs,
}: OrderActivitySidebarProps) {
    return (
        <div className="flex flex-col h-full space-y-4">
            {/* Notes Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="font-semibold text-lg text-gray-800 mb-3">
                    Notes
                </h3>
                {logs.some((log) => log.note) ? (
                    (() => {
                        const lastLog = [...logs]
                            .sort(
                                (a, b) =>
                                    new Date(a.createdAt).getTime() -
                                    new Date(b.createdAt).getTime()
                            )
                            .slice(-1)[0];

                        return (
                            <p className="text-sm text-gray-600 break-words">
                                {lastLog.note}
                            </p>
                        );
                    })()
                ) : (
                    <p className="text-sm text-gray-500">No notes available</p>
                )}
            </div>

            {/* Activity Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="font-semibold text-lg text-gray-800 mb-4">
                    Activity
                </h3>

                {logs.length === 0 ? (
                    <p className="text-sm text-gray-500">No activity yet</p>
                ) : (
                    [...logs]
                        .sort(
                            (a, b) =>
                                new Date(a.createdAt).getTime() -
                                new Date(b.createdAt).getTime()
                        )
                        .map((log) => (
                            <div key={log.id} className="flex mb-4">
                                <div className="flex-shrink-0 w-3 h-3 rounded-full bg-blue-500 mt-1 mr-3"></div>
                                <div>
                                    <p className="text-xs text-gray-700">
                                        {formatDateWithTime(log.createdAt)}
                                    </p>
                                    <p className="text-sm text-gray-800 break-words whitespace-pre-line">
                                        Status changed to: <br />
                                        {log.newStatus}
                                    </p>
                                    {log.changedBy && (
                                        <p className="text-sm text-gray-600">
                                            Changed by: {log.changedBy}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))
                )}
            </div>
        </div>
    );
}

