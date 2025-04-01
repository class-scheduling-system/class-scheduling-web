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

import {JSX} from "react";
import {useSelector} from "react-redux";
import {SiteInfoEntity} from "../../models/entity/site_info_entity.ts";
import {
    Calendar,
    Dashboard,
    School,
    Book,
    User,
    Like
} from "@icon-park/react";
import {TeacherNavLinkComponent} from "./teacher_nav_link_component.tsx";

/**
 * 生成一个教师导航组件。
 * 该函数返回一个包含教师导航菜单的组件。
 * @return {JSX.Element} 包含教师导航菜单的组件
 */
export function TeacherNavComponent(): JSX.Element {
    const site = useSelector((state: { site: SiteInfoEntity }) => state.site);

    return (
        <div className={"flex flex-col h-full bg-gradient-to-r from-base-200 to-base-100"}>
            <div className={"px-4 py-8 text-center w-full "}>
                <h1 className={"text-2xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent"}>
                    教师工作台
                </h1>
                <div className="h-0.5 mt-4 bg-gradient-to-r from-secondary to-primary rounded-full mx-8 opacity-50"></div>
            </div>
            <div className={"px-4 grid gap-2 py-4"}>
                <div className="relative">
                    <h2 className="text-xs font-semibold text-gray-500 uppercase pl-2 mb-2 flex items-center">
                        <span className="w-1 h-4 bg-secondary rounded-full mr-2"></span>
                        主要功能
                    </h2>
                </div>
                <TeacherNavLinkComponent title={"工作台"} icon={<Dashboard theme="outline" size="16"/>}
                                       path={"/teacher/dashboard"}/>
                <TeacherNavLinkComponent title={"课程表"} icon={<Calendar theme="outline" size="16"/>}
                                       path={"/teacher/schedule"}/>
                <TeacherNavLinkComponent title={"课程管理"} icon={<Book theme="outline" size="16"/>}
                                       path={"/teacher/course"}/>
                <TeacherNavLinkComponent title={"班级管理"} icon={<School theme="outline" size="16"/>}
                                       path={"/teacher/class"}/>
                <TeacherNavLinkComponent title={"教师课程偏好"} icon={<Like theme="outline" size="16"/>}
                                       path={"/teacher/teacher-preferences"}/>
                <div className="h-px my-4 bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

                <div className="relative">
                    <h2 className="text-xs font-semibold text-gray-500 uppercase pl-2 mb-2 flex items-center">
                        <span className="w-1 h-4 bg-primary rounded-full mr-2"></span>
                        个人中心
                    </h2>
                </div>
                <TeacherNavLinkComponent title={"个人信息"} icon={<User theme="outline" size="16"/>}
                                       path={"/teacher/profile"}/>
            </div>
            <div className="mt-auto p-6 border-t border-gray-200/50 bg-gradient-to-t from-base-200 to-transparent">
                <div className="text-xs text-gray-500 text-center">
                    <p className="font-medium">{site.name ?? "课程管理系统"}</p>
                    <p className="mt-1 text-[10px] opacity-75">由 锋楪技术团队 提供技术支持</p>
                </div>
            </div>
        </div>
    );
} 