import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { message } from "antd";
import { ArrowLeft, CloseOne, Save, Schedule } from "@icon-park/react";
import { GetClassroomAPI } from "../../../../apis/classroom_api";
import { AddClassAssignmentAPI } from "../../../../apis/class_assignment_api";
import { useSelector } from "react-redux";
import { AcademicAffairsStore } from "../../../../models/store/academic_affairs_store";
import { ClassAssignmentDTO } from "../../../../models/dto/class_assignment_dto";
import { SiteInfoEntity } from "../../../../models/entity/site_info_entity";
import { FormDataProvider, useFormData } from "./form_data_provider";
import { ConflictModalProvider, useConflictModal } from "./conflict_modal_component";
import { DataProvider, useApi, useData } from "./data_provider";
import { BasicInfoComponent } from "./basic_info_component";
import { EnrollmentInfoComponent } from "./enrollment_info_component";
import { TimeSlotComponent } from "./time_slot_component";
import { AiDialogComponent } from "./ai_dialog_component";

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

// 备注区域组件
const RemarksArea: React.FC<{ refreshKey?: number }> = ({ refreshKey }) => {
    const { formData, setFormData } = useFormData();
    
    // 用于调试
    useEffect(() => {
        console.log(`备注组件已刷新，键值: ${refreshKey}，当前备注: ${formData.remarks || '无'}`);
    }, [refreshKey, formData.remarks]);
    
    return (
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
                onChange={(e) => {
                    setFormData(prev => ({
                        ...prev,
                        remarks: e.target.value
                    }));
                }}
            ></textarea>
        </div>
    );
};

/**
 * 排课添加表单组件
 */
const ScheduleAddForm: React.FC<{ site: SiteInfoEntity; formRefreshKey: number }> = ({ site, formRefreshKey }) => {
    const navigate = useNavigate();
    const academicAffairs = useSelector((state: { academicAffairs: AcademicAffairsStore }) => state.academicAffairs);
    const { formData, formErrors, timeSlots, setFormData, setFormErrors } = useFormData();
    const { setConflicts, setShowConflicts } = useConflictModal();
    const { loading } = useData();
    const {
        loadSemesters,
        loadTeachers,
        loadCourses,
        loadClassrooms,
        loadAdministrativeClasses,
        loadCreditHourTypes
    } = useApi();
    const { semesters, teachers, courses, classrooms, administrativeClasses, creditHourTypes } = useData();

    const [submitting, setSubmitting] = useState(false);
    
    // 添加一个状态来跟踪表单数据变化
    const [formDataVersion, setFormDataVersion] = useState(0);
    
    // 监听formData变化，当数据改变时增加版本号
    useEffect(() => {
        // 递增表单数据版本
        console.log("表单数据已更新:", formData);
        setFormDataVersion(prev => prev + 1);
    }, [formData, timeSlots]);
    
    // 输出版本信息以便调试
    useEffect(() => {
        console.log(`表单数据版本: ${formDataVersion}, 刷新键: ${formRefreshKey}`);
    }, [formDataVersion, formRefreshKey]);

    // 页面加载
    useEffect(() => {
        document.title = `添加排课 | ${site.name ?? "Frontleaves Technology"}`;
        loadSemesters();
        loadTeachers();
        loadCourses();
        loadClassrooms();
        loadAdministrativeClasses();
        loadCreditHourTypes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [site.name]); // 只依赖site.name，其他方法通过eslint-disable-next-line忽略

    // 教室变更处理
    const handleClassroomChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const classroomUuid = e.target.value;

        // 先使用handleInputChange处理表单更新
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
                }
            } catch (error) {
                console.error("获取教室详细信息失败:", error);
            }
        })();
    }, [formErrors, setFormData, setFormErrors]);

    // 表单验证函数
    const validateForm = useCallback((): Promise<boolean> => {
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
    }, [formData, setFormErrors]);

    // 表单提交处理
    const handleSubmit = useCallback(async () => {
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
    }, [validateForm, timeSlots, academicAffairs.currentAcademicAffairs?.department, formData, setConflicts, setShowConflicts, navigate]);

    // 每次渲染时都记录当前数据状态，帮助调试
    console.log("表单渲染:", {
        formRefreshKey,
        formDataVersion,
        formData: {
            semester_uuid: formData.semester_uuid,
            teaching_class_name: formData.teaching_class_name,
            classroom_uuid: formData.classroom_uuid,
            teacher_uuid: formData.teacher_uuid,
            course_uuid: formData.course_uuid
        },
        timeSlots: timeSlots.length
    });

    return (
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
                        {/* 基本信息 */}
                        <BasicInfoComponent 
                            key={`basic-info-${formRefreshKey}-${formDataVersion}`}
                            semesters={semesters}
                            teachers={teachers}
                            courses={courses}
                            classrooms={classrooms}
                            creditHourTypes={creditHourTypes}
                            onClassroomChange={handleClassroomChange}
                        />

                        {/* 选课信息 */}
                        <EnrollmentInfoComponent 
                            key={`enrollment-info-${formRefreshKey}-${formDataVersion}`}
                            administrativeClasses={administrativeClasses}
                        />

                        {/* 备注 */}
                        <RemarksArea 
                            key={`remarks-${formRefreshKey}-${formDataVersion}`}
                            refreshKey={formDataVersion}
                        />

                        {/* 时间段配置 */}
                        <TimeSlotComponent 
                            key={`time-slot-${formRefreshKey}-${formDataVersion}`}
                        />

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
    );
};

/**
 * 排课添加组件
 * 
 * 用于创建新的排课信息
 * 
 * @param site 站点信息
 * @returns 排课添加页面组件
 */
export function ScheduleAddComponent({ site }: Readonly<{ site: SiteInfoEntity }>) {
    const [formRefreshKey, setFormRefreshKey] = useState(0);
    
    // 处理从AI组件接收到的数据
    const handleAiDataReceived = useCallback((aiData: AIResponse): void => {
        console.log('主组件：从AI接收到数据，准备更新表单:', aiData);
        
        // 将数据属性提取到日志以便调试
        const dataKeys = Object.keys(aiData);
        console.log(`收到数据包含 ${dataKeys.length} 个字段:`, dataKeys);
        if (aiData.class_time) {
            console.log(`包含 ${aiData.class_time.length} 个时间段`);
        }
        
        // 更新表单渲染键值，触发重新渲染
        const newKey = formRefreshKey + 1;
        console.log(`表单刷新键从 ${formRefreshKey} 更新为 ${newKey}`);
        setFormRefreshKey(newKey);
    }, [formRefreshKey]);
    
    return (
        <div className="container mx-auto">
            <FormDataProvider>
                <ConflictModalProvider>
                    <DataProvider>
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* 排课表单 - 占 70% 宽度 */}
                            <div className="w-full md:w-[70%]">
                                <ScheduleAddForm site={site} formRefreshKey={formRefreshKey} />
                            </div>

                            {/* AI 对话 - 占 30% 宽度 */}
                            <div className="w-full md:w-[30%]">
                                <AiDialogComponent onDataReceived={handleAiDataReceived} />
                            </div>
                        </div>
                    </DataProvider>
                </ConflictModalProvider>
            </FormDataProvider>
        </div>
    );
} 