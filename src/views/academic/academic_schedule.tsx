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

import { useEffect, useRef, useState } from "react";
import { SiteInfoEntity } from "../../models/entity/site_info_entity.ts";
import { AddOne, ArrowLeft, Attention, Schedule, Search } from "@icon-park/react";
import { 
  ScheduleEntity, 
  ScheduleGridCell, 
  ScheduleGridEntity 
} from "../../models/entity/schedule_entity.ts";
import { ScheduleListComponent } from "../../components/academic/schedule/schedule_list_component.tsx";
import { PaginationComponent } from "../../components/academic/schedule/pagination_component.tsx";
import { ScheduleGridComponent } from "../../components/academic/schedule/schedule_grid_component.tsx";
import { message, Modal, Tooltip } from "antd";
import { GetClassAssignmentPageAPI, DeleteClassAssignmentAPI } from "../../apis/class_assignment_api";
import { ClassAssignmentEntity } from "../../models/entity/class_assignment_entity";
import { GetSemesterListAPI } from "../../apis/semester_api";
import { SemesterEntity } from "../../models/entity/semester_entity";
import { GetAllAdministrativeClassListAPI } from "../../apis/administrative_class_api";
import { AdministrativeClassEntity } from "../../models/entity/administrative_class_entity";
import { GetClassroomListAPI } from "../../apis/classroom_api";
import { ClassroomLiteEntity } from "../../models/entity/classroom_lite_entity";
import { GetTeacherListAPI } from "../../apis/teacher_api";
import { TeacherLiteEntity } from "../../models/entity/teacher_lite_entity";
import { GetCourseListAPI } from "../../apis/course_api";
import { GetCampusListAPI } from "../../apis/campus_api";
import { GetBuildingListAPI } from "../../apis/building_api";
import { GetTeachingClassListAPI } from "../../apis/teaching_class_api";
import { TeachingClassLiteEntity } from "../../models/entity/teaching_class_entity";
import { BuildingLiteEntity } from "../../models/entity/building_lite_entity";
import { CampusEntity } from "../../models/entity/campus_entity";
import { CourseLibraryEntity } from "../../models/entity/course_library_entity";
import { useNavigate } from "react-router";
import { GetSimpleConflictListAPI } from "../../apis/conflict_api";

/**
 * 排课冲突指示器组件
 * 
 * 显示当前学期的排课冲突数量，点击可导航到冲突列表页面
 * @param semesterUuid 学期UUID
 * @returns 冲突指示器组件
 */
const ConflictIndicator: React.FC<{ semesterUuid: string }> = ({ semesterUuid }) => {
    const navigate = useNavigate();
    const [conflictCount, setConflictCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    // 获取未解决的冲突数量
    useEffect(() => {
        if (semesterUuid) {
            fetchConflicts();
        } else {
            setConflictCount(0);
        }
    }, [semesterUuid]);

    // 获取冲突数据
    const fetchConflicts = async () => {
        if (!semesterUuid) return;
        
        setLoading(true);
        try {
            // 获取未解决的冲突 (resolutionStatus=0)
            const response = await GetSimpleConflictListAPI(semesterUuid, 0);
            
            if (response && response.output === "Success" && response.data) {
                setConflictCount(response.data.length);
            }
        } catch (error) {
            console.error("获取冲突数据失败", error);
        } finally {
            setLoading(false);
        }
    };

    // 导航到冲突列表页面
    const handleNavigateToConflicts = () => {
        navigate("/academic/conflicts", { 
            state: { semesterUuid }
        });
    };

    return (
        <Tooltip 
            title={semesterUuid ? "查看排课冲突" : "请先选择学期"}
            placement="bottom"
        >
            <button
                className={`btn btn-sm ${conflictCount > 0 ? 'btn-error' : 'btn-outline'} flex items-center gap-1`}
                onClick={handleNavigateToConflicts}
                disabled={!semesterUuid}
            >
                <Attention theme="outline" size="16" />
                <span>
                    {loading ? (
                        <span className="loading loading-spinner loading-xs"></span>
                    ) : (
                        <>冲突 {conflictCount > 0 && <span className="badge badge-sm">{conflictCount}</span>}</>
                    )}
                </span>
            </button>
        </Tooltip>
    );
};

/**
 * # 排课管理组件
 * 
 * 教务端排课管理主页面，提供排课列表和课表视图功能
 * 
 * @param site 站点信息
 * @returns 排课管理组件
 */
export function AcademicSchedule({site}: Readonly<{
    site: SiteInfoEntity
}>) {
    const navigate = useNavigate();
    
    // 基础状态
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isDescending, setIsDescending] = useState(true);
    const [loading, setLoading] = useState(false);
    
    // 视图状态
    const [viewMode, setViewMode] = useState<"list" | "grid" | "timetable">("list");

    const [selectedFilter, setSelectedFilter] = useState<{type: string, value: string} | null>(null);
    
    // API数据状态
    const [classAssignments, setClassAssignments] = useState<ClassAssignmentEntity[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedSemester, setSelectedSemester] = useState(""); // 可以设置为默认值或从API获取
    const [semesters, setSemesters] = useState<SemesterEntity[]>([]);
    const [loadingSemesters, setLoadingSemesters] = useState(false);
    
    // 添加新状态
    const [administrativeClasses, setAdministrativeClasses] = useState<AdministrativeClassEntity[]>([]);
    const [selectedClass, setSelectedClass] = useState("");
    const [loadingClasses, setLoadingClasses] = useState(false);
    
    const [classrooms, setClassrooms] = useState<ClassroomLiteEntity[]>([]);
    const [selectedClassroom, setSelectedClassroom] = useState("");
    const [loadingClassrooms, setLoadingClassrooms] = useState(false);
    
    const [teachers, setTeachers] = useState<TeacherLiteEntity[]>([]);
    const [selectedTeacher, setSelectedTeacher] = useState("");
    const [loadingTeachers, setLoadingTeachers] = useState(false);
    
    // 搜索引用
    const inputFocus = useRef<HTMLInputElement>(null);
    
    // 添加新的列表状态
    const [courseList, setCourseList] = useState<CourseLibraryEntity[]>([]);
    const [buildingList, setBuildingList] = useState<BuildingLiteEntity[]>([]);
    const [campusList, setCampusList] = useState<CampusEntity[]>([]);
    
    // 在state声明中添加教学班相关状态
    const [teachingClasses, setTeachingClasses] = useState<TeachingClassLiteEntity[]>([]);
    const [selectedTeachingClass, setSelectedTeachingClass] = useState<string>("");
    const [loadingTeachingClasses, setLoadingTeachingClasses] = useState<boolean>(false);
    
    // 设置页面标题
    useEffect(() => {
        document.title = `排课管理 | ${site.name ?? "Frontleaves Technology"}`;
    }, [site.name]);
    
    // 键盘快捷键
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.ctrlKey && event.key === "k") {
                event.preventDefault();
                inputFocus.current?.focus();
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
            
            console.log("学期数据响应:", response);
            
            if (response && response.output === "Success" && response.data) {
                console.log("设置学期数据:", response.data);
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
    
    // 加载行政班级数据
    const loadAdministrativeClasses = async () => {
        try {
            setLoadingClasses(true);
            const response = await GetAllAdministrativeClassListAPI();
            
            console.log("班级数据响应:", response);
            
            if (response && response.output === "Success" && response.data) {
                console.log("设置班级数据:", response.data);
                setAdministrativeClasses(response.data);
            } else {
                message.error("获取班级数据失败：" + (response?.error_message || "未知错误"));
            }
        } catch (error) {
            console.error("加载班级数据出错", error);
            message.error("加载班级数据出错");
        } finally {
            setLoadingClasses(false);
        }
    };
    
    // 加载教室数据
    const loadClassrooms = async () => {
        try {
            setLoadingClassrooms(true);
            const response = await GetClassroomListAPI();
            
            console.log("教室数据响应:", response);
            
            if (response && response.output === "Success" && response.data) {
                console.log("设置教室数据:", response.data);
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
            
            console.log("教师数据响应:", response);
            
            if (response && response.output === "Success" && response.data) {
                console.log("设置教师数据:", response.data);
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
    
    // 加载教学楼数据
    const loadBuildings = async () => {
        try {
            const response = await GetBuildingListAPI();
            
            if (response && response.output === "Success" && response.data) {
                setBuildingList(response.data);
            } else {
                message.error("获取教学楼数据失败：" + (response?.error_message || "未知错误"));
            }
        } catch (error) {
            console.error("加载教学楼数据出错", error);
            message.error("加载教学楼数据出错");
        }
    };
    
    // 加载校区数据
    const loadCampuses = async () => {
        try {
            const response = await GetCampusListAPI();
            
            if (response && response.output === "Success" && response.data) {
                setCampusList(response.data);
            } else {
                message.error("获取校区数据失败：" + (response?.error_message || "未知错误"));
            }
        } catch (error) {
            console.error("加载校区数据出错", error);
            message.error("加载校区数据出错");
        }
    };
    
    // 添加加载教学班数据的函数
    const loadTeachingClasses = async () => {
        if (!selectedSemester) return;
        
        try {
            setLoadingTeachingClasses(true);
            const response = await GetTeachingClassListAPI({
                semester_uuid: selectedSemester,
                is_enabled: true
            });
            
            console.log("教学班数据响应:", response);
            
            if (response && response.output === "Success" && response.data) {
                console.log("设置教学班数据:", response.data);
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
    
    // 初始化加载所有下拉数据
    useEffect(() => {
        loadSemesters();
        loadAdministrativeClasses();
        loadClassrooms();
        loadTeachers();
        loadCourses();
        loadBuildings();
        loadCampuses();
    }, []);
    
    // 在 useEffect 中添加对学期变更的监听，加载对应的教学班
    useEffect(() => {
        if (selectedSemester) {
            loadTeachingClasses();
        }
    }, [selectedSemester]);
    
    // 加载排课分配数据
    const loadClassAssignments = async () => {
        if (!selectedSemester) return;
        
        try {
            setLoading(true);
            const params = {
                page: currentPage,
                size: itemsPerPage,
                semester_uuid: selectedSemester,
                administrative_class_uuid: selectedClass || undefined,
                classroom_uuid: selectedClassroom || undefined,
                teacher_uuid: selectedTeacher || undefined,
                teaching_class_uuid: selectedTeachingClass || undefined
            };
            
            const response = await GetClassAssignmentPageAPI(params);
            
            if (response && response.output === "Success" && response.data) {
                setClassAssignments(response.data.records);
                setTotalPages(Math.ceil(response.data.total / itemsPerPage));
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
    
    // 当依赖项变化时重新加载数据
    useEffect(() => {
        if (selectedSemester) {
            loadClassAssignments();
        }
    }, [currentPage, itemsPerPage, selectedSemester, selectedClass, selectedClassroom, selectedTeacher, selectedTeachingClass]);
    
    // 将API数据转换为组件所需的ScheduleEntity类型
    const convertAssignmentsToSchedules = (): ScheduleEntity[] => {
        if (!classAssignments || classAssignments.length === 0) {
            return [];
        }
        
        return classAssignments.map(assignment => {
            if (!assignment) return {} as ScheduleEntity;
            
            // 获取课程名称
            let courseName = `课程${assignment.course_uuid?.substring(0, 6) || "未知"}`;
            const foundCourse = courseList.find((c: CourseLibraryEntity) => c.course_library_uuid === assignment.course_uuid);
            if (foundCourse) {
                courseName = foundCourse.name || courseName;
            }
            
            // 获取教师姓名
            let teacherName = `教师${assignment.teacher_uuid?.substring(0, 6) || "未知"}`;
            if (assignment.teacher_uuid) {
                const foundTeacher = teachers.find(t => t.teacher_uuid === assignment.teacher_uuid);
                if (foundTeacher) {
                    teacherName = foundTeacher.teacher_name || teacherName;
                }
            }
            
            // 获取教室名称
            let classroomName = `教室${assignment.classroom_uuid?.substring(0, 6) || "未指定"}`;
            if (assignment.classroom_uuid) {
                const foundClassroom = classrooms.find(c => c.classroom_uuid === assignment.classroom_uuid);
                if (foundClassroom && foundClassroom.name) {
                    classroomName = foundClassroom.name;
                }
            }
            
            // 获取教学楼名称
            let buildingName = "";
            if (assignment.building_uuid) {
                const foundBuilding = buildingList.find(b => b.building_uuid === assignment.building_uuid);
                if (foundBuilding) {
                    buildingName = foundBuilding.building_name || "";
                }
            }
            
            // 获取校区名称
            let campusName = "";
            if (assignment.campus_uuid) {
                const foundCampus = campusList.find(c => c.campus_uuid === assignment.campus_uuid);
                if (foundCampus) {
                    campusName = foundCampus.campus_name || "";
                }
            }
            
            // 处理时间信息
            let timeDescription = "";
            if (assignment.class_time_dto && Array.isArray(assignment.class_time_dto)) {
                timeDescription = assignment.class_time_dto.map(time => {
                    // 转换星期几 (1-7 对应周一至周日)
                    const dayMap = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
                    const day = dayMap[time.day_of_week - 1] || "未知";
                    
                    // 获取节次信息
                    const periods = `${time.period_start}-${time.period_end}节`;
                    
                    // 获取周次信息
                    let weeks = "";
                    if (time.week_numbers && time.week_numbers.length > 0) {
                        if (time.week_numbers.length > 5) {
                            weeks = `第${time.week_numbers[0]}-${time.week_numbers[time.week_numbers.length-1]}周`;
                        } else {
                            weeks = `第${time.week_numbers.join(',')}周`;
                        }
                    }
                    
                    return `${day} ${periods} ${weeks}`;
                }).join('、');
            } else if (assignment.specified_time) {
                timeDescription = `指定时间: ${assignment.specified_time}`;
            } else {
                timeDescription = "未排时间";
            }
            
            // 获取教学班名称
            let className = assignment.teaching_class_name || `教学班${assignment.teaching_class_uuid?.substring(0, 6) || "未知"}`;
            
            // 如果没有教学班名称，尝试从教学班列表中查找
            if (assignment.teaching_class_uuid && teachingClasses.length > 0) {
                const foundTeachingClass = teachingClasses.find(tc => tc.teaching_class_uuid === assignment.teaching_class_uuid);
                if (foundTeachingClass) {
                    className = foundTeachingClass.teaching_class_name;
                }
            }
            
            // 获取学期名称
            let semesterName = `学期${assignment.semester_uuid?.substring(0, 6) || "未知"}`;
            if (assignment.semester_uuid) {
                const foundSemester = semesters.find(s => s.semester_uuid === assignment.semester_uuid);
                if (foundSemester) {
                    semesterName = foundSemester.name;
                }
            }
            
            // 创建格式化后的地点信息
            const location = classroomName + (buildingName ? ` (${buildingName})` : "") + (campusName ? ` [${campusName}]` : "");
            
            return {
                id: parseInt(assignment.class_assignment_uuid?.substring(0, 8) || "0", 16),
                course: courseName,
                teacher: teacherName,
                classroom: location,
                time: timeDescription,
                class: className,
                semester: semesterName,
                rawData: assignment
            };
        }).filter(Boolean);
    };
    
    // 模拟二维课程表数据
    const generateScheduleGrid = (filterType: string, filterValue: string): ScheduleGridEntity => {
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
        
        // 根据筛选条件填充网格数据
        const filteredSchedules = convertAssignmentsToSchedules().filter(schedule => {
            if (!schedule) return false;
            
            if (filterType === "class") {
                return schedule.class === filterValue;
            } else if (filterType === "teacher") {
                return schedule.teacher === filterValue;
            } else if (filterType === "classroom") {
                return schedule.classroom === filterValue;
            }
            return false;
        });
        
        // 如果没有数据，返回空网格
        if (filteredSchedules.length === 0) {
            return { rows, columns, grid };
        }
        
        // 填充课程数据到网格
        filteredSchedules.forEach(schedule => {
            if (!schedule || !schedule.rawData || !schedule.rawData.class_time_dto) return;
            
            // 处理每个时间段
            schedule.rawData.class_time_dto.forEach(timeSlot => {
                const dayIndex = timeSlot.day_of_week - 1; // 转换为0-6
                const startPeriod = timeSlot.period_start - 1; // 转换为0-based索引
                const endPeriod = timeSlot.period_end - 1;
                
                // 检查索引是否在有效范围内
                if (dayIndex >= 0 && dayIndex < columns.length && 
                    startPeriod >= 0 && startPeriod < rows.length &&
                    endPeriod >= 0 && endPeriod < rows.length) {
                
                // 填充第一个单元格
                    grid[startPeriod][dayIndex] = {
                    id: schedule.id,
                    courseName: schedule.course,
                    teacherName: schedule.teacher,
                    classroom: schedule.classroom,
                        rowSpan: endPeriod - startPeriod + 1,
                        weekInfo: timeSlot.week_numbers && timeSlot.week_numbers.length > 0 ? 
                            `第${timeSlot.week_numbers[0]}-${timeSlot.week_numbers[timeSlot.week_numbers.length-1]}周` : ""
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
    
    // 基于搜索词筛选数据
    const getFilteredSchedules = () => {
        const convertedSchedules = convertAssignmentsToSchedules();
        return convertedSchedules.filter(schedule => 
            (schedule.course?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (schedule.teacher?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (schedule.classroom?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (schedule.class?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (schedule.semester?.toLowerCase() || "").includes(searchTerm.toLowerCase())
        );
    };
    
    // 使用排序方向对数据进行排序
    const getSortedSchedules = () => {
        const filteredData = getFilteredSchedules();
        return [...filteredData].sort((a, b) => isDescending ? b.id - a.id : a.id - b.id);
    };
    
    // 获取当前页数据
    const getCurrentPageSchedules = () => {
        return getSortedSchedules();
    };
    
    // 重置筛选条件
    const handleReset = () => {
        setSearchTerm("");
        setCurrentPage(1);
        setSelectedClass("");
        setSelectedClassroom("");
        setSelectedTeacher("");
        setSelectedTeachingClass("");
        
        if (viewMode === "grid") {
            setViewMode("list");
            setSelectedFilter(null);
        }
    };
    
    // 视图切换处理
    const handleViewScheduleGrid = (schedule: ScheduleEntity, filterType: string) => {
        setViewMode("grid");
        
        let filterValue = "";
        if (filterType === "class") {
            filterValue = schedule.class;
        } else if (filterType === "teacher") {
            filterValue = schedule.teacher;
        } else if (filterType === "classroom") {
            filterValue = schedule.classroom;
        }
        
        setSelectedFilter({ type: filterType, value: filterValue });
    };
    
    // 返回列表视图
    const handleBackToList = () => {
        setViewMode("list");
        setSelectedFilter(null);
    };
    
    // 获取二维课程表数据
    const getScheduleGridData = (): ScheduleGridEntity => {
        if (!selectedFilter) {
            return { rows: [], columns: [], grid: [] };
        }
        
        // 检查是否有转换后的课程表数据
        const schedules = convertAssignmentsToSchedules();
        if (!schedules || schedules.length === 0) {
            // 如果没有数据，返回默认的空网格
            return { 
                rows: ["第1节", "第2节", "第3节", "第4节", "第5节", "第6节", "第7节", "第8节", "第9节", "第10节", "第11节", "第12节"], 
                columns: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
                grid: [] 
            };
        }
        
        return generateScheduleGrid(selectedFilter.type, selectedFilter.value);
    };
    
    // 添加排课
    const handleAddSchedule = () => {
        navigate("/academic/schedule/add");
    };
    
    // 编辑排课
    const handleEditSchedule = (schedule: ScheduleEntity) => {
        if (schedule.rawData && schedule.rawData.class_assignment_uuid) {
            navigate(`/academic/schedule/edit/${schedule.rawData.class_assignment_uuid}`);
        } else {
            message.error("无法获取排课ID，编辑失败");
        }
    };
    
    // 删除排课
    const handleDeleteSchedule = (schedule: ScheduleEntity) => {
        if (!schedule.rawData || !schedule.rawData.class_assignment_uuid) {
            message.error("无法获取排课ID，删除失败");
            return;
        }
        
        Modal.confirm({
            title: "删除确认",
            content: `确定要删除"${schedule.course}"的排课记录吗？此操作不可恢复。`,
            okText: "删除",
            okType: "danger",
            cancelText: "取消",
            onOk: async () => {
                try {
                    const response = await DeleteClassAssignmentAPI(schedule.rawData!.class_assignment_uuid);
                    
                    if (response && response.output === "Success") {
                        message.success("删除排课成功！");
                        // 刷新数据
                        loadClassAssignments();
                    } else {
                        message.error(response?.error_message || "删除排课失败");
                    }
                } catch (error) {
                    console.error("删除排课失败", error);
                    message.error("删除排课失败");
                }
            }
        });
    };
    
    // 获取学期名称
    const getSemesterName = (uuid: string): string => {
        const semester = semesters.find(sem => sem.semester_uuid === uuid);
        return semester ? semester.name : "未知学期";
    };
    
    // 渲染页面内容
    return (
        <div className="space-y-4 w-full">
            {viewMode === "list" && (
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Schedule theme="outline" size="24" />
                        排课管理
                    </h1>
                    
                    <div className="flex gap-2">
                        <ConflictIndicator semesterUuid={selectedSemester} />
                        <button 
                            className="btn btn-primary btn-sm flex items-center gap-1"
                            onClick={handleAddSchedule}
                        >
                            <AddOne theme="outline" size="16" />
                            <span>添加排课</span>
                        </button>
                        <button 
                            className="btn btn-accent btn-sm flex items-center gap-1"
                            onClick={() => navigate("/academic/schedule/automatic")}
                        >
                            <Schedule theme="outline" size="16" />
                            <span>自动排课</span>
                        </button>
                    </div>
                </div>
            )}
            
            {viewMode === "list" ? (
                <>
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* 左侧筛选区 */}
                        <div className="lg:w-80 w-full">
                            <div className="card bg-base-100 shadow-xl border border-base-200 rounded-xl overflow-hidden">
                                <div className="card-body p-5">
                                    <h3 className="text-lg font-semibold flex items-center gap-2 pb-2 border-b border-base-200">
                                        <Search theme="outline" size="20" />
                                        排课筛选
                                    </h3>
                                    
                                    {/* 搜索框 */}
                                    <div className="relative mt-4">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-primary">
                                            <Search theme="outline" size="18" />
                                        </div>
                                        <input
                                            ref={inputFocus}
                                            type="text"
                                            placeholder="搜索排课内容..."
                                            className="input input-bordered input-primary w-full pl-10 pr-16 focus:ring-2 focus:ring-primary/20 transition-all"
                                            value={searchTerm}
                                            onChange={(e) => {
                                                setSearchTerm(e.target.value);
                                                setCurrentPage(1);
                                            }}
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center opacity-70">
                                            <kbd className="kbd kbd-sm">Ctrl</kbd>
                                            <span className="mx-1">+</span>
                                            <kbd className="kbd kbd-sm">K</kbd>
                                        </div>
                                    </div>
                                    
                                    {/* 重置按钮 */}
                                    <button 
                                        className="btn btn-outline btn-sm w-full mt-3 hover:bg-base-200 transition-all"
                                        onClick={handleReset}
                                    >
                                        重置所有筛选条件
                                    </button>
                                    
                                    {/* 筛选条件列表 */}
                                    <div className="divider my-2"></div>
                                    
                                    <div className="space-y-4 mt-1">
                                        <div className="filter-group">
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
                                        
                                        <div className="filter-group">
                                            <label className="text-sm font-medium flex items-center gap-1.5 mb-1.5 text-primary">
                                                <div className="w-1 h-4 bg-primary rounded-full"></div>
                                                教学班选择
                                            </label>
                                            <select 
                                                className="select select-bordered w-full hover:border-primary focus:border-primary transition-colors"
                                                value={selectedTeachingClass}
                                                onChange={(e) => setSelectedTeachingClass(e.target.value)}
                                                disabled={loadingTeachingClasses || !selectedSemester}
                                            >
                                                <option value="">选择教学班</option>
                                                {teachingClasses.map((teachingClass) => (
                                                    <option 
                                                        key={teachingClass.teaching_class_uuid} 
                                                        value={teachingClass.teaching_class_uuid}
                                                    >
                                                        {teachingClass.teaching_class_name}
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
                                        
                                        <div className="filter-group">
                                            <label className="text-sm font-medium flex items-center gap-1.5 mb-1.5 text-primary">
                                                <div className="w-1 h-4 bg-primary rounded-full"></div>
                                                班级选择
                                            </label>
                                            <select 
                                                className="select select-bordered w-full hover:border-primary focus:border-primary transition-colors"
                                                value={selectedClass}
                                                onChange={(e) => setSelectedClass(e.target.value)}
                                                disabled={loadingClasses}
                                            >
                                            <option value="">所有班级</option>
                                                {administrativeClasses.map(cls => (
                                                    <option 
                                                        key={cls.administrative_class_uuid} 
                                                        value={cls.administrative_class_uuid}
                                                    >
                                                        {cls.class_name}
                                                    </option>
                                                ))}
                                            </select>
                                            {loadingClasses && (
                                                <div className="text-xs text-base-content/70 mt-1 flex items-center">
                                                    <span className="loading loading-spinner loading-xs mr-1"></span>
                                                    加载班级数据中...
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="filter-group">
                                            <label className="text-sm font-medium flex items-center gap-1.5 mb-1.5 text-primary">
                                                <div className="w-1 h-4 bg-primary rounded-full"></div>
                                                教室选择
                                            </label>
                                            <select 
                                                className="select select-bordered w-full hover:border-primary focus:border-primary transition-colors"
                                                value={selectedClassroom}
                                                onChange={(e) => setSelectedClassroom(e.target.value)}
                                                disabled={loadingClassrooms}
                                            >
                                                <option value="">所有教室</option>
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
                                        
                                        <div className="filter-group">
                                            <label className="text-sm font-medium flex items-center gap-1.5 mb-1.5 text-primary">
                                                <div className="w-1 h-4 bg-primary rounded-full"></div>
                                                教师选择
                                            </label>
                                            <select 
                                                className="select select-bordered w-full hover:border-primary focus:border-primary transition-colors"
                                                value={selectedTeacher}
                                                onChange={(e) => setSelectedTeacher(e.target.value)}
                                                disabled={loadingTeachers}
                                            >
                                                <option value="">所有教师</option>
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
                                    </div>
                                    
                                    <div className="divider my-2"></div>
                                    
                                    <div className="text-xs text-base-content/60 bg-base-200/50 p-2 rounded-md">
                                        <p>选择筛选条件后系统将自动加载符合条件的排课数据</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* 右侧内容区 */}
                        <div className="flex-1 flex flex-col gap-4">
                            <ScheduleListComponent
                                schedules={getCurrentPageSchedules()}
                                loading={loading}
                                onView={(schedule) => handleViewScheduleGrid(schedule, "class")}
                                onEdit={handleEditSchedule}
                                onDelete={handleDeleteSchedule}
                            />
                            
                            <PaginationComponent
                                currentPage={currentPage}
                                totalPages={totalPages}
                                isDescending={isDescending}
                                itemsPerPage={itemsPerPage}
                                onPageChange={setCurrentPage}
                                onItemsPerPageChange={(value) => {
                                    setItemsPerPage(value);
                                    setCurrentPage(1);
                                }}
                                onSortDirectionChange={setIsDescending}
                            />
                        </div>
                    </div>
                </>
            ) : viewMode === "grid" ? (
                <>
                    {/* 课程表视图 */}
                    <div className="flex justify-between items-center">
                        <button
                            className="btn btn-sm btn-ghost flex items-center gap-1"
                            onClick={handleBackToList}
                        >
                            <ArrowLeft theme="outline" size="16" />
                            <span>返回列表</span>
                        </button>
                        
                        <h1 className="text-2xl font-bold">
                            {selectedFilter && (
                                <>
                                    {selectedFilter.type === "class" && `${selectedFilter.value} 课程表`}
                                    {selectedFilter.type === "teacher" && `${selectedFilter.value} 授课表`}
                                    {selectedFilter.type === "classroom" && `${selectedFilter.value} 排课表`}
                                </>
                            )}
                            {selectedSemester && ` (${getSemesterName(selectedSemester)})`}
                        </h1>
                        
                        <div className="w-32"></div> {/* 占位元素，保持标题居中 */}
                    </div>
                    
                    <ScheduleGridComponent
                        scheduleData={getScheduleGridData()}
                        loading={loading}
                        onCellClick={(cell) => console.log("点击课程:", cell)}
                    />
                </>
            ) : null}
        </div>
    );
}
