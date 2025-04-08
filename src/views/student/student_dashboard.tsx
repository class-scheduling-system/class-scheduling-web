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
import { Link } from 'react-router';
import { SiteInfoEntity } from '../../models/entity/site_info_entity';
import { useSelector } from 'react-redux';
import { UserInfoEntity } from '../../models/entity/user_info_entity';
import { CardComponent } from '../../components/card_component';
import {
  Book, Calendar, Time, User, Message, 
  Dashboard, School, Certificate, Star
} from '@icon-park/react';

/**
 * 学生仪表盘页面
 * 
 * @param site 站点信息
 * @returns 学生仪表盘页面
 */
export function StudentDashboard({ site }: Readonly<{ site?: SiteInfoEntity }>): React.ReactElement {
  const [currentTime, setCurrentTime] = useState(new Date());
  const getUser = useSelector((state: { user: UserInfoEntity }) => state.user);

  // 页面标题
  useEffect(() => {
    document.title = `学生仪表盘 | ${site?.name ?? "Frontleaves Technology"}`;
  }, [site?.name]);

  // 更新当前时间
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  // 格式化时间
  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  // 格式化日期
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const weekDay = weekDays[date.getDay()];
    return `${year}年${month}月${day}日 ${weekDay}`;
  };

  // 模拟快捷入口数据
  const quickLinks = [
    { name: '课程表', path: '/student/schedule', icon: <Calendar theme="filled" size="32" fill="#3b82f6" /> },
    { name: '选课', path: '/student/course', icon: <Book theme="filled" size="32" fill="#10b981" /> },
    { name: '考试', path: '/student/exam', icon: <School theme="filled" size="32" fill="#f59e0b" /> },
    { name: '成绩', path: '/student/grade', icon: <Certificate theme="filled" size="32" fill="#8b5cf6" /> },
    { name: '通知', path: '/student/notification', icon: <Message theme="filled" size="32" fill="#ef4444" /> }
  ];

  // 模拟待办事项数据
  const todoItems = [
    { id: 1, title: '高等数学作业', description: '完成第五章习题', deadline: '2023-06-15', status: 'pending' },
    { id: 2, title: '数据结构实验', description: '二叉树的实现与应用', deadline: '2023-06-17', status: 'pending' },
    { id: 3, title: '英语听力练习', description: '完成Unit 3的听力练习', deadline: '2023-06-14', status: 'completed' }
  ];

  // 模拟日程安排数据
  const todayClasses = [
    { id: 1, name: '高等数学', time: '08:00-09:40', location: '教学楼A301', teacher: '张教授' },
    { id: 2, name: '数据结构', time: '10:00-11:40', location: '教学楼B204', teacher: '李教授' },
    { id: 3, name: '大学英语', time: '14:00-15:40', location: '外语楼C102', teacher: '王教授' }
  ];

  // 模拟公告数据
  const announcements = [
    { id: 1, title: '关于2023-2024学年第二学期选课的通知', date: '2023-06-10', priority: 'high' },
    { id: 2, title: '期末考试安排已发布', date: '2023-06-08', priority: 'medium' },
    { id: 3, title: '图书馆开放时间调整', date: '2023-06-05', priority: 'low' }
  ];

  // 获取通知优先级样式
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <span className="badge badge-error">重要</span>;
      case 'medium':
        return <span className="badge badge-warning">普通</span>;
      case 'low':
        return <span className="badge badge-info">一般</span>;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* 欢迎区域和时间 */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
        <div className="welcome-section">
          <h1 className="text-2xl md:text-3xl font-bold text-primary-content flex items-center gap-2">
            <Dashboard theme="outline" size="28" className="text-primary" />
            <span>学生仪表盘</span>
          </h1>
          <p className="text-base-content/70 mt-2 text-lg">
            欢迎回来，<span className="font-medium text-primary">{getUser.user?.name ?? "同学"}</span>
          </p>
        </div>
        
        <div className="bg-base-200/60 rounded-lg p-4 flex flex-col md:flex-row items-center gap-6">
          <div className="flex items-center gap-2">
            <Calendar theme="outline" size="20" className="text-primary" />
            <span className="text-sm md:text-base">{formatDate(currentTime)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Time theme="outline" size="20" className="text-secondary" />
            <span className="font-mono text-sm md:text-base">{formatTime(currentTime)}</span>
          </div>
        </div>
      </div>

      {/* 快速入口区 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {quickLinks.map((link, index) => (
          <Link 
            key={index} 
            to={link.path} 
            className="bg-base-100 hover:bg-base-200/80 transition-colors rounded-lg border border-base-300 shadow-sm hover:shadow-md p-4 flex flex-col items-center justify-center gap-3"
          >
            <div className="bg-base-200/50 w-16 h-16 rounded-full flex items-center justify-center">
              {link.icon}
            </div>
            <span className="text-base font-medium">{link.name}</span>
          </Link>
        ))}
      </div>

      {/* 主要内容区 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 今日课程 */}
        <CardComponent col={3} howScreenFull="lg" className="order-2 lg:order-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Calendar theme="outline" size="18" className="text-primary" />
              <span>今日课程</span>
            </h2>
            <Link to="/student/schedule" className="text-sm text-primary hover:underline">查看全部</Link>
          </div>

          <div className="space-y-4">
            {todayClasses.length > 0 ? (
              todayClasses.map(cls => (
                <div key={cls.id} className="bg-base-200/40 rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="font-medium">{cls.name}</div>
                    <div className="font-mono text-sm">{cls.time}</div>
                  </div>
                  <div className="flex justify-between mt-2 text-sm text-base-content/70">
                    <div className="flex items-center gap-1">
                      <User theme="outline" size="14" />
                      <span>{cls.teacher}</span>
                    </div>
                    <div>{cls.location}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-base-content/50">
                <Calendar theme="outline" size="48" />
                <p className="mt-2">今日无课程安排</p>
              </div>
            )}
          </div>
        </CardComponent>

        {/* 中间区域：待办事项 */}
        <CardComponent col={3} howScreenFull="lg" className="order-1 lg:order-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Star theme="outline" size="18" className="text-primary" />
              <span>学习动态</span>
            </h2>
          </div>

          <div className="relative">
            <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-base-100 to-transparent"></div>
            
            <div className="max-h-[320px] overflow-y-auto pr-2 py-2" style={{ scrollbarWidth: 'thin' }}>
              <div className="relative border-l-2 border-primary/30 pl-4 pb-6 space-y-6">
                <div className="absolute top-0 left-0 bottom-0 w-0.5 bg-primary/20"></div>
                
                {todoItems.map(item => (
                  <div 
                    key={item.id} 
                    className={`relative ${item.status === 'completed' ? 'opacity-60' : ''}`}
                  >
                    <div className="absolute -left-[18px] top-0 w-3 h-3 rounded-full bg-primary"></div>
                    <div className={`bg-base-200/40 rounded-lg p-4 border-l-2 ${item.status === 'completed' ? 'border-success' : 'border-primary'}`}>
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">{item.title}</h3>
                        <span className={`text-xs ${item.status === 'completed' ? 'badge badge-success' : 'badge badge-primary'}`}>
                          {item.status === 'completed' ? '已完成' : '待完成'}
                        </span>
                      </div>
                      <p className="text-sm mt-1 text-base-content/70">{item.description}</p>
                      <div className="mt-2 text-xs text-base-content/60">
                        截止日期: {item.deadline}
                      </div>
                    </div>
                  </div>
                ))}

                <div className="absolute -left-[18px] bottom-0 w-3 h-3 rounded-full bg-base-300"></div>
              </div>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-base-100 to-transparent"></div>
          </div>
        </CardComponent>

        {/* 通知公告 */}
        <CardComponent col={3} howScreenFull="lg" className="order-3">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Message theme="outline" size="18" className="text-primary" />
              <span>通知公告</span>
            </h2>
            <Link to="/student/notification" className="text-sm text-primary hover:underline">查看全部</Link>
          </div>

          <div className="space-y-3">
            {announcements.map(announcement => (
              <div key={announcement.id} className="bg-base-200/40 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex justify-between items-start gap-2">
                  <div className="font-medium">{announcement.title}</div>
                  {getPriorityBadge(announcement.priority)}
                </div>
                <div className="mt-2 text-xs text-base-content/70">
                  发布时间: {announcement.date}
                </div>
              </div>
            ))}
          </div>
        </CardComponent>
      </div>
    </div>
  );
} 