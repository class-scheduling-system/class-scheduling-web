import { JSX, useEffect, useRef, useState } from "react";
import { SiteInfoEntity } from "../../models/entity/site_info_entity.ts";
import {
    AddOne,
    AllApplication,
    ChartGraph,
    Close,
    CloseOne,
    Delete,
    Editor,
    Info,
    Me,
    MoreApp,
    Refresh,
    Search
} from "@icon-park/react";
import { message } from "antd";
import { PageEntity } from "../../models/entity/page_entity.ts";
import { animated, useTransition } from "@react-spring/web";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { CurrentInfoStore } from "../../models/store/current_info_store.ts";
import { CardComponent } from "../../components/card_component.tsx";
import { LabelComponent } from "../../components/label_component.tsx";
import { StudentEntity } from "../../models/entity/student_entity";
import { GetStudentPageAPI } from "../../apis/student_api";
import { PageStudentSearchDTO } from "../../models/dto/page/page_student_search_dto";
import { AcademicDeleteStudentDialog } from "../../components/academic/academic_student_delete_dialog";

export function AcademicStudent({ site }: Readonly<{
    site: SiteInfoEntity
}>) {
    const inputFocus = useRef<HTMLInputElement | null>(null);
    const navigate = useNavigate();
    const getCurrent = useSelector((state: { current: CurrentInfoStore }) => state.current);

    const [studentList, setStudentList] = useState<PageEntity<StudentEntity>>({
        records: new Array(5).fill({}) as StudentEntity[],
        total: 0,
        size: 20,
        current: 1
    } as PageEntity<StudentEntity>);

    const [searchRequest, setSearchRequest] = useState<PageStudentSearchDTO>({
        page: 1,
        size: 20,
        is_desc: true,
        is_graduated: false,
        name: undefined
    });

    const [nameSearch, setNameSearch] = useState<string>("");
    const [statusSearch, setStatusSearch] = useState<string>("");
    const isFirstRender = useRef(true);

    const [loading, setLoading] = useState(true);
    const [dialogDelete, setDialogDelete] = useState<boolean>(false);
    const [deleteStudentUuid, setDeleteStudentUuid] = useState("");
    const [showStats, setShowStats] = useState(false);
    const [refreshFlag, setRefreshFlag] = useState(0);

    // 键盘快捷键
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

    // 获取学生列表
    useEffect(() => {
        const fetchStudentList = async () => {
            setLoading(true);
            const getResp = await GetStudentPageAPI(searchRequest);
            if (getResp?.output === "Success") {
                const students = getResp.data!.records;
                setStudentList({
                    ...getResp.data!,
                    records: students
                });
            } else {
                console.log(getResp);
                message.error(getResp?.error_message ?? "获取学生列表失败");
            }
            setLoading(false);
        };
        fetchStudentList().then();
    }, [searchRequest, refreshFlag]);

    // 搜索防抖动
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        setLoading(true);
        const timer = setTimeout(() => {
            setSearchRequest({
                ...searchRequest,
                page: 1,
                name: nameSearch || undefined,
                is_graduated: statusSearch === "1" ? true : false
            });
        }, 500);
        return () => clearTimeout(timer);
    }, [nameSearch, statusSearch]);

    useEffect(() => {
        // 当对话框关闭时，刷新表格数据
        if (!dialogDelete && deleteStudentUuid) {
            setRefreshFlag(prev => prev + 1);
            setDeleteStudentUuid('');
        }
    }, [dialogDelete]);

    const transitionSearch = useTransition(loading ?? 0, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        config: { duration: 100 },
    });

    useEffect(() => {
        document.title = `学生管理 | ${site.name ?? "Frontleaves Technology"}`;
    }, [site.name]);

    // 计算学生统计数据
    const studentStats = {
        total: studentList.total || 0,
        byStatus: {
            active: studentList.records.filter(s => s.grade).length,
            inactive: studentList.records.filter(s => !s.grade).length,
            unregistered: studentList.records.filter(s => !s.user_uuid).length
        }
    };

    function getPageInfo(): JSX.Element[] {
        const pageInfo: JSX.Element[] = [];
        for (let i = 0; i < Math.ceil(studentList.total / studentList.size); i++) {
            if (i + 1 === studentList.current) {
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

    function renderStudentStatus(student: StudentEntity) {
        switch (student.status) {
            case 0:
                return (
                    <LabelComponent
                        size={"badge-sm"}
                        style={"badge-outline"}
                        type={"error"}
                        text={"在读"}
                    />
                );
            case 1:
                return (
                    <LabelComponent
                        size={"badge-sm"}
                        style={"badge-outline"}
                        type={"success"}
                        text={"已毕业"}
                    />
                );
            case 2:
                return (
                    <LabelComponent
                        size={"badge-sm"}
                        style={"badge-outline"}
                        type={"warning"}
                        text={"未注册"}
                    />
                );
            default:
                return (
                    <LabelComponent
                        size={"badge-sm"}
                        style={"badge-outline"}
                        type={"error"}
                        text={"未知"}
                    />
                );
        }
    }

    // 处理添加学生
    const handleAddStudent = () => {
        navigate("/academic/student/add");
    };

    // 处理编辑学生
    const handleEditStudent = (student: StudentEntity) => {
        navigate(`/academic/student/edit/${student.student_uuid}`, {
            state: { studentInfo: student }
        });
    };

    // 处理删除学生
    const handleDeleteStudent = (studentUuid: string) => {
        setDeleteStudentUuid(studentUuid);
        setDialogDelete(true);
    };

    // 处理搜索
    const handleSearch = () => {
        setSearchRequest({
            ...searchRequest,
            page: 1,
            name: nameSearch || undefined,
            is_graduated: statusSearch === "1" ? true : false
        });
    };

    // 处理重置
    const handleReset = () => {
        setNameSearch('');
        setStatusSearch('');
        setSearchRequest({
            page: 1,
            size: 20,
            is_desc: true,
            is_graduated: false,
            name: undefined
        });
    };

    return (
        <>
            <div className={"grid grid-cols-10 gap-4 pb-4 h-[calc(100vh-117px)] overflow-hidden"}>
                <div className={"lg:col-span-7 md:col-span-10 sm:col-span-10 flex flex-col gap-4 h-full overflow-hidden"}>
                    <div className="flex flex-col gap-4 h-full overflow-hidden">
                        {/* 统计信息卡片 */}
                        {showStats && (
                            <CardComponent>
                                <div className="p-3 space-y-1">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-lg font-bold flex items-center gap-2 text-primary-content pb-3">
                                            <ChartGraph theme="outline" size="20" />
                                            学生数据统计
                                        </h2>
                                        <button
                                            className="btn btn-circle btn-ghost btn-sm hover:bg-base-200"
                                            onClick={() => setShowStats(!showStats)}>
                                            <Close theme="filled" size="16" />
                                        </button>
                                    </div>

                                    <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4">
                                        {/* 学生总数 */}
                                        <div className="p-4 card card-md border border-primary/35 bg-primary/25 flex flex-col gap-1">
                                            <div className="font-bold text-primary-content flex items-center space-x-1">
                                                <AllApplication theme="outline" size="16" />
                                                <span>学生总数</span>
                                            </div>
                                            <div className={"flex-1 flex justify-center items-center gap-3"}>
                                                <div className="text-3xl font-bold text-primary-content">
                                                    {studentStats.total} 人
                                                </div>
                                            </div>
                                        </div>

                                        {/* 状态分布 */}
                                        <div className="p-4 card border border-base-content/15 bg-base-300/50 flex flex-col gap-1">
                                            <div className="font-bold text-base-content flex items-center space-x-1">
                                                <Info theme="outline" size="16" />
                                                <span>状态分布</span>
                                            </div>
                                            <div className="flex-1 flex space-x-3 justify-center items-center">
                                                <div className={"card bg-success/25 border border-primary border-dashed card-lg rounded-md shadow-sm items-center justify-center w-12 p-2"}>
                                                    <div className="font-bold text-lg text-success-content">{studentStats.byStatus.active}</div>
                                                    <p className="text-xs font-medium text-nowrap text-success-content">在读</p>
                                                </div>
                                                <div className={"card bg-warning/25 border border-warning border-dashed card-lg rounded-md shadow-sm items-center justify-center w-12 p-2"}>
                                                    <div className="font-bold text-lg text-warning-content">{studentStats.byStatus.unregistered}</div>
                                                    <p className="text-xs font-medium text-nowrap text-warning-content">未注册</p>
                                                </div>
                                                <div className={"card bg-error/25 border border-error border-dashed card-lg rounded-md shadow-sm items-center justify-center w-12 p-2"}>
                                                    <div className="font-bold text-lg text-error-content">{studentStats.byStatus.inactive}</div>
                                                    <p className="text-xs font-medium text-nowrap text-error-content">已毕业</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardComponent>
                        )}

                        {/* 学生列表卡片 */}
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
                                                <th>学号</th>
                                                <th>姓名</th>
                                                <th>性别</th>
                                                <th>班级</th>
                                                <th>状态</th>
                                                <th>联系方式</th>
                                                <th>邮箱</th>
                                                <th className={"text-end"}>操作</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {studentList.records.map((student) => (
                                                <tr key={student.student_uuid} className="transition hover:bg-base-200">
                                                    <td className={"text-nowrap font-bold"}>{student.id}</td>
                                                    <td className={"text-nowrap"}>{student.name}</td>
                                                    <td>{student.gender === 1 ? '女' : '男'}</td>
                                                    <td className={"text-nowrap"}>{student.clazz}</td>
                                                    <td>
                                                        {renderStudentStatus(student)}
                                                    </td>
                                                    <td>{student.department}</td>
                                                    <td>{student.major}</td>
                                                    <td className={"grid justify-end text-nowrap"}>
                                                        <div className="join">
                                                            <button
                                                                onClick={() => handleEditStudent(student)}
                                                                className="join-item btn btn-sm btn-soft btn-info inline-flex">
                                                                <Editor theme="outline" size="12" />
                                                                <span>编辑</span>
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteStudent(student.student_uuid!)}
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
                                    onClick={() => setSearchRequest({ ...searchRequest, page: studentList.current - 1 })}
                                    disabled={studentList.current === 1}>
                                    上一页
                                </button>
                                {getPageInfo()}
                                <button className="transition shadow btn btn-sm join-item border"
                                    onClick={() => setSearchRequest({ ...searchRequest, page: studentList.current + 1 })}
                                    disabled={studentList.current === Math.ceil(studentList.total / studentList.size)}>
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

                {/* 右侧搜索和操作区域 */}
                <div className={"lg:col-span-3 md:col-span-10 sm:col-span-10 flex flex-col gap-4 h-full pb-2"}>
                    {/* 搜索卡片 */}
                    <CardComponent padding={18}>
                        <div className={"space-y-3"}>
                            <h2 className="text-lg font-bold flex gap-2 items-center text-primary-content">
                                <Search theme="outline" size="20" />
                                <span>搜索学生</span>
                            </h2>

                            <div className="grid gap-1 grid-cols-2">
                                <div className="w-full col-span-full">
                                    <label className="input input-sm transition flex items-center w-full validator">
                                        <Me theme="outline" size="14" />
                                        <input type="text"
                                            ref={inputFocus}
                                            value={nameSearch}
                                            onChange={(e) => setNameSearch(e.target.value)}
                                            className="grow ps-1"
                                            placeholder="学生姓名" />
                                        {nameSearch && (
                                            <button
                                                className="transition hover:bg-error/45 rounded-md p-1.5"
                                                onClick={() => setNameSearch('')}
                                            >
                                                <Delete theme="outline" size="12" className={"transition text-black hover:text-error-content"} />
                                            </button>
                                        )}
                                    </label>
                                </div>
                                <div className="w-full col-span-full">
                                    <label className="select select-sm transition flex items-center w-full validator">
                                        <select
                                            className="grow ps-1 flex-1"
                                            value={statusSearch}
                                            onChange={(e) => setStatusSearch(e.target.value)}
                                        >
                                            <option value="">请选择学生状态</option>
                                            <option value="0">未注册</option>
                                            <option value="1">已注册</option>
                                            <option value="2">已停用</option>
                                        </select>
                                    </label>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-1">
                                <button
                                    className="btn btn-sm btn-primary shadow-md hover:shadow-lg transition py-3"
                                    onClick={handleSearch}
                                >
                                    <Search theme="outline" size="18" />
                                    搜索
                                </button>
                                <button
                                    className="btn btn-sm btn-primary btn-outline shadow-md hover:shadow-lg transition py-3"
                                    onClick={handleReset}
                                >
                                    <Refresh theme="outline" size="14" />
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
                            <MoreApp theme="outline" size="20" />
                            <span>其他操作</span>
                        </h2>
                        <div className="grid grid-cols-2 gap-1.5">
                            <button
                                onClick={handleAddStudent}
                                className="btn btn-sm btn-primary w-full flex items-center justify-center gap-2"
                            >
                                <AddOne theme="outline" size="14" />
                                添加学生
                            </button>
                            {showStats ? (
                                <button
                                    className="btn btn-sm btn-outline btn-error w-full flex items-center justify-center gap-2"
                                    onClick={() => setShowStats(!showStats)}
                                >
                                    <CloseOne theme="outline" size="14" />
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

            {/* 删除对话框 */}
            <AcademicDeleteStudentDialog
                show={dialogDelete}
                emit={setDialogDelete}
                studentUuid={deleteStudentUuid}
            />
        </>
    );
} 