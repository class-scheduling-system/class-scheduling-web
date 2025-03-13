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

import { useState, useEffect, JSX } from "react";
import {
    AddUser, ApplicationEffect,
    CheckOne,
    CloseOne, EditName,
    Envelope, Forbid,
    Key, Permissions,
    PhoneTelephone, Return,
    User,
    UserPositioning
} from "@icon-park/react";
import { EditUserAPI } from "../../apis/user_api.ts";
import { message, Modal } from "antd";
import * as React from "react";
import { UserAddDTO } from "../../models/dto/user_add_dto.ts";
import { PageSearchDTO } from "../../models/dto/page_search_dto.ts";
import { GetRoleListAPI } from "../../apis/role_api.ts";
import { RoleEntity } from "../../models/entity/role_entity.ts";
import { UserEditDTO } from "../../models/dto/user_edit_dto.ts";
import {SiteInfoEntity} from "../../models/entity/site_info_entity.ts";
import {Link, useLocation, useNavigate, useParams} from "react-router";


export function AdminEditUserPage({site}: Readonly<{
    site: SiteInfoEntity
}>): JSX.Element {
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
        ban: 0, // 修改为布尔类型值
        role_uuid: "",
        permission: [] as string[],
    });
    const [loading, setLoading] = useState(true);

    // 初始化教师信息
    useEffect(() => {
        if (userInfo) {
            // 使用传递过来的教师信息初始化表单
            setData({
                name: userInfo.name,
                password: userInfo.password,
                phone:  userInfo. phone,
                email:userInfo.email,
                status: userInfo. status,
                ban: userInfo.ban,
                role_uuid: userInfo.role_uuid,
                permission: userInfo.permission,
            });
            setLoading(false);
        } else {
            // 如果没有传递教师信息，返回教师列表页面
            message.error("未找到用户信息");
            navigate("/admin/user");
        }
    }, [userInfo, navigate]);


    const [isModalOpen, setIsModalOpen] = useState(false);
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


    // 重置表单
    const resetForm = () => {
        if (userInfo) {
            // 重置为初始教师信息
            setData({
                name: userInfo.name,
                password: userInfo.password,
                phone:  userInfo. phone,
                email:userInfo.email,
                status: userInfo. status,
                ban: userInfo.ban,
                role_uuid: userInfo.role_uuid,
                permission: userInfo.permission,
            });
        }
    };

    // 提交表单
    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        try {
            const getResp = await EditUserAPI(userId || '', data);
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
            <div className="flex items-center space-x-2 pb-2">
                <Link to={"/admin/user"}>
                    <Return theme="outline" size="24"/>
                </Link>
                <h2 className="text-2xl font-bold flex items-center space-x-2">
                    <EditName theme="outline" size="24" />
                    <span>编辑用户</span>
                </h2>
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
                <div className="">
                    <form id={"user_edit"} onSubmit={onSubmit}  className="py-2 grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        {/* 密码（留空表示不修改） */}
                        <fieldset className="flex flex-col">
                            <legend className="flex items-center space-x-1 mb-1">
                                <Key theme="outline" size="16" fill="#333" />
                                <span>密码</span>
                            </legend>
                            <input
                                type="password"
                                className="input w-full validator"
                                placeholder="如需修改密码，请输入新密码"
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
                                type="text"
                                className="input w-full validator"
                                required
                                value={data.phone || ""}
                                onChange={(e) => setData({ ...data, phone: e.target.value })}
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
                        <fieldset className="flex flex-col">
                            <legend className="flex items-center space-x-1 mb-1">
                                <ApplicationEffect theme="outline" size="16" fill="#333"/>
                                <span>状态</span>
                            </legend>
                            <select
                                className="select w-full validator"
                                value={data.status !== undefined ? data.status : ""}
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
                        <fieldset className="flex flex-col">
                            <legend className="flex items-center space-x-1 mb-1">
                                <Forbid theme="outline" size="16" fill="#333"/>
                                <span>封禁</span>
                            </legend>
                            <select
                                className="select w-full validator"
                                value={data.ban !== undefined ? data.ban : ""}
                                onChange={(e) => setData({ ...data, ban: Number(e.target.value) })}
                                required
                            >
                                <option value="" disabled>
                                    请选择封禁状态
                                </option>
                                <option value="0">未封禁</option>
                                <option value="1">封禁</option>
                            </select>
                        </fieldset>
                        {/* 操作按钮 */}
                        <div className="md:col-span-2 mt-6 flex space-x-4">
                            <button
                                type="button"
                                className="btn btn-ghost"
                                onClick={resetForm}
                            >
                                <CloseOne theme="outline" size="16"/>
                                <span>重置</span>
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                <CheckOne theme="outline" size="16"/>
                                <span>提交</span>
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>

    );
}
