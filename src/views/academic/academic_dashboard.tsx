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

import {useEffect, useState} from "react";
import {SiteInfoEntity} from "../../models/entity/site_info_entity.ts";
import {Book, People, School, User} from "@icon-park/react";
import {useSelector} from 'react-redux';
import {UserInfoEntity} from '../../models/entity/user_info_entity.ts';

export function AcademicDashboard({site}: Readonly<{
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
        document.title = `教务看板 | ${site.name ?? "Frontleaves Technology"}`;
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
        studentCount: 1250,
        teacherCount: 68,
        classCount: 32,
        courseCount: 120,
        currentTerm: "2024-2025学年第二学期",
        upcomingExams: [
            { id: 1, name: "高等数学期中考试", date: "2025-04-15", participatingClasses: 8 },
            { id: 2, name: "英语四级模拟考试", date: "2025-04-20", participatingClasses: 12 },
            { id: 3, name: "C++程序设计期末考试", date: "2025-06-05", participatingClasses: 4 }
        ],
        recentSchedules: [
            { id: 1, courseName: "数据结构", teacher: "张教授", classroom: "主教1-301", time: "周一 08:00-09:40" },
            { id: 2, courseName: "线性代数", teacher: "王教授", classroom: "主教2-205", time: "周二 10:00-11:40" },
            { id: 3, courseName: "计算机网络", teacher: "李教授", classroom: "工科3-401", time: "周三 14:00-15:40" }
        ]
    };

    return (
        <div className="space-y-6 w-full">
            {/* 顶部欢迎信息和时间 */}
            <div className="bg-gradient-to-r from-primary/90 to-secondary/90 rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 flex items-center justify-between">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-white">
                            {getGreeting()}，{getUser.user?.name ?? '教务管理员'}
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
                                <h2 className="text-xl font-semibold">学生总数</h2>
                                <p className="text-3xl font-bold text-primary mt-2">{statistics.studentCount}</p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <User theme="outline" size="24" className="text-blue-500" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
                    <div className="card-body p-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-semibold">教师总数</h2>
                                <p className="text-3xl font-bold text-secondary mt-2">{statistics.teacherCount}</p>
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
                                <h2 className="text-xl font-semibold">班级总数</h2>
                                <p className="text-3xl font-bold text-accent mt-2">{statistics.classCount}</p>
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
                                <h2 className="text-xl font-semibold">课程总数</h2>
                                <p className="text-3xl font-bold text-info mt-2">{statistics.courseCount}</p>
                            </div>
                            <div className="bg-orange-100 p-3 rounded-lg">
                                <Book theme="outline" size="24" className="text-orange-500" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 即将到来的考试 */}
            <div className="card bg-base-100 shadow-md overflow-hidden">
                <div className="card-body">
                    <h2 className="card-title flex items-center gap-2">即将到来的考试</h2>
                    <div className="overflow-x-auto overflow-hidden">
                        <table className="table table-zebra">
                            <thead>
                                <tr>
                                    <th>考试名称</th>
                                    <th>考试日期</th>
                                    <th>参与班级数</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                {statistics.upcomingExams.map(exam => (
                                    <tr key={exam.id}>
                                        <td>{exam.name}</td>
                                        <td>{exam.date}</td>
                                        <td>{exam.participatingClasses}</td>
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

            {/* 最近课程安排 */}
            <div className="card bg-base-100 shadow-md overflow-hidden">
                <div className="card-body">
                    <h2 className="card-title flex items-center gap-2">最近课程安排</h2>
                    <div className="overflow-x-auto overflow-hidden">
                        <table className="table table-zebra">
                            <thead>
                                <tr>
                                    <th>课程名称</th>
                                    <th>授课教师</th>
                                    <th>教室</th>
                                    <th>时间</th>
                                </tr>
                            </thead>
                            <tbody>
                                {statistics.recentSchedules.map(schedule => (
                                    <tr key={schedule.id}>
                                        <td>{schedule.courseName}</td>
                                        <td>{schedule.teacher}</td>
                                        <td>{schedule.classroom}</td>
                                        <td>{schedule.time}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
