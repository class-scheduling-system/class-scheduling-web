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
import { useNavigate } from "react-router";
import { message } from "antd";
import { AdministrativeClassDTO } from "../../../models/dto/administrative_class_dto";
import { CreateAdministrativeClassAPI } from "../../../apis/administrative_class_api";
import { GetDepartmentListAPI } from "../../../apis/department_api";
import { DepartmentEntity } from "../../../models/entity/department_entity";
import { GetMajorListAPI } from "../../../apis/major_api";
import { MajorEntity } from "../../../models/entity/major_entity";
import { GetTeacherListAPI } from "../../../apis/teacher_api";
import { TeacherEntity } from "../../../models/entity/teacher_entity";
import { PageTeacherSearchDTO } from "../../../models/dto/page/page_teacher_search_dto";
import { useSelector } from "react-redux";
import { AcademicAffairsStore } from "../../../models/store/academic_affairs_store";
import { MajorListDTO } from "../../../models/dto/major_list_dto";

/**
 * # 教务行政班添加页面
 * > 用于添加新行政班
 * 
 * @returns 行政班添加页面组件
 */
export function AdministrativeClassAdd() {
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [departments, setDepartments] = useState<DepartmentEntity[]>([]);
    const [majors, setMajors] = useState<MajorEntity[]>([]);
    const [teachers, setTeachers] = useState<TeacherEntity[]>([]);

    // 获取当前教务权限信息
    const academicAffairs = useSelector((state: { academicAffairs: AcademicAffairsStore }) => state.academicAffairs);

    // 初始化表单数据
    const [formData, setFormData] = useState<AdministrativeClassDTO>({
        class_code: "",
        class_name: "",
        department_uuid: academicAffairs.currentAcademicAffairs?.department ?? "",
        major_uuid: "",
        grade_uuid: "2023", // 由于没有年级相关API，直接使用固定值
        student_count: 0,
        counselor_uuid: "",
        monitor_uuid: "",
        is_enabled: true,
        description: ""
    });

    // 设置页面标题
    useEffect(() => {
        document.title = "添加行政班级";
    }, []);

    // 当academicAffairs加载时，更新表单数据中的department_uuid
    useEffect(() => {
        // 如果academicAffairs已加载，并且存在当前权限，则更新部门
        if (academicAffairs.loaded && academicAffairs.currentAcademicAffairs) {
            setFormData(prev => ({
                ...prev,
                department_uuid: academicAffairs.currentAcademicAffairs!.department
            }));
        }
    }, [academicAffairs.loaded, academicAffairs.currentAcademicAffairs]);

    // 获取院系列表
    useEffect(() => {
        const fetchDepartments = async () => {
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
            }
        };

        fetchDepartments();
    }, []);

    // 获取专业列表 - 根据教务部门筛选
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

    // 提交表单
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const response = await CreateAdministrativeClassAPI(formData);
            if (response?.output === "Success") {
                message.success("行政班添加成功");
                navigate("/academic/administrative-class");
            } else {
                message.error(response?.error_message || "添加行政班失败");
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
                    <h2 className="text-2xl font-bold">添加行政班</h2>
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
                        form="classAddForm"
                        className="btn btn-sm btn-primary"
                        disabled={submitting}
                    >
                        <CheckOne />
                        保存
                    </button>
                </div>
            </div>

            {/* 表单区域 */}
            <div className="bg-base-100 rounded-lg shadow-sm border border-base-200 p-6">
                <form id="classAddForm" onSubmit={handleSubmit} className="space-y-6">
                    {/* 基本信息 */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">基本信息</h3>
                        <div className="divider my-2"></div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">班级编码 <span className="text-error">*</span></span>
                                </label>
                                <input
                                    type="text"
                                    name="class_code"
                                    placeholder="请输入班级编码"
                                    className="input input-bordered w-full"
                                    value={formData.class_code}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">班级名称 <span className="text-error">*</span></span>
                                </label>
                                <input
                                    type="text"
                                    name="class_name"
                                    placeholder="请输入班级名称"
                                    className="input input-bordered w-full"
                                    value={formData.class_name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">所属院系 <span className="text-error">*</span></span>
                                </label>
                                <select
                                    name="department_uuid"
                                    className="select select-bordered w-full"
                                    value={formData.department_uuid}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">请选择院系</option>
                                    {departments.map(dept => (
                                        // 如果有教务权限关联的部门，默认选中
                                        <option
                                            key={dept.department_uuid}
                                            value={dept.department_uuid}
                                            selected={academicAffairs.currentAcademicAffairs?.department === dept.department_uuid}
                                        >
                                            {dept.department_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">所属专业 <span className="text-error">*</span></span>
                                </label>
                                <select
                                    name="major_uuid"
                                    className="select select-bordered w-full"
                                    value={formData.major_uuid}
                                    onChange={handleInputChange}
                                    required
                                    disabled={!formData.department_uuid || majors.length === 0}
                                >
                                    <option value="">请选择专业</option>
                                    {majors.map(major => (
                                        <option key={major.major_uuid} value={major.major_uuid}>
                                            {major.major_name}
                                        </option>
                                    ))}
                                </select>
                                {formData.department_uuid && majors.length === 0 && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">该院系下没有可用的专业</span>
                                    </label>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">年级 <span className="text-error">*</span></span>
                                </label>
                                <input
                                    type="text"
                                    name="grade_uuid"
                                    placeholder="请输入年级 (例如: 2023)"
                                    className="input input-bordered w-full"
                                    value={formData.grade_uuid}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">辅导员</span>
                                </label>
                                <select
                                    name="counselor_uuid"
                                    className="select select-bordered w-full"
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
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">班级描述</span>
                            </label>
                            <textarea
                                name="description"
                                placeholder="请输入班级描述"
                                className="textarea textarea-bordered h-24"
                                value={formData.description}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-control">
                            <label className="label cursor-pointer justify-start gap-2">
                                <input
                                    type="checkbox"
                                    className="toggle toggle-primary"
                                    checked={formData.is_enabled}
                                    onChange={handleSwitchChange}
                                />
                                <span className="label-text">启用班级</span>
                            </label>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
} 