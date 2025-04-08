/*
 * --------------------------------------------------------------------------------
 * Copyright (c) 2022-NOW(至今) 锋楪技术团队
 * Author: 锋楪技术团队 (https://www.frontleaves.com)
 *
 * 本文件包含锋楪技术团队项目的源代码，项目的所有源代码均遵循 MIT 开源许可证协议。
 * --------------------------------------------------------------------------------
 */

import {useEffect, useRef, useState} from "react";
import {SiteInfoEntity} from "../../models/entity/site_info_entity.ts";
import {AddOne, Delete, EditTwo, PreviewOpen, School, Search} from "@icon-park/react";
import {GetAdministrativeClassListAcademicAPI} from "../../apis/administrative_class_api.ts";
import {AdministrativeClassEntity} from "../../models/entity/administrative_class_entity.ts";
import {message} from "antd";
import {PageAdministrativeClassDTO} from "../../models/dto/page/page_administrative_class_dto.ts";
import {DepartmentEntity} from "../../models/entity/department_entity.ts";
import {GetDepartmentListAPI} from "../../apis/department_api.ts";
import {MajorEntity} from "@/models/entity/major_entity.ts";
import {GetMajorListAPI} from "@/apis/major_api.ts";
import {useNavigate} from "react-router";
import { AcademicAdministrativeClassDeleteDialog } from "@/components/academic/academic_administrative_class_delete_dialog";
import { GradeEntity } from "@/models/entity/grade_entity.ts";
import { GetGradeListAPI } from "@/apis/grade_api.ts";
import { GetTeacherListAPI } from "@/apis/teacher_api.ts";
import { TeacherLiteEntity } from "@/models/entity/teacher_lite_entity.ts";

export function AdministrativeClass({site}: Readonly<{
    site: SiteInfoEntity
}>) {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [isDescending] = useState(true);
    const [classes, setClasses] = useState<AdministrativeClassEntity[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const inputFocus = useRef<HTMLInputElement | null>(null);
    const [departments, setDepartments] = useState<DepartmentEntity[]>([]);
    const [majors, setMajors] = useState<MajorEntity[]>([]);
    const [dialogDelete, setDialogDelete] = useState<boolean>(false);
    const [selectedClass, setSelectedClass] = useState<AdministrativeClassEntity | null>(null);
    const [refreshFlag, setRefreshFlag] = useState(0);
    const [grades, setGrades] = useState<GradeEntity[]>([]);
    const [teachers, setTeachers] = useState<TeacherLiteEntity[]>([]);

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

    useEffect(() => {
        document.title = `行政班管理 | ${site.name ?? "Frontleaves Technology"}`;
    }, [site.name]);

    // 获取院系列表
    const fetchDepartments = async () => {
        try {
            const response = await GetDepartmentListAPI();
            if (response?.data) {
                setDepartments(response.data);
            }
        } catch (error) {
            console.error('获取院系列表失败:', error);
            message.error('获取院系列表失败');
        }
    };

    // 获取专业列表
    const fetchMajors = async () => {
        try {
            const response = await GetMajorListAPI();
            if (response?.data) {
                setMajors(response.data);
            }
        } catch (error) {
            console.error('获取专业列表失败:', error);
            message.error('获取专业列表失败');
        }
    };

    // 获取年级列表
    const fetchGrades = async () => {
        try {
            const response = await GetGradeListAPI();
            if (response?.data) {
                setGrades(response.data);
            }
        } catch (error) {
            console.error('获取年级列表失败:', error);
            message.error('获取年级列表失败');
        }
    };

    // 获取教师列表
    const fetchTeachers = async () => {
        try {
            const response = await GetTeacherListAPI();
            if (response?.data) {
                setTeachers(response.data);
            }
        } catch (error) {
            console.error('获取教师列表失败:', error);
            message.error('获取教师列表失败');
        }
    };

    useEffect(() => {
        fetchDepartments();
        fetchMajors();
        fetchGrades();
        fetchTeachers();
    }, []);

    useEffect(() => {
        // 当对话框关闭时，刷新表格数据
        if (!dialogDelete && selectedClass) {
            setRefreshFlag(prev => prev + 1);
            setSelectedClass(null);
        }
    }, [dialogDelete]);

    const fetchClasses = async () => {
        setLoading(true);
        try {
            const params: PageAdministrativeClassDTO = {
                page: currentPage,
                size: itemsPerPage,
                is_desc: isDescending,
                name: searchTerm || undefined
            };
            
            const response = await GetAdministrativeClassListAcademicAPI(params);
            
            if (response?.data) {
                setClasses(response.data.records || []);
                setTotalPages(Math.ceil((response.data.total || 0) / itemsPerPage));
            }
        } catch (error) {
            console.error('获取行政班级列表失败:', error);
            message.error('获取行政班级列表失败');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClasses();
    }, [currentPage, itemsPerPage, isDescending, searchTerm, refreshFlag]);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    // 获取院系名称
    const getDepartmentName = (uuid: string) => {
        const department = departments.find(d => d.department_uuid === uuid);
        return department?.department_name || '-';
    };

    // 获取专业名称
    const getMajorName = (majorUuid: string) => {
        const major = majors.find(m => m.major_uuid === majorUuid);
        return major?.major_name || '-';
    };

    // 获取年级名称
    const getGradeName = (gradeUuid: string) => {
        const grade = grades.find(g => g.grade_uuid === gradeUuid);
        return grade?.name || '-';
    };

    // 获取班主任/辅导员名称
    const getTeacherName = (teacherUuid: string) => {
        const teacher = teachers.find(t => t.teacher_uuid === teacherUuid);
        return teacher?.teacher_name || '-';
    };

    // 打开删除确认对话框
    const handleDeleteClass = (classInfo: AdministrativeClassEntity) => {
        setSelectedClass(classInfo);
        setDialogDelete(true);
    };

    return (
        <div className="space-y-6 w-full">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <School theme="outline" size="24" />
                    行政班管理
                </h1>

                <div className="flex gap-2">
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                            <Search theme="outline" size="18" />
                        </div>
                        <input
                            ref={inputFocus}
                            type="text"
                            placeholder="搜索行政班..."
                            className="input input-bordered pl-10 pr-16"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
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
                        onClick={() => navigate("/academic/administrative-class/add")}
                    >
                        <AddOne theme="outline" size="18" />
                        <span className="hidden sm:inline">添加行政班</span>
                        <span className="sm:hidden">添加</span>
                    </button>
                </div>
            </div>

            <div className="card bg-base-100 shadow-md overflow-hidden">
                <div className="card-body p-0">
                    <div className="overflow-x-auto overflow-hidden">
                        <table className="table table-zebra">
                            <thead className="bg-base-200">
                                <tr>
                                    <th>行政班名称</th>
                                    <th>所属院系</th>
                                    <th>所属专业</th>
                                    <th>年级</th>
                                    <th>班主任</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="text-center">
                                            <span className="loading loading-spinner loading-md"></span>
                                        </td>
                                    </tr>
                                ) : classes.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center">暂无数据</td>
                                    </tr>
                                ) : (
                                    classes.map(cls => (
                                        <tr key={cls.administrative_class_uuid}>
                                            <td>{cls.class_name}</td>
                                            <td>{getDepartmentName(cls.department_uuid)}</td>
                                            <td>{getMajorName(cls.major_uuid)}</td>
                                            <td>{getGradeName(cls.grade_uuid)}</td>
                                            <td>{getTeacherName(cls.counselor_uuid)}</td>
                                            <td className="space-x-1">
                                                <button className="btn btn-xs btn-primary" title="查看">
                                                    <PreviewOpen theme="outline" size="16" />
                                                </button>
                                                <button 
                                                    className="btn btn-xs btn-warning" 
                                                    title="编辑"
                                                    onClick={() => navigate(`/academic/administrative-class/edit/${cls.administrative_class_uuid}`)}
                                                >
                                                    <EditTwo theme="outline" size="16" />
                                                </button>
                                                <button 
                                                    className="btn btn-xs btn-error" 
                                                    title="删除"
                                                    onClick={() => handleDeleteClass(cls)}
                                                >
                                                    <Delete theme="outline" size="16" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* 分页控制 */}
            <div className="flex justify-center mt-4">
                <div className="join">
                    <button
                        className="btn btn-sm join-item"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        上一页
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                        <button
                            key={number}
                            className={`join-item btn btn-sm ${currentPage === number ? 'btn-active' : ''}`}
                            onClick={() => handlePageChange(number)}
                        >
                            {number}
                        </button>
                    ))}

                    <button
                        className="btn btn-sm join-item"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        下一页
                    </button>
                </div>
            </div>

            {/* 删除确认对话框 */}
            {selectedClass && (
                <AcademicAdministrativeClassDeleteDialog
                    show={dialogDelete}
                    emit={setDialogDelete}
                    classUuid={selectedClass.administrative_class_uuid}
                    className={selectedClass.class_name}
                />
            )}
        </div>
    );
} 