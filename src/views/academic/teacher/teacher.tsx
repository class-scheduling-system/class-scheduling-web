import {JSX, useEffect, useRef, useState} from "react";
import {SiteInfoEntity} from "../../../models/entity/site_info_entity.ts";
import {
    AddOne, AllApplication, CategoryManagement,
    ChartGraph,
    Close, CloseOne,
    Delete,
    Editor, Info,
    Me,
    MoreApp,
    Refresh,
    Search
} from "@icon-park/react";
import {GetTeacherListAPI} from "../../../apis/teacher_api.ts";
import {message} from "antd";
import {PageEntity} from "../../../models/entity/page_entity.ts";
import {TeacherEntity} from "../../../models/entity/teacher_entity.ts";
import {animated, useTransition} from "@react-spring/web";
import {AcademicDeleteTeacherDialog} from "../../../components/academic/academic_teacher_delete_dialog.tsx";
import {GetDepartmentInfoAPI, GetDepartmentSimpleListAPI} from "../../../apis/department_api.ts";
import {useNavigate} from "react-router";
import {PageTeacherSearchDto} from "../../../models/dto/page_teacher_search_dto.ts";
import {useSelector} from "react-redux";
import {CurrentInfoStore} from "../../../models/store/current_info_store.ts";
import {CardComponent} from "../../../components/card_component.tsx";
import {TeacherTypeEntity} from "../../../models/entity/teacher_type_entity.ts";
import {GetTeacherTypeInfoByTypeUuidAPI, GetTeacherTypeSimpleListAPI} from "../../../apis/teacher_type_api.ts";
import {LabelComponent} from "../../../components/label_component.tsx";
import {DepartmentEntity} from "../../../models/entity/department_entity.ts";

// 扩展TeacherEntity接口，添加departmentName字段和typeName字段
interface TeacherWithExtInfo extends TeacherEntity {
    departmentName?: string;
    typeName?: string;
}

export function AcademicTeacher({site}: Readonly<{
    site: SiteInfoEntity
}>) {
    const inputFocus = useRef<HTMLInputElement | null>(null);
    const navigate = useNavigate();
    const getCurrent = useSelector((state: { current: CurrentInfoStore }) => state.current);

    const [teacherList, setTeacherList] = useState<PageEntity<TeacherWithExtInfo>>({
        records: new Array(5).fill({}) as TeacherWithExtInfo[],
        total: 0,
        size: 20,
        current: 1
    } as PageEntity<TeacherWithExtInfo>);

    // 缓存已加载的部门信息
    const [departmentCache, setDepartmentCache] = useState<{[key: string]: DepartmentEntity}>({});

    // 部门列表状态
    const [departmentList, setDepartmentList] = useState<DepartmentEntity[]>([]);

    // 缓存已加载的教师类型信息
    const [teacherTypeCache, setTeacherTypeCache] = useState<Map<string, TeacherTypeEntity>>(new Map());

    // 教师类型列表
    const [teacherTypeList, setTeacherTypeList] = useState<TeacherTypeEntity[]>([]);

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

    // 获取部门列表
    useEffect(() => {
        const fetchDepartmentList = async () => {
            try {
                const deptListResp = await GetDepartmentSimpleListAPI();
                if (deptListResp?.output === "Success" && deptListResp.data) {
                    // 这里假设响应数据是一个DepartmentInfoEntity数组
                    // 如果API实际返回的是分页数据，可能需要相应调整
                    setDepartmentList(Array.isArray(deptListResp.data) ? deptListResp.data : [deptListResp.data]);
                } else {
                    message.error(deptListResp?.error_message ?? "获取部门列表失败");
                }
            } catch (error) {
                console.error("获取部门列表失败", error);
                message.error("获取部门列表失败");
            }
        };

        fetchDepartmentList();
    }, []);

    // 获取教师类型列表
    useEffect(() => {
        const fetchTeacherTypeList = async () => {
            try {
                const typeListResp = await GetTeacherTypeSimpleListAPI();
                if (typeListResp?.output === "Success" && typeListResp.data) {
                    setTeacherTypeList(Array.isArray(typeListResp.data) ? typeListResp.data : [typeListResp.data]);
                } else {
                    message.error(typeListResp?.error_message ?? "获取教师类型列表失败");
                }
            } catch (error) {
                console.error("获取教师类型列表失败", error);
                message.error("获取教师类型列表失败");
            }
        };

        fetchTeacherTypeList();
    }, []);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (getCurrent?.system) {
                if (event.metaKey && event.key === "k") {
                    event.preventDefault();
                    inputFocus.current?.focus();
                }
            } else if (event.ctrlKey && event.key === "k") {
                event.preventDefault();
                inputFocus.current?.focus();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [getCurrent?.system]);

    // 获取教师列表并获取对应的部门信息和教师类型信息
    useEffect(() => {
        const fetchTeacherList = async () => {
            const getResp = await GetTeacherListAPI(searchRequest);
            if (getResp?.output === "Success") {
                const teachers = getResp.data!.records;

                // 创建具有部门名称和类型名称的教师列表
                const teachersWithExtInfo = [...teachers] as TeacherWithExtInfo[];

                // 获取每个教师的部门信息和类型信息
                for (const teacher of teachersWithExtInfo) {
                    // 获取部门信息
                    if (teacher.unit_uuid) {
                        await fetchDepartmentInfo(teacher);
                    }

                    // 获取教师类型信息
                    if (teacher.type) {
                        await fetchTeacherTypeInfo(teacher);
                    }
                }

                setTeacherList({
                    ...getResp.data!,
                    records: teachersWithExtInfo
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
    const fetchDepartmentInfo = async (teacher: TeacherWithExtInfo) => {
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
                setDepartmentCache((prev: {[key: string]: DepartmentEntity}) => {
                    const newCache = { ...prev };
                    if (teacher.unit_uuid && deptResp.data) {
                        newCache[teacher.unit_uuid] = deptResp.data;
                    }
                    return newCache;
                });
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

    // 获取教师类型信息
    const fetchTeacherTypeInfo = async (teacher: TeacherWithExtInfo) => {
        // 确保 type_uuid 存在且非空
        if (!teacher.type) {
            teacher.typeName = "未知类型";
            return;
        }

        // 检查缓存中是否已有该类型信息
        if (teacherTypeCache.has(teacher.type)) {
            const cachedType = teacherTypeCache.get(teacher.type);
            if (cachedType) {
                teacher.typeName = cachedType.type_name;
            } else {
                teacher.typeName = "未知类型";
            }
            return;
        }

        try {
            const typeResp = await GetTeacherTypeInfoByTypeUuidAPI(teacher.type);
            if (typeResp?.output === "Success" && typeResp.data) {
                // 更新缓存
                setTeacherTypeCache(prevMap => {
                    const newMap = new Map(prevMap);
                    newMap.set(teacher.type!, typeResp.data!); // 使用非空断言
                    return newMap;
                });

                // 设置类型名称
                teacher.typeName = typeResp.data.type_name;
            } else {
                // 设置为未知类型
                teacher.typeName = "未知类型";
            }
        } catch (error) {
            console.error("获取教师类型信息失败", error);
            teacher.typeName = "未知类型";
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

            // 创建具有部门名称和类型名称的教师列表
            const teachersWithExtInfo = [...teachers] as TeacherWithExtInfo[];

            // 获取每个教师的部门信息和类型信息
            for (const teacher of teachersWithExtInfo) {
                // 获取部门信息
                if (teacher.unit_uuid) {
                    await fetchDepartmentInfo(teacher);
                }

                // 获取教师类型信息
                if (teacher.type) {
                    await fetchTeacherTypeInfo(teacher);
                }
            }
            setTeacherList({
                ...getResp.data!,
                records: teachersWithExtInfo
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
            onLeave: teacherList.records.filter(t => t.status === 0).length,
            unregistered: teacherList.records.filter(t => t.status === 2).length
        },
        byType: {} as Record<string, number>
    };

    // 计算教师类型分布
    if (teacherTypeList.length > 0) {
        teacherTypeList.forEach(type => {
            if (type.teacher_type_uuid) {  // 添加空值检查
                teacherStats.byType[type.teacher_type_uuid] = teacherList.records.filter(
                    t => t.type === type.teacher_type_uuid
                ).length;
            }
        });
    }

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
        navigate("/academic/teacher/add");
    };

    // 处理编辑教师
    const handleEditTeacher = (teacher: TeacherEntity) => {
        navigate(`/academic/teacher/edit/${teacher.teacher_uuid}`, {
            state: { teacherInfo: teacher }
        });
    };

    // 处理删除教师
    const handleDeleteTeacher = (teacherUuid: string) => {
        setDeleteTeacherUuid(teacherUuid);
        setDialogDelete(true);
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
    }, [departmentSearch, statusSearch, nameSearch]);

    return (
        <>
            {/* 修改这里：设置整体容器为固定高度并禁止溢出 */}
            <div className={"grid grid-cols-10 gap-4 pb-4 h-[calc(100vh-117px)] overflow-hidden"}>
                <div className={"lg:col-span-7 md:col-span-10 sm:col-span-10 flex flex-col gap-4 h-full overflow-hidden"}>
                    {/* 主容器采用flex布局，包含统计和列表 */}
                    <div className="flex flex-col gap-4 h-full overflow-hidden">
                        {/* 统计信息卡片 - 现在放在列表上方，但不影响列表滚动 */}
                        {showStats && (
                            <CardComponent>
                                <div className="p-3 space-y-1">
                                    {/* 卡片标题 */}
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-lg font-bold flex items-center gap-2 text-primary-content pb-3">
                                            <ChartGraph theme="outline" size="20"/>
                                            教师数据统计
                                        </h2>
                                        <button
                                            className="btn btn-circle btn-ghost btn-sm hover:bg-base-200"
                                            onClick={() => setShowStats(!showStats)}>
                                            <Close theme="filled" size="16" />
                                        </button>
                                    </div>

                                    {/* 其他统计内容不变... */}
                                    {/* 统计卡片网格 */}
                                    <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4">
                                        {/* 教师总数 */}
                                        <div className="p-4 card card-md border border-primary/35 bg-primary/25 flex flex-col gap-1">
                                            <div className="font-bold text-primary-content flex items-center space-x-1">
                                                <AllApplication theme="outline" size="16"/>
                                                <span>教师总数</span>
                                            </div>
                                            <div className={"flex-1 flex justify-center items-center gap-3"}>
                                                <div className="text-3xl font-bold text-primary-content">
                                                    {teacherStats.total} 人
                                                </div>
                                            </div>
                                        </div>

                                        {/* 状态分布 */}
                                        <div className="p-4 card border border-base-content/15 bg-base-300/50 flex flex-col gap-1">
                                            <div className="font-bold text-base-content flex items-center space-x-1">
                                                <Info theme="outline" size="16"/>
                                                <span>状态分布</span>
                                            </div>
                                            <div className="flex-1 flex space-x-3 justify-center items-center">
                                                <div className={"card bg-success/25 border border-primary border-dashed card-lg rounded-md shadow-sm items-center justify-center w-12 p-2"}>
                                                    <div className="font-bold text-lg text-success-content">{teacherStats.byStatus.active}</div>
                                                    <p className="text-xs font-medium text-nowrap text-success-content">在职</p>
                                                </div>
                                                <div className={"card bg-warning/25 border border-warning border-dashed card-lg rounded-md shadow-sm items-center justify-center w-12 p-2"}>
                                                    <div className="font-bold text-lg text-warning-content">{teacherStats.byStatus.unregistered}</div>
                                                    <p className="text-xs font-medium text-nowrap text-warning-content">未注册</p>
                                                </div>
                                                <div className={"card bg-error/25 border border-error border-dashed card-lg rounded-md shadow-sm items-center justify-center w-12 p-2"}>
                                                    <div className="font-bold text-lg text-error-content">{teacherStats.byStatus.onLeave}</div>
                                                    <p className="text-xs font-medium text-nowrap text-error-content">停用</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* 教师类型分布 */}
                                        <div className="hidden xl:flex p-4 card border border-info/25 bg-info/25 flex-col gap-1">
                                            <div className="font-bold text-info-content flex items-center space-x-1">
                                                <CategoryManagement theme="outline" size="16"/>
                                                <span>教师类型分布</span>
                                            </div>
                                            <div className="flex-1 flex space-x-3 w-full justify-center items-center">
                                                {teacherTypeList.length > 0 ? (
                                                    teacherTypeList.slice(0, 2).map((type) => (
                                                        <div key={type.teacher_type_uuid} className="card bg-info card-lg rounded-md shadow-sm items-center justify-center w-12 p-2">
                                                            <div className="font-bold text-lg text-warning-content">{String(teacherStats.byType[type.teacher_type_uuid!] || 0)}</div>
                                                            <p className="text-xs font-medium text-nowrap text-info-content">{type.type_name}</p>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-xs text-base-content/50">暂无类型数据</p>
                                                )}
                                                {teacherTypeList.length > 3 && (
                                                    <div className="card bg-base-content card-lg rounded-md shadow-sm items-center justify-center w-12 p-2">
                                                        <div className="font-bold text-lg text-base-100">
                                                            +{teacherTypeList.length - 2}
                                                        </div>
                                                        <p className="text-xs font-medium text-nowrap text-base-100">其他</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* 查看更多教师类型 */}
                                    {teacherTypeList.length > 3 && (
                                        <div className="hidden xl:block">
                                            <details className="collapse collapse-arrow bg-base-100">
                                                <summary className="collapse-title text-primary-content font-medium">
                                                    <div className={"flex items-center h-full"}>
                                                        <span className="text-sm">查看更多教师类型分布</span>
                                                    </div>
                                                </summary>
                                                <div className="collapse-content">
                                                    <div className="grid xl:grid-cols-6 2xl:grid-cols-8 gap-1.5">
                                                        {teacherTypeList.map((type) => (
                                                            <div key={type.teacher_type_uuid!} className="flex items-center justify-between p-2 bg-base-200/50 hover:bg-base-300/50 transition rounded-md">
                                                                <span className="text-sm truncate font-medium">
                                                                    {type.type_name}
                                                                </span>
                                                                <span className="badge badge-sm badge-info badge-soft shadow">
                                                                    {teacherStats.byType[type.teacher_type_uuid!] || 0}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </details>
                                        </div>
                                    )}
                                </div>
                            </CardComponent>
                        )}

                        {/* 修改教师列表卡片 - 确保表格可以正确滚动 */}
                        <CardComponent padding={0} className={"flex-1 flex overflow-auto"}>
                            {transitionSearch((style, item) => item ? (
                                <animated.div style={style} className={"flex h-full justify-center"}>
                                    <div className={"flex items-center"}>
                                        <span className="loading loading-bars loading-xl"></span>
                                    </div>
                                </animated.div>
                            ) : (
                                <animated.div style={style} className={"overflow-x-auto overflow-y-auto"}>
                                    <table className="table">
                                        <thead className="sticky top-0 bg-base-100 z-10">
                                        <tr>
                                            <th>工号</th>
                                            <th>姓名</th>
                                            <th>性别</th>
                                            <th>部门</th>
                                            <th>职称</th>
                                            <th>状态</th>
                                            <th>教师类型</th>
                                            <th>联系方式</th>
                                            <th>邮箱</th>
                                            <th className={"text-end"}>操作</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {teacherList.records.map((teacher) => (
                                            <tr key={teacher.teacher_uuid} className="transition hover:bg-base-200">
                                                <td>{teacher.id}</td>
                                                <td className={"text-nowrap"}>{teacher.name}</td>
                                                <td>{teacher.sex === false ? '男' : '女'}</td>
                                                <td className={"text-nowrap"}>{teacher.departmentName || '未分配'}</td>
                                                <td>{teacher.job_title}</td>
                                                <td>{teacher.status === 1 ? (
                                                    <LabelComponent
                                                        size={"badge-sm"}
                                                        style={"badge-outline"}
                                                        type={"success"}
                                                        text={"启用"}
                                                    />
                                                ) : teacher.status === 2 ? (
                                                    <LabelComponent
                                                        size={"badge-sm"}
                                                        style={"badge-outline"}
                                                        type={"warning"}
                                                        text={"未注册"}
                                                    />
                                                ) : (
                                                    <LabelComponent
                                                        size={"badge-sm"}
                                                        style={"badge-outline"}
                                                        type={"error"}
                                                        text={"停用"}
                                                    />
                                                )}</td>
                                                <td>{teacher.typeName || '未知类型'}</td>
                                                <td>{teacher.phone}</td>
                                                <td>{teacher.email}</td>
                                                <td className={"grid justify-end text-nowrap"}>
                                                    <div className="join">
                                                        <button
                                                            onClick={() => handleEditTeacher(teacher)}
                                                            className="join-item btn btn-sm btn-soft btn-info inline-flex">
                                                            <Editor theme="outline" size="12" />
                                                            <span>编辑</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteTeacher(teacher.teacher_uuid!)}
                                                            className="join-item btn btn-sm btn-soft btn-error inline-flex">
                                                            <Delete theme="outline" size="12" />
                                                            <span>删除</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </animated.div>
                            ))}
                        </CardComponent>
                        {/* 分页控件 */}
                        <div className="flex justify-center flex-shrink-0 mt-2">
                            <div className={"join join-horizontal"}>
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
                </div>
                <div className={"lg:col-span-3 md:col-span-10 sm:col-span-10 flex flex-col gap-4 h-full pb-2"}>
                    {/* 搜索卡片 */}
                    <CardComponent padding={18}>
                        <div className={"space-y-3"}>
                        <h2 className="text-lg font-bold flex gap-2 items-center text-primary-content">
                            <Search theme="outline" size="20"/>
                            <span>搜索教师</span>
                        </h2>

                        <div className="grid gap-1 grid-cols-2">
                            {/* 教师姓名搜索 */}
                            <div className="w-full col-span-full">
                                <label className="input input-sm transition flex items-center w-full validator">
                                    <Me theme="outline" size="14"/>
                                    <input type="text"
                                           ref={inputFocus}
                                           value={nameSearch}
                                           onChange={(e) => setNameSearch(e.target.value)}
                                           className="grow ps-1"
                                           placeholder="教师姓名"/>
                                    {nameSearch && (
                                        <button
                                            className="transition hover:bg-error/45 rounded-md p-1.5"
                                            onClick={() => setNameSearch('')}
                                        >
                                            <Delete theme="outline" size="12" className={"transition text-black hover:text-error-content"}/>
                                        </button>
                                    )}
                                </label>
                            </div>
                            <div className="w-full">
                                <label className="select select-sm transition flex items-center w-full validator">
                                    <select
                                        className="grow ps-1 flex-1"
                                        value={departmentSearch}
                                        onChange={(e) => setDepartmentSearch(e.target.value)}
                                    >
                                        <option value="">请选择部门</option>
                                        {departmentList.map((dept) => (
                                            <option key={dept.department_uuid} value={dept.department_uuid}>
                                                {dept.department_name}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                            <div className="w-full">
                                <label className="select select-sm transition flex items-center w-full validator">
                                    <select
                                        className="grow ps-1 flex-1"
                                        value={statusSearch}
                                        onChange={(e) => setStatusSearch(e.target.value)}
                                    >
                                        <option value="">请选择教师状态</option>
                                        <option value="1">启用</option>
                                        <option value="0">停用</option>
                                        <option value="2">未注册</option>
                                    </select>
                                </label>
                            </div>
                        </div>

                        {/* 按钮组 */}
                        <div className="grid grid-cols-2 gap-1">
                            <button
                                className="btn btn-sm btn-primary shadow-md hover:shadow-lg transition py-3"
                                onClick={() => {
                                    setSearchRequest({
                                        ...searchRequest,
                                        page: 1,
                                        name: nameSearch || undefined,
                                        department: departmentSearch || undefined,
                                        status: statusSearch || undefined
                                    });
                                }}
                            >
                                <Search theme="outline" size="18" />
                                搜索
                            </button>
                            <button
                                className="btn btn-sm btn-primary btn-outline shadow-md hover:shadow-lg transition py-3"
                                onClick={() => {
                                    setNameSearch('');
                                    setDepartmentSearch('');
                                    setStatusSearch('');
                                    setSearchRequest({
                                        ...searchRequest,
                                        page: 1,
                                        name: undefined,
                                        department: undefined,
                                        status: undefined
                                    });
                                }}
                            >
                                <Refresh theme="outline" size="14"/>
                                重置条件
                            </button>
                        </div>

                        <div className="flex items-center justify-end gap-0.5 text-xs text-base-content/60">
                            <span>快速搜索：</span>
                            <kbd className="kbd kbd-xs bg-base-300">{getCurrent?.system ? "⌘" : "Ctrl"}</kbd>
                            <span>+</span>
                            <kbd className="kbd kbd-xs bg-base-300">K</kbd>
                        </div>
                        </div>
                    </CardComponent>
                    {/* 操作卡片 */}
                    <CardComponent padding={18} className={"space-3"}>
                        <h2 className="text-lg font-bold flex items-center gap-2 text-primary-content pb-2">
                            <MoreApp theme="outline" size="20"/>
                            <span>其他操作</span>
                        </h2>
                        <div className="grid grid-cols-2 gap-1.5">
                            <button
                                onClick={handleAddTeacher}
                                className="btn btn-sm btn-primary w-full flex items-center justify-center gap-2"
                            >
                                <AddOne theme="outline" size="14" />
                                添加教师
                            </button>
                            {showStats ? (
                            <button
                                className="btn btn-sm btn-outline btn-error w-full flex items-center justify-center gap-2"
                                onClick={() => setShowStats(!showStats)}
                            >
                                <CloseOne theme="outline" size="14"/>
                                <span>隐藏统计</span>
                            </button>
                                ) : (
                            <button
                                className="btn btn-sm btn-outline btn-info w-full flex items-center justify-center gap-2"
                                onClick={() => setShowStats(!showStats)}
                            >
                                <ChartGraph theme="outline" size="14" />
                                <span>显示统计</span>
                            </button>
                                )}
                        </div>
                    </CardComponent>
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