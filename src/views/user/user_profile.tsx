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
import { Calendar, Mail, BoyOne, IdCard, Key, People, Phone, School, User } from "@icon-park/react";
import { message } from "antd";
import { CardComponent } from "../../components/card_component.tsx";
import { SiteInfoEntity } from "../../models/entity/site_info_entity.ts";

interface UserProfileProps {
    site: SiteInfoEntity;
}

/**
 * 用户个人信息页面组件
 * @return {JSX.Element} 用户个人信息页面
 */
export function UserProfile({ site }: Readonly<UserProfileProps>): JSX.Element {
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
        document.title = `个人信息 | ${site.name}`;
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
        <div className="p-4 animate-fadeIn relative">
            {/* 移除欢迎提示动画 */}

            {/* 页面标题 */}
            <div className="mb-4 bg-gradient-to-r from-primary/10 to-secondary/10 p-4 rounded-xl shadow-sm">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary flex items-center">
                    <div className="bg-primary/20 p-2 rounded-full mr-4">
                        <People theme="outline" size="32" className="text-primary" />
                    </div>
                    个人中心
                </h1>
                <p className="text-gray-600 mt-4 ml-16 italic">查看和管理您的个人信息</p>
                <div className="h-1.5 w-32 bg-gradient-to-r from-primary to-secondary rounded-full mt-4 ml-16 shadow-sm"></div>
            </div>

            <div className="md:flex-row gap-4 grid grid-cols-12">
                {/* 左侧用户信息卡片 */}
                <CardComponent col={3} howScreenHide="md" padding={0}>
                    <div className="flex flex-col items-center">
                        <div className="bg-gradient-to-r from-primary to-secondary w-full p-4 flex items-center justify-center rounded-t-lg relative overflow-hidden">
                            <div className="absolute inset-0 bg-white/10 opacity-20">
                                <div className="absolute -inset-40 bg-white/10 rotate-45 transform -translate-x-20 -translate-y-20 w-40 h-80"></div>
                            </div>
                            <div className="w-28 h-28 rounded-full bg-base-100 flex items-center justify-center text-primary shadow-lg border-4 border-white/30 transform transition-all duration-500 hover:scale-105">
                                <People theme="filled" size="64" />
                            </div>
                        </div>
                        <div className="items-center text-center pt-4 w-full">
                            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">{getUser.user?.name ?? "未设置姓名"}</h2>
                            <div className="mt-4 inline-block px-4 py-1 bg-primary/10 rounded-full text-primary text-sm font-medium">
                                {getUser.user?.role?.role_name ?? "普通用户"}
                            </div>
                            <div className="divider my-2"></div>
                            <div className="w-full space-y-1 px-4 pb-4">
                                <div className="flex items-center hover:bg-primary/5 rounded-lg transition-colors duration-300">
                                    <div className="bg-blue-100 p-2 rounded-full mr-4">
                                        <Mail theme="outline" size="18" className="text-blue-500" />
                                    </div>
                                    <span className="text-sm">{getUser.user?.email ?? "未设置邮箱"}</span>
                                </div>
                                <div className="flex items-center hover:bg-primary/5 rounded-lg transition-colors duration-300">
                                    <div className="bg-green-100 p-2 rounded-full mr-4">
                                        <Phone theme="outline" size="18" className="text-green-500" />
                                    </div>
                                    <span className="text-sm">{getUser.user?.phone ?? "未设置手机号"}</span>
                                </div>
                                <div className="flex items-center hover:bg-primary/5 rounded-lg transition-colors duration-300">
                                    <div className="bg-purple-100 p-2 rounded-full mr-4">
                                        <Calendar theme="outline" size="18" className="text-purple-500" />
                                    </div>
                                    <span className="text-sm">注册于: {formatDate(getUser.user?.created_at)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardComponent>

                <div className="col-span-9">
                    {/* 学生或教师特定信息 */}
                    {(getUser.student ?? getUser.teacher) && (
                        <div className="card bg-base-100 shadow-md hover:shadow-xl transition-all duration-500 mt-4 border border-base-200 rounded-xl overflow-hidden transform hover:-translate-y-1">
                            <div className="card-body relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 z-0"></div>
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary/5 rounded-full -ml-12 -mb-12 z-0"></div>
                                <h3 className="card-title text-lg font-semibold flex items-center z-10">
                                    <div className="bg-blue-100 p-2 rounded-full mr-4">
                                        <School theme="outline" size="20" className="text-blue-500" />
                                    </div>
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                                        {getUser.student ? "学生信息" : "教师信息"}
                                    </span>
                                </h3>
                                <div className="divider my-4 before:bg-primary/20 after:bg-primary/20"></div>
                                <div className="w-full space-y-4 z-10">
                                    {getUser.student && (
                                        <>
                                            <div className="flex items-center p-2 hover:bg-primary/5 rounded-lg transition-colors duration-300">
                                                <div className="bg-amber-100 p-2 rounded-full mr-3">
                                                    <IdCard theme="outline" size="18" className="text-amber-500" />
                                                </div>
                                                <span className="text-sm font-medium">学号: <span className="text-gray-600">{getUser.student.id ?? "未设置"}</span></span>
                                            </div>
                                            <div className="flex items-center p-2 hover:bg-primary/5 rounded-lg transition-colors duration-300">
                                                <div className="bg-indigo-100 p-2 rounded-full mr-3">
                                                    <School theme="outline" size="18" className="text-indigo-500" />
                                                </div>
                                                <span className="text-sm font-medium">学院: <span className="text-gray-600">{getUser.student.department ?? "未设置"}</span></span>
                                            </div>
                                            <div className="flex items-center p-2 hover:bg-primary/5 rounded-lg transition-colors duration-300">
                                                <div className="bg-teal-100 p-2 rounded-full mr-3">
                                                    <School theme="outline" size="18" className="text-teal-500" />
                                                </div>
                                                <span className="text-sm font-medium">专业: <span className="text-gray-600">{getUser.student.major ?? "未设置"}</span></span>
                                            </div>
                                            <div className="flex items-center p-2 hover:bg-primary/5 rounded-lg transition-colors duration-300">
                                                <div className="bg-cyan-100 p-2 rounded-full mr-3">
                                                    <School theme="outline" size="18" className="text-cyan-500" />
                                                </div>
                                                <span className="text-sm font-medium">班级: <span className="text-gray-600">{getUser.student.clazz ?? "未设置"}</span></span>
                                            </div>
                                            <div className="flex items-center p-2 hover:bg-primary/5 rounded-lg transition-colors duration-300">
                                                <div className="bg-pink-100 p-2 rounded-full mr-3">
                                                    <BoyOne theme="outline" size="18" className="text-pink-500" />
                                                </div>
                                                <span className="text-sm font-medium">性别: <span className="text-gray-600">{formatGender(getUser.student.gender)}</span></span>
                                            </div>
                                        </>
                                    )}
                                    {getUser.teacher && (
                                        <>
                                            <div className="flex items-center p-2 hover:bg-primary/5 rounded-lg transition-colors duration-300">
                                                <div className="bg-amber-100 p-2 rounded-full mr-3">
                                                    <IdCard theme="outline" size="18" className="text-amber-500" />
                                                </div>
                                                <span className="text-sm font-medium">工号: <span className="text-gray-600">{getUser.teacher.id ?? "未设置"}</span></span>
                                            </div>
                                            <div className="flex items-center p-2 hover:bg-primary/5 rounded-lg transition-colors duration-300">
                                                <div className="bg-indigo-100 p-2 rounded-full mr-3">
                                                    <School theme="outline" size="18" className="text-indigo-500" />
                                                </div>
                                                <span className="text-sm font-medium">职称: <span className="text-gray-600">{getUser.teacher.job_title ?? "未设置"}</span></span>
                                            </div>
                                            <div className="flex items-center p-2 hover:bg-primary/5 rounded-lg transition-colors duration-300">
                                                <div className="bg-pink-100 p-2 rounded-full mr-3">
                                                    <BoyOne theme="outline" size="18" className="text-pink-500" />
                                                </div>
                                                <span className="text-sm font-medium">性别: <span className="text-gray-600">{formatGender(getUser.teacher.sex)}</span></span>
                                            </div>
                                            <div className="flex items-center p-2 hover:bg-primary/5 rounded-lg transition-colors duration-300">
                                                <div className="bg-blue-100 p-2 rounded-full mr-3">
                                                    <Mail theme="outline" size="18" className="text-blue-500" />
                                                </div>
                                                <span className="text-sm font-medium">邮箱: <span className="text-gray-600">{getUser.teacher.email ?? "未设置"}</span></span>
                                            </div>
                                            <div className="flex items-center p-2 hover:bg-primary/5 rounded-lg transition-colors duration-300">
                                                <div className="bg-green-100 p-2 rounded-full mr-3">
                                                    <Phone theme="outline" size="18" className="text-green-500" />
                                                </div>
                                                <span className="text-sm font-medium">电话: <span className="text-gray-600">{getUser.teacher.phone ?? "未设置"}</span></span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                    {/* 右侧编辑区域 */}
                    <CardComponent col={8} howScreenFull="lg" padding={16}>
                        <div className="relative mb-4 z-10">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -mr-20 -mt-20 z-0"></div>
                            <div className="tabs tabs-bordered relative z-10">
                                <button
                                    id="tab-basic"
                                    className={`tab tab-bordered ${activeTab === "basic" ? "tab-active font-medium text-primary" : "hover:text-primary/70 transition-colors"}`}
                                    onClick={() => setActiveTab("basic")}
                                >
                                    <div className="flex items-center space-x-4">
                                        <User theme="outline" size="18" />
                                        <span>基本信息</span>
                                    </div>
                                </button>
                                <button
                                    id="tab-security"
                                    className={`tab tab-bordered ${activeTab === "security" ? "tab-active font-medium text-primary" : "hover:text-primary/70 transition-colors"}`}
                                    onClick={() => setActiveTab("security")}
                                >
                                    <div className="flex items-center space-x-4">
                                        <Key theme="outline" size="18" />
                                        <span>安全设置</span>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {activeTab === "basic" ? (
                            <form onSubmit={handleSubmit} className="space-y-6 relative">
                                <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/5 rounded-full -ml-16 -mb-16 z-0"></div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 z-10">
                                    <div className="form-control group">
                                        <label className="label" htmlFor="name" aria-label="姓名">
                                            <div className="flex space-x-0.5">
                                                <span className="label-text font-medium group-hover:text-primary transition-colors">姓名</span>
                                                <span className="text-error">*</span>
                                            </div>
                                        </label>
                                        <div className="relative">
                                            <User theme="outline" size="18" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-primary transition-colors" />
                                            <input
                                                type="text"
                                                name="name"
                                                defaultValue={getUser.user?.name}
                                                placeholder="请输入姓名"
                                                className="input input-bordered w-full pl-10 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="form-control group">
                                        <label className="label" htmlFor="email" aria-label="邮箱">
                                            <div className="flex space-x-0.5">
                                                <span className="label-text font-medium group-hover:text-primary transition-colors">邮箱</span>
                                                <span className="text-error">*</span>
                                            </div>
                                        </label>
                                        <div className="relative">
                                            <Mail theme="outline" size="18" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-primary transition-colors" />
                                            <input
                                                type="email"
                                                name="email"
                                                defaultValue={getUser.user?.email}
                                                placeholder="请输入邮箱"
                                                className="input input-bordered w-full pl-10 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="form-control group">
                                        <label className="label" htmlFor="phone" aria-label="手机号">
                                            <div className="flex space-x-0.5">
                                                <span className="label-text font-medium group-hover:text-primary transition-colors">手机号</span>
                                                <span className="text-error">*</span>
                                            </div>
                                        </label>
                                        <div className="relative">
                                            <Phone theme="outline" size="18" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-primary transition-colors" />
                                            <input
                                                type="tel"
                                                name="phone"
                                                defaultValue={getUser.user?.phone}
                                                placeholder="请输入手机号"
                                                className="input input-bordered w-full pl-10 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-control mt-8 z-10">
                                    <button
                                        type="submit"
                                        className={`btn ${loading ? 'loading' : ''} bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white border-none shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}
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
                                        className={`btn btn-primary ${loading ? 'loading' : ''} hover:btn-secondary transition-colors duration-300 shadow-md hover:shadow-lg`}
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
            {/* 添加版权信息 */}
            <CopyrightFooter site={site} />
        </div>
    );
}

// 版权信息组件
const CopyrightFooter = ({ site }: Readonly<{ site: SiteInfoEntity }>) => {
    const currentYear = new Date().getFullYear();

    return (
        <div className="mt-8 text-center text-xs text-gray-500">
            <p>{site?.copyright_status ?? `Copyright @copy; 2022-${currentYear} Frontleaves Technology`}</p>
            <p>本软件遵循 {site?.open_source_license ?? "MIT"} 开源许可证协议</p>
        </div>
    );
};