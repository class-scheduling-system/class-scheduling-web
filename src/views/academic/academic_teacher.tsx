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
 * 本软件是“按原样”提供的，没有任何形式的明示或暗示的保证，包括但不限于
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

import {JSX, useEffect, useRef, useState} from "react";
import {SiteInfoEntity} from "../../models/entity/site_info_entity.ts";
import {AddOne, ChartGraph, Delete, EditTwo, PeopleDeleteOne, PreviewOpen, Search} from "@icon-park/react";
import {TeacherAddDTO} from "../../models/dto/teacher_add_dto.ts";
import {AdminAddTeacherDialog} from "../../components/academic/academic_teacher_add_dialog.tsx";
import {GetTeacherListAPI} from "../../apis/teacher_api.ts";
import {message} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {CurrentInfoStore} from "../../models/store/current_info_store.ts";
import {PageEntity} from "../../models/entity/page_entity.ts";
import {TeacherEntity} from "../../models/entity/teacher_entity.ts";
import {PageSearchDTO} from "../../models/dto/page_search_dto.ts";
import {useTransition} from "@react-spring/web";
import {AcademicDeleteTeacherDialog} from "../../components/academic/academic_teacher_delete_dialog.tsx";
import { AcademicEditTeacherDialog } from "../../components/academic/academic_teacher_edit_dialog.tsx";

export function AcademicTeacher({site}: Readonly<{
    site: SiteInfoEntity
}>) {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isDescending, setIsDescending] = useState(true);
    const [showStats, setShowStats] = useState(false);
    const inputFocus = useRef<HTMLInputElement | null>(null);

    const dispatch = useDispatch();
    const getCurrent = useSelector((state: { current: CurrentInfoStore }) => state.current);
    const inputFocus = useRef<HTMLInputElement | null>(null);

    const [teacherList, setTeacherList] = useState<PageEntity<TeacherEntity>>({
        records: new Array(5).fill({}) as TeacherEntity[],
    } as PageEntity<TeacherEntity>);
    const [searchRequest, setSearchRequest] = useState<PageSearchDTO>({
        page: 1,
        size: 20,
        is_desc: true,
    } as PageSearchDTO);
    const [search, setSearch] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [dialogAdd, setDialogAdd] = useState<boolean>(false);
    const [dialogDelete, setDialogDelete] = useState<boolean>(false);
    // 删除用户相关状态
    const [deleteTeacherUuid, setDeleteTeacherUuid] = useState("");
    const [dialogEdit, setDialogEdit] = useState<boolean>(false);
    const [editTeacherUuid, setEditTeacherUuid] = useState("");
    // 新增状态：保存编辑时对应的用户数据
    const [editTeacherData, setEditTeacherData] = useState<TeacherAddDTO | null>(null);



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
        const func = async () => {
            const getResp = await GetTeacherListAPI(searchRequest);
            if (getResp?.output === "Success") {
                setLoading(false);
                setTeacherList(getResp.data!);
            } else {
                console.log(getResp);
                message.error(getResp?.error_message ?? "获取用户列表失败");
            }
        };
        func().then();
    }, [dispatch, searchRequest]);

    const transitionSearch = useTransition(loading ?? 0, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        config: { duration: 100 },
    });

    // 定义刷新用户列表的方法
    const refreshTeacherList = async () => {
        setLoading(true);
        const getResp = await GetTeacherListAPI(searchRequest);
        if (getResp?.output === "Success") {
            setTeacherList(getResp.data!);
        } else {
            message.error(getResp?.error_message ?? "获取用户列表失败");
        }
        setLoading(false);
    };

    // 模拟教师数据
    const [teachers] = useState([
        { id: 1, name: "张教授", gender: "男", title: "教授", department: "计算机学院", phone: "13812345678", email: "zhang@example.com", status: "在职" },
        { id: 2, name: "李教授", gender: "女", title: "教授", department: "计算机学院", phone: "13812345679", email: "li@example.com", status: "在职" },
        { id: 3, name: "王教授", gender: "男", title: "副教授", department: "计算机学院", phone: "13812345680", email: "wang@example.com", status: "在职" },
        { id: 4, name: "刘教授", gender: "男", title: "副教授", department: "计算机学院", phone: "13812345681", email: "liu@example.com", status: "在职" },
        { id: 5, name: "陈教授", gender: "女", title: "讲师", department: "电子工程学院", phone: "13812345682", email: "chen@example.com", status: "在职" },
        { id: 6, name: "张副教授", gender: "男", title: "副教授", department: "电子工程学院", phone: "13812345683", email: "zhang2@example.com", status: "在职" },
        { id: 7, name: "吴教授", gender: "男", title: "教授", department: "自动化学院", phone: "13812345684", email: "wu@example.com", status: "休假" },
        { id: 8, name: "赵讲师", gender: "女", title: "讲师", department: "自动化学院", phone: "13812345685", email: "zhao@example.com", status: "在职" }
    ]);

    useEffect(() => {
        document.title = `教师管理 | ${site.name ?? "Frontleaves Technology"}`;
    }, [site.name]);

    // 计算教师统计数据
    const teacherStats = {
        total: teachers.length,
        byTitle: {
            professor: teachers.filter(t => t.title === "教授").length,
            associateProf: teachers.filter(t => t.title === "副教授").length,
            lecturer: teachers.filter(t => t.title === "讲师").length
        },
        byDepartment: {
            "计算机学院": teachers.filter(t => t.department === "计算机学院").length,
            "电子工程学院": teachers.filter(t => t.department === "电子工程学院").length,
            "自动化学院": teachers.filter(t => t.department === "自动化学院").length
        },
        byStatus: {
            active: teachers.filter(t => t.status === "在职").length,
            onLeave: teachers.filter(t => t.status === "休假").length
        }
    };

    // 筛选教师
    const filteredTeachers = teachers.filter(
        teacher => teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 teacher.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 teacher.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 使用排序方向重新排序
    let sortedTeachers = [...filteredTeachers];
    if (isDescending) {
        sortedTeachers.sort((a, b) => b.id - a.id); // 降序
    } else {
        sortedTeachers.sort((a, b) => a.id - b.id); // 升序
    }

    function getPageInfo(): JSX.Element[] {
        const pageInfo: JSX.Element[] = [];
        for (let i = 0; i < Math.ceil(userList.total / userList.size); i++) {
            if (i + 1 === userList.current) {
                pageInfo.push(
                    <button key={i} className="transition shadow btn btn-sm join-item btn-primary border">
                        {i + 1}
                    </button>
                );
            } else {
                pageInfo.push(
                    <button key={i}
                            onClick={() => setSearchRequest({ ...searchRequest, page: i + 1 })}
                            className="transition shadow btn btn-sm join-item border">
                        {i + 1}
                    </button>
                );
            }
        }
        return pageInfo;
    }

    // 搜索防抖动
    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            setSearchRequest({ ...searchRequest, keyword: search });
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);


    return (
        <>
            <div className="space-y-6 w-full">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <PeopleDeleteOne theme="outline" size="24" />
                        教师管理
                    </h1>

                    <div className="flex gap-2">
                        <button
                            className="btn btn-outline btn-info flex items-center gap-1"
                            onClick={() => setShowStats(!showStats)}
                        >
                            <ChartGraph theme="outline" size="18" />
                            {showStats ? "隐藏统计" : "显示统计"}
                        </button>

                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                            <Search theme="outline" size="18" />
                        </div>
                        <input
                            ref={inputFocus}
                            type="text"
                            placeholder="搜索教师..."
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

                        <button className="btn btn-primary flex items-center gap-1">
                            <AddOne theme="outline" size="18" />
                            <span className="hidden sm:inline">添加教师</span>
                            <span className="sm:hidden">添加</span>
                        </button>
                    </div>
                </div>

                {/* 统计信息卡片 */}
                {showStats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="card bg-base-100 shadow-md">
                            <div className="card-body">
                                <h3 className="card-title text-lg">教师总数</h3>
                                <p className="text-3xl font-bold text-primary">{teacherStats.total}</p>
                            </div>
                        </div>

                        <div className="card bg-base-100 shadow-md">
                            <div className="card-body">
                                <h3 className="card-title text-lg">职称分布</h3>
                                <div className="grid grid-cols-3 gap-2 text-center">
                                    <div>
                                        <div className="badge badge-primary">{teacherStats.byTitle.professor}</div>
                                        <p className="text-sm mt-1">教授</p>
                                    </div>
                                    <div>
                                        <div className="badge badge-secondary">{teacherStats.byTitle.associateProf}</div>
                                        <p className="text-sm mt-1">副教授</p>
                                    </div>
                                    <div>
                                        <div className="badge badge-accent">{teacherStats.byTitle.lecturer}</div>
                                        <p className="text-sm mt-1">讲师</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card bg-base-100 shadow-md">
                            <div className="card-body">
                                <h3 className="card-title text-lg">院系分布</h3>
                                <div className="space-y-1">
                                    {Object.entries(teacherStats.byDepartment).map(([dept, count]) => (
                                        <div key={dept} className="flex justify-between">
                                            <span>{dept}:</span>
                                            <span className="font-semibold">{count}人</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="card bg-base-100 shadow-md">
                            <div className="card-body">
                                <h3 className="card-title text-lg">状态分布</h3>
                                <div className="grid grid-cols-2 gap-4 text-center">
                                    <div>
                                        <div className="radial-progress text-success" style={{"--value": (teacherStats.byStatus.active / teacherStats.total) * 100} as any}>
                                            {teacherStats.byStatus.active}
                                        </div>
                                        <p className="text-sm mt-2">在职</p>
                                    </div>
                                    <div>
                                        <div className="radial-progress text-warning" style={{"--value": (teacherStats.byStatus.onLeave / teacherStats.total) * 100} as any}>
                                            {teacherStats.byStatus.onLeave}
                                        </div>
                                        <p className="text-sm mt-2">休假</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="card bg-base-100 shadow-md overflow-hidden">
                    <div className="card-body p-0">
                        <div className="overflow-x-auto overflow-hidden">
                            <table className="table table-zebra">
                                <thead className="bg-base-200">
                                    <tr>
                                        <th>姓名</th>
                                        <th>性别</th>
                                        <th>职称</th>
                                        <th>所属院系</th>
                                        <th>联系电话</th>
                                        <th>电子邮箱</th>
                                        <th>状态</th>
                                        <th>操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map(teacher => (
                                        <tr key={teacher.id}>
                                            <td>{teacher.name}</td>
                                            <td>{teacher.gender}</td>
                                            <td>{teacher.title}</td>
                                            <td>{teacher.department}</td>
                                            <td>{teacher.phone}</td>
                                            <td>{teacher.email}</td>
                                            <td>
                                                <div className={`badge ${teacher.status === '在职' ? 'badge-success' : 'badge-warning'}`}>
                                                    {teacher.status}
                                                </div>
                                            </td>
                                            <td className="space-x-1">
                                                <button className="btn btn-xs btn-primary" title="查看">
                                                    <PreviewOpen theme="outline" size="16" />
                                                </button>
                                                <button className="btn btn-xs btn-warning" title="编辑">
                                                    <EditTwo theme="outline" size="16" />
                                                </button>
                                                <button className="btn btn-xs btn-error" title="删除">
                                                    <Delete theme="outline" size="16" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center">
                    <div className={"join join-horizontal"}>
                        <button className="transition shadow btn btn-sm join-item border"
                                onClick={() => setSearchRequest({ ...searchRequest, page: userList.current - 1 })}
                                disabled={userList.current === 1}>
                            上一页
                        </button>
                        {getPageInfo()}
                        <button className="transition shadow btn btn-sm join-item border"
                                onClick={() => setSearchRequest({ ...searchRequest, page: userList.current + 1 })}
                                disabled={userList.current === Math.ceil(userList.total / userList.size)}>
                            下一页
                        </button>
                        <select className="join-item transition select select-sm mx-1 border-l-0"
                                value={searchRequest.size}
                                onChange={(e) => setSearchRequest({ ...searchRequest, size: Number(e.target.value) })}>
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={15}>15</option>
                            <option value={20}>20</option>
                            <option value={30}>30</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>
                </div>
            </div>
        {/* 删除用户对话框 */}
        <AcademicDeleteTeacherDialog
            show={dialogDelete}
            emit={setDialogDelete}
            userUuid={deleteTeacherUuid}
            onDeletedSuccess={refreshTeacherList}
        />
        <AdminAddTeacherDialog
            show={dialogAdd}
            emit={setDialogAdd}
            onAddSuccess={refreshTeacherList}
        />

        <AcademicEditTeacherDialog
            show={dialogEdit}
            emit={setDialogEdit}
            userUuid={editTeacherUuid}
            defaultData={editTeacherData}
            onEditSuccess={refreshTeacherList}
        />
    </>
    );
}
