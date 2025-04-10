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

import {useEffect, useState} from 'react';
import {SiteInfoEntity} from '../../models/entity/site_info_entity';
import {BuildingTwo, People, School, User} from "@icon-park/react";
import {UserInfoEntity} from "../../models/entity/user_info_entity.ts";
import {useSelector} from "react-redux";
import {GetAdminDashboardAPI} from "../../apis/statistics_api.ts";
import {AdminDashboardEntity} from "../../models/entity/admin_dashboard_entity.ts";

export function AdminDashboard({ site }: Readonly<{
    site: SiteInfoEntity
}>) {
    const getUser = useSelector((state: { user: UserInfoEntity }) => state.user);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [summary, setSummary] = useState<AdminDashboardEntity>({
        user_count: 0,
        building_count: 0,
        teacher_count: 0,
        student_count: 0,
        campus_count: 0,
        request_logs: []
    });
    const [requestLogCurrentPage, setRequestLogCurrentPage] = useState(1);
    const requestLogPageSize = 20;

    // 更新当前时间
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        document.title = `管理看板 | ${site.name ?? "Frontleaves Technology"}`;
    }, [site.name]);

    useEffect(() => {
        const fetchSummaryData = async () => {
            try {
                const resp = await GetAdminDashboardAPI();
                if (resp?.data) {
                    // 确保 request_log_list 始终是数组
                    const data = {
                        ...resp.data,
                        request_log_list: resp.data.request_logs || []
                    };
                    setSummary(data);
                }
            } catch (error) {
                console.error("获取管理员仪表盘数据失败", error);
                // 在发生错误时设置默认值
                setSummary({
                    user_count: 0,
                    building_count: 0,
                    teacher_count: 0,
                    student_count: 0,
                    campus_count: 0,
                    request_logs: []
                });
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

    // 格式化时间戳
    const formatTimestamp = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    return (
        <div className="space-y-6 w-full">
            {/* 顶部欢迎信息和时间 */}
            <div className="bg-gradient-to-r from-primary/90 to-secondary/90 rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 flex items-center justify-between">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-white">
                            {getGreeting()}，{getUser.user?.name ?? '管理员'}
                        </h2>
                        <p className="text-white/80 text-sm">
                            {getUser.user?.email ? `${getUser.user.email} | ` : ''}祝你今天工作顺利，系统运行状态良好
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow border border-base-content/15">
                    <div className="card-body p-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-semibold">用户总数</h2>
                                <p className="text-3xl font-bold text-primary mt-2">{summary.user_count}</p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <User theme="outline" size="24" className="text-blue-500" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow border border-base-content/15">
                    <div className="card-body p-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-semibold">建筑总数</h2>
                                <p className="text-3xl font-bold text-accent mt-2">{summary.building_count}</p>
                            </div>
                            <div className="bg-purple-100 p-3 rounded-lg">
                                <BuildingTwo theme="outline" size="24" className="text-purple-500" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow border border-base-content/15">
                    <div className="card-body p-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-semibold">校区总数</h2>
                                <p className="text-3xl font-bold text-info mt-2">{summary.campus_count}</p>
                            </div>
                            <div className="bg-orange-100 p-3 rounded-lg">
                                <School theme="outline" size="24" className="text-orange-500" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 学生和教师卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow border border-base-content/15">
                    <div className="card-body p-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-semibold">教师总数</h2>
                                <p className="text-3xl font-bold text-secondary mt-2">{summary.teacher_count}</p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-lg">
                                <People theme="outline" size="24" className="text-green-500" />
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
                                <People theme="outline" size="24" className="text-yellow-500" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 请求日志 */}
            <div className="card card-md bg-base-100 shadow-md overflow-hidden border border-base-content/15">
                <div className="card-body">
                    <h2 className="card-title flex items-center gap-2">请求日志</h2>
                    <div className="overflow-x-auto overflow-hidden">
                        <table className="table table-zebra">
                            <thead>
                                <tr>
                                    <th>请求方法</th>
                                    <th>请求URL</th>
                                    <th>响应状态</th>
                                    <th>执行时间</th>
                                    <th>请求时间</th>
                                </tr>
                            </thead>
                            <tbody>
                                {summary && summary.request_logs && summary.request_logs.length > 0
                                    ? summary.request_logs
                                        .slice((requestLogCurrentPage - 1) * requestLogPageSize, requestLogCurrentPage * requestLogPageSize)
                                        .map(log => (
                                            <tr key={log.request_log_uuid}>
                                                <td>{log.request_method}</td>
                                                <td>{log.request_url}</td>
                                                <td>
                                                    <span className={`badge ${log.response_code >= 400 ? 'badge-error' : 'badge-success'}`}>
                                                        {log.response_code}
                                                    </span>
                                                </td>
                                                <td>{log.execution_time}ms</td>
                                                <td>{formatTimestamp(log.request_time)}</td>
                                            </tr>
                                        ))
                                    : (
                                        <tr>
                                            <td colSpan={5} className="text-center py-4">暂无请求日志数据</td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                        {summary && summary.request_logs && summary.request_logs.length > requestLogPageSize && (
                            <div className="flex justify-center mt-4">
                                <div className="join">
                                    <button
                                        className="join-item btn btn-sm"
                                        onClick={() => setRequestLogCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={requestLogCurrentPage === 1}
                                    >
                                        « 上一页
                                    </button>
                                    <button className="join-item btn btn-sm disabled:bg-base-200 disabled:text-base-content/50" disabled>
                                        第 {requestLogCurrentPage} / {Math.ceil(summary.request_logs.length / requestLogPageSize)} 页
                                    </button>
                                    <button
                                        className="join-item btn btn-sm"
                                        onClick={() => setRequestLogCurrentPage(prev => Math.min(prev + 1, Math.ceil(summary.request_logs.length / requestLogPageSize)))}
                                        disabled={requestLogCurrentPage === Math.ceil(summary.request_logs.length / requestLogPageSize)}
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
    );
}
