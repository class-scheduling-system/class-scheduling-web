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

import {SiteInfoEntity} from "@/models/entity/site_info_entity.ts";
import {JSX, useEffect, useState} from "react";
import {GetMyTeacherPreferencesPageAPI} from "@/apis/teacher_preferences_api.ts";
import {
    PageTeacherPreferenceSearchDTO
} from "@/models/dto/page/page_teacher_preference_search_dto.ts";
import {PageEntity} from "@/models/entity/page_entity.ts";
import {TeacherPreferenceEntity} from "@/models/entity/teacher_preference_entity.ts";
import {animated, useTransition} from "@react-spring/web";
import {message} from "antd";
import {CardComponent} from "@/components/card_component.tsx";
import {Add, Delete, Editor, Newlybuild, Search} from "@icon-park/react";
import { useSelector } from "react-redux";
import { CurrentInfoStore } from "@/models/store/current_info_store.ts";
import { useRef } from "react";
import cardImage from "@/assets/images/card-background.webp";
import { TeacherDeleteTeacherPreferencesDialog } from "@/components/teacher/teacher_teacher_preferences_delete_dialog.tsx";
import { useNavigate } from "react-router";
import { Star as StarFilled } from "@icon-park/react";

export function TeacherPreferences({ site }: Readonly<{
    site: SiteInfoEntity
}>) {

    const [myTeacherPreferencesList, setMyTeacherPreferencesList] = useState<PageEntity<TeacherPreferenceEntity>>({} as PageEntity<TeacherPreferenceEntity>);
    const [searchRequest, setSearchRequest] = useState<PageTeacherPreferenceSearchDTO>({
        page: 1,
        size: 20,
        is_desc: true,
        semester_uuid:"",
    } as PageTeacherPreferenceSearchDTO);
    const [loading, setLoading] = useState(true);
    const getCurrent = useSelector((state: { current: CurrentInfoStore }) => state.current);
    const inputFocus = useRef<HTMLInputElement | null>(null);
    const [search, setSearch] = useState<string>("");
    const [deleteDialog, setDeleteDialog] = useState<boolean>(false);
    const [preferenceUuid, setPreferenceUuid] = useState<string>("");
    const navigate = useNavigate();

    useEffect(() => {
        document.title = `教师课程偏好管理 | ${site.name ?? "Frontleaves Technology"}`;
    }, [site.name]);

    // 获取教师课程偏好列表
    useEffect(() => {
        const fetchMyTeacherPreferencesList = async () => {
            const getResp = await GetMyTeacherPreferencesPageAPI(searchRequest);
            if (getResp?.output === "Success") {
                const teachers = getResp.data!.records;
                setMyTeacherPreferencesList({
                    ...getResp.data!,
                    records: teachers
                });
                console.log(getResp.data);
                setLoading(false);
            } else {
                console.log(getResp);
                message.error(getResp?.error_message ?? "获取教师列表失败");
                setLoading(false);
            }
        };
        fetchMyTeacherPreferencesList().then();
    }, [searchRequest]);

    // 搜索防抖动
    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            setSearchRequest({...searchRequest, semester_uuid: search});
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);


    const transitionSearch = useTransition(loading ?? 0, {
        from: {opacity: 0},
        enter: {opacity: 1},
        config: {duration: 100},
    });


    function getPageInfo(): JSX.Element[] {
        const pageInfo: JSX.Element[] = [];
        for (let i = 0; i < Math.ceil(myTeacherPreferencesList.total / myTeacherPreferencesList.size); i++) {
            if (i + 1 === myTeacherPreferencesList.current) {
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

    function handleDeleteTeacherPreferences(preferenceUuid: string): void {
        setDeleteDialog(true);
        setPreferenceUuid(preferenceUuid);
    }

    function handleAddTeacherPreferences(): void {
        navigate("/teacher/teacher-preferences/add");
    }

    function handleEditTeacherPreferences(preferenceInfo: TeacherPreferenceEntity): void {
        navigate(`/teacher/teacher-preferences/edit/${preferenceInfo.preference_uuid}`, {
            state: { preferenceInfo: preferenceInfo }
        });
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
                                       <th>学期</th>
                                       <th>星期几</th>
                                       <th>第几节课</th>
                                       <th>偏好程度</th>
                                       <th>偏好原因</th>
                                       <th className={"text-end"}>操作</th>
                                   </tr>
                                   </thead>
                                   <tbody>
                                   {
                                       myTeacherPreferencesList.records?.map((myTeacherPreferences, index) => (
                                           <tr
                                               key={myTeacherPreferences.preference_uuid}
                                               className="transition hover:bg-base-200"
                                           >
                                               <td>{index + 1 + (myTeacherPreferencesList.current - 1) * myTeacherPreferencesList.size}</td>
                                               <td className="px-4 py-2 text-center">{myTeacherPreferences.semester_uuid}</td>
                                               <td className="px-4 py-2 text-center">
                                                   {(() => {
                                                       const days = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
                                                       return days[myTeacherPreferences.day_of_week - 1];
                                                   })()}
                                               </td>
                                               <td className="px-4 py-2 text-center">第{myTeacherPreferences.time_slot}节</td>
                                               <td className={"text-nowrap"}>
                                                   <div className="flex flex-col gap-1">
                                                       {(() => {
                                                           const getStarColor = (level: number, starIndex: number) => {
                                                               if (starIndex >= level) return 'text-gray-300';
                                                               switch (level) {
                                                                   case 1: return 'text-error';
                                                                   case 2: return 'text-warning';
                                                                   case 3: return 'text-info';
                                                                   case 4: return 'text-accent';
                                                                   case 5: return 'text-success';
                                                                   default: return 'text-gray-300';
                                                               }
                                                           };
                                                           
                                                           const getProgressColor = (level: number) => {
                                                               switch (level) {
                                                                   case 1: return 'progress-error';
                                                                   case 2: return 'progress-warning';
                                                                   case 3: return 'progress-info';
                                                                   case 4: return 'progress-accent';
                                                                   case 5: return 'progress-success';
                                                                   default: return 'progress-neutral';
                                                               }
                                                           };

                                                           return (
                                                               <>
                                                                   <div className="flex items-center gap-1">
                                                                       {Array.from({ length: 5 }).map((_, index) => (
                                                                           <StarFilled
                                                                               key={index}
                                                                               theme={index < myTeacherPreferences.preference_level ? "filled" : "outline"}
                                                                               size="16"
                                                                               className={getStarColor(myTeacherPreferences.preference_level, index)}
                                                                           />
                                                                       ))}
                                                                   </div>
                                                                   <progress 
                                                                       className={`progress ${getProgressColor(myTeacherPreferences.preference_level)} w-full h-2`} 
                                                                       value={myTeacherPreferences.preference_level * 20} 
                                                                       max="100"
                                                                   ></progress>
                                                               </>
                                                           );
                                                       })()}
                                                   </div>
                                               </td>
                                               <td className={"text-nowrap"}>{myTeacherPreferences.reason}</td>
                                            
                                               <td className={"flex justify-end"}>
                                                   <div className="join">
                                                       <button
                                                           onClick={() => handleEditTeacherPreferences(myTeacherPreferences)}
                                                           className="join-item btn btn-sm btn-soft btn-primary inline-flex">
                                                           <Editor theme="outline" size="14"/>
                                                       </button>
                                                    
                                                       <button
                                                           onClick={() => handleDeleteTeacherPreferences(myTeacherPreferences.preference_uuid!)}
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
                   <div className="flex justify-center flex-shrink-0 mt-2">
                            <div className={"join join-horizontal"}>
                                <button className="transition shadow btn btn-sm join-item border"
                                    onClick={() => setSearchRequest({ ...searchRequest, page: myTeacherPreferencesList.current - 1 })}
                                    disabled={myTeacherPreferencesList.current === 1}>
                                    上一页
                                </button>
                                {getPageInfo()}
                                <button className="transition shadow btn btn-sm join-item border"
                                    onClick={() => setSearchRequest({ ...searchRequest, page: myTeacherPreferencesList.current + 1 })}
                                    disabled={myTeacherPreferencesList.current === Math.ceil(myTeacherPreferencesList.total / myTeacherPreferencesList.size)}>
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
               <CardComponent col={3} padding={0} howScreenHide={"lg"}>
                   <img src={cardImage} alt="Card Background" className="w-full h-full object-cover rounded-t-xl"/>
                   <div className="p-4 flex flex-col gap-1">
                       <h2 className="text-xl font-bold">教师课程偏好列表</h2>
                       <p className="text-base-content text-sm border-l-4 border-base-content ps-2">这里是教师课程偏好列表，您可以查看、编辑和删除教师课程偏好信息。</p>
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
                           <button 
                                onClick={handleAddTeacherPreferences}
                                 className="transition shadow btn btn-outline btn-primary">
                               <Add theme="outline" size="16"/>
                               <span>添加</span>
                           </button>
                           <button className="transition shadow btn btn-outline btn-secondary">
                               <Newlybuild theme="outline" size="16"/>
                               <span>批量导入</span>
                           </button>
                       </div>
                   </div>
               </CardComponent>
           </div>

           <TeacherDeleteTeacherPreferencesDialog
             show={deleteDialog}
             emit={setDeleteDialog}
             preferenceUuid={preferenceUuid} 
             onDeletedSuccess={() => {}} 
             />
       </>
    );
}
