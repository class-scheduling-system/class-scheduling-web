import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Calendar,
  CloseOne,
  Delete,
  Plus,
  Save,
  Schedule,
  Attention
} from "@icon-park/react";
import { message, Modal } from "antd";
import { SiteInfoEntity } from "../../../models/entity/site_info_entity";
import { GetSemesterListAPI } from "../../../apis/semester_api";
import { SemesterEntity } from "../../../models/entity/semester_entity";
import { GetTeacherListAPI } from "../../../apis/teacher_api";
import { TeacherLiteEntity } from "../../../models/entity/teacher_lite_entity";
import { GetCourseListAPI } from "../../../apis/course_api";
import { CourseLibraryEntity } from "../../../models/entity/course_library_entity";
import { GetClassroomListAPI, GetClassroomAPI } from "../../../apis/classroom_api";
import { ClassroomLiteEntity } from "../../../models/entity/classroom_lite_entity";
import { AddClassAssignmentAPI } from "../../../apis/class_assignment_api";
import { useSelector } from "react-redux";
import { AcademicAffairsStore } from "../../../models/store/academic_affairs_store";
import { ClassAssignmentDTO } from "../../../models/dto/class_assignment_dto";
import { SchedulingConflictDTO } from "../../../models/dto/scheduling_conflict_dto";
import { GetAllAdministrativeClassListAPI } from "../../../apis/administrative_class_api";
import { GetCreditHourTypeListAPI } from "../../../apis/credit_hour_type_api";
import { CreditHourTypeEntity } from "../../../models/entity/credit_hour_type_entity";

// 时间段类型
interface ScheduleTimeSlot {
  day_of_week: number;
  period_start: number;
  period_end: number;
  week_numbers: number[];
}

// 行政班级类型
interface AdministrativeClassEntity {
  administrative_class_uuid: string;
  class_name: string;
  class_code?: string;
  department_uuid?: string;
  grade?: string;
  major?: string;
  is_enabled?: boolean;
}

// 表单数据类型
interface ScheduleFormData {
  semester_uuid: string;
  teaching_class_name: string;
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
  administrative_class_uuids: string[]; // 行政班级UUID列表
  student_count?: number; // 学生人数

  // 前端使用的字段，不会传给后端
  is_elective: boolean; // 是否为选修课
  course_enu_type: "THEORY" | "PRACTICE" | "MIXED" | "EXPERIMENT" | "COMPUTER" | "OTHER"; // 课程枚举类型
}

/**
 * 添加排课组件
 * 
 * 用于创建新的排课信息
 * 
 * @param site 站点信息
 * @returns 排课添加页面组件
 */
export function ScheduleAdd({ site }: Readonly<{ site: SiteInfoEntity }>) {
  const navigate = useNavigate();
  const academicAffairs = useSelector((state: { academicAffairs: AcademicAffairsStore }) => state.academicAffairs);

  // 表单数据
  const [formData, setFormData] = useState<ScheduleFormData>({
    semester_uuid: "",
    teaching_class_name: "",
    classroom_uuid: "",
    teacher_uuid: "",
    course_uuid: "",
    course_ownership: "学校",
    credit_hour_type: "", // 默认空值，从API获取后设置
    teaching_hours: 32,
    scheduled_hours: 32,
    total_hours: 32,
    scheduling_priority: 50,
    teaching_campus: "主校区",
    consecutive_sessions: 2,
    specified_time: "",
    remarks: "",
    administrative_class_uuids: [],
    student_count: undefined,
    is_elective: false,
    course_enu_type: "THEORY"
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [timeSlots, setTimeSlots] = useState<ScheduleTimeSlot[]>([]);

  // 冲突处理状态
  const [conflicts, setConflicts] = useState<SchedulingConflictDTO[]>([]);
  const [showConflicts, setShowConflicts] = useState(false);

  // 加载状态
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // 下拉选项数据
  const [semesters, setSemesters] = useState<SemesterEntity[]>([]);
  const [teachers, setTeachers] = useState<TeacherLiteEntity[]>([]);
  const [courses, setCourses] = useState<CourseLibraryEntity[]>([]);
  const [classrooms, setClassrooms] = useState<ClassroomLiteEntity[]>([]);

  // 新增 - 行政班级列表
  const [administrativeClasses, setAdministrativeClasses] = useState<AdministrativeClassEntity[]>([]);
  const [creditHourTypes, setCreditHourTypes] = useState<CreditHourTypeEntity[]>([]);

  // 课程类型选项
  const courseTypeOptions = [
    { value: "THEORY", label: "理论课" },
    { value: "PRACTICE", label: "实践课" },
    { value: "MIXED", label: "混合课" },
    { value: "EXPERIMENT", label: "实验课" },
    { value: "COMPUTER", label: "机房课" },
    { value: "OTHER", label: "其他" }
  ];

  // 页面加载
  useEffect(() => {
    document.title = `添加排课 | ${site.name ?? "Frontleaves Technology"}`;
    loadSemesters();
    loadTeachers();
    loadCourses();
    loadClassrooms();
    loadAdministrativeClasses();
    loadCreditHourTypes();
  }, [site.name]);

  // 自动填充学院和校区信息
  useEffect(() => {
    // 从academicAffairs获取当前学院信息 - 直接使用currentAcademicAffairs中的department字段作为UUID
    const departmentUuid = academicAffairs.currentAcademicAffairs?.department || "";

    // 更新表单数据中的学院字段 - 使用UUID而非名称
    setFormData(prev => ({
      ...prev,
      course_ownership: departmentUuid, // 使用部门UUID
    }));
    
    console.log("自动填充部门UUID:", departmentUuid);
  }, [academicAffairs.currentAcademicAffairs]);

  // 加载学期列表
  const loadSemesters = async () => {
    try {
      setLoading(true);
      const response = await GetSemesterListAPI();

      if (response?.output === "Success" && response.data) {
        setSemesters(response.data);

        // 默认选择当前启用的学期
        const enabledSemesters = response.data.filter(sem => sem.is_enabled);
        if (enabledSemesters.length > 0) {
          setFormData(prev => ({
            ...prev,
            semester_uuid: enabledSemesters[0].semester_uuid
          }));
        }
      } else {
        message.error(response?.error_message ?? "获取学期数据失败");
      }
    } catch (error) {
      console.error("加载学期数据出错", error);
      message.error("加载学期数据出错");
    } finally {
      setLoading(false);
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

  // 加载行政班级列表
  const loadAdministrativeClasses = async () => {
    try {
      // 使用学院部门ID来获取对应的行政班级
      const departmentUuid = academicAffairs.currentAcademicAffairs?.department;
      if (!departmentUuid) {
        return;
      }

      const response = await GetAllAdministrativeClassListAPI({
        department_uuid: departmentUuid,
        is_enabled: true
      });

      if (response?.output === "Success" && response.data) {
        setAdministrativeClasses(response.data);
      } else {
        message.error(response?.error_message ?? "获取行政班级数据失败");
      }
    } catch (error) {
      console.error("加载行政班级数据出错", error);
      message.error("加载行政班级数据出错");
    }
  };

  // 加载学时类型列表并设置默认值
  const loadCreditHourTypes = async () => {
    try {
      const response = await GetCreditHourTypeListAPI();

      if (response && response.code === 200 && response.data) {
        const data = response.data || [];
        setCreditHourTypes(data);
        
        // 如果有数据，设置第一个为默认值
        if (data.length > 0) {
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

  // 教室变更处理
  const handleClassroomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const classroomUuid = e.target.value;
    handleInputChange(e);
    
    if (!classroomUuid) return;
    
    // 先使用默认值
    setFormData(prev => ({
      ...prev,
      teaching_campus: "main-campus" // 默认主校区
    }));
    
    // 调用API获取教室详细信息，包括校区
    (async () => {
      try {
        const response = await GetClassroomAPI(classroomUuid);
        
        if (response?.output === "Success" && response.data) {
          const campusUuid = response.data.campus?.campus_uuid || "main-campus";
          
          setFormData(prev => ({
            ...prev,
            teaching_campus: campusUuid
          }));
          
          console.log("已获取教室所在校区信息:", campusUuid);
        }
      } catch (error) {
        console.error("获取教室详细信息失败:", error);
      }
    })();
  };

  // 学期变更处理
  const handleSemesterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleInputChange(e);
  };
  
  // 添加时间段
  const handleAddTimeSlot = () => {
    setTimeSlots([
      ...timeSlots,
      { day_of_week: 1, period_start: 1, period_end: 2, week_numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16] }
    ]);
  };

  // 删除时间段
  const handleRemoveTimeSlot = (index: number) => {
    const newTimeSlots = [...timeSlots];
    newTimeSlots.splice(index, 1);
    setTimeSlots(newTimeSlots);
  };

  // 更新时间段信息
  const handleTimeSlotChange = (index: number, field: keyof ScheduleTimeSlot, value: number | number[]) => {
    const newTimeSlots = [...timeSlots];
    newTimeSlots[index] = { ...newTimeSlots[index], [field]: value };
    setTimeSlots(newTimeSlots);
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

  // 表单验证函数
  const validateForm = (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const errors: { [key: string]: string } = {};

      // 验证必填字段
      if (!formData.semester_uuid) {
        errors.semester_uuid = "请选择学期";
      }
      if (!formData.teaching_class_name) {
        errors.teaching_class_name = "请输入教学班名称";
      }
      if (!formData.classroom_uuid) {
        errors.classroom_uuid = "请选择教室";
      }
      if (!formData.teacher_uuid) {
        errors.teacher_uuid = "请选择授课教师";
      }
      if (!formData.course_uuid) {
        errors.course_uuid = "请选择课程";
      }

      // 验证选修/必修课特定字段
      if (formData.is_elective) {
        // 选修课必须指定学生人数
        if (!formData.student_count || formData.student_count <= 0) {
          errors.student_count = "选修课必须设置学生人数";
        }
      } else {
        // 必修课必须选择行政班级
        if (formData.administrative_class_uuids.length === 0) {
          errors.administrative_class_uuids = "必修课必须选择行政班级";
        }
      }

      setFormErrors(errors);

      if (Object.keys(errors).length > 0) {
        reject(new Error("表单验证失败"));
      } else {
        resolve(true);
      }
    });
  };

  // 表单提交处理
  const handleSubmit = async () => {
    try {
      await validateForm();
      
      if (timeSlots.length === 0) {
        message.warning("请至少添加一个时间段");
        return;
      }
      
      setSubmitting(true);
      
      // 获取部门UUID
      const departmentUuid = academicAffairs.currentAcademicAffairs?.department || "";
      if (!departmentUuid) {
        message.error("无法获取部门信息，请刷新页面重试");
        setSubmitting(false);
        return;
      }
      
      // 生成临时教学班UUID
      const tempUuid = Math.random().toString(36).substring(2, 15) + 
                        Math.random().toString(36).substring(2, 15);
      
      // 构建符合ClassAssignmentDTO的数据
      const submitData: ClassAssignmentDTO = {
        ...formData,
        teaching_class_uuid: tempUuid, // 使用临时生成的UUID
        class_time: timeSlots,
        // 处理选修/必修课特殊字段
        administrative_class_uuids: formData.is_elective ? [] : formData.administrative_class_uuids,
        student_count: formData.is_elective ? formData.student_count : undefined,
        // 确保部门和校区信息使用UUID
        course_ownership: departmentUuid,
        teaching_campus: formData.teaching_campus, // 校区UUID
        // 其他必填字段
        teaching_hours: formData.teaching_hours || 32,
        scheduled_hours: formData.scheduled_hours || 32,
        total_hours: formData.total_hours || 32,
        scheduling_priority: formData.scheduling_priority || 50,
        consecutive_sessions: formData.consecutive_sessions || 2
      };
      
      const response = await AddClassAssignmentAPI(submitData);
      
      if (response?.output === "Success") {
        // 检查是否有冲突
        if (response.data && response.data.length > 0) {
          // 有冲突，显示冲突信息
          setConflicts(response.data);
          setShowConflicts(true);
        } else {
          // 没有冲突，添加成功
          message.success("添加排课成功！");
          navigate("/academic/schedule");
        }
      } else {
        message.error(response?.error_message || "添加排课失败");
      }
    } catch (error) {
      console.error("添加排课出错", error);
      message.error("添加排课失败");
    } finally {
      setSubmitting(false);
    }
  };

  // 处理冲突确认
  const handleConflictConfirm = () => {
    setShowConflicts(false);
  };

  // 处理冲突取消
  const handleConflictCancel = () => {
    setShowConflicts(false);
    setConflicts([]);
  };

  // 获取冲突类型文字描述
  const getConflictTypeText = (type: number): string => {
    switch (type) {
      case 1:
        return "教师冲突";
      case 2:
        return "教室冲突";
      case 3:
        return "班级冲突";
      default:
        return "未知冲突";
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

  return (
    <div className="container mx-auto">
      <div className="card shadow-xl bg-base-100">
        <div className="card-body">
          <div className="flex justify-between items-center mb-6">
            <h2 className="card-title text-2xl flex items-center gap-2">
              <Schedule theme="outline" size="24" />
              添加排课
            </h2>
            <button
              type="button"
              className="btn btn-sm btn-ghost flex items-center gap-1"
              onClick={() => navigate("/academic/schedule")}
            >
              <ArrowLeft theme="outline" size="18" />
              返回列表
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {/* 学期选择 */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">学期<span className="text-error">*</span></span>
                  </label>
                  <select
                    name="semester_uuid"
                    className={`select select-bordered w-full ${formErrors.semester_uuid ? 'select-error' : ''}`}
                    value={formData.semester_uuid}
                    onChange={handleSemesterChange}
                  >
                    <option value="" disabled>请选择学期</option>
                    {semesters.map(sem => (
                      <option key={sem.semester_uuid} value={sem.semester_uuid}>
                        {sem.name}{sem.is_enabled ? " (启用中)" : ""}
                      </option>
                    ))}
                  </select>
                  {formErrors.semester_uuid && (
                    <label className="label">
                      <span className="label-text-alt text-error">{formErrors.semester_uuid}</span>
                    </label>
                  )}
                </div>

                {/* 教学班名称 */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">教学班名称<span className="text-error">*</span></span>
                  </label>
                  <input
                    type="text"
                    name="teaching_class_name"
                    placeholder="请输入教学班名称"
                    className="input input-bordered w-full"
                    value={formData.teaching_class_name}
                    onChange={handleInputChange}
                  />
                  {formErrors.teaching_class_name && (
                    <label className="label">
                      <span className="label-text-alt text-error">{formErrors.teaching_class_name}</span>
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

                {/* 课程类型选择 */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">课程类型<span className="text-error">*</span></span>
                  </label>
                  <select 
                    name="course_enu_type"
                    className={`select select-bordered w-full ${formErrors.course_enu_type ? 'select-error' : ''}`}
                    value={formData.course_enu_type}
                    onChange={handleInputChange}
                  >
                    {courseTypeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {formErrors.course_enu_type && (
                    <label className="label">
                      <span className="label-text-alt text-error">{formErrors.course_enu_type}</span>
                    </label>
                  )}
                </div>
                
                {/* 学时类型 */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">学时类型 <span className="text-error">*</span></span>
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

                {/* 必修/选修切换 */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">课程属性<span className="text-error">*</span></span>
                  </label>
                  <div className="flex gap-4 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        className="radio radio-primary"
                        name="is_elective"
                        checked={!formData.is_elective}
                        onChange={() => setFormData(prev => ({ ...prev, is_elective: false }))}
                      />
                      <span>必修课</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        className="radio radio-primary"
                        name="is_elective"
                        checked={formData.is_elective}
                        onChange={() => setFormData(prev => ({ ...prev, is_elective: true }))}
                      />
                      <span>选修课</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* 基于选课类型显示不同表单项 */}
              <div className="border border-base-300 rounded-lg p-4 mt-4">
                <h3 className="text-lg font-medium mb-4">
                  {formData.is_elective ? "选修课设置" : "必修课设置"}
                </h3>

                {formData.is_elective ? (
                  // 选修课 - 显示学生人数输入
                  <div className="form-control w-full max-w-xs">
                    <label className="label">
                      <span className="label-text">学生人数<span className="text-error">*</span></span>
                    </label>
                    <input
                      type="number"
                      name="student_count"
                      min="1"
                      placeholder="请输入学生人数"
                      className={`input input-bordered w-full ${formErrors.student_count ? 'input-error' : ''}`}
                      value={formData.student_count || ''}
                      onChange={handleInputChange}
                    />
                    {formErrors.student_count && (
                      <label className="label">
                        <span className="label-text-alt text-error">{formErrors.student_count}</span>
                      </label>
                    )}
                  </div>
                ) : (
                  // 必修课 - 显示行政班级选择
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">行政班级<span className="text-error">*</span></span>
                    </label>
                    <div className="flex flex-wrap gap-2 p-2 border border-base-300 rounded-lg min-h-[100px]">
                      {administrativeClasses.map(cls => (
                        <label
                          key={cls.administrative_class_uuid}
                          className={`flex items-center gap-1 p-2 border rounded-md cursor-pointer transition-colors ${formData.administrative_class_uuids.includes(cls.administrative_class_uuid)
                              ? 'bg-primary text-white'
                              : 'bg-base-200 hover:bg-base-300'
                            }`}
                        >
                          <input
                            type="checkbox"
                            className="checkbox checkbox-xs"
                            checked={formData.administrative_class_uuids.includes(cls.administrative_class_uuid)}
                            onChange={() => {
                              const current = [...formData.administrative_class_uuids];
                              const index = current.indexOf(cls.administrative_class_uuid);

                              if (index === -1) {
                                current.push(cls.administrative_class_uuid);
                              } else {
                                current.splice(index, 1);
                              }

                              setFormData({
                                ...formData,
                                administrative_class_uuids: current
                              });
                            }}
                          />
                          <span>{cls.class_name}</span>
                        </label>
                      ))}

                      {administrativeClasses.length === 0 && (
                        <div className="flex items-center justify-center w-full h-full text-base-content/60">
                          无可用行政班级
                        </div>
                      )}
                    </div>
                    {formErrors.administrative_class_uuids && (
                      <label className="label">
                        <span className="label-text-alt text-error">{formErrors.administrative_class_uuids}</span>
                      </label>
                    )}
                  </div>
                )}
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
                  </h3>
                  <button
                    type="button"
                    className="btn btn-sm btn-primary"
                    onClick={handleAddTimeSlot}
                  >
                    <Plus theme="outline" size="16" />
                    添加时间段
                  </button>
                </div>

                {timeSlots.length === 0 ? (
                  <div className="text-center text-base-content/60 py-8">
                    <p>请添加排课时间段</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {timeSlots.map((slot, index) => (
                      <div key={index} className="border border-base-200 rounded-lg p-4 bg-base-100/50">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium">时间段 #{index + 1}</h4>
                          <button
                            type="button"
                            className="btn btn-sm btn-error"
                            onClick={() => handleRemoveTimeSlot(index)}
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
                              onChange={(e) => handleTimeSlotChange(index, 'day_of_week', parseInt(e.target.value))}
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
                                handleTimeSlotChange(index, 'period_start', startValue);
                                if (startValue > slot.period_end) {
                                  handleTimeSlotChange(index, 'period_end', startValue);
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
                              onChange={(e) => handleTimeSlotChange(index, 'period_end', parseInt(e.target.value))}
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
                          {renderWeekSelector(index, slot.week_numbers)}
                        </div>
                      </div>
                    ))}
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

          {/* 冲突信息对话框 */}
          <Modal
            title={
              <div className="flex items-center text-error gap-2">
                <Attention theme="filled" size="24" fill="#ff4d4f" />
                <span>发现排课冲突</span>
              </div>
            }
            open={showConflicts}
            onOk={handleConflictConfirm}
            onCancel={handleConflictCancel}
            okText="确认"
            cancelText="取消"
            width={700}
          >
            <div className="py-2">
              <p className="mb-4">系统检测到以下排课冲突，请查看并决定如何处理:</p>

              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>冲突类型</th>
                      <th>冲突时间</th>
                      <th>描述</th>
                    </tr>
                  </thead>
                  <tbody>
                    {conflicts.map((conflict, index) => (
                      <tr key={index}>
                        <td>
                          <span className="badge badge-error">
                            {getConflictTypeText(conflict.conflict_type)}
                          </span>
                        </td>
                        <td>
                          第{conflict.conflict_time.week}周
                          周{["一", "二", "三", "四", "五", "六", "日"][conflict.conflict_time.day - 1] || "未知"}
                          第{conflict.conflict_time.period}节
                        </td>
                        <td>{conflict.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
} 