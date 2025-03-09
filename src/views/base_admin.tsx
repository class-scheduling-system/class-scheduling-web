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

import {JSX, useEffect} from "react";
import {useSelector} from "react-redux";
import {SiteInfoEntity} from "../models/entity/site_info_entity.ts";
import {AdminNavComponent} from "../components/admin/admin_nav_component.tsx";
import {Route, Routes, useLocation, useNavigate} from "react-router";
import {AdminDashboard} from "./admin/admin_dashboard.tsx";
import {AdminUser} from "./admin/admin_user.tsx";
import {AdminBuilding} from "./admin/admin_building.tsx";
import {animated, useSpring, useTransition} from "@react-spring/web";
import {AdminNotFound} from "./404/medium_page_not_found.tsx";
import {Bookshelf, BuildingTwo, Dashboard, HomeTwo, System, User, UserPositioning} from "@icon-park/react";
import {AdminEducation} from "./admin/admin_education.tsx";


/**
 * 生成一个基础的控制台组件。
 * 该函数返回一个包含标题为"Base Console"的div元素。
 * @return {JSX.Element} 包含基础控制台标题的div元素
 */
export function BaseAdmin(): JSX.Element {
    const site = useSelector((state: { site: SiteInfoEntity }) => state.site);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.pathname === "/admin") {
            navigate("/admin/dashboard");
        }
    }, [location.pathname, navigate]);

    // 定义路由与面包屑标题及图标的映射关系
    const breadcrumbMap: Record<string, { title: string; icon: JSX.Element }> = {
        "/admin/dashboard": { title: "看板", icon: <Dashboard theme="outline" size="16" /> },
        "/admin/user": { title: "用户管理", icon: <User theme="outline" size="16" /> },
        "/admin/role": { title: "角色管理", icon: <UserPositioning theme="outline" size="16" /> },
        "/admin/building": { title: "教学楼管理", icon: <BuildingTwo theme="outline" size="16" /> },
        "/admin/education": {title: "教务管理", icon: <Bookshelf theme="outline" size="16"/>},
        "/admin/system-info": { title: "系统信息", icon: <System theme="outline" size="16" /> },
    };

    // 根据当前路径获取对应的面包屑信息，如果没有匹配则默认显示首页
    const currentBreadcrumb = breadcrumbMap[location.pathname] || { title: "首页", icon: <HomeTwo theme="outline" size="16" fill="#333" /> };

    // 设置路由切换动画
    const transitions = useTransition(location, {
        from: { opacity: 0, transform: 'translateX(20px)' },
        enter: { opacity: 1, transform: 'translateX(0)'},
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
        from: { opacity: 0, transform: 'translateX(-50px)' },
        config: { tension: 150, friction: 26 },
    });

    // 顶部菜单栏加载动画
    const topFade = useSpring({
        opacity: 1,
        transform: 'translateY(0)',
        from: { opacity: 0, transform: 'translateY(-50px)' },
        config: { tension: 150, friction: 26 },
    });

    // 底部加载动画
    const bottomFade = useSpring({
        opacity: 1,
        transform: 'translateY(0)',
        from: { opacity: 0, transform: 'translateY(50px)' },
        config: { tension: 150, friction: 26 },
    });

    return (
        <animated.div style={fade} className="h-lvh flex">
            <animated.div style={navFade} className="hidden sm:block sm:w-48 md:w-64 h-full bg-base-200 shadow-lg">
                <AdminNavComponent />
            </animated.div>
            <div className="w-full flex flex-col flex-1">
                <animated.div style={topFade} className="w-full bg-base-100 p-4 shadow flex justify-between z-50">
                    <div className="breadcrumbs text-sm">
                        <ul>
                            <li>
                                <a>
                                    <HomeTwo theme="outline" size="16" fill="#333" />
                                    首页
                                </a>
                            </li>
                            <li>
                                <a>
                                    {currentBreadcrumb.icon}
                                    {currentBreadcrumb.title}
                                </a>
                            </li>
                        </ul>
                    </div>
                </animated.div>
                <animated.div style={bottomFade} className="p-6 flex-1 overflow-auto flex">
                    {transitions((style, item) => (
                        <animated.div style={{...style, flex: 1}}>
                            <Routes location={item}>
                                <Route path="/dashboard" element={<AdminDashboard site={site} />} />
                                <Route path="/user" element={<AdminUser site={site} />} />
                                <Route path="/building" element={<AdminBuilding site={site} />} />
                                <Route path="/education" element={<AdminEducation site={site} />} />
                                <Route path="/*" element={<AdminNotFound/>} />
                            </Routes>
                        </animated.div>
                    ))}
                </animated.div>
            </div>
        </animated.div>
    );
}
