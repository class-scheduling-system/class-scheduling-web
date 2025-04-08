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

import { useEffect, useState } from "react";
import { SiteInfoEntity } from "@/models/entity/site_info_entity";
import { 
    ArrowLeft, Book, EditTwo, School 
} from "@icon-park/react";
import { useNavigate, useParams } from "react-router";
import { message, Skeleton } from "antd";
import { CourseLibraryEntity } from "@/models/entity/course_library_entity";
import { GetCourseAPI } from "@/apis/course_api";
import { DepartmentEntity } from "@/models/entity/department_entity";
import { GetDepartmentListAPI } from "@/apis/department_api";
import { GetCourseTypeListAPI } from "@/apis/course_type_api";
import { CourseTypeEntity } from "@/models/entity/course_type_entity";
import { GetCourseCategoryListAPI } from "@/apis/course_category_api";
import { GetCoursePropertyListAPI } from "@/apis/course_property_api";
import { GetCourseNatureListAPI } from "@/apis/course_nature_api";
import { CourseCategoryEntity } from "@/models/entity/course_category_entity";
import { CoursePropertyEntity } from "@/models/entity/course_property_entity";
import { CourseNatureEntity } from "@/models/entity/course_nature_entity";

/**
 * # 课程详情查看页面
 * > 显示课程的详细信息，包括基本信息、课时信息、教室要求等
 * 
 * @param site 站点信息
 * @returns 课程详情查看页面组件
 */
export function AcademicCourseView({ site }: Readonly<{ site: SiteInfoEntity }>) {
    const navigate = useNavigate();
    const { courseId } = useParams<{ courseId: string }>();
    const [loading, setLoading] = useState(true);
    const [course, setCourse] = useState<CourseLibraryEntity | null>(null);
    const [departments, setDepartments] = useState<DepartmentEntity[]>([]);
    const [courseTypes, setCourseTypes] = useState<CourseTypeEntity[]>([]);
    const [courseCategories, setCourseCategories] = useState<CourseCategoryEntity[]>([]);
    const [courseProperties, setCourseProperties] = useState<CoursePropertyEntity[]>([]);
    const [courseNatures, setCourseNatures] = useState<CourseNatureEntity[]>([]);

    // 设置页面标题
    useEffect(() => {
        document.title = `课程详情 | ${site.name ?? "Frontleaves Technology"}`;
    }, [site.name]);

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
            }
        };

        fetchDepartments();
    }, []);

    // 获取课程类型列表
    useEffect(() => {
        const fetchCourseTypes = async () => {
            try {
                const response = await GetCourseTypeListAPI();
                if (response?.output === "Success" && response.data) {
                    setCourseTypes(response.data);
                } else {
                    message.error(response?.error_message || "获取课程类型列表失败");
                }
            } catch (error) {
                console.error("获取课程类型数据失败:", error);
            }
        };

        fetchCourseTypes();
    }, []);

    // 获取课程类别列表
    useEffect(() => {
        const fetchCourseCategories = async () => {
            try {
                const response = await GetCourseCategoryListAPI();
                if (response?.output === "Success" && response.data) {
                    setCourseCategories(response.data);
                }
            } catch (error) {
                console.error("获取课程类别数据失败:", error);
            }
        };

        fetchCourseCategories();
    }, []);

    // 获取课程属性列表
    useEffect(() => {
        const fetchCourseProperties = async () => {
            try {
                const response = await GetCoursePropertyListAPI();
                if (response?.output === "Success" && response.data) {
                    setCourseProperties(response.data);
                }
            } catch (error) {
                console.error("获取课程属性数据失败:", error);
            }
        };

        fetchCourseProperties();
    }, []);

    // 获取课程性质列表
    useEffect(() => {
        const fetchCourseNatures = async () => {
            try {
                const response = await GetCourseNatureListAPI();
                if (response?.output === "Success" && response.data) {
                    setCourseNatures(response.data);
                }
            } catch (error) {
                console.error("获取课程性质数据失败:", error);
            }
        };

        fetchCourseNatures();
    }, []);

    // 获取课程详情
    useEffect(() => {
        const fetchCourse = async () => {
            if (!courseId) return;
            
            setLoading(true);
            try {
                const response = await GetCourseAPI(courseId);
                if (response?.output === "Success" && response.data) {
                    setCourse(response.data);
                } else {
                    message.error(response?.error_message || "获取课程信息失败");
                }
            } catch (error) {
                console.error("获取课程数据失败:", error);
                message.error("获取课程数据失败，请检查网络连接");
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [courseId]);

    // 获取部门名称的函数
    const getDepartmentName = (departmentUuid: string): string => {
        const department = departments.find(dept => dept.department_uuid === departmentUuid);
        return department ? department.department_name || '未知部门' : '未知部门';
    };

    // 获取课程类型名称的函数
    const getCourseTypeName = (courseTypeUuid: string): string => {
        const courseType = courseTypes.find(type => type.course_type_uuid === courseTypeUuid);
        return courseType ? courseType.name || '未知类型' : '未知类型';
    };

    // 获取课程类别名称的函数
    const getCourseCategoryName = (categoryUuid?: string): string => {
        if (!categoryUuid) return '无';
        const category = courseCategories.find(cat => cat.course_category_uuid === categoryUuid);
        return category ? category.name || '未知类别' : '未知类别';
    };

    // 获取课程属性名称的函数
    const getCoursePropertyName = (propertyUuid?: string): string => {
        if (!propertyUuid) return '无';
        const property = courseProperties.find(prop => prop.course_property_uuid === propertyUuid);
        return property ? property.name || '未知属性' : '未知属性';
    };

    // 获取课程性质名称的函数
    const getCourseNatureName = (natureUuid?: string): string => {
        if (!natureUuid) return '无';
        const nature = courseNatures.find(nat => nat.course_nature_uuid === natureUuid);
        return nature ? nature.name || '未知性质' : '未知性质';
    };

    // 时间戳格式化
    const formatTimestamp = (timestamp?: number): string => {
        if (!timestamp) return '未知时间';
        const date = new Date(timestamp * 1000);
        return date.toLocaleString();
    };

    return (
        <div className="space-y-6 w-full">
            {/* 页面标题 */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Book theme="outline" size="24" />
                    课程详情
                </h1>

                <div className="flex gap-2">
                    <button
                        className="btn btn-outline"
                        onClick={() => navigate("/academic/course")}
                    >
                        <ArrowLeft theme="outline" size="18" />
                        返回列表
                    </button>
                    
                    {course && (
                        <button
                            className="btn btn-warning text-white"
                            onClick={() => navigate(`/academic/course/edit/${course.course_library_uuid}`)}
                        >
                            <EditTwo theme="outline" size="18" />
                            编辑课程
                        </button>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="card bg-base-100 shadow-md">
                    <div className="card-body">
                        <Skeleton active paragraph={{ rows: 12 }} />
                    </div>
                </div>
            ) : course ? (
                <div className="space-y-6">
                    {/* 课程基本信息卡片 */}
                    <div className="card bg-base-100 shadow-md overflow-hidden">
                        <div className="bg-primary/10 p-4 flex items-center space-x-2">
                            <Book theme="outline" size="20" className="text-primary"/>
                            <h2 className="card-title text-lg m-0">课程基本信息</h2>
                        </div>

                        <div className="card-body grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <div className="text-sm text-gray-500">课程代码</div>
                                <div className="font-semibold">{course.id}</div>
                            </div>

                            <div className="space-y-1">
                                <div className="text-sm text-gray-500">课程名称</div>
                                <div className="font-semibold">{course.name}</div>
                            </div>

                            <div className="space-y-1">
                                <div className="text-sm text-gray-500">英文名称</div>
                                <div className="font-semibold">{course.english_name || "-"}</div>
                            </div>

                            <div className="space-y-1">
                                <div className="text-sm text-gray-500">所属院系</div>
                                <div className="font-semibold">{getDepartmentName(course.department)}</div>
                            </div>

                            <div className="space-y-1">
                                <div className="text-sm text-gray-500">课程类型</div>
                                <div className="font-semibold">{getCourseTypeName(course.type)}</div>
                            </div>

                            <div className="space-y-1">
                                <div className="text-sm text-gray-500">课程类别</div>
                                <div className="font-semibold">{getCourseCategoryName(course.category)}</div>
                            </div>

                            <div className="space-y-1">
                                <div className="text-sm text-gray-500">课程属性</div>
                                <div className="font-semibold">{getCoursePropertyName(course.property)}</div>
                            </div>

                            <div className="space-y-1">
                                <div className="text-sm text-gray-500">课程性质</div>
                                <div className="font-semibold">{getCourseNatureName(course.nature)}</div>
                            </div>

                            <div className="space-y-1">
                                <div className="text-sm text-gray-500">学分</div>
                                <div className="font-semibold">{course.credit}</div>
                            </div>

                            <div className="space-y-1">
                                <div className="text-sm text-gray-500">状态</div>
                                <div className={`badge ${course.is_enabled ? 'badge-success' : 'badge-error'}`}>
                                    {course.is_enabled ? '启用' : '禁用'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 课时信息卡片 */}
                    <div className="card bg-base-100 shadow-md overflow-hidden">
                        <div className="bg-info/10 p-4 flex items-center space-x-2">
                            <School theme="outline" size="20" className="text-info"/>
                            <h2 className="card-title text-lg m-0">课时信息</h2>
                        </div>

                        <div className="card-body grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <div className="text-sm text-gray-500">总课时</div>
                                <div className="font-semibold">{course.total_hours}</div>
                            </div>

                            <div className="space-y-1">
                                <div className="text-sm text-gray-500">周课时</div>
                                <div className="font-semibold">{course.week_hours}</div>
                            </div>

                            <div className="space-y-1">
                                <div className="text-sm text-gray-500">理论课时</div>
                                <div className="font-semibold">{course.theory_hours}</div>
                            </div>

                            <div className="space-y-1">
                                <div className="text-sm text-gray-500">实验课时</div>
                                <div className="font-semibold">{course.experiment_hours}</div>
                            </div>

                            <div className="space-y-1">
                                <div className="text-sm text-gray-500">实践课时</div>
                                <div className="font-semibold">{course.practice_hours}</div>
                            </div>

                            <div className="space-y-1">
                                <div className="text-sm text-gray-500">上机课时</div>
                                <div className="font-semibold">{course.computer_hours}</div>
                            </div>

                            <div className="space-y-1">
                                <div className="text-sm text-gray-500">其他课时</div>
                                <div className="font-semibold">{course.other_hours}</div>
                            </div>
                        </div>
                    </div>

                    {/* 教室要求卡片 */}
                    <div className="card bg-base-100 shadow-md overflow-hidden">
                        <div className="bg-success/10 p-4 flex items-center space-x-2">
                            <School theme="outline" size="20" className="text-success"/>
                            <h2 className="card-title text-lg m-0">教室要求</h2>
                        </div>

                        <div className="card-body grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <div className="text-sm text-gray-500">理论教室类型</div>
                                <div className="font-semibold">{course.theory_classroom_type || "无特殊要求"}</div>
                            </div>

                            <div className="space-y-1">
                                <div className="text-sm text-gray-500">实验教室类型</div>
                                <div className="font-semibold">{course.experiment_classroom_type || "无特殊要求"}</div>
                            </div>

                            <div className="space-y-1">
                                <div className="text-sm text-gray-500">实践教室类型</div>
                                <div className="font-semibold">{course.practice_classroom_type || "无特殊要求"}</div>
                            </div>

                            <div className="space-y-1">
                                <div className="text-sm text-gray-500">上机教室类型</div>
                                <div className="font-semibold">{course.computer_classroom_type || "无特殊要求"}</div>
                            </div>
                        </div>
                    </div>

                    {/* 课程描述卡片 */}
                    {course.description && (
                        <div className="card bg-base-100 shadow-md overflow-hidden">
                            <div className="bg-warning/10 p-4 flex items-center space-x-2">
                                <Book theme="outline" size="20" className="text-warning"/>
                                <h2 className="card-title text-lg m-0">课程描述</h2>
                            </div>

                            <div className="card-body">
                                <p className="whitespace-pre-wrap">{course.description}</p>
                            </div>
                        </div>
                    )}

                    {/* 附加信息卡片 */}
                    <div className="card bg-base-100 shadow-md overflow-hidden">
                        <div className="bg-gray-100 p-4 flex items-center space-x-2">
                            <Book theme="outline" size="20" className="text-gray-500"/>
                            <h2 className="card-title text-lg m-0">附加信息</h2>
                        </div>

                        <div className="card-body grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <div className="text-sm text-gray-500">创建时间</div>
                                <div className="font-semibold">{formatTimestamp(course.created_at)}</div>
                            </div>

                            <div className="space-y-1">
                                <div className="text-sm text-gray-500">上次更新</div>
                                <div className="font-semibold">{formatTimestamp(course.updated_at)}</div>
                            </div>

                            {course.edit_user && (
                                <div className="space-y-1">
                                    <div className="text-sm text-gray-500">编辑用户</div>
                                    <div className="font-semibold">{course.edit_user}</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="card bg-base-100 shadow-md">
                    <div className="card-body text-center">
                        <p className="text-gray-500">未找到课程信息</p>
                        <button 
                            className="btn btn-primary btn-sm mt-4 w-fit mx-auto"
                            onClick={() => navigate("/academic/course")}
                        >
                            返回课程列表
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
} 