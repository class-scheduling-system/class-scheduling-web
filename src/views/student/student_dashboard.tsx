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
import { StudentEntity } from "../../models/entity/student_entity";
import { UserInfoEntity } from "../../models/entity/user_info_entity";
import { useSelector } from "react-redux";
import { Book, Calendar, DocumentFolder, Me, Bookshelf, ExternalTransmission, Message, BuildingOne, School, User } from "@icon-park/react";
import { Link } from "react-router";
import { Skeleton, message } from "antd";
import { GetClassroomAPI } from "../../apis/classroom_api";
import { GetAllAdministrativeClassListAPI } from "../../apis/administrative_class_api";
import { GetDepartmentAPI } from "../../apis/department_api";
import { GetMajorInfoAPI } from "../../apis/major_api";
import { ClassroomInfoEntity } from "../../models/entity/classroom_info_entity";
import { AdministrativeClassEntity } from "../../models/entity/administrative_class_entity";
import { DepartmentEntity } from "../../models/entity/department_entity";
import { MajorEntity } from "../../models/entity/major_entity";

/**
 * 快速访问卡片组件
 */
function QuickAccessCard({ icon, title, description, link }: {
    icon: JSX.Element;
    title: string;
    description: string;
    link: string;
}): JSX.Element {
    return (
        <Link to={link} className="card bg-base-100 shadow-sm hover:shadow-md transition-all">
            <div className="card-body p-4">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg text-primary">
                        {icon}
                    </div>
                    <div className="flex-1">
                        <h3 className="card-title text-base font-semibold">{title}</h3>
                        <p className="text-sm text-base-content/70">{description}</p>
                    </div>
                </div>
            </div>
        </Link>
    );
}

/**
 * 通知卡片组件
 */
function NotificationCard({ title, date, content, isNew = false }: {
    title: string;
    date: string;
    content: string;
    isNew?: boolean;
}): JSX.Element {
    return (
        <div className="card bg-base-100 shadow-sm hover:shadow-md transition-all border border-base-200">
            <div className="card-body p-4">
                <div className="flex justify-between items-start">
                    <h3 className="card-title text-base font-semibold flex items-center gap-2">
                        {title}
                        {isNew && <span className="badge badge-sm badge-primary">新</span>}
                    </h3>
                    <span className="text-xs text-base-content/50">{date}</span>
                </div>
                <p className="text-sm text-base-content/70 line-clamp-2">{content}</p>
            </div>
        </div>
    );
}

/**
 * 学生仪表盘页面组件
 * 
 * @param site 站点信息
 * @returns 学生仪表盘页面
 */
export function StudentDashboard({ site }: Readonly<{ site: SiteInfoEntity }>): JSX.Element {
    const [loading, setLoading] = useState<boolean>(true);
    const getUser = useSelector((state: { user: UserInfoEntity }) => state.user);
    const student = getUser.student as StudentEntity;
    
    // 新增状态管理
    const [classroom, setClassroom] = useState<ClassroomInfoEntity | null>(null);
    const [administrativeClass, setAdministrativeClass] = useState<AdministrativeClassEntity | null>(null);
    const [department, setDepartment] = useState<DepartmentEntity | null>(null);
    const [major, setMajor] = useState<MajorEntity | null>(null);
    const [dataLoading, setDataLoading] = useState<boolean>(true);

    // 获取教室信息
    const fetchClassroomInfo = async () => {
        try {
            // 获取所有行政班级
            if (student?.clazz) {
                const response = await GetAllAdministrativeClassListAPI();
                if (response?.output === "Success" && response.data) {
                    // 查找学生所在的行政班级
                    const adminClass = response.data.find(c => c.administrative_class_uuid === student.clazz);
                    if (adminClass) {
                        setAdministrativeClass(adminClass);
                        
                        // 假设我们有某种方式获取班级关联的教室ID
                        // 这里使用假设的教室ID，实际中需要根据后端数据结构调整
                        // 如果没有与班级关联的教室UUID，这里可以跳过或使用其他方式获取
                        if (adminClass.administrative_class_uuid) {
                            // 这里简单演示，假设用班级ID作为教室ID获取，实际中需要调整
                            const classroomResp = await GetClassroomAPI(adminClass.administrative_class_uuid);
                            if (classroomResp?.output === "Success" && classroomResp.data) {
                                setClassroom(classroomResp.data);
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.error("获取教室信息失败", error);
            message.error("获取教室信息失败");
        }
    };

    // 获取院系信息
    const fetchDepartmentInfo = async () => {
        try {
            if (student?.department) {
                const response = await GetDepartmentAPI(student.department);
                if (response?.output === "Success" && response.data) {
                    setDepartment(response.data);
                }
            }
        } catch (error) {
            console.error("获取院系信息失败", error);
            message.error("获取院系信息失败");
        }
    };

    // 获取专业信息
    const fetchMajorInfo = async () => {
        try {
            if (student?.major) {
                const response = await GetMajorInfoAPI(student.major);
                if (response?.output === "Success" && response.data) {
                    setMajor(response.data);
                }
            }
        } catch (error) {
            console.error("获取专业信息失败", error);
            message.error("获取专业信息失败");
        }
    };

    // 加载所有数据
    const loadAllData = async () => {
        setDataLoading(true);
        try {
            await Promise.all([
                fetchClassroomInfo(),
                fetchDepartmentInfo(),
                fetchMajorInfo()
            ]);
        } finally {
            setDataLoading(false);
        }
    };

    useEffect(() => {
        document.title = `学生首页 | ${site.name ?? "Frontleaves Technology"}`;
        
        // 模拟加载
        const timer = setTimeout(() => {
            setLoading(false);
            // 当基本数据加载完成后，获取更多详细信息
            if (student) {
                loadAllData();
            }
        }, 1000);
        
        return () => clearTimeout(timer);
    }, [site.name, student]);

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* 欢迎信息 */}
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-primary-content">
                    欢迎回来，{loading ? <Skeleton.Button active size="small" /> : getUser.user?.name ?? "同学"}
                </h1>
                <p className="text-base-content/70 mt-2">
                    今天是{new Date().toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </div>

            {/* 个人信息卡 */}
            <div className="card bg-base-100 shadow-md mb-8 overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-secondary p-1"></div>
                <div className="card-body">
                    {loading ? (
                        <Skeleton active paragraph={{ rows: 4 }} />
                    ) : (
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="flex flex-col space-y-2">
                                <span className="text-sm text-base-content/60">姓名</span>
                                <span className="font-semibold">{getUser.user?.name ?? "未知"}</span>
                                <span className="text-sm text-base-content/60">学号</span>
                                <span className="font-semibold">{student?.id ?? "未分配"}</span>
                            </div>
                            <div className="flex flex-col space-y-2">
                                <span className="text-sm text-base-content/60">学院</span>
                                <span className="font-semibold">{department?.department_name ?? student?.department ?? "未知"}</span>
                                <span className="text-sm text-base-content/60">专业</span>
                                <span className="font-semibold">{major?.major_name ?? student?.major ?? "未知"}</span>
                            </div>
                            <div className="flex flex-col space-y-2">
                                <span className="text-sm text-base-content/60">班级</span>
                                <span className="font-semibold">{administrativeClass?.class_name ?? student?.clazz ?? "未知"}</span>
                                <span className="text-sm text-base-content/60">学籍状态</span>
                                <span className="font-semibold">
                                    {student?.status === 0 ? (
                                        <span className="text-success">在读</span>
                                    ) : student?.status === 1 ? (
                                        <span className="text-warning">已毕业</span>
                                    ) : (
                                        <span className="text-error">未注册</span>
                                    )}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            {/* 快速访问卡片 */}
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Bookshelf theme="outline" size="22" />
                <span>快速访问</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                <QuickAccessCard
                    icon={<Calendar theme="outline" size="24" />}
                    title="我的课表"
                    description="查看本周及未来的课程安排"
                    link="/student/schedule"
                />
                <QuickAccessCard
                    icon={<Book theme="outline" size="24" />}
                    title="选课中心"
                    description="浏览可选课程并进行选课"
                    link="/student/course"
                />
                <QuickAccessCard
                    icon={<ExternalTransmission theme="outline" size="24" />}
                    title="考试安排"
                    description="查看即将到来的考试信息"
                    link="/student/exam"
                />
                <QuickAccessCard
                    icon={<DocumentFolder theme="outline" size="24" />}
                    title="成绩查询"
                    description="查看历史学期的成绩单"
                    link="/student/grade"
                />
                <QuickAccessCard
                    icon={<Message theme="outline" size="24" />}
                    title="通知公告"
                    description="查看系统和教务处的最新通知"
                    link="/student/notification"
                />
                <QuickAccessCard
                    icon={<Me theme="outline" size="24" />}
                    title="个人信息"
                    description="查看和修改个人基本信息"
                    link="/student/profile"
                />
            </div>

            {/* 通知公告 */}
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Message theme="outline" size="22" />
                <span>最新通知</span>
            </h2>
            {loading ? (
                <div className="space-y-4">
                    <Skeleton active paragraph={{ rows: 2 }} />
                    <Skeleton active paragraph={{ rows: 2 }} />
                    <Skeleton active paragraph={{ rows: 2 }} />
                </div>
            ) : (
                <div className="grid gap-4">
                    <NotificationCard
                        title="2023-2024学年第二学期选课通知"
                        date="2024-05-15"
                        content="亲爱的同学们，2023-2024学年第二学期的选课将于5月20日开始，请各位同学及时登录选课系统进行选课。选课分为两个阶段：预选阶段（5月20日-5月25日）和正选阶段（5月26日-5月30日）。"
                        isNew={true}
                    />
                    <NotificationCard
                        title="关于调整期末考试时间的通知"
                        date="2024-05-10"
                        content="因教学楼维修工作，原定于6月15日进行的《数据结构》期末考试调整至6月18日下午14:00-16:00，考试地点不变。请相关同学周知。"
                    />
                    <NotificationCard
                        title="2024年暑期实习报名通知"
                        date="2024-05-05"
                        content="2024年暑期实习报名现已开始，有意向参加暑期实习的同学请于5月15日前向辅导员提交报名表。本次实习合作企业包括：阿里巴巴、腾讯、华为等知名企业。"
                    />
                </div>
            )}
        </div>
    );
} 