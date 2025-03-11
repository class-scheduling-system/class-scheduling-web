import React, { useState, useEffect } from 'react';
import {
    AddUser,
    CheckOne,
    CloseOne,
    User,
    Envelope,
    Key,
    PhoneTelephone,
    UserPositioning,
    Permissions,
    GreenHouse,
    HamburgerButton,
    ArrowLeft
} from "@icon-park/react";
import { message, Transfer } from "antd";
import { AddUserAPI } from "../../apis/user_api.ts";
import { UserAddDTO } from "../../models/dto/user_add_dto.ts";
import { RoleEntity } from "../../models/entity/role_entity.ts";
import { GetRoleListAPI } from "../../apis/role_api.ts";
import { GetPermissionListAPI } from "../../apis/permission_api.ts";
import { PageSearchDTO } from "../../models/dto/page_search_dto.ts";

export function AdminUserAddPage(): React.JSX.Element {
    const [data, setData] = useState<UserAddDTO>({
        permission: [] as string[],
    } as UserAddDTO);

    const [roleList, setRoleList] = useState<RoleEntity[]>([]);
    const [permissionList, setPermissionList] = useState<any[]>([]);
    const [targetKeys, setTargetKeys] = useState<string[]>([]);
    const [searchRequest] = useState<PageSearchDTO>({
        page: 1,
        size: 20,
        is_desc: true,
    } as PageSearchDTO);

    // 过滤出允许的角色：管理员、管理、教务
    const allowedRoles = roleList?.filter(role =>
        ["管理员", "管理", "教务"].some(roleName =>
            role?.role_name?.includes(roleName)
        )
    );

    // 根据角色名称判断教务角色：假设角色名称包含"教务"的即为教务角色
    const teachingRole = roleList?.find(role => role?.role_name?.includes("教务"));

    // 获取角色列表
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await GetRoleListAPI(searchRequest);
                if (response?.output === "Success") {
                    console.log("获取角色列表成功:", response.data);
                    setRoleList(response.data!.records);
                } else {
                    message.error(response?.error_message ?? "获取角色列表失败");
                }
            } catch (error) {
                console.error("角色列表请求失败:", error);
                message.error("获取角色列表失败");
            }
        };
        fetchRoles().then();
    }, [searchRequest]);

    // 获取权限列表
    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const response = await GetPermissionListAPI();
                if (response?.output === "Success") {
                    console.log("获取权限列表成功:", response.data);
                    // 转换权限列表为Transfer需要的格式
                    const permissionData = response.data?.map(item => ({
                        key: item.permission_key,
                        title: item.name,
                        description: item.permission_key,
                        disabled: false
                    }));
                    setPermissionList(permissionData);
                } else {
                    message.error(response?.error_message ?? "获取权限列表失败");
                }
            } catch (error) {
                console.error("权限列表请求失败:", error);
                message.error("获取权限列表失败");
            }
        };
        fetchPermissions().then();
    }, []);

    // 重置表单
    const resetForm = () => {
        setData({
            permission: [] as string[],
        } as UserAddDTO);
        setTargetKeys([]);
    };

    // 提交表单
    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        // 根据角色判断是否需要保留 department、type
        const payload = { ...data, permission: targetKeys } as UserAddDTO;
        if (payload.role_uuid !== (teachingRole ? teachingRole.role_uuid : "")) {
            // 如果选中的角色不是教务角色，则移除部门和权限类型字段
            payload.department = undefined;
            payload.type = undefined;
        }

        try {
            const getResp = await AddUserAPI(payload);
            if (getResp?.output === "Success") {
                message.success("添加成功");
                // 跳转到用户列表或重置表单
                resetForm();
            } else {
                message.error(getResp?.error_message ?? "添加失败");
            }
        } catch (error) {
            console.error("添加用户失败:", error);
            message.error("添加失败");
        }
    }

    // 穿梭框变更处理
    const handleTransferChange = (newTargetKeys: string[]) => {
        setTargetKeys(newTargetKeys);
    };

    // 穿梭框过滤函数
    const filterOption = (inputValue: string, option: any) =>
        option.title.toLowerCase().indexOf(inputValue.toLowerCase()) > -1 ||
        option.description.toLowerCase().indexOf(inputValue.toLowerCase()) > -1;

    return (
        <div className="container mx-auto p-4">
            <div className="card bg-base-100 shadow-xl">
                <div className="card-header p-4 flex items-center space-x-4">
                    <button
                        onClick={() => window.history.back()}
                        className="btn btn-ghost btn-circle"
                        title="返回用户列表"
                    >
                        <ArrowLeft theme="outline" size="20" />
                    </button>
                    <h2 className="text-xl font-bold flex items-center space-x-2">
                        <AddUser theme="outline" size="20" fill="#333" />
                        <span>添加新用户</span>
                    </h2>
                </div>

                <div className="card-body">
                    <form id="user_add" onSubmit={onSubmit} className="space-y-4">
                        {/* 将表单字段排列为两列 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* 用户名 */}
                            <div className="form-control">
                                <label className="label flex items-center space-x-1">
                                    <User theme="outline" size="16" fill="#333" />
                                    <span className="label-text">用户名</span>
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    required
                                    value={data.name || ""}
                                    onChange={(e) => setData({ ...data, name: e.target.value })}
                                />
                            </div>

                            {/* 角色选择 */}
                            <div className="form-control">
                                <label className="label flex items-center space-x-1">
                                    <UserPositioning theme="outline" size="16" fill="#333" />
                                    <span className="label-text">角色</span>
                                    <span className="text-red-500">*</span>
                                </label>
                                <select
                                    className="select select-bordered w-full"
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
                                    {allowedRoles?.map((role) => (
                                        <option key={role.role_uuid} value={role.role_uuid}>
                                            {role.role_name}
                                        </option>
                                    )) || []}
                                </select>
                            </div>

                            {/* 密码 */}
                            <div className="form-control">
                                <label className="label flex items-center space-x-1">
                                    <Key theme="outline" size="16" fill="#333" />
                                    <span className="label-text">密码</span>
                                </label>
                                <input
                                    type="password"
                                    className="input input-bordered w-full"
                                    value={data.password || ""}
                                    onChange={(e) => setData({ ...data, password: e.target.value })}
                                />
                            </div>

                            {/* 邮箱 */}
                            <div className="form-control">
                                <label className="label flex items-center space-x-1">
                                    <Envelope theme="outline" size="16" fill="#333" />
                                    <span className="label-text">邮箱</span>
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    className="input input-bordered w-full"
                                    required
                                    value={data.email || ""}
                                    onChange={(e) => setData({ ...data, email: e.target.value })}
                                />
                            </div>

                            {/* 手机号 */}
                            <div className="form-control">
                                <label className="label flex items-center space-x-1">
                                    <PhoneTelephone theme="outline" size="16" fill="#333" />
                                    <span className="label-text">手机号</span>
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    className="input input-bordered w-full"
                                    required
                                    value={data.phone || ""}
                                    onChange={(e) => setData({ ...data, phone: e.target.value })}
                                />
                            </div>

                            {/* 仅当角色为教务时才显示的部门和权限类型 - 两栏显示 */}
                            {data.role_uuid === (teachingRole ? teachingRole.role_uuid : "") && (
                                <>
                                    {/* 部门 */}
                                    <div className="form-control">
                                        <label className="label flex items-center space-x-1">
                                            <GreenHouse theme="outline" size="16" fill="#333" />
                                            <span className="label-text">部门</span>
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="input input-bordered w-full"
                                            required
                                            value={data.department ?? ""}
                                            onChange={(e) =>
                                                setData({ ...data, department: e.target.value })
                                            }
                                        />
                                    </div>

                                    {/* 权限类型 */}
                                    <div className="form-control">
                                        <label className="label flex items-center space-x-1">
                                            <HamburgerButton theme="outline" size="16" fill="#333" />
                                            <span className="label-text">权限类型</span>
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            className="select select-bordered w-full"
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
                                    </div>
                                </>
                            )}
                        </div>

                        {/* 创建一个两列布局的容器来放置权限和手机号 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* 权限选择（穿梭框）*/}
                            <div className="form-control">
                                <label className="label flex items-center space-x-1">
                                    <Permissions theme="outline" size="16" fill="#333" />
                                    <span className="label-text">权限</span>
                                </label>
                                <Transfer
                                    dataSource={permissionList}
                                    titles={['可选权限', '已选权限']}
                                    targetKeys={targetKeys}
                                    onChange={handleTransferChange}
                                    filterOption={filterOption}
                                    render={item => item.title}
                                    showSearch
                                    listStyle={{
                                        width: '100%',
                                        height: 300,
                                    }}
                                />
                            </div>

                            {/* 空白占位，确保权限在左侧，手机号已经在上面的网格中 */}
                            <div></div>
                        </div>

                        {/* 操作按钮 */}
                        <div className="form-control mt-6 flex flex-row space-x-4">
                            <button
                                type="button"
                                className="btn btn-ghost"
                                onClick={resetForm}
                            >
                                <CloseOne theme="outline" size="16" />
                                <span>重置</span>
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                <CheckOne theme="outline" size="16" />
                                <span>提交</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AdminUserAddPage;