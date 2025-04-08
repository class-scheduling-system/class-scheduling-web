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
import {AdminNavComponent} from "../components/admin/admin_nav_component.tsx";
import {Link, Route, Routes, useLocation, useNavigate} from "react-router";
import {AdminDashboard} from "./admin/admin_dashboard.tsx";
import {AdminUser} from "./admin/user/user.tsx";
import {AdminBuilding} from "./admin/admin_building.tsx";
import {animated, useSpring, useTransition} from "@react-spring/web";
import {AdminNotFound} from "./404/medium_page_not_found.tsx";
import {UserInfoEntity} from "../models/entity/user_info_entity.ts";
import {People} from "@icon-park/react";
import {AdminRole} from "./admin/role/role.tsx";
import {AdminUserAddPage} from "./admin/user/user_add.tsx";
import {AdminEditUserPage} from "./admin/user/user_edit.tsx";
import {AdminDepartment} from "./admin/admin_department.tsx";
import cookie from "react-cookies";
import { useBreadcrumbs } from "../hooks/use_breadcrumbs.tsx";
import { adminRouteConfig } from "../models/config/admin_route_config.ts";
import { DepartmentAdd } from "./admin/department/department_add.tsx";
import { DepartmentEdit } from "./admin/department/department_edit.tsx";
import { AdminUnit } from "./admin/admin_unit.tsx";
import { AdminUnitCategoryAdd } from "./admin/unit/unit_category_add.tsx";
import { AdminUnitCategoryEdit } from "./admin/unit/unit_category_edit.tsx";
import { AdminUnitTypeAdd } from "./admin/unit/unit_type_add.tsx";
import { AdminUnitTypeEdit } from "./admin/unit/unit_type_edit.tsx";
import {message} from "antd";
import {AdminCampus} from "./admin/admin_campus.tsx";
import { CampusAdd } from "./admin/campus/campus_add.tsx";
import { CampusEdit } from "./admin/campus/campus_edit.tsx";
import { AdminSystemInfo } from "./admin/admin_system_info.tsx";
import { AdminSetting } from "./admin/admin_setting";
import { AdminJvmMonitor } from "./admin/admin_jvm_monitor";
import { AdminClassroomAddPage } from "./admin/classroom/classroom_add.tsx";
import { AdminClassroomEditPage } from "./admin/classroom/classroom_edit.tsx";
import { AdminClassroom } from "./admin/admin_classroom.tsx";
import { AdminSemester } from "./admin/admin_semester.tsx";
import { AdminGrade } from "./admin/admin_grade.tsx";

// 导入AI聊天组件
import {AiChatComponent} from "../components/ai/ai_chat_component.tsx";

/**
 * 生成一个管理员控制台组件。
 * 该函数返回一个包含管理员控制台的框架页面。
 * @return {JSX.Element} 包含管理员控制台的完整框架页面
 */
export function BaseAdmin(): JSX.Element {
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

        // 检查用户是否具有管理员角色
        if (getUser.user.role.role_name !== "管理员") {
            message.error("您没有管理员权限");
            navigate("/");
            return;
        }

        // 重定向到仪表盘
        if (location.pathname === "/admin") {
            navigate("/admin/dashboard");
        }
    }, [location.pathname, navigate, getUser.user]);

    // 设置路由切换动画
    const transitions = useTransition(location, {
        from: { opacity: 0, transform: 'translateX(10px)' },
        enter: { opacity: 1, transform: 'translateX(0)' },
        config: {
            tension: 170,
            friction: 26,
        },
        key: location.pathname,
    });

    // 设置页面加载动画
    const fade = useSpring({
        opacity: 1,
        from: { opacity: 0 },
        config: { tension: 120, friction: 26 },
    });

    // 左侧菜单栏加载动画
    const navFade = useSpring({
        opacity: 1,
        transform: 'translateX(0)',
        from: { opacity: 0, transform: 'translateX(-30px)' },
        config: { tension: 150, friction: 26 },
    });

    // 顶部菜单栏加载动画
    const topFade = useSpring({
        opacity: 1,
        transform: 'translateY(0)',
        from: { opacity: 0, transform: 'translateY(-30px)' },
        config: { tension: 150, friction: 26 },
    });

    // 底部加载动画
    const bottomFade = useSpring({
        opacity: 1,
        transform: 'translateY(0)',
        from: { opacity: 0, transform: 'translateY(30px)' },
        config: { tension: 150, friction: 26 },
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
                <AdminNavComponent />
            </animated.div>
            <div className="w-full flex flex-col flex-1">
                <animated.div style={topFade} className="w-full bg-gradient-to-r from-base-100 to-base-200/50 px-6 py-4 border-b border-gray-200 flex justify-between items-center z-10">
                    <div className="breadcrumbs text-sm">
                        <ul>
                            {useBreadcrumbs('/admin', adminRouteConfig)}
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
                        <animated.div style={{ ...style, flex: 1 }}>
                            <Routes location={item}>
                                <Route path="/dashboard" element={<AdminDashboard site={site} />} />
                                <Route path="/user" element={<AdminUser site={site} />} />
                                <Route path="/user/add" element={<AdminUserAddPage site={site} />}/>
                                <Route path="/user/edit/:userId" element={<AdminEditUserPage site={site} />}/>
                                <Route path="/role" element={<AdminRole site={site} />} />
                                <Route path="/building" element={<AdminBuilding site={site} />} />
                                <Route path="/department" element={<AdminDepartment site={site} />} />
                                <Route path="/department/add" element={<DepartmentAdd site={site} />} />
                                <Route path="/department/edit/:uuid" element={<DepartmentEdit site={site} />} />
                                <Route path="/unit" element={<AdminUnit site={site} />} />
                                <Route path="/unit/category/add" element={<AdminUnitCategoryAdd site={site} />} />
                                <Route path="/unit/category/edit/:uuid" element={<AdminUnitCategoryEdit site={site} />} />
                                <Route path="/unit/type/add" element={<AdminUnitTypeAdd site={site} />} />
                                <Route path="/unit/type/edit/:uuid" element={<AdminUnitTypeEdit site={site} />} />
                                <Route path="/campus" element={<AdminCampus site={site} />} />
                                <Route path="/campus/add" element={<CampusAdd site={site} />} />
                                <Route path="/campus/edit/:campusUuid" element={<CampusEdit site={site} />} />
                                <Route path="/classroom" element={<AdminClassroom site={site} />} />
                                <Route path="/classroom/add" element={<AdminClassroomAddPage site={site} />} />
                                <Route path="/classroom/edit/:classroomUuid" element={<AdminClassroomEditPage site={site} />} />
                                <Route path="/semester" element={<AdminSemester site={site} />} />
                                <Route path="/system-info" element={<AdminSystemInfo site={site} />} />
                                <Route path="/jvm-monitor" element={<AdminJvmMonitor site={site} />} />
                                <Route path="/setting" element={<AdminSetting site={site} />} />
                                <Route path="/grade" element={<AdminGrade site={site} />} />
                                <Route path="/*" element={<AdminNotFound />} />
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
