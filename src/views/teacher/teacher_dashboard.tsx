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

import {useEffect, useState} from "react";
import {SiteInfoEntity} from "../../models/entity/site_info_entity.ts";
import {Book, People, School, Time} from "@icon-park/react";
import {useSelector} from 'react-redux';
import {UserInfoEntity} from '../../models/entity/user_info_entity.ts';

export function TeacherDashboard({site}: Readonly<{
    site: SiteInfoEntity
}>) {
    const getUser = useSelector((state: { user: UserInfoEntity }) => state.user);
    const [currentTime, setCurrentTime] = useState(new Date());

    // 更新当前时间
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        document.title = `教师工作台 | ${site.name ?? "Frontleaves Technology"}`;
    }, [site.name]);

    // 根据时间获取问候语
    const getGreeting = () => {
        const hour = currentTime.getHours();
        if (hour < 6) return '深夜了，注意休息';
        if (hour < 9) return '早上好';
        if (hour < 12) return '上午好';
        if (hour < 14) return '中午好';
        if (hour < 18) return '下午好';
        return '晚上好';
    };

    // 模拟数据
    const statistics = {
        totalCourses: 5,
        totalStudents: 180,
        totalClasses: 4,
        totalHours: 16,
        currentTerm: "2024-2025学年第二学期",
        upcomingClasses: [
            { id: 1, courseName: "数据结构", className: "计算机2班", classroom: "主教1-301", time: "周一 08:00-09:40" },
            { id: 2, courseName: "Java程序设计", className: "软件1班", classroom: "主教2-205", time: "周二 10:00-11:40" },
            { id: 3, courseName: "计算机网络", className: "网络3班", classroom: "工科3-401", time: "周三 14:00-15:40" }
        ],
        recentNotifications: [
            { id: 1, title: "关于期中考试安排的通知", date: "2024-04-10", type: "考试" },
            { id: 2, title: "教师教学培训会议", date: "2024-04-15", type: "会议" },
            { id: 3, title: "教学质量评估反馈", date: "2024-04-20", type: "评估" }
        ]
    };

    return (
        <div className="space-y-6 w-full">
            {/* 顶部欢迎信息和时间 */}
            <div className="bg-gradient-to-r from-primary/90 to-secondary/90 rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 flex items-center justify-between">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-white">
                            {getGreeting()}，{getUser.user?.name ?? '老师'}
                        </h2>
                        <p className="text-white/80 text-sm">
                            {getUser.user?.email ? `${getUser.user.email} | ` : ''}当前学期：{statistics.currentTerm}
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-bold text-white">
                            {currentTime.toLocaleTimeString('zh-CN', {
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit'
                            })}
                        </div>
                        <div className="text-sm text-white/80">
                            {currentTime.toLocaleDateString('zh-CN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* 统计卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
                    <div className="card-body p-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-semibold">课程数</h2>
                                <p className="text-3xl font-bold text-primary mt-2">{statistics.totalCourses}</p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <Book theme="outline" size="24" className="text-blue-500" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
                    <div className="card-body p-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-semibold">学生数</h2>
                                <p className="text-3xl font-bold text-secondary mt-2">{statistics.totalStudents}</p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-lg">
                                <People theme="outline" size="24" className="text-green-500" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
                    <div className="card-body p-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-semibold">班级数</h2>
                                <p className="text-3xl font-bold text-accent mt-2">{statistics.totalClasses}</p>
                            </div>
                            <div className="bg-purple-100 p-3 rounded-lg">
                                <School theme="outline" size="24" className="text-purple-500" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
                    <div className="card-body p-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-semibold">课时数</h2>
                                <p className="text-3xl font-bold text-info mt-2">{statistics.totalHours}</p>
                            </div>
                            <div className="bg-orange-100 p-3 rounded-lg">
                                <Time theme="outline" size="24" className="text-orange-500" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 近期课程 */}
                <div className="card bg-base-100 shadow-md overflow-hidden">
                    <div className="card-body">
                        <h2 className="card-title flex items-center gap-2">近期课程</h2>
                        <div className="overflow-x-auto">
                            <table className="table table-zebra">
                                <thead>
                                    <tr>
                                        <th>课程名称</th>
                                        <th>班级</th>
                                        <th>教室</th>
                                        <th>时间</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {statistics.upcomingClasses.map(course => (
                                        <tr key={course.id}>
                                            <td>{course.courseName}</td>
                                            <td>{course.className}</td>
                                            <td>{course.classroom}</td>
                                            <td>{course.time}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* 最新通知 */}
                <div className="card bg-base-100 shadow-md overflow-hidden">
                    <div className="card-body">
                        <h2 className="card-title flex items-center gap-2">最新通知</h2>
                        <div className="overflow-x-auto">
                            <table className="table table-zebra">
                                <thead>
                                    <tr>
                                        <th>通知标题</th>
                                        <th>类型</th>
                                        <th>日期</th>
                                        <th>操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {statistics.recentNotifications.map(notification => (
                                        <tr key={notification.id}>
                                            <td>{notification.title}</td>
                                            <td>
                                                <span className="badge badge-ghost">{notification.type}</span>
                                            </td>
                                            <td>{notification.date}</td>
                                            <td>
                                                <button className="btn btn-xs btn-primary">查看详情</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 