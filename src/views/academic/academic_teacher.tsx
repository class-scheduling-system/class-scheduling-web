import {JSX, useEffect, useRef, useState} from "react";
import {SiteInfoEntity} from "../../models/entity/site_info_entity.ts";
import {AddOne, ChartGraph, Delete, EditTwo, PeopleDeleteOne, PreviewOpen, Search} from "@icon-park/react";
import {GetTeacherListAPI} from "../../apis/teacher_api.ts";
import {message} from "antd";
import {PageEntity} from "../../models/entity/page_entity.ts";
import {TeacherEntity} from "../../models/entity/teacher_entity.ts";
import {useTransition} from "@react-spring/web";
import {AcademicDeleteTeacherDialog} from "../../components/academic/academic_teacher_delete_dialog.tsx";


import {GetDepartmentInfoAPI} from "../../apis/department_api.ts";
import {DepartmentInfoEntity} from "../../models/entity/department__info_entity.ts";
import {useNavigate} from "react-router";
import {PageTeacherSearchDto} from "../../models/dto/page_teacher_search_dto.ts"; // 添加 useNavigate


// 扩展TeacherEntity接口，添加departmentName字段
interface TeacherWithDepartment extends TeacherEntity {
    departmentName?: string;
}

export function AcademicTeacher({site}: Readonly<{
    site: SiteInfoEntity
}>) {
    const inputFocus = useRef<HTMLInputElement | null>(null);
    const navigate = useNavigate(); // 使用 useNavigate hook


    const [teacherList, setTeacherList] = useState<PageEntity<TeacherWithDepartment>>({
        records: new Array(5).fill({}) as TeacherWithDepartment[],
        total: 0,
        size: 20,
        current: 1
    } as PageEntity<TeacherWithDepartment>);

    // 缓存已加载的部门信息
    const [departmentCache, setDepartmentCache] = useState<{[key: string]: DepartmentInfoEntity}>({});

    const [searchRequest, setSearchRequest] = useState<PageTeacherSearchDto>({
        page: 1,
        size: 20,
        is_desc: true,
        department:'',
        status:'',
        name:''
    } as PageTeacherSearchDto);

    const [departmentSearch, setDepartmentSearch] = useState<string>("");
    const [statusSearch, setStatusSearch] = useState<string>("");
    const [nameSearch, setNameSearch] = useState<string>("");

    const [loading, setLoading] = useState(true);
    const [dialogDelete, setDialogDelete] = useState<boolean>(false);
    // 删除用户相关状态
    const [deleteTeacherUuid, setDeleteTeacherUuid] = useState("");
    // 统计显示状态
    const [showStats, setShowStats] = useState(false);

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

    // 获取教师列表并获取对应的部门信息
    useEffect(() => {
        const fetchTeacherList = async () => {
            const getResp = await GetTeacherListAPI(searchRequest);
            if (getResp?.output === "Success") {
                const teachers = getResp.data!.records;

                // 创建具有部门名称的教师列表
                const teachersWithDepartment = [...teachers] as TeacherWithDepartment[];

                // 获取每个教师的部门信息
                for (const teacher of teachersWithDepartment) {
                    if (teacher.unit_uuid) {
                        await fetchDepartmentInfo(teacher);
                    }
                }

                setTeacherList({
                    ...getResp.data!,
                    records: teachersWithDepartment
                });
                setLoading(false);
            } else {
                console.log(getResp);
                message.error(getResp?.error_message ?? "获取教师列表失败");
                setLoading(false);
            }
        };
        fetchTeacherList();
    }, [searchRequest]);

    // 获取部门信息
    const fetchDepartmentInfo = async (teacher: TeacherWithDepartment) => {
        // 确保 unit_uuid 存在且非空
        if (!teacher.unit_uuid) {
            return;
        }

        // 检查缓存中是否已有该部门信息
        if (departmentCache[teacher.unit_uuid]) {
            teacher.departmentName = departmentCache[teacher.unit_uuid].department_name;
            return;
        }

        try {
            const deptResp = await GetDepartmentInfoAPI(teacher.unit_uuid);
            if (deptResp?.output === "Success" && deptResp.data) {
                // 更新缓存
                setDepartmentCache(prev => ({
                    ...prev,
                    [teacher.unit_uuid]: deptResp.data
                }));

                // 设置部门名称
                teacher.departmentName = deptResp.data.department_name;
            } else {
                // 设置为未知部门
                teacher.departmentName = "未知部门";
            }
        } catch (error) {
            console.error("获取部门信息失败", error);
            teacher.departmentName = "未知部门";
        }
    };

    const transitionSearch = useTransition(loading ?? 0, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        config: { duration: 100 },
    });

    // 定义刷新教师列表的方法
    const refreshTeacherList = async () => {
        setLoading(true);
        const getResp = await GetTeacherListAPI(searchRequest);
        if (getResp?.output === "Success") {
            const teachers = getResp.data!.records;

            // 创建具有部门名称的教师列表
            const teachersWithDepartment = [...teachers] as TeacherWithDepartment[];

            // 获取每个教师的部门信息
            for (const teacher of teachersWithDepartment) {
                if (teacher.unit_uuid) {
                    await fetchDepartmentInfo(teacher);
                }
            }

            setTeacherList({
                ...getResp.data!,
                records: teachersWithDepartment
            });
        } else {
            message.error(getResp?.error_message ?? "获取教师列表失败");
        }
        setLoading(false);
    };

    useEffect(() => {
        document.title = `教师管理 | ${site.name ?? "Frontleaves Technology"}`;
    }, [site.name]);

    // 计算教师统计数据
    const teacherStats = {
        total: teacherList.total || 0,
        byTitle: {
            professor: teacherList.records.filter(t => t.job_title === "教授").length,
            associateProf: teacherList.records.filter(t => t.job_title === "副教授").length,
            lecturer: teacherList.records.filter(t => t.job_title === "讲师").length
        },
        byStatus: {
            active: teacherList.records.filter(t => t.status === 1).length,
            onLeave: teacherList.records.filter(t => t.status === 0).length
        }
    };

    function getPageInfo(): JSX.Element[] {
        const pageInfo: JSX.Element[] = [];
        for (let i = 0; i < Math.ceil(teacherList.total / teacherList.size); i++) {
            if (i + 1 === teacherList.current) {
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

    // 处理添加教师按钮 - 直接导航到添加教师页面
    const handleAddTeacher = () => {
        navigate("/academic/add-teacher");
    };

    // 处理编辑教师
    // 处理编辑教师
    const handleEditTeacher = (teacher: TeacherEntity) => {
        // 使用路由导航到编辑页面，并传递教师ID和教师信息
        navigate(`/academic/edit-teacher/${teacher.teacher_uuid}`, {
            state: { teacherInfo: teacher }
        });
    };

    // 处理删除教师
    const handleDeleteTeacher = (teacherUuid: string) => {
        setDeleteTeacherUuid(teacherUuid);
        setDialogDelete(true);
    };

    // 处理查看教师详情
    const handleViewTeacher = (teacher: TeacherEntity) => {
        // 实现查看教师详情的逻辑
        message.info(`查看教师: ${teacher.name}`);
    };

    // 搜索防抖动
    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            setSearchRequest({
                ...searchRequest,
                department: departmentSearch || undefined,
                status: statusSearch || undefined,
                name: nameSearch || undefined,
            });
        }, 500);
        return () => clearTimeout(timer);
    }, [departmentSearch, statusSearch, nameSearch]); // 添加依赖项

    return (
        <>
            <div className="space-y-6 w-full">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <PeopleDeleteOne theme="outline" size="24" />
                        教师管理
                    </h1>

                    < div className="flex gap-2">
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
                                value={departmentSearch}
                                onChange={(e) => {
                                    setDepartmentSearch(e.target.value);
                                }}
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                                <kbd className="kbd kbd-sm">Ctrl</kbd>
                                <span className="mx-1">+</span>
                                <kbd className="kbd kbd-sm">K</kbd>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                <Search theme="outline" size="18" />
                            </div>
                            <input
                                ref={inputFocus}
                                type="text"
                                placeholder="搜索教师..."
                                className="input input-bordered pl-10 pr-16"
                                value={statusSearch}
                                onChange={(e) => {
                                    setStatusSearch(e.target.value);
                                }}
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                                <kbd className="kbd kbd-sm">Ctrl</kbd>
                                <span className="mx-1">+</span>
                                <kbd className="kbd kbd-sm">K</kbd>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                <Search theme="outline" size="18" />
                            </div>
                            <input
                                ref={inputFocus}
                                type="text"
                                placeholder="搜索教师..."
                                className="input input-bordered pl-10 pr-16"
                                value={nameSearch}
                                onChange={(e) => {
                                    setNameSearch(e.target.value);
                                }}
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                                <kbd className="kbd kbd-sm">Ctrl</kbd>
                                <span className="mx-1">+</span>
                                <kbd className="kbd kbd-sm">K</kbd>
                            </div>
                        </div>

                        {/* 修改为直接导航到添加教师页面的按钮 */}
                        <button
                            onClick={handleAddTeacher}
                            className="btn btn-primary flex items-center gap-1"
                        >
                            <AddOne theme="outline" size="18" />
                            <span className="hidden sm:inline">添加教师</span>
                            <span className="sm:hidden">添加</span>
                        </button>
                    </div>
                </div>

                {/* 统计信息卡片 */}
                {showStats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                                <h3 className="card-title text-lg">状态分布</h3>
                                <div className="grid grid-cols-2 gap-4 text-center">
                                    <div>
                                        <div className="radial-progress text-success" style={{"--value": teacherStats.total ? (teacherStats.byStatus.active / teacherStats.total) * 100 : 0} as any}>
                                            {teacherStats.byStatus.active}
                                        </div>
                                        <p className="text-sm mt-2">在职</p>
                                    </div>
                                    <div>
                                        <div className="radial-progress text-warning" style={{"--value": teacherStats.total ? (teacherStats.byStatus.onLeave / teacherStats.total) * 100 : 0} as any}>
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
                                    <th>工号</th>
                                    <th>姓名</th>
                                    <th>性别</th>
                                    <th>部门</th>
                                    <th>职称</th>
                                    <th>联系电话</th>
                                    <th>电子邮箱</th>
                                    <th>状态</th>
                                    <th>操作</th>
                                </tr>
                                </thead>
                                <tbody>
                                {loading ? (
                                    // 加载状态显示骨架屏
                                    Array(5).fill(0).map((_, index) => (
                                        <tr key={index} className="animate-pulse">
                                            <td><div className="h-4 bg-base-300 rounded w-16"></div></td>
                                            <td><div className="h-4 bg-base-300 rounded w-20"></div></td>
                                            <td><div className="h-4 bg-base-300 rounded w-8"></div></td>
                                            <td><div className="h-4 bg-base-300 rounded w-24"></div></td>
                                            <td><div className="h-4 bg-base-300 rounded w-16"></div></td>
                                            <td><div className="h-4 bg-base-300 rounded w-28"></div></td>
                                            <td><div className="h-4 bg-base-300 rounded w-32"></div></td>
                                            <td><div className="h-4 bg-base-300 rounded w-12"></div></td>
                                            <td><div className="h-4 bg-base-300 rounded w-24"></div></td>
                                        </tr>
                                    ))
                                ) : (
                                    teacherList.records.map(teacher => (
                                        <tr key={teacher.teacher_uuid}>
                                            <td>{teacher.id}</td>
                                            <td>{teacher.name}</td>
                                            <td>{teacher.sex === 1 ? '男' : '女'}</td>
                                            <td>{teacher.departmentName || '未分配'}</td>
                                            <td>{teacher.job_title}</td>
                                            <td>{teacher.phone}</td>
                                            <td>{teacher.email}</td>
                                            <td>
                                                <div className={`badge ${teacher.status === 1 ? 'badge-success' : 'badge-warning'}`}>
                                                    {teacher.status === 1 ? '在职' : '休假'}
                                                </div>
                                            </td>
                                            <td className="space-x-1">
                                                <button
                                                    className="btn btn-xs btn-primary"
                                                    title="查看"
                                                    onClick={() => handleViewTeacher(teacher)}
                                                >
                                                    <PreviewOpen theme="outline" size="16" />
                                                </button>
                                                <button
                                                      className="btn btn-xs btn-warning"
                                                      title="编辑"
                                                      onClick={() => handleEditTeacher(teacher)}
                                                >
                                                    <EditTwo theme="outline" size="16" />
                                                </button>
                                                <button
                                                    className="btn btn-xs btn-error"
                                                    title="删除"
                                                    onClick={() => handleDeleteTeacher(teacher.teacher_uuid)}
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
                <div className="flex justify-center items-center">
                    <div className="join join-horizontal">
                        <button className="transition shadow btn btn-sm join-item border"
                                onClick={() => setSearchRequest({ ...searchRequest, page: teacherList.current - 1 })}
                                disabled={teacherList.current === 1}>
                            上一页
                        </button>
                        {getPageInfo()}
                        <button className="transition shadow btn btn-sm join-item border"
                                onClick={() => setSearchRequest({ ...searchRequest, page: teacherList.current + 1 })}
                                disabled={teacherList.current === Math.ceil(teacherList.total / teacherList.size)}>
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

            {/* 对话框组件 */}
            <AcademicDeleteTeacherDialog
                show={dialogDelete}
                emit={setDialogDelete}
                teacherUuid={deleteTeacherUuid}
                onDeletedSuccess={refreshTeacherList}
            />
        </>
    );
}