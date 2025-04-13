import React, { createContext, useContext, useState } from "react";
import { ScheduleFormContext, ScheduleFormData, ScheduleTimeSlot } from "./types";

// 表单上下文
const FormContext = createContext<ScheduleFormContext | undefined>(undefined);

// 默认表单数据
const defaultFormData: ScheduleFormData = {
  semester_uuid: "",
  teaching_class_name: "",
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
  student_count: undefined,
  is_elective: false,
  course_enu_type: "THEORY"
};

/**
 * 表单数据提供者
 * 管理表单状态并提供表单操作方法
 */
export const FormDataProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  // 表单状态
  const [formData, setFormData] = useState<ScheduleFormData>(defaultFormData);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [timeSlots, setTimeSlots] = useState<ScheduleTimeSlot[]>([]);

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
  
  // 重置或替换整个表单数据
  const resetFormData = (newData: Partial<ScheduleFormData>, newTimeSlots?: ScheduleTimeSlot[]) => {
    console.log("FormDataProvider：重置表单数据", {
      fieldsCount: Object.keys(newData).length,
      fields: Object.keys(newData),
      timeSlotsCount: newTimeSlots?.length
    });
    
    // 更新表单主体数据
    setFormData(prev => {
      const updated = {
        ...prev,
        ...newData
      };
      console.log("FormDataProvider：表单数据已更新", {
        oldSemester: prev.semester_uuid,
        newSemester: updated.semester_uuid,
        oldTeacher: prev.teacher_uuid,
        newTeacher: updated.teacher_uuid,
        oldCourse: prev.course_uuid,
        newCourse: updated.course_uuid
      });
      return updated;
    });
    
    // 如果提供了时间段数据，则更新时间段
    if (newTimeSlots && newTimeSlots.length > 0) {
      console.log("FormDataProvider：重置时间段数据", {
        count: newTimeSlots.length,
        slots: newTimeSlots.map(slot => 
          `周${slot.day_of_week} 第${slot.period_start}-${slot.period_end}节 共${slot.week_numbers.length}周`
        )
      });
      setTimeSlots(newTimeSlots);
    } else {
      console.log("FormDataProvider：未提供时间段数据或时间段为空");
    }
    
    // 清空所有错误
    setFormErrors({});
    
    // 确保下一个渲染周期能看到更新
    setTimeout(() => {
      console.log("FormDataProvider：数据重置完成，准备下一个渲染周期");
    }, 0);
    
    return true;
  };

  // 表单上下文值
  const formContextValue: ScheduleFormContext = {
    formData,
    formErrors,
    timeSlots,
    setFormData,
    setFormErrors,
    setTimeSlots,
    handleInputChange,
    resetFormData
  };

  return (
    <FormContext.Provider value={formContextValue}>
      {children}
    </FormContext.Provider>
  );
};

/**
 * 使用表单数据的Hook
 * @returns 表单上下文
 */
export const useFormData = (): ScheduleFormContext => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormData必须在FormDataProvider内部使用");
  }
  return context;
}; 