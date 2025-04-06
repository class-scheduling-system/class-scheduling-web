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

import { useEffect, useRef, useState } from "react";
import { SiteInfoEntity } from "@/models/entity/site_info_entity";
import { AddOne, Book, Delete, EditTwo, PreviewOpen, Search } from "@icon-park/react";
import { useNavigate } from "react-router";
import { message, Modal, Tooltip } from "antd";
import { CourseLibraryEntity } from "@/models/entity/course_library_entity";
import { DeleteCourseAPI, GetCoursePageAPI } from "@/apis/course_api";
import { PageSearchDTO } from "@/models/dto/page/page_search_dto";
import { DepartmentEntity } from "@/models/entity/department_entity";
import { GetDepartmentListAPI } from "@/apis/department_api";

/**
 * # 教务课程管理列表页
 * > 显示课程列表，提供搜索、筛选、分页和操作功能
 * 
 * @param site 站点信息
 * @returns 课程管理列表页面组件
 */
export function AcademicCourse({ site }: Readonly<{ site: SiteInfoEntity }>) {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isDescending, setIsDescending] = useState(true);
    const [loading, setLoading] = useState(true);
    const [totalItems, setTotalItems] = useState(0);
    const [courses, setCourses] = useState<CourseLibraryEntity[]>([]);
    const [departments, setDepartments] = useState<DepartmentEntity[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<CourseLibraryEntity | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const inputFocus = useRef<HTMLInputElement | null>(null);

    // 键盘快捷键Focus搜索框
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.ctrlKey && event.key === "k") {
                event.preventDefault();
                inputFocus.current?.focus();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    // 设置页面标题
    useEffect(() => {
        document.title = `课程管理 | ${site.name ?? "Frontleaves Technology"}`;
    }, [site.name]);

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
            }
        };

        fetchDepartments();
    }, []);

    // 获取部门名称的函数
    const getDepartmentName = (departmentUuid: string): string => {
        const department = departments.find(dept => dept.department_uuid === departmentUuid);
        return department ? department.department_name || '未知部门' : '未知部门';
    };

    // 获取课程数据
    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            try {
                const params: PageSearchDTO = {
                    page: currentPage,
                    size: itemsPerPage,
                    keyword: searchTerm || undefined,
                    is_desc: isDescending,
                };

                const response = await GetCoursePageAPI(params);
                if (response?.output === "Success" && response.data) {
                    setCourses(response.data.records);
                    setTotalItems(response.data.total);
                } else {
                    message.error(response?.error_message || "获取课程列表失败");
                }
            } catch (error) {
                console.error("获取课程数据失败:", error);
                message.error("获取课程数据失败，请检查网络连接");
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [currentPage, itemsPerPage, searchTerm, isDescending]);

    // 处理删除课程
    const handleDelete = async () => {
        if (!selectedCourse) return;
        
        try {
            const response = await DeleteCourseAPI(selectedCourse.course_library_uuid!);
            if (response?.output === "Success") {
                message.success("课程删除成功");
                // 重新加载数据
                const updatedPage = courses.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
                setCurrentPage(updatedPage);
                setShowDeleteModal(false);
            } else {
                message.error(response?.error_message || "删除课程失败");
            }
        } catch (error) {
            console.error("删除课程失败:", error);
            message.error("删除课程失败，请稍后再试");
        }
    };

    // 处理页码变更
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    // 计算总页数
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return (
        <div className="space-y-6 w-full">
            {/* 页面头部 - 标题和操作按钮 */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Book theme="outline" size="24" />
                    课程管理
                </h1>

                <div className="flex gap-2">
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                            <Search theme="outline" size="18" />
                        </div>
                        <input
                            ref={inputFocus}
                            type="text"
                            placeholder="搜索课程..."
                            className="input input-bordered pl-10 pr-16"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1); // 重置页码
                            }}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                            <kbd className="kbd kbd-sm">Ctrl</kbd>
                            <span className="mx-1">+</span>
                            <kbd className="kbd kbd-sm">K</kbd>
                        </div>
                    </div>

                    <button 
                        className="btn btn-primary flex items-center gap-1"
                        onClick={() => navigate("/academic/course/add")}
                    >
                        <AddOne theme="outline" size="18" />
                        <span className="hidden sm:inline">添加课程</span>
                        <span className="sm:hidden">添加</span>
                    </button>
                </div>
            </div>

            {/* 课程列表卡片 */}
            <div className="card bg-base-100 shadow-md overflow-hidden">
                <div className="card-body p-0">
                    {loading ? (
                        <div className="p-8 text-center">
                            <span className="loading loading-spinner loading-lg"></span>
                            <p className="mt-2">加载中...</p>
                        </div>
                    ) : courses.length === 0 ? (
                        <div className="p-8 text-center">
                            <p className="text-gray-500">暂无课程数据</p>
                            {searchTerm && (
                                <p className="text-sm text-gray-400 mt-2">
                                    找不到与 "{searchTerm}" 相关的课程，请尝试其他关键词
                                </p>
                            )}
                            <button 
                                className="btn btn-primary btn-sm mt-4"
                                onClick={() => navigate("/academic/course/add")}
                            >
                                <AddOne theme="outline" size="16" /> 添加新课程
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto overflow-hidden">
                            <table className="table table-zebra">
                                <thead className="bg-base-200">
                                    <tr>
                                        <th>课程代码</th>
                                        <th>课程名称</th>
                                        <th>学分</th>
                                        <th>所属院系</th>
                                        <th>课程类型</th>
                                        <th>状态</th>
                                        <th>操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courses.map(course => (
                                        <tr key={course.course_library_uuid}>
                                            <td>{course.id}</td>
                                            <td>
                                                <Tooltip title={course.english_name}>
                                                    <span>{course.name}</span>
                                                </Tooltip>
                                            </td>
                                            <td>{course.credit}</td>
                                            <td>{getDepartmentName(course.department)}</td>
                                            <td>{course.type}</td>
                                            <td>
                                                <div className={`badge ${course.is_enabled ? 'badge-success' : 'badge-error'}`}>
                                                    {course.is_enabled ? '启用' : '禁用'}
                                                </div>
                                            </td>
                                            <td className="space-x-1">
                                                <button 
                                                    className="btn btn-xs btn-primary" 
                                                    title="查看详情"
                                                    onClick={() => navigate(`/academic/course/view/${course.course_library_uuid}`)}
                                                >
                                                    <PreviewOpen theme="outline" size="16" />
                                                </button>
                                                <button 
                                                    className="btn btn-xs btn-warning" 
                                                    title="编辑课程"
                                                    onClick={() => navigate(`/academic/course/edit/${course.course_library_uuid}`)}
                                                >
                                                    <EditTwo theme="outline" size="16" />
                                                </button>
                                                <button 
                                                    className="btn btn-xs btn-error" 
                                                    title="删除课程"
                                                    onClick={() => {
                                                        setSelectedCourse(course);
                                                        setShowDeleteModal(true);
                                                    }}
                                                >
                                                    <Delete theme="outline" size="16" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* 分页控制 */}
            {!loading && courses.length > 0 && (
                <div className="flex justify-center mt-4">
                    <div className="join">
                        <button
                            className="btn btn-sm join-item"
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            上一页
                        </button>

                        {/* 分页按钮，当页数较多时进行省略显示 */}
                        {(() => {
                            const pageButtons = [];
                            const maxVisiblePages = 5; // 最多显示的页码数
                            
                            // 总是显示第一页
                            if (totalPages > 0) {
                                pageButtons.push(
                                    <button
                                        key={1}
                                        className={`join-item btn btn-sm ${currentPage === 1 ? 'btn-active' : ''}`}
                                        onClick={() => handlePageChange(1)}
                                    >
                                        1
                                    </button>
                                );
                            }
                            
                            // 计算需要显示的页码范围
                            let startPage = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2));
                            const endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 3);
                            
                            // 调整startPage，确保显示正确数量的页码
                            if (endPage - startPage < maxVisiblePages - 3 && startPage > 2) {
                                startPage = Math.max(2, endPage - (maxVisiblePages - 3));
                            }
                            
                            // 添加前省略号
                            if (startPage > 2) {
                                pageButtons.push(
                                    <button key="ellipsis1" className="join-item btn btn-sm btn-disabled">...</button>
                                );
                            }
                            
                            // 添加中间页码
                            for (let i = startPage; i <= endPage; i++) {
                                pageButtons.push(
                                    <button
                                        key={i}
                                        className={`join-item btn btn-sm ${currentPage === i ? 'btn-active' : ''}`}
                                        onClick={() => handlePageChange(i)}
                                    >
                                        {i}
                                    </button>
                                );
                            }
                            
                            // 添加后省略号
                            if (endPage < totalPages - 1) {
                                pageButtons.push(
                                    <button key="ellipsis2" className="join-item btn btn-sm btn-disabled">...</button>
                                );
                            }
                            
                            // 总是显示最后一页
                            if (totalPages > 1) {
                                pageButtons.push(
                                    <button
                                        key={totalPages}
                                        className={`join-item btn btn-sm ${currentPage === totalPages ? 'btn-active' : ''}`}
                                        onClick={() => handlePageChange(totalPages)}
                                    >
                                        {totalPages}
                                    </button>
                                );
                            }
                            
                            return pageButtons;
                        })()}

                        <button
                            className="btn btn-sm join-item"
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            下一页
                        </button>

                        <select
                            className="select select-sm join-item border-l-0"
                            value={itemsPerPage}
                            onChange={(e) => {
                                setItemsPerPage(Number(e.target.value));
                                setCurrentPage(1); // 重置页码
                            }}
                        >
                            <option value={5}>5条/页</option>
                            <option value={10}>10条/页</option>
                            <option value={15}>15条/页</option>
                            <option value={20}>20条/页</option>
                            <option value={50}>50条/页</option>
                        </select>

                        <button
                            className={`btn btn-sm join-item ${isDescending ? 'btn-active' : ''}`}
                            onClick={() => setIsDescending(!isDescending)}
                            title={isDescending ? "当前为降序" : "当前为升序"}
                        >
                            {isDescending ? "↓" : "↑"}
                        </button>
                    </div>
                </div>
            )}

            {/* 删除确认对话框 */}
            <Modal
                title="确认删除"
                open={showDeleteModal}
                onOk={handleDelete}
                onCancel={() => setShowDeleteModal(false)}
                okText="删除"
                cancelText="取消"
                okButtonProps={{ danger: true }}
            >
                <p>确定要删除课程 <strong>{selectedCourse?.name}</strong> 吗？</p>
                <p className="text-red-500 text-sm mt-2">此操作不可恢复，请谨慎操作！</p>
            </Modal>
        </div>
    );
}
