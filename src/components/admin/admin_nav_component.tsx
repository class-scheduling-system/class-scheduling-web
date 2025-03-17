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

import {
    BranchOne,
    BuildingTwo,
    Dashboard,
    DatabaseAlert,
    Log, School,
    System,
    User,
    UserPositioning,
    WatchOne
} from "@icon-park/react";
import {JSX} from "react";
import {AdminNavLinkComponent} from "./admin_nav_link_component.tsx";


/**
 * 生成管理员导航组件。
 *
 * @return {JSX.Element} 返回一个包含站点名称和基本导航链接的JSX元素，用于在管理员界面中展示导航栏。
 */
export function AdminNavComponent(): JSX.Element {
    return (
        <div className={"flex flex-col h-full"}>
            <div className={"px-6 py-6 w-full bg-base-200 border-b border-gray-200"}>
                <h1 className={"text-2xl font-bold text-primary text-center"}>管理员控制台</h1>
            </div>
            <div className={"px-4 grid gap-2 overflow-y-auto pt-4"}>
                <h2 className="text-xs font-semibold text-gray-500 uppercase pl-2 mb-1">系统管理</h2>
                <AdminNavLinkComponent title={"系统看板"} icon={<Dashboard theme="outline" size="18"/>}
                                       match={"dashboard"}
                                       path={"/admin/dashboard"}/>
                <AdminNavLinkComponent title={"用户管理"} icon={<User theme="outline" size="18"/>}
                                       match={"user"}
                                       path={"/admin/user"}/>
                <AdminNavLinkComponent title={"角色管理"} icon={<UserPositioning theme="outline" size="18"/>}
                                       match={"role"}
                                       path={"/admin/role"}/>
                <AdminNavLinkComponent title={"教学楼管理"} icon={<BuildingTwo theme="outline" size="18"/>}
                                       match={"building"}
                                       path={"/admin/building"}/>
                <AdminNavLinkComponent title={"校区管理"} icon={<School theme="outline" size="18"/>}
                                       path={"/admin/campus"}
                                       match={"campus"}/>
                <AdminNavLinkComponent title={"部门管理"} icon={<BranchOne theme="outline" size="18"/>}
                                       match={"department"}
                                       path={"/admin/department"}/>

                <div className="divider my-2"></div>

                <h2 className="text-xs font-semibold text-gray-500 uppercase pl-2 mb-1">系统维护</h2>
                <AdminNavLinkComponent title={"系统信息"} icon={<System theme="outline" size="18" />}
                                       match={"system-info"}
                                       path={"/admin/system-info"}/>
                <AdminNavLinkComponent title={"系统日志"} icon={<Log theme="outline" size="18" />}
                                       match={"log"}
                                       path={"/admin/log"}/>
                <AdminNavLinkComponent title={"备份与恢复"} icon={<DatabaseAlert theme="outline" size="18" />}
                                       match={"backup"}
                                       path={"/admin/backup"}/>
                <AdminNavLinkComponent title={"系统设置"} icon={<WatchOne theme="outline" size="18" />}
                                       match={"setting"}
                                       path={"/admin/setting"}/>
            </div>
            <div className="px-4 py-4 mt-auto bg-base-200 border-t border-gray-200 text-center text-xs text-gray-500">
                <p>版本: v1.0.0</p>
                <p>© 2025 锋楪技术团队</p>
            </div>
        </div>
    );
}
