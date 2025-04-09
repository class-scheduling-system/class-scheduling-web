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
import { Skeleton, message, Modal, Tag, Space, Card, Table, Select } from "antd";
import { Calendar, Refresh } from "@icon-park/react";
import { CardComponent } from "../../components/card_component";
import { SemesterEntity } from "../../models/entity/semester_entity";
import { GetSemesterListAPI } from "../../apis/semester_api";
import { GetStudentCourseScheduleAPI } from "../../apis/course_schedule_api";
import { ScheduleItemEntity } from "../../models/entity/course_schedule_entity";
import { formatTimeSlot } from "../../utils/time_utils";
import type { ColumnType } from 'antd/es/table';

// 行数据类型
interface RowType {
  key: number;
  timeSlot: string;
  [key: `day${number}`]: React.ReactNode;
}

// 为课程生成一个唯一的颜色（基于课程UUID）
const generateCourseColor = (courseId: string, courseName: string, courseUuid: string): {
    backgroundColor: string;
    borderColor: string;
    color: string;
} => {
    // 使用课程UUID作为主要种子，确保唯一性
    // 即使课程名称相同但教学班不同，也会有不同的颜色
    const seed = courseUuid || (courseId + courseName);
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // 生成淡青色范围内的HSL颜色
    const hue = 160 + (Math.abs(hash) % 40);  // 160-200 范围的色相（青色附近）
    const saturation = 60 + (hash % 20);      // 60-80%范围的饱和度
    const lightness = 80 + (hash % 10);       // 80-90%范围的亮度，确保是淡色
    
    return {
        backgroundColor: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
        borderColor: `hsl(${hue}, ${saturation}%, ${lightness - 10}%)`,
        color: `hsl(${hue}, ${saturation + 10}%, 25%)`,
    };
};

// 课程信息类型
interface CourseInfo {
    id: string;
    courseName: string;
    courseId: string;
    teacherName: string;
    location: string;
    weekday: number;
    startSection: number;
    endSection: number;
    weeks: number[];
    type: string;
    campus: string;
    building: string;
    classroomType?: string;  // 教室类型（普通/多媒体/实验室等）
    classHours?: number;     // 总课时
    creditHourType?: string; // 学时类型名称
    consecutiveSessions?: number; // 连续课时数
}

// 时间段配置
const timeSlots = [
    { section: 1, start: "08:00", end: "08:45" },
    { section: 2, start: "08:55", end: "09:40" },
    { section: 3, start: "10:00", end: "10:45" },
    { section: 4, start: "10:55", end: "11:40" },
    { section: 5, start: "14:00", end: "14:45" },
    { section: 6, start: "14:55", end: "15:40" },
    { section: 7, start: "16:00", end: "16:45" },
    { section: 8, start: "16:55", end: "17:40" },
    { section: 9, start: "19:00", end: "19:45" },
    { section: 10, start: "19:55", end: "20:40" },
    { section: 11, start: "20:50", end: "21:35" },
    { section: 12, start: "21:45", end: "22:30" }
];

/**
 * 学生课程表页面组件
 * 
 * @param site 站点信息
 * @returns 学生课程表页面
 */
export function StudentCourseSchedule({ site }: Readonly<{ site?: SiteInfoEntity }>): JSX.Element {
    const [loading, setLoading] = useState<boolean>(true);
    const [semesters, setSemesters] = useState<SemesterEntity[]>([]);
    const [currentSemester, setCurrentSemester] = useState<SemesterEntity | null>(null);
    const [currentWeek, setCurrentWeek] = useState<number>(1);
    const [totalWeeks, setTotalWeeks] = useState<number>(20);
    const [schedules, setSchedules] = useState<CourseInfo[]>([]);
    const [courseDetailVisible, setCourseDetailVisible] = useState<boolean>(false);
    const [selectedCourse, setSelectedCourse] = useState<CourseInfo | null>(null);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [courseBgColorCache, setCourseBgColorCache] = useState<Record<string, {
        backgroundColor: string;
        borderColor: string;
        color: string;
    }>>({});

    // 获取课程对应的颜色样式
    const getCourseStyle = (course: CourseInfo): {
        backgroundColor: string;
        borderColor: string;
        color: string;
    } => {
        // 使用课程ID（uuid）作为缓存键，确保唯一性
        const cacheKey = course.id;
        if (!courseBgColorCache[cacheKey]) {
            const newCache = {...courseBgColorCache};
            newCache[cacheKey] = generateCourseColor(course.courseId, course.courseName, course.id);
            setCourseBgColorCache(newCache);
            return newCache[cacheKey];
        }
        return courseBgColorCache[cacheKey];
    };

    // 获取学期列表
    useEffect(() => {
        const fetchSemesters = async () => {
            try {
                const response = await GetSemesterListAPI();
                if (response?.output === "Success" && response.data) {
                    setSemesters(response.data);
                    if (response.data.length > 0) {
                        const latestSemester = response.data[0];
                        setCurrentSemester(latestSemester);
                        
                        // 计算当前周次
                        if (latestSemester.start_date) {
                            const startDate = new Date(latestSemester.start_date);
                            const currentDate = new Date();
                            const diffTime = Math.abs(currentDate.getTime() - startDate.getTime());
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                            const weekNumber = Math.floor(diffDays / 7) + 1;
                            
                            if (weekNumber > 30) {
                                setCurrentWeek(1); // 如果学期已结束，默认显示第1周
                            } else {
                                setCurrentWeek(weekNumber > 0 ? weekNumber : 1);
                                setTotalWeeks(20); // 默认20周
                            }
                        }
                    }
                } else {
                    message.error(response?.error_message ?? "获取学期列表失败");
                }
            } catch (error) {
                console.error("获取学期列表失败", error);
                message.error("获取学期列表失败");
            }
        };

        fetchSemesters();
        document.title = `学生课程表 | ${site?.name ?? "Frontleaves Technology"}`;
    }, [site?.name]);

    useEffect(() => {
        if (currentSemester) {
            fetchScheduleData();
        }
    }, [currentSemester]);

    const fetchScheduleData = async () => {
        setLoading(true)
        try {
            const response = await GetStudentCourseScheduleAPI(currentSemester?.semester_uuid || "")
            if (response && response.data) {
                // 转换响应数据到课程信息格式
                const courseData = response.data.schedule_items.map((item: ScheduleItemEntity) => {
                    const courseName = item.course_name || "";
                    
                    // 确定教室类型
                    let classroomType = "普通教室";
                    if (item.classroom_name) {
                        if (item.classroom_name.includes("实验")) classroomType = "实验室";
                        else if (item.classroom_name.includes("机房")) classroomType = "计算机教室";
                        else if (item.classroom_name.includes("多媒体")) classroomType = "多媒体教室";
                        else if (item.classroom_name.includes("阶梯")) classroomType = "阶梯教室";
                        else if (item.classroom_name.includes("演讲")) classroomType = "演讲厅";
                    }
                    
                    return {
                        id: item.class_assignment_uuid,
                        courseName: courseName,
                        courseId: item.course_uuid,
                        teacherName: item.teacher_name,
                        location: item.classroom_name,
                        weekday: item.day_of_week,
                        startSection: item.start_slot,
                        endSection: item.end_slot,
                        weeks: [item.week],
                        // 使用课程名称作为类型，确保相同课程有相同颜色
                        type: courseName,
                        campus: item.campus_name || "未知校区",
                        building: item.building_name || "未知教学楼",
                        classroomType: classroomType,
                        classHours: item.total_hours,
                        creditHourType: item.credit_hour_type_name,
                        consecutiveSessions: item.consecutive_sessions
                    };
                });
                
                setSchedules(courseData);
                
                // 计算最大周次
                const maxWeek = Math.max(...response.data.schedule_items.map((item: ScheduleItemEntity) => item.week));
                setTotalWeeks(Math.max(maxWeek, 20)); // 至少20周
            } else {
                message.error("获取课程表数据失败");
            }
        } catch (error) {
            console.error("获取课程表数据失败", error);
            message.error("获取课程表数据失败");
        } finally {
            setLoading(false);
        }
    };

    const handleSemesterChange = (value: string) => {
        const semester = semesters.find(s => s.semester_uuid === value);
        if (semester) {
            setCurrentSemester(semester);
        }
    }

    // 获取当前日期是否在课程周次中
    const isCurrentDay = (day: number): boolean => {
        const now = new Date();
        return now.getDay() === (day % 7);
    };

    // 渲染周选择器
    const renderWeekSelect = () => {
        return (
            <div style={{ width: "200px" }}>
                <Select
                    style={{ width: "100%" }}
                    value={currentWeek}
                    onChange={(value) => setCurrentWeek(value)}
                >
                    {
                        Array.from({ length: totalWeeks }, (_, i) => ({
                            value: i + 1,
                            label: `第${i + 1}周`
                        })).map((week) => {
                            return (
                                <Select.Option key={week.value} value={week.value}>{week.label}</Select.Option>
                            )
                        })
                    }
                </Select>
            </div>
        )
    }

    // 获取当前周的课程
    const getCurrentWeekSchedules = () => {
        if (currentWeek === 0) {
            return schedules; // 显示所有周的课程
        }
        
        // 筛选包含当前周的课程
        return schedules.filter(course => course.weeks.includes(currentWeek));
    };

    // 按星期几和时间段对课程表项进行分组
    const groupScheduleByDayAndTime = () => {
        if (!schedules || schedules.length === 0) return []

        const groupedData: RowType[] = []
        
        // 过滤出当前选择周次的课程
        const filteredItems = currentWeek
            ? schedules.filter(item => item.weeks.includes(currentWeek))
            : schedules
        
        // 为每个时间段创建行
        const maxTimeSlot = 12 // 假设最多12个时间段
        for (let timeSlot = 1; timeSlot <= maxTimeSlot; timeSlot++) {
            const row = { key: timeSlot, timeSlot: `第${timeSlot}节` } as RowType
            
            // 为每天创建单元格
            for (let day = 1; day <= 7; day++) {
                // 找出当前时间段的课程
                const coursesInThisSlot = filteredItems.filter(
                    item => item.weekday === day && 
                           item.startSection <= timeSlot && 
                           item.endSection >= timeSlot
                )
                
                // 检查是否为连堂课的起始节次
                const isStartOfCourse = coursesInThisSlot.some(
                    item => item.startSection === timeSlot
                )
                
                // 只在课程开始的时间段渲染课程卡片，避免重复渲染
                if (coursesInThisSlot.length > 0) {
                    // 找出此时间段的所有课程（如果有多个排课）
                    const uniqueCourses = coursesInThisSlot.filter(
                        (course, index, self) => 
                            index === self.findIndex(c => c.id === course.id)
                    )
                    
                    if (isStartOfCourse) {
                        row[`day${day}`] = (
                            <Space direction="vertical" style={{ width: '100%' }}>
                                {uniqueCourses.map((course, index) => renderCourseCard(course, index))}
                            </Space>
                        )
                    } else {
                        // 对于连堂课的非起始节次，不渲染内容
                        row[`day${day}`] = null
                    }
                } else {
                    row[`day${day}`] = null
                }
            }
            
            groupedData.push(row)
        }
        
        return groupedData
    }

    // 渲染课程卡片
    const renderCourseCard = (course: CourseInfo, index: number) => {
        const rowSpan = course.endSection - course.startSection + 1;
        
        // 设置卡片高度
        const cardHeight = rowSpan * 50 - 10 // 每行高度50px，减去一些间距
        
        const cardStyle: React.CSSProperties = {
            height: cardHeight,
            padding: '4px',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: getCourseStyle(course).backgroundColor,
            color: getCourseStyle(course).color,
            borderRadius: '4px',
            overflow: 'hidden',
            borderLeft: `3px solid ${getCourseStyle(course).borderColor}`
        }
        
        return (
            <Card
                key={`${course.id}-${index}`}
                onClick={() => {
                    setSelectedCourse(course);
                    setCourseDetailVisible(true);
                }}
                style={cardStyle}
                className="course-card"
                hoverable
                size="small"
                bodyStyle={{ 
                    padding: '4px 8px', 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                }}
            >
                <div className="course-header mb-1">
                    <div className="font-semibold text-sm truncate">{course.courseName}</div>
                    <div className="text-xs truncate">
                        {course.location}
                        {course.classroomType && (
                            <span className="ml-1 bg-purple-100 text-purple-800 rounded px-1 text-[10px]">
                                {course.classroomType}
                            </span>
                        )}
                    </div>
                </div>
                <div className="course-footer">
                    <div>
                        <Tag color="blue">{course.teacherName}</Tag>
                    </div>
                    <div>
                        <Tag color="green">{course.campus}</Tag>
                        <Tag color="orange">{course.building}</Tag>
                    </div>
                </div>
            </Card>
        );
    };

    const columns: ColumnType<RowType>[] = [
        { 
            title: '时间\\星期', 
            dataIndex: 'timeSlot', 
            key: 'timeSlot', 
            width: 80,
            fixed: 'left',
            className: 'time-column'
        },
        { title: '周一', dataIndex: 'day1', key: 'day1', width: 150 },
        { title: '周二', dataIndex: 'day2', key: 'day2', width: 150 },
        { title: '周三', dataIndex: 'day3', key: 'day3', width: 150 },
        { title: '周四', dataIndex: 'day4', key: 'day4', width: 150 },
        { title: '周五', dataIndex: 'day5', key: 'day5', width: 150 },
        { title: '周六', dataIndex: 'day6', key: 'day6', width: 150 },
        { title: '周日', dataIndex: 'day7', key: 'day7', width: 150 },
    ]

    // 格式化周次显示
    const formatWeeks = (weeks: number[]): string => {
        if (weeks.length === 0) return "无";
        if (weeks.length === 1) return `第${weeks[0]}周`;
        
        weeks.sort((a, b) => a - b);
        
        // 检查是否为连续周
        const ranges: string[] = [];
        let start = weeks[0];
        let end = weeks[0];
        
        for (let i = 1; i < weeks.length; i++) {
            if (weeks[i] === end + 1) {
                end = weeks[i];
            } else {
                ranges.push(start === end ? `${start}` : `${start}-${end}`);
                start = end = weeks[i];
            }
        }
        ranges.push(start === end ? `${start}` : `${start}-${end}`);
        
        // 检查是否为单双周模式
        const isEvenWeeks = weeks.every(w => w % 2 === 0);
        const isOddWeeks = weeks.every(w => w % 2 === 1);
        
        if (isEvenWeeks && weeks.length > 2) {
            const min = Math.min(...weeks);
            const max = Math.max(...weeks);
            return `${min}-${max}周(双)`;
        }
        
        if (isOddWeeks && weeks.length > 2) {
            const min = Math.min(...weeks);
            const max = Math.max(...weeks);
            return `${min}-${max}周(单)`;
        }
        
        return ranges.join(", ");
    };

    // 修复课程详情模态框标题
    const renderModalTitle = () => {
        if (!selectedCourse) return <span>课程详情</span>;
        
        return (
            <div className="flex items-center gap-2">
                <span className="text-lg">{selectedCourse.courseName}</span>
                <span 
                    className="px-2 py-1 rounded text-xs"
                    style={{ 
                        backgroundColor: getCourseStyle(selectedCourse).backgroundColor,
                        color: getCourseStyle(selectedCourse).color,
                        borderLeft: `3px solid ${getCourseStyle(selectedCourse).borderColor}`
                    }}
                >
                    {selectedCourse.type}
                </span>
            </div>
        );
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* 标题和操作区 */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-primary-content flex items-center gap-2">
                    <Calendar theme="outline" size="24" className="text-primary" />
                    <span>学生课程表</span>
                </h1>
                
                <div className="flex flex-wrap gap-2">
                    <select 
                        className="select select-bordered select-sm md:select-md"
                        value={currentSemester?.semester_uuid}
                        onChange={(e) => handleSemesterChange(e.target.value)}
                        disabled={loading || semesters.length === 0}
                    >
                        {semesters.length === 0 ? (
                            <option value="">暂无学期数据</option>
                        ) : (
                            semesters.map((semester) => (
                                <option key={semester.semester_uuid} value={semester.semester_uuid}>
                                    {semester.name}
                                </option>
                            ))
                        )}
                    </select>
                    
                    <button 
                        className="btn btn-sm md:btn-md btn-primary btn-outline flex items-center gap-1"
                        onClick={() => fetchScheduleData()}
                        disabled={loading}
                    >
                        <Refresh theme="outline" size="16" />
                        <span className="hidden md:inline">刷新</span>
                    </button>

                    <div className="btn-group">
                        <button 
                            className={`btn btn-sm md:btn-md ${viewMode === 'grid' ? 'btn-active' : ''}`}
                            onClick={() => setViewMode('grid')}
                        >
                            网格视图
                        </button>
                        <button 
                            className={`btn btn-sm md:btn-md ${viewMode === 'list' ? 'btn-active' : ''}`}
                            onClick={() => setViewMode('list')}
                        >
                            列表视图
                        </button>
                    </div>
                </div>
            </div>

            {/* 课程表内容 */}
            <CardComponent>
                {loading ? (
                    <div className="p-8">
                        <Skeleton active paragraph={{ rows: 10 }} />
                    </div>
                ) : schedules.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Calendar theme="outline" size="64" className="text-base-content/40" />
                        <p className="text-base-content/60 mt-4 text-lg">暂无课程安排</p>
                        <p className="text-base-content/40 mt-2">请检查学期选择或刷新课表</p>
                    </div>
                ) : (
                    <div className="p-4">
                        {/* 这里将根据viewMode显示不同的视图 */}
                        {viewMode === 'grid' ? (
                            <div className="overflow-x-auto">
                                {/* 周选择器 */}
                                {renderWeekSelect()}
                                
                                <Table 
                                    dataSource={groupScheduleByDayAndTime()} 
                                    columns={columns} 
                                    pagination={false}
                                    bordered
                                    size="middle"
                                    scroll={{ x: 'max-content' }}
                                    className="course-schedule-table"
                                />
                            </div>
                        ) : (
                            <div className="mt-4">
                                {/* 周选择器 */}
                                {renderWeekSelect()}
                                
                                {/* 按日期分组显示课程 */}
                                <div className="space-y-4">
                                    {[1, 2, 3, 4, 5, 6, 7].map(day => {
                                        const dayCourses = getCurrentWeekSchedules().filter(course => 
                                            course.weekday === day
                                        );
                                        
                                        return (
                                            <div key={`day-${day}`} className="border rounded-lg overflow-hidden">
                                                <div className={`p-3 ${isCurrentDay(day) ? 'bg-primary/10 text-primary' : 'bg-base-200'}`}>
                                                    <h3 className="text-lg font-medium">
                                                        {['周一', '周二', '周三', '周四', '周五', '周六', '周日'][day - 1]}
                                                    </h3>
                                                </div>
                                                
                                                {dayCourses.length === 0 ? (
                                                    <div className="p-6 text-center text-base-content/60">
                                                        无课程安排
                                                    </div>
                                                ) : (
                                                    <div className="divide-y">
                                                        {dayCourses.sort((a, b) => a.startSection - b.startSection).map(course => (
                                                            <Card 
                                                                key={course.id}
                                                                className="mb-2"
                                                                style={{ 
                                                                    marginBottom: "10px",
                                                                    backgroundColor: getCourseStyle(course).backgroundColor,
                                                                    color: getCourseStyle(course).color,
                                                                    borderColor: getCourseStyle(course).borderColor,
                                                                    borderLeftWidth: "4px"
                                                                }}
                                                                onClick={() => {
                                                                    setSelectedCourse(course);
                                                                    setCourseDetailVisible(true);
                                                                }}
                                                                hoverable
                                                            >
                                                                <div className="flex justify-between items-start">
                                                                    <div>
                                                                        <h4 className="font-medium">{course.courseName}</h4>
                                                                        <div className="mt-1 space-y-1">
                                                                            <div className="text-sm flex items-center gap-2">
                                                                                <span className="opacity-70">授课教师:</span>
                                                                                <span>{course.teacherName}</span>
                                                                            </div>
                                                                            <div className="text-sm flex items-center gap-2">
                                                                                <span className="opacity-70">上课地点:</span>
                                                                                <span>
                                                                                    {course.location}
                                                                                    {course.classroomType && (
                                                                                        <span className="ml-1 text-xs bg-purple-100 text-purple-800 rounded px-1">
                                                                                            {course.classroomType}
                                                                                        </span>
                                                                                    )}
                                                                                </span>
                                                                            </div>
                                                                            <div className="mt-2">
                                                                                <Space size={[0, 8]} wrap>
                                                                                    <Tag 
                                                                                        style={{ 
                                                                                            backgroundColor: getCourseStyle(course).backgroundColor,
                                                                                            color: getCourseStyle(course).color,
                                                                                            borderColor: getCourseStyle(course).borderColor,
                                                                                            opacity: 0.9
                                                                                        }}
                                                                                    >
                                                                                        {course.type}
                                                                                    </Tag>
                                                                                    <Tag color="green">{course.campus}</Tag>
                                                                                    <Tag color="orange">{course.building}</Tag>
                                                                                    {course.creditHourType && (
                                                                                        <Tag color="cyan">{course.creditHourType}</Tag>
                                                                                    )}
                                                                                    {course.classHours && (
                                                                                        <Tag color="purple">{course.classHours}学时</Tag>
                                                                                    )}
                                                                                </Space>
                                                                            </div>
                                                                            {currentWeek === 0 && (
                                                                                <div className="text-sm flex items-center gap-2 mt-2">
                                                                                    <span className="opacity-70">周次:</span>
                                                                                    <span>{formatWeeks(course.weeks)}</span>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <div className="text-sm font-medium">
                                                                            {formatTimeSlot(course.startSection, course.endSection)}
                                                                        </div>
                                                                        <div className="text-xs opacity-75 mt-1">
                                                                            {timeSlots.find(t => t.section === course.startSection)?.start} - 
                                                                            {timeSlots.find(t => t.section === course.endSection)?.end}
                                                                        </div>
                                                                        <div className="relative mt-2">
                                                                            <Tag color="magenta">{course.teacherName}</Tag>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </Card>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </CardComponent>

            {/* 课程详情模态框 */}
            <Modal
                title={renderModalTitle()}
                open={courseDetailVisible}
                onCancel={() => setCourseDetailVisible(false)}
                footer={null}
                width={600}
            >
                {selectedCourse && (
                    <div className="space-y-4">
                        {/* 基本信息区 */}
                        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                            <div>
                                <div className="text-sm opacity-70">课程代码</div>
                                <div className="font-medium">{selectedCourse.courseId}</div>
                            </div>
                            <div>
                                <div className="text-sm opacity-70">授课教师</div>
                                <div className="font-medium">
                                    <Tag color="magenta">{selectedCourse.teacherName}</Tag>
                                </div>
                            </div>
                            <div>
                                <div className="text-sm opacity-70">校区</div>
                                <div className="font-medium">
                                    <Tag color="green">{selectedCourse.campus}</Tag>
                                </div>
                            </div>
                            <div>
                                <div className="text-sm opacity-70">教学楼</div>
                                <div className="font-medium">
                                    <Tag color="orange">{selectedCourse.building}</Tag>
                                </div>
                            </div>
                            <div>
                                <div className="text-sm opacity-70">教室</div>
                                <div className="font-medium">
                                    <div className="flex items-center gap-1">
                                        <Tag color="blue">{selectedCourse.location}</Tag>
                                        {selectedCourse.classroomType && (
                                            <Tag color="purple">{selectedCourse.classroomType}</Tag>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="text-sm opacity-70">课程类型</div>
                                <div className="font-medium">
                                    <Tag 
                                        style={{ 
                                            backgroundColor: getCourseStyle(selectedCourse).backgroundColor,
                                            color: getCourseStyle(selectedCourse).color,
                                            borderColor: getCourseStyle(selectedCourse).borderColor
                                        }}
                                    >
                                        {selectedCourse.type}
                                    </Tag>
                                </div>
                            </div>
                        </div>
                        
                        {/* 上课时间区 */}
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <h3 className="text-base font-medium mb-3 text-blue-600">上课时间</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-sm opacity-70">星期</div>
                                    <div className="font-medium">
                                        {['周一', '周二', '周三', '周四', '周五', '周六', '周日'][selectedCourse.weekday - 1]}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm opacity-70">节次</div>
                                    <div className="font-medium">{formatTimeSlot(selectedCourse.startSection, selectedCourse.endSection)}</div>
                                </div>
                                <div>
                                    <div className="text-sm opacity-70">具体时间</div>
                                    <div className="font-medium">
                                        {timeSlots.find(t => t.section === selectedCourse.startSection)?.start} - 
                                        {timeSlots.find(t => t.section === selectedCourse.endSection)?.end}
                                    </div>
                                </div>
                                {selectedCourse.consecutiveSessions && (
                                    <div>
                                        <div className="text-sm opacity-70">连续课时</div>
                                        <div className="font-medium">
                                            <Tag color="gold">{selectedCourse.consecutiveSessions}节连堂课</Tag>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        {/* 学时信息区 */}
                        {(selectedCourse.creditHourType || selectedCourse.classHours) && (
                            <div className="p-4 bg-purple-50 rounded-lg">
                                <h3 className="text-base font-medium mb-3 text-purple-600">课时信息</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {selectedCourse.creditHourType && (
                                        <div>
                                            <div className="text-sm opacity-70">学时类型</div>
                                            <div className="font-medium">
                                                <Tag color="cyan">{selectedCourse.creditHourType}</Tag>
                                            </div>
                                        </div>
                                    )}
                                    {selectedCourse.classHours && (
                                        <div>
                                            <div className="text-sm opacity-70">总课时</div>
                                            <div className="font-medium">
                                                <Tag color="purple">{selectedCourse.classHours}学时</Tag>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        
                        {/* 周次信息区 */}
                        <div className="p-4 bg-green-50 rounded-lg">
                            <h3 className="text-base font-medium mb-3 text-green-600">上课周次</h3>
                            <div className="flex flex-wrap gap-1">
                                {selectedCourse.weeks.sort((a, b) => a - b).map(week => (
                                    <span 
                                        key={week} 
                                        className={`inline-block px-2 py-1 rounded-full text-xs ${
                                            week === currentWeek 
                                                ? 'bg-primary text-white' 
                                                : 'bg-base-200'
                                        }`}
                                    >
                                        {week}
                                    </span>
                                ))}
                            </div>
                            <div className="mt-2 text-xs opacity-70">
                                {formatWeeks(selectedCourse.weeks)}
                            </div>
                        </div>
                        
                        <div className="flex justify-end gap-2 pt-4">
                            <button 
                                className="btn btn-primary"
                                onClick={() => setCourseDetailVisible(false)}
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

export default StudentCourseSchedule 