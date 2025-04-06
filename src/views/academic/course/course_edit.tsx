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
import { useNavigate, useParams } from "react-router";
import { Button, Form, Input, InputNumber, message, Select, Switch } from "antd";
import { CourseLibraryDTO } from "../../../models/dto/course_library_dto";
import { GetCourseAPI, UpdateCourseAPI } from "../../../apis/course_api";
import { CardComponent } from "../../../components/card_component";
import { GetDepartmentListAPI } from "../../../apis/department_api";
import { DepartmentEntity } from "../../../models/entity/department_entity";
import { CourseLibraryEntity } from "../../../models/entity/course_library_entity";

/**
 * # 教务课程编辑页面
 * > 用于编辑现有课程信息
 * 
 * @param site 站点信息
 * @returns 课程编辑页面组件
 */
export function AcademicCourseEdit({ site }: Readonly<{ site: SiteInfoEntity }>) {
    const navigate = useNavigate();
    const { course_uuid } = useParams<{ course_uuid: string }>();
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [departments, setDepartments] = useState<DepartmentEntity[]>([]);
    const [courseData, setCourseData] = useState<CourseLibraryEntity | null>(null);

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
        document.title = `编辑课程 | ${site.name ?? "Frontleaves Technology"}`;
    }, [site.name]);

    // 获取课程信息
    useEffect(() => {
        const fetchCourseInfo = async () => {
            if (!course_uuid) return;
            
            setLoading(true);
            try {
                const response = await GetCourseAPI(course_uuid);
                if (response?.output === "Success" && response.data) {
                    setCourseData(response.data);
                    // 设置表单初始值
                    const formInitialValues = {
                        ...response.data
                    };
                    form.setFieldsValue(formInitialValues);
                    setFormData(formInitialValues);
                } else {
                    message.error(response?.error_message || "获取课程信息失败");
                    navigate("/academic/course");
                }
            } catch (error) {
                console.error("获取课程信息失败:", error);
                message.error("获取课程信息失败，请检查网络连接");
                navigate("/academic/course");
            } finally {
                setLoading(false);
            }
        };

        fetchCourseInfo();
    }, [course_uuid, form, navigate]);

    // 获取部门列表
    useEffect(() => {
        const fetchDepartments = async () => {
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
    const handleSubmit = async () => {
        if (!course_uuid) return;

        try {
            await form.validateFields();
            
            setSubmitting(true);
            const totalHours = calculateTotalHours();
            const submissionData = {
                ...formData,
                total_hours: totalHours
            };

            const response = await UpdateCourseAPI(course_uuid, submissionData);
            if (response?.output === "Success") {
                message.success("课程更新成功");
                navigate("/academic/course");
            } else {
                message.error(response?.error_message || "更新课程失败");
            }
        } catch (error) {
            console.error("表单验证或提交失败:", error);
            message.error("表单验证失败，请检查输入内容");
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

    return (
        <div className="space-y-6 w-full">
            {/* 顶部导航 */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <Button 
                        icon={<ArrowLeft />} 
                        onClick={() => navigate("/academic/course")}
                    >
                        返回列表
                    </Button>
                    <h2 className="text-2xl font-bold">编辑课程</h2>
                </div>
                
                <div className="flex gap-2">
                    <Button 
                        danger 
                        icon={<CloseOne />}
                        onClick={() => navigate("/academic/course")}
                    >
                        取消
                    </Button>
                    <Button 
                        type="primary" 
                        icon={<CheckOne />} 
                        onClick={handleSubmit}
                        loading={submitting}
                    >
                        保存
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-8">
                    <span className="loading loading-spinner loading-lg"></span>
                    <p>加载中...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {/* 课程信息卡片 */}
                    <CardComponent>
                        <div className="bg-primary/10 p-4 flex items-center space-x-2 mb-4">
                            <Book theme="outline" size="20" className="text-primary"/>
                            <h2 className="card-title text-lg m-0">课程基本信息</h2>
                        </div>

                        <Form
                            form={form}
                            layout="vertical"
                            initialValues={courseData || {}}
                            onValuesChange={(_, values) => setFormData(values)}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Form.Item 
                                    name="id" 
                                    label="课程代码" 
                                    rules={[{ required: true, message: "请输入课程代码" }]}
                                >
                                    <Input placeholder="请输入课程代码，如CS101" />
                                </Form.Item>

                                <Form.Item 
                                    name="name" 
                                    label="课程名称" 
                                    rules={[{ required: true, message: "请输入课程名称" }]}
                                >
                                    <Input placeholder="请输入课程名称" />
                                </Form.Item>

                                <Form.Item 
                                    name="english_name" 
                                    label="课程英文名称"
                                >
                                    <Input placeholder="请输入课程英文名称" />
                                </Form.Item>

                                <Form.Item 
                                    name="department" 
                                    label="所属院系" 
                                    rules={[{ required: true, message: "请选择所属院系" }]}
                                >
                                    <Select 
                                        placeholder="请选择所属院系"
                                        options={departments.map(dept => ({ 
                                            label: dept.department_name, 
                                            value: dept.department_uuid 
                                        }))}
                                    />
                                </Form.Item>

                                <Form.Item 
                                    name="type" 
                                    label="课程类型" 
                                    rules={[{ required: true, message: "请选择课程类型" }]}
                                >
                                    <Select 
                                        placeholder="请选择课程类型"
                                        options={courseTypeOptions}
                                    />
                                </Form.Item>

                                <Form.Item 
                                    name="credit" 
                                    label="学分" 
                                    rules={[{ required: true, message: "请输入学分" }]}
                                >
                                    <InputNumber 
                                        min={0} 
                                        max={10} 
                                        step={0.5} 
                                        style={{ width: '100%' }} 
                                        placeholder="请输入学分"
                                    />
                                </Form.Item>

                                <Form.Item 
                                    name="is_enabled" 
                                    label="是否启用" 
                                    valuePropName="checked"
                                >
                                    <Switch />
                                </Form.Item>
                            </div>
                        </Form>
                    </CardComponent>

                    {/* 课时信息卡片 */}
                    <CardComponent>
                        <div className="bg-primary/10 p-4 flex items-center space-x-2 mb-4">
                            <School theme="outline" size="20" className="text-primary"/>
                            <h2 className="card-title text-lg m-0">课时设置</h2>
                        </div>

                        <Form
                            form={form}
                            layout="vertical"
                            initialValues={courseData || {}}
                            onValuesChange={(_, values) => setFormData(values)}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Form.Item 
                                    name="week_hours" 
                                    label="周课时" 
                                    rules={[{ required: true, message: "请输入周课时" }]}
                                >
                                    <InputNumber min={0} style={{ width: '100%' }} placeholder="请输入周课时" />
                                </Form.Item>

                                <div className="flex items-center bg-base-200 p-4 rounded-lg">
                                    <span className="text-lg font-semibold">总课时: {calculateTotalHours()}</span>
                                </div>

                                <Form.Item 
                                    name="theory_hours" 
                                    label="理论课时"
                                >
                                    <InputNumber min={0} style={{ width: '100%' }} placeholder="请输入理论课时" />
                                </Form.Item>

                                <Form.Item 
                                    name="experiment_hours" 
                                    label="实验课时"
                                >
                                    <InputNumber min={0} style={{ width: '100%' }} placeholder="请输入实验课时" />
                                </Form.Item>

                                <Form.Item 
                                    name="practice_hours" 
                                    label="实践课时"
                                >
                                    <InputNumber min={0} style={{ width: '100%' }} placeholder="请输入实践课时" />
                                </Form.Item>

                                <Form.Item 
                                    name="computer_hours" 
                                    label="上机课时"
                                >
                                    <InputNumber min={0} style={{ width: '100%' }} placeholder="请输入上机课时" />
                                </Form.Item>

                                <Form.Item 
                                    name="other_hours" 
                                    label="其他课时"
                                >
                                    <InputNumber min={0} style={{ width: '100%' }} placeholder="请输入其他课时" />
                                </Form.Item>
                            </div>
                        </Form>
                    </CardComponent>

                    {/* 教室需求卡片 */}
                    <CardComponent>
                        <div className="bg-primary/10 p-4 flex items-center space-x-2 mb-4">
                            <School theme="outline" size="20" className="text-primary"/>
                            <h2 className="card-title text-lg m-0">教室需求</h2>
                        </div>

                        <Form
                            form={form}
                            layout="vertical"
                            initialValues={courseData || {}}
                            onValuesChange={(_, values) => setFormData(values)}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Form.Item 
                                    name="theory_classroom_type" 
                                    label="理论教室类型"
                                >
                                    <Input placeholder="请输入理论教室类型需求" />
                                </Form.Item>

                                <Form.Item 
                                    name="experiment_classroom_type" 
                                    label="实验教室类型"
                                >
                                    <Input placeholder="请输入实验教室类型需求" />
                                </Form.Item>

                                <Form.Item 
                                    name="practice_classroom_type" 
                                    label="实践教室类型"
                                >
                                    <Input placeholder="请输入实践教室类型需求" />
                                </Form.Item>

                                <Form.Item 
                                    name="computer_classroom_type" 
                                    label="上机教室类型"
                                >
                                    <Input placeholder="请输入上机教室类型需求" />
                                </Form.Item>
                            </div>
                        </Form>
                    </CardComponent>

                    {/* 备注信息卡片 */}
                    <CardComponent>
                        <div className="bg-primary/10 p-4 flex items-center space-x-2 mb-4">
                            <School theme="outline" size="20" className="text-primary"/>
                            <h2 className="card-title text-lg m-0">备注信息</h2>
                        </div>

                        <Form
                            form={form}
                            layout="vertical"
                            initialValues={courseData || {}}
                            onValuesChange={(_, values) => setFormData(values)}
                        >
                            <Form.Item 
                                name="description" 
                                label="课程描述"
                            >
                                <Input.TextArea rows={4} />
                            </Form.Item>
                        </Form>
                    </CardComponent>
                </div>
            )}
        </div>
    );
}