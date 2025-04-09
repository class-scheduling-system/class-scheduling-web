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

import { Link, NavLink } from "react-router";
import { useSelector } from "react-redux";
import { SiteInfoEntity } from "../../models/entity/site_info_entity";
import { Book, Calendar, ChartPie, DocumentFolder, ExternalTransmission, Message, Me } from "@icon-park/react";
import { JSX } from "react";

/**
 * 学生导航项组件
 * 
 * @param title 菜单标题
 * @param icon 菜单图标
 * @param path 链接路径
 * @returns 返回一个学生导航链接组件
 */
function StudentNavLinkComponent({ title, icon, path }: {
    title: string;
    icon: JSX.Element;
    path: string;
}): JSX.Element {
    return (
        <Link 
            to={path} 
            className={`btn btn-ghost btn-md rounded-lg text-base-content hover:bg-primary/10`}
        >
            <div className="flex items-center gap-2">
                {icon}
                <span>{title}</span>
            </div>
        </Link>
    );
}

/**
 * 学生导航组件
 * 该组件实现了学生端的顶部导航栏
 * 
 * @returns {JSX.Element} 返回学生导航栏组件
 */
export function StudentNavComponent(): JSX.Element {
    const site = useSelector((state: { site: SiteInfoEntity }) => state.site);

    return (
        <div className="navbar bg-base-100 shadow-md px-4 sticky top-0 z-30">
            <div className="navbar-start">
                <div className="hidden lg:flex">
                    <NavLink to="/student/dashboard" className="btn btn-ghost text-xl px-2">
                        <span className="font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            {site.name || "课程调度系统"}
                        </span>
                    </NavLink>
                </div>
                <div className="dropdown lg:hidden">
                    <div tabIndex={0} role="button" className="btn btn-ghost">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        <li><NavLink to="/student/dashboard">首页</NavLink></li>
                        <li><NavLink to="/student/schedule">我的课表</NavLink></li>
                        <li><NavLink to="/student/course">选课中心</NavLink></li>
                        <li><NavLink to="/student/exam">考试安排</NavLink></li>
                        <li><NavLink to="/student/grade">成绩查询</NavLink></li>
                        <li><NavLink to="/student/notification">通知公告</NavLink></li>
                        <li><NavLink to="/student/profile">个人信息</NavLink></li>
                    </ul>
                </div>
            </div>
            <div className="navbar-center hidden lg:flex gap-1">
                <StudentNavLinkComponent 
                    title="首页" 
                    icon={<ChartPie theme="outline" size="18" />} 
                    path="/student/dashboard" 
                />
                <StudentNavLinkComponent 
                    title="我的课表" 
                    icon={<Calendar theme="outline" size="18" />} 
                    path="/student/schedule" 
                />
                <StudentNavLinkComponent 
                    title="选课中心" 
                    icon={<Book theme="outline" size="18" />} 
                    path="/student/course" 
                />
                <StudentNavLinkComponent 
                    title="考试安排" 
                    icon={<ExternalTransmission theme="outline" size="18" />} 
                    path="/student/exam" 
                />
                <StudentNavLinkComponent 
                    title="成绩查询" 
                    icon={<DocumentFolder theme="outline" size="18" />} 
                    path="/student/grade" 
                />
                <StudentNavLinkComponent 
                    title="通知公告" 
                    icon={<Message theme="outline" size="18" />} 
                    path="/student/notification" 
                />
            </div>
            <div className="navbar-end">
                <StudentNavLinkComponent 
                    title="个人信息" 
                    icon={<Me theme="outline" size="18" />} 
                    path="/user/profile" 
                />
            </div>
        </div>
    );
} 