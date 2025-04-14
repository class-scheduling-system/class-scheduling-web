import React, {
  useState,
  useEffect,
  useMemo
} from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  Calendar,
  CloseOne,
  Delete,
  Plus,
  Save,
  Schedule,
  Attention,
  Filter
} from "@icon-park/react";
import { message } from "antd";
import { SiteInfoEntity } from "../../../models/entity/site_info_entity";
import { GetSemesterListAPI } from "../../../apis/semester_api";
import { SemesterEntity } from "../../../models/entity/semester_entity";
import { GetTeacherListAPI } from "../../../apis/teacher_api";
import { TeacherLiteEntity } from "../../../models/entity/teacher_lite_entity";
import { GetCourseListAPI } from "../../../apis/course_api";
import { CourseLibraryEntity } from "../../../models/entity/course_library_entity";
import { GetClassroomListAPI } from "../../../apis/classroom_api";
import { ClassroomLiteEntity } from "../../../models/entity/classroom_lite_entity";
import { GetTeachingClassListAPI } from "../../../apis/teaching_class_api";
import { TeachingClassLiteEntity } from "../../../models/entity/teaching_class_entity";
import {
  AddClassAssignmentAPI,
  GetClassAssignmentDetailAPI,
  UpdateClassAssignmentAPI
} from "../../../apis/class_assignment_api";
import { ClassAssignmentEntity } from "../../../models/entity/class_assignment_entity";
import { useSelector } from "react-redux";
import { AcademicAffairsStore } from "../../../models/store/academic_affairs_store";
import { AdjustmentDTO, ClassAssignmentDTO } from "../../../models/dto/class_assignment_dto";
import { GetCreditHourTypeListAPI } from "../../../apis/credit_hour_type_api";
import { CreditHourTypeEntity } from "../../../models/entity/credit_hour_type_entity";
import { AiDialogComponent } from "../../../components/academic/schedule/edit/ai_dialog_component";
import { GetSimpleConflictListAPI } from "../../../apis/conflict_api";
import { SchedulingConflictDTO } from "../../../models/dto/scheduling_conflict_dto";
import { HolidayWarningComponent } from "../../../components/academic/schedule/holiday_warning_component";
import { getDateByWeekAndDay, isHoliday } from "../../../services/holiday_service";

interface ScheduleTimeSlot {
  day_of_week: number;
  period_start: number;
  period_end: number;
  week_numbers: number[];
}

interface ScheduleFormData {
  semester_uuid: string;
  teaching_class_uuid: string | undefined;
  classroom_uuid: string;
  teacher_uuid: string;
  course_uuid: string;
  course_ownership: string;
  credit_hour_type: string;
  teaching_hours: number;
  scheduled_hours: number;
  total_hours: number;
  scheduling_priority: number;
  teaching_campus: string;
  consecutive_sessions: number;
  specified_time?: string;
  remarks?: string;
  administrative_class_uuids?: string[];
  student_count?: number;
  is_elective?: boolean;
}

// AI响应数据类型
interface AIResponse {
  semester_uuid?: string;
  course_uuid?: string;
  teacher_uuid?: string;
  classroom_uuid?: string;
  course_ownership?: string;
  teaching_class_name?: string;
  administrative_class_uuids?: string[];
  student_count?: number;
  credit_hour_type?: string;
  teaching_hours?: number;
  scheduled_hours?: number;
  total_hours?: number;
  scheduling_priority?: number;
  teaching_campus?: string;
  class_time?: Array<{
    day_of_week: number;
    period_start: number;
    period_end: number;
    week_numbers: number[];
  }>;
  consecutive_sessions?: number;
}

export function ScheduleEdit({ site }: Readonly<{ site: SiteInfoEntity }>) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const academicAffairs = useSelector((state: { academicAffairs: AcademicAffairsStore }) => state.academicAffairs);

  // 表单数据
  const [formData, setFormData] = useState<ScheduleFormData>({
    semester_uuid: "",
    teaching_class_uuid: undefined,
    classroom_uuid: "",
    teacher_uuid: "",
    course_uuid: "",
    course_ownership: "学校",
    credit_hour_type: "",
    teaching_hours: 32,
    scheduled_hours: 32,
    total_hours: 32,
    scheduling_priority: 50,
    teaching_campus: "主校区",
    consecutive_sessions: 2,
    specified_time: "",
    remarks: "",
    administrative_class_uuids: [],
    student_count: 0,
    is_elective: false
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [timeSlots, setTimeSlots] = useState<ScheduleTimeSlot[]>([]);
  
  // 用于触发表单重新渲染
  const [formRefreshKey, setFormRefreshKey] = useState(0);

  // 加载状态
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // 冲突相关状态
  const [conflicts, setConflicts] = useState<SchedulingConflictDTO[]>([]);
  const [loadingConflicts, setLoadingConflicts] = useState(false);
  
  // 节假日检查状态
  const [holidayConflictDates, setHolidayConflictDates] = useState<string[]>([]);
  const [showHolidayWarning, setShowHolidayWarning] = useState(false);
  
  // 周次过滤器
  const [weekFilter, setWeekFilter] = useState<number[]>([]);
  const [filterActive, setFilterActive] = useState(false);

  // 下拉选项数据
  const [semesters, setSemesters] = useState<SemesterEntity[]>([]);
  const [teachers, setTeachers] = useState<TeacherLiteEntity[]>([]);
  const [courses, setCourses] = useState<CourseLibraryEntity[]>([]);
  const [classrooms, setClassrooms] = useState<ClassroomLiteEntity[]>([]);
  const [teachingClasses, setTeachingClasses] = useState<TeachingClassLiteEntity[]>([]);
  const [creditHourTypes, setCreditHourTypes] = useState<CreditHourTypeEntity[]>([]);

  // 页面加载
  useEffect(() => {
    document.title = `${isEditMode ? '编辑' : '添加'}排课 | ${site.name ?? "Frontleaves Technology"}`;

    if (isEditMode) {
      loadScheduleData();
    }

    loadSemesters();
    loadTeachers();
    loadCourses();
    loadClassrooms();
    loadCreditHourTypes();
  }, [isEditMode, site.name]);

  // 监听学期变化，加载教学班
  useEffect(() => {
    const semesterUuid = formData.semester_uuid;
    if (semesterUuid) {
      loadTeachingClasses(semesterUuid);
    }
  }, [formData.semester_uuid]);
  
  // 监听数据加载，获取冲突列表
  useEffect(() => {
    if (isEditMode && id && formData.semester_uuid) {
      loadConflicts();
    }
  }, [isEditMode, id, formData.semester_uuid]);
  
  // 加载冲突数据
  const loadConflicts = async () => {
    if (!id || !formData.semester_uuid) return;
    
    setLoadingConflicts(true);
    try {
      const response = await GetSimpleConflictListAPI(formData.semester_uuid);
      if (response && response.output === "Success" && response.data) {
        // 过滤出与当前排课相关的冲突（第一排课或第二排课中包含当前排课ID）
        const relatedConflicts = response.data.filter(
          conflict => conflict.first_assignment_uuid === id || conflict.second_assignment_uuid === id
        ).filter(conflict => conflict.resolution_status === 0);
        setConflicts(relatedConflicts);
      }
    } catch (error) {
      console.error("获取冲突数据失败:", error);
    } finally {
      setLoadingConflicts(false);
    }
  };
  
  // 处理从AI组件接收到的数据
  const handleAiDataReceived = (aiData: AIResponse): void => {
    console.log('编辑页面：从AI接收到数据，准备更新表单:', aiData);
    
    // 记录数据字段和时间段
    const dataKeys = Object.keys(aiData);
    console.log(`收到数据包含 ${dataKeys.length} 个字段:`, dataKeys);
    if (aiData.class_time) {
      console.log(`包含 ${aiData.class_time.length} 个时间段`);
    }
    
    // 创建表单更新对象
    const updatedFormData = { ...formData };
    
    // 更新表单字段 - 只更新AI调整建议中的字段
    // 对于关键标识字段（如semester_uuid）不进行覆盖，避免修改已有数据的关键信息
    if (aiData.teacher_uuid) updatedFormData.teacher_uuid = aiData.teacher_uuid;
    if (aiData.classroom_uuid) updatedFormData.classroom_uuid = aiData.classroom_uuid;
    
    // 可以更新的非关键字段
    if (aiData.scheduling_priority !== undefined) updatedFormData.scheduling_priority = aiData.scheduling_priority;
    if (aiData.consecutive_sessions !== undefined) updatedFormData.consecutive_sessions = aiData.consecutive_sessions;
    
    // 更新选课信息，如果AI提供了这些信息
    if (aiData.administrative_class_uuids) updatedFormData.administrative_class_uuids = aiData.administrative_class_uuids;
    if (aiData.student_count !== undefined) updatedFormData.student_count = aiData.student_count;
    
    // 更新表单数据
    setFormData(updatedFormData);
    
    // 如果有时间段数据，更新时间段
    if (aiData.class_time && aiData.class_time.length > 0) {
      console.log('更新时间段数据:', aiData.class_time);
      setTimeSlots(aiData.class_time);
    }
    
    // 增加表单刷新键，触发重新渲染
    setFormRefreshKey(prev => prev + 1);
    console.log(`表单刷新键已更新: ${formRefreshKey} -> ${formRefreshKey + 1}`);
    
    // 显示提示信息
    message.success('已应用AI排课调整建议，请检查并确认');
  };

  // 加载学时类型列表
  const loadCreditHourTypes = async () => {
    try {
      const response = await GetCreditHourTypeListAPI();

      if (response && response.code === 200 && response.data) {
        const data = response.data || [];
        setCreditHourTypes(data);

        // 如果有数据且不是编辑模式，设置第一个为默认值
        if (data.length > 0 && !isEditMode) {
          setFormData(prev => ({
            ...prev,
            credit_hour_type: data[0].credit_hour_type_uuid
          }));
        }
      } else {
        message.error(`获取学时类型列表失败: ${response?.message || '未知错误'}`);
      }
    } catch (error: Error | unknown) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      message.error(`获取学时类型列表失败: ${errorMessage}`);
    }
  };

  // 加载排课数据（编辑模式）
  const loadScheduleData = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const response = await GetClassAssignmentDetailAPI(id);

      if (response?.output === "Success" && response.data) {
        const scheduleData: ClassAssignmentEntity = response.data;

        // 加载对应学期的教学班
        if (scheduleData.semester_uuid) {
          await loadTeachingClasses(scheduleData.semester_uuid);
        }
        
        // 判断是否为选修课（根据班级人数判断）
        const isElective = scheduleData.class_size > 0;

        // 设置表单数据
        setFormData({
          semester_uuid: scheduleData.semester_uuid,
          teaching_class_uuid: scheduleData.teaching_class_uuid,
          classroom_uuid: scheduleData.classroom_uuid,
          teacher_uuid: scheduleData.teacher_uuid,
          course_uuid: scheduleData.course_uuid,
          credit_hour_type: scheduleData.credit_hour_type,
          teaching_hours: scheduleData.teaching_hours,
          scheduled_hours: scheduleData.scheduled_hours,
          total_hours: scheduleData.total_hours,
          scheduling_priority: scheduleData.scheduling_priority,
          teaching_campus: scheduleData.teaching_campus,
          consecutive_sessions: scheduleData.consecutive_sessions,
          course_ownership: scheduleData.course_ownership,
          specified_time: scheduleData.specified_time,
          remarks: "",
          administrative_class_uuids: [],
          student_count: scheduleData.class_size || 0,
          is_elective: isElective
        });

        // 设置时间段
        if (scheduleData.class_time_dto && Array.isArray(scheduleData.class_time_dto)) {
          // 确保时间段数据格式正确
          const formattedTimeSlots = scheduleData.class_time_dto.map(slot => ({
            day_of_week: slot.day_of_week,
            period_start: slot.period_start,
            period_end: slot.period_end,
            week_numbers: Array.isArray(slot.week_numbers) ? slot.week_numbers : []
          }));
          setTimeSlots(formattedTimeSlots);
        }

        // 如果是编辑模式，可能需要额外调用 API 获取与此排课关联的行政班级列表
        if (isEditMode && !isElective) {
          // 这里可以添加获取行政班级的逻辑，例如：
          // 从 teaching_class_composition 解析相关数据，或者调用专门的 API
          // 暂时保留为空数组
        }
      } else {
        message.error(response?.error_message ?? "获取排课数据失败");
        navigate("/academic/schedule");
      }
    } catch (error) {
      console.error("加载排课数据出错", error);
      message.error("加载排课数据出错");
      navigate("/academic/schedule");
    } finally {
      setLoading(false);
    }
  };

  // 加载学期列表
  const loadSemesters = async () => {
    try {
      const response = await GetSemesterListAPI();

      if (response?.output === "Success" && response.data) {
        setSemesters(response.data);

        // 如果不是编辑模式，默认选择当前启用的学期
        if (!isEditMode) {
          const enabledSemesters = response.data.filter(sem => sem.is_enabled);
          if (enabledSemesters.length > 0) {
            setFormData(prev => ({
              ...prev,
              semester_uuid: enabledSemesters[0].semester_uuid
            }));
            loadTeachingClasses(enabledSemesters[0].semester_uuid);
          }
        }
      } else {
        message.error(response?.error_message ?? "获取学期数据失败");
      }
    } catch (error) {
      console.error("加载学期数据出错", error);
      message.error("加载学期数据出错");
    }
  };

  // 加载教师列表
  const loadTeachers = async () => {
    try {
      const response = await GetTeacherListAPI();

      if (response?.output === "Success" && response.data) {
        setTeachers(response.data);
      } else {
        message.error(response?.error_message ?? "获取教师数据失败");
      }
    } catch (error) {
      console.error("加载教师数据出错", error);
      message.error("加载教师数据出错");
    }
  };

  // 加载课程列表
  const loadCourses = async () => {
    try {
      const response = await GetCourseListAPI(
        undefined,
        undefined,
        undefined,
        undefined,
        academicAffairs.currentAcademicAffairs?.department
      );

      if (response?.output === "Success" && response.data) {
        setCourses(response.data);
      } else {
        message.error(response?.error_message ?? "获取课程数据失败");
      }
    } catch (error) {
      console.error("加载课程数据出错", error);
      message.error("加载课程数据出错");
    }
  };

  // 加载教室列表
  const loadClassrooms = async () => {
    try {
      const response = await GetClassroomListAPI();

      if (response?.output === "Success" && response.data) {
        setClassrooms(response.data);
      } else {
        message.error(response?.error_message ?? "获取教室数据失败");
      }
    } catch (error) {
      console.error("加载教室数据出错", error);
      message.error("加载教室数据出错");
    }
  };

  // 加载教学班列表
  const loadTeachingClasses = async (semesterUuid: string) => {
    if (!semesterUuid) return;

    try {
      const response = await GetTeachingClassListAPI({
        semester_uuid: semesterUuid,
        is_enabled: true
      });

      if (response?.output === "Success" && response.data) {
        setTeachingClasses(response.data);
      } else {
        message.error(response?.error_message ?? "获取教学班数据失败");
      }
    } catch (error) {
      console.error("加载教学班数据出错", error);
      message.error("加载教学班数据出错");
    }
  };

  // 学期变更处理
  const handleSemesterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    handleInputChange(e); // 保留输入变更处理
    setFormData(prev => ({
      ...prev,
      teaching_class_uuid: undefined
    }));
    loadTeachingClasses(value);
  };

  // 添加时间段
  const handleAddTimeSlot = () => {
    const newTimeSlots = [
      ...timeSlots,
      { day_of_week: 1, period_start: 1, period_end: 2, week_numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16] }
    ];
    setTimeSlots(newTimeSlots);
    
    // 添加时间段后立即进行节假日检查
    setTimeout(() => {
      checkHolidaysWithTimeSlots(newTimeSlots);
    }, 0);
  };
  
  // 删除时间段
  const handleRemoveTimeSlot = (index: number) => {
    const newTimeSlots = [...timeSlots];
    newTimeSlots.splice(index, 1);
    setTimeSlots(newTimeSlots);
    
    // 删除时间段后立即进行节假日检查
    setTimeout(() => {
      checkHolidaysWithTimeSlots(newTimeSlots);
    }, 0);
  };
  
  // 更新时间段信息
  const handleTimeSlotChange = (index: number, field: keyof ScheduleTimeSlot, value: number | number[]) => {
    const newTimeSlots = [...timeSlots];
    newTimeSlots[index] = { ...newTimeSlots[index], [field]: value };
    setTimeSlots(newTimeSlots);
    
    // 更新时间段后立即进行节假日检查，这个会由useEffect触发
  };
  
  // 设置过滤器
  const applyWeekFilter = (weeks: number[]) => {
    setWeekFilter(weeks);
    setFilterActive(weeks.length > 0);
  };
  
  // 清除过滤器
  const clearFilter = () => {
    setWeekFilter([]);
    setFilterActive(false);
  };
  
  // 专门用于检查特定时间槽的节假日冲突
  const checkHolidaysWithTimeSlots = async (slots: ScheduleTimeSlot[]) => {
    if (!formData.semester_uuid || slots.length === 0) {
      setHolidayConflictDates([]);
      setShowHolidayWarning(false);
      return;
    }
    
    try {
      // 获取当前学期信息
      const semester = semesters.find(sem => sem.semester_uuid === formData.semester_uuid);
      if (!semester) {
        console.warn("未找到当前学期信息，UUID:", formData.semester_uuid);
        setHolidayConflictDates([]);
        setShowHolidayWarning(false);
        return;
      }
      
      // 将学期开始日期从时间戳转换为ISO日期字符串 YYYY-MM-DD
      if (!semester.start_date) {
        console.warn("学期开始日期为空");
        setHolidayConflictDates([]);
        setShowHolidayWarning(false);
        return;
      }
      
      const semesterStartDate = new Date(semester.start_date).toISOString().split('T')[0];
      console.log("学期开始日期:", semesterStartDate, "原始时间戳:", semester.start_date);
      
      // 获取所有排课日期
      const allDates: string[] = [];
      const failedDates: {week: number, day: number, error: string}[] = [];
      
      // 检查每个时间段
      for (const slot of slots) {
        if (!slot.week_numbers || slot.week_numbers.length === 0) {
          console.log("跳过无周次数据的时间段:", slot);
          continue;
        }
        
        // 计算该时间段的每一周对应的具体日期
        for (const week of slot.week_numbers) {
          try {
            console.log(`计算日期: 从${semesterStartDate}开始, 第${week}周星期${slot.day_of_week}`);
            const date = getDateByWeekAndDay(semesterStartDate, week, slot.day_of_week);
            console.log(`计算结果: ${date}`);
            allDates.push(date);
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error(`计算第${week}周星期${slot.day_of_week}的日期时出错:`, errorMessage);
            failedDates.push({week, day: slot.day_of_week, error: errorMessage});
          }
        }
      }
      
      if (failedDates.length > 0) {
        console.warn(`有${failedDates.length}个日期计算失败`, failedDates);
      }
      
      console.log("计算出的所有日期:", allDates.length, allDates);
      
      // 过滤出与节假日冲突的日期
      const conflictDates = allDates.filter(date => {
        const isConflict = isHoliday(date);
        console.log(`检查日期 ${date} 是否为假期: ${isConflict ? '是' : '否'}`);
        return isConflict;
      });
      console.log("冲突日期:", conflictDates.length, conflictDates);
      
      // 设置所有日期供组件显示
      setHolidayConflictDates(allDates);
      // 只有在有冲突时才显示警告
      setShowHolidayWarning(conflictDates.length > 0);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("检查节假日冲突出错:", errorMessage);
    }
  };

  // 表单验证函数
  const validateForm = (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const errors: { [key: string]: string } = {};

      // 验证必填字段
      if (!formData.semester_uuid) {
        errors.semester_uuid = "请选择学期";
      }
      
      // 移除对选修课/必修课相关字段的验证
      // 不再验证行政班级和学生人数
      
      if (!formData.classroom_uuid) {
        errors.classroom_uuid = "请选择教室";
      }
      if (!formData.teacher_uuid) {
        errors.teacher_uuid = "请选择教师";
      }
      if (!formData.course_uuid) {
        errors.course_uuid = "请选择课程";
      }
      if (!formData.credit_hour_type) {
        errors.credit_hour_type = "请选择学时类型";
      }

      setFormErrors(errors);

      if (Object.keys(errors).length > 0) {
        reject(new Error("表单验证失败"));
      } else {
        resolve(true);
      }
    });
  };

  // 表单字段变更处理
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // 清除相应的错误
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // 教室变更处理 - 简化为正常输入处理
  const handleClassroomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleInputChange(e);
    // 移除选修课人数上限的处理逻辑
  };
  
  // 监控时间槽变化，检查节假日冲突
  useEffect(() => {
    checkHolidays();
  }, [timeSlots, formData.semester_uuid]);
  
  // 检查节假日冲突
  const checkHolidays = async () => {
    if (!formData.semester_uuid || timeSlots.length === 0) {
      setHolidayConflictDates([]);
      setShowHolidayWarning(false);
      return;
    }
    
    try {
      // 获取当前学期信息
      const semester = semesters.find(sem => sem.semester_uuid === formData.semester_uuid);
      if (!semester) {
        console.warn("未找到当前学期信息，UUID:", formData.semester_uuid);
        setHolidayConflictDates([]);
        setShowHolidayWarning(false);
        return;
      }
      
      // 将学期开始日期从时间戳转换为ISO日期字符串 YYYY-MM-DD
      if (!semester.start_date) {
        console.warn("学期开始日期为空");
        setHolidayConflictDates([]);
        setShowHolidayWarning(false);
        return;
      }
      
      const semesterStartDate = new Date(semester.start_date).toISOString().split('T')[0];
      console.log("学期开始日期:", semesterStartDate, "原始时间戳:", semester.start_date);
      
      // 获取所有排课日期
      const allDates: string[] = [];
      const failedDates: {week: number, day: number, error: string}[] = [];
      
      // 检查每个时间段
      for (const slot of timeSlots) {
        if (!slot.week_numbers || slot.week_numbers.length === 0) {
          console.log("跳过无周次数据的时间段:", slot);
          continue;
        }
        
        // 计算该时间段的每一周对应的具体日期
        for (const week of slot.week_numbers) {
          try {
            console.log(`计算日期: 从${semesterStartDate}开始, 第${week}周星期${slot.day_of_week}`);
            const date = getDateByWeekAndDay(semesterStartDate, week, slot.day_of_week);
            console.log(`计算结果: ${date}`);
            allDates.push(date);
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error(`计算第${week}周星期${slot.day_of_week}的日期时出错:`, errorMessage);
            failedDates.push({week, day: slot.day_of_week, error: errorMessage});
          }
        }
      }
      
      if (failedDates.length > 0) {
        console.warn(`有${failedDates.length}个日期计算失败`, failedDates);
      }
      
      console.log("计算出的所有日期:", allDates.length, allDates);
      
      // 过滤出与节假日冲突的日期
      const conflictDates = allDates.filter(date => {
        const isConflict = isHoliday(date);
        console.log(`检查日期 ${date} 是否为假期: ${isConflict ? '是' : '否'}`);
        return isConflict;
      });
      console.log("冲突日期:", conflictDates.length, conflictDates);
      
      // 设置所有日期供组件显示
      setHolidayConflictDates(allDates);
      // 只有在有冲突时才显示警告
      setShowHolidayWarning(conflictDates.length > 0);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("检查节假日冲突出错:", errorMessage);
    }
  };

  // 表单提交处理
  const handleSubmit = async () => {
    try {
      await validateForm();
      
      if (timeSlots.length === 0) {
        message.warning("请至少添加一个时间段");
        return;
      }
      
      // 检查节假日冲突并提示确认
      const conflictDates = holidayConflictDates.filter(date => isHoliday(date));
      if (conflictDates.length > 0) {
        if (!window.confirm(`当前排课时间与法定节假日冲突，确定继续提交吗？\n冲突日期: ${conflictDates.join(', ')}`)) {
          return;
        }
      }
      
      setSubmitting(true);
      
      // 获取部门UUID
      const departmentUuid = academicAffairs.currentAcademicAffairs?.department || "";
      
      // 确保时间段格式正确
      const formattedTimeSlots = timeSlots.map(slot => ({
        day_of_week: slot.day_of_week,
        period_start: slot.period_start,
        period_end: slot.period_end,
        week_numbers: Array.isArray(slot.week_numbers) ? slot.week_numbers : []
      }));
      
      // 获取教学班名称
      const teachingClassName = teachingClasses.find(tc => tc.teaching_class_uuid === formData.teaching_class_uuid)?.teaching_class_name || "";
      
      // 构建符合ClassAssignmentDTO的数据
      const submitData: ClassAssignmentDTO = {
        semester_uuid: formData.semester_uuid,
        teaching_class_uuid: formData.teaching_class_uuid || "",
        classroom_uuid: formData.classroom_uuid,
        teacher_uuid: formData.teacher_uuid,
        course_uuid: formData.course_uuid,
        class_time: formattedTimeSlots,
        specified_time: formData.specified_time,
        remarks: formData.remarks,
        teaching_class_name: teachingClassName,
        course_ownership: formData.course_ownership || departmentUuid,
        credit_hour_type: formData.credit_hour_type,
        teaching_hours: formData.teaching_hours,
        scheduled_hours: formData.scheduled_hours,
        total_hours: formData.total_hours,
        scheduling_priority: formData.scheduling_priority,
        teaching_campus: formData.teaching_campus,
        consecutive_sessions: formData.consecutive_sessions
        // 不再添加student_count和administrative_class_uuids字段
      };

      let response;
      if (isEditMode && id) {
        // 构造符合 AdjustmentDTO 的数据
        const adjustmentData: AdjustmentDTO = {
          assignment_id: id,
          adjustments: {
            classroom_id: submitData.classroom_uuid,
            teacher_id: submitData.teacher_uuid,
            class_time: submitData.class_time,
            consecutive_sessions: submitData.consecutive_sessions,
            scheduling_priority: submitData.scheduling_priority
          },
          adjust_teaching_class: {
            teaching_class_uuid: submitData.teaching_class_uuid,
            teaching_class_name: submitData.teaching_class_name
          },
          ignore_conflicts: false,
          reason: submitData.remarks || "排课更新"
        };

        response = await UpdateClassAssignmentAPI(adjustmentData);
      } else {
        response = await AddClassAssignmentAPI(submitData);
      }

      if (response?.output === "Success") {
        message.success(`${isEditMode ? '更新' : '添加'}排课成功！`);
        navigate("/academic/schedule");
      } else {
        message.error(response?.error_message ?? `${isEditMode ? '更新' : '添加'}排课失败`);
      }
    } catch (error) {
      console.error(`${isEditMode ? '更新' : '添加'}排课出错`, error);
      message.error(`${isEditMode ? '更新' : '添加'}排课出错`);
    } finally {
      setSubmitting(false);
    }
  };

  // 渲染周次选择器
  const renderWeekSelector = (index: number, currentWeeks: number[]) => {
    const allWeeks = Array.from({ length: 20 }, (_, i) => i + 1);

    return (
      <div className="space-y-2">
        <div className="flex flex-wrap gap-1.5">
          {allWeeks.map(week => (
            <button
              key={week}
              type="button"
              className={`px-2 py-1 text-xs rounded-md transition-colors ${currentWeeks.includes(week)
                  ? 'bg-primary text-white'
                  : 'bg-base-200 hover:bg-base-300'
                }`}
              onClick={() => {
                const newWeeks = currentWeeks.includes(week)
                  ? currentWeeks.filter(w => w !== week)
                  : [...currentWeeks, week].sort((a, b) => a - b);
                handleTimeSlotChange(index, 'week_numbers', newWeeks);
              }}
            >
              {week}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="text-xs text-primary underline"
            onClick={() => handleTimeSlotChange(index, 'week_numbers', allWeeks)}
          >
            全选
          </button>
          <button
            type="button"
            className="text-xs text-primary underline"
            onClick={() => handleTimeSlotChange(index, 'week_numbers', [])}
          >
            清空
          </button>
          <button
            type="button"
            className="text-xs text-primary underline"
            onClick={() => handleTimeSlotChange(index, 'week_numbers', allWeeks.filter(w => w % 2 === 1))}
          >
            单周
          </button>
          <button
            type="button"
            className="text-xs text-primary underline"
            onClick={() => handleTimeSlotChange(index, 'week_numbers', allWeeks.filter(w => w % 2 === 0))}
          >
            双周
          </button>
        </div>
      </div>
    );
  };
  
  // 过滤后的时间段
  const filteredTimeSlots = useMemo(() => {
    if (!filterActive || weekFilter.length === 0) return timeSlots;
    
    return timeSlots.map(slot => {
      // 过滤周次，只保留在过滤器中的周次
      const filteredWeeks = slot.week_numbers.filter(week => weekFilter.includes(week));
      return { ...slot, week_numbers: filteredWeeks };
    });
  }, [timeSlots, weekFilter, filterActive]);
  
  /**
   * 周次过滤器选择器组件
   */
  const WeekFilterSelector: React.FC<{
    selectedWeeks: number[];
    onChange: (weeks: number[]) => void;
    onClear: () => void;
  }> = ({ selectedWeeks, onChange, onClear }) => {
    const allWeeks = Array.from({ length: 20 }, (_, i) => i + 1);
    
    const handleWeekClick = (week: number) => {
      const newSelection = selectedWeeks.includes(week)
        ? selectedWeeks.filter(w => w !== week)
        : [...selectedWeeks, week].sort((a, b) => a - b);
      
      onChange(newSelection);
    };
    
    return (
      <div className="space-y-2">
        <div className="flex flex-wrap gap-1">
          {allWeeks.map(week => (
            <button
              key={week}
              type="button"
              className={`px-2 py-1 text-xs rounded-md transition-colors ${
                selectedWeeks.includes(week)
                  ? 'bg-secondary text-white'
                  : 'bg-base-200 hover:bg-base-300'
              }`}
              onClick={() => handleWeekClick(week)}
            >
              {week}
            </button>
          ))}
        </div>
        <div className="flex gap-2 justify-between">
          <div className="flex gap-2">
            <button
              type="button"
              className="text-xs text-secondary underline"
              onClick={() => onChange(allWeeks)}
            >
              全选
            </button>
            <button
              type="button"
              className="text-xs text-secondary underline"
              onClick={onClear}
            >
              清空
            </button>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="text-xs text-secondary underline"
              onClick={() => onChange(allWeeks.filter(w => w % 2 === 1))}
            >
              单周
            </button>
            <button
              type="button"
              className="text-xs text-secondary underline"
              onClick={() => onChange(allWeeks.filter(w => w % 2 === 0))}
            >
              双周
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row gap-4">
        {/* 主表单区域 - 占70%宽度 */}
        <div className="w-full md:w-[70%]">
          <div className="card shadow-xl bg-base-100">
            <div className="card-body">
              <div className="flex justify-between items-center mb-6">
                <h2 className="card-title text-2xl flex items-center gap-2">
                  <Schedule theme="outline" size="24" />
                  {isEditMode ? '编辑排课' : '添加排课'}
                </h2>
                <div className="flex items-center gap-2">
                  {isEditMode && id && (
                    <div className="text-xs text-base-content/60 bg-base-200 px-2 py-1 rounded-md">
                      排课ID: {id}
                    </div>
                  )}
                  <button
                    type="button"
                    className="btn btn-sm btn-ghost flex items-center gap-1"
                    onClick={() => navigate("/academic/schedule")}
                  >
                    <ArrowLeft theme="outline" size="18" />
                    返回列表
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                  {/* 相关冲突提示 - 只在有冲突时显示 */}
                  {isEditMode && !loadingConflicts && conflicts.length > 0 && (
                    <div className="card bg-base-100 border border-error mb-6 shadow-sm">
                      <div className="card-body p-4">
                        <h3 className="card-title text-error flex items-center gap-2 text-lg">
                          <Attention theme="filled" size="20" fill="#ff4d4f" />
                          检测到 {conflicts.length} 个排课冲突
                        </h3>
                        
                        <div className="overflow-x-auto mt-2 max-h-64 overflow-y-auto">
                          <table className="table table-zebra w-full table-sm">
                            <thead className="sticky top-0 bg-base-100 z-10">
                              <tr>
                                <th className="bg-base-100">序号</th>
                                <th className="bg-base-100">冲突类型</th>
                                <th className="bg-base-100">冲突时间</th>
                                <th className="bg-base-100">描述</th>
                              </tr>
                            </thead>
                            <tbody>
                              {conflicts.map((conflict, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>
                                    <span className="badge badge-error badge-soft badge-sm text-nowrap">
                                      {conflict.conflict_type === 1 ? "教师冲突" : 
                                       conflict.conflict_type === 2 ? "教室冲突" : 
                                       conflict.conflict_type === 3 ? "学生冲突" : "其他冲突"}
                                    </span>
                                  </td>
                                  <td className="whitespace-nowrap">
                                    第{conflict.conflict_time.week}周
                                    周{['一', '二', '三', '四', '五', '六', '日'][conflict.conflict_time.day - 1]}
                                    第{conflict.conflict_time.period}节
                                  </td>
                                  <td>{conflict.description}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        
                        <div className="text-sm text-error/80 mt-2">
                          请调整时间段或其他参数以解决冲突
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* 显示冲突加载中状态 */}
                  {isEditMode && loadingConflicts && (
                    <div className="flex justify-center items-center py-4 mb-6">
                      <span className="loading loading-spinner loading-sm mr-2"></span>
                      <span className="text-sm text-base-content/70">正在检查排课冲突...</span>
                    </div>
                  )}

                  {/* 学期和教学班信息 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* 学期选择 */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">学期</span>
                        <span className="label-text-alt text-error">*</span>
                      </label>
                      <select
                        className={`select select-bordered w-full ${formErrors.semester_uuid ? 'select-error' : ''}`}
                        name="semester_uuid"
                        value={formData.semester_uuid}
                        onChange={handleSemesterChange}
                        disabled={isEditMode}
                      >
                        <option value="">选择学期</option>
                        {semesters.map(sem => (
                          <option
                            key={sem.semester_uuid}
                            value={sem.semester_uuid}
                            className={sem.is_enabled ? 'font-bold' : ''}
                          >
                            {sem.name} {sem.is_enabled ? '(当前)' : ''}
                          </option>
                        ))}
                      </select>
                      {formErrors.semester_uuid && (
                        <label className="label">
                          <span className="label-text-alt text-error">{formErrors.semester_uuid}</span>
                        </label>
                      )}
                    </div>

                    {/* 教学班选择（仅编辑模式显示） */}
                    {isEditMode && (
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">教学班</span>
                          <span className="label-text-alt text-error">*</span>
                        </label>
                        <select
                          className={`select select-bordered w-full ${formErrors.teaching_class_uuid ? 'select-error' : ''}`}
                          name="teaching_class_uuid"
                          value={formData.teaching_class_uuid}
                          onChange={handleInputChange}
                          disabled={true}
                        >
                          <option value="">选择教学班</option>
                          {teachingClasses.map(tc => (
                            <option key={tc.teaching_class_uuid} value={tc.teaching_class_uuid}>
                              {tc.teaching_class_name}
                            </option>
                          ))}
                        </select>
                        {formErrors.teaching_class_uuid && (
                          <label className="label">
                            <span className="label-text-alt text-error">{formErrors.teaching_class_uuid}</span>
                          </label>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 教师选择 */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">授课教师<span className="text-error">*</span></span>
                    </label>
                    <select
                      name="teacher_uuid"
                      className={`select select-bordered w-full ${formErrors.teacher_uuid ? 'select-error' : ''}`}
                      value={formData.teacher_uuid}
                      onChange={handleInputChange}
                    >
                      <option value="" disabled>请选择授课教师</option>
                      {teachers.map(teacher => (
                        <option key={teacher.teacher_uuid} value={teacher.teacher_uuid}>
                          {teacher.teacher_name}
                        </option>
                      ))}
                    </select>
                    {formErrors.teacher_uuid && (
                      <label className="label">
                        <span className="label-text-alt text-error">{formErrors.teacher_uuid}</span>
                      </label>
                    )}
                  </div>

                  {/* 课程选择 */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">课程<span className="text-error">*</span></span>
                    </label>
                    <select
                      name="course_uuid"
                      className={`select select-bordered w-full ${formErrors.course_uuid ? 'select-error' : ''}`}
                      value={formData.course_uuid}
                      onChange={handleInputChange}
                    >
                      <option value="" disabled>请选择课程</option>
                      {courses.map(course => (
                        <option key={course.course_library_uuid} value={course.course_library_uuid}>
                          {course.name}
                        </option>
                      ))}
                    </select>
                    {formErrors.course_uuid && (
                      <label className="label">
                        <span className="label-text-alt text-error">{formErrors.course_uuid}</span>
                      </label>
                    )}
                  </div>

                  {/* 教室选择 */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">教室<span className="text-error">*</span></span>
                    </label>
                    <select
                      name="classroom_uuid"
                      className={`select select-bordered w-full ${formErrors.classroom_uuid ? 'select-error' : ''}`}
                      value={formData.classroom_uuid}
                      onChange={handleClassroomChange}
                    >
                      <option value="" disabled>请选择教室</option>
                      {classrooms.map(room => (
                        <option key={room.classroom_uuid} value={room.classroom_uuid}>
                          {room.name}
                        </option>
                      ))}
                    </select>
                    {formErrors.classroom_uuid && (
                      <label className="label">
                        <span className="label-text-alt text-error">{formErrors.classroom_uuid}</span>
                      </label>
                    )}
                  </div>

                  {/* 学时类型 */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">学时类型<span className="text-error">*</span></span>
                    </label>
                    <select
                      name="credit_hour_type"
                      className={`select select-bordered w-full ${formErrors.credit_hour_type ? 'select-error' : ''}`}
                      value={formData.credit_hour_type}
                      onChange={handleInputChange}
                    >
                      <option value="">请选择学时类型</option>
                      {creditHourTypes.map(type => (
                        <option key={type.credit_hour_type_uuid} value={type.credit_hour_type_uuid}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                    {formErrors.credit_hour_type && (
                      <label className="label">
                        <span className="label-text-alt text-error">{formErrors.credit_hour_type}</span>
                      </label>
                    )}
                  </div>

                  {/* 必修/选修课显示（不可选） */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">课程类型</span>
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="badge badge-lg font-normal p-3">
                        {formData.is_elective ? "选修课" : "必修课"}
                      </div>
                    </div>
                  </div>

                  {/* 备注 */}
                  <div className="form-control mt-4">
                    <label className="label">
                      <span className="label-text">备注</span>
                    </label>
                    <textarea
                      className="textarea textarea-bordered w-full"
                      placeholder="请输入排课备注信息..."
                      rows={2}
                      name="remarks"
                      value={formData.remarks || ""}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>

                  {/* 时间段配置 */}
                  <div className="border border-base-300 rounded-lg p-4 mt-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium flex items-center gap-2">
                        <Calendar theme="outline" size="20" />
                        排课时间段
                        {/* 添加节假日警告指示器 */}
                        {holidayConflictDates.filter(date => isHoliday(date)).length > 0 && (
                          <span className="badge badge-warning text-xs px-2 font-medium animate-pulse">
                            ⚠️ 包含法定节假日
                          </span>
                        )}
                      </h3>
                      <div className="flex gap-2">
                        <div className="dropdown dropdown-end">
                          <button 
                            type="button" 
                            tabIndex={0} 
                            className={`btn btn-sm ${filterActive ? 'btn-secondary' : 'btn-outline'}`}
                          >
                            <Filter theme="outline" size="16" />
                            周次过滤
                            {filterActive && <span className="badge badge-sm badge-secondary ml-1">{weekFilter.length}</span>}
                          </button>
                          <div tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-60 mt-1">
                            <div className="p-2">
                              <h4 className="font-medium mb-2">选择要显示的周次</h4>
                              <WeekFilterSelector 
                                selectedWeeks={weekFilter} 
                                onChange={applyWeekFilter} 
                                onClear={clearFilter}
                              />
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="btn btn-sm btn-primary"
                          onClick={handleAddTimeSlot}
                        >
                          <Plus theme="outline" size="16" />
                          添加时间段
                        </button>
                      </div>
                    </div>
                    
                    {/* 节假日冲突警告 */}
                    {showHolidayWarning && (
                      <div className="mb-4">
                        <HolidayWarningComponent 
                          dates={holidayConflictDates} 
                          onlyShowIfConflict={true}
                          semesterStartDate={formData.semester_uuid ? 
                            semesters.find(sem => sem.semester_uuid === formData.semester_uuid)?.start_date ?
                            new Date(semesters.find(sem => sem.semester_uuid === formData.semester_uuid)!.start_date).toISOString().split('T')[0] : 
                            undefined : 
                            undefined
                          }
                        />
                      </div>
                    )}

                    {timeSlots.length === 0 ? (
                      <div className="text-center text-base-content/60 py-8">
                        <p>请添加排课时间段</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {(filterActive ? filteredTimeSlots : timeSlots).map((slot, index) => (
                          <div key={index} className="border border-base-200 rounded-lg p-4 bg-base-100/50">
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="font-medium flex items-center gap-2">
                                时间段 #{filterActive ? timeSlots.indexOf(slot) + 1 : index + 1}
                                {filterActive && <span className="badge badge-sm badge-secondary">已过滤</span>}
                              </h4>
                              <button
                                type="button"
                                className="btn btn-sm btn-error"
                                onClick={() => handleRemoveTimeSlot(filterActive ? timeSlots.indexOf(slot) : index)}
                              >
                                <Delete theme="outline" size="16" />
                                删除
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {/* 星期 */}
                              <div className="form-control">
                                <label className="label">
                                  <span className="label-text">星期</span>
                                </label>
                                <select
                                  className="select select-bordered w-full"
                                  value={slot.day_of_week}
                                  onChange={(e) => handleTimeSlotChange(filterActive ? timeSlots.indexOf(slot) : index, 'day_of_week', parseInt(e.target.value))}
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

                              {/* 开始节次 */}
                              <div className="form-control">
                                <label className="label">
                                  <span className="label-text">开始节次</span>
                                </label>
                                <select
                                  className="select select-bordered w-full"
                                  value={slot.period_start}
                                  onChange={(e) => {
                                    const startValue = parseInt(e.target.value);
                                    const actualIndex = filterActive ? timeSlots.indexOf(slot) : index;
                                    handleTimeSlotChange(actualIndex, 'period_start', startValue);
                                    if (startValue > slot.period_end) {
                                      handleTimeSlotChange(actualIndex, 'period_end', startValue);
                                    }
                                  }}
                                >
                                  {Array.from({ length: 12 }, (_, i) => i + 1).map(num => (
                                    <option key={num} value={num}>第{num}节</option>
                                  ))}
                                </select>
                              </div>

                              {/* 结束节次 */}
                              <div className="form-control">
                                <label className="label">
                                  <span className="label-text">结束节次</span>
                                </label>
                                <select
                                  className="select select-bordered w-full"
                                  value={slot.period_end}
                                  onChange={(e) => handleTimeSlotChange(filterActive ? timeSlots.indexOf(slot) : index, 'period_end', parseInt(e.target.value))}
                                >
                                  {Array.from({ length: 12 }, (_, i) => i + 1)
                                    .filter(num => num >= slot.period_start)
                                    .map(num => (
                                      <option key={num} value={num}>第{num}节</option>
                                    ))}
                                </select>
                              </div>
                            </div>

                            {/* 周次选择 */}
                            <div className="mt-4">
                              <label className="label">
                                <span className="label-text">授课周次</span>
                              </label>
                              {renderWeekSelector(filterActive ? timeSlots.indexOf(slot) : index, slot.week_numbers)}
                            </div>
                          </div>
                        ))}
                        
                        {filterActive && filteredTimeSlots.length === 0 && (
                          <div className="text-center text-base-content/60 py-8 border border-dashed border-base-300 rounded-lg">
                            <p>过滤后没有符合条件的时间段</p>
                            <button 
                              onClick={clearFilter} 
                              className="btn btn-xs btn-outline mt-2"
                            >
                              清除过滤器
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 提交按钮 */}
                  <div className="flex justify-end mt-6 space-x-2">
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => navigate("/academic/schedule")}
                    >
                      <CloseOne theme="outline" size="18" />
                      取消
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={submitting}
                    >
                      <Save theme="outline" size="18" />
                      {submitting ? '保存中...' : '保存'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
        
        {/* AI对话组件 - 占30%宽度 */}
        <div className="w-full md:w-[30%]">
          {!loading && (
            <AiDialogComponent 
              formData={formData}
              timeSlots={timeSlots}
              onDataReceived={handleAiDataReceived}
              assignmentUuid={id}
            />
          )}
        </div>
      </div>
    </div>
  );
} 
