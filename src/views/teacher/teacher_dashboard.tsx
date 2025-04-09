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

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { SiteInfoEntity } from '../../models/entity/site_info_entity';
import { Book, Calendar, School, Time, User } from '@icon-park/react';
import { UserInfoEntity } from '../../models/entity/user_info_entity';
import { GetTeacherDashboardAPI } from '../../apis/statistics_api';
import { TeacherDashboardEntity } from '../../models/entity/teacher_dashboard_entity';
import { Pie, Column } from '@ant-design/charts';

export function TeacherDashboard({ site }: Readonly<{
    site: SiteInfoEntity
}>) {
    const getUser = useSelector((state: { user: UserInfoEntity }) => state.user);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [summary, setSummary] = useState<TeacherDashboardEntity>({
        course_count: 0,
        student_count: 0,
        class_count: 0,
        total_hours: 0,
        class_details: []
    });
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;
    const totalPages = Math.ceil(summary.class_details.length / pageSize);

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

    useEffect(() => {
        const fetchSummaryData = async () => {
            const resp = await GetTeacherDashboardAPI();
            if (resp?.data) {
                setSummary(resp.data);
            }
        };

        fetchSummaryData().then();
    }, []);

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

    // 分页处理
    const displayedClasses = summary.class_details.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    // 饼图配置 - 班级学生分布
    const pieConfig = {
        appendPadding: 10,
        data: summary.class_details.map((item) => ({
            type: item.teaching_class_name,
            value: item.student_count,
        })),
        angleField: 'value',
        colorField: 'type',
        radius: 0.8,
        label: {
            type: 'spider',
            labelHeight: 28,
            content: '{name}\n{percentage}',
        },
        interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
        legend: {
            position: 'bottom',
        },
    };

    // 柱状图配置 - 课时分布
    const columnConfig = {
        data: summary.class_details.map((item) => ({
            class: item.teaching_class_name.length > 10 
                ? item.teaching_class_name.substring(0, 10) + '...' 
                : item.teaching_class_name,
            full_name: item.teaching_class_name,
            hours: item.total_hours,
        })),
        xField: 'class',
        yField: 'hours',
        label: {
            position: 'top',
            style: {
                fontSize: 12,
            },
        },
        meta: {
            class: {
                alias: '班级',
            },
            hours: {
                alias: '课时',
            },
        },
        color: '#61DDAA',
        legend: {
            position: 'top-right',
        },
        tooltip: {
            formatter: (datum: { full_name: string; hours: number }) => {
                return { name: datum.full_name, value: datum.hours + ' 学时' };
            },
        },
        axis: {
            x: {
                label: {
                    autoRotate: true,
                    autoHide: false,
                    autoEllipsis: true,
                },
            },
        },
    };

    // 获取学时类型的显示名称
    const getHourTypeLabel = (type: string): string => {
        const typeMap: Record<string, string> = {
            '40a9da0c967b4d848d0c43e90c12d454': '上机学时',
            '76713360727f4000bc29961d77ea2d6': '实验学时',
            'b9e76f53434483ed265116366278e7': '实践学时',
            'c4d82184784444e0b4e4598cac9215c9': '其他学时',
            'c6e5ca87983142bca5c36b965c59781e': '理论学时',
        };
        return typeMap[type] || type;
    };

    // 获取学时类型的颜色
    const getHourTypeColor = (type: string): string => {
        const colorMap: Record<string, string> = {
            '40a9da0c967b4d848d0c43e90c12d454': 'badge-info',
            '76713360727f4000bc29961d77ea2d6': 'badge-warning',
            'b9e76f53434483ed265116366278e7': 'badge-success',
            'c4d82184784444e0b4e4598cac9215c9': 'badge-neutral',
            'c6e5ca87983142bca5c36b965c59781e': 'badge-primary',
        };
        return colorMap[type] || 'badge-secondary';
    };

    // 饼图配置 - 学时类型分布饼图
    const hourTypePieConfig = {
        appendPadding: 10,
        data: Object.entries(
            summary.class_details.reduce((acc, curr) => {
                acc[getHourTypeLabel(curr.credit_hour_type)] = (acc[getHourTypeLabel(curr.credit_hour_type)] || 0) + curr.total_hours;
                return acc;
            }, {} as Record<string, number>)
        ).map(([type, hours]) => ({
            type,
            value: hours,
        })),
        angleField: 'value',
        colorField: 'type',
        radius: 0.8,
        label: {
            type: 'outer',
            content: '{name}: {value}学时',
        },
        interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
        legend: {
            position: 'bottom',
        },
    };

    return (
        <div className="space-y-6 w-full">
            {/* 顶部欢迎信息和时间 */}
            <div className="bg-gradient-to-r from-primary/90 to-accent/90 rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 flex items-center justify-between">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-white">
                            {getGreeting()}，{getUser.user?.name ?? '老师'}
                        </h2>
                        <p className="text-white/80 text-sm">
                            {getUser.user?.email ? `${getUser.user.email} | ` : ''}欢迎使用教师工作台
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
                <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow border border-base-content/15">
                    <div className="card-body p-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-semibold">课程总数</h2>
                                <p className="text-3xl font-bold text-primary mt-2">{summary.course_count}</p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <Book theme="outline" size="24" className="text-blue-500" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow border border-base-content/15">
                    <div className="card-body p-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-semibold">学生总数</h2>
                                <p className="text-3xl font-bold text-warning mt-2">{summary.student_count}</p>
                            </div>
                            <div className="bg-yellow-100 p-3 rounded-lg">
                                <User theme="outline" size="24" className="text-yellow-500" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow border border-base-content/15">
                    <div className="card-body p-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-semibold">班级总数</h2>
                                <p className="text-3xl font-bold text-secondary mt-2">{summary.class_count}</p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-lg">
                                <School theme="outline" size="24" className="text-green-500" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow border border-base-content/15">
                    <div className="card-body p-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-semibold">总课时</h2>
                                <p className="text-3xl font-bold text-accent mt-2">{summary.total_hours}</p>
                            </div>
                            <div className="bg-purple-100 p-3 rounded-lg">
                                <Time theme="outline" size="24" className="text-purple-500" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 数据可视化 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 班级学生分布图 */}
                <div className="card bg-base-100 shadow-md overflow-hidden border border-base-content/15">
                    <div className="card-body">
                        <h2 className="card-title flex items-center gap-2">班级学生分布</h2>
                        <div className="h-80">
                            {summary.class_details.length > 0 ? (
                                <Pie {...pieConfig} />
                            ) : (
                                <div className="flex h-full items-center justify-center text-base-content/50">
                                    暂无班级学生数据
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 学时类型分布饼图 */}
                <div className="card bg-base-100 shadow-md overflow-hidden border border-base-content/15">
                    <div className="card-body">
                        <h2 className="card-title flex items-center gap-2">学时类型分布</h2>
                        <div className="h-80">
                            {summary.class_details.length > 0 ? (
                                <Pie {...hourTypePieConfig} />
                            ) : (
                                <div className="flex h-full items-center justify-center text-base-content/50">
                                    暂无学时类型数据
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* 班级课时分布和班级详情 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 班级课时分布图 */}
                <div className="card bg-base-100 shadow-md overflow-hidden border border-base-content/15">
                    <div className="card-body">
                        <h2 className="card-title flex items-center gap-2">班级课时分布</h2>
                        <div className="h-80">
                            {summary.class_details.length > 0 ? (
                                <Column {...columnConfig} />
                            ) : (
                                <div className="flex h-full items-center justify-center text-base-content/50">
                                    暂无班级课时数据
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 班级详情表格 - 占用2列 */}
                <div className="card bg-base-100 shadow-md overflow-hidden border border-base-content/15 md:col-span-2">
                    <div className="card-body">
                        <h2 className="card-title flex items-center gap-2">班级详情</h2>
                        <div className="overflow-x-auto overflow-hidden">
                            <table className="table table-zebra">
                                <thead>
                                    <tr>
                                        <th>班级名称</th>
                                        <th>课程名称</th>
                                        <th>学生数</th>
                                        <th>课时</th>
                                        <th>学时类型</th>
                                        <th>操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayedClasses.map(classDetail => (
                                        <tr key={classDetail.teaching_class_uuid} className="hover">
                                            <td className="font-medium">{classDetail.teaching_class_name}</td>
                                            <td>{classDetail.course_name}</td>
                                            <td>
                                                <div className="badge badge-primary badge-outline">
                                                    {classDetail.student_count} 人
                                                </div>
                                            </td>
                                            <td>
                                                <div className="badge badge-accent badge-outline">
                                                    {classDetail.total_hours} 学时
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`badge ${getHourTypeColor(classDetail.credit_hour_type)}`}>
                                                    {getHourTypeLabel(classDetail.credit_hour_type)}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="flex gap-1">
                                                    <button className="btn btn-xs btn-outline btn-info" title="查看详情">
                                                        详情
                                                    </button>
                                                    <button className="btn btn-xs btn-outline btn-success" title="查看课表">
                                                        <Calendar theme="outline" size="14" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {summary.class_details.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="text-center">暂无班级数据</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            
                            {/* 分页控件 */}
                            {summary.class_details.length > pageSize && (
                                <div className="flex justify-center mt-4">
                                    <div className="join">
                                        <button
                                            className="join-item btn btn-sm"
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                        >
                                            « 上一页
                                        </button>
                                        <button className="join-item btn btn-sm disabled:bg-base-200 disabled:text-base-content/50" disabled>
                                            第 {currentPage} / {totalPages} 页
                                        </button>
                                        <button
                                            className="join-item btn btn-sm"
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                        >
                                            下一页 »
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 