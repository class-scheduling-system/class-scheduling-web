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

import {SiteInfoEntity} from "../../models/entity/site_info_entity.ts";
import {JSX, useEffect, useRef, useState} from "react";
import {PageEntity} from "../../models/entity/page_entity.ts";
import {ClassroomInfoEntity} from "../../models/entity/classroom_info_entity";
import {GetClassroomPageAPI} from "../../apis/classroom_api.ts";
import {PageClassroomDTO} from "../../models/dto/page/page_classroom_dto";
import {useDispatch, useSelector} from "react-redux";
import {animated, useTransition} from "@react-spring/web";
import {message} from "antd";
import {CardComponent} from "../../components/card_component.tsx";
import {Add, Delete, Editor, Eyes, Newlybuild, Search} from "@icon-park/react";
import {CurrentInfoStore} from "../../models/store/current_info_store.ts";
import {AdminClassroomDeleteDialog} from "../../components/admin/classroom/admin_classroom_delete_dialog.tsx";
import {Link} from "react-router";
import cardImage from "../../assets/images/card-background.webp";
import {LabelComponent} from "../../components/label_component.tsx";

/**
 * # AdminClassroom
 * > 该函数用于显示和管理教室列表。它根据提供的站点信息加载相关联的教室数据，并允许用户查看这些数据。
 *
 * @param {Readonly<{site: SiteInfoEntity}>} - 包含站点信息的对象，其中`site`字段为`SiteInfoEntity`类型，提供必要的站点上下文信息。
 *
 * @returns {JSX.Element} - 返回一个React组件，用于展示教室的列表及相关操作。
 *
 * @throws 如果从API获取教室列表失败，则会通过dispatch抛出一个错误消息toast。
 */
export function AdminClassroom({site}: Readonly<{ site: SiteInfoEntity }>): JSX.Element {
    const dispatch = useDispatch();

    const getCurrent = useSelector((state: { current: CurrentInfoStore }) => state.current);

    const inputFocus = useRef<HTMLInputElement | null>(null);

    const [classroomList, setClassroomList] = useState<PageEntity<ClassroomInfoEntity>>({} as PageEntity<ClassroomInfoEntity>);
    const [searchRequest, setSearchRequest] = useState<PageClassroomDTO>({
        page: 1,
        size: 20,
        is_desc: true,
    } as PageClassroomDTO);
    const [search, setSearch] = useState<string>();
    const [loading, setLoading] = useState(true);
    const [classroom, setClassroom] = useState<ClassroomInfoEntity>({} as ClassroomInfoEntity);

    const [dialogDelete, setDialogDelete] = useState<boolean>(false);
    const [refreshOperate, setRefreshOperate] = useState<boolean>(true);

    useEffect(() => {
        document.title = `教室管理 | ${site.name ?? "Frontleaves Technology"}`;
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

    // 获取教室列表
    useEffect(() => {
        const func = async () => {
            setLoading(true);
            const getResp = await GetClassroomPageAPI(searchRequest);
            if (getResp?.output === "Success") {
                setClassroomList(getResp.data!);
            } else {
                console.log(getResp);
                message.error(getResp?.message ?? "获取教室列表失败");
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
     * @returns {JSX.Element[]} 返回一个包含多个表示页码按钮的 JSX 元素数组。每个元素都是一个按钮，其文本内容为对应的页码数字。当前选中的页面按钮会有特别的样式。
     * @throws {void} 该函数不抛出异常。
     */
    function getPageInfo(): JSX.Element[] {
        const pageInfo: JSX.Element[] = [];
        for (let i = 0; i < Math.ceil(classroomList.total / classroomList.size); i++) {
            if (i + 1 === classroomList.current) {
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
     * # selectedClassroomDelete
     * > 该函数用于设置将要被删除的教室实体，并打开确认删除对话框。
     *
     * @param {ClassroomInfoEntity} classroom - 将要被删除的教室实体。
     * @returns {void}
     * @throws {TypeError} 如果传入的参数不是 ClassroomInfoEntity 类型，则抛出此异常。
     */
    function selectedClassroomDelete(classroom: ClassroomInfoEntity): void {
        setClassroom(classroom);
        setDialogDelete(true);
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
                                        <th>教室名称</th>
                                        <th>教室类型</th>
                                        <th>容纳人数</th>
                                        <th>所属建筑</th>
                                        <th>状态</th>
                                        <th>多媒体</th>
                                        <th>空调</th>
                                        <th className={"text-end"}>操作</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {classroomList.records?.map((item, index) => (
                                        <tr key={item.classroom?.classroom_uuid}
                                            className="transition hover:bg-base-200">
                                            <td>{index + 1 + (classroomList.current - 1) * classroomList.size}</td>
                                            <td className={"text-nowrap"}>{item.classroom?.name}</td>
                                            <td className={"text-nowrap"}>{item.type?.name}</td>
                                            <td>{item.classroom?.capacity}</td>
                                            <td className={"text-nowrap"}>{item.building?.building_name}</td>
                                            <td>
                                                <LabelComponent
                                                    size={"badge-sm"}
                                                    style={"badge-outline"}
                                                    type={item.classroom?.status ? "success" : "error"}
                                                    text={item.classroom?.status ? "启用" : "禁用"}
                                                />
                                            </td>
                                            <td>
                                                <LabelComponent
                                                    size={"badge-sm"}
                                                    style={"badge-outline"}
                                                    type={item.classroom?.is_multimedia ? "success" : "error"}
                                                    text={item.classroom?.is_multimedia ? "是" : "否"}
                                                />
                                            </td>
                                            <td>
                                                <LabelComponent
                                                    size={"badge-sm"}
                                                    style={"badge-outline"}
                                                    type={item.classroom?.is_air_conditioned ? "success" : "error"}
                                                    text={item.classroom?.is_air_conditioned ? "是" : "否"}
                                                />
                                            </td>
                                            <td className={"flex justify-end"}>
                                                <div className="join">
                                                    <button
                                                        onClick={() => selectedClassroomDelete(item)}
                                                        className="join-item btn btn-sm btn-soft btn-primary inline-flex">
                                                        <Eyes theme="outline" size="14"/>
                                                    </button>
                                                    <Link to={`/admin/classroom/edit/${item.classroom?.classroom_uuid}`}
                                                          className="join-item btn btn-sm btn-soft btn-info inline-flex">
                                                        <Editor theme="outline" size="14"/>
                                                    </Link>
                                                    <button
                                                        onClick={() => selectedClassroomDelete(item)}
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
                                        setSearchRequest({...searchRequest, page: classroomList.current - 1});
                                    }}
                                    disabled={classroomList.current === 1}>
                                上一页
                            </button>
                            {getPageInfo()}
                            <button className="transition shadow btn btn-sm join-item border"
                                    onClick={() => {
                                        setRefreshOperate(true);
                                        setSearchRequest({...searchRequest, page: classroomList.current + 1});
                                    }}
                                    disabled={classroomList.current === Math.ceil(classroomList.total / classroomList.size) || Math.ceil(classroomList.total / classroomList.size) === 0}>
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
                        <h2 className="text-xl font-bold">教室列表</h2>
                        <p className="text-base-content text-sm border-l-4 border-base-content ps-2">这里是教室列表，您可以查看、编辑和删除教室信息。</p>
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
                        <div className={"grid grid-cols-2 gap-3"}>
                            <Link to="/admin/classroom/add"
                                  className="transition shadow btn btn-outline btn-primary">
                                <Add theme="outline" size="16"/>
                                <span>添加</span>
                            </Link>
                            <button className="transition shadow btn btn-outline btn-secondary">
                                <Newlybuild theme="outline" size="16"/>
                                <span>批量导入</span>
                            </button>
                        </div>
                    </div>
                </CardComponent>
            </div>

            <AdminClassroomDeleteDialog
                classroom={classroom}
                show={dialogDelete}
                emit={setDialogDelete}
                requestRefresh={setRefreshOperate}
            />
        </>
    );
} 