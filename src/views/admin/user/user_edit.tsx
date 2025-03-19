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

import { useState, useEffect} from "react";
import {
    ApplicationEffect,
    CheckOne,
    Envelope,
    Forbid,
    Key,
    Permissions,
    PhoneTelephone,
    Return,
    User,
    UserPositioning,
    Refresh, Editor, Info
} from "@icon-park/react";
import { EditUserAPI } from "../../../apis/user_api.ts";
import { message, Transfer} from "antd";
import * as React from "react";
import { PageSearchDTO } from "../../../models/dto/page_search_dto.ts";
import { GetRoleListAPI } from "../../../apis/role_api.ts";
import { RoleEntity } from "../../../models/entity/role_entity.ts";
import { UserEditDTO } from "../../../models/dto/user_edit_dto.ts";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { GetPermissionListAPI } from "../../../apis/permission_api.ts";
import { UserAddDTO } from "../../../models/dto/user_add_dto.ts";

export function AdminEditUserPage():  React.JSX.Element {
    const navigate = useNavigate();
    const location = useLocation();
    const { userId } = useParams();
    // 从路由参数获取教师信息
    const userInfo = location.state?.userInfo;

    const [data, setData] = useState<UserEditDTO>({
        name: "",
        password: "",
        phone: "",
        email: "",
        status: 1,
        ban: false,
        role_uuid: "",
        permission: [] as string[],
    });
    const [loading, setLoading] = useState(true);
    const [permissionList, setPermissionList] = useState<OptionType[]>([]);
    const [targetKeys, setTargetKeys] = useState<string[]>([]);
    const [roleList, setRoleList] = useState<RoleEntity[]>([]);
    const [searchRequest] = useState<PageSearchDTO>({
        page: 1,
        size: 20,
        is_desc: true,
    } as PageSearchDTO);

    // 过滤出允许的角色：管理、管理员、教务
    const allowedRoles = roleList?.filter(role =>
        ["管理", "管理员", "教务"].some(roleName =>
            role?.role_name?.includes(roleName)
        )
    );

    // 初始化教师信息
    useEffect(() => {
        if (userInfo) {
            // 使用传递过来的教师信息初始化表单
            setData({
                name: userInfo.name,
                password: userInfo.password,
                phone: userInfo.phone,
                email: userInfo.email,
                status: Number(userInfo.status),
                ban: userInfo.ban,
                role_uuid: userInfo.role.role_uuid,
                permission: userInfo.permission,
            });

            // 设置初始权限选择
            if (userInfo.permission && Array.isArray(userInfo.permission)) {
                setTargetKeys(userInfo.permission);
            }

            setLoading(false);
        } else {
            // 如果没有传递教师信息，返回教师列表页面
            message.error("未找到用户信息");
            navigate("/admin/user");
        }
    }, [userInfo, navigate]);


    // 获取权限列表
    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const response = await GetPermissionListAPI();
                if (response?.output === "Success") {
                    console.log("获取权限列表成功:", response.data);
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

    // 穿梭框变更处理
    const handleTransferChange = (newTargetKeys: string[]) => {
        setTargetKeys(newTargetKeys);
    };

    interface OptionType {
        title: string;
        description: string;
        [key: string]: unknown;
    }


    const filterOption = (inputValue: string, option: OptionType): boolean => {
        return (
            option.title.toLowerCase().indexOf(inputValue.toLowerCase()) > -1 ||
            option.description.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
        );
    };

    // 重置表单
    const resetForm = () => {
        if (userInfo) {
            // 重置为初始教师信息
            setData({
                name: userInfo.name,
                password: userInfo.password,
                phone:  userInfo.phone,
                email: userInfo.email,
                status: userInfo.status,
                ban: userInfo.ban,
                role_uuid: userInfo.role_uuid,
                permission: userInfo.permission,
            });

            // 重置权限选择
            if (userInfo.permission && Array.isArray(userInfo.permission)) {
                setTargetKeys(userInfo.permission);
            }

            message.success("表单已重置");
        }
    };

    // 提交表单
    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const payload = {...data, permission: targetKeys} as UserAddDTO;
        try {
            const getResp = await EditUserAPI(userId || '', payload);
            if (getResp?.output === "Success") {
                message.success("编辑用户成功");
                navigate("/admin/user");
            } else {
                message.error(getResp?.error_message ?? "编辑用户失败");
            }
        } catch (error) {
            console.error("编辑用户失败:", error);
            message.error("编辑用户失败");
        }
    }

    // 获取角色列表
    useEffect(() => {
        GetRoleListAPI(searchRequest)
            .then(response => {
                if (response?.output === "Success") {
                    console.log("获取角色列表成功:", response.data);
                    setRoleList(response.data!.records);
                } else {
                    message.error(response?.error_message ?? "获取角色列表失败");
                }
            })
            .catch(error => {
                console.error("角色列表请求失败:", error);
                message.error("获取角色列表失败");
            });
    }, [searchRequest]);


    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2">
                <div className="flex items-center space-x-2">
                    <Link to={"/admin/user"}>
                        <Return theme="outline" size="24"/>
                    </Link>
                    <h2 className="text-2xl font-bold flex items-center space-x-2">
                        <span>编辑用户</span>
                    </h2>
                </div>
            </div>
            {loading ? (
                // 加载中显示骨架屏
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array(8).fill(0).map((_, index) => (
                        <div key={index} className="animate-pulse">
                            <div className="h-4 bg-base-300 rounded w-24 mb-2"></div>
                            <div className="h-10 bg-base-300 rounded w-full"></div>
                        </div>
                    ))}
                </div>
            ) : (
                // 使用网格布局，确保三个元素之间的距离完全相等
                <div className="w-full">
                    <div className="grid grid-cols-12 gap-x-6">
                        <div className="lg:col-span-8 md:col-span-12 sm:col-span-12">
                            <div className="card card-border bg-base-100 w-full shadow-md">
                                <h2 className="card-title bg-neutral/10 rounded-t-lg p-3"><Editor theme="outline" size="18"/>编辑用户信息</h2>
                                <div className="card-body">
                                    <form id="user_edit" onSubmit={onSubmit} className=" flex flex-col h-full space-y-5">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* 用户名 */}
                                            <fieldset className="flex flex-col">
                                                <legend className="flex items-center space-x-1 mb-1 text-sm">
                                                    <User theme="outline" size="14"/>
                                                    <span>用户名</span>
                                                </legend>
                                                <input
                                                    type="text"
                                                    className="input input-sm w-full validator"
                                                    required
                                                    value={data.name || ""}
                                                    onChange={(e) => setData({ ...data, name: e.target.value })}
                                                />
                                            </fieldset>
                                            {/* 密码（留空表示不修改） */}
                                            <fieldset className="flex flex-col">
                                                <legend className="flex items-center space-x-1 mb-1 text-sm">
                                                    <Key theme="outline" size="14"/>
                                                    <span>密码</span>
                                                </legend>
                                                <input
                                                    type="password"
                                                    className="input input-sm w-full validator"
                                                    placeholder="如需修改密码，请输入新密码"
                                                    onChange={(e) => setData({ ...data, password: e.target.value })}
                                                />
                                            </fieldset>
                                            {/* 邮箱 */}
                                            <fieldset className="flex flex-col">
                                                <legend className="flex items-center space-x-1 mb-1 text-sm">
                                                    <Envelope theme="outline" size="14"/>
                                                    <span>邮箱</span>
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
                                                    <PhoneTelephone theme="outline" size="14"/>
                                                    <span>手机号</span>
                                                </legend>
                                                <input
                                                    type="text"
                                                    className="input input-sm w-full validator"
                                                    required
                                                    value={data.phone || ""}
                                                    onChange={(e) => setData({ ...data, phone: e.target.value })}
                                                />
                                            </fieldset>
                                            {/* 角色选择 */}
                                            <fieldset className="flex flex-col">
                                                <legend className="flex items-center space-x-1 mb-1 text-sm">
                                                    <UserPositioning theme="outline" size="14"/>
                                                    <span>角色</span>
                                                </legend>
                                                <select
                                                    className="select select-sm w-full validator"
                                                    value={data.role_uuid}
                                                    onChange={(e) => setData({ ...data, role_uuid: e.target.value })}
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
                                            {/* 状态 */}
                                            <fieldset className="flex flex-col">
                                                <legend className="flex items-center space-x-1 mb-1 text-sm">
                                                    <ApplicationEffect theme="outline" size="14"/>
                                                    <span>状态</span>
                                                </legend>
                                                <select
                                                    className="select select-sm w-full validator"
                                                    value={data.status !== undefined ? (data.status===1 ? "1" : "0") : ""}
                                                    onChange={(e) => setData({ ...data, status: Number(e.target.value) })}
                                                    required
                                                >
                                                    <option value="" disabled>
                                                        请选择状态
                                                    </option>
                                                    <option value="1">启用</option>
                                                    <option value="0">禁用</option>
                                                </select>
                                            </fieldset>

                                            {/* 封禁 */}
                                            <fieldset className="flex flex-col md:col-span-1">
                                                <legend className="flex items-center space-x-1 mb-1 text-sm">
                                                    <Forbid theme="outline" size="14"/>
                                                    <span>封禁</span>
                                                </legend>
                                                <select
                                                    className="select select-sm w-full validator"
                                                    value={data.ban !== undefined ? (data.ban ? "1" : "0") : ""}
                                                    onChange={(e) => setData({ ...data, ban: e.target.value === "1" })}
                                                    required
                                                >
                                                    <option value="" disabled>
                                                        请选择封禁状态
                                                    </option>
                                                    <option value="0">未封禁</option>
                                                    <option value="1">封禁</option>
                                                </select>
                                            </fieldset>
                                            <fieldset className="flex flex-col md:col-span-2 flex-grow">
                                                <legend className="flex items-center space-x-1 mb-1 text-sm">
                                                    <Permissions theme="outline" size="14"/>
                                                    <span>权限</span>
                                                </legend>
                                                <div className="flex-grow">
                                                    <Transfer
                                                        dataSource={permissionList}
                                                        titles={['可选权限', '已选权限']}
                                                        targetKeys={targetKeys}
                                                        onChange={data =>handleTransferChange(data as string[])}
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
                                                <Refresh theme="outline" size="14"/>
                                                <span>重置</span>
                                            </button>
                                            <button
                                                type="submit"
                                                className="btn btn-sm btn-primary"
                                            >
                                                <CheckOne theme="outline" size="14"/>
                                                <span>提交</span>
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="lg:col-span-4 md:col-span-12 sm:col-span-12 flex flex-col space-y-6">
                            <div className="card card-border bg-base-100 w-full h-full shadow-md">
                                <h2 className="card-title bg-neutral/10 rounded-t-lg p-3"><User theme="outline" size="18"/>当前用户信息</h2>
                                <div className="card-body">
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-2 gap-2 items-center">
                                            <span className="text-sm text-gray-600 font-medium flex items-center space-x-2">
                                                <User theme="outline" size="14" className="text-secondary" />
                                                <span>用户名</span>
                                            </span>
                                            <span className="text-right text-gray-800">{userInfo?.name || data.name}</span>
                                        </div>
                                        <div className="border-b border-gray-200"></div>
                                        <div className="grid grid-cols-2 gap-2 items-center">
                                            <span className="text-sm text-gray-600 font-medium flex items-center space-x-2">
                                                <UserPositioning theme="outline" size="14" className="text-secondary" />
                                                <span>当前角色</span>
                                            </span>
                                            <span className="text-right  text-gray-800">{userInfo?.role.role_name}</span>
                                        </div>
                                        <div className="border-b border-gray-200"></div>
                                        <div className="grid grid-cols-2 gap-2 items-center">
                                            <span className="text-sm text-gray-600 font-medium flex items-center space-x-2">
                                                <Envelope theme="outline" size="14" className="text-secondary" />
                                                <span>当前邮箱</span>
                                            </span>
                                            <span className="text-right  text-gray-800">{userInfo?.role.email || data.email}</span>
                                        </div>
                                        <div className="border-b border-gray-200"></div>
                                        <div className="grid grid-cols-2 gap-2 items-center">
                                            <span className="text-sm text-gray-600 font-medium flex items-center space-x-2">
                                                <PhoneTelephone theme="outline" size="14" className="text-secondary" />
                                                <span>当前手机号</span>
                                            </span>
                                            <span className="text-right  text-gray-800">{userInfo?.role.phone || data.phone}</span>
                                        </div>
                                        <div className="border-b border-gray-200"></div>
                                        <div className="grid grid-cols-2 gap-2 items-center">
                                            <span className="text-sm text-gray-600 font-medium flex items-center space-x-2">
                                                <ApplicationEffect theme="outline" size="14" className="text-secondary" />
                                                <span>状态</span>
                                            </span>
                                            <div className="text-right">
                                                <div className={`badge badge-outline ${userInfo?.status? "badge-success" : "badge-error"} font-medium`}>
                                                    {userInfo?.status? "启用" : "禁用"}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="border-b border-gray-200"></div>
                                        <div className="grid grid-cols-2 gap-2 items-center">
                                            <span className="text-sm text-gray-600 font-medium flex items-center space-x-2">
                                                <Forbid theme="outline" size="14" className="text-secondary" />
                                                <span>封禁状态</span>
                                            </span>
                                            <div className="text-right">
                                                <div className={`badge badge-outline ${userInfo?.ban ? "badge-error " : "badge-success"} font-medium`}>
                                                    {userInfo?.ban ? "已封禁" : "未封禁"}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="border-b border-gray-200"></div>
                                        <div className="grid grid-cols-2 gap-2 items-center">
                                            <span className="text-sm text-gray-600 font-medium flex items-center space-x-2">
                                                <Permissions theme="outline" size="14" className="text-secondary" />
                                                <span>拥有权限数</span>
                                            </span>
                                            <span className="text-right font-semibold text-secondary">
                                                {userInfo?.permission?.length || targetKeys.length} 个
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card card-border bg-base-100 w-full h-full shadow-md">
                                <h2 className="card-title bg-secondary/55 rounded-t-lg p-3"><Info theme="outline" size="18"/>操作提示</h2>
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
            )}
        </div>
    );
}