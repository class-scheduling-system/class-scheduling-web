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

import {Book, Calendar, Dashboard, Hexagonal, People, Schedule, School} from "@icon-park/react";
import {JSX} from "react";
import {AcademicNavLinkComponent} from "./academic_nav_link_component.tsx";


/**
 * 生成教务管理导航组件。
 *
 * @return {JSX.Element} 返回一个包含教务管理导航链接的JSX元素，用于在教务管理界面中展示导航栏。
 */
export function AcademicNavComponent(): JSX.Element {

    return (
        <div className={"flex flex-col"}>
            <div className={"px-4 py-8 text-center w-full"}>
                <h1 className={"text-2xl font-bold text-primary"}>教务管理系统</h1>
                <div className="divider divider-primary"></div>
            </div>
            <div className={"px-4 grid gap-2"}>
                <h2 className="text-xs font-semibold text-gray-500 uppercase pl-2 mb-1">主要模块</h2>
                <AcademicNavLinkComponent title={"教务看板"} icon={<Dashboard theme="outline" size="16"/>}
                                       path={"/academic/dashboard"}/>
                <AcademicNavLinkComponent title={"班级管理"} icon={<School theme="outline" size="16"/>}
                                       path={"/academic/class"}/>
                <AcademicNavLinkComponent title={"课程管理"} icon={<Book theme="outline" size="16"/>}
                                       path={"/academic/course"}/>
                <AcademicNavLinkComponent title={"排课管理"} icon={<Schedule theme="outline" size="16"/>}
                                       path={"/academic/schedule"}/>
                <AcademicNavLinkComponent title={"教师管理"} icon={<People theme="outline" size="16"/>}
                                       path={"/academic/teacher"}/>

                <div className="divider my-2"></div>

                <h2 className="text-xs font-semibold text-gray-500 uppercase pl-2 mb-1">其他功能</h2>
                <AcademicNavLinkComponent title={"学生管理"} icon={<People theme="outline" size="16"/>}
                                       path={"/academic/student"}/>
                <AcademicNavLinkComponent title={"考试管理"} icon={<Hexagonal theme="outline" size="16"/>}
                                       path={"/academic/exam"}/>
                <AcademicNavLinkComponent title={"学期管理"} icon={<Calendar theme="outline" size="16"/>}
                                       path={"/academic/semester"}/>
            </div>
        </div>
    );
}
