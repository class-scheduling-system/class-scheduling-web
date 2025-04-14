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

import { useEffect, useState } from "react";
import { ScheduleGridEntity, ScheduleGridCell } from "../../../models/entity/schedule_entity";
import { ScheduleGridComponent } from "../../../components/academic/schedule/schedule_grid_component";
import { GetClassAssignmentPageAPI } from "../../../apis/class_assignment_api";
import { GetSemesterListAPI } from "../../../apis/semester_api";
import { GetClassroomListAPI } from "../../../apis/classroom_api";
import { GetTeacherListAPI } from "../../../apis/teacher_api";
import { GetTeachingClassListAPI } from "../../../apis/teaching_class_api";
import { GetCourseListAPI } from "../../../apis/course_api";
import { message, Tabs } from "antd";
import { SiteInfoEntity } from "../../../models/entity/site_info_entity";
import { ClassAssignmentEntity } from "../../../models/entity/class_assignment_entity";
import { SemesterEntity } from "../../../models/entity/semester_entity";
import { ClassroomLiteEntity } from "../../../models/entity/classroom_lite_entity";
import { TeacherLiteEntity } from "../../../models/entity/teacher_lite_entity";
import { TeachingClassLiteEntity } from "../../../models/entity/teaching_class_entity";
import { CourseLibraryEntity } from "../../../models/entity/course_library_entity";
import { ArrowLeft, Calendar, Download, Filter } from "@icon-park/react";
import { useNavigate } from "react-router";

/**
 * # 排课二维表视图组件
 * 
 * 教务端排课二维表视图，提供教学班、教师、教室等多维度的课表视图功能
 * 
 * @param site 站点信息
 * @returns 排课二维表视图组件
 */
export function ScheduleGridView({site}: Readonly<{
    site: SiteInfoEntity
}>) {
    const navigate = useNavigate();
    
    // 基础状态
    const [loading, setLoading] = useState(false);
    const [showFilters, setShowFilters] = useState(true);
    
    // 视图状态
    const [activeTab, setActiveTab] = useState<"teaching_class" | "teacher" | "classroom">("teaching_class");
    const [currentWeek, setCurrentWeek] = useState<number | null>(null);
    const [selectedFilter, setSelectedFilter] = useState<{type: string, value: string, title: string} | null>(null);
    
    // API数据状态
    const [classAssignments, setClassAssignments] = useState<ClassAssignmentEntity[]>([]);
    const [selectedSemester, setSelectedSemester] = useState(""); 
    const [semesters, setSemesters] = useState<SemesterEntity[]>([]);
    const [loadingSemesters, setLoadingSemesters] = useState(false);
    
    // 删除未使用的变量和状态
    const [classrooms, setClassrooms] = useState<ClassroomLiteEntity[]>([]);
    const [selectedClassroom, setSelectedClassroom] = useState("");
    const [loadingClassrooms, setLoadingClassrooms] = useState(false);
    
    const [teachers, setTeachers] = useState<TeacherLiteEntity[]>([]);
    const [selectedTeacher, setSelectedTeacher] = useState("");
    const [loadingTeachers, setLoadingTeachers] = useState(false);
    
    // 教学班数据
    const [teachingClasses, setTeachingClasses] = useState<TeachingClassLiteEntity[]>([]);
    const [selectedTeachingClass, setSelectedTeachingClass] = useState<string>("");
    const [loadingTeachingClasses, setLoadingTeachingClasses] = useState<boolean>(false);
    
    const [courseList, setCourseList] = useState<CourseLibraryEntity[]>([]);
    
    // 设置页面标题
    useEffect(() => {
        document.title = `排课二维表 | ${site.name ?? "Frontleaves Technology"}`;
    }, [site.name]);
    
    // 键盘快捷键
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.ctrlKey && event.key === "k") {
                event.preventDefault();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    // 加载学期数据
    const loadSemesters = async () => {
        try {
            setLoadingSemesters(true);
            const response = await GetSemesterListAPI();
            
            if (response && response.output === "Success" && response.data) {
                setSemesters(response.data);
                
                // 如果有学期数据且未选择学期，则默认选择第一个启用的学期
                if (response.data.length > 0 && !selectedSemester) {
                    const enabledSemesters = response.data.filter(sem => sem.is_enabled);
                    if (enabledSemesters.length > 0) {
                        setSelectedSemester(enabledSemesters[0].semester_uuid);
                    } else {
                        setSelectedSemester(response.data[0].semester_uuid);
                    }
                }
            } else {
                message.error("获取学期数据失败：" + (response?.error_message || "未知错误"));
            }
        } catch (error) {
            console.error("加载学期数据出错", error);
            message.error("加载学期数据出错");
        } finally {
            setLoadingSemesters(false);
        }
    };
    
    // 加载教室数据
    const loadClassrooms = async () => {
        try {
            setLoadingClassrooms(true);
            const response = await GetClassroomListAPI();
            
            if (response && response.output === "Success" && response.data) {
                setClassrooms(response.data);
            } else {
                message.error("获取教室数据失败：" + (response?.error_message || "未知错误"));
            }
        } catch (error) {
            console.error("加载教室数据出错", error);
            message.error("加载教室数据出错");
        } finally {
            setLoadingClassrooms(false);
        }
    };
    
    // 加载教师数据
    const loadTeachers = async () => {
        try {
            setLoadingTeachers(true);
            const response = await GetTeacherListAPI();
            
            if (response && response.output === "Success" && response.data) {
                setTeachers(response.data);
            } else {
                message.error("获取教师数据失败：" + (response?.error_message || "未知错误"));
            }
        } catch (error) {
            console.error("加载教师数据出错", error);
            message.error("加载教师数据出错");
        } finally {
            setLoadingTeachers(false);
        }
    };
    
    // 加载课程数据
    const loadCourses = async () => {
        try {
            const response = await GetCourseListAPI();
            
            if (response && response.output === "Success" && response.data) {
                setCourseList(response.data);
            } else {
                message.error("获取课程数据失败：" + (response?.error_message || "未知错误"));
            }
        } catch (error) {
            console.error("加载课程数据出错", error);
            message.error("加载课程数据出错");
        }
    };
    
    // 加载教学班数据
    const loadTeachingClasses = async () => {
        if (!selectedSemester) return;
        
        try {
            setLoadingTeachingClasses(true);
            const response = await GetTeachingClassListAPI({
                semester_uuid: selectedSemester,
                is_enabled: true
            });
            
            if (response && response.output === "Success" && response.data) {
                setTeachingClasses(response.data);
            } else {
                message.error("获取教学班数据失败：" + (response?.error_message || "未知错误"));
            }
        } catch (error) {
            console.error("加载教学班数据出错", error);
            message.error("加载教学班数据出错");
        } finally {
            setLoadingTeachingClasses(false);
        }
    };
    
    // 加载排课分配数据
    const loadClassAssignments = async () => {
        if (!selectedSemester) return;
        
        try {
            setLoading(true);
            const maxPage = 100; // 最多获取100页数据
            let allAssignments: ClassAssignmentEntity[] = [];
            let page = 1;
            
            // 首次请求
            const params = {
                page: page,
                size: 100,
                semester_uuid: selectedSemester,
                teaching_class_uuid: activeTab === "teaching_class" ? selectedTeachingClass : undefined,
                classroom_uuid: activeTab === "classroom" ? selectedClassroom : undefined,
                teacher_uuid: activeTab === "teacher" ? selectedTeacher : undefined
            };
            
            const response = await GetClassAssignmentPageAPI(params);
            
            if (response && response.output === "Success" && response.data) {
                allAssignments = response.data.records;
                
                // 如果有多页，继续请求后续页面
                const totalPages = Math.min(Math.ceil(response.data.total / response.data.size), maxPage);
                
                for (page = 2; page <= totalPages; page++) {
                    const nextParams = {
                        ...params,
                        page: page
                    };
                    
                    const nextResponse = await GetClassAssignmentPageAPI(nextParams);
                    
                    if (nextResponse && nextResponse.output === "Success" && nextResponse.data) {
                        allAssignments = [...allAssignments, ...nextResponse.data.records];
                    } else {
                        break;
                    }
                }
                
                setClassAssignments(allAssignments);
            } else {
                message.error("获取排课数据失败：" + (response?.error_message || "未知错误"));
            }
        } catch (error) {
            console.error("加载排课数据出错", error);
            message.error("加载排课数据出错");
        } finally {
            setLoading(false);
        }
    };
    
    // 初始化加载所有下拉数据
    useEffect(() => {
        loadSemesters();
        loadClassrooms();
        loadTeachers();
        loadCourses();
    }, []);
    
    // 学期变更时加载教学班
    useEffect(() => {
        if (selectedSemester) {
            loadTeachingClasses();
            loadClassAssignments();
        }
    }, [selectedSemester]);
    
    // 当用户切换标签页时，更新筛选值和筛选类型
    const handleTabChange = (key: string) => {
        setActiveTab(key as "teaching_class" | "teacher" | "classroom");
        setSelectedFilter(null);
    };
    
    // 生成二维课程表数据
    const generateScheduleGrid = (): ScheduleGridEntity => {
        // 定义行（节次）和列（星期）
        const rows = ["第1节", "第2节", "第3节", "第4节", "第5节", "第6节", "第7节", "第8节", "第9节", "第10节", "第11节", "第12节"];
        const columns = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
        
        // 初始化空网格
        const grid: ScheduleGridCell[][] = [];
        for (let i = 0; i < rows.length; i++) {
            grid[i] = [];
            for (let j = 0; j < columns.length; j++) {
                grid[i][j] = {};
            }
        }
        
        // 如果没有选择筛选条件，返回空网格
        if (!selectedFilter) {
            return { rows, columns, grid };
        }
        
        // 获取需要填充到网格的课程数据
        const filteredAssignments = classAssignments.filter(assignment => {
            if (!assignment) return false;
            
            if (selectedFilter.type === "teaching_class") {
                return assignment.teaching_class_uuid === selectedFilter.value;
            } else if (selectedFilter.type === "teacher") {
                return assignment.teacher_uuid === selectedFilter.value;
            } else if (selectedFilter.type === "classroom") {
                return assignment.classroom_uuid === selectedFilter.value;
            }
            return false;
        });
        
        // 如果没有数据，返回空网格
        if (filteredAssignments.length === 0) {
            return { rows, columns, grid };
        }
        
        // 填充课程数据到网格
        filteredAssignments.forEach(assignment => {
            if (!assignment || !assignment.class_time_dto) return;
            
            // 处理每个时间段
            assignment.class_time_dto.forEach(timeSlot => {
                // 如果设置了周次筛选，则只显示该周的课程
                if (currentWeek !== null && timeSlot.week_numbers && 
                    !timeSlot.week_numbers.includes(currentWeek)) {
                    return;
                }
                
                const dayIndex = timeSlot.day_of_week - 1; // 转换为0-6
                const startPeriod = timeSlot.period_start - 1; // 转换为0-based索引
                const endPeriod = timeSlot.period_end - 1;
                
                // 检查索引是否在有效范围内
                if (dayIndex >= 0 && dayIndex < columns.length && 
                    startPeriod >= 0 && startPeriod < rows.length &&
                    endPeriod >= 0 && endPeriod < rows.length) {
                    
                    // 获取课程名称
                    let courseName = "未知课程";
                    const foundCourse = courseList.find(c => c.course_library_uuid === assignment.course_uuid);
                    if (foundCourse) {
                        courseName = foundCourse.name || courseName;
                    }
                    
                    // 获取教师姓名
                    let teacherName = "未知教师";
                    if (assignment.teacher_uuid) {
                        const foundTeacher = teachers.find(t => t.teacher_uuid === assignment.teacher_uuid);
                        if (foundTeacher) {
                            teacherName = foundTeacher.teacher_name || teacherName;
                        }
                    }
                    
                    // 获取教室名称
                    let classroomName = "未指定教室";
                    if (assignment.classroom_uuid) {
                        const foundClassroom = classrooms.find(c => c.classroom_uuid === assignment.classroom_uuid);
                        if (foundClassroom && foundClassroom.name) {
                            classroomName = foundClassroom.name;
                        }
                    }
                    
                    // 获取班级名称
                    let className = assignment.teaching_class_name || "未知教学班";
                    
                    // 获取周次信息
                    let weekInfo = "";
                    if (timeSlot.week_numbers && timeSlot.week_numbers.length > 0) {
                        if (timeSlot.week_numbers.length > 5) {
                            weekInfo = `第${timeSlot.week_numbers[0]}-${timeSlot.week_numbers[timeSlot.week_numbers.length-1]}周`;
                        } else {
                            weekInfo = `第${timeSlot.week_numbers.join(',')}周`;
                        }
                    }
                    
                    // 构建显示信息（用于调试，实际数据在ScheduleGridComponent中展示）
                    if (selectedFilter.type === "teaching_class") {
                        // 教学班课表显示课程、教师和教室
                        grid[startPeriod][dayIndex].contentType = "class";
                        grid[startPeriod][dayIndex].info = {
                            courseTitle: courseName,
                            teacherName: teacherName,
                            classroomName: classroomName
                        };
                    } else if (selectedFilter.type === "teacher") {
                        // 教师课表显示课程、教学班和教室
                        grid[startPeriod][dayIndex].contentType = "class";
                        grid[startPeriod][dayIndex].info = {
                            courseTitle: courseName,
                            className: className,
                            classroomName: classroomName
                        };
                    } else if (selectedFilter.type === "classroom") {
                        // 教室课表显示课程、教师和教学班
                        grid[startPeriod][dayIndex].contentType = "class";
                        grid[startPeriod][dayIndex].info = {
                            courseTitle: courseName,
                            teacherName: teacherName,
                            className: className
                        };
                    }
                    
                    // 填充第一个单元格
                    grid[startPeriod][dayIndex] = {
                        id: parseInt(assignment.class_assignment_uuid?.substring(0, 8) || "0", 16),
                        courseName: courseName,
                        teacherName: teacherName,
                        classroom: classroomName,
                        rowSpan: endPeriod - startPeriod + 1,
                        weekInfo: weekInfo
                    };
                    
                    // 标记被连堂课占用的单元格
                    for (let i = startPeriod + 1; i <= endPeriod; i++) {
                        if (i < rows.length) {
                            grid[i][dayIndex] = {
                                isOccupied: true
                            };
                        }
                    }
                }
            });
        });
        
        return { rows, columns, grid };
    };
    
    // 处理筛选器选择
    const handleFilterSelect = (type: string, value: string, title: string) => {
        setSelectedFilter({
            type,
            value,
            title
        });
    };
    
    // 设置筛选周次
    const handleWeekSelect = (week: number | null) => {
        setCurrentWeek(week);
    };
    
    // 导出课表为图片（可以后续实现）
    const handleExportSchedule = () => {
        message.info("导出功能开发中...");
    };
    
    // 返回排课管理页面
    const handleBackToSchedule = () => {
        navigate("/academic/schedule");
    };
    
    // 获取学期名称
    const getSemesterName = (uuid: string): string => {
        const semester = semesters.find(sem => sem.semester_uuid === uuid);
        return semester ? semester.name : "未知学期";
    };
    
    // 渲染页面
    return (
        <div className="space-y-4 w-full">
            {/* 页面标题和导航 */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <button
                        className="btn btn-sm btn-ghost flex items-center gap-1"
                        onClick={handleBackToSchedule}
                    >
                        <ArrowLeft theme="outline" size="16" />
                        <span>返回排课管理</span>
                    </button>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Calendar theme="outline" size="24" />
                        排课二维表
                    </h1>
                </div>
                
                <div className="flex gap-2">
                    <button 
                        className="btn btn-sm btn-primary flex items-center gap-1"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <Filter theme="outline" size="16" />
                        <span>{showFilters ? "隐藏筛选" : "显示筛选"}</span>
                    </button>
                    <button 
                        className="btn btn-sm btn-outline flex items-center gap-1"
                        onClick={handleExportSchedule}
                        disabled={!selectedFilter}
                    >
                        <Download theme="outline" size="16" />
                        <span>导出课表</span>
                    </button>
                </div>
            </div>
            
            <div className="flex gap-4">
                {/* 左侧筛选区域 */}
                {showFilters && (
                    <div className="w-80 space-y-4">
                        <div className="card bg-base-100 shadow-xl border border-base-200">
                            <div className="card-body p-5">
                                <h3 className="text-lg font-semibold flex items-center gap-2 pb-2 border-b border-base-200">
                                    <Filter theme="outline" size="20" />
                                    课表筛选
                                </h3>
                                
                                {/* 学期选择 */}
                                <div className="mt-4">
                                    <label className="text-sm font-medium flex items-center gap-1.5 mb-1.5 text-primary">
                                        <div className="w-1 h-4 bg-primary rounded-full"></div>
                                        学期选择
                                    </label>
                                    <select 
                                        className="select select-bordered w-full hover:border-primary focus:border-primary transition-colors"
                                        value={selectedSemester}
                                        onChange={(e) => setSelectedSemester(e.target.value)}
                                        disabled={loadingSemesters}
                                    >
                                        <option value="" disabled>选择学期</option>
                                        {semesters.map(semester => (
                                            <option 
                                                key={semester.semester_uuid} 
                                                value={semester.semester_uuid}
                                            >
                                                {semester.name} {semester.is_enabled ? "(启用中)" : ""}
                                            </option>
                                        ))}
                                    </select>
                                    {loadingSemesters && (
                                        <div className="text-xs text-base-content/70 mt-1 flex items-center">
                                            <span className="loading loading-spinner loading-xs mr-1"></span>
                                            加载学期数据中...
                                        </div>
                                    )}
                                </div>
                                
                                {/* 周次选择 */}
                                <div className="mt-4">
                                    <label className="text-sm font-medium flex items-center gap-1.5 mb-1.5 text-primary">
                                        <div className="w-1 h-4 bg-primary rounded-full"></div>
                                        周次选择
                                    </label>
                                    <select 
                                        className="select select-bordered w-full hover:border-primary focus:border-primary transition-colors"
                                        value={currentWeek !== null ? currentWeek : ""}
                                        onChange={(e) => handleWeekSelect(e.target.value ? parseInt(e.target.value) : null)}
                                    >
                                        <option value="">全部周次</option>
                                        {Array.from({ length: 20 }, (_, i) => i + 1).map(week => (
                                            <option key={week} value={week}>第{week}周</option>
                                        ))}
                                    </select>
                                </div>
                                
                                {/* 选择类型的标签页 */}
                                <div className="mt-4">
                                    <Tabs
                                        activeKey={activeTab}
                                        onChange={handleTabChange}
                                        items={[
                                            {
                                                key: 'teaching_class',
                                                label: '教学班课表',
                                                children: (
                                                    <div className="pt-4 space-y-3">
                                                        <div>
                                                            <label className="text-sm font-medium mb-2 block">选择教学班</label>
                                                            <select 
                                                                className="select select-bordered w-full"
                                                                value={selectedTeachingClass}
                                                                onChange={(e) => setSelectedTeachingClass(e.target.value)}
                                                                disabled={loadingTeachingClasses}
                                                            >
                                                                <option value="">选择教学班</option>
                                                                {teachingClasses.map(cls => (
                                                                    <option 
                                                                        key={cls.teaching_class_uuid}
                                                                        value={cls.teaching_class_uuid}
                                                                    >
                                                                        {cls.teaching_class_name}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            {loadingTeachingClasses && (
                                                                <div className="text-xs text-base-content/70 mt-1 flex items-center">
                                                                    <span className="loading loading-spinner loading-xs mr-1"></span>
                                                                    加载教学班数据中...
                                                                </div>
                                                            )}
                                                        </div>
                                                        
                                                        {selectedTeachingClass && (
                                                            <button 
                                                                className="btn btn-primary btn-sm w-full"
                                                                onClick={() => {
                                                                    const cls = teachingClasses.find(c => c.teaching_class_uuid === selectedTeachingClass);
                                                                    handleFilterSelect("teaching_class", selectedTeachingClass, cls?.teaching_class_name || "未知教学班");
                                                                }}
                                                            >
                                                                查看教学班课表
                                                            </button>
                                                        )}
                                                    </div>
                                                )
                                            },
                                            {
                                                key: 'teacher',
                                                label: '教师课表',
                                                children: (
                                                    <div className="pt-4 space-y-3">
                                                        <div>
                                                            <label className="text-sm font-medium mb-2 block">选择教师</label>
                                                            <select 
                                                                className="select select-bordered w-full"
                                                                value={selectedTeacher}
                                                                onChange={(e) => setSelectedTeacher(e.target.value)}
                                                                disabled={loadingTeachers}
                                                            >
                                                                <option value="">选择教师</option>
                                                                {teachers.map(teacher => (
                                                                    <option 
                                                                        key={teacher.teacher_uuid}
                                                                        value={teacher.teacher_uuid}
                                                                    >
                                                                        {teacher.teacher_name}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            {loadingTeachers && (
                                                                <div className="text-xs text-base-content/70 mt-1 flex items-center">
                                                                    <span className="loading loading-spinner loading-xs mr-1"></span>
                                                                    加载教师数据中...
                                                                </div>
                                                            )}
                                                        </div>
                                                        
                                                        {selectedTeacher && (
                                                            <button 
                                                                className="btn btn-primary btn-sm w-full"
                                                                onClick={() => {
                                                                    const teacher = teachers.find(t => t.teacher_uuid === selectedTeacher);
                                                                    handleFilterSelect("teacher", selectedTeacher, teacher?.teacher_name || "未知教师");
                                                                }}
                                                            >
                                                                查看教师课表
                                                            </button>
                                                        )}
                                                    </div>
                                                )
                                            },
                                            {
                                                key: 'classroom',
                                                label: '教室课表',
                                                children: (
                                                    <div className="pt-4 space-y-3">
                                                        <div>
                                                            <label className="text-sm font-medium mb-2 block">选择教室</label>
                                                            <select 
                                                                className="select select-bordered w-full"
                                                                value={selectedClassroom}
                                                                onChange={(e) => setSelectedClassroom(e.target.value)}
                                                                disabled={loadingClassrooms}
                                                            >
                                                                <option value="">选择教室</option>
                                                                {classrooms.map(room => (
                                                                    <option 
                                                                        key={room.classroom_uuid}
                                                                        value={room.classroom_uuid}
                                                                    >
                                                                        {room.name}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            {loadingClassrooms && (
                                                                <div className="text-xs text-base-content/70 mt-1 flex items-center">
                                                                    <span className="loading loading-spinner loading-xs mr-1"></span>
                                                                    加载教室数据中...
                                                                </div>
                                                            )}
                                                        </div>
                                                        
                                                        {selectedClassroom && (
                                                            <button 
                                                                className="btn btn-primary btn-sm w-full"
                                                                onClick={() => {
                                                                    const room = classrooms.find(c => c.classroom_uuid === selectedClassroom);
                                                                    handleFilterSelect("classroom", selectedClassroom, room?.name || "未知教室");
                                                                }}
                                                            >
                                                                查看教室课表
                                                            </button>
                                                        )}
                                                    </div>
                                                )
                                            }
                                        ]}
                                    />
                                </div>
                                
                                {/* 筛选提示 */}
                                <div className="mt-4 text-xs text-base-content/70 p-2 bg-base-200 rounded-md">
                                    <p>请先选择学期和筛选条件，然后点击"查看课表"按钮生成二维课表</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* 右侧课表区域 */}
                <div className="flex-1">
                    {selectedFilter ? (
                        <div className="space-y-4">
                            <div className="card bg-base-100 shadow-xl border border-base-200">
                                <div className="card-body">
                                    <h3 className="text-xl font-bold text-center">
                                        {selectedFilter.title} - 课程表
                                        {selectedSemester && <span className="ml-2 text-base font-normal">({getSemesterName(selectedSemester)})</span>}
                                        {currentWeek !== null && <span className="ml-2 text-base font-normal text-primary">第{currentWeek}周</span>}
                                    </h3>
                                    
                                    <ScheduleGridComponent
                                        scheduleData={generateScheduleGrid()}
                                        loading={loading}
                                        onCellClick={(cell) => {
                                            if (cell && cell.id) {
                                                message.info(`课程: ${cell.courseName}, 教师: ${cell.teacherName}, 教室: ${cell.classroom}`);
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="card bg-base-100 shadow-xl border border-base-200 h-[70vh] flex items-center justify-center">
                            <div className="text-center p-8">
                                <Calendar theme="outline" size="64" className="mx-auto text-primary/30" />
                                <h3 className="text-xl font-bold mt-4">请选择查看条件</h3>
                                <p className="text-base-content/70 mt-2">
                                    在左侧选择学期、班级/教师/教室等筛选条件，生成对应的课程表
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 