/*
 * --------------------------------------------------------------------------------
 * Copyright (c) 2022-NOW(至今) 锋楪技术团队
 * Author: 锋楪技术团队 (https://www.frontleaves.com)
 *
 * 本文件包含锋楪技术团队项目的源代码，项目的所有源代码均遵循 MIT 开源许可证协议。
 * --------------------------------------------------------------------------------
 */

import React, { useEffect, useState } from "react";
import { 
  ArrowLeft, CheckOne, CloseOne
} from "@icon-park/react";
import { useNavigate, useParams } from "react-router";
import { message } from "antd";
import { AdministrativeClassDTO } from "../../../models/dto/administrative_class_dto";
import { GetAdministrativeClassInfoAPI, UpdateAdministrativeClassAPI } from "../../../apis/administrative_class_api";
import { GetDepartmentListAPI } from "../../../apis/department_api";
import { DepartmentEntity } from "../../../models/entity/department_entity";
import { GetMajorListAPI } from "../../../apis/major_api";
import { MajorEntity } from "../../../models/entity/major_entity";
import { GetTeacherListAPI } from "../../../apis/teacher_api";
import { TeacherEntity } from "../../../models/entity/teacher_entity";
import { PageTeacherSearchDTO } from "../../../models/dto/page/page_teacher_search_dto";
import { GetStudentListAPI } from "../../../apis/student_api";
import { StudentEntity } from "../../../models/entity/student_entity";
import { AdministrativeClassEntity } from "../../../models/entity/administrative_class_entity";
import { useSelector } from "react-redux";
import { AcademicAffairsStore } from "../../../models/store/academic_affairs_store";
import { MajorListDTO } from "../../../models/dto/major_list_dto";
import { GetGradeListAPI } from "../../../apis/grade_api";
import { GradeEntity } from "../../../models/entity/grade_entity";

/**
 * # 教务行政班编辑页面
 * > 用于编辑行政班信息
 * 
 * @returns 行政班编辑页面组件
 */
export function AdministrativeClassEdit() {
    const navigate = useNavigate();
    const { id } = useParams<{id: string}>();
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [departments, setDepartments] = useState<DepartmentEntity[]>([]);
    const [majors, setMajors] = useState<MajorEntity[]>([]);
    const [teachers, setTeachers] = useState<TeacherEntity[]>([]);
    const [students, setStudents] = useState<StudentEntity[]>([]);
    const [grades, setGrades] = useState<GradeEntity[]>([]);
    const [classEntity, setClassEntity] = useState<AdministrativeClassEntity | null>(null);

    // 获取当前教务权限信息
    const academicAffairs = useSelector((state: { academicAffairs: AcademicAffairsStore }) => state.academicAffairs);

    // 初始化表单数据
    const [formData, setFormData] = useState<AdministrativeClassDTO>({
        class_code: "",
        class_name: "",
        department_uuid: academicAffairs.currentAcademicAffairs?.department ?? "",
        major_uuid: "",
        grade_uuid: "",
        student_count: 0,
        counselor_uuid: "",
        monitor_uuid: "",
        is_enabled: true,
        description: ""
    });

    // 设置页面标题
    useEffect(() => {
        document.title = "编辑行政班级";
    }, []);

    // 获取行政班信息
    useEffect(() => {
        const fetchClass = async () => {
            if (!id) return;
            
            try {
                const response = await GetAdministrativeClassInfoAPI(id);
                if (response?.output === "Success" && response.data) {
                    const classData = response.data;
                    setClassEntity(classData);
                    
                    // 填充表单数据
                    setFormData({
                        class_code: classData.class_code,
                        class_name: classData.class_name,
                        department_uuid: classData.department_uuid,
                        major_uuid: classData.major_uuid,
                        grade_uuid: classData.grade_uuid,
                        student_count: classData.student_count,
                        counselor_uuid: classData.counselor_uuid,
                        monitor_uuid: classData.monitor_uuid,
                        is_enabled: classData.is_enabled,
                        description: classData.description || ""
                    });
                } else {
                    message.error(response?.error_message || "获取行政班信息失败");
                    navigate("/academic/administrative-class");
                }
            } catch (error) {
                console.error("获取行政班信息失败:", error);
                message.error("获取行政班信息失败，请检查网络连接");
                navigate("/academic/administrative-class");
            }
        };

        fetchClass();
    }, [id, navigate]);

    // 获取院系列表
    useEffect(() => {
        const fetchDepartments = async () => {
            setLoading(true);
            try {
                const response = await GetDepartmentListAPI();
                if (response?.output === "Success" && response.data) {
                    setDepartments(response.data);
                } else {
                    message.error(response?.error_message || "获取院系列表失败");
                }
            } catch (error) {
                console.error("获取院系数据失败:", error);
                message.error("获取院系数据失败，请检查网络连接");
            } finally {
                setLoading(false);
            }
        };

        fetchDepartments();
    }, []);

    // 获取专业列表
    useEffect(() => {
        const fetchMajors = async () => {
            try {
                const params: MajorListDTO = {};
                
                // 使用教务权限关联的部门获取专业
                if (academicAffairs.loaded && academicAffairs.currentAcademicAffairs?.department) {
                    params.department = academicAffairs.currentAcademicAffairs.department;
                }
                
                const response = await GetMajorListAPI(params);
                if (response?.output === "Success" && response.data) {
                    setMajors(response.data);
                } else {
                    message.error(response?.error_message || "获取专业列表失败");
                }
            } catch (error) {
                console.error("获取专业数据失败:", error);
                message.error("获取专业数据失败，请检查网络连接");
            }
        };

        fetchMajors();
    }, [academicAffairs.loaded, academicAffairs.currentAcademicAffairs]);

    // 获取教师列表（用于选择辅导员）
    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const params: PageTeacherSearchDTO = {
                    page: 1,
                    size: 100, // 获取足够多的教师以供选择
                    is_desc: true
                };
                
                const response = await GetTeacherListAPI(params);
                if (response?.output === "Success" && response.data) {
                    setTeachers(response.data.records || []);
                } else {
                    message.error(response?.error_message || "获取教师列表失败");
                }
            } catch (error) {
                console.error("获取教师数据失败:", error);
                message.error("获取教师数据失败，请检查网络连接");
            }
        };

        fetchTeachers();
    }, []);

    // 获取学生列表（用于选择班长）
    useEffect(() => {
        const fetchStudents = async () => {
            if (!id) return;
            
            try {
                // 只使用当前行政班UUID获取学生
                const params = {
                    administrative_class_uuid: id
                };
                
                const response = await GetStudentListAPI(params);
                if (response?.output === "Success" && response.data) {
                    setStudents(response.data || []);
                } else {
                    message.error(response?.error_message || "获取学生列表失败");
                }
            } catch (error) {
                console.error("获取学生数据失败:", error);
                message.error("获取学生数据失败，请检查网络连接");
            }
        };

        fetchStudents();
    }, [id]);

    // 获取年级列表
    useEffect(() => {
        const fetchGrades = async () => {
            try {
                const response = await GetGradeListAPI();
                if (response && response.output === "Success" && response.data) {
                    const gradeData = response.data as GradeEntity[];
                    setGrades(gradeData);
                } else {
                    message.error((response && response.error_message) || "获取年级列表失败");
                }
            } catch (error) {
                console.error("获取年级数据失败:", error);
                message.error("获取年级数据失败，请检查网络连接");
            }
        };

        fetchGrades();
    }, []);

    // 提交表单
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;
        
        setSubmitting(true);
        
        try {
            // 使用原始的学生人数，而不是表单中的值（教务不能修改人数）
            const submissionData = {
                ...formData,
                student_count: classEntity ? classEntity.student_count : formData.student_count
            };
            
            const response = await UpdateAdministrativeClassAPI(id, submissionData);
            if (response?.output === "Success") {
                message.success("行政班修改成功");
                navigate("/academic/administrative-class");
            } else {
                message.error(response?.error_message || "修改行政班失败");
            }
        } catch (error) {
            console.error("表单提交失败:", error);
            message.error("提交失败，请检查输入内容");
        } finally {
            setSubmitting(false);
        }
    };

    // 处理输入框变化
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        
        // 不允许修改学生人数
        if (name === 'student_count') {
            return;
        }
        
        if (type === 'number') {
            setFormData({
                ...formData,
                [name]: parseFloat(value) || 0
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    // 处理开关变化
    const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            is_enabled: e.target.checked
        });
    };

    return (
        <div className="space-y-6 w-full">
            {/* 顶部导航 */}
            <div className="flex items-center justify-between bg-base-100 p-4 rounded-lg shadow-sm border border-base-200">
                <div className="flex items-center space-x-3">
                    <button 
                        className="btn btn-sm btn-outline" 
                        onClick={() => navigate("/academic/administrative-class")}
                    >
                        <ArrowLeft />
                        返回列表
                    </button>
                    <h2 className="text-2xl font-bold">编辑行政班</h2>
                </div>
                
                <div className="flex gap-2">
                    <button 
                        className="btn btn-sm btn-error" 
                        onClick={() => navigate("/academic/administrative-class")}
                    >
                        <CloseOne />
                        取消
                    </button>
                    <button 
                        type="submit"
                        form="classEditForm"
                        className="btn btn-sm btn-primary" 
                        disabled={submitting}
                    >
                        {submitting ? <span className="loading loading-spinner loading-sm"></span> : <CheckOne />}
                        保存
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-12 bg-base-100 rounded-lg shadow-sm border border-base-200">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                    <p className="mt-4 text-base-content/70">加载数据中...</p>
                </div>
            ) : (
                <form id="classEditForm" onSubmit={handleSubmit} className="space-y-6">
                    {/* 行政班基本信息卡片 */}
                    <div className="card bg-base-100 shadow-sm border border-base-200 overflow-hidden">
                        <div className="bg-primary/10 p-4 flex items-center space-x-2 rounded-t-box">
                            <h2 className="card-title text-lg m-0">行政班基本信息</h2>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* 班级编号 */}
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-medium">班级编号<span className="text-error ml-1">*</span></span>
                                    </label>
                                    <input 
                                        type="text" 
                                        name="class_code"
                                        placeholder="请输入班级编号，如2023CS01" 
                                        className="input input-bordered w-full focus:input-primary" 
                                        required
                                        value={formData.class_code}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                {/* 班级名称 */}
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-medium">班级名称<span className="text-error ml-1">*</span></span>
                                    </label>
                                    <input 
                                        type="text" 
                                        name="class_name"
                                        placeholder="请输入班级名称" 
                                        className="input input-bordered w-full focus:input-primary" 
                                        required
                                        value={formData.class_name}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                {/* 所属院系 */}
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-medium">所属院系<span className="text-error ml-1">*</span></span>
                                    </label>
                                    <select 
                                        name="department_uuid"
                                        className="select select-bordered w-full focus:select-primary" 
                                        required
                                        value={formData.department_uuid}
                                        onChange={handleInputChange}
                                    >
                                        <option value="" disabled>请选择院系</option>
                                        {departments.map(dept => (
                                            <option key={dept.department_uuid} value={dept.department_uuid}>
                                                {dept.department_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* 所属专业 */}
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-medium">所属专业<span className="text-error ml-1">*</span></span>
                                    </label>
                                    <select 
                                        name="major_uuid"
                                        className="select select-bordered w-full focus:select-primary" 
                                        required
                                        value={formData.major_uuid}
                                        onChange={handleInputChange}
                                        disabled={!formData.department_uuid || majors.length === 0}
                                    >
                                        <option value="" disabled>请选择专业</option>
                                        {majors.map(major => (
                                            <option key={major.major_uuid} value={major.major_uuid}>
                                                {major.major_name}
                                            </option>
                                        ))}
                                    </select>
                                    {formData.department_uuid && majors.length === 0 && (
                                        <label className="label">
                                            <span className="label-text-alt text-warning">当前院系下暂无专业，请先添加专业</span>
                                        </label>
                                    )}
                                </div>

                                {/* 年级 */}
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-medium">年级<span className="text-error ml-1">*</span></span>
                                    </label>
                                    <select 
                                        name="grade_uuid"
                                        className="select select-bordered w-full focus:select-primary" 
                                        required
                                        value={formData.grade_uuid}
                                        onChange={handleInputChange}
                                    >
                                        <option value="" disabled>请选择年级</option>
                                        {grades.map(grade => (
                                            <option key={grade.grade_uuid} value={grade.grade_uuid}>
                                                {grade.name}
                                            </option>
                                        ))}
                                    </select>
                                    {grades.length === 0 && (
                                        <label className="label">
                                            <span className="label-text-alt text-warning">暂无可用年级数据，请先添加年级</span>
                                        </label>
                                    )}
                                </div>

                                {/* 辅导员 */}
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-medium">辅导员</span>
                                    </label>
                                    <select 
                                        name="counselor_uuid"
                                        className="select select-bordered w-full focus:select-primary" 
                                        value={formData.counselor_uuid}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">请选择辅导员</option>
                                        {teachers.map(teacher => (
                                            <option key={teacher.teacher_uuid} value={teacher.teacher_uuid}>
                                                {teacher.name || '未命名'}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* 班长 */}
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-medium">班长</span>
                                    </label>
                                    <select 
                                        name="monitor_uuid"
                                        className="select select-bordered w-full focus:select-primary" 
                                        value={formData.monitor_uuid}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">请选择班长</option>
                                        {students.map(student => (
                                            <option key={student.student_uuid} value={student.student_uuid}>
                                                {student.name || '未命名'}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* 是否启用 */}
                                <div className="form-control">
                                    <label className="label cursor-pointer justify-start gap-4">
                                        <span className="label-text font-medium">启用状态</span>
                                        <input 
                                            type="checkbox" 
                                            className="toggle toggle-primary" 
                                            checked={formData.is_enabled}
                                            onChange={handleSwitchChange}
                                        />
                                    </label>
                                </div>
                            </div>

                            {/* 班级描述 */}
                            <div className="form-control w-full mt-6">
                                <label className="label">
                                    <span className="label-text font-medium">班级描述</span>
                                </label>
                                <textarea 
                                    name="description"
                                    placeholder="请输入班级描述信息" 
                                    className="textarea textarea-bordered w-full h-24 focus:textarea-primary" 
                                    value={formData.description || ""}
                                    onChange={handleInputChange}
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
} 