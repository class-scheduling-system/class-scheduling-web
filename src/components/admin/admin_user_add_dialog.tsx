import {
    AddUser,
    CheckOne,
    CloseOne,
    Envelope,
    Key,
    PhoneTelephone,
    User,
    Permissions,
    UserPositioning,
    GreenHouse,
    HamburgerButton
} from "@icon-park/react";
import * as React from "react";
import { JSX, useEffect, useState } from "react";
import { message, Modal } from "antd";
import { AddUserAPI } from "../../apis/user_api.ts";
import { UserAddDTO } from "../../models/dto/user_add_dto.ts";
import { RoleEntity } from "../../models/entity/role_entity.ts";
import { GetRoleListAPI } from "../../apis/role_api.ts";
import { PageSearchDTO } from "../../models/dto/page_search_dto.ts";

export function AdminAddUserDialog({ show, emit, onAddSuccess }: Readonly<{
    show: boolean;
    emit: (data: boolean) => void;
    onAddSuccess?: () => void
}>): JSX.Element {
    const [data, setData] = useState<UserAddDTO>({
        permission: []
    } as UserAddDTO);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [roleList, setRoleList] = useState<RoleEntity[]>([]);
    const [searchRequest, setSearchRequest] = useState<PageSearchDTO>({
        page: 1,
        size: 20,
        is_desc: true,
    } as PageSearchDTO);

    // 根据角色名称判断教务角色：假设角色名称包含"教务"的即为教务角色
    const teachingRole = roleList.find(role => role.role_name.includes("教务"));

    useEffect(() => {
        setIsModalOpen(show);
    }, [show]);

    useEffect(() => {
        emit(isModalOpen);
    }, [emit, isModalOpen]);

    // 获取角色列表
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await GetRoleListAPI(searchRequest);
                if (response?.output === "Success") {
                    console.log("获取角色列表成功:", response.data);
                    setRoleList(response.data.records);
                } else {
                    message.error(response?.message ?? "获取角色列表失败");
                }
            } catch (error) {
                console.error("角色列表请求失败:", error);
                message.error("获取角色列表失败");
            }
        };
        fetchRoles();
    }, [searchRequest]);

    // 关闭对话框
    const handleClose = () => {
        setData({} as UserAddDTO);
        setIsModalOpen(false);
    };

    // 提交表单
    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        // 根据角色判断是否需要保留 department、type
        const payload = { ...data };
        if (payload.role_uuid !== (teachingRole ? teachingRole.role_uuid : "")) {
            // 如果选中的角色不是教务角色，则移除部门和权限类型字段
            delete payload.department;
            delete payload.type;
        }

        try {
            const getResp = await AddUserAPI(payload);
            if (getResp?.output === "Success") {
                message.success("添加成功");
                onAddSuccess?.();
                handleClose();
            } else {
                message.error(getResp?.error_message ?? "添加失败");
            }
        } catch (error) {
            console.error("添加用户失败:", error);
            message.error("添加失败");
        }
    }

    return (
        <Modal
            open={isModalOpen}
            onCancel={handleClose}
            footer={
                <div className="modal-action">
                    <div className={"flex space-x-3"}>
                        <button type={"button"} onClick={handleClose} className={"btn btn-error"}>
                            <CloseOne theme="outline" size="16" />
                            <span>取消</span>
                        </button>
                        <button type={"submit"} form={"user_add"} className={"btn btn-success"}>
                            <CheckOne theme="outline" size="16" />
                            <span>提交</span>
                        </button>
                    </div>
                </div>
            }
        >
            <div className="flex flex-col space-y-4">
                <h3 className="font-bold text-lg flex items-center space-x-2">
                    <AddUser theme="outline" size="20" fill="#333" />
                    <span>添加用户</span>
                </h3>
                <form id={"user_add"} onSubmit={onSubmit} className="py-2 grid space-y-2">
                    {/* 用户名 */}
                    <fieldset className="flex flex-col">
                        <legend className="flex items-center space-x-1 mb-1">
                            <User theme="outline" size="16" fill="#333" />
                            <span>用户名</span>
                        </legend>
                        <input
                            type="text"
                            className="input w-full validator"
                            required
                            value={data.name || ""}
                            onChange={(e) => setData({ ...data, name: e.target.value })}
                        />
                    </fieldset>

                    {/* 角色选择 */}
                    <fieldset className="flex flex-col">
                        <legend className="flex items-center space-x-1 mb-1">
                            <UserPositioning theme="outline" size="16" fill="#333" />
                            <span>角色</span>
                        </legend>
                        <select
                            className="select w-full validator"
                            value={data.role_uuid || ""}
                            onChange={(e) => {
                                const selectedRoleUuid = e.target.value;
                                if (selectedRoleUuid === (teachingRole ? teachingRole.role_uuid : "")) {
                                    // 如果选中的是教务角色，则保留并显示部门和权限类型
                                    setData({
                                        ...data,
                                        role_uuid: selectedRoleUuid,
                                        department: data.department ?? "",
                                        type: data.type ?? undefined
                                    });
                                } else {
                                    // 否则清空部门和权限类型字段
                                    setData({
                                        ...data,
                                        role_uuid: selectedRoleUuid,
                                        department: "",
                                        type: undefined
                                    });
                                }
                            }}
                            required
                        >
                            <option value="" disabled>
                                请选择角色
                            </option>
                            {roleList.map((role) => (
                                <option key={role.role_uuid} value={role.role_uuid}>
                                    {role.role_name}
                                </option>
                            ))}
                        </select>
                    </fieldset>

                    {/* 密码 */}
                    <fieldset className="flex flex-col">
                        <legend className="flex items-center space-x-1 mb-1">
                            <Key theme="outline" size="16" fill="#333" />
                            <span>密码</span>
                        </legend>
                        <input
                            type="password"
                            className="input w-full validator"
                            required
                            value={data.password || ""}
                            onChange={(e) => setData({ ...data, password: e.target.value })}
                        />
                    </fieldset>

                    {/* 邮箱 */}
                    <fieldset className="flex flex-col">
                        <legend className="flex items-center space-x-1 mb-1">
                            <Envelope theme="outline" size="16" fill="#333" />
                            <span>邮箱</span>
                        </legend>
                        <input
                            type="email"
                            className="input w-full validator"
                            required
                            value={data.email || ""}
                            onChange={(e) => setData({ ...data, email: e.target.value })}
                        />
                    </fieldset>

                    {/* 手机号 */}
                    <fieldset className="flex flex-col">
                        <legend className="flex items-center space-x-1 mb-1">
                            <PhoneTelephone theme="outline" size="16" fill="#333" />
                            <span>手机号</span>
                        </legend>
                        <input
                            type="tel"
                            className="input w-full validator"
                            required
                            value={data.phone || ""}
                            onChange={(e) => setData({ ...data, phone: e.target.value })}
                        />
                    </fieldset>

                    {/* 权限选择（可选多选） */}
                    <fieldset className="flex flex-col">
                        <legend className="flex items-center space-x-1 mb-1">
                            <Permissions theme="outline" size="16" fill="#333" />
                            <span>权限</span>
                        </legend>
                        <select
                            className="select w-full validator"
                            value={data.permission && data.permission.length ? data.permission[0] : ""}
                            onChange={(e) => setData({ ...data, permission: [e.target.value] })}
                            required
                        >
                            <option value="" disabled>
                                请选择权限
                            </option>
                            <option value="user">user</option>
                            <option value="admin">admin</option>
                            <option value="super">super</option>
                        </select>
                    </fieldset>

                    {/* 仅当角色为教务时才显示部门和权限类型 */}
                    {data.role_uuid === (teachingRole ? teachingRole.role_uuid : "") && (
                        <>
                            {/* 部门 */}
                            <fieldset className="flex flex-col">
                                <legend className="flex items-center space-x-1 mb-1">
                                    <GreenHouse theme="outline" size="16" fill="#333"/>
                                    <span>部门</span>
                                </legend>
                                <input
                                    type="text"
                                    className="input w-full validator"
                                    required
                                    value={data.department || ""}
                                    onChange={(e) =>
                                        setData({ ...data, department: e.target.value })
                                    }
                                />
                            </fieldset>

                            {/* 权限类型 */}
                            <fieldset className="flex flex-col">
                                <legend className="flex items-center space-x-1 mb-1">
                                    <HamburgerButton theme="outline" size="16" fill="#333"/>
                                    <span>权限类型</span>
                                </legend>
                                <select
                                    className="select w-full validator"
                                    value={data.type ?? ""}
                                    onChange={(e) =>
                                        setData({ ...data, type: Number(e.target.value) })
                                    }
                                    required
                                >
                                    <option value="" disabled>
                                        请选择权限类型
                                    </option>
                                    <option value="1">所有权限</option>
                                    <option value="2">教务权限</option>
                                </select>
                            </fieldset>
                        </>
                    )}
                </form>
            </div>
        </Modal>
    );
}
