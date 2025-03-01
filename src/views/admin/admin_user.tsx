import { useState, useEffect } from "react";
import { Delete, Editor, Left, Right } from "@icon-park/react";
import { AdminAddUserDialog } from "../../components/admin/admin_user_add_dialog.tsx";
import { AdminEditUserDialog } from "../../components/admin/admin_user_edit_dialog.tsx";
import { AdminDeleteUserDialog } from "../../components/admin/admin_user_delete_dialog.tsx";
import { GetUserListAPI, DeleteUserAPI } from "../../apis/user_api.ts";
import { AdminRightCardComponent } from "../../components/admin/admin_reveal_component.tsx";
import { animated, useTransition } from "@react-spring/web";
import {SiteInfoEntity} from "../../models/entity/site_info_entity.ts";

export function AdminUser({ site }: Readonly<{ site: SiteInfoEntity }>) {
    // 用户列表
    const [userList, setUserList] = useState([]);
    // 加载中状态
    const [loading, setLoading] = useState(true);

    // 分页相关的状态
    const [currentPage, setCurrentPage] = useState(1);  // 当前页
    const [pageSize, setPageSize] = useState(20);       // 每页数量
    const [total, setTotal] = useState(0);              // 总记录数
    const [totalPages, setTotalPages] = useState(1);    // 总页数

    // 删除用户相关
    const [deleteUserUuid, setDeleteUserUuid] = useState("");

    useEffect(() => {
        document.title = `用户管理 | ${site.name ?? "Frontleaves Technology"}`;

        // 获取用户列表
        const fetchUsers = async () => {
            try {
                setLoading(true);
                // 调用接口时传入当前页、页大小等参数
                const response = await GetUserListAPI({
                    page: currentPage,
                    size: pageSize,
                    keyword: "",
                    is_desc: true
                });
                if (response?.data?.records) {
                    setUserList(response.data.records);

                    // 从响应里获取总记录数、当前页、每页大小等信息
                    setTotal(response.data.total);
                    // 也可以直接使用后端返回的 current
                    // setCurrentPage(response.data.current);
                    setTotalPages(Math.ceil(response.data.total / response.data.size));
                }
            } catch (error) {
                console.error("获取用户列表失败: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
        // 当 currentPage 或 pageSize 改变时重新获取列表
    }, [site.name, currentPage, pageSize]);

    // 删除用户
    const deleteUser = async (userUuid: string) => {
        try {
            await DeleteUserAPI(userUuid);
            setUserList((prevUsers) => prevUsers.filter((user) => user.user.user_uuid !== userUuid));
            alert("用户删除成功");
        } catch (error) {
            console.error("删除用户失败: ", error);
            alert("删除用户失败");
        }
    };

    // 点击分页器时更新当前页
    const handlePageChange = (newPage: number) => {
        // 边界处理
        if (newPage < 1 || newPage > totalPages) return;
        setCurrentPage(newPage);
    };

    // 如果正在加载，就给一个虚拟数量给 useTransition
    const transition = useTransition(loading ? 10 : userList.length, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        config: { duration: 100 },
    });

    return (
        <>
            <div className="grid grid-cols-10 gap-6">
                <div className="col-span-7 space-y-6">
                    <div className="overflow-x-auto border border-gray-100 rounded-lg shadow-lg">
                        <table className="table table-zebra">
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
                            {transition((style, item) =>
                                item ? (
                                    loading ? (
                                        // 加载状态下的骨架屏
                                        <animated.tr key={item} style={style}>
                                            {[...Array(5)].map((_, i) => (
                                                <td key={i}>
                                                    <div className="skeleton h-4 w-full"></div>
                                                </td>
                                            ))}
                                        </animated.tr>
                                    ) : (
                                        userList.map((record: any, index: number) => (
                                            <animated.tr key={record.user.user_uuid} style={style}>
                                                <th>{(currentPage - 1) * pageSize + index + 1}</th>
                                                <td>{record.user.name}</td>
                                                <td>{record.user.role.role_name}</td>
                                                <td>{record.user.email}</td>
                                                <td>
                                                    <div className="flex gap-2 justify-end">
                                                        <button
                                                            onClick={() => document.getElementById('my_modal_2')?.showModal()}
                                                            className="text-xs flex items-center font-medium text-info hover:text-secondary space-x-0.5 cursor-pointer"
                                                        >
                                                            <Editor theme="outline" size="14" />
                                                            <span>编辑</span>
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setDeleteUserUuid(record.user.user_uuid);
                                                                document.getElementById('my_modal_3')?.showModal();
                                                            }}
                                                            className="text-xs font-medium text-accent hover:text-error flex items-center space-x-0.5 cursor-pointer"
                                                        >
                                                            <Delete theme="outline" size="14" />
                                                            <span>删除</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </animated.tr>
                                        ))
                                    )
                                ) : null
                            )}
                            </tbody>
                        </table>
                    </div>

                    {/* 分页导航 */}
                    <nav aria-label="Page navigation example" className="w-full flex justify-center">
                        <ul className="flex items-center -space-x-px h-8 text-sm">
                            {/* 上一页 */}
                            <li>
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700"
                                >
                                    <span className="sr-only">Previous</span>
                                    <Left theme="outline" size="16" fill="#333" />
                                </button>
                            </li>

                            {/* 渲染页码 */}
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <li key={page}>
                                    <button
                                        onClick={() => handlePageChange(page)}
                                        className={
                                            "flex items-center justify-center px-3 h-8 leading-tight border border-gray-300 hover:bg-gray-100 hover:text-gray-700 " +
                                            (page === currentPage
                                                ? "z-10 text-blue-600 bg-blue-50 border-blue-300"
                                                : "text-gray-500 bg-white")
                                        }
                                    >
                                        {page}
                                    </button>
                                </li>
                            ))}

                            {/* 下一页 */}
                            <li>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700"
                                >
                                    <span className="sr-only">Next</span>
                                    <Right theme="outline" size="16" fill="#333" />
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>

                <AdminRightCardComponent />
            </div>

            <AdminDeleteUserDialog
                userUuid={deleteUserUuid}
                onDelete={deleteUser}
                onCancel={() => document.getElementById('my_modal_3')?.close()}
            />
            <AdminEditUserDialog />
            <AdminAddUserDialog />
        </>
    );
}
