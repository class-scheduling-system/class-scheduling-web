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

import * as React from "react";
import {JSX, useEffect, useState} from "react";
import {DoubleLeft, DoubleRight, Key, User} from "@icon-park/react";
import {SiteInfoEntity} from "../../models/entity/site_info_entity.ts";
import {AuthLoginAPI} from "../../apis/auth_api.ts";
import {AuthLoginDTO} from "../../models/dto/auth_login_dto.ts";
import {Link, useNavigate, useSearchParams} from "react-router";
import {message} from "antd";
import {useSelector} from "react-redux";
import cookie from "react-cookies";


/**
 * # 函数描述
 * > `AuthLogin` 函数用于渲染一个登录界面，用户可以通过该界面输入用户名和密码进行登录。
 *
 * @returns {JSX.Element} 返回一个包含登录表单的 JSX 元素。
 */
export function AuthLogin(): JSX.Element {
    const site = useSelector((state: { site: SiteInfoEntity }) => state.site);

    const navigate = useNavigate();
    const [params] = useSearchParams();

    const [formData, setFormData] = useState<AuthLoginDTO>({} as AuthLoginDTO);

    useEffect(() => {
        document.title = `登录 | ${site.title}`;
    }, [site.title]);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const getResp = await AuthLoginAPI(formData);
        if (getResp?.output === "Success") {
            if (getResp.data!.initialization) {
                message.success(`登录成功`);
                // 根据密码确认是否是老师还是学生
                if (getResp.data!.teacher) {
                    navigate("/auth/register/teacher/" + getResp.data!.teacher?.id);
                } else {
                    navigate("/auth/register/student/" + getResp.data!.student?.id);
                }
            } else {
                message.success(`你好 ${getResp.data!.user?.name}，欢迎回来！`);
                cookie.save("token", getResp.data!.token!.token, {
                    path: "/",
                    expires: new Date(new Date().getTime() + 3600000)
                });
                cookie.save("refresh_token", getResp.data!.token!.refresh_token, {
                    path: "/",
                    expires: new Date(new Date().getTime() + 86400000)
                });
                if (params.get("fallback") !== null && params.get("fallback") !== undefined && params.get("fallback") !== "") {
                    navigate(params.get("fallback")!);
                    return;
                }
                switch (getResp.data!.user?.role.role_name) {
                    case "管理员":
                        navigate("/admin/dashboard");
                        break;
                    case "教务":
                        navigate("/academic/dashboard");
                        break;
                    case "教师":
                        navigate("/teacher/dashboard");
                        break;
                    case "学生":
                        navigate("/student/dashboard");
                        break;
                    default:
                        navigate("/register");
                        break;
                }
            }
        } else {
            message.error(getResp?.error_message ?? "未知错误");
        }
    }

    return (
        <form onSubmit={handleSubmit}
              className="flex justify-center h-dvh items-center">
            <div className="card bg-base-100 shadow-md flex flex-col gap-3 w-9/10 md:w-3/5 p-6 items-center">
                <div className={"w-full flex flex-col space-y-0.5"}>
                    <span className="text-2xl text-gray-700 font-bold text-center">{site.title}</span>
                    <div className="text-xl text-gray-700 font-bold text-center flex justify-center items-center">
                        <DoubleRight theme="outline" size="20"/>
                        <span>登录</span>
                        <DoubleLeft theme="outline" size="20"/>
                    </div>
                </div>

                <div className="flex flex-col gap-4 w-4/5 items-center">
                    <div className={"w-full"}>
                        <label className="input input-md transition flex items-center w-full validator">
                            <User theme="outline" size="16"/>
                            <input type="text" required
                                   onChange={(e) => setFormData({...formData, user: e.target.value})}
                                   className="grow ps-1"
                                   placeholder="用户名/邮箱/手机号/学号/工号"/>
                        </label>
                    </div>
                    <div className={"w-full"}>
                        <label className="input input-md transition flex items-center w-full validator">
                            <Key theme="outline" size="16"/>
                            <input type="password" required
                                   onChange={(e) => setFormData({...formData, password: e.target.value})}
                                   className="grow ps-1" placeholder="密码"/>
                        </label>
                    </div>
                </div>
                <div className="w-full flex justify-center mt-2"> {/* 减少上边距 */}
                    <button className="btn btn-primary btn-md w-48">登录</button>
                </div>
                <div className="flex justify-end w-full pt-3">
                    <button type="button"
                            className="transition text-primary hover:text-primary-content">
                        新用户
                    </button>
                    <div className={"px-2"}>|</div>
                    <Link to={"/auth/forget-password"}
                          className="transition text-primary hover:text-primary-content">
                        忘记密码？
                    </Link>
                </div>
            </div>
        </form>
    );
}
