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

import { Book, Dashboard, Hexagonal, Schedule, School, User, Like, UserBusiness, TreasureChest } from "@icon-park/react";
import { JSX } from "react";
import { AcademicNavLinkComponent } from "./academic_nav_link_component.tsx";
import { useSelector } from "react-redux";
import { AcademicAffairsStore } from "@/models/store/academic_affairs_store.ts";
import { LabelComponent } from "../label_component.tsx";
/**
 * 生成教务管理导航组件。
 *
 * @return {JSX.Element} 返回一个包含教务管理导航链接的JSX元素，用于在教务管理界面中展示导航栏。
 */
export function AcademicNavComponent(): JSX.Element {
    const academicAffairs = useSelector((state: { academicAffairs: AcademicAffairsStore }) => state.academicAffairs);

    return (
        <div className={"flex flex-col overflow-hidden h-full"}>
            <div className={"px-4 py-8 text-center w-full"}>
                <h1 className={"text-2xl font-bold text-primary"}>教务管理系统</h1>
                <div className="divider divider-primary"></div>
                {academicAffairs.currentAcademicAffairs && (
                    <div className="mt-2 text-sm text-center flex flex-col items-center">
                        <LabelComponent type="secondary" style="badge-soft" text={
                            academicAffairs.departmentLoaded && academicAffairs.departmentInfo
                                ? academicAffairs.departmentInfo.department_name
                                : academicAffairs.currentAcademicAffairs.department
                        } />
                    </div>
                )}
            </div>
            <div className={"px-4 grid gap-2 overflow-y-auto h-full pb-6"}>
                <h2 className="text-xs font-semibold text-gray-500 uppercase pl-2 pt-3 mb-1">主要模块</h2>
                <AcademicNavLinkComponent title={"教务看板"} icon={<Dashboard theme="outline" size="16" />}
                    path={"/academic/dashboard"} />

                <h2 className="text-xs font-semibold text-gray-500 uppercase pl-2 pt-3 mb-1">排课管理</h2>
                <AcademicNavLinkComponent title={"排课管理"} icon={<Schedule theme="outline" size="16" />}
                    path={"/academic/schedule"} />
                <AcademicNavLinkComponent title={"排课冲突"} icon={<Schedule theme="outline" size="16" />}
                    path={"/academic/conflicts"} />

                
                <h2 className="text-xs font-semibold text-gray-500 uppercase pl-2 pt-3 mb-1">人员管理</h2>
                <AcademicNavLinkComponent title={"教师管理"} icon={<UserBusiness theme="outline" size="16" />}
                    path={"/academic/teacher"} />
                <AcademicNavLinkComponent title={"教师偏好"} icon={<Like theme="outline" size="16" />}
                    path={"/academic/teacher-preference"} />
                <AcademicNavLinkComponent title={"教师课程资格"} icon={<TreasureChest theme="outline" size="16" />}
                    path={"/academic/teacher-course-qualification"} />
                <AcademicNavLinkComponent title={"学生管理"} icon={<User theme="outline" size="16" />}
                    path={"/academic/student"} />

                <h2 className="text-xs font-semibold text-gray-500 uppercase pl-2 pt-3 mb-1">教务处理</h2>
                <AcademicNavLinkComponent title={"行政班管理"} icon={<School theme="outline" size="16" />}
                    path={"/academic/administrative-class"} />
                <AcademicNavLinkComponent title={"课程管理"} icon={<Book theme="outline" size="16" />}
                    path={"/academic/course"} />

                <h2 className="text-xs font-semibold text-gray-500 uppercase pl-2 pt-3 mb-1">考试管理</h2>
                <AcademicNavLinkComponent title={"考试管理"} icon={<Hexagonal theme="outline" size="16" />}
                    path={"/academic/exam"} />
            </div>
        </div>
    );
}
