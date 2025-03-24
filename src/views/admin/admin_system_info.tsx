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

import {SiteInfoEntity} from "../../models/entity/site_info_entity.ts";
import {useEffect, useState} from "react";
import {GetSystemInfoAPI} from "../../apis/public_api.ts";
import {SystemInfoEntity} from "../../models/entity/system_info_entity.ts";
import {message} from "antd";
import {Cpu, Server, HardDisk, Memory, Refresh} from "@icon-park/react";
import {CardComponent} from "../../components/card_component.tsx";

interface RadialProgressStyle extends React.CSSProperties {
    '--value': number;
    '--size': string;
    '--thickness': string;
}

export function AdminSystemInfo({site}: Readonly<{ site: SiteInfoEntity }>) {
    const [systemInfo, setSystemInfo] = useState<SystemInfoEntity | undefined>();
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [countdown, setCountdown] = useState(10);

    useEffect(() => {
        document.title = `系统信息 | ${site.name ?? "Frontleaves Technology"}`;
        
        const fetchSystemInfo = async () => {
            try {
                const response = await GetSystemInfoAPI();
                if (response?.output === "Success" && response.data) {
                    setSystemInfo(response.data);
                } else {
                    message.error("获取系统信息失败");
                }
            } catch (error) {
                console.error('获取系统信息失败:', error);
            } finally {
                setLoading(false);
                setIsRefreshing(false);
            }
        };
        
        fetchSystemInfo();
        const interval = setInterval(fetchSystemInfo, 10000);
        return () => clearInterval(interval);
    }, [site.name]);

    // 倒计时效果
    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    return 10;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // 手动刷新
    const handleRefresh = async () => {
        setIsRefreshing(true);
        setCountdown(10);
        try {
            const response = await GetSystemInfoAPI();
            if (response?.output === "Success" && response.data) {
                setSystemInfo(response.data);
            } else {
                message.error("获取系统信息失败");
            }
        } catch (error) {
            console.error('获取系统信息失败:', error);
        } finally {
            setIsRefreshing(false);
        }
    };

    const formatBytes = (bytes: number): string => {
        if (bytes === 0) return "0 MB";
        
        const units = ['MB', 'GB', 'TB'];
        let value = bytes;
        let unitIndex = 0;
        
        while (value >= 1024 && unitIndex < units.length - 1) {
            value /= 1024;
            unitIndex++;
        }
        
        return `${value.toFixed(2)} ${units[unitIndex]}`;
    };

    const getProgressColor = (usage: number): string => {
        if (usage >= 90) return "text-error";
        if (usage >= 70) return "text-warning";
        return "text-success";
    };

    const InfoCard = ({ title, icon, data, usage, colSpan = 3 }: { 
        title: string, 
        icon: React.ReactNode, 
        data: React.ReactNode, 
        usage: number,
        colSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
    }) => (
        <CardComponent col={colSpan}>
            <div className="flex flex-col gap-2">
                <div className="text-lg font-medium flex items-center gap-2">
                    {icon}
                    {title}
                </div>
                <div className="flex items-center justify-between">
                    {data}
                    <div className={`radial-progress ${getProgressColor(usage)}`}
                        style={{
                            '--value': usage,
                            '--size': '4.5rem',
                            '--thickness': '0.4rem'
                        } as RadialProgressStyle}>
                        <span className="text-sm font-bold">
                            {usage.toFixed(1)}%
                        </span>
                    </div>
                </div>
            </div>
        </CardComponent>
    );

    return (
        <div className="grid grid-cols-12 gap-4 p-6">
            <div className="col-span-12 flex justify-between items-center">
                <h2 className="text-2xl font-bold">系统信息</h2>
                <div className="flex items-center gap-4">
                    <div className="text-sm text-base-content/60">
                        {countdown}秒后刷新
                    </div>
                    <button
                        className="btn btn-circle btn-ghost relative group"
                        onClick={handleRefresh}
                    >
                        <Refresh
                            theme="outline"
                            size="24"
                            className={`transition-transform duration-500 ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180'}`}
                        />
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="col-span-12 flex justify-center items-center min-h-[400px]">
                    <div className="flex flex-col items-center gap-4">
                        <span className="loading loading-spinner loading-lg text-primary" />
                        <span className="text-base-content/60">加载中...</span>
                    </div>
                </div>
            ) : (
                <>
                    <InfoCard
                        title="CPU"
                        icon={<Cpu theme="outline" size="20" className="text-primary" />}
                        data={
                            <div className="space-y-1">
                                <p className="text-sm text-base-content/70">处理器</p>
                                <p className="font-medium">{systemInfo?.cpu_name}</p>
                                <p className="text-sm text-base-content/70 mt-2">核心数</p>
                                <p className="font-medium">{systemInfo?.cpu_cores} 核心</p>
                            </div>
                        }
                        usage={systemInfo?.cpu_usage ? systemInfo.cpu_usage * 100 : 0}
                        colSpan={4}
                    />

                    <InfoCard
                        title="内存"
                        icon={<Memory theme="outline" size="20" className="text-secondary" />}
                        data={
                            <div className="space-y-1">
                                <p className="text-sm text-base-content/70">总内存</p>
                                <p className="font-medium">{formatBytes(systemInfo?.total_memory ?? 0)}</p>
                                <p className="text-sm text-base-content/70 mt-2">可用内存</p>
                                <p className="font-medium">{formatBytes(systemInfo?.free_memory ?? 0)}</p>
                            </div>
                        }
                        usage={((systemInfo?.total_memory ?? 0) - (systemInfo?.free_memory ?? 0)) / (systemInfo?.total_memory ?? 1) * 100}
                        colSpan={4}
                    />

                    <InfoCard
                        title="堆内存"
                        icon={<Server theme="outline" size="20" className="text-accent" />}
                        data={
                            <div className="space-y-1">
                                <p className="text-sm text-base-content/70">已分配</p>
                                <p className="font-medium">{formatBytes(systemInfo?.heap_memory_used ?? 0)}</p>
                                <p className="text-sm text-base-content/70 mt-2">最大可用</p>
                                <p className="font-medium">{formatBytes(systemInfo?.heap_memory_max ?? 0)}</p>
                            </div>
                        }
                        usage={(systemInfo?.heap_memory_used ?? 0) / (systemInfo?.heap_memory_max ?? 1) * 100}
                        colSpan={4}
                    />

                    <InfoCard
                        title="磁盘"
                        icon={<HardDisk theme="outline" size="20" className="text-info" />}
                        data={
                            <div className="space-y-1">
                                <p className="text-sm text-base-content/70">总空间</p>
                                <p className="font-medium">{formatBytes(systemInfo?.total_disk_space ?? 0)}</p>
                                <p className="text-sm text-base-content/70 mt-2">可用空间</p>
                                <p className="font-medium">{formatBytes(systemInfo?.free_disk_space ?? 0)}</p>
                            </div>
                        }
                        usage={((systemInfo?.total_disk_space ?? 0) - (systemInfo?.free_disk_space ?? 0)) / (systemInfo?.total_disk_space ?? 1) * 100}
                        colSpan={12}
                    />

                    <CardComponent col={12}>
                        <div className="flex flex-col gap-2">
                            <div className="text-lg font-medium flex items-center gap-2">
                                <Server theme="outline" size="20" className="text-primary" />
                                操作系统信息
                            </div>
                            <div className="grid md:grid-cols-3 gap-4 mt-2">
                                <div>
                                    <p className="text-sm text-base-content/70">系统名称</p>
                                    <p className="font-medium">{systemInfo?.os_name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-base-content/70">系统版本</p>
                                    <p className="font-medium">{systemInfo?.os_version}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-base-content/70">系统架构</p>
                                    <p className="font-medium">{systemInfo?.os_architecture}</p>
                                </div>
                            </div>
                        </div>
                    </CardComponent>
                </>
            )}
        </div>
    );
}
