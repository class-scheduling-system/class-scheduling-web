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

import { JSX, useEffect } from "react";
import { useSelector } from "react-redux";
import { SiteInfoEntity } from "../models/entity/site_info_entity";
import { UserInfoEntity } from "../models/entity/user_info_entity";
import { Route, Routes, useLocation, useNavigate } from "react-router";
import { animated, useSpring, useTransition } from "@react-spring/web";
import { AdminNotFound } from "./404/medium_page_not_found";
import cookie from "react-cookies";
import { message } from "antd";
import { StudentNavComponent } from "../components/student/student_nav_component";
import { StudentDashboard } from "./student/student_dashboard";
import { StudentCourse } from "./student/student_course";
import { StudentExam } from "./student/student_exam";
import { StudentGrade } from "./student/student_grade";
import { StudentNotification } from "./student/student_notification";
import { StudentCourseSchedule } from "./student/student_course_schedule";

/**
 * 生成一个学生控制台组件。
 * 该函数返回一个包含学生控制台的框架页面，使用顶部导航设计。
 * @return {JSX.Element} 包含学生控制台的完整框架页面
 */
export function BaseStudent(): JSX.Element {
    const site = useSelector((state: { site: SiteInfoEntity }) => state.site);
    const getUser = useSelector((state: { user: UserInfoEntity }) => state.user);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (getUser.loading) {
            return;
        }

        // 检查用户是否已登录
        if (!getUser.user) {
            message.error("请先登录");
            navigate("/auth/login");
            return;
        }

        // 检查用户是否具有学生角色
        if (getUser.user.role.role_name !== "学生") {
            message.error("您没有学生权限");
            navigate("/");
            return;
        }

        // 重定向到仪表盘
        if (location.pathname === "/student") {
            navigate("/student/dashboard");
        }
    }, [location.pathname, navigate, getUser.user]);

    // 设置路由切换动画
    const transitions = useTransition(location, {
        from: { opacity: 0, transform: 'translateY(10px)' },
        enter: { opacity: 1, transform: 'translateY(0)' },
        config: {
            tension: 170,
            friction: 26,
        },
        key: location.pathname,
    });

    // 设置页面加载动画
    const fade = useSpring({
        opacity: 1,
        from: { opacity: 0 },
        config: { tension: 120, friction: 26 },
    });

    // 顶部菜单栏加载动画
    const topFade = useSpring({
        opacity: 1,
        transform: 'translateY(0)',
        from: { opacity: 0, transform: 'translateY(-30px)' },
        config: { tension: 150, friction: 26 },
    });

    // 底部加载动画
    const bottomFade = useSpring({
        opacity: 1,
        transform: 'translateY(0)',
        from: { opacity: 0, transform: 'translateY(30px)' },
        config: { tension: 150, friction: 26 },
    });

    return (
        <animated.div style={fade} className="h-lvh flex flex-col bg-gradient-to-br from-primary-50 to-base-100">
            {/* 顶部导航 */}
            <animated.div style={topFade} className="sticky top-0 z-30">
                <StudentNavComponent />
            </animated.div>
            

            {/* 主要内容区 */}
            <animated.div style={bottomFade} className="flex-1">
                {transitions((style, item) => (
                    <animated.div style={{ ...style, height: '100%' }}>
                        <Routes location={item}>
                            <Route path="/dashboard" element={<StudentDashboard site={site} />} />
                            <Route path="/schedule" element={<StudentCourseSchedule />} />
                            <Route path="/course" element={<StudentCourse />} />
                            <Route path="/exam" element={<StudentExam />} />
                            <Route path="/grade" element={<StudentGrade />} />
                            <Route path="/notification" element={<StudentNotification />} />
                            <Route path="/*" element={<AdminNotFound />} />
                        </Routes>
                    </animated.div>
                ))}
            </animated.div>
            
            {/* 页脚 */}
            <footer className="footer footer-center p-4 bg-base-300 text-base-content">
                <div>
                    <p>Copyright © {new Date().getFullYear()} - All rights reserved by {site.name || "Frontleaves"}</p>
                </div>
            </footer>
        </animated.div>
    );
} 