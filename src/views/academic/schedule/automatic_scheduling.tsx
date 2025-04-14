/*
 * --------------------------------------------------------------------------------
 * Copyright (c) 2022-NOW(至今) 锋楪技术团队
 * Author: 锋楪技术团队 (https://www.frontleaves.com)
 *
 * 本文件包含锋楪技术团队项目的源代码，项目的所有源代码均遵循 MIT 开源许可证协议。
 * --------------------------------------------------------------------------------
 */

import React, { useEffect, useState } from "react";
import { ArrowLeft, Delete, Plus, Schedule } from "@icon-park/react";
import { message, Collapse, Badge, Tag, Tooltip, Divider, Table, Button } from "antd";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { AutomaticClassSchedulingDTO, SpecificCourseIdVO } from "../../../models/dto/automatic_scheduling_dto";
import { GetSemesterListAPI } from "../../../apis/semester_api";
import { SemesterEntity } from "../../../models/entity/semester_entity";
import { AutomaticSchedulingAPI } from "../../../apis/scheduling_api";
import { SiteInfoEntity } from "../../../models/entity/site_info_entity";
import { GetCourseTypeListAPI } from "../../../apis/course_type_api";
import { CourseTypeEntity } from "../../../models/entity/course_type_entity";
import { GetBuildingListAPI } from "../../../apis/building_api";
import { BuildingLiteEntity } from "../../../models/entity/building_lite_entity";
import { GetCourseListAPI } from "../../../apis/course_api";
import { CourseLibraryEntity } from "../../../models/entity/course_library_entity";
import { GetAllAdministrativeClassListAPI } from "../../../apis/administrative_class_api";
import { AdministrativeClassEntity } from "../../../models/entity/administrative_class_entity";
import { AcademicAffairsStore } from "../../../models/store/academic_affairs_store";
import { HolidayWarningComponent, checkHolidayConflicts } from "../../../components/academic/schedule/holiday_warning_component";

/**
 * # 自动排课页面
 * 
 * 提供一个表单界面，用于设置自动排课参数并提交排课任务
 * 
 * @param site 站点信息
 * @returns 自动排课页面组件
 */
export function AutomaticScheduling({ site }: Readonly<{ site: SiteInfoEntity }>) {
    const navigate = useNavigate();
    // 从Redux store获取学术事务信息
    const academicAffairs = useSelector((state: { academicAffairs: AcademicAffairsStore }) => state.academicAffairs);
    
    const [submitting, setSubmitting] = useState(false);
    const [loadingSemesters, setLoadingSemesters] = useState(false);
    const [loadingCourseTypes, setLoadingCourseTypes] = useState(false);
    const [loadingBuildings, setLoadingBuildings] = useState(false);
    const [loadingCourses, setLoadingCourses] = useState(false);
    const [loadingTeachingClasses, setLoadingTeachingClasses] = useState(false);
    const [semesters, setSemesters] = useState<SemesterEntity[]>([]);
    const [courseTypes, setCourseTypes] = useState<CourseTypeEntity[]>([]);
    const [buildings, setBuildings] = useState<BuildingLiteEntity[]>([]);
    const [courseList, setCourseList] = useState<CourseLibraryEntity[]>([]);
    const [teachingClasses, setTeachingClasses] = useState<AdministrativeClassEntity[]>([]);
    const { Panel } = Collapse;
    
    // 用于临时存储要添加的优先时间段
    const [newTimeSlot, setNewTimeSlot] = useState<{
        day_of_week: number;
        period_start: number;
        period_end: number;
        priority_level: number;
    }>({
        day_of_week: 1,
        period_start: 1,
        period_end: 2,
        priority_level: 5
    });
    
    // 临时存储要添加的课程类型优先级
    const [newCourseTypePriority, setNewCourseTypePriority] = useState<{
        course_type_uuid: string;
        priority_level: number;
    }>({
        course_type_uuid: "",
        priority_level: 5
    });

    // 用于临时存储要添加的特定课程
    const [newSpecificCourse, setNewSpecificCourse] = useState<Partial<SpecificCourseIdVO>>({
        class_id: [],
        is_odd_week: false,
        course_enu_type: "MIXED"
    });

    // 是否为选修课 - 默认为必修课
    const [isElectiveCourse, setIsElectiveCourse] = useState(false);

    // 选择的课程
    const [selectedCourse, setSelectedCourse] = useState<{
        uuid: string;
        name: string;
    }>({ uuid: "", name: "" });

    // 选择的行政班级列表
    const [selectedClasses, setSelectedClasses] = useState<{
        uuid: string;
        name: string;
    }[]>([]);

    // 排课表单数据
    const [formData, setFormData] = useState<AutomaticClassSchedulingDTO>({
        semester_uuid: "",
        department_uuid: academicAffairs.departmentInfo?.department_uuid || "",
        strategy: "OPTIMAL",
        constraints: {
            teacher_preference: true,
            room_optimization: true,
            student_conflict_avoidance: true,
            consecutive_courses_preferred: true,
            specialization_room_matching: true
        },
        priority_settings: {
            course_types: []
        },
        time_preferences: {
            avoid_evening_courses: true,
            balance_weekday_courses: true,
            preferred_time_slots: []
        },
        scope_settings: {
            specific_course_ids: [],
            allowed_building_ids: []
        }
    });

    // 节假日检查状态
    const [holidayConflictDates, setHolidayConflictDates] = useState<string[]>([]);
    const [showHolidayWarning, setShowHolidayWarning] = useState(false);

    // 添加课程类型定义
    interface SpecificCourse {
        course_id: string;
        class_id?: (string | null)[];
        number?: number;
        weekly_hours: number;
        course_enu_type: "THEORY" | "PRACTICE" | "MIXED" | "EXPERIMENT" | "COMPUTER" | "OTHER";
        start_week: number;
        end_week: number;
        is_odd_week?: boolean;
        key?: number;
        courseType?: string;
    }

    // 设置页面标题
    useEffect(() => {
        document.title = `自动排课 | ${site.name ?? "课程排表系统"}`;
    }, [site.name]);

    // 在组件挂载后调试departmentInfo
    useEffect(() => {
        formData.department_uuid = academicAffairs.currentAcademicAffairs?.department || "";
    }, [academicAffairs]);

    // 获取院系列表
    useEffect(() => {
        // 如果已有部门信息，就不需要加载所有院系列表
        if (academicAffairs.departmentInfo) {
            return;
        }
    }, [academicAffairs.departmentInfo]);

    // 获取学期列表
    useEffect(() => {
        const fetchSemesters = async () => {
            setLoadingSemesters(true);
            try {
                const response = await GetSemesterListAPI();
                if (response && response.output === "Success" && response.data) {
                    setSemesters(response.data);
                    // 如果有学期数据且未选择学期，则默认选择第一个启用的学期
                    if (response.data.length > 0 && !formData.semester_uuid) {
                        const enabledSemesters = response.data.filter(sem => sem.is_enabled);
                        if (enabledSemesters.length > 0) {
                            setFormData(prev => ({
                                ...prev,
                                semester_uuid: enabledSemesters[0].semester_uuid
                            }));
                        } else if (response.data[0]) {
                            setFormData(prev => ({
                                ...prev,
                                semester_uuid: response.data![0].semester_uuid
                            }));
                        }
                    }
                } else {
                    message.error(response?.error_message || "获取学期列表失败");
                }
            } catch (error) {
                console.error("获取学期数据失败:", error);
                message.error("获取学期数据失败，请检查网络连接");
            } finally {
                setLoadingSemesters(false);
            }
        };

        fetchSemesters();
    }, []);

    // 获取课程类型列表
    useEffect(() => {
        const fetchCourseTypes = async () => {
            setLoadingCourseTypes(true);
            try {
                const response = await GetCourseTypeListAPI();
                if (response && response.output === "Success" && response.data) {
                    setCourseTypes(response.data);
                } else {
                    message.error(response?.error_message || "获取课程类型列表失败");
                }
            } catch (error) {
                console.error("获取课程类型数据失败:", error);
                message.error("获取课程类型数据失败，请检查网络连接");
            } finally {
                setLoadingCourseTypes(false);
            }
        };

        fetchCourseTypes();
    }, []);

    // 获取教学楼列表
    useEffect(() => {
        const fetchBuildings = async () => {
            setLoadingBuildings(true);
            try {
                const response = await GetBuildingListAPI();
                if (response && response.output === "Success" && response.data) {
                    setBuildings(response.data);
                } else {
                    message.error(response?.error_message || "获取教学楼列表失败");
                }
            } catch (error) {
                console.error("获取教学楼数据失败:", error);
                message.error("获取教学楼数据失败，请检查网络连接");
            } finally {
                setLoadingBuildings(false);
            }
        };

        fetchBuildings();
    }, []);

    // 获取行政班级列表
    useEffect(() => {
        // 需要选择了学期和部门才加载行政班级列表
        if (!formData.semester_uuid || !formData.department_uuid) {
            console.log("未设置学期或部门UUID，跳过获取行政班级");
            return;
        }

        const fetchAdministrativeClasses = async () => {
            setLoadingTeachingClasses(true);
            try {
                console.log("正在获取行政班级，参数:", {
                    department_uuid: formData.department_uuid,
                    is_enabled: true
                });
                
                const response = await GetAllAdministrativeClassListAPI({
                    department_uuid: formData.department_uuid,
                    is_enabled: true
                });
                
                console.log("行政班级API响应:", response);
                
                if (response && response.output === "Success" && response.data) {
                    console.log("获取到行政班级数据:", response.data.length);
                    if (response.data.length > 0) {
                        console.log("行政班级示例:", response.data[0]);
                    }
                    setTeachingClasses(response.data);
                } else {
                    console.error("获取行政班级失败:", response?.error_message);
                    message.error(response?.error_message || "获取行政班级列表失败");
                }
            } catch (error) {
                console.error("获取行政班级数据失败:", error);
                message.error("获取行政班级数据失败，请检查网络连接");
            } finally {
                setLoadingTeachingClasses(false);
            }
        };

        fetchAdministrativeClasses();
    }, [formData.semester_uuid, formData.department_uuid]);

    // 获取课程库列表 - 不依赖学期UUID
    useEffect(() => {
        if (!formData.department_uuid) {
            console.log("未设置部门UUID，跳过获取课程");
            return;
        }

        const fetchCourses = async () => {
            setLoadingCourses(true);
            try {
                console.log("正在获取课程，部门UUID:", formData.department_uuid);
                
                // 调整API调用，确保参数正确
                const response = await GetCourseListAPI(
                    undefined, 
                    undefined, 
                    undefined, 
                    undefined, 
                    formData.department_uuid
                );
                
                console.log("课程API响应:", response);
                
                if (response && response.output === "Success" && response.data) {
                    // 不再二次筛选，直接使用API返回的数据
                    console.log("获取到课程数据:", response.data.length);
                    setCourseList(response.data);
                } else {
                    console.error("获取课程失败:", response?.error_message);
                    message.error(response?.error_message || "获取课程列表失败");
                }
            } catch (error) {
                console.error("获取课程数据失败:", error);
                message.error("获取课程数据失败，请检查网络连接");
            } finally {
                setLoadingCourses(false);
            }
        };

        fetchCourses();
    }, [formData.department_uuid]);

    // 在合适的useEffect中添加，例如在timeSlots变化时检查
    useEffect(() => {
        if (formData.time_preferences.preferred_time_slots.length > 0 && formData.semester_uuid) {
            checkHolidays();
        }
    }, [formData.time_preferences.preferred_time_slots, formData.semester_uuid]);
    
    // 添加检查节假日冲突的函数
    const checkHolidays = () => {
        if (!formData.semester_uuid || formData.time_preferences.preferred_time_slots.length === 0) {
            setHolidayConflictDates([]);
            setShowHolidayWarning(false);
            return;
        }
        
        try {
            // 获取当前学期信息
            const semester = semesters.find(sem => sem.semester_uuid === formData.semester_uuid);
            if (!semester) {
                setHolidayConflictDates([]);
                setShowHolidayWarning(false);
                return;
            }
            
            // 将学期开始日期从时间戳转换为ISO日期字符串 YYYY-MM-DD
            const semesterStartDate = new Date(semester.start_date).toISOString().split('T')[0];
            
            // 检查节假日冲突
            const timeSlotData = formData.time_preferences.preferred_time_slots.map(slot => ({
                day_of_week: slot.day_of_week,
                week_numbers: slot.week_numbers
            }));
            
            const conflicts = checkHolidayConflicts(semesterStartDate, timeSlotData);
            const conflictDates = conflicts.map(conflict => conflict.date);
            
            setHolidayConflictDates(conflictDates);
            setShowHolidayWarning(conflictDates.length > 0);
        } catch (error) {
            console.error("检查节假日冲突出错:", error);
        }
    };

    // 提交排课任务
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            
            // 检查并使用Redux中的部门信息
            const submissionData: AutomaticClassSchedulingDTO = { 
                ...formData
            };
            
            // 如果表单中没有设置部门，但Redux中有部门信息，则使用Redux中的部门信息
            if (!submissionData.department_uuid && academicAffairs.currentAcademicAffairs?.department) {
                submissionData.department_uuid = academicAffairs.currentAcademicAffairs.department;
            }
            
            // 验证必要参数
            if (!submissionData.semester_uuid) {
                message.error("请选择学期");
                return;
            }
            
            if (!submissionData.department_uuid) {
                message.error("请选择院系");
                return;
            }
            
            // 验证是否添加了课程
            if (!submissionData.scope_settings.specific_course_ids || submissionData.scope_settings.specific_course_ids.length === 0) {
                message.error("请至少添加一门需要排课的课程");
                return;
            }
            
            // 添加节假日冲突检查
            if (holidayConflictDates.length > 0) {
                if (!window.confirm(`当前排课时间包含法定节假日，确定继续提交吗？\n冲突日期: ${holidayConflictDates.join(', ')}`)) {
                    return;
                }
            }
            
            console.log("提交排课请求数据:", submissionData);
            
            const response = await AutomaticSchedulingAPI(submissionData);
            console.log("排课API响应:", response);
            
            if (response?.output === "Success" && response.data) {
                message.success("自动排课任务已提交");
                
                // 排课任务提交成功后直接导航到排课管理页面
                navigate("/academic/schedule");
            } else {
                message.error(response?.error_message || "排课任务提交失败");
            }
        } catch (error) {
            console.error("排课任务提交失败:", error);
            message.error("排课任务提交失败，请检查网络连接");
        } finally {
            setSubmitting(false);
        }
    };

    // 处理表单输入变化
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        if (name === "semester_uuid" || name === "department_uuid" || name === "strategy") {
            setFormData({
                ...formData,
                [name]: value
            });
        } else if (name.startsWith("constraints.")) {
            const constraintName = name.split(".")[1];
            setFormData({
                ...formData,
                constraints: {
                    ...formData.constraints,
                    [constraintName]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value === "true"
                }
            });
        } else if (name.startsWith("time_preferences.")) {
            const prefName = name.split(".")[1];
            setFormData({
                ...formData,
                time_preferences: {
                    ...formData.time_preferences,
                    [prefName]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value === "true"
                }
            });
        } else if (name.startsWith("newTimeSlot.")) {
            const field = name.split(".")[1];
            setNewTimeSlot({
                ...newTimeSlot,
                [field]: type === "number" ? parseInt(value) : value
            });
        } else if (name.startsWith("newCourseTypePriority.")) {
            const field = name.split(".")[1];
            setNewCourseTypePriority({
                ...newCourseTypePriority,
                [field]: field === "priority_level" ? parseInt(value) : value
            });
        }
    };
    
    // 添加优先时间段
    const handleAddTimeSlot = () => {
        // 验证时间段
        if (newTimeSlot.period_start > newTimeSlot.period_end) {
            message.error("开始节次不能大于结束节次");
            return;
        }
        
        if (newTimeSlot.priority_level < 1 || newTimeSlot.priority_level > 10) {
            message.error("优先级必须在1-10之间");
            return;
        }
        
        // 添加到表单数据
        const updatedTimeSlots = [
            ...(formData.time_preferences.preferred_time_slots || []),
            { ...newTimeSlot }
        ];
        
        setFormData({
            ...formData,
            time_preferences: {
                ...formData.time_preferences,
                preferred_time_slots: updatedTimeSlots
            }
        });
        
        // 重置新时间段
        setNewTimeSlot({
            day_of_week: 1,
            period_start: 1,
            period_end: 2,
            priority_level: 5
        });
        
        message.success("已添加优先时间段");
    };
    
    // 删除优先时间段
    const handleRemoveTimeSlot = (index: number) => {
        const updatedTimeSlots = [...(formData.time_preferences.preferred_time_slots || [])];
        updatedTimeSlots.splice(index, 1);
        
        setFormData({
            ...formData,
            time_preferences: {
                ...formData.time_preferences,
                preferred_time_slots: updatedTimeSlots
            }
        });
        
        message.success("已删除优先时间段");
    };
    
    // 添加课程类型优先级
    const handleAddCourseTypePriority = () => {
        if (!newCourseTypePriority.course_type_uuid) {
            message.error("请选择课程类型");
            return;
        }
        
        if (newCourseTypePriority.priority_level < 1 || newCourseTypePriority.priority_level > 10) {
            message.error("优先级必须在1-10之间");
            return;
        }
        
        // 检查是否已存在
        const existingIndex = formData.priority_settings.course_types?.findIndex(
            ct => ct.course_type_uuid === newCourseTypePriority.course_type_uuid
        );
        
        if (existingIndex !== undefined && existingIndex >= 0) {
            message.error("该课程类型已添加优先级");
            return;
        }
        
        // 添加到表单数据
        const updatedCourseTypes = [
            ...(formData.priority_settings.course_types || []),
            { ...newCourseTypePriority }
        ];
        
        setFormData({
            ...formData,
            priority_settings: {
                ...formData.priority_settings,
                course_types: updatedCourseTypes
            }
        });
        
        // 重置
        setNewCourseTypePriority({
            course_type_uuid: "",
            priority_level: 5
        });
        
        message.success("已添加课程类型优先级");
    };
    
    // 删除课程类型优先级
    const handleRemoveCourseTypePriority = (index: number) => {
        const updatedCourseTypes = [...(formData.priority_settings.course_types || [])];
        updatedCourseTypes.splice(index, 1);
        
        setFormData({
            ...formData,
            priority_settings: {
                ...formData.priority_settings,
                course_types: updatedCourseTypes
            }
        });
        
        message.success("已删除课程类型优先级");
    };
    
    // 添加或移除教学楼到范围设置
    const handleToggleBuilding = (buildingId: string) => {
        const currentBuildingIds = formData.scope_settings.allowed_building_ids || [];
        let updatedBuildingIds: string[];
        
        if (currentBuildingIds.includes(buildingId)) {
            // 如果已存在，则移除
            updatedBuildingIds = currentBuildingIds.filter(id => id !== buildingId);
        } else {
            // 否则添加
            updatedBuildingIds = [...currentBuildingIds, buildingId];
        }
        
        setFormData({
            ...formData,
            scope_settings: {
                ...formData.scope_settings,
                allowed_building_ids: updatedBuildingIds
            }
        });
    };
    
    // 将星期几转换为中文
    const getDayOfWeekName = (day: number): string => {
        const days = ["", "周一", "周二", "周三", "周四", "周五", "周六", "周日"];
        return days[day] || "未知";
    };
    
    // 获取课程类型名称
    const getCourseTypeName = (uuid: string): string => {
        const courseType = courseTypes.find(ct => ct.course_type_uuid === uuid);
        return courseType?.name || "未知课程类型";
    };

    // 处理课程选择
    const handleCourseSelect = (courseUuid: string) => {
        console.log("选择课程:", courseUuid);
        const course = courseList.find(c => c.course_library_uuid === courseUuid);
        console.log("找到课程对象:", course);
        
        if (course) {
            setSelectedCourse({
                uuid: course.course_library_uuid!,
                name: course.name
            });
            setNewSpecificCourse({
                ...newSpecificCourse,
                course_id: course.course_library_uuid
            });
            console.log("已设置选中课程:", course.name);
        } else {
            setSelectedCourse({ uuid: "", name: "" });
            setNewSpecificCourse({
                ...newSpecificCourse,
                course_id: undefined
            });
            console.log("清除选中课程");
        }
    };

    // 修改行政班级选择函数
    const handleClassSelect = (administrative_class_uuid: string) => {
        console.log("选择班级, UUID:", administrative_class_uuid);
        
        // 查找选中的班级
        const selectedClass = teachingClasses.find(c => c.administrative_class_uuid === administrative_class_uuid);
        console.log("找到班级对象:", selectedClass);
        
        if (!selectedClass) {
            console.error("未找到对应班级!");
            return;
        }
        
        // 检查是否已选择
        const isAlreadySelected = selectedClasses.some(c => c.uuid === administrative_class_uuid);
        console.log("班级已被选择?", isAlreadySelected);
        
        // 更新选择的班级列表
        let newSelectedClasses;
        if (isAlreadySelected) {
            // 如果已选择，就移除
            newSelectedClasses = selectedClasses.filter(c => c.uuid !== administrative_class_uuid);
        } else {
            // 如果未选择，就添加
            newSelectedClasses = [
                ...selectedClasses,
                {
                    uuid: administrative_class_uuid,
                    name: selectedClass.class_name
                }
            ];
        }
        
        console.log("更新后的班级列表:", newSelectedClasses);
        
        // 设置新的班级列表
        setSelectedClasses(newSelectedClasses);
        
        // 更新课程信息中的班级ID
        const classIds = newSelectedClasses.map(c => c.uuid);
        setNewSpecificCourse(prev => ({
            ...prev,
            class_id: classIds.length > 0 ? classIds : [null]
        }));
    };

    // 添加特定课程
    const handleAddSpecificCourse = () => {
        if (!selectedCourse.uuid) {
            message.error("请选择课程");
            return;
        }
        
        if (!newSpecificCourse.weekly_hours || newSpecificCourse.weekly_hours <= 0) {
            message.error("请设置周学时数");
            return;
        }
        
        if (!newSpecificCourse.start_week || !newSpecificCourse.end_week || 
            newSpecificCourse.start_week > newSpecificCourse.end_week) {
            message.error("请设置有效的起止周");
            return;
        }
        
        // 选修课必须设置人数
        if (isElectiveCourse && (!newSpecificCourse.number || newSpecificCourse.number <= 0)) {
            message.error("选修课必须设置人数");
            return;
        }
        
        // 必修课必须选择班级
        if (!isElectiveCourse && selectedClasses.length === 0) {
            message.error("必修课必须选择班级");
            return;
        }
        
        // 检查是否已存在相同的课程
        const isDuplicate = formData.scope_settings.specific_course_ids?.some(
            course => course.course_id === selectedCourse.uuid
        );
        
        if (isDuplicate) {
            message.error("该课程已添加");
            return;
        }
        
        // 准备班级ID和人数
        let classIds: string[] = [];
        let studentNumber = null;
        
        if (isElectiveCourse) {
            // 选修课使用空数组作为班级ID，并设置人数
            classIds = [];
            studentNumber = newSpecificCourse.number || 0;
        } else {
            // 必修课使用选择的班级ID列表，人数设置为传入的值，如果未设置则默认为null
            classIds = selectedClasses.map(c => c.uuid);
            studentNumber = newSpecificCourse.number || null;
        }
        
        console.log("添加课程:", {
            课程UUID: selectedCourse.uuid,
            课程名称: selectedCourse.name,
            班级IDs: classIds,
            人数: studentNumber,
            周学时: newSpecificCourse.weekly_hours,
            课程类型: newSpecificCourse.course_enu_type,
            单双周: newSpecificCourse.is_odd_week,
            起始周: newSpecificCourse.start_week,
            结束周: newSpecificCourse.end_week
        });
        
        // 创建符合API要求的课程对象
        const specificCourse: SpecificCourseIdVO = {
            course_id: selectedCourse.uuid,
            class_id: classIds,
            number: studentNumber,
            weekly_hours: newSpecificCourse.weekly_hours!,
            course_enu_type: newSpecificCourse.course_enu_type || "MIXED",
            is_odd_week: newSpecificCourse.is_odd_week || false,
            start_week: newSpecificCourse.start_week!,
            end_week: newSpecificCourse.end_week!
        };
        
        // 添加到表单数据
        const updatedSpecificCourses = [
            ...(formData.scope_settings.specific_course_ids || []),
            specificCourse
        ];
        
        setFormData({
            ...formData,
            scope_settings: {
                ...formData.scope_settings,
                specific_course_ids: updatedSpecificCourses
            }
        });
        
        // 重置输入
        setNewSpecificCourse({
            class_id: [],
            is_odd_week: false,
            course_enu_type: "MIXED"
        });
        setSelectedCourse({ uuid: "", name: "" });
        setSelectedClasses([]);
        setIsElectiveCourse(false);
        
        message.success("已添加课程");
    };

    // 处理删除特定课程
    const handleRemoveSpecificCourse = (index: number) => {
        const updatedSpecificCourses = [...(formData.scope_settings.specific_course_ids || [])];
        updatedSpecificCourses.splice(index, 1);
        setFormData({
            ...formData,
            scope_settings: {
                ...formData.scope_settings,
                specific_course_ids: updatedSpecificCourses
            }
        });
        message.success("已删除课程");
    };

    return (
        <div className="space-y-6 w-full">
            {/* 顶部导航 */}
            <div className="flex items-center justify-between bg-base-100 p-4 rounded-lg shadow-sm border border-base-200">
                <div className="flex items-center space-x-3">
                    <button 
                        className="btn btn-sm btn-outline" 
                        onClick={() => navigate("/academic/schedule")}
                    >
                        <ArrowLeft />
                        返回排课管理
                    </button>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Schedule theme="outline" size="24" />
                        自动排课
                    </h2>
                </div>
            </div>

            {/* 主要内容 */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* 七三分布局 */}
                <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
                    {/* 左侧详细内容区域 - 占7份 */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* 高级设置折叠面板 */}
                        <Collapse 
                            className="rounded-lg overflow-hidden shadow-sm border border-base-200"
                            defaultActiveKey={["constraints", "time_preferences"]}
                        >
                            {/* 排课约束面板 */}
                            <Panel 
                                header={
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg font-medium">排课约束</span>
                                        <Badge 
                                            count={
                                                Object.values(formData.constraints).filter(Boolean).length
                                            } 
                                            className="ml-2"
                                            color="blue"
                                        />
                                    </div>
                                } 
                                key="constraints"
                            >
                                <div className="p-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="form-control">
                                            <label className="cursor-pointer label justify-between">
                                                <div>
                                                    <span className="label-text text-base">考虑教师时间偏好</span>
                                                    <Tooltip title="尊重教师提交的时间偏好，优先在教师可用时间内排课">
                                                        <span className="ml-1 text-gray-500 text-sm cursor-help">[?]</span>
                                                    </Tooltip>
                                                </div>
                                                <input 
                                                    type="checkbox" 
                                                    className="toggle toggle-primary" 
                                                    name="constraints.teacher_preference"
                                                    checked={formData.constraints.teacher_preference}
                                                    onChange={handleInputChange}
                                                />
                                            </label>
                                        </div>
                                        <div className="form-control">
                                            <label className="cursor-pointer label justify-between">
                                                <div>
                                                    <span className="label-text text-base">优化教室资源分配</span>
                                                    <Tooltip title="根据班级人数和课程性质选择合适大小的教室">
                                                        <span className="ml-1 text-gray-500 text-sm cursor-help">[?]</span>
                                                    </Tooltip>
                                                </div>
                                                <input 
                                                    type="checkbox" 
                                                    className="toggle toggle-primary" 
                                                    name="constraints.room_optimization"
                                                    checked={formData.constraints.room_optimization}
                                                    onChange={handleInputChange}
                                                />
                                            </label>
                                        </div>
                                        <div className="form-control">
                                            <label className="cursor-pointer label justify-between">
                                                <div>
                                                    <span className="label-text text-base">避免学生班级冲突</span>
                                                    <Tooltip title="确保同一个班级的学生不会同时有多门课程安排">
                                                        <span className="ml-1 text-gray-500 text-sm cursor-help">[?]</span>
                                                    </Tooltip>
                                                </div>
                                                <input 
                                                    type="checkbox" 
                                                    className="toggle toggle-primary" 
                                                    name="constraints.student_conflict_avoidance"
                                                    checked={formData.constraints.student_conflict_avoidance}
                                                    onChange={handleInputChange}
                                                />
                                            </label>
                                        </div>
                                        <div className="form-control">
                                            <label className="cursor-pointer label justify-between">
                                                <div>
                                                    <span className="label-text text-base">优先安排连堂课</span>
                                                    <Tooltip title="对于多课时的课程，尽量安排为连续的课时">
                                                        <span className="ml-1 text-gray-500 text-sm cursor-help">[?]</span>
                                                    </Tooltip>
                                                </div>
                                                <input 
                                                    type="checkbox" 
                                                    className="toggle toggle-primary" 
                                                    name="constraints.consecutive_courses_preferred"
                                                    checked={formData.constraints.consecutive_courses_preferred}
                                                    onChange={handleInputChange}
                                                />
                                            </label>
                                        </div>
                                        <div className="form-control">
                                            <label className="cursor-pointer label justify-between">
                                                <div>
                                                    <span className="label-text text-base">专业教室匹配</span>
                                                    <Tooltip title="如实验课安排在实验室，体育课安排在体育场等">
                                                        <span className="ml-1 text-gray-500 text-sm cursor-help">[?]</span>
                                                    </Tooltip>
                                                </div>
                                                <input 
                                                    type="checkbox" 
                                                    className="toggle toggle-primary" 
                                                    name="constraints.specialization_room_matching"
                                                    checked={formData.constraints.specialization_room_matching}
                                                    onChange={handleInputChange}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </Panel>

                            {/* 时间偏好面板 */}
                            <Panel 
                                header={
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg font-medium">时间偏好</span>
                                        <Badge 
                                            count={
                                                (formData.time_preferences.avoid_evening_courses ? 1 : 0) + 
                                                (formData.time_preferences.balance_weekday_courses ? 1 : 0) +
                                                (formData.time_preferences.preferred_time_slots?.length || 0)
                                            } 
                                            className="ml-2"
                                            color="green"
                                        />
                                    </div>
                                } 
                                key="time_preferences"
                            >
                                <div className="p-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div className="form-control">
                                            <label className="cursor-pointer label justify-between">
                                                <div>
                                                    <span className="label-text text-base">避免晚间课程安排</span>
                                                    <Tooltip title="尽量避免将课程安排在晚上">
                                                        <span className="ml-1 text-gray-500 text-sm cursor-help">[?]</span>
                                                    </Tooltip>
                                                </div>
                                                <input 
                                                    type="checkbox" 
                                                    className="toggle toggle-success" 
                                                    name="time_preferences.avoid_evening_courses"
                                                    checked={formData.time_preferences.avoid_evening_courses}
                                                    onChange={handleInputChange}
                                                />
                                            </label>
                                        </div>
                                        <div className="form-control">
                                            <label className="cursor-pointer label justify-between">
                                                <div>
                                                    <span className="label-text text-base">平衡周内课程分布</span>
                                                    <Tooltip title="尽量使课程在周一至周五均匀分布">
                                                        <span className="ml-1 text-gray-500 text-sm cursor-help">[?]</span>
                                                    </Tooltip>
                                                </div>
                                                <input 
                                                    type="checkbox" 
                                                    className="toggle toggle-success" 
                                                    name="time_preferences.balance_weekday_courses"
                                                    checked={formData.time_preferences.balance_weekday_courses}
                                                    onChange={handleInputChange}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                    
                                    <Divider orientation="left">优先时间段</Divider>
                                    
                                    {/* 已添加的优先时间段列表 */}
                                    {formData.time_preferences.preferred_time_slots && formData.time_preferences.preferred_time_slots.length > 0 ? (
                                        <div className="mb-4">
                                            <h3 className="font-medium mb-2">已添加的优先时间段</h3>
                                            <div className="grid grid-cols-1 gap-2">
                                                {formData.time_preferences.preferred_time_slots.map((slot, index) => (
                                                    <div key={index} className="flex justify-between items-center p-2 bg-base-200 rounded-md">
                                                        <span>
                                                            {getDayOfWeekName(slot.day_of_week)} 第{slot.period_start}-{slot.period_end}节
                                                            <Tag color="blue" className="ml-2">优先级: {slot.priority_level}</Tag>
                                                        </span>
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-ghost btn-circle"
                                                            onClick={() => handleRemoveTimeSlot(index)}
                                                        >
                                                            <Delete theme="outline" size="16" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mb-4 p-4 text-center bg-base-200/50 rounded-md">
                                            <p className="text-base-content/70">暂无优先时间段</p>
                                        </div>
                                    )}
                                    
                                    {/* 添加优先时间段表单 */}
                                    <div className="bg-base-200/30 p-4 rounded-lg">
                                        <h3 className="font-medium mb-3">添加优先时间段</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text">星期几</span>
                                                </label>
                                                <select
                                                    name="newTimeSlot.day_of_week"
                                                    className="select select-bordered w-full"
                                                    value={newTimeSlot.day_of_week}
                                                    onChange={handleInputChange}
                                                >
                                                    <option value={1}>周一</option>
                                                    <option value={2}>周二</option>
                                                    <option value={3}>周三</option>
                                                    <option value={4}>周四</option>
                                                    <option value={5}>周五</option>
                                                    <option value={6}>周六</option>
                                                    <option value={7}>周日</option>
                                                </select>
                                            </div>
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text">开始节次</span>
                                                </label>
                                                <select
                                                    name="newTimeSlot.period_start"
                                                    className="select select-bordered w-full"
                                                    value={newTimeSlot.period_start}
                                                    onChange={handleInputChange}
                                                >
                                                    {Array.from({length: 12}, (_, i) => i + 1).map(num => (
                                                        <option key={num} value={num}>第{num}节</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text">结束节次</span>
                                                </label>
                                                <select
                                                    name="newTimeSlot.period_end"
                                                    className="select select-bordered w-full"
                                                    value={newTimeSlot.period_end}
                                                    onChange={handleInputChange}
                                                >
                                                    {Array.from({length: 12}, (_, i) => i + 1).map(num => (
                                                        <option key={num} value={num} disabled={num < newTimeSlot.period_start}>第{num}节</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text">优先级 (1-10)</span>
                                                </label>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="range"
                                                        min={1}
                                                        max={10}
                                                        name="newTimeSlot.priority_level"
                                                        className="range range-success range-sm"
                                                        value={newTimeSlot.priority_level}
                                                        onChange={handleInputChange}
                                                    />
                                                    <span className="text-base font-medium">{newTimeSlot.priority_level}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-3 text-right">
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-success"
                                                onClick={handleAddTimeSlot}
                                            >
                                                <Plus />
                                                添加时间段
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Panel>
                            
                            {/* 课程类型优先级面板 */}
                            <Panel 
                                header={
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg font-medium">课程类型优先级</span>
                                        <Badge 
                                            count={formData.priority_settings.course_types?.length || 0} 
                                            className="ml-2"
                                            color="purple"
                                        />
                                    </div>
                                } 
                                key="course_type_priority"
                            >
                                <div className="p-4">
                                    {/* 已添加的课程类型优先级列表 */}
                                    {formData.priority_settings.course_types && formData.priority_settings.course_types.length > 0 ? (
                                        <div className="mb-4">
                                            <h3 className="font-medium mb-2">已添加的课程类型优先级</h3>
                                            <div className="grid grid-cols-1 gap-2">
                                                {formData.priority_settings.course_types.map((item, index) => (
                                                    <div key={index} className="flex justify-between items-center p-2 bg-base-200 rounded-md">
                                                        <span>
                                                            {getCourseTypeName(item.course_type_uuid)}
                                                            <Tag color="purple" className="ml-2">优先级: {item.priority_level}</Tag>
                                                        </span>
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-ghost btn-circle"
                                                            onClick={() => handleRemoveCourseTypePriority(index)}
                                                        >
                                                            <Delete theme="outline" size="16" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mb-4 p-4 text-center bg-base-200/50 rounded-md">
                                            <p className="text-base-content/70">暂无课程类型优先级设置</p>
                                        </div>
                                    )}
                                    
                                    {/* 添加课程类型优先级表单 */}
                                    <div className="bg-base-200/30 p-4 rounded-lg">
                                        <h3 className="font-medium mb-3">添加课程类型优先级</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text">课程类型</span>
                                                </label>
                                                <select
                                                    name="newCourseTypePriority.course_type_uuid"
                                                    className="select select-bordered w-full"
                                                    value={newCourseTypePriority.course_type_uuid}
                                                    onChange={handleInputChange}
                                                    disabled={loadingCourseTypes}
                                                >
                                                    <option value="">选择课程类型</option>
                                                    {courseTypes.map(type => (
                                                        <option 
                                                            key={type.course_type_uuid} 
                                                            value={type.course_type_uuid}
                                                            disabled={formData.priority_settings.course_types?.some(
                                                                ct => ct.course_type_uuid === type.course_type_uuid
                                                            )}
                                                        >
                                                            {type.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {loadingCourseTypes && <span className="text-xs text-base-content/70">加载中...</span>}
                                            </div>
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text">优先级 (1-10)</span>
                                                </label>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="range"
                                                        min={1}
                                                        max={10}
                                                        name="newCourseTypePriority.priority_level"
                                                        className="range range-sm range-secondary"
                                                        value={newCourseTypePriority.priority_level}
                                                        onChange={handleInputChange}
                                                    />
                                                    <span className="text-base font-medium">{newCourseTypePriority.priority_level}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-3 text-right">
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-secondary"
                                                onClick={handleAddCourseTypePriority}
                                                disabled={!newCourseTypePriority.course_type_uuid}
                                            >
                                                <Plus />
                                                添加优先级
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Panel>
                            
                            {/* 排课范围设置 */}
                            <Panel 
                                header={
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg font-medium">排课范围设置</span>
                                        <Badge 
                                            count={(formData.scope_settings.allowed_building_ids?.length || 0) + 
                                                  (formData.scope_settings.specific_course_ids?.length || 0)} 
                                            className="ml-2"
                                            color="orange"
                                        />
                                    </div>
                                } 
                                key="scope_settings"
                            >
                                <div className="p-4 space-y-6">
                                    {/* 特定课程选择 */}
                                    <div>
                                        <h3 className="font-medium mb-3">特定课程选择</h3>
                                        <p className="text-sm text-base-content/70 mb-3">
                                            指定需要排课的课程。如果不指定，系统将为选择的院系和学期下的所有课程进行排课。
                                        </p>
                                        
                                        {/* 已添加的课程列表 */}
                                        {formData.scope_settings.specific_course_ids && formData.scope_settings.specific_course_ids.length > 0 ? (
                                            <div className="selected-courses-list mt-4">
                                                <h4 className="font-medium mb-2">已添加课程</h4>
                                                <Table
                                                    dataSource={formData.scope_settings.specific_course_ids.map((course, index) => ({
                                                        ...course,
                                                        key: index,
                                                        courseType: course.class_id && course.class_id[0] ? '必修课' : '选修课'
                                                    }))}
                                                    columns={[
                                                        {
                                                            title: '课程ID',
                                                            dataIndex: 'course_id',
                                                            key: 'course_id',
                                                            render: (id: string) => {
                                                                const course = courseList.find(c => c.course_library_uuid === id);
                                                                return course ? `${course.name} (${id.substring(0, 8)}...)` : id.substring(0, 8) + '...';
                                                            }
                                                        },
                                                        {
                                                            title: '课程类型',
                                                            dataIndex: 'courseType',
                                                            key: 'courseType',
                                                        },
                                                        {
                                                            title: '班级/人数',
                                                            key: 'class_or_number',
                                                            render: (_, record: SpecificCourse) => {
                                                                if (record.class_id && record.class_id[0]) {
                                                                    return `${record.class_id.length}个班级`;
                                                                } else {
                                                                    return `${record.number}人`;
                                                                }
                                                            }
                                                        },
                                                        {
                                                            title: '周学时',
                                                            dataIndex: 'weekly_hours',
                                                            key: 'weekly_hours',
                                                        },
                                                        {
                                                            title: '课程属性',
                                                            dataIndex: 'course_enu_type',
                                                            key: 'course_enu_type',
                                                            render: (type: string) => {
                                                                const typeMap: Record<string, string> = {
                                                                    'THEORY': '理论课',
                                                                    'PRACTICE': '实践课',
                                                                    'EXPERIMENT': '实验课'
                                                                };
                                                                return typeMap[type] || type;
                                                            }
                                                        },
                                                        {
                                                            title: '起止周',
                                                            key: 'weeks',
                                                            render: (_, record: SpecificCourse) => `${record.start_week}-${record.end_week}周 ${record.is_odd_week ? '(单周)' : ''}`
                                                        },
                                                        {
                                                            title: '操作',
                                                            key: 'action',
                                                            render: (_: unknown, __: SpecificCourse, index: number) => (
                                                                <Button 
                                                                    type="link" 
                                                                    danger
                                                                    onClick={() => handleRemoveSpecificCourse(index)}
                                                                >
                                                                    删除
                                                                </Button>
                                                            )
                                                        }
                                                    ]}
                                                    size="small"
                                                    pagination={false}
                                                />
                                            </div>
                                        ) : (
                                            <div className="mb-4 p-4 text-center bg-base-200/50 rounded-md">
                                                <p className="text-base-content/70 text-sm">请添加至少一门需要排课的课程</p>
                                                <p className="text-error text-sm mt-1">系统必须指定课程才能进行排课</p>
                                            </div>
                                        )}
                                        
                                        {/* 添加课程表单 */}
                                        <div className="bg-base-200/30 p-4 rounded-lg">
                                            <h3 className="font-medium mb-3">添加课程</h3>
                                            <div className="grid grid-cols-1 gap-4">
                                                {/* 选修/必修切换 */}
                                                <div className="form-control">
                                                    <label className="label justify-start gap-2">
                                                        <span className="label-text font-medium">课程类型:</span>
                                                        <div className="flex items-center space-x-2">
                                                            <label className="cursor-pointer label gap-1">
                                                                <input 
                                                                    type="radio" 
                                                                    className="radio radio-sm radio-primary" 
                                                                    checked={!isElectiveCourse}
                                                                    onChange={() => setIsElectiveCourse(false)}
                                                                />
                                                                <span>必修课（指定班级）</span>
                                                            </label>
                                                            <label className="cursor-pointer label gap-1">
                                                                <input 
                                                                    type="radio" 
                                                                    className="radio radio-sm radio-primary" 
                                                                    checked={isElectiveCourse}
                                                                    onChange={() => setIsElectiveCourse(true)}
                                                                />
                                                                <span>选修课（指定人数）</span>
                                                            </label>
                                                        </div>
                                                    </label>
                                                </div>

                                                {/* 课程选择 */}
                                                <div className="form-control">
                                                    <label className="label">
                                                        <span className="label-text font-medium">选择课程<span className="text-error ml-1">*</span></span>
                                                    </label>
                                                    <select
                                                        className="select select-bordered w-full"
                                                        value={selectedCourse.uuid}
                                                        onChange={(e) => handleCourseSelect(e.target.value)}
                                                        disabled={loadingCourses}
                                                    >
                                                        <option value="">请选择课程</option>
                                                        {courseList
                                                            .filter(course => isElectiveCourse ? course.property !== "必修" : course.property === "必修")
                                                            .map(course => (
                                                                <option key={course.course_library_uuid} value={course.course_library_uuid}>
                                                                    【{course.property}】{course.name} - {course.id} | {course.type}
                                                                </option>
                                                            ))}
                                                    </select>
                                                    {loadingCourses && <span className="text-xs text-base-content/70">加载中...</span>}
                                                </div>

                                                {/* 班级选择（必修课）或人数设置（选修课） */}
                                                {!isElectiveCourse ? (
                                                    <div className="form-control">
                                                        <label className="label">
                                                            <span className="label-text font-medium">选择班级<span className="text-error ml-1">*</span></span>
                                                        </label>
                                                        <div className="p-3 border rounded-md bg-base-100 max-h-[150px] overflow-y-auto">
                                                            {loadingTeachingClasses ? (
                                                                <div className="text-center">
                                                                    <span className="loading loading-spinner text-primary"></span>
                                                                    <p className="mt-2 text-sm">加载班级数据...</p>
                                                                </div>
                                                            ) : teachingClasses.length === 0 ? (
                                                                <p className="text-center text-sm text-base-content/70">暂无可选班级</p>
                                                            ) : (
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-0.5">
                                                                    {teachingClasses.map(tc => (
                                                                        <div 
                                                                            key={tc.administrative_class_uuid} 
                                                                            className="cursor-pointer flex items-center gap-2 hover:bg-base-200 p-1 rounded"
                                                                            onClick={() => handleClassSelect(tc.administrative_class_uuid)}
                                                                        >
                                                                            <input 
                                                                                type="checkbox" 
                                                                                className="checkbox checkbox-sm checkbox-primary" 
                                                                                checked={selectedClasses.some(c => c.uuid === tc.administrative_class_uuid)}
                                                                                readOnly
                                                                            />
                                                                            <span>{tc.class_name}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                        {selectedClasses.length > 0 && (
                                                            <div className="mt-2">
                                                                <span className="text-sm text-base-content/70">已选择 {selectedClasses.length} 个班级</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="form-control">
                                                        <label className="label">
                                                            <span className="label-text font-medium">人数<span className="text-error ml-1">*</span></span>
                                                        </label>
                                                        <input
                                                            type="number"
                                                            className="input input-bordered w-full"
                                                            value={newSpecificCourse.number || ""}
                                                            onChange={(e) => setNewSpecificCourse({
                                                                ...newSpecificCourse,
                                                                number: e.target.value ? parseInt(e.target.value) : undefined
                                                            })}
                                                            placeholder="课程人数"
                                                        />
                                                    </div>
                                                )}

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {/* 周学时 */}
                                                    <div className="form-control">
                                                        <label className="label">
                                                            <span className="label-text font-medium">周学时<span className="text-error ml-1">*</span></span>
                                                        </label>
                                                        <input
                                                            type="number"
                                                            className="input input-bordered w-full"
                                                            value={newSpecificCourse.weekly_hours || ""}
                                                            onChange={(e) => setNewSpecificCourse({
                                                                ...newSpecificCourse,
                                                                weekly_hours: e.target.value ? parseInt(e.target.value) : undefined
                                                            })}
                                                            placeholder="每周课时数"
                                                        />
                                                    </div>

                                                    {/* 课程类型 */}
                                                    <div className="form-control">
                                                        <label className="label">
                                                            <span className="label-text font-medium">教学类型<span className="text-error ml-1">*</span></span>
                                                        </label>
                                                        <select
                                                            className="select select-bordered w-full"
                                                            value={newSpecificCourse.course_enu_type || "THEORY"}
                                                            onChange={(e) => setNewSpecificCourse({
                                                                ...newSpecificCourse,
                                                                course_enu_type: e.target.value as "THEORY" | "PRACTICE" | "MIXED" | "EXPERIMENT" | "COMPUTER" | "OTHER"
                                                            })}
                                                        >
                                                            <option value="MIXED">混合（理论+实践+实验+上机）</option>
                                                            <option value="THEORY">理论课</option>
                                                            <option value="EXPERIMENT">实验课</option>
                                                            <option value="PRACTICE">实践课</option>
                                                            <option value="COMPUTER">上机课</option>
                                                            <option value="OTHER">其他</option>
                                                        </select>
                                                    </div>

                                                    {/* 上课周次 */}
                                                    <div className="form-control">
                                                        <label className="label">
                                                            <span className="label-text font-medium">上课周次<span className="text-error ml-1">*</span></span>
                                                        </label>
                                                        <div className="flex items-center space-x-2">
                                                            <input
                                                                type="number"
                                                                className="input input-bordered w-full"
                                                                value={newSpecificCourse.start_week || ""}
                                                                onChange={(e) => setNewSpecificCourse({
                                                                    ...newSpecificCourse,
                                                                    start_week: e.target.value ? parseInt(e.target.value) : undefined
                                                                })}
                                                                placeholder="开始周"
                                                                min="1"
                                                            />
                                                            <span>至</span>
                                                            <input
                                                                type="number"
                                                                className="input input-bordered w-full"
                                                                value={newSpecificCourse.end_week || ""}
                                                                onChange={(e) => setNewSpecificCourse({
                                                                    ...newSpecificCourse,
                                                                    end_week: e.target.value ? parseInt(e.target.value) : undefined
                                                                })}
                                                                placeholder="结束周"
                                                                min="1"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* 单双周 */}
                                                    <div className="form-control">
                                                        <label className="label">
                                                            <span className="label-text font-medium">单双周</span>
                                                        </label>
                                                        <div className="flex items-center h-12">
                                                            <label className="cursor-pointer label gap-2">
                                                                <input 
                                                                    type="checkbox" 
                                                                    className="checkbox checkbox-warning" 
                                                                    checked={newSpecificCourse.is_odd_week || false}
                                                                    onChange={(e) => setNewSpecificCourse({
                                                                        ...newSpecificCourse,
                                                                        is_odd_week: e.target.checked
                                                                    })}
                                                                />
                                                                <span>单周排课（不勾选则为双周）</span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-4 flex justify-end">
                                                    <button
                                                        type="button"
                                                        className="btn btn-warning"
                                                        onClick={handleAddSpecificCourse}
                                                        disabled={
                                                            !selectedCourse.uuid || 
                                                            !newSpecificCourse.weekly_hours || 
                                                            !newSpecificCourse.start_week || 
                                                            !newSpecificCourse.end_week ||
                                                            (!isElectiveCourse && selectedClasses.length === 0) ||
                                                            (isElectiveCourse && (!newSpecificCourse.number || newSpecificCourse.number <= 0))
                                                        }
                                                    >
                                                        <Plus />
                                                        添加课程
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 可用教学楼 */}
                                    <div>
                                        <h3 className="font-medium mb-3">可用教学楼</h3>
                                        <p className="text-sm text-base-content/70 mb-3">
                                            指定排课时可以使用的教学楼，未选择则表示所有教学楼均可使用
                                        </p>
                                        
                                        {loadingBuildings ? (
                                            <div className="p-4 text-center">
                                                <span className="loading loading-spinner text-primary"></span>
                                                <p className="mt-2 text-sm">加载教学楼数据...</p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-wrap gap-2">
                                                {buildings.map(building => {
                                                    const isSelected = formData.scope_settings.allowed_building_ids?.includes(building.building_uuid) || false;
                                                    return (
                                                        <button
                                                            key={building.building_uuid}
                                                            type="button"
                                                            className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-outline'}`}
                                                            onClick={() => handleToggleBuilding(building.building_uuid)}
                                                        >
                                                            {building.building_name}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Panel>
                        </Collapse>
                    </div>
                    
                    {/* 右侧基本信息和按钮区域 - 占3份 */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* 基础设置卡片 */}
                        <div className="card bg-base-100 shadow-sm border border-base-200 overflow-hidden">
                            <div className="bg-primary/10 p-4 flex items-center space-x-2 rounded-t-box">
                                <h2 className="card-title text-lg m-0">基础设置</h2>
                            </div>
                            <div className="p-6">
                                <div className="space-y-6">
                                    {/* 学期选择 */}
                                    <div className="form-control w-full">
                                        <label className="label">
                                            <span className="label-text font-medium">学期<span className="text-error ml-1">*</span></span>
                                        </label>
                                        <select 
                                            name="semester_uuid"
                                            className="select select-bordered w-full focus:select-primary" 
                                            required
                                            value={formData.semester_uuid}
                                            onChange={handleInputChange}
                                            disabled={loadingSemesters}
                                        >
                                            <option value="" disabled>选择学期</option>
                                            {semesters.map(sem => (
                                                <option key={sem.semester_uuid} value={sem.semester_uuid}>
                                                    {sem.name}
                                                </option>
                                            ))}
                                        </select>
                                        {loadingSemesters && <span className="mt-2 text-sm text-base-content/70">加载中...</span>}
                                    </div>

                                    {/* 排课策略 */}
                                    <div className="form-control w-full">
                                        <label className="label">
                                            <span className="label-text font-medium">排课策略</span>
                                        </label>
                                        <select 
                                            name="strategy"
                                            className="select select-bordered w-full focus:select-primary" 
                                            value={formData.strategy}
                                            onChange={handleInputChange}
                                        >
                                            <option value="OPTIMAL">最优（优先保证质量，耗时长）</option>
                                            <option value="BALANCED">平衡（质量和速度平衡）</option>
                                            <option value="QUICK">快速（优先保证速度）</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 节假日警告组件 */}
                        {showHolidayWarning && (
                            <HolidayWarningComponent dates={holidayConflictDates} />
                        )}

                        {/* 提交按钮 */}
                        <div className="card bg-base-100 shadow-sm border border-base-200 overflow-hidden">
                            <div className="bg-warning/10 p-4 rounded-t-box">
                                <h2 className="card-title text-lg m-0 text-warning">注意事项</h2>
                            </div>
                            <div className="p-6">
                                <div className="alert alert-warning mb-4">
                                    <p className="text-sm">排课任务一旦开始将无法取消，请确认信息后再提交！</p>
                                </div>
                                <button 
                                    type="submit" 
                                    className="btn btn-primary w-full"
                                    disabled={
                                        submitting || 
                                        !formData.semester_uuid || 
                                        !formData.department_uuid || 
                                        !(formData.scope_settings.specific_course_ids && formData.scope_settings.specific_course_ids.length > 0)
                                    }
                                >
                                    {submitting ? <span className="loading loading-spinner"></span> : null}
                                    开始自动排课
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
} 