/*
 * --------------------------------------------------------------------------------
 * Copyright (c) 2022-NOW(至今) 锋楪技术团队
 * Author: 锋楪技术团队 (https://www.frontleaves.com)
 *
 * 本文件包含锋楪技术团队项目的源代码，项目的所有源代码均遵循 MIT 开源许可证协议。
 * --------------------------------------------------------------------------------
 * 许可证声明：
 *
 * 版权所有 (c) 2022-2025 锋楪技术团队。保留所有权利。
 *
 * 本软件是“按原样”提供的，没有任何形式的明示或暗示的保证，包括但不限于
 * 对适销性、特定用途的适用性和非侵权性的暗示保证。在任何情况下，
 * 作者或版权持有人均不承担因软件或软件的使用或其他交易而产生的、
 * 由此引起的或以任何方式与此软件有关的任何索赔、损害或其他责任。
 *
 * 使用本软件即表示您了解此声明并同意其条款。
 *
 * 有关 MIT 许可证的更多信息，请查看项目根目录下的 LICENSE 文件或访问：
 * https://opensource.org/licenses/MIT
 * --------------------------------------------------------------------------------
 * 免责声明：
 *
 * 使用本软件的风险由用户自担。作者或版权持有人在法律允许的最大范围内，
 * 对因使用本软件内容而导致的任何直接或间接的损失不承担任何责任。
 * --------------------------------------------------------------------------------
 */

import React, { JSX, useEffect, useState } from 'react';
import {
    CheckOne,
    Envelope,
    GreenHouse,
    HamburgerButton,
    Key,
    Permissions,
    PhoneTelephone,
    Return,
    User,
    UserPositioning,
    AddUser, Refresh, Info
} from "@icon-park/react";
import { message, Transfer } from "antd";
import { AddUserAPI } from "../../../apis/user_api.ts";
import { UserAddDTO } from "../../../models/dto/user_add_dto.ts";
import { RoleEntity } from "../../../models/entity/role_entity.ts";
import { GetRoleListAPI } from "../../../apis/role_api.ts";
import { GetPermissionListAPI } from "../../../apis/permission_api.ts";
import { PageSearchDTO } from "../../../models/dto/page/page_search_dto.ts";
import { Link } from "react-router";
import { SiteInfoEntity } from '../../../models/entity/site_info_entity.ts';

interface OptionType {
    title: string;
    description: string;
    [key: string]: unknown;
}
export function AdminUserAddPage({ site }: Readonly<{ site: SiteInfoEntity }>): JSX.Element {
    const [data, setData] = useState<UserAddDTO>({
        permission: [] as string[],
    } as UserAddDTO);
    const [roleList, setRoleList] = useState<RoleEntity[]>([]);
    const [permissionList, setPermissionList] = useState<OptionType[]>([]);
    const [targetKeys, setTargetKeys] = useState<string[]>([]);
    const [searchRequest] = useState<PageSearchDTO>({
        page: 1,
        size: 20,
        is_desc: true,
    } as PageSearchDTO);

    useEffect(() => {
        document.title = `添加用户 | ${site.name}`;
    }, []);

    // 最近添加的用户列表状态 - 从localStorage获取或使用空数组作为默认值
    const [recentUsers, setRecentUsers] = useState(() => {
        const savedUsers = localStorage.getItem('recentAddedUsers');
        return savedUsers ? JSON.parse(savedUsers) : [];
    });


    // 获取选中角色的名称
    const getSelectedRoleName = (roleUuid: string) => {
        const selectedRole = roleList.find(role => role.role_uuid === roleUuid);
        return selectedRole ? selectedRole.role_name : "";
    };

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
                    const formattedData = response.data?.map(item => ({
                        key: item.permission_key,
                        title: item.name,
                        description: item.permission_key,
                        disabled: false
                    }));
                    setPermissionList(formattedData as OptionType[]);
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

    // 更新最近添加的用户列表
    const updateRecentUsers = (newUser: { department?: string | undefined; email?: string; name: string; password?: string | undefined; permission?: string[] | undefined; phone?: string; role_uuid: string; type?: number | undefined; }) => {
        // 创建当前时间格式化字符串
        const now = new Date();
        const timeString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        // 创建新用户记录
        const userRecord = {
            name: newUser.name,
            role: getSelectedRoleName(newUser.role_uuid),
            time: timeString
        };

        // 将新用户添加到最近用户列表的最前面，并只保留前三个
        const updatedRecentUsers = [userRecord, ...recentUsers.slice(0, 2)];

        // 更新状态
        setRecentUsers(updatedRecentUsers);

        // 保存到localStorage
        localStorage.setItem('recentAddedUsers', JSON.stringify(updatedRecentUsers));
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
                // 更新最近添加的用户列表
                updateRecentUsers(payload);

                message.success("添加成功");
                // 重置表单，但不跳转，便于继续添加用户
                resetForm();
                // 如果需要跳转，取消注释下面的代码
                // navigate("/admin/user");
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
    const filterOption = (inputValue: string, option: OptionType): boolean => {
        return (
            option.title.toLowerCase().indexOf(inputValue.toLowerCase()) > -1 ||
            option.description.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
        );
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center space-x-2">
                <Link to={"/admin/user"}>
                    <Return theme="outline" size="24" />
                </Link>
                <h2 className="text-2xl font-bold flex items-center space-x-2">
                    <span>添加新用户</span>
                </h2>
            </div>
            <div className="w-full">
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="lg:col-span-8 md:col-span-12 sm:col-span-12 flex">
                        <div className="card card-border bg-base-100 w-full shadow-md">
                            <h2 className="card-title bg-neutral/10 rounded-t-lg p-3"><AddUser theme="outline" size="18" />添加用户信息</h2>
                            <div className="card-body">
                                <form id="user_add" onSubmit={onSubmit} className=" flex flex-col flex-grow space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                                        {/* 用户名 */}
                                        <fieldset className="flex flex-col">
                                            <legend className="flex items-center space-x-1 mb-1 text-sm">
                                                <User theme="outline" size="14" />
                                                <span>用户名</span>
                                                <span className="text-red-500">*</span>
                                            </legend>
                                            <input
                                                type="text"
                                                className="input input-sm w-full validator"
                                                required
                                                value={data.name || ""}
                                                onChange={(e) => setData({ ...data, name: e.target.value })}
                                            />
                                        </fieldset>
                                        {/* 角色选择 */}
                                        <fieldset className="flex flex-col">
                                            <legend className="flex items-center space-x-1 mb-1 text-sm">
                                                <UserPositioning theme="outline" size="14" />
                                                <span className="label-text">角色</span>
                                                <span className="text-red-500">*</span>
                                            </legend>
                                            <select
                                                className="select select-sm w-full validator"
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
                                        </fieldset>

                                        {/* 密码 */}
                                        <fieldset className="flex flex-col">
                                            <legend className="flex items-center space-x-1 mb-1 text-sm">
                                                <Key theme="outline" size="14" />
                                                <span className="label-text">密码</span>
                                            </legend>
                                            <input
                                                type="password"
                                                className="input input-sm w-full validator"
                                                value={data.password || ""}
                                                onChange={(e) => setData({ ...data, password: e.target.value })}
                                            />
                                        </fieldset>

                                        {/* 邮箱 */}
                                        <fieldset className="flex flex-col">
                                            <legend className="flex items-center space-x-1 mb-1 text-sm">
                                                <Envelope theme="outline" size="14" />
                                                <span className="label-text">邮箱</span>
                                                <span className="text-red-500">*</span>
                                            </legend>
                                            <input
                                                type="email"
                                                className="input input-sm w-full validator"
                                                required
                                                value={data.email || ""}
                                                onChange={(e) => setData({ ...data, email: e.target.value })}
                                            />
                                        </fieldset>

                                        {/* 手机号 */}
                                        <fieldset className="flex flex-col">
                                            <legend className="flex items-center space-x-1 mb-1 text-sm">
                                                <PhoneTelephone theme="outline" size="14" />
                                                <span className="label-text">手机号</span>
                                                <span className="text-red-500">*</span>
                                            </legend>
                                            <input
                                                type="tel"
                                                className="input input-sm w-full validator"
                                                required
                                                value={data.phone || ""}
                                                onChange={(e) => setData({ ...data, phone: e.target.value })}
                                            />
                                        </fieldset>

                                        {/* 仅当角色为教务时才显示的部门和权限类型 - 两栏显示 */}
                                        {data.role_uuid === (teachingRole ? teachingRole.role_uuid : "") && (
                                            <>
                                                {/* 部门 */}
                                                <fieldset className="form-control">
                                                    <legend className="flex items-center space-x-1 mb-1 text-sm">
                                                        <GreenHouse theme="outline" size="14" />
                                                        <span className="label-text">部门</span>
                                                        <span className="text-red-500">*</span>
                                                    </legend>
                                                    <input
                                                        type="text"
                                                        className="input input-sm w-full validator"
                                                        required
                                                        value={data.department ?? ""}
                                                        onChange={(e) =>
                                                            setData({ ...data, department: e.target.value })
                                                        }
                                                    />
                                                </fieldset>

                                                {/* 权限类型 */}
                                                <fieldset className="form-control">
                                                    <legend className="flex items-center space-x-1 mb-1 text-sm">
                                                        <HamburgerButton theme="outline" size="14" />
                                                        <span className="label-text">权限类型</span>
                                                        <span className="text-red-500">*</span>
                                                    </legend>
                                                    <select
                                                        className="select select-sm w-full validator"
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
                                        <fieldset className="flex flex-col md:col-span-2 flex-grow">
                                            <legend className="flex items-center space-x-1 mb-1 text-sm">
                                                <Permissions theme="outline" size="14" />
                                                <span>权限</span>
                                            </legend>
                                            <div className="flex-grow">
                                                <Transfer
                                                    dataSource={permissionList}
                                                    titles={['可选权限', '已选权限']}
                                                    targetKeys={targetKeys}
                                                    onChange={data => handleTransferChange(data as string[])}
                                                    filterOption={filterOption}
                                                    render={item => item.title}
                                                    showSearch
                                                    listStyle={{
                                                        width: '100%',
                                                        height: 280,
                                                    }}
                                                />
                                            </div>
                                        </fieldset>
                                    </div>
                                    <div className="card-actions justify-end flex">
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline"
                                            onClick={resetForm}
                                        >
                                            <Refresh theme="outline" size="14" />
                                            <span>重置</span>
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-sm btn-primary"
                                        >
                                            <CheckOne theme="outline" size="14" />
                                            <span>提交</span>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    {/* 右侧辅助卡片区域 */}
                    <div className="lg:col-span-4 md:col-span-12 sm:col-span-12 flex flex-col space-y-6" style={{ height: '100%' }}>
                        <div className="card card-border bg-base-100 w-full  shadow-md">
                            <h2 className="card-title bg-secondary/55 rounded-t-lg p-3"><Info theme="outline" size="18" />操作提示</h2>
                            <div className="card-body">
                                <ul className="space-y-2 text-gray-700">
                                    <li className="flex items-start">
                                        <span className="text-secondary mr-2">•</span>
                                        <span>密码留空表示不修改当前密码</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-secondary mr-2">•</span>
                                        <span>用户必须分配角色才能正常使用系统</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-secondary mr-2">•</span>
                                        <span>权限列表决定用户可执行的具体操作</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-secondary mr-2">•</span>
                                        <span>禁用状态的用户将无法登录系统</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-secondary mr-2">•</span>
                                        <span>封禁状态会限制用户使用某些功能</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-secondary mr-2">•</span>
                                        <span>用户权限将与角色自带权限合并生效</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-secondary mr-2">•</span>
                                        <span>重置按钮可恢复表单到初始状态</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}