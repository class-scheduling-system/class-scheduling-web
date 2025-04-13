import React, { createContext, useContext, useEffect, useState } from "react";
import { message } from "antd";
import { useSelector } from "react-redux";
import { AcademicAffairsStore } from "../../../../models/store/academic_affairs_store";
import { GetSemesterListAPI } from "../../../../apis/semester_api";
import { GetTeacherListAPI } from "../../../../apis/teacher_api";
import { GetCourseListAPI } from "../../../../apis/course_api";
import { GetClassroomListAPI } from "../../../../apis/classroom_api";
import { GetAllAdministrativeClassListAPI } from "../../../../apis/administrative_class_api";
import { GetCreditHourTypeListAPI } from "../../../../apis/credit_hour_type_api";
import { AdministrativeClassEntity, ApiContext, DataContext } from "./types";
import { SemesterEntity } from "../../../../models/entity/semester_entity";
import { TeacherLiteEntity } from "../../../../models/entity/teacher_lite_entity";
import { CourseLibraryEntity } from "../../../../models/entity/course_library_entity";
import { ClassroomLiteEntity } from "../../../../models/entity/classroom_lite_entity";
import { CreditHourTypeEntity } from "../../../../models/entity/credit_hour_type_entity";
import { useFormData } from "./form_data_provider";

// 创建数据上下文
const DataLoadContext = createContext<DataContext | undefined>(undefined);
const ApiCallContext = createContext<ApiContext | undefined>(undefined);

/**
 * 数据提供者组件
 * 负责加载和管理所有API数据
 */
export const DataProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const academicAffairs = useSelector((state: { academicAffairs: AcademicAffairsStore }) => state.academicAffairs);
  const { formData, setFormData } = useFormData();
  
  // 数据状态
  const [semesters, setSemesters] = useState<SemesterEntity[]>([]);
  const [teachers, setTeachers] = useState<TeacherLiteEntity[]>([]);
  const [courses, setCourses] = useState<CourseLibraryEntity[]>([]);
  const [classrooms, setClassrooms] = useState<ClassroomLiteEntity[]>([]);
  const [administrativeClasses, setAdministrativeClasses] = useState<AdministrativeClassEntity[]>([]);
  const [creditHourTypes, setCreditHourTypes] = useState<CreditHourTypeEntity[]>([]);
  const [loading, setLoading] = useState(false);

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
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      message.error(`获取学时类型列表失败: ${errorMessage}`);
    }
  };

  // 自动填充学院信息
  useEffect(() => {
    const departmentUuid = academicAffairs.currentAcademicAffairs?.department || "";
    if (departmentUuid) {
      setFormData(prev => ({
        ...prev,
        course_ownership: departmentUuid,
      }));
    }
  }, [academicAffairs.currentAcademicAffairs]);

  // API上下文值
  const apiContextValue: ApiContext = {
    loadSemesters,
    loadTeachers,
    loadCourses,
    loadClassrooms,
    loadAdministrativeClasses,
    loadCreditHourTypes
  };

  // 数据上下文值
  const dataContextValue: DataContext = {
    semesters,
    teachers,
    courses,
    classrooms,
    administrativeClasses,
    creditHourTypes,
    loading
  };

  return (
    <ApiCallContext.Provider value={apiContextValue}>
      <DataLoadContext.Provider value={dataContextValue}>
        {children}
      </DataLoadContext.Provider>
    </ApiCallContext.Provider>
  );
};

/**
 * 使用数据的Hook
 * @returns 数据上下文
 */
export const useData = (): DataContext => {
  const context = useContext(DataLoadContext);
  if (!context) {
    throw new Error("useData必须在DataProvider内部使用");
  }
  return context;
};

/**
 * 使用API的Hook
 * @returns API上下文
 */
export const useApi = (): ApiContext => {
  const context = useContext(ApiCallContext);
  if (!context) {
    throw new Error("useApi必须在DataProvider内部使用");
  }
  return context;
}; 