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

import {Bookshelf, BuildingTwo, Dashboard, System, User, UserPositioning} from "@icon-park/react";
import {JSX} from "react";
import {AdminNavLinkComponent} from "./admin_nav_link_component.tsx";


/**
 * 生成管理员导航组件。
 *
 * @param {Readonly<{site: SiteInfoEntity}>} - 包含站点信息的对象，其中site属性为SiteInfoEntity类型，提供站点名称等信息。
 * @return {JSX.Element} 返回一个包含站点名称和基本导航链接的JSX元素，用于在管理员界面中展示导航栏。
 */
export function AdminNavComponent(): JSX.Element {

    return (
        <div className={"flex flex-col"}>
            <div className={"px-4 py-8 text-center w-full"}>
                <h1 className={"text-2xl font-bold"}>管理员面板</h1>
            </div>
            <div className={"px-4 grid gap-1"}>
                <AdminNavLinkComponent title={"看板"} icon={<Dashboard theme="outline" size="16"/>}
                                       path={"/admin/dashboard"}/>
                <AdminNavLinkComponent title={"用户管理"} icon={<User theme="outline" size="16"/>}
                                       path={"/admin/user"}/>
                <AdminNavLinkComponent title={"角色管理"} icon={<UserPositioning theme="outline" size="16"/>}
                                       path={"/admin/role"}/>
                <AdminNavLinkComponent title={"教学楼管理"} icon={<BuildingTwo theme="outline" size="16"/>}
                                       path={"/admin/building"}/>
                <AdminNavLinkComponent title={"教务管理"} icon={ <Bookshelf theme="outline" size="16"/>}
                                       path={"/admin/education"}/>
                <AdminNavLinkComponent title={"系统信息"} icon={<System theme="outline" size="16" />}
                                       path={"/admin/system-info"}/>
            </div>
        </div>
    );
}
