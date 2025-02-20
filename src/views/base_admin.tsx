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

    return (
        <div className={"h-lvh flex"}>
            <div className={"w-64 h-full bg-base-200 shadow-lg"}>
                <AdminNavComponent/>
            </div>
            <div className={"w-full flex flex-col flex-1"}>
                <div className={"w-full bg-base-100 p-4 shadow flex justify-between"}>
                    <div>面包屑导航</div>
                    <div>用户信息</div>
                </div>
                <div className={"p-6 flex-1 overflow-auto"}>
                    <Routes>
                        <Route path={"/dashboard"} element={<AdminDashboard site={site}/>}/>
                        <Route path={"/user"} element={<AdminUser site={site}/>}/>
                    </Routes>
                </div>
            </div>
        </div>
    );
}
