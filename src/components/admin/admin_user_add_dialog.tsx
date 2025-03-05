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

import {
    AddUser,
    CheckOne,
    CloseOne,
    Envelope, Key,
    PhoneTelephone,
    User,
    Permissions,
    UserPositioning
} from "@icon-park/react";
import * as React from "react";
import {JSX, useEffect, useState} from "react";
import {message, Modal} from "antd";
import {AddUserAPI} from "../../apis/user_api.ts";
import {UserAddDTO} from "../../models/dto/user_add_dto.ts";


/**
 * # AdminAddUserDialog
 *
 * > 该函数用于创建一个对话框，管理员可以通过这个对话框添加新的用户信息。此组件以模态对话框的形式呈现，并且提供了关闭对话框的功能。
 *
 * @returns {JSX.Element} 返回一个包含标题、说明文本以及关闭按钮的模态对话框组件。
 */
export function AdminAddUserDialog({show, emit}: Readonly<{
    show: boolean;
    emit: (data: boolean) => void;
}>): JSX.Element {
    const [data, setData] = useState<UserAddDTO>({} as UserAddDTO);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        setIsModalOpen(show);
    }, [show]);

    useEffect(() => {
        emit(isModalOpen);
    }, [emit, isModalOpen]);

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleClose = () => {
        setData({} as UserAddDTO);
        setIsModalOpen(false);
    }

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        console.log(message);
        const getResp = await AddUserAPI(data);
        if (getResp?.output === "Success") {
            message.success("添加成功");
            handleOk();
        } else {
            message.error(getResp?.error_message);
        }
    }

    return (
        <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel}
               footer={
                   <div className="modal-action">
                       <div className={"flex space-x-3"}>
                           <button type={"button"}
                                   onClick={handleClose}
                                   className={"btn btn-error"}>
                               <CloseOne theme="outline" size="16"/>
                               <span>取消</span>
                           </button>
                           <button type={"submit"} form={"building_add"}
                                   className={"btn btn-success"}>
                               <CheckOne theme="outline" size="16"/>
                               <span>提交</span>
                           </button>
                       </div>
                   </div>
               }>
            <div className="flex flex-col space-y-4">
                <h3 className="font-bold text-lg flex items-center space-x-2">
                    <AddUser theme="outline" size="20" fill="#333"/>
                    <span>添加用户</span>
                </h3>
                <form id={"building_add"} onSubmit={onSubmit} className="py-2 grid space-y-2">
                    <fieldset className="flex flex-col">
                        <legend className="flex items-center space-x-1 mb-1">
                            <User theme="outline" size="16" fill="#333"/>
                            <span>用户名</span>
                        </legend>
                        <input
                            type="text" className="input w-full validator" required/>
                        <p className="fieldset-label hidden validator-hint">用户名不能为空</p>
                    </fieldset>
                    <fieldset className="flex flex-col">
                        <legend className="flex items-center space-x-1 mb-1">
                            <UserPositioning theme="outline" size="16" fill="#333"/>
                            <span>角色</span>
                        </legend>
                        <input
                            type="text" className="input w-full validator" required/>
                        <p className="fieldset-label hidden validator-hint">角色不能为空</p>
                    </fieldset>
                    <fieldset className="flex flex-col">
                        <legend className="flex items-center space-x-1 mb-1">
                            <Key theme="outline" size="16" fill="#333"/>
                            <span>密码</span>
                        </legend>
                        <input
                            type="password" className="input w-full validator" required/>
                        <p className="fieldset-label hidden validator-hint">用户密码不能为空</p>
                    </fieldset>
                    <fieldset className="flex flex-col">
                        <legend className="flex items-center space-x-1 mb-1">
                            <Envelope theme="outline" size="16" fill="#333"/>
                            <span>邮箱</span>
                        </legend>
                        <input
                            type="email" className="input w-full validator" required/>
                        <p className="fieldset-label hidden validator-hint">邮箱不能为空</p>
                    </fieldset>
                    <fieldset className="flex flex-col">
                        <legend className="flex items-center space-x-1 mb-1">
                            <PhoneTelephone theme="outline" size="16" fill="#333"/>
                            <span>手机号</span>
                        </legend>
                        <input
                            type="tel" className="input w-full validator" required/>
                        <p className="fieldset-label hidden validator-hint">手机号不能为空</p>
                    </fieldset>
                    <fieldset>
                        <legend className="flex items-center space-x-1 mb-1">
                            <Permissions theme="outline" size="16" fill="#333"/>
                            <span>权限</span>
                        </legend>
                        <select defaultValue="Pick a color" className="select">
                            <option disabled={true}>Pick a color</option>
                            <option>Crimson</option>
                            <option>Amber</option>
                            <option>Velvet</option>
                        </select>
                    </fieldset>
                </form>
            </div>
        </Modal>
    );
}




/*
import {useState, useEffect, JSX} from "react";
import { Down, Envelope, Key, PhoneTelephone, User, UserPositioning } from "@icon-park/react";
import { AddUserAPI } from "../../apis/user_api.ts";
import {BuildingAddDTO} from "../../models/dto/building_add_dto.ts";

export function AdminAddUserDialog({show, emit}: Readonly<{
    show: boolean;
    emit: (data: boolean) => void;
}>): JSX.Element {
    // 表单数据状态
    const [formData, setFormData] = useState({
        role_uuid: "",
        name: "",
        password: "",
        email: "",
        phone: "",
        permission: "",
    });

    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 角色列表
    const roles = [
        { role_uuid: "33257a18893a46919fd255a730cb1508", name: "管理员", icon: <UserPositioning theme="outline" size="18" fill="#333" /> },
        { role_uuid: "4d58ff23ce494b5d83d2bcad9eed30d7", name: "教务", icon: <UserPositioning theme="outline" size="18" fill="#333" /> },
        { role_uuid: "60c4d7ce00af44f0a382aa73f64aa3c2", name: "老师", icon: <UserPositioning theme="outline" size="18" fill="#555" /> },
        { role_uuid: "e02425859d904c5bacde77401be48cc9", name: "学生", icon: <UserPositioning theme="outline" size="18" fill="#777" /> },
    ];

    // 初始化角色
    const [selectedRole, setSelectedRole] = useState(roles[0].role_uuid);

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            role_uuid: roles[0].role_uuid, // ✅ 确保 role_uuid 正确
        }));
    }, []);

    useEffect(() => {
        setIsModalOpen(show);
    }, [show]);

    useEffect(() => {
        emit(isModalOpen);
    }, [emit, isModalOpen]);

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleClose = () => {
        setData({} as BuildingAddDTO);
        setIsModalOpen(false);
    }


    // 处理输入框变化
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "permission") {
            setFormData({ ...formData, permission: value.split(",") }); // ✅ 逗号分隔，转为数组
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };


    // 处理角色选择
    const handleSelect = (role) => {
        setSelectedRole(role.role_uuid);
        setFormData((prev) => ({
            ...prev,
            role_uuid: role.role_uuid, // ✅ 直接更新 formData
        }));
    };

    // 关闭对话框的函数
    const handleCloseDialog = () => {
        document.getElementById("my_modal_1")?.close();
    };

    // 提交表单
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 🚀 打印最终的请求数据
        console.log("最终提交的表单数据:", JSON.stringify(formData, null, 2));

        setLoading(true);
        try {
            const response = await AddUserAPI(formData);
            console.log(response);
            if (response) {
                alert("用户添加成功");
                handleCloseDialog();
                onUserAdded();
            } else {
                alert("添加用户失败");
            }
        } catch (error) {
            console.error("添加用户失败:", error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <dialog id="my_modal_1" className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">添加用户</h3>
                <div className="mt-3">
                    <form onSubmit={handleSubmit} className="flex flex-col space-y-4 p-4">
                        <label className="input input-md flex items-center w-full">
                            <User theme="outline" size="18" fill="#333" />
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="用户名" className="grow" />
                        </label>

                        <label className="input input-md flex items-center w-full">
                            <Key theme="outline" size="18" fill="#333" />
                            <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="密码" className="grow" />
                        </label>

                        {/!* 角色选择下拉框 *!/}
                        <div className="dropdown w-full">
                            <label tabIndex={0} className="input input-md flex items-center justify-between w-full cursor-pointer border border-gray-300 rounded-md focus-within:border-blue-500">
                                <div className="flex items-center">
                                    {roles.find((r) => r.role_uuid === selectedRole)?.icon}
                                    <span className="ml-2">{roles.find((r) => r.role_uuid === selectedRole)?.name}</span>
                                </div>
                                <Down theme="outline" size="24" fill="#333" />
                            </label>

                            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-md w-full border border-gray-300">
                                {roles.map((role) => (
                                    <li key={role.role_uuid} onClick={() => handleSelect(role)}>
                                        <a className="flex items-center">
                                            {role.icon} <span className="ml-2">{role.name}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <label className="input input-md flex items-center w-full">
                            <Envelope theme="outline" size="18" fill="#333" />
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="邮箱" className="grow" />
                        </label>

                        <label className="input input-md flex items-center w-full">
                            <PhoneTelephone theme="outline" size="18" fill="#333" />
                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="手机号" className="grow" />
                        </label>
                        <label className="input input-md flex items-center w-full">
                            <PhoneTelephone theme="outline" size="18" fill="#333" />
                            <input type="text" name="permission" value={formData.permission} onChange={handleChange} required placeholder="权限" className="grow" />
                        </label>
                        <div className="flex justify-end gap-2 w-full">
                            <button type="submit" className="btn btn-neutral" disabled={loading}>
                                {loading ? "添加中..." : "添加"}
                            </button>
                            <button type="button" className="btn" onClick={handleCloseDialog} disabled={loading}>
                                取消
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </dialog>
    );
}
*/
