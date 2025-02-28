import { useState, useEffect } from "react";
import { Delete, DocDetail, Editor } from "@icon-park/react";
import { AdminAddUserDialog } from "../../components/admin/admin_user_add_dialog.tsx";
import { AdminEditUserDialog } from "../../components/admin/admin_user_edit_dialog.tsx";
import { AdminDeleteUserDialog } from "../../components/admin/admin_user_delete_dialog.tsx";

interface User {
    id: number;
    name: string;
    desc: string;
}

export function AdminRole({ site }: { site: { name?: string } }) {
    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<User[]>([]);

    useEffect(() => {
        document.title = `用户管理 | ${site?.name ?? "Frontleaves Technology"}`;
        setTimeout(() => {
            setData([
                { id: 1, name: "Cy Ganderton", desc: "Quality Control Specialist" },
                { id: 2, name: "Hart Hagerty", desc: "Desktop Support Technician" },
                { id: 3, name: "Brice Swyre", desc: "Tax Accountant" },
            ]);
            setLoading(false);
        }, 2000); // 模拟 2 秒的加载时间
    }, [site]);

    return (
        <>
            <div className="grid grid-cols-10 gap-6">
                <div className="col-span-10 space-y-6">
                    <div className="overflow-x-auto border border-gray-100 rounded-lg shadow-lg">
                        <table className="table table-zebra">
                            {/* 表头 */}
                            <thead>
                            <tr>
                                <th>序号</th>
                                <th>角色ID</th>
                                <th>角色名</th>
                                <th>角色描述</th>
                                <th className="text-end">操作</th>
                            </tr>
                            </thead>
                            <tbody>
                            {loading
                                ? Array.from({ length: 3 }).map((_, index) => (
                                    <tr key={index} className="animate-pulse">
                                        <th>{index + 1}</th>
                                        <td><div className="h-4 w-20 bg-gray-300 rounded"></div></td>
                                        <td><div className="h-4 w-40 bg-gray-300 rounded"></div></td>
                                        <td><div className="h-4 w-60 bg-gray-300 rounded"></div></td>
                                        <td>
                                            <div className="h-4 w-16 bg-gray-300 rounded ml-auto"></div>
                                        </td>
                                    </tr>
                                ))
                                : data.map((row, index) => (
                                    <tr key={row.id}>
                                        <th>{index + 1}</th>
                                        <td>{row.id}</td>
                                        <td>{row.name}</td>
                                        <td>{row.desc}</td>
                                        <td>
                                            <div className="flex gap-2 justify-end">
                                                <button
                                                    onClick={() => document.getElementById('my_modal_2').showModal()}
                                                    className="text-xs flex items-center font-medium text-info hover:text-secondary space-x-0.5 cursor-pointer"
                                                >
                                                    <DocDetail theme="outline" size="14" />
                                                    <span>详情</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <AdminEditUserDialog />
                    <AdminAddUserDialog />
                    <AdminDeleteUserDialog />
                </div>
            </div>
        </>
    );
}
