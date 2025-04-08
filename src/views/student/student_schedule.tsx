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
import { Skeleton, message, Modal, Tag, Tooltip } from "antd";
import { Calendar, Refresh, LeftSmall, RightSmall, PreviewOpen } from "@icon-park/react";
import { CardComponent } from "../../components/card_component";
import { SemesterEntity } from "../../models/entity/semester_entity";
import { GetSemesterListAPI } from "../../apis/semester_api";

// 课程信息类型
interface ScheduleInfo {
    id: string;
    courseName: string;
    courseId: string;
    teacher: string;
    location: string;
    weekday: number;
    startSection: number;
    endSection: number;
    weeks: number[];
    type: string;
}

// 课程类型颜色映射
const courseTypeColors: Record<string, string> = {
    "必修": "bg-primary/15 border-primary/30 text-primary-content hover:bg-primary/30",
    "选修": "bg-success/15 border-success/30 text-success-content hover:bg-success/30",
    "公选": "bg-warning/15 border-warning/30 text-warning-content hover:bg-warning/30",
    "实验": "bg-info/15 border-info/30 text-info-content hover:bg-info/30",
    "其他": "bg-neutral/15 border-neutral/30 text-neutral-content hover:bg-neutral/30"
};

// 获取课程类型对应的颜色样式
const getCourseTypeStyle = (type: string): string => {
    return courseTypeColors[type] || courseTypeColors["其他"];
};

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
    { section: 10, start: "19:55", end: "20:40" }
];

/**
 * 学生课程表页面组件
 * 
 * @param site 站点信息
 * @returns 学生课程表页面
 */
export function StudentSchedule({ site }: Readonly<{ site?: SiteInfoEntity }>): JSX.Element {
    const [loading, setLoading] = useState<boolean>(true);
    const [semesters, setSemesters] = useState<SemesterEntity[]>([]);
    const [currentSemester, setCurrentSemester] = useState<string>("");
    const [currentWeek, setCurrentWeek] = useState<number>(1);
    const [totalWeeks] = useState<number>(20);
    const [schedules, setSchedules] = useState<ScheduleInfo[]>([]);
    const [courseDetailVisible, setCourseDetailVisible] = useState<boolean>(false);
    const [selectedCourse, setSelectedCourse] = useState<ScheduleInfo | null>(null);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    // 获取学期列表
    useEffect(() => {
        const fetchSemesters = async () => {
            try {
                const response = await GetSemesterListAPI();
                if (response?.output === "Success" && response.data) {
                    setSemesters(response.data);
                    if (response.data.length > 0) {
                        setCurrentSemester(response.data[0].semester_uuid);
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
            
            // 模拟加载课程表数据
            setTimeout(() => {
                // 模拟课程数据
                const mockSchedules: ScheduleInfo[] = [
                    {
                        id: "1",
                        courseName: "计算机导论",
                        courseId: "CS101",
                        teacher: "张教授",
                        location: "教学楼A-301",
                        weekday: 1,
                        startSection: 1,
                        endSection: 2,
                        weeks: [1, 2, 3, 4, 5, 6, 7, 8],
                        type: "必修"
                    },
                    {
                        id: "2",
                        courseName: "高等数学",
                        courseId: "MATH102",
                        teacher: "李教授",
                        location: "教学楼B-201",
                        weekday: 2,
                        startSection: 3,
                        endSection: 4,
                        weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                        type: "必修"
                    },
                    {
                        id: "3",
                        courseName: "大学英语",
                        courseId: "ENG101",
                        teacher: "王教授",
                        location: "外语楼-101",
                        weekday: 3,
                        startSection: 5,
                        endSection: 6,
                        weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                        type: "选修"
                    },
                    {
                        id: "4",
                        courseName: "数据结构",
                        courseId: "CS201",
                        teacher: "刘教授",
                        location: "实验楼-301",
                        weekday: 4,
                        startSection: 7,
                        endSection: 8,
                        weeks: [1, 2, 3, 4, 5, 6, 7, 8],
                        type: "必修"
                    },
                    {
                        id: "5",
                        courseName: "大学物理",
                        courseId: "PHY101",
                        teacher: "赵教授",
                        location: "理科楼-201",
                        weekday: 5,
                        startSection: 1,
                        endSection: 2,
                        weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                        type: "必修"
                    },
                    {
                        id: "6",
                        courseName: "体育(篮球)",
                        courseId: "PE101",
                        teacher: "陈教练",
                        location: "篮球场",
                        weekday: 3,
                        startSection: 9,
                        endSection: 10,
                        weeks: [1, 2, 3, 4, 5, 6, 7, 8],
                        type: "公选"
                    },
                    {
                        id: "7",
                        courseName: "操作系统实验",
                        courseId: "CS302-Lab",
                        teacher: "周教授",
                        location: "计算机楼-501",
                        weekday: 2,
                        startSection: 5,
                        endSection: 8,
                        weeks: [2, 4, 6, 8, 10, 12],
                        type: "实验"
                    }
                ];
                
                setSchedules(mockSchedules);
                setLoading(false);
            }, 1000);
        }
    }, [currentSemester]);

    // 设置页面标题
    useEffect(() => {
        document.title = `课程表 | ${site?.name ?? "Frontleaves Technology"}`;
    }, [site?.name]);

    // 切换学期
    const handleSemesterChange = (semesterUuid: string) => {
        setCurrentSemester(semesterUuid);
    };

    // 刷新课程表
    const handleRefresh = () => {
        if (currentSemester) {
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
                message.success("课程表已刷新");
            }, 1000);
        }
    };

    // 切换周次
    const handleWeekChange = (week: number) => {
        if (week >= 1 && week <= totalWeeks) {
            setCurrentWeek(week);
        }
    };

    // 查看课程详情
    const handleViewCourseDetail = (course: ScheduleInfo) => {
        setSelectedCourse(course);
        setCourseDetailVisible(true);
    };

    // 获取当前周的课程
    const getCurrentWeekSchedules = () => {
        return schedules.filter(schedule => schedule.weeks.includes(currentWeek));
    };

    // 渲染课程格子
    const renderCourseCell = (weekday: number, section: number) => {
        const course = getCurrentWeekSchedules().find(
            s => s.weekday === weekday && 
            section >= s.startSection && 
            section <= s.endSection
        );

        if (!course) return null;

        // 只在课程开始节次显示
        if (section !== course.startSection) return null;

        const height = (course.endSection - course.startSection + 1) * 100;

        return (
            <div 
                className={`absolute w-full border rounded-lg p-2 cursor-pointer transition-colors shadow-sm ${getCourseTypeStyle(course.type)}`}
                style={{ height: `${height}%`, top: 0, left: 0, right: 0 }}
                onClick={() => handleViewCourseDetail(course)}
            >
                <div className="font-medium truncate">{course.courseName}</div>
                <div className="text-xs opacity-75 truncate">{course.location}</div>
                <div className="text-xs opacity-75 truncate">{course.teacher}</div>
                <div className="absolute bottom-1 right-1">
                    <Tooltip title="查看详情">
                        <PreviewOpen size="14" className="opacity-60" />
                    </Tooltip>
                </div>
            </div>
        );
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
                    disabled={currentWeek <= 1}
                >
                    <LeftSmall theme="outline" size="18" />
                </button>
                <div className="mx-4 flex items-center">
                    <span className="mr-2">第</span>
                    <select
                        className="select select-bordered select-sm"
                        value={currentWeek}
                        onChange={(e) => handleWeekChange(Number(e.target.value))}
                    >
                        {Array.from({ length: totalWeeks }, (_, i) => i + 1).map(week => (
                            <option key={week} value={week}>
                                {week}
                            </option>
                        ))}
                    </select>
                    <span className="ml-2">周</span>
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
                    <div className="flex flex-wrap items-center gap-2 mt-6 justify-center">
                        <span className="text-sm">课程类型:</span>
                        {Object.keys(courseTypeColors).map((type) => (
                            <div 
                                key={type} 
                                className={`px-2 py-1 rounded text-xs border ${getCourseTypeStyle(type)}`}
                            >
                                {type}
                            </div>
                        ))}
                    </div>
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
                                        <div 
                                            key={course.id}
                                            className={`p-4 hover:bg-base-200/50 cursor-pointer ${getCourseTypeStyle(course.type)}`}
                                            onClick={() => handleViewCourseDetail(course)}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-medium">{course.courseName}</h4>
                                                    <div className="mt-1 space-y-1">
                                                        <div className="text-sm flex items-center gap-2">
                                                            <span className="opacity-70">授课教师:</span>
                                                            <span>{course.teacher}</span>
                                                        </div>
                                                        <div className="text-sm flex items-center gap-2">
                                                            <span className="opacity-70">上课地点:</span>
                                                            <span>{course.location}</span>
                                                        </div>
                                                        <div className="text-sm flex items-center gap-2">
                                                            <span className="opacity-70">课程类型:</span>
                                                            <Tag color={
                                                                course.type === "必修" ? "blue" :
                                                                course.type === "选修" ? "green" :
                                                                course.type === "公选" ? "orange" :
                                                                course.type === "实验" ? "cyan" : "default"
                                                            }>{course.type}</Tag>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm font-medium">
                                                        第{course.startSection}-{course.endSection}节
                                                    </div>
                                                    <div className="text-xs opacity-75 mt-1">
                                                        {timeSlots.find(t => t.section === course.startSection)?.start} - 
                                                        {timeSlots.find(t => t.section === course.endSection)?.end}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
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
                    <span>课程表</span>
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
                    </div>
                </div>
            </div>

            {/* 课程表内容 */}
            <CardComponent>
                {loading ? (
                    <div className="p-8">
                        <Skeleton active paragraph={{ rows: 10 }} />
                    </div>
                ) : getCurrentWeekSchedules().length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Calendar theme="outline" size="64" className="text-base-content/40" />
                        <p className="text-base-content/60 mt-4 text-lg">当前周次无课程安排</p>
                        <p className="text-base-content/40 mt-2">请尝试切换周次或学期</p>
                    </div>
                ) : (
                    <div className="p-4">
                        {viewMode === 'grid' ? renderGridView() : renderListView()}
                    </div>
                )}
            </CardComponent>

            {/* 课程详情模态框 */}
            <Modal
                title={
                    <div className="flex items-center gap-2">
                        <span className="text-lg">{selectedCourse?.courseName}</span>
                        <Tag color={
                            selectedCourse?.type === "必修" ? "blue" :
                            selectedCourse?.type === "选修" ? "green" :
                            selectedCourse?.type === "公选" ? "orange" :
                            selectedCourse?.type === "实验" ? "cyan" : "default"
                        }>{selectedCourse?.type}</Tag>
                    </div>
                }
                open={courseDetailVisible}
                onCancel={() => setCourseDetailVisible(false)}
                footer={null}
                width={500}
            >
                {selectedCourse && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-sm opacity-70">课程代码</div>
                                <div>{selectedCourse.courseId}</div>
                            </div>
                            <div>
                                <div className="text-sm opacity-70">授课教师</div>
                                <div>{selectedCourse.teacher}</div>
                            </div>
                            <div>
                                <div className="text-sm opacity-70">上课地点</div>
                                <div>{selectedCourse.location}</div>
                            </div>
                            <div>
                                <div className="text-sm opacity-70">上课时间</div>
                                <div>{getWeekdayName(selectedCourse.weekday)} 第{selectedCourse.startSection}-{selectedCourse.endSection}节</div>
                            </div>
                        </div>
                        
                        <div>
                            <div className="text-sm opacity-70 mb-1">上课周次</div>
                            <div className="flex flex-wrap gap-1">
                                {selectedCourse.weeks.map(week => (
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
                        </div>
                        
                        <div className="text-sm opacity-70 mt-4">
                            * 具体上课时间: {timeSlots.find(t => t.section === selectedCourse.startSection)?.start} - 
                            {timeSlots.find(t => t.section === selectedCourse.endSection)?.end}
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