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

import { JSX, useEffect, useRef, useState } from "react";
import { SiteInfoEntity } from "../../models/entity/site_info_entity.ts";
import { useSelector } from "react-redux";
import { animated, useTransition } from "@react-spring/web";
import { message, Modal } from "antd";
import { CardComponent } from "../../components/card_component.tsx";
import { Add, Delete, Editor, Search } from "@icon-park/react";
import { CurrentInfoStore } from "../../models/store/current_info_store.ts";
import { PageEntity } from "../../models/entity/page_entity.ts";
import { PageSearchDTO } from "../../models/dto/page_search_dto.ts";
import { UnitCategoryEntity } from "../../models/entity/unit_category_entity.ts";
import { UnitTypeEntity } from "../../models/entity/unit_type_entity.ts";
import { DeleteUnitCategoryAPI, GetUnitCategoryPageAPI } from "../../apis/unit_category_api.ts";
import { DeleteUnitTypeAPI, GetUnitTypePageAPI } from "../../apis/unit_type_api.ts";
import { useNavigate } from "react-router";

/**
 * # AdminUnit
 * > 该函数用于显示和管理单位办别和单位类别。它根据提供的站点信息加载相关数据，并允许用户查看和管理这些数据。
 *
 * @param {Readonly<{site: SiteInfoEntity}>} - 包含站点信息的对象，其中`site`字段为`SiteInfoEntity`类型，提供必要的站点上下文信息。
 *
 * @returns {JSX.Element} - 返回一个React组件，用于展示单位办别和单位类别的列表及相关操作。
 */
export function AdminUnit({ site }: Readonly<{ site: SiteInfoEntity }>): JSX.Element {
    const navigate = useNavigate();
    const getCurrent = useSelector((state: { current: CurrentInfoStore }) => state.current);
    const inputFocus = useRef<HTMLInputElement | null>(null);

    // 单位类别状态
    const [categoryList, setCategoryList] = useState<PageEntity<UnitCategoryEntity>>({} as PageEntity<UnitCategoryEntity>);
    const [categorySearchRequest, setCategorySearchRequest] = useState<PageSearchDTO>({
        page: 1,
        size: 20,
        is_desc: true,
    } as PageSearchDTO);

    // 单位办别状态
    const [typeList, setTypeList] = useState<PageEntity<UnitTypeEntity>>({} as PageEntity<UnitTypeEntity>);
    const [typeSearchRequest, setTypeSearchRequest] = useState<PageSearchDTO>({
        page: 1,
        size: 20,
        is_desc: true,
    } as PageSearchDTO);

    // 通用状态
    const [activeTab, setActiveTab] = useState<'category' | 'type'>('category');
    const [search, setSearch] = useState<string>();
    const [loading, setLoading] = useState(true);
    const [refreshOperate, setRefreshOperate] = useState<boolean>(true);

    useEffect(() => {
        document.title = `单位管理 | ${site.name ?? "Frontleaves Technology"}`;
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

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [getCurrent.system]);

    // 获取数据列表
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            if (activeTab === 'category') {
                const getResp = await GetUnitCategoryPageAPI(categorySearchRequest);
                if (getResp?.output === "Success") {
                    setCategoryList(getResp.data!);
                } else {
                    console.log(getResp);
                    message.error(getResp?.message ?? "获取单位类别列表失败");
                }
            } else {
                const getResp = await GetUnitTypePageAPI(typeSearchRequest);
                if (getResp?.output === "Success") {
                    setTypeList(getResp.data!);
                } else {
                    console.log(getResp);
                    message.error(getResp?.message ?? "获取单位办别列表失败");
                }
            }
            setLoading(false);
        };

        if (refreshOperate) {
            fetchData().then();
            setRefreshOperate(false);
        }
    }, [activeTab, categorySearchRequest, typeSearchRequest, refreshOperate]);

    // 搜索防抖动
    useEffect(() => {
        if (search !== undefined) {
            const timer = setTimeout(() => {
                setLoading(true);
                if (activeTab === 'category') {
                    setCategorySearchRequest({ ...categorySearchRequest, keyword: search } as PageSearchDTO);
                } else {
                    setTypeSearchRequest({ ...typeSearchRequest, keyword: search } as PageSearchDTO);
                }
                setRefreshOperate(true);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [search]);

    const transitionSearch = useTransition(loading ?? 0, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        config: { duration: 100 },
    });

    /**
     * 处理删除操作
     */
    const handleDelete = async (uuid: string) => {
        Modal.confirm({
            title: '确认删除',
            content: `确定要删除这个${activeTab === 'category' ? '单位类别' : '单位办别'}吗？`,
            okText: '确认',
            cancelText: '取消',
            onOk: async () => {
                const deleteResp = activeTab === 'category'
                    ? await DeleteUnitCategoryAPI(uuid)
                    : await DeleteUnitTypeAPI(uuid);

                if (deleteResp?.output === "Success") {
                    message.success(`删除${activeTab === 'category' ? '单位类别' : '单位办别'}成功`);
                    setRefreshOperate(true);
                } else {
                    message.error(deleteResp?.message ?? `删除${activeTab === 'category' ? '单位类别' : '单位办别'}失败`);
                }
            }
        });
    };

    /**
     * 生成分页按钮
     */
    function getPageInfo(): JSX.Element[] {
        const pageInfo: JSX.Element[] = [];
        const list = activeTab === 'category' ? categoryList : typeList;
        const searchRequest = activeTab === 'category' ? categorySearchRequest : typeSearchRequest;
        const setSearchRequest = activeTab === 'category' ? setCategorySearchRequest : setTypeSearchRequest;

        for (let i = 0; i < Math.ceil(list.total / list.size); i++) {
            if (i + 1 === list.current) {
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
                            setSearchRequest({ ...searchRequest, page: i + 1 });
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

    return (
        <>
            <div className={"grid grid-cols-10 gap-4 pb-4"}>
                <div className={"col-span-full lg:col-span-7 flex flex-col gap-2 h-[calc(100vh-117px)]"}>
                    {/* 标签页切换 */}
                    <div className="tabs tabs-boxed">
                        <button className={`tab ${activeTab === 'category' ? 'tab-active' : ''}`}
                            onClick={() => {
                                setActiveTab('category');
                                setCategorySearchRequest({ ...categorySearchRequest, page: 1 });
                                setRefreshOperate(true);
                            }}>单位类别</button>
                        <button className={`tab ${activeTab === 'type' ? 'tab-active' : ''}`}
                            onClick={() => {
                                setActiveTab('type');
                                setTypeSearchRequest({ ...typeSearchRequest, page: 1 });
                                setRefreshOperate(true);
                            }}>单位办别</button>
                    </div>

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
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>名称</th>
                                            <th>简称</th>
                                            <th>英文名</th>
                                            <th>修改时间</th>
                                            <th className={"text-end"}>操作</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {activeTab === 'category' ? (
                                            categoryList.records?.map((category, index) => (
                                                <tr key={category.unit_category_uuid}
                                                    className="transition hover:bg-base-200">
                                                    <td>{index + 1 + (categoryList.current - 1) * categoryList.size}</td>
                                                    <td>{category.name}</td>
                                                    <td>{category.short_name}</td>
                                                    <td>{category.english_name}</td>
                                                    <td>{category.updated_at ? new Date(category.updated_at).toLocaleString() : '-'}</td>
                                                    <td className={"flex justify-end"}>
                                                        <div className="join">
                                                            <button
                                                                onClick={() => navigate(`/admin/unit/category/edit/${category.unit_category_uuid}`)}
                                                                className="join-item btn btn-sm btn-soft btn-info inline-flex">
                                                                <Editor theme="outline" size="12" />
                                                                <span>编辑</span>
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(category.unit_category_uuid!)}
                                                                className="join-item btn btn-sm btn-soft btn-error inline-flex">
                                                                <Delete theme="outline" size="12" />
                                                                <span>删除</span>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            typeList.records?.map((type, index) => (
                                                <tr key={type.unit_type_uuid}
                                                    className="transition hover:bg-base-200">
                                                    <td>{index + 1 + (typeList.current - 1) * typeList.size}</td>
                                                    <td>{type.name}</td>
                                                    <td>{type.short_name}</td>
                                                    <td>{type.english_name}</td>
                                                    <td>{type.updated_at ? new Date(type.updated_at).toLocaleString() : '-'}</td>
                                                    <td className={"flex justify-end"}>
                                                        <div className="join">
                                                            <button
                                                                onClick={() => navigate(`/admin/unit/type/edit/${type.unit_type_uuid}`)}
                                                                className="join-item btn btn-sm btn-soft btn-info inline-flex">
                                                                <Editor theme="outline" size="12" />
                                                                <span>编辑</span>
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(type.unit_type_uuid!)}
                                                                className="join-item btn btn-sm btn-soft btn-error inline-flex">
                                                                <Delete theme="outline" size="12" />
                                                                <span>删除</span>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </animated.div>
                        ))}
                    </CardComponent>

                    {/* 分页 */}
                    <div className={"flex justify-center"}>
                        <div className={"join join-horizontal"}>
                            <button className="transition shadow btn btn-sm join-item border"
                                onClick={() => {
                                    const request = activeTab === 'category' ? categorySearchRequest : typeSearchRequest;
                                    const setRequest = activeTab === 'category' ? setCategorySearchRequest : setTypeSearchRequest;
                                    setRequest({ ...request, page: request.page - 1 });
                                    setRefreshOperate(true);
                                }}
                                disabled={activeTab === 'category' ?
                                    categoryList.current === 1 :
                                    typeList.current === 1}>
                                上一页
                            </button>
                            {getPageInfo()}
                            <button className="transition shadow btn btn-sm join-item border"
                                onClick={() => {
                                    const request = activeTab === 'category' ? categorySearchRequest : typeSearchRequest;
                                    const setRequest = activeTab === 'category' ? setCategorySearchRequest : setTypeSearchRequest;
                                    setRequest({ ...request, page: request.page + 1 });
                                    setRefreshOperate(true);
                                }}
                                disabled={activeTab === 'category' ?
                                    categoryList.current === Math.ceil(categoryList.total / categoryList.size) || Math.ceil(categoryList.total / categoryList.size) === 0 :
                                    typeList.current === Math.ceil(typeList.total / typeList.size) || Math.ceil(typeList.total / typeList.size) === 0}>
                                下一页
                            </button>
                            <select className="join-item transition select select-sm mx-1 border-l-0"
                                value={activeTab === 'category' ? categorySearchRequest.size : typeSearchRequest.size}
                                onChange={(e) => {
                                    const request = activeTab === 'category' ? categorySearchRequest : typeSearchRequest;
                                    const setRequest = activeTab === 'category' ? setCategorySearchRequest : setTypeSearchRequest;
                                    setRequest({ ...request, size: Number(e.target.value) });
                                    setRefreshOperate(true);
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

                <div className={"col-span-full lg:col-span-3 flex flex-col gap-2"}>
                    {/* 搜索栏 */}
                    <CardComponent>
                        <div className="form-control">
                            <div className="input-group">
                                <input type="text"
                                    ref={inputFocus}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder={`搜索${activeTab === 'category' ? '单位类别' : '单位办别'}...`}
                                    className="input input-bordered w-full" />
                                <button className="btn btn-square">
                                    <Search theme="outline" size="18" />
                                </button>
                            </div>
                        </div>
                    </CardComponent>

                    {/* 操作按钮组 */}
                    <CardComponent>
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={() => navigate(`/admin/unit/${activeTab === 'category' ? 'category' : 'type'}/add`)}
                                className="btn btn-primary btn-block inline-flex">
                                <Add theme="outline" size="18" />
                                <span>添加{activeTab === 'category' ? '单位类别' : '单位办别'}</span>
                            </button>
                        </div>
                    </CardComponent>
                </div>
            </div>
        </>
    );
}