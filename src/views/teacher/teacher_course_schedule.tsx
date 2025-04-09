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
import { Skeleton, message, Modal, Tooltip, Tag, Space, Card, Table } from "antd";
import { Calendar, Refresh, LeftSmall, RightSmall, PreviewOpen } from "@icon-park/react";
import { CardComponent } from "../../components/card_component";
import { SemesterEntity } from "../../models/entity/semester_entity";
import { GetSemesterListAPI } from "../../apis/semester_api";
import { GetTeacherCourseScheduleAPI } from "../../apis/course_schedule_api";
import { CourseScheduleEntity, ScheduleItemEntity } from "../../models/entity/course_schedule_entity";
import { formatTimeSlot } from "../../utils/time_utils";

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

// 课程类型颜色的缓存
// 移除外部定义的函数和缓存对象，全部放到组件内部使用useState管理

// 课程信息类型
interface CourseInfo {
    id: string;
    courseName: string;
    courseId: string;
    className: string;
    location: string;
    weekday: number;
    startSection: number;
    endSection: number;
    weeks: number[];
    type: string;
    campus: string;
    building: string;
    teacherId?: string;      // 教师ID
    teacherName?: string;    // 教师姓名
    classroomType?: string;  // 教室类型（普通/多媒体/实验室等）
    classHours?: number;     // 总课时
    creditHourType?: string; // 学时类型名称
    consecutiveSessions?: number; // 连续课时数
}

// 时间段配置（12 节）
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
 * 教师课程表页面组件
 * 
 * @param site 站点信息
 * @returns 教师课程表页面
 */
export function TeacherCourseSchedule({ site }: Readonly<{ site?: SiteInfoEntity }>): JSX.Element {
    const [loading, setLoading] = useState<boolean>(true);
    const [semesters, setSemesters] = useState<SemesterEntity[]>([]);
    const [currentSemester, setCurrentSemester] = useState<string>("");
    const [currentWeek, setCurrentWeek] = useState<number>(1);
    const [totalWeeks, setTotalWeeks] = useState<number>(20);
    const [schedules, setSchedules] = useState<CourseInfo[]>([]);
    const [courseDetailVisible, setCourseDetailVisible] = useState<boolean>(false);
    const [selectedCourse, setSelectedCourse] = useState<CourseInfo | null>(null);
    const [viewMode, setViewMode] = useState<"grid" | "list" | "table">("grid");
    const [semesterEnded, setSemesterEnded] = useState<boolean>(false);
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
                        setCurrentSemester(latestSemester.semester_uuid);
                        
                        // 计算当前周次
                        if (latestSemester.start_date) {
                            const startDate = new Date(latestSemester.start_date);
                            const currentDate = new Date();
                            const diffTime = Math.abs(currentDate.getTime() - startDate.getTime());
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                            const weekNumber = Math.floor(diffDays / 7) + 1;
                            
                            if (weekNumber > 30) {
                                setSemesterEnded(true);
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
    }, []);

    // 加载课程表数据
    useEffect(() => {
        if (currentSemester) {
            setLoading(true);

            const fetchScheduleData = async () => {
                try {
                    const response = await GetTeacherCourseScheduleAPI(currentSemester);
                    if (response && response.data) {
                        const transformedData = transformScheduleData(response.data);
                        setSchedules(transformedData);
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
            
            fetchScheduleData();
        }
    }, [currentSemester]);

    // 转换课程表数据格式
    const transformScheduleData = (data: CourseScheduleEntity): CourseInfo[] => {
        if (!data.schedule_items || data.schedule_items.length === 0) {
            return [];
        }
        
        const transformedData = data.schedule_items.map((item: ScheduleItemEntity) => {
            // 从教学班信息或其他字段中推断课程类型
            let courseType = "其他";
            if (item.teaching_class_name) {
                if (item.teaching_class_name.includes("必修")) courseType = "必修班";
                else if (item.teaching_class_name.includes("选修")) courseType = "选修班";
                else if (item.teaching_class_name.includes("实验")) courseType = "实验班";
                else if (item.teaching_class_name.includes("讨论")) courseType = "讨论班";
                else if (item.teaching_class_name.includes("辅导")) courseType = "辅导班";
                else if (item.teaching_class_name.includes("实践")) courseType = "实践班";
            }
            
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
                courseName: item.course_name,
                courseId: item.course_uuid,
                className: item.teaching_class_name,
                location: item.classroom_name,
                weekday: item.day_of_week,
                startSection: item.start_slot,
                endSection: item.end_slot,
                weeks: [item.week], // 单周，在界面上会合并显示
                type: courseType,
                campus: item.campus_name || "未知校区",
                building: item.building_name || "未知教学楼",
                teacherId: item.teacher_uuid,
                teacherName: item.teacher_name,
                classroomType: classroomType,
                classHours: item.total_hours,
                creditHourType: item.credit_hour_type_name,
                consecutiveSessions: item.consecutive_sessions
            };
        });
        
        return transformedData;
    };

    // 设置页面标题
    useEffect(() => {
        document.title = `教师课程表 | ${site?.name ?? "Frontleaves Technology"}`;
    }, [site?.name]);

    // 切换学期
    const handleSemesterChange = (semesterUuid: string) => {
        setCurrentSemester(semesterUuid);
        
        // 重置周次
        const selectedSemester = semesters.find(s => s.semester_uuid === semesterUuid);
        if (selectedSemester && selectedSemester.start_date) {
            const startDate = new Date(selectedSemester.start_date);
            const currentDate = new Date();
            const diffTime = Math.abs(currentDate.getTime() - startDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const weekNumber = Math.floor(diffDays / 7) + 1;
            
            if (weekNumber > 30) {
                setSemesterEnded(true);
                setCurrentWeek(1);
            } else {
                setSemesterEnded(false);
                setCurrentWeek(weekNumber > 0 ? weekNumber : 1);
                setTotalWeeks(20); // 默认20周
            }
        }
    };

    // 刷新课程表
    const handleRefresh = () => {
        if (currentSemester) {
            setLoading(true);
            
            const fetchScheduleData = async () => {
                try {
                    const response = await GetTeacherCourseScheduleAPI(currentSemester);
                    if (response && response.data) {
                        const transformedData = transformScheduleData(response.data);
                        setSchedules(transformedData);
                        message.success("课程表已刷新");
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
            
            fetchScheduleData();
        }
    };

    // 切换周次
    const handleWeekChange = (week: number) => {
        if (week >= 0 && week <= totalWeeks) {
            setCurrentWeek(week);
        }
    };

    // 查看课程详情
    const handleViewCourseDetail = (course: CourseInfo) => {
        setSelectedCourse(course);
        setCourseDetailVisible(true);
    };

    // 合并同一课程的周次信息
    const mergeWeekInfo = (schedules: CourseInfo[]): CourseInfo[] => {
        const mergedSchedules: Record<string, CourseInfo> = {};
        
        schedules.forEach(schedule => {
            const key = `${schedule.courseId}-${schedule.weekday}-${schedule.startSection}-${schedule.endSection}-${schedule.location}`;
            
            if (mergedSchedules[key]) {
                // 如果已存在相同课程，合并周次信息
                mergedSchedules[key].weeks = [...mergedSchedules[key].weeks, ...schedule.weeks];
            } else {
                // 否则添加新课程
                mergedSchedules[key] = { ...schedule };
            }
        });
        
        return Object.values(mergedSchedules);
    };

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

    // 获取当前周的课程
    const getCurrentWeekSchedules = () => {
        // 如果选择了全部周次(周次为0)，返回所有课程
        if (currentWeek === 0) {
            return mergeWeekInfo(schedules);
        }
        
        // 否则只返回当前周的课程
        return schedules.filter(schedule => schedule.weeks.includes(currentWeek));
    };

    // 获取星期几名称
    const getWeekdayName = (day: number): string => {
        const weekdays = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
        return weekdays[day - 1] || "";
    };

    // 判断当前日期是否在课程周次中
    const isCurrentDay = (day: number): boolean => {
        const now = new Date();
        return now.getDay() === (day % 7);
    };

    // 渲染周选择器
    const renderWeekSelector = () => {
        return (
            <div className="flex items-center justify-center my-4">
                <button 
                    className="btn btn-circle btn-sm btn-ghost"
                    onClick={() => handleWeekChange(currentWeek - 1)}
                    disabled={currentWeek <= 0}
                >
                    <LeftSmall theme="outline" size="18" />
                </button>
                <div className="mx-4 flex items-center">
                    <select
                        className="select select-bordered select-sm"
                        value={currentWeek}
                        onChange={(e) => handleWeekChange(Number(e.target.value))}
                    >
                        <option value={0}>全部周次</option>
                        {Array.from({ length: totalWeeks }, (_, i) => i + 1).map(week => (
                            <option key={week} value={week}>
                                第{week}周
                            </option>
                        ))}
                    </select>
                    {semesterEnded && (
                        <span className="ml-2 text-error text-xs text-nowrap">
                            (学期已结束)
                        </span>
                    )}
                </div>
                <button 
                    className="btn btn-circle btn-sm btn-ghost"
                    onClick={() => handleWeekChange(currentWeek + 1)}
                    disabled={currentWeek >= totalWeeks}
                >
                    <RightSmall theme="outline" size="18" />
                </button>
            </div>
        );
    };

    // 渲染课程格子
    const renderCourseCell = (weekday: number, section: number) => {
        const currentCourses = getCurrentWeekSchedules();
        const course = currentCourses.find(
            s => s.weekday === weekday && 
            section >= s.startSection && 
            section <= s.endSection
        );

        if (!course) return null;

        // 只在课程开始节次显示
        if (section !== course.startSection) return null;

        const height = (course.endSection - course.startSection + 1) * 100;
        const courseStyle = getCourseStyle(course);
    
        return (
            <div 
                className="absolute w-full border rounded-lg p-2 cursor-pointer transition-colors shadow-sm"
                style={{ 
                    height: `${height}%`, 
                    top: 0, 
                    left: 0, 
                    right: 0,
                    backgroundColor: courseStyle.backgroundColor,
                    color: courseStyle.color,
                    borderColor: courseStyle.borderColor
                }}
                onClick={() => handleViewCourseDetail(course)}
            >
                <div className="font-medium truncate">{course.courseName}</div>
                <div className="text-xs opacity-75 truncate">{course.className}</div>
                <div className="text-xs opacity-75 truncate">
                    <span className="inline-block bg-blue-100 text-blue-800 rounded px-1 mr-1">
                        {course.location}
                    </span>
                    {course.classroomType && (
                        <span className="inline-block bg-purple-100 text-purple-800 rounded px-1 text-[10px]">
                            {course.classroomType}
                        </span>
                    )}
                </div>
                {course.teacherName && (
                    <div className="text-xs opacity-75 truncate mt-1">
                        <span className="inline-block bg-green-100 text-green-800 rounded px-1 text-[10px]">
                            {course.teacherName}
                        </span>
                    </div>
                )}
                {currentWeek === 0 && (
                    <div className="text-xs opacity-75 truncate mt-1">
                        {formatWeeks(course.weeks)}
                    </div>
                )}
                <div className="absolute bottom-1 right-1">
                    <Tooltip title="查看详情">
                        <PreviewOpen size="14" className="opacity-60" />
                    </Tooltip>
                </div>
            </div>
        );
    };

    // 渲染课程类型图例
    const renderCourseTypeLegend = () => {
        return null; // 不再显示课程类型图例
    };

    // 渲染网格视图
    const renderGridView = () => {
        return (
            <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                    {/* 周选择器 */}
                    {renderWeekSelector()}

                    {/* 课程表网格 */}
                    <div className="grid grid-cols-8 gap-1 mt-2">
                        {/* 表头 */}
                        <div className="bg-base-200 rounded-tl-lg p-2 text-center text-sm font-medium">
                            时间 / 星期
                        </div>
                        
                        {/* 星期表头 */}
                        {[1, 2, 3, 4, 5, 6, 7].map(day => (
                            <div 
                                key={`header-${day}`} 
                                className={`p-2 text-center font-medium ${
                                    isCurrentDay(day) ? 'bg-primary/10 text-primary' : 'bg-base-200'
                                } ${day === 7 ? 'rounded-tr-lg' : ''}`}
                            >
                                {getWeekdayName(day)}
                            </div>
                        ))}

                        {/* 时间段和课程 */}
                        {timeSlots.map((timeSlot, idx) => (
                            <>
                                {/* 时间段 */}
                                <div 
                                    key={`time-${timeSlot.section}`} 
                                    className={`bg-base-200/50 p-2 text-center text-xs ${
                                        idx === timeSlots.length - 1 ? 'rounded-bl-lg' : ''
                                    }`}
                                >
                                    <div className="font-medium">{timeSlot.section}</div>
                                    <div className="text-xs opacity-75">{timeSlot.start}</div>
                                    <div className="text-xs opacity-75">{timeSlot.end}</div>
                                </div>

                                {/* 课程单元格 */}
                                {[1, 2, 3, 4, 5, 6, 7].map(day => (
                                    <div 
                                        key={`cell-${timeSlot.section}-${day}`} 
                                        className={`relative p-1 min-h-[100px] border-base-200/30 border ${
                                            isCurrentDay(day) ? 'bg-primary/5' : ''
                                        } ${
                                            idx === timeSlots.length - 1 && day === 7 ? 'rounded-br-lg' : ''
                                        }`}
                                    >
                                        {renderCourseCell(day, timeSlot.section)}
                                    </div>
                                ))}
                            </>
                        ))}
                    </div>

                    {/* 课程类型图例 */}
                    {renderCourseTypeLegend()}
                </div>
            </div>
        );
    };

    // 渲染列表视图
    const renderListView = () => {
        const currentCourses = getCurrentWeekSchedules();
        
        // 按星期几分组
        const coursesByDay = [1, 2, 3, 4, 5, 6, 7].map(day => {
            return {
                day,
                courses: currentCourses.filter(course => course.weekday === day)
            };
        });

        return (
            <div>
                {/* 周选择器 */}
                {renderWeekSelector()}
                
                {/* 按天显示课程 */}
                <div className="space-y-4 mt-4">
                    {coursesByDay.map(({ day, courses }) => (
                        <div key={`day-${day}`} className="border rounded-lg overflow-hidden">
                            <div className={`p-3 ${isCurrentDay(day) ? 'bg-primary/10 text-primary' : 'bg-base-200'}`}>
                                <h3 className="text-lg font-medium">{getWeekdayName(day)}</h3>
                            </div>

                            {courses.length === 0 ? (
                                <div className="p-6 text-center text-base-content/60">
                                    无课程安排
                                </div>
                            ) : (
                                <div className="divide-y">
                                    {courses.sort((a, b) => a.startSection - b.startSection).map(course => (
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
                                            onClick={() => handleViewCourseDetail(course)}
                                            hoverable
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-medium">{course.courseName}</h4>
                                                    <div className="mt-1 space-y-1">
                                                        <div className="text-sm flex items-center gap-2">
                                                            <span className="opacity-70">教学班:</span>
                                                            <span>{course.className}</span>
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
                                                    {course.teacherName && (
                                                        <Tag className="mt-2" color="magenta">{course.teacherName}</Tag>
                                                    )}
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // 渲染表格视图
    const renderTableView = () => {
        const currentCourses = getCurrentWeekSchedules();
        
        // 定义表格列
        const columns = [
            {
                title: '课程名称',
                dataIndex: 'courseName',
                key: 'courseName',
                render: (text: string, record: CourseInfo) => {
                    const courseStyle = getCourseStyle(record);
                    return (
                        <div>
                            <div 
                                className="font-semibold py-1 px-2 rounded-md" 
                                style={{ 
                                    backgroundColor: courseStyle.backgroundColor,
                                    color: courseStyle.color,
                                    borderLeft: `4px solid ${courseStyle.borderColor}`
                                }}
                            >
                                {text}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">{record.className}</div>
                            {record.creditHourType && (
                                <Tag color="cyan" className="mt-1">{record.creditHourType}</Tag>
                            )}
                            {record.classHours && (
                                <Tag color="purple" className="mt-1">{record.classHours}学时</Tag>
                            )}
                        </div>
                    );
                }
            },
            {
                title: '上课时间',
                dataIndex: 'weekday',
                key: 'weekday',
                render: (_: unknown, record: CourseInfo) => (
                    <div>
                        <div className="font-medium text-blue-600">{getWeekdayName(record.weekday)}</div>
                        <div className="text-xs">{formatTimeSlot(record.startSection, record.endSection)}</div>
                        <div className="text-xs text-gray-500">
                            {timeSlots.find(t => t.section === record.startSection)?.start} - 
                            {timeSlots.find(t => t.section === record.endSection)?.end}
                        </div>
                        {record.consecutiveSessions && record.consecutiveSessions > 1 && (
                            <Tag color="gold" className="mt-1">连续{record.consecutiveSessions}节</Tag>
                        )}
                    </div>
                )
            },
            {
                title: '上课地点',
                dataIndex: 'location',
                key: 'location',
                render: (text: string, record: CourseInfo) => (
                    <div>
                        <div className="font-medium">{text}</div>
                        {record.classroomType && (
                            <div className="text-xs bg-purple-100 text-purple-800 rounded px-1 inline-block mt-1">
                                {record.classroomType}
                            </div>
                        )}
                        <div className="text-xs text-gray-500 mt-1">
                            {record.campus} {record.building}
                        </div>
                    </div>
                )
            },
            {
                title: '周次',
                dataIndex: 'weeks',
                key: 'weeks',
                render: (weeks: number[]) => (
                    <div>
                        <Tag color="processing">{formatWeeks(weeks)}</Tag>
                    </div>
                )
            },
            {
                title: '类型',
                dataIndex: 'type',
                key: 'type',
                render: (text: string, record: CourseInfo) => {
                    const courseStyle = getCourseStyle(record);
                    return (
                        <div>
                            <Tag style={{ 
                                backgroundColor: courseStyle.backgroundColor,
                                color: courseStyle.color,
                                borderColor: courseStyle.borderColor
                            }}>
                                {text}
                            </Tag>
                            {record.teacherName && (
                                <div className="text-xs mt-1">
                                    <Tag color="magenta">{record.teacherName}</Tag>
                                </div>
                            )}
                        </div>
                    );
                }
            },
            {
                title: '操作',
                key: 'action',
                render: (_: unknown, record: CourseInfo) => (
                    <Space size="middle">
                        <a onClick={() => handleViewCourseDetail(record)}>详情</a>
                    </Space>
                )
            }
        ];
        
        return (
            <div>
                {/* 周选择器 */}
                {renderWeekSelector()}
                
                {/* 课程表格 */}
                <div className="mt-4">
                    <Table 
                        columns={columns} 
                        dataSource={currentCourses}
                        rowKey="id"
                        pagination={false}
                        size="middle"
                        bordered
                        className="shadow-sm"
                    />
                </div>
            </div>
        );
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* 标题和操作区 */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-primary-content flex items-center gap-2">
                    <Calendar theme="outline" size="24" className="text-primary" />
                    <span>教师课程表</span>
                </h1>
                
                <div className="flex flex-wrap gap-2">
                    <select 
                        className="select select-bordered select-sm md:select-md"
                        value={currentSemester}
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
                        onClick={handleRefresh}
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
                        <button 
                            className={`btn btn-sm md:btn-md ${viewMode === 'table' ? 'btn-active' : ''}`}
                            onClick={() => setViewMode('table')}
                        >
                            表格视图
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
                ) : getCurrentWeekSchedules().length === 0 && currentWeek !== 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Calendar theme="outline" size="64" className="text-base-content/40" />
                        <p className="text-base-content/60 mt-4 text-lg">当前周次无课程安排</p>
                        <p className="text-base-content/40 mt-2">请尝试切换周次或选择"全部周次"查看</p>
                    </div>
                ) : (
                    <div className="p-4">
                        {viewMode === 'grid' ? renderGridView() : 
                         viewMode === 'list' ? renderListView() : 
                         renderTableView()}
                    </div>
                )}
            </CardComponent>

            {/* 课程详情模态框 */}
            <Modal
                title={
                    <div className="flex items-center gap-2">
                        <span className="text-lg">{selectedCourse?.courseName}</span>
                        {selectedCourse && (
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
                        )}
                    </div>
                }
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
                                <div className="text-sm opacity-70">教学班</div>
                                <div className="font-medium">{selectedCourse.className}</div>
                            </div>
                            {selectedCourse.teacherName && (
                                <div>
                                    <div className="text-sm opacity-70">授课教师</div>
                                    <div className="font-medium">
                                        <Tag color="magenta">{selectedCourse.teacherName}</Tag>
                                    </div>
                                </div>
                            )}
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
                                    <div className="font-medium">{getWeekdayName(selectedCourse.weekday)}</div>
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

export default TeacherCourseSchedule;