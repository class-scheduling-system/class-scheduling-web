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

import cardImage from "../../assets/images/card-background.webp";

import {SiteInfoEntity} from "../../models/entity/site_info_entity.ts";
import {JSX, useEffect, useRef, useState} from "react";
import {Link} from "react-router";
import {PageEntity} from "../../models/entity/page_entity.ts";
import {PageSearchDTO} from "../../models/dto/page_search_dto.ts";
import {useDispatch, useSelector} from "react-redux";
import {animated, useTransition} from "@react-spring/web";
import {message} from "antd";
import {CardComponent} from "../../components/card_component.tsx";
import {LabelComponent} from "../../components/label_component.tsx";
import {Add, BookOpen, CheckOne, CloseOne, Delete, Editor, Eyes, Newlybuild, Search} from "@icon-park/react";
import {CurrentInfoStore} from "../../models/store/current_info_store.ts";
import {GetDepartmentPageAPI} from "../../apis/department_api.ts";
import {DepartmentEntity} from "../../models/entity/department_entity.ts";


/**
 * # AdminDepartment
 * > 该函数用于显示和管理教学楼列表。它根据提供的站点信息加载相关联的教学楼数据，并允许用户查看这些数据。
 *
 * @param {Readonly<{site: SiteInfoEntity}>} - 包含站点信息的对象，其中`site`字段为`SiteInfoEntity`类型，提供必要的站点上下文信息。
 *
 * @returns {JSX.Element} - 返回一个React组件，用于展示教学楼的列表及相关操作。
 *
 * @throws 如果从API获取教学楼列表失败，则会通过dispatch抛出一个错误消息toast。
 */
export function AdminDepartment({site}: Readonly<{ site: SiteInfoEntity }>): JSX.Element {
    const dispatch = useDispatch();

    const getCurrent = useSelector((state: { current: CurrentInfoStore }) => state.current);

    const inputFocus = useRef<HTMLInputElement | null>(null);

    const [departmentList, setDepartmentList] = useState<PageEntity<DepartmentEntity>>({} as PageEntity<DepartmentEntity>);
    const [searchRequest, setSearchRequest] = useState<PageSearchDTO>({
        page: 1,
        size: 20,
        is_desc: true,
    } as PageSearchDTO);
    const [search, setSearch] = useState<string>();
    const [loading, setLoading] = useState(true);
    const [department, setDepartment] = useState<DepartmentEntity>({} as DepartmentEntity);


    const [refreshOperate, setRefreshOperate] = useState<boolean>(true);

    useEffect(() => {
        document.title = `教学楼管理 | ${site.name ?? "Frontleaves Technology"}`;
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

    // 获取教学楼列表
    useEffect(() => {
        const func = async () => {
            setLoading(true);
            const getResp = await GetDepartmentPageAPI(searchRequest);
            if (getResp?.output === "Success") {
                setDepartmentList(getResp.data!);
            } else {
                console.log(getResp);
                message.error(getResp?.message ?? "获取教学楼列表失败");
            }
            setLoading(false);
        };
        if (refreshOperate) {
            func().then();
        }
        setRefreshOperate(false);
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
        for (let i = 0; i < Math.ceil(departmentList.total / departmentList.size); i++) {
            if (i + 1 === departmentList.current) {
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
     * # selectedDepartmentDelete
     * > 该函数用于删除选中的教学楼实体。它会将选中的教学楼实体传递给删除对话框组件，并显示该对话框。
     *
     * @param {DepartmentEntity} department - 选中的教学楼实体对象，类型为 DepartmentEntity。
     * @returns {void}
     * @throws {TypeError} 如果传入的参数不是 BuildingEntity 类型，则抛出此异常。
     */
    function selectedDepartmentDelete(department: DepartmentEntity): void {
        setDepartment(department);
        // TODO: 实现删除功能
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
                                        <th>部门编号</th>
                                        <th>部门名字</th>
                                        <th>是否启用</th>
                                        <th>实体部门</th>
                                        <th className={"hidden xl:block"}>上课院系</th>
                                        <th>单位类别</th>
                                        <th>单位办别</th>
                                        <th className={"text-end"}>操作</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        departmentList.records.map((department, index) => (
                                            <tr
                                                key={department.department_uuid}
                                                className="transition hover:bg-base-200"
                                            >
                                                <td>{index + 1 + (departmentList.current - 1) * departmentList.size}</td>
                                                <td className={"text-nowrap"}>{department.department_code}</td>
                                                <td className={"text-nowrap"}>{department.department_name}</td>
                                                <td>
                                                    {department.is_enabled ? (
                                                        <LabelComponent size={"badge-sm"} style={"badge-outline"}
                                                                        type={"success"} text={"是"}
                                                                        icon={<CheckOne theme="outline" size="12"/>}/>
                                                    ) : (
                                                        <LabelComponent size={"badge-sm"} style={"badge-outline"}
                                                                        type={"error"} text={"否"}
                                                                        icon={<CloseOne theme="outline" size="12"/>}/>
                                                    )}
                                                </td>
                                                <td className={"hidden xl:block"}>
                                                    {department.is_entity ? (
                                                        <LabelComponent size={"badge-sm"} style={"badge-outline"}
                                                                        type={"success"} text={"是"}
                                                                        icon={<CheckOne theme="outline" size="12"/>}/>
                                                    ) : (
                                                        <LabelComponent size={"badge-sm"} style={"badge-outline"}
                                                                        type={"error"} text={"否"}
                                                                        icon={<CloseOne theme="outline" size="12"/>}/>
                                                    )}
                                                </td>
                                                <td>
                                                    {department.is_attending_college ? (
                                                        <LabelComponent size={"badge-sm"} style={"badge-outline"}
                                                                        type={"success"} text={"是"}
                                                                        icon={<BookOpen theme="outline" size="12"/>}/>
                                                    ) : (
                                                        <LabelComponent size={"badge-sm"} style={"badge-outline"}
                                                                        type={"error"} text={"否"}
                                                                        icon={<CloseOne theme="outline" size="12"/>}/>
                                                    )}
                                                </td>
                                                <td>{department.unit_category}</td>
                                                <td>{department.unit_type}</td>
                                                <td className={"flex justify-end"}>
                                                    <div className="join">
                                                        <button
                                                            onClick={() => selectedDepartmentDelete(department)}
                                                            className="join-item btn btn-sm btn-soft btn-primary inline-flex">
                                                            <Eyes theme="outline" size="14"/>
                                                        </button>
                                                        <Link to={"/admin/department/edit/" + department.department_uuid}
                                                            className="join-item btn btn-sm btn-soft btn-info inline-flex">
                                                            <Editor theme="outline" size="14"/>
                                                        </Link>
                                                        <button
                                                            onClick={() => selectedDepartmentDelete(department)}
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
                                        setSearchRequest({...searchRequest, page: departmentList.current - 1});
                                    }}
                                    disabled={departmentList.current === 1}>
                                上一页
                            </button>
                            {getPageInfo()}
                            <button className="transition shadow btn btn-sm join-item border"
                                    onClick={() => {
                                        setRefreshOperate(true);
                                        setSearchRequest({...searchRequest, page: departmentList.current + 1});
                                    }}
                                    disabled={departmentList.current === Math.ceil(departmentList.total / departmentList.size) || Math.ceil(departmentList.total / departmentList.size) === 0}>
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
                        <h2 className="text-xl font-bold">部门列表</h2>
                        <p className="text-base-content text-sm border-l-4 border-base-content ps-2">这里是部门列表，您可以查看、编辑和删除部门信息。</p>
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
                            <Link to="/admin/department/add"
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
            {/* 这里可以添加删除和编辑对话框 */}
        </>
    );
}
