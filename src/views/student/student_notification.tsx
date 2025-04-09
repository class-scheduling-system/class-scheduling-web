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

import React, { useState, useEffect } from 'react';
import { CardComponent } from '../../components/card_component';
import { Check, Delete, Time, Refresh, CloseSmall } from '@icon-park/react';

// 通知类型定义
interface NotificationInfo {
  id: string;
  title: string;
  content: string;
  time: string;
  type: 'system' | 'course' | 'exam' | 'other';
  read: boolean;
}

// 模拟通知数据
const mockNotifications: NotificationInfo[] = [
  { 
    id: '1', 
    title: '系统维护通知', 
    content: '亲爱的用户，我们将于2023年10月15日凌晨2:00-4:00进行系统维护，届时选课系统将暂时无法使用。请您提前安排好相关事务，由此给您带来的不便，敬请谅解。如有疑问，请联系系统管理员。', 
    time: '2023-10-10 09:00', 
    type: 'system',
    read: false
  },
  { 
    id: '2', 
    title: '选课开始通知', 
    content: '2023-2024学年第一学期选课将于下周一（9月4日）上午10点开始，请各位同学提前查看可选课程并做好选课准备。本次选课采用"先到先得"原则，请尽早完成选课。选课有问题请咨询教务处。', 
    time: '2023-09-01 15:30', 
    type: 'course',
    read: false
  },
  { 
    id: '3', 
    title: '期末考试安排', 
    content: '2023-2024学年第一学期期末考试将于2024年1月15日开始，请各位同学查看考试安排表，做好复习准备。考试时请携带学生证和考试用品，不要迟到，祝大家考试顺利！', 
    time: '2023-12-20 10:15', 
    type: 'exam',
    read: true
  },
  { 
    id: '4', 
    title: '奖学金申请通知', 
    content: '2023-2024学年奖学金申请现已开始，请符合条件的同学于10月30日前提交申请材料。申请表可在学生事务中心网站下载，如有疑问请咨询学生工作处。', 
    time: '2023-10-05 14:00', 
    type: 'other',
    read: true
  },
];

// 通知类型映射表
const typeColorMap = {
  system: 'badge-secondary',
  course: 'badge-primary',
  exam: 'badge-warning',
  other: 'badge-success'
};

const typeNameMap = {
  system: '系统',
  course: '课程',
  exam: '考试',
  other: '其他'
};

export const StudentNotification: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [notifications, setNotifications] = useState<NotificationInfo[]>([]);
  const [currentNotification, setCurrentNotification] = useState<NotificationInfo | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  useEffect(() => {
    // 设置文档标题
    document.title = '通知中心 - 学生选课系统';
    
    // 模拟加载数据
    const fetchData = async () => {
      // 在实际应用中，这里应该调用API获取通知数据
      // const response = await GetNotificationsAPI();
      // if (response?.code === 200) {
      //   setNotifications(response.data);
      // }
      
      // 使用模拟数据
      setTimeout(() => {
        setNotifications(mockNotifications);
        setLoading(false);
      }, 1000);
    };
    
    fetchData();
  }, []);
  
  // 处理查看通知详情
  const handleViewNotification = (notification: NotificationInfo) => {
    setCurrentNotification(notification);
    setIsModalVisible(true);
    
    // 如果通知未读，标记为已读
    if (!notification.read) {
      handleMarkAsRead(notification.id);
    }
  };
  
  // 处理标记通知为已读
  const handleMarkAsRead = (id: string) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
    
    // 在实际应用中，应该调用API更新通知状态
    // await MarkNotificationAsReadAPI(id);
    
    // 显示成功提示
    const messageElement = document.createElement('div');
    messageElement.className = 'toast toast-top toast-center';
    messageElement.innerHTML = `
      <div class="alert alert-success">
        <span>通知已标记为已读</span>
      </div>
    `;
    document.body.appendChild(messageElement);
    setTimeout(() => document.body.removeChild(messageElement), 2000);
  };
  
  // 处理删除通知
  const handleDeleteNotification = (id: string) => {
    setNotifications(prevNotifications => 
      prevNotifications.filter(notification => notification.id !== id)
    );
    
    // 在实际应用中，应该调用API删除通知
    // await DeleteNotificationAPI(id);
    
    // 显示成功提示
    const messageElement = document.createElement('div');
    messageElement.className = 'toast toast-top toast-center';
    messageElement.innerHTML = `
      <div class="alert alert-success">
        <span>通知已删除</span>
      </div>
    `;
    document.body.appendChild(messageElement);
    setTimeout(() => document.body.removeChild(messageElement), 2000);
  };
  
  // 处理标记所有通知为已读
  const handleMarkAllAsRead = () => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
    
    // 在实际应用中，应该调用API批量更新通知状态
    // await MarkAllNotificationsAsReadAPI();
    
    // 显示成功提示
    const messageElement = document.createElement('div');
    messageElement.className = 'toast toast-top toast-center';
    messageElement.innerHTML = `
      <div class="alert alert-success">
        <span>所有通知已标记为已读</span>
      </div>
    `;
    document.body.appendChild(messageElement);
    setTimeout(() => document.body.removeChild(messageElement), 2000);
  };
  
  // 筛选通知
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return true;
  });
  
  // 未读通知数量
  const unreadCount = notifications.filter(notification => !notification.read).length;

  return (
    <div className="container mx-auto p-4">
      <CardComponent>
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              <span className="text-xl font-bold">通知中心</span>
              {unreadCount > 0 && (
                <div className="badge badge-primary">{unreadCount}</div>
              )}
            </div>
            <div className="flex gap-2">
              <button 
                className="btn btn-primary btn-sm gap-1"
                onClick={handleMarkAllAsRead}
                disabled={unreadCount === 0}
              >
                <Check theme="outline" size="18" />
                全部已读
              </button>
              <div className="join">
                <button 
                  onClick={() => setFilter('all')} 
                  className={`btn btn-sm join-item ${filter === 'all' ? 'btn-active' : ''}`}
                >
                  全部
                </button>
                <button 
                  onClick={() => setFilter('unread')} 
                  className={`btn btn-sm join-item ${filter === 'unread' ? 'btn-active' : ''}`}
                >
                  未读
                </button>
                <button 
                  onClick={() => setFilter('read')} 
                  className={`btn btn-sm join-item ${filter === 'read' ? 'btn-active' : ''}`}
                >
                  已读
                </button>
              </div>
              <button 
                className="btn btn-outline btn-sm" 
                onClick={() => {
                  setLoading(true);
                  setTimeout(() => {
                    setNotifications(mockNotifications);
                    setLoading(false);
                  }, 1000);
                }}
              >
                <Refresh theme="outline" size="18" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="w-3/4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse mb-1 w-full"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                      <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredNotifications.length > 0 ? (
            <div className="space-y-4">
              {filteredNotifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`border rounded-lg p-4 hover:bg-base-200 transition-colors cursor-pointer ${!notification.read ? 'bg-primary/5 border-primary/20' : ''}`}
                  onClick={() => handleViewNotification(notification)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`badge ${typeColorMap[notification.type]}`}>{typeNameMap[notification.type]}</span>
                        <h3 className="text-lg font-semibold">{notification.title}</h3>
                        {!notification.read && (
                          <span className="badge badge-primary">新</span>
                        )}
                      </div>
                      <p className="text-gray-600 mt-1 line-clamp-2">{notification.content}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button 
                        className="btn btn-ghost btn-xs btn-circle"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(notification.id);
                        }}
                        disabled={notification.read}
                      >
                        <Check theme="outline" size="16" />
                      </button>
                      <button 
                        className="btn btn-ghost btn-xs btn-circle text-error"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNotification(notification.id);
                        }}
                      >
                        <Delete theme="outline" size="16" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mt-2">
                    <Time theme="outline" size="14" className="mr-1" />
                    <span>{notification.time}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-gray-400 mb-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              <p className="text-gray-500">暂无通知</p>
            </div>
          )}
        </div>
      </CardComponent>
      
      {isModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-base-100 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold">{currentNotification?.title}</h3>
              <button 
                className="btn btn-ghost btn-sm btn-circle"
                onClick={() => setIsModalVisible(false)}
              >
                <CloseSmall theme="outline" size="20" />
              </button>
            </div>
            
            {currentNotification && (
              <div className="p-6">
                <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
                  <span className={`badge ${typeColorMap[currentNotification.type]}`}>
                    {typeNameMap[currentNotification.type]}
                  </span>
                  <span className="ml-auto flex items-center gap-1">
                    <Time theme="outline" size="14" />
                    {currentNotification.time}
                  </span>
                </div>
                <div className="whitespace-pre-line mb-6">{currentNotification.content}</div>
                
                <div className="flex justify-end gap-2 mt-4">
                  <button 
                    className="btn btn-error btn-sm"
                    onClick={() => {
                      if (currentNotification) {
                        handleDeleteNotification(currentNotification.id);
                        setIsModalVisible(false);
                      }
                    }}
                  >
                    <Delete theme="outline" size="16" />
                    删除
                  </button>
                  <button 
                    className="btn btn-sm"
                    onClick={() => setIsModalVisible(false)}
                  >
                    关闭
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentNotification; 