import { SchedulingConflictDTO } from "../../../../models/dto/scheduling_conflict_dto";
import { ClassroomLiteEntity } from "../../../../models/entity/classroom_lite_entity";
import { CourseLibraryEntity } from "../../../../models/entity/course_library_entity";
import { CreditHourTypeEntity } from "../../../../models/entity/credit_hour_type_entity";
import { SemesterEntity } from "../../../../models/entity/semester_entity";
import { TeacherLiteEntity } from "../../../../models/entity/teacher_lite_entity";

// 时间段类型
export interface ScheduleTimeSlot {
  day_of_week: number;
  period_start: number;
  period_end: number;
  week_numbers: number[];
}

// 行政班级类型
export interface AdministrativeClassEntity {
  administrative_class_uuid: string;
  class_name: string;
  class_code?: string;
  department_uuid?: string;
  grade?: string;
  major?: string;
  is_enabled?: boolean;
}

// 表单数据类型
export interface ScheduleFormData {
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

// 表单上下文类型
export interface ScheduleFormContext {
  formData: ScheduleFormData;
  formErrors: { [key: string]: string };
  timeSlots: ScheduleTimeSlot[];
  setFormData: (data: ScheduleFormData | ((prev: ScheduleFormData) => ScheduleFormData)) => void;
  setFormErrors: (errors: { [key: string]: string } | ((prev: { [key: string]: string }) => { [key: string]: string })) => void;
  setTimeSlots: (slots: ScheduleTimeSlot[] | ((prev: ScheduleTimeSlot[]) => ScheduleTimeSlot[])) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  resetFormData: (newData: Partial<ScheduleFormData>, newTimeSlots?: ScheduleTimeSlot[]) => boolean;
}

// 冲突处理上下文类型
export interface ConflictContext {
  conflicts: SchedulingConflictDTO[];
  showConflicts: boolean;
  setConflicts: (conflicts: SchedulingConflictDTO[]) => void;
  setShowConflicts: (show: boolean) => void;
}

// 数据上下文类型
export interface DataContext {
  semesters: SemesterEntity[];
  teachers: TeacherLiteEntity[];
  courses: CourseLibraryEntity[];
  classrooms: ClassroomLiteEntity[];
  administrativeClasses: AdministrativeClassEntity[];
  creditHourTypes: CreditHourTypeEntity[];
  loading: boolean;
}

// 公共方法上下文类型
export interface ApiContext {
  loadSemesters: () => Promise<void>;
  loadTeachers: () => Promise<void>;
  loadCourses: () => Promise<void>;
  loadClassrooms: () => Promise<void>;
  loadAdministrativeClasses: () => Promise<void>;
  loadCreditHourTypes: () => Promise<void>;
}

// 课程类型选项
export const COURSE_TYPE_OPTIONS = [
  { value: "THEORY", label: "理论课" },
  { value: "PRACTICE", label: "实践课" },
  { value: "MIXED", label: "混合课" },
  { value: "EXPERIMENT", label: "实验课" },
  { value: "COMPUTER", label: "机房课" },
  { value: "OTHER", label: "其他" }
]; 