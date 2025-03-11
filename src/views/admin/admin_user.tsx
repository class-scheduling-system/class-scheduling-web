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
import {Add, CheckSmall, Correct, Delete, Editor, Error, Forbid, Newlybuild, Search} from "@icon-park/react";
import {AdminAddUserDialog} from "../../components/admin/admin_user_add_dialog.tsx";
import {AdminEditUserDialog} from "../../components/admin/admin_user_edit_dialog.tsx";
import {AdminDeleteUserDialog} from "../../components/admin/admin_user_delete_dialog.tsx";
import {GetUserListAPI} from "../../apis/user_api.ts";
import {animated, useTransition} from "@react-spring/web";
import {SiteInfoEntity} from "../../models/entity/site_info_entity.ts";
import {PageSearchDTO} from "../../models/dto/page_search_dto.ts";
import {message} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {CurrentInfoStore} from "../../models/store/current_info_store.ts";
import {PageEntity} from "../../models/entity/page_entity.ts";
import {CardComponent} from "../../components/card_component.tsx";
import {LabelComponent} from "../../components/label_component.tsx";
import cardImage from "../../assets/images/card-background.webp";
import {UserInfoEntity} from "../../models/entity/user_info_entity.ts";
import {UserAddDTO} from "../../models/dto/user_add_dto.ts";

export function AdminUser({ site }: Readonly<{ site: SiteInfoEntity }>): JSX.Element {
    const dispatch = useDispatch();
    const getCurrent = useSelector((state: { current: CurrentInfoStore }) => state.current);
    const inputFocus = useRef<HTMLInputElement | null>(null);

    const [userList, setUserList] = useState<PageEntity<UserInfoEntity>>({
        records: new Array(5).fill({}) as UserInfoEntity[],
    } as PageEntity<UserInfoEntity>);
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
    const [deleteUserUuid, setDeleteUserUuid] = useState("");
    const [dialogEdit, setDialogEdit] = useState<boolean>(false);
    const [editUserUuid, setEditUserUuid] = useState("");
    // 新增状态：保存编辑时对应的用户数据
    const [editUserData, setEditUserData] = useState<UserAddDTO | null>(null);

    useEffect(() => {
        document.title = `用户管理 | ${site.name ?? "Frontleaves Technology"}`;
    }, [site.name]);

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

    useEffect(() => {
        const func = async () => {
            const getResp = await GetUserListAPI(searchRequest);
            if (getResp?.output === "Success") {
                setLoading(false);
                setUserList(getResp.data!);
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
    const refreshUserList = async () => {
        setLoading(true);
        const getResp = await GetUserListAPI(searchRequest);
        if (getResp?.output === "Success") {
            setUserList(getResp.data!);
        } else {
            message.error(getResp?.error_message ?? "获取用户列表失败");
        }
        setLoading(false);
    };

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
            <div className={"grid grid-cols-10 gap-4 pb-4"}>
                <div className={"col-span-full md:col-span-7 flex flex-col gap-2 h-[calc(100vh-117px)]"}>
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
                                        <th>用户名</th>
                                        <th>角色</th>
                                        <th>邮箱</th>
                                        <th>状态</th>
                                        <th>封禁</th>
                                        <th className={"text-end"}>操作</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {userList.records.map((record, index) => (
                                        <tr key={record.user.user_uuid} className="transition hover:bg-base-200">
                                            <td>{index + 1 + (userList.current - 1) * userList.size}</td>
                                            <td>{record.user.name}</td>
                                            <td>{record.user.role.role_name}</td>
                                            <td>{record.user.email}</td>
                                            <td>{record.user.status ? (
                                                <LabelComponent size={"badge-sm"} style={"badge-outline"}
                                                                type={"success"} text={"启用"}
                                                                icon={<Correct theme="outline" size="12"/>}/>
                                            ) : (
                                                <LabelComponent size={"badge-sm"} style={"badge-outline"}
                                                                type={"error"}
                                                                text={"禁用"}
                                                                icon={<Error theme="outline" size="12"/>}/>
                                            )}</td>
                                            <td>{record.user.ban ? (
                                                <LabelComponent size={"badge-sm"} style={"badge-outline"}
                                                                type={"error"}
                                                                text={"已封禁"}
                                                                icon={<Forbid theme="outline" size="12" />}/>
                                            ) : (
                                                <LabelComponent size={"badge-sm"} style={"badge-outline"}
                                                                type={"success"} text={"未封禁"}
                                                                icon={<CheckSmall theme="outline" size="12" />}/>
                                            )}</td>
                                            <td className={"flex justify-end"}>
                                                <div className="join">
                                                    <button
                                                        onClick={() => {
                                                            // 同时传递 userUuid 和用户数据（直接从列表获取）
                                                            setEditUserUuid(record.user.user_uuid);
                                                            setEditUserData(record.user);
                                                            setDialogEdit(true);
                                                        }}
                                                        className="join-item btn btn-sm btn-soft btn-info inline-flex">
                                                        <Editor theme="outline" size="12" />
                                                        <span>编辑</span>
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setDeleteUserUuid(record.user.user_uuid);
                                                            setDialogDelete(true);
                                                        }}
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
                <CardComponent col={3} padding={0} howScreenHide={"md"} className={"overflow-y-auto"}>
                    <img src={cardImage} alt="Card Background" className="w-full h-full object-cover rounded-t-xl" />
                    <div className="p-4 flex flex-col gap-1">
                        <h2 className="text-xl font-bold">用户列表</h2>
                        <p className="text-base-content text-sm border-l-4 border-base-content ps-2">
                            这里是所有用户的列表，你可以在这里查看、编辑和删除用户信息。
                        </p>
                    </div>
                    <div className="px-4 pb-4 flex flex-col gap-3">
                        <div>
                            <label className="input transition w-full">
                                <Search theme="outline" size="12" />
                                <input ref={inputFocus} type="search" className="grow" placeholder="查询"
                                       onChange={(event) => setSearch(event.target.value)} />
                                <kbd className="kbd kbd-sm">{getCurrent.system ? "⌘" : "Ctrl"}</kbd>
                                <kbd className="kbd kbd-sm">K</kbd>
                            </label>
                        </div>
                        <div className={"grid grid-cols-2 gap-3"}>
                            <button onClick={() => setDialogAdd(true)}
                                    className="transition shadow btn btn-outline btn-primary">
                                <Add theme="outline" size="16" />
                                <span>添加</span>
                            </button>
                            <button className="transition shadow btn btn-outline btn-secondary">
                                <Newlybuild theme="outline" size="16" />
                                <span>批量导入</span>
                            </button>
                        </div>
                    </div>
                </CardComponent>
            </div>
            {/* 删除用户对话框 */}
            <AdminDeleteUserDialog
                show={dialogDelete}
                emit={setDialogDelete}
                userUuid={deleteUserUuid}
                onDeletedSuccess={refreshUserList}
            />
            <AdminAddUserDialog
                show={dialogAdd}
                emit={setDialogAdd}
                onAddSuccess={refreshUserList}
            />

            <AdminEditUserDialog
                show={dialogEdit}
                emit={setDialogEdit}
                userUuid={editUserUuid}
                defaultData={editUserData}
                onEditSuccess={refreshUserList}
            />
        </>
    );
}
