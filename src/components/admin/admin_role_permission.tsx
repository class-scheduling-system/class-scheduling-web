import {JSX, useEffect, useState} from "react";
import {
    CloseOne, MoreApp,
} from "@icon-park/react";
import {message, Modal} from "antd";
import {GetRoleListAPI} from "../../apis/role_api.ts";
import {RoleEntity} from "../../models/entity/role_entity.ts";


export function AdminRolePermissionDialog({ show, emit, roleUuid }: Readonly<{
    show: boolean;
    emit: (data: boolean) => void;
    roleUuid: string;
}>): JSX.Element {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 当前选中的角色
    const [currentRole, setCurrentRole] = useState<RoleEntity | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setIsModalOpen(show);
    }, [show]);

    useEffect(() => {
        emit(isModalOpen);
    }, [emit, isModalOpen]);


    const handleClose = () => {
        setIsModalOpen(false);
    }

    // 根据roleUuid获取对应角色的权限
    useEffect(() => {
        // 只有当对话框打开且有roleUuid时才获取数据
        if (isModalOpen && roleUuid) {
            setLoading(true);

            const fetchRoleData = async () => {
                try {
                    // 使用现有的GetRoleListAPI获取所有角色
                    const response = await GetRoleListAPI({
                        page: 1,
                        size: 100,  // 获取足够多的记录以确保包含目标角色
                        is_desc: true
                    });

                    if (response?.output === "Success") {
                        // 从返回的角色列表中找到匹配roleUuid的角色
                        const targetRole = response.data!.records.find(
                            (role: RoleEntity) => role.role_uuid === roleUuid
                        );

                        if (targetRole) {
                            setCurrentRole(targetRole);
                        } else {
                            message.error("未找到指定角色");
                        }
                    } else {
                        message.error(response?.error_message ?? "获取角色数据失败");
                    }
                } catch (error) {
                    console.error("获取角色数据时出错:", error);
                    message.error("获取角色数据时出错");
                } finally {
                    setLoading(false);
                }
            };

            fetchRoleData();
        }
    }, [roleUuid, isModalOpen]);

    // 将权限数组转换为适合显示的格式
    // 假设permission是权限代码，这里将其转换为更友好的显示格式
    const getPermissionName = (code: string) => {
        const permissionMap: {[key: string]: string} = {
            "operate": "操作权限",
            "user": "用户管理",
            // 可以根据实际需要添加更多权限的映射
        };

        return permissionMap[code] || code;
    };

    const getPermissionDescription = (code: string) => {
        const descriptionMap: {[key: string]: string} = {
            "operate": "允许执行系统操作",
            "user": "允许管理用户",
            // 可以根据实际需要添加更多权限的描述
        };

        return descriptionMap[code] || "未定义的权限";
    };

    return (
        <>
            <Modal
                open={isModalOpen}
                onCancel={handleClose}
                footer={
                    <div className="modal-action">
                        <div className={"flex space-x-3"}>
                            <button type={"button"} onClick={handleClose} className={"btn btn-soft btn-secondary"}>
                                <CloseOne theme="outline" size="16" />
                                <span>关闭</span>
                            </button>
                        </div>
                    </div>
                }
            >
                <div className="flex flex-col space-y-4">
                    <h3 className="font-bold text-lg flex items-center space-x-2">
                        <MoreApp theme="outline" size="20"/>
                        <span>角色详情: {currentRole?.role_name || ""}</span>
                    </h3>
                    {loading ? (
                        <div className="flex justify-center p-4">
                            <span className="loading loading-spinner loading-md"></span>
                        </div>
                    ) : (
                        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                            <table className="table">
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>权限名称</th>
                                    <th>权限描述</th>
                                </tr>
                                </thead>
                                <tbody>
                                {currentRole && currentRole.permission && currentRole.permission.length > 0 ? (
                                    currentRole.permission.map((permCode, index) => (
                                        <tr key={permCode} className="transition hover:bg-base-200">
                                            <td>{index + 1}</td>
                                            <td>{getPermissionName(permCode)}</td>
                                            <td>{getPermissionDescription(permCode)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="text-center py-4">该角色没有权限记录</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </Modal>
        </>
    );
}