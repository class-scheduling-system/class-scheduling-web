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

import {JSX, useEffect} from "react";
import {useSelector} from "react-redux";
import {SiteInfoEntity} from "../models/entity/site_info_entity.ts";
import {Link, Route, Routes, useLocation, useNavigate} from "react-router";
import {animated, useSpring, useTransition} from "@react-spring/web";
import {AdminNotFound} from "./404/medium_page_not_found.tsx";
import {UserInfoEntity} from "../models/entity/user_info_entity.ts";
import {People} from "@icon-park/react";
import cookie from "react-cookies";
import {message} from "antd";
import {useBreadcrumbs} from "../hooks/use_breadcrumbs.tsx";
import {teacherRouteConfig} from "../models/config/teacher_route_config";
import {TeacherNavComponent} from "../components/teacher/teacher_nav_component.tsx";
import {TeacherDashboard} from "./teacher/teacher_dashboard.tsx";
import { AiChatComponent } from "@/components/ai/ai_chat_component.tsx";
import TeacherCourseSchedule from "./teacher/teacher_course_schedule.tsx";

/**
 * 生成一个教师控制台组件。
 * 该函数返回一个包含教师控制台的框架页面。
 * @return {JSX.Element} 包含教师控制台的完整框架页面
 */
export function BaseTeacher(): JSX.Element {
    const site = useSelector((state: { site: SiteInfoEntity }) => state.site);
    const getUser = useSelector((state: { user: UserInfoEntity }) => state.user);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (getUser.loading) {
            return;
        }

        // 检查用户是否已登录
        if (!getUser.user) {
            message.error("请先登录");
            navigate("/auth/login");
            return;
        }

        // 检查用户是否具有教师角色
        if (getUser.user.role.role_name !== "教师") {
            message.error("您没有教师权限");
            navigate("/");
            return;
        }

        // 重定向到仪表盘
        if (location.pathname === "/teacher") {
            navigate("/teacher/dashboard");
        }
    }, [location.pathname, navigate, getUser.user]);

    // 设置路由切换动画
    const transitions = useTransition(location, {
        from: {opacity: 0, transform: 'translateX(10px)'},
        enter: {opacity: 1, transform: 'translateX(0)'},
        config: {
            tension: 170,
            friction: 26,
        },
        key: location.pathname,
    });

    // 设置页面加载动画
    const fade = useSpring({
        opacity: 1,
        from: {opacity: 0},
        config: {tension: 120, friction: 26},
    });

    // 左侧菜单栏加载动画
    const navFade = useSpring({
        opacity: 1,
        transform: 'translateX(0)',
        from: {opacity: 0, transform: 'translateX(-30px)'},
        config: {tension: 150, friction: 26},
    });

    // 顶部菜单栏加载动画
    const topFade = useSpring({
        opacity: 1,
        transform: 'translateY(0)',
        from: {opacity: 0, transform: 'translateY(-30px)'},
        config: {tension: 150, friction: 26},
    });

    // 底部加载动画
    const bottomFade = useSpring({
        opacity: 1,
        transform: 'translateY(0)',
        from: {opacity: 0, transform: 'translateY(30px)'},
        config: {tension: 150, friction: 26},
    });

    // 用户登出
    async function userLogout() {
        cookie.remove("token", { path: '/' });
        cookie.remove("refresh_token", { path: '/' });
        message.success("已退出登录");
        navigate("/auth/login");
    }

    return (
        <animated.div style={fade} className="h-lvh flex bg-gradient-to-br from-primary-50 to-base-100">
            <animated.div style={navFade} className="hidden sm:block sm:w-48 md:w-64 2xl:w-72 h-full bg-base-100 border-r border-gray-200">
                <TeacherNavComponent/>
            </animated.div>
            <div className="w-full flex flex-col flex-1">
                <animated.div style={topFade} className="w-full bg-base-100 px-6 py-4 shadow-sm flex justify-between items-center z-10 bg-gradient-to-r from-base-100  to-primary/10">
                    <div className="breadcrumbs text-sm">
                        <ul>
                            {useBreadcrumbs("/teacher", teacherRouteConfig)}
                        </ul>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="dropdown dropdown-end">
                            <button type="button" className="flex items-center cursor-pointer">
                                <div className="hidden md:flex flex-col items-end mr-3">
                                    <span className="text-sm font-medium">{getUser.user?.name ?? "未登录用户"}</span>
                                    <span className="text-xs text-gray-500">{getUser.user?.email ?? "未登录"}</span>
                                </div>
                                <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white">
                                    <People theme="filled" size="20" fill="#FFFFFF" />
                                </div>
                            </button>
                            <ul className="dropdown-content z-[1] menu p-2 shadow-sm bg-base-100 border border-gray-200 rounded-md w-52 mt-2">
                                <li>
                                    <Link to={"/user/profile"}>个人信息</Link>
                                </li>
                                <li>
                                    <button onClick={userLogout} className="text-error">
                                        退出登录
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </animated.div>
                <animated.div style={bottomFade} className="pt-6 px-6 flex-1 overflow-auto overflow-y-scroll flex">
                    {transitions((style, item) => (
                        <animated.div style={{...style, flex: 1}}>
                            <Routes location={item}>
                                <Route path="/dashboard" element={<TeacherDashboard site={site}/>}/>
                                <Route path="/schedule" element={<TeacherCourseSchedule/>}/>
                                <Route path="/*" element={<AdminNotFound/>}/>
                            </Routes>
                        </animated.div>
                    ))}
                </animated.div>
            </div>
            {/* AI聊天组件 */}
            <AiChatComponent />
        </animated.div>
    );
} 