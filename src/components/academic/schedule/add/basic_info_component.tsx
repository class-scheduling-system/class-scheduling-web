import React from "react";
import { useFormData } from "./form_data_provider";
import { COURSE_TYPE_OPTIONS } from "./types";

/**
 * 基本信息表单组件
 * 包含排课基本信息的表单字段
 */
export const BasicInfoComponent: React.FC<{
  semesters: any[];
  teachers: any[];
  courses: any[];
  classrooms: any[];
  creditHourTypes: any[];
  onClassroomChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}> = ({ 
  semesters, 
  teachers, 
  courses, 
  classrooms, 
  creditHourTypes,
  onClassroomChange 
}) => {
  const { formData, formErrors, handleInputChange } = useFormData();

  return (
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
          onChange={handleInputChange}
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
          onChange={onClassroomChange}
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
          {COURSE_TYPE_OPTIONS.map(option => (
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
              onChange={() => {
                // 使用setFormData而非直接修改值，以确保通过上下文正确地更新
                const updatedValue = { ...formData, is_elective: false };
                handleInputChange({
                  target: { name: 'is_elective', value: false }
                } as React.ChangeEvent<HTMLInputElement>);
              }}
            />
            <span>必修课</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              className="radio radio-primary"
              name="is_elective"
              checked={formData.is_elective}
              onChange={() => {
                const updatedValue = { ...formData, is_elective: true };
                handleInputChange({
                  target: { name: 'is_elective', value: true }
                } as React.ChangeEvent<HTMLInputElement>);
              }}
            />
            <span>选修课</span>
          </label>
        </div>
      </div>
    </div>
  );
}; 