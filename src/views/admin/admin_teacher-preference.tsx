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
import {JSX, useEffect, useRef, useState} from "react";
import {CardComponent} from "@/components/card_component.tsx";
import {animated, useTransition} from "@react-spring/web";
import { Search, Star} from "@icon-park/react";
import {PageEntity} from "@/models/entity/page_entity.ts";
import {TeacherPreferenceEntity} from "@/models/entity/teacher_preference_entity.ts";
import {GetTeacherPreferencesPageAPI} from "@/apis/teacher_preferences_api.ts";
import {message} from "antd";
import {PageTeacherPreferenceDTO} from "@/models/dto/page/page_teacher_preference_dto.ts";
import {useDispatch, useSelector} from "react-redux";
import {CurrentInfoStore} from "@/models/store/current_info_store.ts";
import {TeacherLiteEntity} from "@/models/entity/teacher_lite_entity.ts";
import {GetTeacherSimpleListAPI} from "@/apis/teacher_api.ts";
import {GetEnabledSemesterListAPI} from "@/apis/semester_api.ts";
import {SemesterEntity} from "@/models/entity/semester_entity.ts";
import cardImage from "../../assets/images/card-background.webp";


export function AdminTeacherPreference({site}: Readonly<{ site: SiteInfoEntity }>){
    const [loading, setLoading] = useState(true);
    const inputFocus = useRef<HTMLInputElement | null>(null);

    const transitionSearch = useTransition(loading ?? 0, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        config: { duration: 100 },
    });

    const [searchRequest, setSearchRequest] = useState<PageTeacherPreferenceDTO>({
        page: 1,
        size: 20,
        is_desc: true,
        teacher_uuid: "",
        semester_uuid: "",
    } as PageTeacherPreferenceDTO);
    const[teacherPreferencesList, setTeacherPreferencesList] = useState<PageEntity<TeacherPreferenceEntity>>({} as PageEntity<TeacherPreferenceEntity>);
    const dispatch = useDispatch();
    const [refreshOperate, setRefreshOperate] = useState(0);
    const getCurrent = useSelector((state: { current: CurrentInfoStore }) => state.current);
    const [teacherList, setTeacherList] = useState<TeacherLiteEntity[]>([]);
    const [teacherSearch, setTeacherSearch] = useState<string>("");
    const [semesterList, setSemesterList] = useState<SemesterEntity[]>([]);
    const [semesterSearch, setSemesterSearch] = useState<string>("");


    useEffect(() => {
        document.title = `教师课程偏好 | ${site.name ?? "Frontleaves Technology"}`;
    }, [site.name]);



    // 获教师偏好列表
    useEffect(() => {
        const func = async () => {
            const getResp = await GetTeacherPreferencesPageAPI(searchRequest);
            if (getResp?.output === "Success") {
                setTeacherPreferencesList(getResp.data!);
                setLoading(false);
            } else {
                console.log(getResp);
                message.error(getResp?.message ?? "获取教师课程偏好列表失败");
            }
        };
        func().then();
    }, [dispatch, searchRequest, refreshOperate]);


    // 获取教师列表
    useEffect(() => {
        const fetchTeacherList = async () => {
            try {
                const teacherListResp = await GetTeacherSimpleListAPI();
                console.log(teacherListResp);
                if (teacherListResp?.output === "Success" && teacherListResp.data) {
                    setTeacherList(Array.isArray(teacherListResp.data) ? teacherListResp.data : [teacherListResp.data]);
                    console.log("teacherList", teacherList);
                } else {
                    message.error(teacherListResp?.error_message ?? "获取教师列表失败");
                }
            } catch (error) {
                console.error("获取教师列表失败", error);
                message.error("获取教师列表失败");
            }
        };

        fetchTeacherList().then();
    }, []);

    // 获取学期列表
    useEffect(() => {
        const fetchSemesterList = async () => {
            try {
                const getResp = await GetEnabledSemesterListAPI();
                if (getResp?.output === "Success" && getResp.data) {
                    setSemesterList(getResp.data);
                } else {
                    message.error(getResp?.error_message ?? "获取学期列表失败");
                }
            } catch (error) {
                console.error("获取学期列表失败", error);
                message.error("获取学期列表失败");
            }
        };
        fetchSemesterList().then();
    }, []);
    


    function getPageInfo(): JSX.Element[] {
        const pageInfo: JSX.Element[] = [];
        for (let i = 0; i < Math.ceil(teacherPreferencesList.total / teacherPreferencesList.size); i++) {
            if (i + 1 === teacherPreferencesList.current) {
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
            setSearchRequest({
                ...searchRequest,
                teacher_uuid: teacherSearch || undefined,
                semester_uuid: semesterSearch || undefined,
            });
        }, 500);
        return () => clearTimeout(timer);
    }, [teacherSearch, semesterSearch]);


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
                                    <th>教师</th>
                                    <th>学期</th>
                                    <th>星期几</th>
                                    <th>第几节课</th>
                                    <th>偏好程度</th>
                                    <th>偏好原因</th>
                                </tr>
                                </thead>
                                <tbody>
                                {teacherPreferencesList.records.map((record, index) => (
                                    <tr key={record.preference_uuid} className="transition hover:bg-base-200">
                                        <td>{index + 1 + (teacherPreferencesList.current - 1) * teacherPreferencesList.size}</td>
                                        <td className={"text-nowrap"}>{teacherList.filter(teacher => teacher.teacher_uuid === record.teacher_uuid)[0]?.teacher_name || '未知教师'}</td>
                                        <td className={"text-nowrap"}>{semesterList.filter(semester => semester.semester_uuid === record.semester_uuid)[0]?.name || '未知学期'}</td>
                                        <td className="px-4 py-2 text-center">
                                                   {(() => {
                                                       const days = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
                                                       return days[record.day_of_week - 1];
                                                   })()}
                                               </td>
                                        <td className={"text-nowrap"}>{record.time_slot}</td>
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
                                                                           <Star      
                                                                               key={index}
                                                                               theme={index < record.preference_level ? "filled" : "outline"}
                                                                               size="16"
                                                                               className={getStarColor(record.preference_level, index)}
                                                                           />
                                                                       ))}
                                                                   </div>
                                                                   
                                                               </>
                                                           );
                                                       })()}
                                                   </div>
                                               </td>
                                        <td className={"text-nowrap"}>{record.reason}</td>
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
                                onClick={() => setSearchRequest({ ...searchRequest, page: teacherPreferencesList.current - 1 })}
                                disabled={teacherPreferencesList.current === 1}>
                            上一页
                        </button>
                        {getPageInfo()}
                        <button className="transition shadow btn btn-sm join-item border"
                                onClick={() => setSearchRequest({ ...searchRequest, page: teacherPreferencesList.current + 1 })}
                                disabled={teacherPreferencesList.current === Math.ceil(teacherPreferencesList.total / teacherPreferencesList.size)}>
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
            {/* 搜索卡片 */}
            <CardComponent col={3} padding={0} howScreenHide={"lg"}>
                    <img src={cardImage} alt="Card Background" className="w-full h-full object-cover rounded-t-xl"/>
                    <div className="p-4 flex flex-col gap-1">
                        <h2 className="text-xl font-bold">教师偏好列表</h2>
                        <p className="text-base-content text-sm border-l-4 border-base-content ps-2">这里是教师偏好列表，您可以查看、筛选教师偏好信息。</p>
                    </div>
                    <div className="px-4 pb-4 flex gap-3">
                        <div className="w-full">
                            <label className="select select-sm transition flex items-center w-full validator">
                                <select
                                    className="grow ps-1 flex-1"
                                    value={teacherSearch}
                                    onChange={(e) => setTeacherSearch(e.target.value)}
                                >
                                    <option value="">请选择教师</option>
                                    {teacherList.map((teacher) => (
                                        <option key={teacher.teacher_uuid} value={teacher.teacher_uuid}>
                                            {teacher.teacher_name}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>
                        <div className="w-full">
                            <label className="select select-sm transition flex items-center w-full validator">
                                <select
                                    className="grow ps-1 flex-1"
                                    value={semesterSearch}
                                    onChange={(e) => setSemesterSearch(e.target.value)}
                                >
                                    <option value="">请选择学期</option>
                                    {semesterList.map((semester) => (
                                        <option key={semester.semester_uuid} value={semester.semester_uuid}>
                                            {semester.name}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>
                    </div>
                </CardComponent>
        </div>
    </>
)

}