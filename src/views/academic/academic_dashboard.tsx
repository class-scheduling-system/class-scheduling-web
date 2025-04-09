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
import { BuildingTwo, People, School, User, Book } from '@icon-park/react';
import { UserInfoEntity } from '../../models/entity/user_info_entity';
import { GetAcademicDashboardAPI } from '../../apis/statistics_api';
import { AcademicDashboardEntity } from '../../models/entity/academic_dashboard_entity';
import { Column } from '@ant-design/charts';

export function AcademicDashboard({ site }: Readonly<{
    site: SiteInfoEntity
}>) {
    const getUser = useSelector((state: { user: UserInfoEntity }) => state.user);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [summary, setSummary] = useState<AcademicDashboardEntity>({
        teacher_count: 0,
        student_count: 0,
        major_student_counts: [],
        administrative_class_count: 0,
        teaching_class_count: 0,
        course_library_count: 0
    });

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

    useEffect(() => {
        const fetchSummaryData = async () => {
            const resp = await GetAcademicDashboardAPI();
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

    // 图表配置
    const chartConfig = {
        data: summary.major_student_counts.map(item => ({
            major: item.major_name,
            count: item.count
        })),
        xField: 'major',
        yField: 'count',
        label: {
            position: 'middle',
            style: {
                fill: '#FFFFFF',
                opacity: 0.6,
            },
        },
        meta: {
            major: {
                alias: '专业名称',
            },
            count: {
                alias: '学生人数',
            },
        },
        color: '#8884d8',
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
                            {getUser.user?.email ? `${getUser.user.email} | ` : ''}欢迎使用教务管理系统
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

            {/* 统计卡片 - 第一行 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow border border-base-content/15">
                    <div className="card-body p-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-semibold">教师总数</h2>
                                <p className="text-3xl font-bold text-primary mt-2">{summary.teacher_count}</p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <People theme="outline" size="24" className="text-blue-500" />
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
                                <h2 className="text-xl font-semibold">课程库总数</h2>
                                <p className="text-3xl font-bold text-info mt-2">{summary.course_library_count}</p>
                            </div>
                            <div className="bg-sky-100 p-3 rounded-lg">
                                <Book theme="outline" size="24" className="text-sky-500" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 统计卡片 - 第二行 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow border border-base-content/15">
                    <div className="card-body p-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-semibold">行政班数量</h2>
                                <p className="text-3xl font-bold text-secondary mt-2">{summary.administrative_class_count}</p>
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
                                <h2 className="text-xl font-semibold">教学班总数</h2>
                                <p className="text-3xl font-bold text-accent mt-2">{summary.teaching_class_count}</p>
                            </div>
                            <div className="bg-purple-100 p-3 rounded-lg">
                                <BuildingTwo theme="outline" size="24" className="text-purple-500" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 专业学生人数统计图表 */}
            <div className="card card-md bg-base-100 shadow-md overflow-hidden border border-base-content/15">
                <div className="card-body">
                    <h2 className="card-title flex items-center gap-2">专业学生人数统计</h2>
                    <div className="h-80">
                        {summary.major_student_counts.length > 0 ? (
                            <Column {...chartConfig} />
                        ) : (
                            <div className="flex h-full items-center justify-center text-base-content/50">
                                暂无专业学生数据
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
