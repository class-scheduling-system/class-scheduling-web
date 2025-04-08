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

import { JSX, useEffect, useState } from "react";
import { SiteInfoEntity } from "../../models/entity/site_info_entity";
import { Skeleton, message, Modal, Tabs, Badge, Empty, Tag } from "antd";
import { Remind, Refresh, Search, Close, Message, Right } from "@icon-park/react";
import { CardComponent } from "../../components/card_component";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/zh-cn";

// 配置 dayjs
dayjs.extend(relativeTime);
dayjs.locale("zh-cn");

// 通知信息类型
interface NotificationInfo {
    id: string;
    title: string;
    content: string;
    type: "system" | "course" | "exam" | "grade";
    priority: "high" | "medium" | "low";
    isRead: boolean;
    createTime: string;
    sender: string;
}

// 通知优先级颜色映射
const notificationPriorityColors: Record<string, string> = {
    "high": "bg-error/10 border-error/30 text-error hover:bg-error/20",
    "medium": "bg-warning/10 border-warning/30 text-warning hover:bg-warning/20",
    "low": "bg-info/10 border-info/30 text-info hover:bg-info/20"
};

// 通知类型颜色映射
const notificationTypeColors: Record<string, string> = {
    "system": "bg-neutral/10 border-neutral/30 text-neutral hover:bg-neutral/20",
    "course": "bg-primary/10 border-primary/30 text-primary hover:bg-primary/20",
    "exam": "bg-warning/10 border-warning/30 text-warning hover:bg-warning/20",
    "grade": "bg-success/10 border-success/30 text-success hover:bg-success/20"
};

// 获取通知优先级对应的颜色样式
const getNotificationPriorityStyle = (priority: string): string => {
    return notificationPriorityColors[priority] || "";
};

// 获取通知类型对应的颜色样式
const getNotificationTypeStyle = (type: string): string => {
    return notificationTypeColors[type] || "";
};

/**
 * 学生通知页面组件
 * 
 * @param site 站点信息
 * @returns 学生通知页面
 */
export function StudentNotification({ site }: Readonly<{ site?: SiteInfoEntity }>): JSX.Element {
    const [loading, setLoading] = useState<boolean>(true);
    const [notifications, setNotifications] = useState<NotificationInfo[]>([]);
    const [searchKeyword, setSearchKeyword] = useState<string>("");
    const [activeTab, setActiveTab] = useState<string>("all");
    const [selectedNotification, setSelectedNotification] = useState<NotificationInfo | null>(null);
    const [notificationDetailVisible, setNotificationDetailVisible] = useState<boolean>(false);

    // 加载通知数据
    useEffect(() => {
        setLoading(true);
        
        // 模拟加载通知数据
        setTimeout(() => {
            // 模拟通知数据
            const mockNotifications: NotificationInfo[] = [
                {
                    id: "1",
                    title: "选课通知：2024春季学期选课开始",
                    content: "亲爱的同学：\n\n2024春季学期选课将于2024年1月1日开始，请在规定时间内完成选课。选课注意事项如下：\n\n1. 请仔细阅读选课指南\n2. 注意课程冲突\n3. 按时完成选课\n\n如有问题请联系教务处。",
                    type: "course",
                    priority: "high",
                    isRead: false,
                    createTime: "2023-12-25T10:00:00",
                    sender: "教务处"
                },
                {
                    id: "2",
                    title: "期末考试安排已发布",
                    content: "2023-2024学年第一学期期末考试安排已发布，请登录教务系统查看具体安排。请注意：\n\n1. 考试时间和地点\n2. 携带证件\n3. 遵守考试纪律",
                    type: "exam",
                    priority: "high",
                    isRead: true,
                    createTime: "2023-12-20T14:30:00",
                    sender: "教务处"
                },
                {
                    id: "3",
                    title: "系统维护通知",
                    content: "系统将于本周六凌晨2:00-4:00进行例行维护，期间所有服务暂停使用。给您带来的不便敬请谅解。",
                    type: "system",
                    priority: "medium",
                    isRead: false,
                    createTime: "2023-12-18T09:15:00",
                    sender: "系统管理员"
                },
                {
                    id: "4",
                    title: "期中成绩已公布",
                    content: "2023-2024学年第一学期期中考试成绩已公布，请登录教务系统查看。如对成绩有疑问，请在一周内联系任课教师。",
                    type: "grade",
                    priority: "medium",
                    isRead: true,
                    createTime: "2023-11-15T16:45:00",
                    sender: "教务处"
                }
            ];
            
            setNotifications(mockNotifications);
            setLoading(false);
        }, 1000);
    }, []);

    // 设置页面标题
    useEffect(() => {
        document.title = `通知中心 | ${site?.name ?? "Frontleaves Technology"}`;
    }, [site?.name]);

    // 刷新通知
    const handleRefresh = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            message.success("通知已刷新");
        }, 1000);
    };

    // 查看通知详情
    const handleViewNotification = (notification: NotificationInfo) => {
        setSelectedNotification(notification);
        setNotificationDetailVisible(true);

        // 标记为已读
        if (!notification.isRead) {
            setNotifications(prevNotifications =>
                prevNotifications.map(n =>
                    n.id === notification.id ? { ...n, isRead: true } : n
                )
            );
        }
    };

    // 获取通知类型标签
    const getNotificationTypeTag = (type: string) => {
        switch (type) {
            case "system":
                return <span className="badge badge-neutral">系统</span>;
            case "course":
                return <span className="badge badge-primary">选课</span>;
            case "exam":
                return <span className="badge badge-warning">考试</span>;
            case "grade":
                return <span className="badge badge-success">成绩</span>;
            default:
                return <span className="badge">其他</span>;
        }
    };

    // 获取通知优先级标签
    const getNotificationPriorityTag = (priority: string) => {
        switch (priority) {
            case "high":
                return <span className="badge badge-error">重要</span>;
            case "medium":
                return <span className="badge badge-warning">普通</span>;
            case "low":
                return <span className="badge badge-info">低</span>;
            default:
                return null;
        }
    };

    // 筛选通知
    const getFilteredNotifications = () => {
        return notifications.filter(notification => {
            const matchKeyword = searchKeyword === "" ||
                notification.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                notification.content.toLowerCase().includes(searchKeyword.toLowerCase());
            
            const matchType = activeTab === "all" || notification.type === activeTab;
            
            return matchKeyword && matchType;
        });
    };

    // 获取未读通知数量
    const getUnreadCount = (type: string = "all") => {
        return notifications.filter(n => 
            !n.isRead && (type === "all" || n.type === type)
        ).length;
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* 标题和操作区 */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl md:text-3xl font-bold text-primary-content flex items-center gap-2">
                        <Remind theme="outline" size="24" className="text-primary" />
                        <span>通知中心</span>
                    </h1>
                    {getUnreadCount() > 0 && (
                        <Badge count={getUnreadCount()} className="animate-pulse" />
                    )}
                </div>
                
                <button 
                    className="btn btn-sm md:btn-md btn-primary btn-outline flex items-center gap-1"
                    onClick={handleRefresh}
                    disabled={loading}
                >
                    <Refresh theme="outline" size="16" />
                    <span className="hidden md:inline">刷新</span>
                </button>
            </div>

            {/* 统计卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <CardComponent className="bg-primary/10 border-primary/20">
                    <div className="p-4 flex justify-between items-center">
                        <div>
                            <div className="text-sm text-base-content/70">全部通知</div>
                            <div className="text-2xl font-bold text-primary mt-1">{notifications.length}</div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <Message theme="outline" size="20" className="text-primary" />
                        </div>
                    </div>
                </CardComponent>
                
                <CardComponent className="bg-error/10 border-error/20">
                    <div className="p-4 flex justify-between items-center">
                        <div>
                            <div className="text-sm text-base-content/70">未读通知</div>
                            <div className="text-2xl font-bold text-error mt-1">{getUnreadCount()}</div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-error/20 flex items-center justify-center">
                            <Remind theme="outline" size="20" className="text-error" />
                        </div>
                    </div>
                </CardComponent>
                
                <CardComponent className="bg-warning/10 border-warning/20">
                    <div className="p-4 flex justify-between items-center">
                        <div>
                            <div className="text-sm text-base-content/70">重要通知</div>
                            <div className="text-2xl font-bold text-warning mt-1">
                                {notifications.filter(n => n.priority === "high").length}
                            </div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-warning">
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                <line x1="12" y1="9" x2="12" y2="13"></line>
                                <line x1="12" y1="17" x2="12.01" y2="17"></line>
                            </svg>
                        </div>
                    </div>
                </CardComponent>
                
                <CardComponent className="bg-success/10 border-success/20">
                    <div className="p-4 flex justify-between items-center">
                        <div>
                            <div className="text-sm text-base-content/70">已读通知</div>
                            <div className="text-2xl font-bold text-success mt-1">
                                {notifications.filter(n => n.isRead).length}
                            </div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-success">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                        </div>
                    </div>
                </CardComponent>
            </div>

            {/* 通知搜索和列表 */}
            <CardComponent>
                {loading ? (
                    <div className="p-8">
                        <Skeleton active paragraph={{ rows: 10 }} />
                    </div>
                ) : (
                    <div>
                        <div className="p-4 border-b">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1 form-control">
                                    <label className="input input-bordered flex items-center gap-2">
                                        <Search theme="outline" size="16" />
                                        <input 
                                            type="text" 
                                            className="grow" 
                                            placeholder="搜索通知标题或内容"
                                            value={searchKeyword}
                                            onChange={(e) => setSearchKeyword(e.target.value)}
                                        />
                                        {searchKeyword && (
                                            <button 
                                                className="btn btn-ghost btn-xs" 
                                                onClick={() => setSearchKeyword("")}
                                            >
                                                <Close theme="outline" size="14" />
                                            </button>
                                        )}
                                    </label>
                                </div>
                            </div>
                        </div>
                        
                        <Tabs
                            defaultActiveKey="all"
                            activeKey={activeTab}
                            onChange={setActiveTab}
                            type="card"
                            className="px-2 pt-2"
                            items={[
                                {
                                    key: 'all',
                                    label: (
                                        <Badge count={getUnreadCount("all")} showZero={false}>
                                            全部
                                        </Badge>
                                    ),
                                    children: (
                                        <NotificationList 
                                            notifications={getFilteredNotifications()}
                                            onViewNotification={handleViewNotification}
                                            getNotificationTypeTag={getNotificationTypeTag}
                                            getNotificationPriorityTag={getNotificationPriorityTag}
                                            getNotificationTypeStyle={getNotificationTypeStyle}
                                            getNotificationPriorityStyle={getNotificationPriorityStyle}
                                        />
                                    ),
                                },
                                {
                                    key: 'system',
                                    label: (
                                        <Badge count={getUnreadCount("system")} showZero={false}>
                                            系统通知
                                        </Badge>
                                    ),
                                    children: (
                                        <NotificationList 
                                            notifications={getFilteredNotifications()}
                                            onViewNotification={handleViewNotification}
                                            getNotificationTypeTag={getNotificationTypeTag}
                                            getNotificationPriorityTag={getNotificationPriorityTag}
                                            getNotificationTypeStyle={getNotificationTypeStyle}
                                            getNotificationPriorityStyle={getNotificationPriorityStyle}
                                        />
                                    ),
                                },
                                {
                                    key: 'course',
                                    label: (
                                        <Badge count={getUnreadCount("course")} showZero={false}>
                                            选课通知
                                        </Badge>
                                    ),
                                    children: (
                                        <NotificationList 
                                            notifications={getFilteredNotifications()}
                                            onViewNotification={handleViewNotification}
                                            getNotificationTypeTag={getNotificationTypeTag}
                                            getNotificationPriorityTag={getNotificationPriorityTag}
                                            getNotificationTypeStyle={getNotificationTypeStyle}
                                            getNotificationPriorityStyle={getNotificationPriorityStyle}
                                        />
                                    ),
                                },
                                {
                                    key: 'exam',
                                    label: (
                                        <Badge count={getUnreadCount("exam")} showZero={false}>
                                            考试通知
                                        </Badge>
                                    ),
                                    children: (
                                        <NotificationList 
                                            notifications={getFilteredNotifications()}
                                            onViewNotification={handleViewNotification}
                                            getNotificationTypeTag={getNotificationTypeTag}
                                            getNotificationPriorityTag={getNotificationPriorityTag}
                                            getNotificationTypeStyle={getNotificationTypeStyle}
                                            getNotificationPriorityStyle={getNotificationPriorityStyle}
                                        />
                                    ),
                                },
                                {
                                    key: 'grade',
                                    label: (
                                        <Badge count={getUnreadCount("grade")} showZero={false}>
                                            成绩通知
                                        </Badge>
                                    ),
                                    children: (
                                        <NotificationList 
                                            notifications={getFilteredNotifications()}
                                            onViewNotification={handleViewNotification}
                                            getNotificationTypeTag={getNotificationTypeTag}
                                            getNotificationPriorityTag={getNotificationPriorityTag}
                                            getNotificationTypeStyle={getNotificationTypeStyle}
                                            getNotificationPriorityStyle={getNotificationPriorityStyle}
                                        />
                                    ),
                                },
                            ]}
                        />
                    </div>
                )}
            </CardComponent>

            {/* 通知详情模态框 */}
            <Modal
                title={
                    <div className="flex items-center gap-2">
                        <span className="text-lg">{selectedNotification?.title}</span>
                        {selectedNotification && (
                            <>
                                {getNotificationTypeTag(selectedNotification.type)}
                                {getNotificationPriorityTag(selectedNotification.priority)}
                            </>
                        )}
                    </div>
                }
                open={notificationDetailVisible}
                onCancel={() => setNotificationDetailVisible(false)}
                footer={null}
                width={600}
            >
                {selectedNotification && (
                    <div className="space-y-4">
                        <div className="flex justify-between text-sm text-base-content/70 p-3 bg-base-200/50 rounded-lg">
                            <div className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                                <span>{selectedNotification.sender}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12 6 12 12 16 14"></polyline>
                                </svg>
                                <span>{dayjs(selectedNotification.createTime).format("YYYY-MM-DD HH:mm:ss")}</span>
                            </div>
                        </div>
                        
                        <div className={`p-4 rounded-lg whitespace-pre-wrap leading-relaxed ${
                            selectedNotification.priority === "high" 
                                ? "bg-error/5 border border-error/20" 
                                : selectedNotification.priority === "medium"
                                    ? "bg-warning/5 border border-warning/20"
                                    : "bg-base-200/30"
                        }`}>
                            {selectedNotification.content}
                        </div>
                        
                        <div className="flex justify-end pt-4">
                            <button 
                                className="btn btn-primary"
                                onClick={() => setNotificationDetailVisible(false)}
                            >
                                关闭
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}

/**
 * 通知列表组件
 */
function NotificationList({ 
    notifications,
    onViewNotification,
    getNotificationTypeTag,
    getNotificationPriorityTag,
    getNotificationTypeStyle,
    getNotificationPriorityStyle
}: { 
    notifications: NotificationInfo[],
    onViewNotification: (notification: NotificationInfo) => void,
    getNotificationTypeTag: (type: string) => JSX.Element,
    getNotificationPriorityTag: (priority: string) => JSX.Element,
    getNotificationTypeStyle: (type: string) => string,
    getNotificationPriorityStyle: (priority: string) => string
}): JSX.Element {
    if (notifications.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <Empty description="暂无通知" />
            </div>
        );
    }

    return (
        <div className="divide-y">
            {notifications.map((notification) => (
                <div 
                    key={notification.id}
                    className={`p-4 hover:bg-base-200 cursor-pointer transition-colors ${
                        !notification.isRead ? `${getNotificationPriorityStyle(notification.priority)}` : ''
                    }`}
                    onClick={() => onViewNotification(notification)}
                >
                    <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className={`text-lg ${!notification.isRead ? 'font-bold' : ''}`}>
                                    {notification.title}
                                </h3>
                                {!notification.isRead && (
                                    <Tag color="processing" className="animate-pulse">新</Tag>
                                )}
                                {getNotificationTypeTag(notification.type)}
                                {getNotificationPriorityTag(notification.priority)}
                            </div>
                            <p className="text-sm text-base-content/70 line-clamp-2 mb-2">
                                {notification.content}
                            </p>
                            <div className="flex justify-between items-center">
                                <div className="text-xs text-base-content/50">
                                    <span className="inline-block mr-2">来自: {notification.sender}</span>
                                </div>
                                <button className="btn btn-ghost btn-xs">
                                    查看详情
                                    <Right theme="outline" size="12" />
                                </button>
                            </div>
                        </div>
                        <div className="text-sm text-base-content/50 whitespace-nowrap">
                            {dayjs(notification.createTime).fromNow()}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
} 