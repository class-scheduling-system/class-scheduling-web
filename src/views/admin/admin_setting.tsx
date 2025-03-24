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
 * 本软件是"按原样"提供的，没有任何形式的明示或暗示的保证，包括但不限于
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

import {JSX, useEffect, useState} from "react";
import { SiteInfoEntity } from "../../models/entity/site_info_entity.ts";

type AdminSettingProps = {
    site: SiteInfoEntity
}

export function AdminSetting({ site }: Readonly<AdminSettingProps>): JSX.Element {
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("general");

    useEffect(() => {
        document.title = `系统设置 | ${site.name}`;
        setLoading(false);
    }, [site]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">系统设置</h1>
                <button className="btn btn-primary">保存更改</button>
            </div>

            <div className="tabs tabs-boxed mb-6">
                <a
                    className={`tab ${activeTab === "general" ? "tab-active" : ""}`}
                    onClick={() => setActiveTab("general")}
                >
                    常规设置
                </a>
                <a
                    className={`tab ${activeTab === "security" ? "tab-active" : ""}`}
                    onClick={() => setActiveTab("security")}
                >
                    安全设置
                </a>
                <a
                    className={`tab ${activeTab === "notification" ? "tab-active" : ""}`}
                    onClick={() => setActiveTab("notification")}
                >
                    通知设置
                </a>
            </div>

            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    {activeTab === "general" && (
                        <div className="space-y-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">站点名称</span>
                                </label>
                                <input type="text" className="input input-bordered w-full max-w-xs"/>
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">站点描述</span>
                                </label>
                                <textarea className="textarea textarea-bordered h-24"></textarea>
                            </div>
                            <div className="form-control">
                                <label className="label cursor-pointer">
                                    <span className="label-text">维护模式</span>
                                    <input type="checkbox" className="toggle"/>
                                </label>
                            </div>
                        </div>
                    )}

                    {activeTab === "security" && (
                        <div className="space-y-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">密码最小长度</span>
                                </label>
                                <input type="number" className="input input-bordered w-full max-w-xs"/>
                            </div>
                            <div className="form-control">
                                <label className="label cursor-pointer">
                                    <span className="label-text">启用双因素认证</span>
                                    <input type="checkbox" className="toggle"/>
                                </label>
                            </div>
                            <div className="form-control">
                                <label className="label cursor-pointer">
                                    <span className="label-text">强制使用 HTTPS</span>
                                    <input type="checkbox" className="toggle"/>
                                </label>
                            </div>
                        </div>
                    )}

                    {activeTab === "notification" && (
                        <div className="space-y-4">
                            <div className="form-control">
                                <label className="label cursor-pointer">
                                    <span className="label-text">启用邮件通知</span>
                                    <input type="checkbox" className="toggle"/>
                                </label>
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">SMTP 服务器</span>
                                </label>
                                <input type="text" className="input input-bordered w-full max-w-xs"/>
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">SMTP 端口</span>
                                </label>
                                <input type="number" className="input input-bordered w-full max-w-xs"/>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 