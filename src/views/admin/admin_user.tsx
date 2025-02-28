import { useState, useEffect } from "react";
import { Delete, Editor, Left, Right } from "@icon-park/react";
import { AdminAddUserDialog } from "../../components/admin/admin_user_add_dialog.tsx";
import { AdminEditUserDialog } from "../../components/admin/admin_user_edit_dialog.tsx";
import { AdminDeleteUserDialog } from "../../components/admin/admin_user_delete_dialog.tsx";
import { GetUserListAPI } from "../../apis/user_api.ts";
import {AdminRightCardComponent} from "../../components/admin/admin_reveal_component.tsx";

export function AdminUser({ site }: Readonly<{ site: SiteInfoEntity }>) {
    const [userList, setUserList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = `用户管理 | ${site.name ?? "Frontleaves Technology"}`;

        const fetchUsers = async () => {
            try {
                const response = await GetUserListAPI({ page: 1, size: 20, keyword: "", is_desc: true });
                if (response && response.data && response.data.records) {
                    setUserList(response.data.records);
                }
            } catch (error) {
                console.error("获取用户列表失败: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [site.name]);

    return (
        <>
            <div className="grid grid-cols-10 gap-6">
                <div className="col-span-7 space-y-6">
                    <div className="overflow-x-auto border border-gray-100 rounded-lg shadow-lg">
                        <table className="table table-zebra">
                            {/* 表头 */}
                            <thead>
                            <tr>
                                <th>序号</th>
                                <th>用户名</th>
                                <th>角色</th>
                                <th>邮箱</th>
                                <th className="text-end">操作</th>
                            </tr>
                            </thead>
                            <tbody>
                            {loading ? (
                                <tr><td colSpan={5} className="text-center">加载中...</td></tr>
                            ) : (
                                userList.map((record, index) => (
                                    <tr key={record.user.user_uuid}>
                                        <th>{index + 1}</th>
                                        <td>{record.user.name}</td>
                                        <td>{record.user.role.role_name}</td>
                                        <td>{record.user.email}</td>
                                        <td>
                                            <div className="flex gap-2 justify-end">
                                                <button
                                                    onClick={() => document.getElementById('my_modal_2').showModal()}
                                                    className="text-xs flex items-center font-medium text-info hover:text-secondary space-x-0.5 cursor-pointer"
                                                >
                                                    <Editor theme="outline" size="14" />
                                                    <span>编辑</span>
                                                </button>
                                                <button
                                                    onClick={() => document.getElementById('my_modal_3').showModal()}
                                                    className="text-xs font-medium text-accent hover:text-error flex items-center space-x-0.5 cursor-pointer"
                                                >
                                                    <Delete theme="outline" size="14" />
                                                    <span>删除</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                    <nav aria-label="Page navigation example" className="w-full flex justify-center">
                        <ul className="flex items-center -space-x-px h-8 text-sm">
                            <li>
                                <a href="#" className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700">
                                    <span className="sr-only">Previous</span>
                                    <Left theme="outline" size="16" fill="#333" />
                                </a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">1</a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">2</a>
                            </li>
                            <li>
                                <a href="#" aria-current="page" className="z-10 flex items-center justify-center px-3 h-8 leading-tight text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700">3</a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">4</a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">5</a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700">
                                    <span className="sr-only">Next</span>
                                    <Right theme="outline" size="16" fill="#333" />
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
                <AdminRightCardComponent/>
            </div>
            <AdminEditUserDialog />
            <AdminAddUserDialog />
            <AdminDeleteUserDialog />
        </>
    );
}
