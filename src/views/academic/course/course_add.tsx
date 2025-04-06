/*
 * --------------------------------------------------------------------------------
 * Copyright (c) 2022-NOW(至今) 锋楪技术团队
 * Author: 锋楪技术团队 (https://www.frontleaves.com)
 *
 * 本文件包含锋楪技术团队项目的源代码，项目的所有源代码均遵循 MIT 开源许可证协议。
 * --------------------------------------------------------------------------------
 * 许可证声明：
 *
 * 版权所有 (c) 2022-2025 锋楪技术团队。保留所有权利。
 *
 * 本软件是"按原样"提供的，没有任何形式的明示或暗示的保证，包括但不限于
 * 对适销性、特定用途的适用性和非侵权性的暗示保证。在任何情况下，
 * 作者或版权持有人均不承担因软件或软件的使用或其他交易而产生的、
 * 由此引起的或以任何方式与此软件有关的任何索赔、损害或其他责任。
 *
 * 使用本软件即表示您了解此声明并同意其条款。
 *
 * 有关 MIT 许可证的更多信息，请查看项目根目录下的 LICENSE 文件或访问：
 * https://opensource.org/licenses/MIT
 * --------------------------------------------------------------------------------
 * 免责声明：
 *
 * 使用本软件的风险由用户自担。作者或版权持有人在法律允许的最大范围内，
 * 对因使用本软件内容而导致的任何直接或间接的损失不承担任何责任。
 * --------------------------------------------------------------------------------
 */

import React, { useEffect, useState } from "react";
import { SiteInfoEntity } from "../../../models/entity/site_info_entity";
import { 
  ArrowLeft, CheckOne, CloseOne, Book, School
} from "@icon-park/react";
import { useNavigate } from "react-router";
import { message } from "antd";
import { CourseLibraryDTO } from "../../../models/dto/course_library_dto";
import { AddCourseAPI } from "../../../apis/course_api";
import { GetDepartmentListAPI } from "../../../apis/department_api";
import { DepartmentEntity } from "../../../models/entity/department_entity";

/**
 * # 教务课程添加页面
 * > 用于添加新课程
 * 
 * @param site 站点信息
 * @returns 课程添加页面组件
 */
export function AcademicCourseAdd({ site }: Readonly<{ site: SiteInfoEntity }>) {
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [departments, setDepartments] = useState<DepartmentEntity[]>([]);

    // 初始化表单数据
    const [formData, setFormData] = useState<CourseLibraryDTO>({
        id: "",
        name: "",
        english_name: "",
        department: "",
        type: "",
        credit: 0,
        total_hours: 0,
        week_hours: 0,
        theory_hours: 0,
        experiment_hours: 0,
        practice_hours: 0,
        computer_hours: 0,
        other_hours: 0,
        is_enabled: true,
    });

    // 设置页面标题
    useEffect(() => {
        document.title = `添加课程 | ${site.name ?? "Frontleaves Technology"}`;
    }, [site.name]);

    // 获取部门列表
    useEffect(() => {
        const fetchDepartments = async () => {
            setLoading(true);
            try {
                const response = await GetDepartmentListAPI();
                if (response?.output === "Success" && response.data) {
                    setDepartments(response.data);
                } else {
                    message.error(response?.error_message || "获取部门列表失败");
                }
            } catch (error) {
                console.error("获取部门数据失败:", error);
                message.error("获取部门数据失败，请检查网络连接");
            } finally {
                setLoading(false);
            }
        };

        fetchDepartments();
    }, []);

    // 计算总学时
    const calculateTotalHours = () => {
        const { theory_hours, experiment_hours, practice_hours, computer_hours, other_hours } = formData;
        return (theory_hours || 0) + 
               (experiment_hours || 0) + 
               (practice_hours || 0) + 
               (computer_hours || 0) + 
               (other_hours || 0);
    };

    // 提交表单
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        
        try {
            const totalHours = calculateTotalHours();
            const submissionData = {
                ...formData,
                total_hours: totalHours
            };

            const response = await AddCourseAPI(submissionData);
            if (response?.output === "Success") {
                message.success("课程添加成功");
                navigate("/academic/course");
            } else {
                message.error(response?.error_message || "添加课程失败");
            }
        } catch (error) {
            console.error("表单提交失败:", error);
            message.error("提交失败，请检查输入内容");
        } finally {
            setSubmitting(false);
        }
    };

    // 自定义课程类型选项
    const courseTypeOptions = [
        { label: "专业必修课", value: "专业必修课" },
        { label: "专业选修课", value: "专业选修课" },
        { label: "公共必修课", value: "公共必修课" },
        { label: "公共选修课", value: "公共选修课" },
        { label: "实验课", value: "实验课" },
        { label: "实践课", value: "实践课" }
    ];

    // 处理输入框变化
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <button 
                        className="btn btn-sm btn-outline" 
                        onClick={() => navigate("/academic/course")}
                    >
                        <ArrowLeft />
                        返回列表
                    </button>
                    <h2 className="text-2xl font-bold">添加课程</h2>
                </div>
                
                <div className="flex gap-2">
                    <button 
                        className="btn btn-sm btn-error" 
                        onClick={() => navigate("/academic/course")}
                    >
                        <CloseOne />
                        取消
                    </button>
                    <button 
                        className="btn btn-sm btn-primary" 
                        onClick={handleSubmit}
                        disabled={submitting}
                    >
                        {submitting ? <span className="loading loading-spinner loading-sm"></span> : <CheckOne />}
                        保存
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                    <p className="mt-4 text-gray-500">加载部门数据中...</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* 课程基本信息卡片 */}
                    <div className="card bg-base-100 shadow-sm border border-base-200">
                        <div className="card-body">
                            <div className="bg-primary/10 p-4 flex items-center space-x-2 -mx-4 -mt-4 mb-4 rounded-t-box">
                                <Book theme="outline" size="20" className="text-primary"/>
                                <h2 className="card-title text-lg m-0">课程基本信息</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* 课程代码 */}
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-medium">课程代码<span className="text-error ml-1">*</span></span>
                                    </label>
                                    <input 
                                        type="text" 
                                        name="id"
                                        placeholder="请输入课程代码，如CS101" 
                                        className="input input-bordered w-full" 
                                        required
                                        value={formData.id}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                {/* 课程名称 */}
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-medium">课程名称<span className="text-error ml-1">*</span></span>
                                    </label>
                                    <input 
                                        type="text" 
                                        name="name"
                                        placeholder="请输入课程名称" 
                                        className="input input-bordered w-full" 
                                        required
                                        value={formData.name}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                {/* 课程英文名称 */}
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-medium">课程英文名称</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        name="english_name"
                                        placeholder="请输入课程英文名称" 
                                        className="input input-bordered w-full"
                                        value={formData.english_name || ""}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                {/* 所属院系 */}
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-medium">所属院系<span className="text-error ml-1">*</span></span>
                                    </label>
                                    <select 
                                        className="select select-bordered w-full" 
                                        name="department"
                                        required
                                        value={formData.department}
                                        onChange={handleInputChange}
                                    >
                                        <option value="" disabled>请选择所属院系</option>
                                        {departments.map(dept => (
                                            <option key={dept.department_uuid} value={dept.department_uuid}>
                                                {dept.department_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* 课程类型 */}
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-medium">课程类型<span className="text-error ml-1">*</span></span>
                                    </label>
                                    <select 
                                        className="select select-bordered w-full" 
                                        name="type"
                                        required
                                        value={formData.type}
                                        onChange={handleInputChange}
                                    >
                                        <option value="" disabled>请选择课程类型</option>
                                        {courseTypeOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* 学分 */}
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-medium">学分<span className="text-error ml-1">*</span></span>
                                    </label>
                                    <input 
                                        type="number" 
                                        name="credit"
                                        placeholder="请输入学分" 
                                        className="input input-bordered w-full" 
                                        required
                                        min="0"
                                        step="0.5"
                                        value={formData.credit}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                {/* 周课时 */}
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-medium">周课时<span className="text-error ml-1">*</span></span>
                                    </label>
                                    <input 
                                        type="number" 
                                        name="week_hours"
                                        placeholder="请输入周课时" 
                                        className="input input-bordered w-full" 
                                        required
                                        min="0"
                                        value={formData.week_hours}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                {/* 是否启用 */}
                                <div className="form-control">
                                    <label className="label cursor-pointer justify-start gap-4">
                                        <span className="label-text font-medium">是否启用</span>
                                        <input 
                                            type="checkbox" 
                                            className="toggle toggle-primary" 
                                            checked={formData.is_enabled}
                                            onChange={handleSwitchChange}
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 课程学时信息卡片 */}
                    <div className="card bg-base-100 shadow-sm border border-base-200">
                        <div className="card-body">
                            <div className="bg-secondary/10 p-4 flex items-center space-x-2 -mx-4 -mt-4 mb-4 rounded-t-box">
                                <School theme="outline" size="20" className="text-secondary"/>
                                <h2 className="card-title text-lg m-0">课程学时信息</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* 理论课时 */}
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-medium">理论课时</span>
                                    </label>
                                    <input 
                                        type="number" 
                                        name="theory_hours"
                                        placeholder="请输入理论课时" 
                                        className="input input-bordered w-full" 
                                        min="0"
                                        value={formData.theory_hours}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                {/* 实验课时 */}
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-medium">实验课时</span>
                                    </label>
                                    <input 
                                        type="number" 
                                        name="experiment_hours"
                                        placeholder="请输入实验课时" 
                                        className="input input-bordered w-full" 
                                        min="0"
                                        value={formData.experiment_hours}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                {/* 实践课时 */}
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-medium">实践课时</span>
                                    </label>
                                    <input 
                                        type="number" 
                                        name="practice_hours"
                                        placeholder="请输入实践课时" 
                                        className="input input-bordered w-full" 
                                        min="0"
                                        value={formData.practice_hours}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                {/* 上机课时 */}
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-medium">上机课时</span>
                                    </label>
                                    <input 
                                        type="number" 
                                        name="computer_hours"
                                        placeholder="请输入上机课时" 
                                        className="input input-bordered w-full" 
                                        min="0"
                                        value={formData.computer_hours}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                {/* 其他课时 */}
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-medium">其他课时</span>
                                    </label>
                                    <input 
                                        type="number" 
                                        name="other_hours"
                                        placeholder="请输入其他课时" 
                                        className="input input-bordered w-full" 
                                        min="0"
                                        value={formData.other_hours}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                {/* 总课时（自动计算） */}
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-medium">总课时</span>
                                    </label>
                                    <input 
                                        type="number" 
                                        className="input input-bordered w-full bg-base-200" 
                                        value={calculateTotalHours()}
                                        disabled
                                    />
                                    <label className="label">
                                        <span className="label-text-alt text-base-content/70">总课时会根据上方各类课时自动计算</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 底部按钮 */}
                    <div className="flex justify-end space-x-2 mt-6">
                        <button 
                            type="button" 
                            className="btn btn-outline" 
                            onClick={() => navigate("/academic/course")}
                        >
                            <CloseOne />取消
                        </button>
                        <button 
                            type="submit" 
                            className="btn btn-primary"
                            disabled={submitting}
                        >
                            {submitting ? <span className="loading loading-spinner loading-sm"></span> : <CheckOne />}
                            保存
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
