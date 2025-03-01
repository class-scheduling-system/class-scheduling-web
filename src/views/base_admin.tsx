import { JSX, useEffect } from "react";
import { useSelector } from "react-redux";
import { SiteInfoEntity } from "../models/entity/site_info_entity.ts";
import { AdminNavComponent } from "../components/admin/admin_nav_component.tsx";
import { Route, Routes, useLocation, useNavigate } from "react-router";
import { AdminDashboard } from "./admin/admin_dashboard.tsx";
import { AdminUser } from "./admin/admin_user.tsx";
import { AdminBuilding } from "./admin/admin_building.tsx";
import { animated, useTransition } from "@react-spring/web";
import { AdminRole } from "./admin/admin_role.tsx";
import { HomeTwo, Dashboard, User, UserPositioning, BuildingTwo, System } from "@icon-park/react";
import { AdminSystemInfo } from "./admin/admin_systemInfo.tsx";

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
        "/admin/system-info": { title: "系统信息", icon: <System theme="outline" size="16" /> },
    };

    // 根据当前路径获取对应的面包屑信息，如果没有匹配则默认显示首页
    const currentBreadcrumb = breadcrumbMap[location.pathname] || { title: "首页", icon: <HomeTwo theme="outline" size="16" fill="#333" /> };

    // 路由切换动画
    const transitions = useTransition(location, {
        from: { opacity: 0, transform: 'translateX(20px)' },
        enter: { opacity: 1, transform: 'translateX(0)' },
        config: { tension: 170, friction: 26 },
        key: location.pathname,
    });

    return (
        <div className="h-lvh flex">
            <div className="w-64 h-full bg-base-200 shadow-lg">
                <AdminNavComponent />
            </div>
            <div className={"w-full flex flex-col flex-1"}>
                <div className={"w-full bg-base-100 p-2 shadow flex justify-between"}>
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
                    <div className="avatar">
                        <div className="w-10 rounded-full">
                            <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                        </div>
                    </div>
                </div>
                <div className="p-6 flex-1 overflow-auto">
                    {transitions((style, item) => (
                        <animated.div style={style}>
                            <Routes location={item}>
                                <Route path="/dashboard" element={<AdminDashboard site={site} />} />
                                <Route path="/user" element={<AdminUser site={site} />} />
                                <Route path="/role" element={<AdminRole site={site} />} />
                                <Route path="/building" element={<AdminBuilding site={site} />} />
                                <Route path="/system-info" element={<AdminSystemInfo site={site} />} />
                            </Routes>
                        </animated.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
