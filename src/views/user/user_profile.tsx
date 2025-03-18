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

import { JSX, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { UserInfoEntity } from "../../models/entity/user_info_entity.ts";
import { Calendar, Mail, BoyOne, IdCard, Key, People, Phone, School } from "@icon-park/react";
import { message } from "antd";
import { CardComponent } from "../../components/card_component.tsx";

/**
 * 用户个人信息页面组件
 * @return {JSX.Element} 用户个人信息页面
 */
export function UserProfile(): JSX.Element {
    const getUser = useSelector((state: { user: UserInfoEntity }) => state.user);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("basic");
    const [passwordForm, setPasswordForm] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    useEffect(() => {
        // 页面加载时的效果
        document.title = "个人信息";
    }, []);

    /**
     * 处理表单提交
     * @param event 表单提交事件
     */
    function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();
        setLoading(true);
        return new Promise<void>(async (resolve) => {
            try {
                const formData = new FormData(event.currentTarget);
                const values = {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    phone: formData.get('phone')
                };
                // [TODO] 调用API更新用户信息
                message.success("个人信息更新成功");
                resolve();
            } catch (error) {
                message.error("更新失败，请重试");
            } finally {
                setLoading(false);
            }
        });
    }

    /**
     * 处理密码修改
     * @param event 表单提交事件
     */
    function handlePasswordChange(event: React.FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            message.error("两次输入的密码不一致");
            return Promise.resolve();
        }
        setLoading(true);
        return new Promise<void>(async (resolve) => {
            try {
                // [TODO] 调用API更新密码
                message.success("密码修改成功");
                setPasswordForm({
                    oldPassword: "",
                    newPassword: "",
                    confirmPassword: ""
                });
                resolve();
            } catch (error) {
                message.error("密码修改失败，请重试");
            } finally {
                setLoading(false);
            }
        });
    }

    // 格式化时间戳为可读日期
    const formatDate = (timestamp?: number) => {
        if (!timestamp) return "未知";
        return new Date(timestamp).toLocaleDateString("zh-CN", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };

    // 格式化性别
    const formatGender = (gender?: number) => {
        if (gender === undefined) return "未设置";
        return gender === 1 ? "男" : "女";
    };

    return (
        <div className="p-6 animate-fadeIn">
            <div className="md:flex-row gap-4 grid grid-cols-12">
                {/* 左侧用户信息卡片 */}
                <CardComponent col={3} howScreenHide="md" padding={0}>
                    <div className="flex flex-col items-center">
                        <div className="bg-gradient-to-r from-primary to-secondary w-full p-4 flex items-center justify-center">
                            <div className="w-24 h-24 rounded-full bg-base-100 flex items-center justify-center text-primary">
                                <People theme="filled" size="64" />
                            </div>
                        </div>
                        <div className="items-center text-center pt-4 w-full">
                            <h2 className="text-xl font-bold">{getUser.user?.name ?? "未设置姓名"}</h2>
                            <p className="text-gray-500">{getUser.user?.role?.role_name ?? "普通用户"}</p>
                            <div className="divider my-2"></div>
                            <div className="w-full space-y-2 px-4 pb-4">
                                <div className="flex items-center">
                                    <Mail theme="outline" size="18" className="mr-2 text-primary" />
                                    <span className="text-sm">{getUser.user?.email ?? "未设置邮箱"}</span>
                                </div>
                                <div className="flex items-center">
                                    <Phone theme="outline" size="18" className="mr-2 text-primary" />
                                    <span className="text-sm">{getUser.user?.phone ?? "未设置手机号"}</span>
                                </div>
                                <div className="flex items-center">
                                    <Calendar theme="outline" size="18" className="mr-2 text-primary" />
                                    <span className="text-sm">注册于: {formatDate(getUser.user?.created_at)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardComponent>

                <div className="col-span-9">
                    {/* 学生或教师特定信息 */}
                    {(getUser.student ?? getUser.teacher) && (
                        <div className="card bg-base-100 shadow-md mt-4">
                            <div className="card-body">
                                <h3 className="card-title text-lg font-semibold flex items-center">
                                    <School theme="outline" size="20" className="mr-2 text-primary" />
                                    {getUser.student ? "学生信息" : "教师信息"}
                                </h3>
                                <div className="divider my-2"></div>
                                <div className="w-full space-y-2">
                                    {getUser.student && (
                                        <>
                                            <div className="flex items-center">
                                                <IdCard theme="outline" size="18" className="mr-2 text-primary" />
                                                <span className="text-sm">学号: {getUser.student.id ?? "未设置"}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <School theme="outline" size="18" className="mr-2 text-primary" />
                                                <span className="text-sm">学院: {getUser.student.department ?? "未设置"}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <School theme="outline" size="18" className="mr-2 text-primary" />
                                                <span className="text-sm">专业: {getUser.student.major ?? "未设置"}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <School theme="outline" size="18" className="mr-2 text-primary" />
                                                <span className="text-sm">班级: {getUser.student.clazz ?? "未设置"}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <BoyOne theme="outline" size="18" className="mr-2 text-primary" />
                                                <span className="text-sm">性别: {formatGender(getUser.student.gender)}</span>
                                            </div>
                                        </>
                                    )}
                                    {getUser.teacher && (
                                        <>
                                            <div className="flex items-center">
                                                <IdCard theme="outline" size="18" className="mr-2 text-primary" />
                                                <span className="text-sm">工号: {getUser.teacher.id ?? "未设置"}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <School theme="outline" size="18" className="mr-2 text-primary" />
                                                <span className="text-sm">职称: {getUser.teacher.job_title ?? "未设置"}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <BoyOne theme="outline" size="18" className="mr-2 text-primary" />
                                                <span className="text-sm">性别: {formatGender(getUser.teacher.sex)}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Mail theme="outline" size="18" className="mr-2 text-primary" />
                                                <span className="text-sm">邮箱: {getUser.teacher.email ?? "未设置"}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Phone theme="outline" size="18" className="mr-2 text-primary" />
                                                <span className="text-sm">电话: {getUser.teacher.phone ?? "未设置"}</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 右侧编辑区域 */}
                    <CardComponent col={8} howScreenFull="lg" padding={18}>
                        <div className="tabs tabs-bordered mb-4">
                            <button
                                className={`tab tab-bordered ${activeTab === "basic" ? "tab-active" : ""}`}
                                onClick={() => setActiveTab("basic")}
                            >
                                基本信息
                            </button>
                            <button
                                className={`tab tab-bordered ${activeTab === "security" ? "tab-active" : ""}`}
                                onClick={() => setActiveTab("security")}
                            >
                                安全设置
                            </button>
                        </div>

                        {activeTab === "basic" ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="form-control">
                                    <label className="label" htmlFor="avatar">
                                        <span className="label-text font-medium">头像</span>
                                    </label>
                                    <div className="flex items-center space-x-4">
                                        <div className="w-16 h-16 rounded-lg bg-primary flex items-center justify-center text-white">
                                            <People theme="filled" size="32" fill="#FFFFFF" />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="form-control">
                                        <label className="label" htmlFor="name" aria-label="姓名">
                                            <div className="flex space-x-0.5">
                                                <span className="label-text font-medium">姓名</span>
                                                <span className="text-error">*</span>
                                            </div>
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            defaultValue={getUser.user?.name}
                                            placeholder="请输入姓名"
                                            className="input input-bordered w-full"
                                            required
                                        />
                                    </div>

                                    <div className="form-control">
                                        <label className="label" htmlFor="email" aria-label="邮箱">
                                            <div className="flex space-x-0.5">
                                                <span className="label-text font-medium">邮箱</span>
                                                <span className="text-error">*</span>
                                            </div>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            defaultValue={getUser.user?.email}
                                            placeholder="请输入邮箱"
                                            className="input input-bordered w-full"
                                            required
                                        />
                                    </div>

                                    <div className="form-control">
                                        <label className="label" htmlFor="phone" aria-label="手机号">
                                            <div className="flex space-x-0.5">
                                                <span className="label-text font-medium">手机号</span>
                                                <span className="text-error">*</span>
                                            </div>
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            defaultValue={getUser.user?.phone}
                                            placeholder="请输入手机号"
                                            className="input input-bordered w-full"
                                        />
                                    </div>
                                </div>

                                <div className="form-control mt-6">
                                    <button
                                        type="submit"
                                        className={`btn btn-primary ${loading ? 'loading' : ''}`}
                                        disabled={loading}
                                    >
                                        保存修改
                                    </button>
                                </div>
                            </form>
                        ) : ""}

                        {activeTab === "security" ? (
                            <form onSubmit={handlePasswordChange} className="space-y-4">
                                <div className="form-control">
                                    <label className="label" htmlFor="oldPassword" aria-label="当前密码">
                                        <span className="label-text font-medium">当前密码</span>
                                    </label>
                                    <div className="relative">
                                        <Key theme="outline" size="18" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="password"
                                            value={passwordForm.oldPassword}
                                            onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                                            placeholder="请输入当前密码"
                                            className="input input-bordered w-full pl-10"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-control">
                                    <label className="label" htmlFor="newPassword" aria-label="新密码">
                                        <span className="label-text font-medium">新密码</span>
                                    </label>
                                    <div className="relative">
                                        <Key theme="outline" size="18" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="password"
                                            value={passwordForm.newPassword}
                                            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                            placeholder="请输入新密码"
                                            className="input input-bordered w-full pl-10"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-control">
                                    <label className="label" htmlFor="confirmPassword" aria-label="确认新密码">
                                        <span className="label-text font-medium">确认新密码</span>
                                    </label>
                                    <div className="relative">
                                        <Key theme="outline" size="18" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="password"
                                            value={passwordForm.confirmPassword}
                                            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                            placeholder="请再次输入新密码"
                                            className="input input-bordered w-full pl-10"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="alert alert-info shadow-sm mt-4">
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current flex-shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        <span>密码安全提示：建议使用包含大小写字母、数字和特殊符号的组合，长度不少于8位。</span>
                                    </div>
                                </div>

                                <div className="form-control mt-6">
                                    <button
                                        type="submit"
                                        className={`btn btn-primary ${loading ? 'loading' : ''}`}
                                        disabled={loading}
                                    >
                                        修改密码
                                    </button>
                                </div>
                            </form>
                        ) : ""}
                    </CardComponent>
                </div>
            </div>
        </div>
    );
}