/*
 * --------------------------------------------------------------------------------
 * Copyright (c) 2022-NOW(至今) 锋楪技术团队
 * Author: 锋楪技术团队 (https://www.frontleaves.com)
 *
 * 本文件包含锋楪技术团队项目的源代码，项目的所有源代码均遵循 MIT 开源许可证协议。
 * --------------------------------------------------------------------------------
 */

import cardImage from "../../assets/images/card-background.webp";

import { SiteInfoEntity } from "../../models/entity/site_info_entity.ts";
import { JSX, useEffect, useRef, useState } from "react";
import { PageEntity } from "../../models/entity/page_entity.ts";
import { GradeEntity } from "../../models/entity/grade_entity.ts";
import { GetGradePageAPI } from "../../apis/grade_api.ts";
import { PageGradeSearchDTO } from "../../models/dto/page/page_grade_search_dto.ts";
import { useDispatch, useSelector } from "react-redux";
import { animated, useTransition } from "@react-spring/web";
import { message } from "antd";
import { CardComponent } from "../../components/card_component.tsx";
import { Add, Delete, Editor, Eyes, Search } from "@icon-park/react";
import { CurrentInfoStore } from "../../models/store/current_info_store.ts";
import { AdminGradeAddDialog } from "../../components/admin/grade/admin_grade_add_dialog.tsx";
import { AdminGradeDeleteDialog } from "../../components/admin/grade/admin_grade_delete_dialog.tsx";
import { AdminGradeEditDialog } from "../../components/admin/grade/admin_grade_edit_dialog.tsx";

/**
 * # AdminGrade
 * > 该函数用于显示和管理年级列表。它根据提供的站点信息加载相关联的年级数据，并允许用户查看、添加、编辑和删除这些数据。
 *
 * @param {Readonly<{site: SiteInfoEntity}>} - 包含站点信息的对象，其中`site`字段为`SiteInfoEntity`类型，提供必要的站点上下文信息。
 *
 * @returns {JSX.Element} - 返回一个React组件，用于展示年级的列表及相关操作。
 *
 * @throws 如果从API获取年级列表失败，则会通过dispatch抛出一个错误消息toast。
 */
export function AdminGrade({site}: Readonly<{ site: SiteInfoEntity }>): JSX.Element {
    const dispatch = useDispatch();

    const getCurrent = useSelector((state: { current: CurrentInfoStore }) => state.current);

    const inputFocus = useRef<HTMLInputElement | null>(null);

    const [gradeList, setGradeList] = useState<PageEntity<GradeEntity>>({} as PageEntity<GradeEntity>);
    const [searchRequest, setSearchRequest] = useState<PageGradeSearchDTO>({
        page: 1,
        size: 20,
        is_desc: true,
    } as PageGradeSearchDTO);
    const [search, setSearch] = useState<string>();
    const [loading, setLoading] = useState(true);
    const [grade, setGrade] = useState<GradeEntity>({} as GradeEntity);

    const [dialogAdd, setDialogAdd] = useState<boolean>(false);
    const [dialogDelete, setDialogDelete] = useState<boolean>(false);
    const [dialogEdit, setDialogEdit] = useState<boolean>(false);
    const [refreshOperate, setRefreshOperate] = useState<boolean>(true);
    const [operateUuid, setOperateUuid] = useState<string>("");

    useEffect(() => {
        document.title = `年级管理 | ${site.name ?? "Frontleaves Technology"}`;
    }, [site.name]);

    // 快捷键映射查询
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (getCurrent.system) {
                if (event.metaKey && event.key === "k") {
                    event.preventDefault();
                    inputFocus.current?.focus();
                }
            } else if (event.ctrlKey && event.key === "k") {
                event.preventDefault();
                inputFocus.current?.focus();
            }
        };

        // 在组件加载时添加事件监听
        window.addEventListener("keydown", handleKeyDown);

        // 组件卸载时移除事件监听
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [getCurrent.system]);

    // 获取年级列表
    useEffect(() => {
        const func = async () => {
            setLoading(true);
            const getResp = await GetGradePageAPI(searchRequest);
            if (getResp?.output === "Success") {
                setGradeList(getResp.data!);
            } else {
                console.log(getResp);
                message.error(getResp?.error_message ?? "获取年级列表失败");
            }
            setLoading(false);
        };
        if (refreshOperate) {
            func().then();
            setRefreshOperate(false);
        }
    }, [dispatch, searchRequest, refreshOperate]);

    // 搜索防抖动(500毫秒，输入字符串）
    useEffect(() => {
        setLoading(true);
        if (search != undefined) {
            console.log(search);
            const timer = setTimeout(() => {
                setSearchRequest({...searchRequest, keyword: search});
                setRefreshOperate(true);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [search]);

    const transitionSearch = useTransition(loading ?? 0, {
        from: {opacity: 0},
        enter: {opacity: 1},
        config: {duration: 100},
    });

    /**
     * # getPageInfo
     * > 该函数用于生成页面信息的按钮列表，根据给定的数据来创建代表不同页码的按钮。当前页的按钮会以不同的样式突出显示。
     *
     * @returns {JSX.Element[]} 返回一个包含多个表示页码按钮的 JSX 元素数组。每个元素都是一个按钮，其文本内容为对应的页码数字。当前选中的页面按钮会有特别的样式（通过添加额外的 CSS 类实现）。
     * @throws {void} 该函数不抛出异常。
     */
    function getPageInfo(): JSX.Element[] {
        const pageInfo: JSX.Element[] = [];
        for (let i = 0; i < Math.ceil(gradeList.total / gradeList.size); i++) {
            if (i + 1 === gradeList.current) {
                pageInfo.push(
                    <button key={i}
                            className="transition shadow btn btn-sm join-item btn-primary border">
                        {i + 1}
                    </button>
                );
            } else {
                pageInfo.push(
                    <button key={i}
                            onClick={() => {
                                setSearchRequest({...searchRequest, page: i + 1});
                                setRefreshOperate(true);
                            }}
                            className="transition shadow btn btn-sm join-item border">
                        {i + 1}
                    </button>
                );
            }
        }
        return pageInfo;
    }

    /**
     * # selectedGradeDelete
     * > 该函数用于设置将要被删除的年级实体，并打开确认删除对话框。
     *
     * @param {GradeEntity} grade - 将要被删除的年级实体。
     * @returns {void}
     * @throws {TypeError} 如果传入的参数不是 GradeEntity 类型，则抛出此异常。
     */
    function selectedGradeDelete(grade: GradeEntity): void {
        setGrade(grade);
        setDialogDelete(true);
    }

    /**
     * # selectedGradeEdit
     * > 该函数用于设置将要被编辑的年级实体，并打开编辑对话框。
     *
     * @param {GradeEntity} grade - 将要被编辑的年级实体。
     * @returns {void}
     * @throws {TypeError} 如果传入的参数不是 GradeEntity 类型，则抛出此异常。
     */
    function selectedGradeEdit(grade: GradeEntity): void {
        setOperateUuid(grade.grade_uuid);
        setDialogEdit(true);
    }

    return (
        <>
            <div className={"grid grid-cols-10 gap-4 pb-4"}>
                <div className={"col-span-full lg:col-span-7 flex flex-col gap-2 h-[calc(100vh-117px)]"}>
                    <CardComponent padding={0} className={"flex-1 flex overflow-y-auto"}>
                        {transitionSearch((style, item) => item ? (
                            <animated.div style={style} className={"flex h-full justify-center"}>
                                <div className={"flex items-center"}>
                                    <span className="loading loading-bars loading-xl"></span>
                                </div>
                            </animated.div>
                        ) : (
                            <animated.div style={style} className={"overflow-x-auto overflow-y-auto"}>
                                <table className="table">
                                    <thead className={"top-0 sticky z-10 bg-base-100"}>
                                    <tr>
                                        <th>#</th>
                                        <th>年级名称</th>
                                        <th>入学年份</th>
                                        <th>开始日期</th>
                                        <th>结束日期</th>
                                        <th className={"text-end"}>操作</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {gradeList.records?.map((item, index) => (
                                        <tr key={index} className="transition hover:bg-base-200">
                                            <td>{index + 1 + (gradeList.current - 1) * gradeList.size}</td>
                                            <td>{item.name}</td>
                                            <td>{item.year}</td>
                                            <td>{item.start_date}</td>
                                            <td>{item.end_date}</td>
                                            <td className={"flex justify-end"}>
                                                <div className="join">
                                                    <button
                                                        title={"查看"}
                                                        className="join-item btn btn-sm btn-soft btn-primary inline-flex">
                                                        <Eyes theme="outline" size="14"/>
                                                    </button>
                                                    <button 
                                                        title={"编辑"}
                                                        onClick={() => selectedGradeEdit(item)}
                                                        className="join-item btn btn-sm btn-soft btn-info inline-flex">
                                                        <Editor theme="outline" size="14"/>
                                                    </button>
                                                    <button 
                                                        title={"删除"}
                                                        onClick={() => selectedGradeDelete(item)}
                                                        className="join-item btn btn-sm btn-soft btn-error inline-flex">
                                                        <Delete theme="outline" size="14"/>
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
                    <div className="flex justify-center">
                        <div className={"join join-horizontal"}>
                            <button className="transition shadow btn btn-sm join-item border"
                                    onClick={() => {
                                        setRefreshOperate(true);
                                        setSearchRequest({...searchRequest, page: gradeList.current - 1});
                                    }}
                                    disabled={gradeList.current === 1}>
                                上一页
                            </button>
                            {getPageInfo()}
                            <button className="transition shadow btn btn-sm join-item border"
                                    onClick={() => {
                                        setRefreshOperate(true);
                                        setSearchRequest({...searchRequest, page: gradeList.current + 1});
                                    }}
                                    disabled={gradeList.current === Math.ceil(gradeList.total / gradeList.size) || Math.ceil(gradeList.total / gradeList.size) === 0}>
                                下一页
                            </button>
                            <select className="join-item transition select select-sm mx-1 border-l-0"
                                    value={searchRequest.size}
                                    onChange={(e) => {
                                        setRefreshOperate(true);
                                        setSearchRequest({...searchRequest, size: Number(e.target.value)});
                                    }}>
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
                
                <CardComponent col={3} padding={0} howScreenHide={"lg"}>
                    <img src={cardImage} alt="Card Background" className="w-full h-full object-cover rounded-t-xl"/>
                    <div className="p-4 flex flex-col gap-1">
                        <h2 className="text-xl font-bold">年级列表</h2>
                        <p className="text-base-content text-sm border-l-4 border-base-content ps-2">这里是年级列表，您可以查看、编辑和删除年级信息。</p>
                    </div>
                    <div className="px-4 pb-4 flex flex-col gap-3">
                        <div>
                            <label className="input transition w-full">
                                <Search theme="outline" size="12"/>
                                <input ref={inputFocus} type="search" className="grow" placeholder="查询"
                                       onChange={(event) => setSearch(event.target.value)}/>
                                <kbd className="kbd kbd-sm">{getCurrent.system ? "⌘" : "Ctrl"}</kbd>
                                <kbd className="kbd kbd-sm">K</kbd>
                            </label>
                        </div>
                        <div className={"grid grid-cols-1 gap-3"}>
                            <button onClick={() => setDialogAdd(true)}
                                  className="transition shadow btn btn-outline btn-primary">
                                <Add theme="outline" size="16"/>
                                <span>添加</span>
                            </button>
                        </div>
                    </div>
                </CardComponent>
            </div>
            
            {/* 对话框组件 */}
            <AdminGradeAddDialog show={dialogAdd} emit={setDialogAdd} requestRefresh={setRefreshOperate}/>
            <AdminGradeDeleteDialog grade={grade} show={dialogDelete} emit={setDialogDelete} requestRefresh={setRefreshOperate}/>
            <AdminGradeEditDialog show={dialogEdit} editGradeUuid={operateUuid} emit={setDialogEdit} requestRefresh={setRefreshOperate}/>
        </>
    );
} 