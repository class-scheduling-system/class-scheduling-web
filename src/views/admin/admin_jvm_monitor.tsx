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

import React, { JSX, useEffect, useState } from 'react';
import { GetJvmStackInfoAPI } from '../../apis/public_api.ts';
import { JvmStackEntity, ThreadInfoEntity } from '../../models/entity/jvm_stack_entity.ts';
import { CardComponent } from '../../components/card_component.tsx';
import { LabelComponent } from '../../components/label_component.tsx';
import { SiteInfoEntity } from '../../models/entity/site_info_entity.ts';
import { Refresh } from '@icon-park/react';

// 堆栈跟踪默认显示行数
const DEFAULT_STACK_LINES = 3;

/**
 * 获取线程状态标签类型
 */
const getThreadStateLabel = (state: string | undefined) => {
    switch (state) {
        case 'RUNNABLE':
            return <LabelComponent style={"badge-outline"} type="success" text="运行中" />;
        case 'WAITING':
            return <LabelComponent style={"badge-outline"} type="warning" text="等待中" />;
        case 'TIMED_WAITING':
            return <LabelComponent style={"badge-outline"} type="info" text="定时等待" />;
        default:
            return <LabelComponent style={"badge-outline"} type="secondary" text={state || '未知'} />;
    }
};

/**
 * 获取线程类型标签
 */
const getThreadTypeLabel = (isDaemon: boolean | undefined) => {
    if (isDaemon === undefined) return <LabelComponent style={"badge-outline"} type="secondary" text="未知" />;
    return isDaemon ? 
        <LabelComponent style={"badge-outline"} type="primary" text="守护线程" /> : 
        <LabelComponent style={"badge-outline"} type="success" text="用户线程" />;
};

/**
 * 堆栈跟踪组件
 */
type StackTraceProps = {
    traces: string[];
}

type AdminJvmMonitorProps = {
    site: SiteInfoEntity
}

const StackTrace: React.FC<StackTraceProps> = ({ traces }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const displayedTraces = isExpanded ? traces : traces.slice(0, DEFAULT_STACK_LINES);
    const hasMore = traces.length > DEFAULT_STACK_LINES;

    return (
        <div className="space-y-1">
            {displayedTraces.map((trace: string, index: number) => (
                <div key={index} className="font-mono text-xs whitespace-pre-wrap">
                    {trace}
                </div>
            ))}
            {hasMore && (
                <button
                    className="btn btn-xs btn-ghost mt-1"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {isExpanded ? '收起' : `展开 (${traces.length - DEFAULT_STACK_LINES} 行)`}
                </button>
            )}
        </div>
    );
};

/**
 * JVM 堆栈信息页面组件
 * 
 * @returns {JSX.Element} JVM 堆栈信息页面
 */
export const AdminJvmMonitor = ({ site }: Readonly<AdminJvmMonitorProps>): JSX.Element => {
    // 状态管理
    const [jvmInfo, setJvmInfo] = useState<JvmStackEntity>({} as JvmStackEntity);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshKey, setRefreshKey] = useState<number>(0);
    const [activeTab, setActiveTab] = useState<'threads' | 'properties'>('threads');

    useEffect(() => {
        document.title = `JVM 堆栈监控 | ${site.name}`;
    }, [site]);

    // 格式化内存大小
    const formatMemorySize = (bytes: number | undefined): string => {
        if (bytes === undefined) return '-';
        const gb = bytes / (1024 * 1024 * 1024);
        const mb = bytes / (1024 * 1024);
        if (gb >= 1) {
            return `${gb.toFixed(2)} GB`;
        }
        return `${mb.toFixed(2)} MB`;
    };

    // 计算内存使用百分比
    const calculateMemoryUsagePercentage = (): number => {
        if (!jvmInfo || !jvmInfo.used_memory || !jvmInfo.total_memory) return 0;
        return (jvmInfo.used_memory / jvmInfo.total_memory) * 100;
    };

    // 获取 JVM 堆栈信息
    useEffect(() => {
        const fetchJvmInfo = async () => {
            setLoading(true);
            try {
                const response = await GetJvmStackInfoAPI();
                console.log('JVM 信息响应:', response); // 添加日志
                if (response?.code === 200 && response?.data) {
                    console.log('JVM 数据:', response.data); // 添加日志
                    setJvmInfo(response.data);
                } else {
                    console.error('获取 JVM 信息失败:', response?.message || '未知错误');
                }
            } catch (error) {
                console.error('获取 JVM 信息出错:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchJvmInfo();
        // 每 30 秒自动刷新一次
        const interval = setInterval(() => {
            setRefreshKey(prev => prev + 1);
        }, 30000);

        return () => clearInterval(interval);
    }, [refreshKey]);

    return (
        <div className="grid grid-cols-12 gap-4 p-6">
            <div className="col-span-12 flex justify-between items-center">
                <h2 className="text-2xl font-bold">JVM 堆栈监控</h2>
                <button 
                    className="btn btn-circle btn-ghost"
                    onClick={() => setRefreshKey(prev => prev + 1)}
                >
                    <Refresh theme="outline" size="24" />
                </button>
            </div>

            {/* 内存统计卡片 */}
            <div className="col-span-12 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="stats shadow">
                    <div className="stat">
                        <div className="stat-title">总内存</div>
                        <div className="stat-value text-primary">
                            {loading ? (
                                <span className="loading loading-spinner loading-sm" />
                            ) : (
                                formatMemorySize(jvmInfo?.total_memory)
                            )}
                        </div>
                    </div>
                </div>

                <div className="stats shadow">
                    <div className="stat">
                        <div className="stat-title">已用内存</div>
                        <div className="stat-value text-secondary">
                            {loading ? (
                                <span className="loading loading-spinner loading-sm" />
                            ) : (
                                formatMemorySize(jvmInfo?.used_memory)
                            )}
                        </div>
                    </div>
                </div>

                <div className="stats shadow">
                    <div className="stat">
                        <div className="stat-title">最大内存</div>
                        <div className="stat-value text-accent">
                            {loading ? (
                                <span className="loading loading-spinner loading-sm" />
                            ) : (
                                formatMemorySize(jvmInfo?.max_memory)
                            )}
                        </div>
                    </div>
                </div>

                <div className="stats shadow">
                    <div className="stat">
                        <div className="stat-title">活动线程数</div>
                        <div className="stat-value">
                            {loading ? (
                                <span className="loading loading-spinner loading-sm" />
                            ) : (
                                jvmInfo?.active_thread_count || '-'
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* 内存使用进度条 */}
            <CardComponent col={12} className="mb-4">
                <h3 className="text-lg font-bold mb-4">内存使用情况</h3>
                <progress 
                    className={`progress w-full ${calculateMemoryUsagePercentage() > 80 ? 'progress-error' : 'progress-success'}`}
                    value={calculateMemoryUsagePercentage()} 
                    max="100"
                />
                <p className="text-right mt-2">{calculateMemoryUsagePercentage().toFixed(2)}%</p>
            </CardComponent>

            {/* 标签页 */}
            <div className="col-span-12">
                <div className="tabs tabs-boxed mb-4">
                    <a 
                        className={`tab ${activeTab === 'threads' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('threads')}
                    >
                        线程信息
                    </a>
                    <a 
                        className={`tab ${activeTab === 'properties' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('properties')}
                    >
                        系统属性
                    </a>
                </div>
            </div>

            {/* 线程信息表格 */}
            {activeTab === 'threads' && (
                <CardComponent col={12}>
                    <div className="overflow-x-auto">
                        <table className="table table-zebra w-full">
                            <thead>
                                <tr>
                                    <th>线程名称</th>
                                    <th>状态</th>
                                    <th>优先级</th>
                                    <th>类型</th>
                                    <th>堆栈跟踪</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="text-center">
                                            <span className="loading loading-spinner loading-lg" />
                                        </td>
                                    </tr>
                                ) : (
                                    jvmInfo?.thread_infos?.map((thread: ThreadInfoEntity) => (
                                        <tr key={thread.thread_name}>
                                            <td>{thread.thread_name || '-'}</td>
                                            <td>{getThreadStateLabel(thread.thread_state)}</td>
                                            <td>{thread.priority || '-'}</td>
                                            <td>{getThreadTypeLabel(thread.is_daemon)}</td>
                                            <td>
                                                <div className="max-h-40 overflow-auto">
                                                    {thread.stack_trace ? (
                                                        <StackTrace traces={thread.stack_trace} />
                                                    ) : '-'}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardComponent>
            )}

            {/* 系统属性表格 */}
            {activeTab === 'properties' && (
                <CardComponent col={12}>
                    <div className="overflow-x-auto">
                        <table className="table table-zebra w-full">
                            <thead>
                                <tr>
                                    <th>属性名</th>
                                    <th>属性值</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={2} className="text-center">
                                            <span className="loading loading-spinner loading-lg" />
                                        </td>
                                    </tr>
                                ) : (    
                                    jvmInfo?.system_properties && Object.entries(jvmInfo.system_properties).map(([key, value]) => (
                                        <tr key={key}>
                                            <td className="font-mono">{key}</td>
                                            <td className="font-mono">
                                                {key === 'java.class.path' ? (
                                                    <div className="max-h-40 overflow-auto">
                                                        <ul className="space-y-1">
                                                            {String(value).split(':').map((path, index) => (
                                                                <li key={index} className="break-all">{path}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ) : (
                                                    <div className="max-h-40 overflow-auto">{String(value)}</div>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardComponent>
            )}
        </div>
    );
};