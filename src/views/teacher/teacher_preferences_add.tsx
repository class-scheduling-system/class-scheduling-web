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

import React, { useEffect, useState } from "react";
import { SiteInfoEntity } from "@/models/entity/site_info_entity";
import { TeacherEntity } from "@/models/entity/teacher_entity";
import { GetTeacherListAPI } from "@/apis/teacher_api";
import { CreateTeacherPreferenceAPI } from "@/apis/teacher_preferences_api";
import { useNavigate } from "react-router";
import { message } from "antd";
import { TeacherPreferenceDTO } from "@/models/dto/teacher_preference_dto";
import { Return, Info, Calendar, Time, Star, Write, CheckOne, Refresh, AddMode, ListView } from "@icon-park/react";
import { Link } from "react-router";

export function TeacherPreferencesAdd({ site, teacher_uuid }: Readonly<{
    site: SiteInfoEntity;
    teacher_uuid: string;
}>) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [teacherList, setTeacherList] = useState<TeacherEntity[]>([]);

    useEffect(() => {
        document.title = `添加课程偏好 | ${site.name ?? "Frontleaves Technology"}`;
        fetchTeacherList();

    }, [site.name]);

    // 获取教师列表
    const fetchTeacherList = async () => {
        try {
            const teacherListResp = await GetTeacherListAPI({
                page: 1,
                size: 1000,
                is_desc: true
            });
            if (teacherListResp?.output === "Success" && teacherListResp.data) {
                setTeacherList(teacherListResp.data.records);
            } else {
                message.error(teacherListResp?.error_message ?? "获取教师列表失败");
            }
        } catch (error) {
            console.error("获取教师列表失败", error);
            message.error("获取教师列表失败");
        }
    };


    // 处理表单提交
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const values: TeacherPreferenceDTO = {
            teacher_uuid,
            semester_uuid: formData.get('semester_uuid')?.toString() || "",
            day_of_week: Number(formData.get('day_of_week')),
            time_slot: Number(formData.get('time_slot')),
            preference_level: Number(formData.get('preference_level')),
            reason: formData.get('reason')?.toString() || ""
        };

        try {
            const response = await CreateTeacherPreferenceAPI(values);
            if (response?.output === "Success") {
                message.success("添加成功");
                navigate("/teacher/preferences");
            } else {
                message.error(response?.error_message ?? "添加失败");
            }
        } catch (error) {
            console.error("添加课程偏好失败:", error);
            message.error("添加失败");
        } finally {
            setLoading(false);
        }
    };

    // 重置表单
    const resetForm = (form: HTMLFormElement) => {
        form.reset();
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center space-x-2">
                <Link to="/teacher/teacher-preferences">
                    <Return theme="outline" size="24"/>
                </Link>
                <h2 className="text-2xl font-bold flex items-center space-x-2">
                    <span>添加课程偏好</span>
                </h2>
            </div>

            <div className="w-full">
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="lg:col-span-8 md:col-span-12 sm:col-span-12 flex">
                        <div className="card card-border bg-base-100 w-full shadow-md">
                            <h2 className="card-title bg-neutral/10 rounded-t-lg p-3">
                                <AddMode theme="outline" size="18"/>添加偏好信息
                            </h2>
                            <div className="card-body">
                                <form id="preference_add" onSubmit={handleSubmit} className="flex flex-col flex-grow space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                                        <fieldset className="flex flex-col">
                                            <legend className="flex items-center space-x-1 mb-1 text-sm">
                                                <ListView theme="outline" size="14"/>
                                                <span>学期</span>
                                                <span className="text-red-500">*</span>
                                            </legend>
                                            <select 
                                                name="semester_uuid"
                                                className="select select-sm w-full validator"
                                                required
                                            >
                                                <option value="">请选择学期</option>
                                                <option value="1">第一学期</option>
                                                <option value="2">第二学期</option>
                                                <option value="3">第三学期</option>
                                                <option value="4">第四学期</option>
                                                <option value="5">第五学期</option>
                                                <option value="6">第六学期</option>
                                                <option value="7">第七学期</option>
                                                <option value="8">第八学期</option>
                                            </select>
                                        </fieldset>
                                        <fieldset className="flex flex-col">
                                            <legend className="flex items-center space-x-1 mb-1 text-sm">
                                                <Calendar theme="outline" size="14"/>
                                                <span>星期几</span>
                                                <span className="text-red-500">*</span>
                                            </legend>
                                            <select 
                                                name="day_of_week"
                                                className="select select-sm w-full validator"
                                                required
                                            >
                                                <option value="">请选择星期</option>
                                                <option value="1">星期一</option>
                                                <option value="2">星期二</option>
                                                <option value="3">星期三</option>
                                                <option value="4">星期四</option>
                                                <option value="5">星期五</option>
                                                <option value="6">星期六</option>
                                                <option value="7">星期日</option>
                                            </select>
                                        </fieldset>

                                        <fieldset className="flex flex-col">
                                            <legend className="flex items-center space-x-1 mb-1 text-sm">
                                                <Time theme="outline" size="14"/>
                                                <span>第几节课</span>
                                                <span className="text-red-500">*</span>
                                            </legend>
                                            <select 
                                                name="time_slot"
                                                className="select select-sm w-full validator"
                                                required
                                            >
                                                <option value="">请选择课节</option>
                                                <option value="1">第一节</option>
                                                <option value="2">第二节</option>
                                                <option value="3">第三节</option>
                                                <option value="4">第四节</option>
                                                <option value="5">第五节</option>
                                            </select>
                                        </fieldset>

                                        <fieldset className="flex flex-col">
                                            <legend className="flex items-center space-x-1 mb-1 text-sm">
                                                <Star theme="outline" size="14"/>
                                                <span>偏好程度</span>
                                                <span className="text-red-500">*</span>
                                            </legend>
                                            <div className="flex flex-col gap-2">
                                                <div className="rating rating-sm">
                                                    <input type="radio" name="preference_level" value="1" className="mask mask-star-2 bg-red-400" required/>
                                                    <input type="radio" name="preference_level" value="2" className="mask mask-star-2 bg-orange-400" required/>
                                                    <input type="radio" name="preference_level" value="3" className="mask mask-star-2 bg-yellow-400" required/>
                                                    <input type="radio" name="preference_level" value="4" className="mask mask-star-2 bg-lime-400" required/>
                                                    <input type="radio" name="preference_level" value="5" className="mask mask-star-2 bg-green-400" required/>
                                                </div>
                                            </div>
                                        </fieldset>

                                        <fieldset className="flex flex-col">
                                            <legend className="flex items-center space-x-1 mb-1 text-sm">
                                                <Write theme="outline" size="14"/>
                                                <span>原因说明</span>
                                            </legend>
                                            <textarea 
                                                name="reason"
                                                className="textarea textarea-bordered textarea-sm w-full validator h-[38px] resize-none"
                                                placeholder="请详细说明选择该时间段的原因..."
                                                rows={1}
                                            />
                                        </fieldset>
                                    </div>

                                    <div className="card-actions justify-end flex">
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline"
                                            onClick={(e) => resetForm(e.currentTarget.form!)}
                                        >
                                            <Refresh theme="outline" size="14"/>
                                            <span>重置</span>
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-sm btn-primary"
                                            disabled={loading}
                                        >
                                            <CheckOne theme="outline" size="14"/>
                                            <span>{loading ? '提交中...' : '提交'}</span>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4 md:col-span-12 sm:col-span-12">
                        <div className="card card-border bg-base-100 w-full shadow-md">
                            <h2 className="card-title bg-secondary/55 rounded-t-lg p-3">
                                <Info theme="outline" size="18"/>操作提示
                            </h2>
                            <div className="card-body">
                                <ul className="space-y-1 text-gray-700">
                                    <li className="flex items-start">
                                        <span className="text-secondary mr-2">•</span>
                                        <span>星期和课节为必填项</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-secondary mr-2">•</span>
                                        <span>偏好程度范围为1-5，1代表最不喜欢，5代表最喜欢</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-secondary mr-2">•</span>
                                        <span>原因说明可以帮助管理员更好地理解您的选择</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-secondary mr-2">•</span>
                                        <span>提交后可以在偏好列表中查看和管理</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-secondary mr-2">•</span>
                                        <span>重置按钮可以清空所有已填写的内容</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}