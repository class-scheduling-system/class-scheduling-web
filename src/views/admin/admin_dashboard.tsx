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

import {useEffect, useState} from 'react';
import {SiteInfoEntity} from '../../models/entity/site_info_entity';
import {BuildingTwo, People, Setting, User} from "@icon-park/react";
import {GetUserListAPI} from '../../apis/user_api';
import {GetBuildingListAPI} from '../../apis/building_api';
import {GetRoleListAPI} from '../../apis/role_api';
import {UserInfoEntity} from "../../models/entity/user_info_entity.ts";
import {useSelector} from "react-redux";

export function AdminDashboard({ site }: Readonly<{
    site: SiteInfoEntity
}>) {
    const getUser = useSelector((state: { user: UserInfoEntity }) => state.user);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [summary, setSummary] = useState({
        userCount: 0,
        activeUserCount: 0,
        buildingCount: 0,
        roleCount: 0
    });

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
            const userResp = await GetUserListAPI({ page: 1, size: 1 });
            const buildingResp = await GetBuildingListAPI({ page: 1, size: 1 });
            const roleResp = await GetRoleListAPI({ page: 1, size: 1 });

            setSummary({
                userCount: userResp?.data?.total || 0,
                activeUserCount: userResp?.data?.records.filter(u => u.user!.status).length || 0,
                buildingCount: buildingResp?.data?.total || 0,
                roleCount: roleResp?.data?.total || 0
            });
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

    const statistics = {
        systemLogs: [
            { id: 1, type: '用户登录', user: '管理员1', time: '2024-03-15 10:30:45' },
            { id: 2, type: '系统配置', user: '管理员2', time: '2024-03-15 11:15:22' },
            { id: 3, type: '权限变更', user: '管理员3', time: '2024-03-15 14:45:11' }
        ],
        recentOperations: [
            { id: 1, action: '新增用户', details: '张三', operator: '管理员1', time: '2024-03-15 09:20:33' },
            { id: 2, action: '修改角色权限', details: '教师角色', operator: '管理员2', time: '2024-03-15 13:45:17' },
            { id: 3, action: '删除建筑', details: '教学楼A', operator: '管理员3', time: '2024-03-15 16:10:05' }
        ]
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
                    <div className="card-body p-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-semibold">用户总数</h2>
                                <p className="text-3xl font-bold text-primary mt-2">{summary.userCount}</p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <User theme="outline" size="24" className="text-blue-500" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 其他卡片保持不变 */}
                <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
                    <div className="card-body p-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-semibold">活跃用户</h2>
                                <p className="text-3xl font-bold text-secondary mt-2">{summary.activeUserCount}</p>
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
                                <h2 className="text-xl font-semibold">建筑数量</h2>
                                <p className="text-3xl font-bold text-accent mt-2">{summary.buildingCount}</p>
                            </div>
                            <div className="bg-purple-100 p-3 rounded-lg">
                                <BuildingTwo theme="outline" size="24" className="text-purple-500" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
                    <div className="card-body p-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-semibold">角色数量</h2>
                                <p className="text-3xl font-bold text-info mt-2">{summary.roleCount}</p>
                            </div>
                            <div className="bg-orange-100 p-3 rounded-lg">
                                <Setting theme="outline" size="24" className="text-orange-500" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 系统日志 */}
            <div className="card bg-base-100 shadow-md overflow-hidden">
                <div className="card-body">
                    <h2 className="card-title flex items-center gap-2">系统日志</h2>
                    <div className="overflow-x-auto overflow-hidden">
                        <table className="table table-zebra">
                            <thead>
                                <tr>
                                    <th>日志类型</th>
                                    <th>操作用户</th>
                                    <th>操作时间</th>
                                </tr>
                            </thead>
                            <tbody>
                                {statistics.systemLogs.map(log => (
                                    <tr key={log.id}>
                                        <td>{log.type}</td>
                                        <td>{log.user}</td>
                                        <td>{log.time}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* 最近操作 */}
            <div className="card bg-base-100 shadow-md overflow-hidden">
                <div className="card-body">
                    <h2 className="card-title flex items-center gap-2">最近操作</h2>
                    <div className="overflow-x-auto overflow-hidden">
                        <table className="table table-zebra">
                            <thead>
                                <tr>
                                    <th>操作</th>
                                    <th>详情</th>
                                    <th>操作人</th>
                                    <th>时间</th>
                                </tr>
                            </thead>
                            <tbody>
                                {statistics.recentOperations.map(operation => (
                                    <tr key={operation.id}>
                                        <td>{operation.action}</td>
                                        <td>{operation.details}</td>
                                        <td>{operation.operator}</td>
                                        <td>{operation.time}</td>
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
