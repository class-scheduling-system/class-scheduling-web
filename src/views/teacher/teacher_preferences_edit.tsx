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
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { message } from "antd";
import { TeacherPreferenceDTO } from "@/models/dto/teacher_preference_dto";
import { Return, Info, Calendar, Time, Star, Write, CheckOne, Refresh, Edit, ListView } from "@icon-park/react";
import { UpdateTeacherPreferenceAPI} from "@/apis/teacher_preferences_api";


export function TeacherPreferencesEdit({ site }: Readonly<{
    site: SiteInfoEntity;
}>) {
    const navigate = useNavigate();
    const location = useLocation();
    const preferenceInfo = location.state?.preferenceInfo;
    const { preference_uuid } = useParams();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<TeacherPreferenceDTO>({} as TeacherPreferenceDTO);

    // 设置文档标题
    useEffect(() => {
        document.title = `编辑课程偏好 | ${site.name ?? "Frontleaves Technology"}`;
    }, [site.name]);


    useEffect(() => {
        if (preferenceInfo) {
            // 使用传递过来的教师信息初始化表单
            setData({
                teacher_uuid: preferenceInfo.teacher_uuid,
                semester_uuid: preferenceInfo.semester_uuid,
                day_of_week: preferenceInfo.day_of_week,
                time_slot: preferenceInfo.time_slot,
                preference_level: preferenceInfo.preference_level,
                reason: preferenceInfo.reason,
            });
        } else {
            message.error("未找到课程偏好信息");
            navigate("/teacher/teacher-preferences");
        }
    }, [preferenceInfo, navigate]);


    // 重置表单
    const resetForm = () => {
        if (preferenceInfo) {
        setData({
            teacher_uuid: preferenceInfo.teacher_uuid,
            semester_uuid: preferenceInfo.semester_uuid,
                day_of_week: preferenceInfo.day_of_week,
                time_slot: preferenceInfo.time_slot,
                preference_level: preferenceInfo.preference_level,
                reason: preferenceInfo.reason,
            });
            message.success("表单已重置");
        }
    };


    // 处理表单提交
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        try {
            const response = await UpdateTeacherPreferenceAPI(preference_uuid!, data);
            if (response?.output === "Success") {
                message.success("修改成功");
                navigate("/teacher/teacher-preferences");
            } else {
                message.error(response?.error_message ?? "修改失败");
            }
        } catch (error) {
            console.error("修改课程偏好失败:", error);
            message.error("修改失败");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center space-x-2">
                <Link to="/teacher/teacher-preferences">
                    <Return theme="outline" size="24"/>
                </Link>
                <h2 className="text-2xl font-bold flex items-center space-x-2">
                    <span>编辑课程偏好</span>
                </h2>
            </div>

            <div className="grid grid-cols-12 gap-x-6">
                <div className="lg:col-span-8 md:col-span-12 sm:col-span-12 flex">
                    <div className="card card-border bg-base-100 w-full shadow-md">
                        <h2 className="card-title bg-neutral/10 rounded-t-lg p-3">
                        <Edit theme="outline" size="18"/>编辑偏好信息
                        </h2>
                        <div className="card-body">
                            <form onSubmit={handleSubmit} className="flex flex-col flex-grow space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                                    <fieldset className="flex flex-col">
                                        <legend className="flex items-center space-x-1 mb-1 text-sm">
                                            <ListView theme="outline" size="14"/>
                                            <span>学期</span>
                                            <span className="text-red-500">*</span>
                                        </legend> 
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
                                            value={data.day_of_week}
                                            onChange={(e) => setData({...data, day_of_week: Number(e.target.value)})}
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
                                            value={data.time_slot}
                                            onChange={(e) => setData({...data, time_slot: Number(e.target.value)})}
                                            required
                                        >
                                            <option value="">请选择课节</option>
                                            <option value="1">第一节</option>
                                            <option value="2">第二节</option>
                                            <option value="3">第三节</option>
                                            <option value="4">第四节</option>
                                            <option value="5">第五节</option>
                                            <option value="6">第六节</option>
                                            <option value="7">第七节</option>
                                            <option value="8">第八节</option>
                                            <option value="9">第九节</option>
                                            <option value="10">第十节</option>
                                            <option value="11">第十一节</option>
                                            <option value="12">第十二节</option>
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
                                                {[1,2,3,4,5].map((level) => (
                                                    <input
                                                        key={level}
                                                        type="radio"
                                                        name="preference_level"
                                                        value={level}
                                                        checked={data.preference_level === level}
                                                        onChange={(e) => setData({...data, preference_level: Number(e.target.value)})}
                                                        className={`mask mask-star-2 ${
                                                            level === 1 ? 'bg-red-400' :
                                                            level === 2 ? 'bg-orange-400' :
                                                            level === 3 ? 'bg-yellow-400' :
                                                            level === 4 ? 'bg-lime-400' :
                                                            'bg-green-400'
                                                        }`}
                                                        required
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </fieldset>

                                    <fieldset className="flex flex-col">
                                        <legend className="flex items-center space-x-1 mb-1 text-sm">
                                            <Write theme="outline" size="14"/>
                                            <span>原因说明</span>
                                        </legend>
                                        <input
                                            type="text"
                                            name="reason"
                                            className="input input-sm w-full validator"
                                            placeholder="请输入选择该时间段的原因"
                                            value={data.reason}
                                            onChange={(e) => setData({...data, reason: e.target.value})}
                                        />
                                    </fieldset>
                                </div>

                                <div className="card-actions justify-end flex">
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline"
                                        onClick={resetForm}
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
                                    <span>学期、星期和课节为必填项</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-secondary mr-2">•</span>
                                    <span>偏好程度使用星星评分表示：</span>
                                </li>
                                <li className="flex items-start ml-4">
                                    <span className="text-secondary mr-2">•</span>
                                    <span>1星（红色）：非常不喜欢</span>
                                </li>
                                <li className="flex items-start ml-4">
                                    <span className="text-secondary mr-2">•</span>
                                    <span>2星（橙色）：不喜欢</span>
                                </li>
                                <li className="flex items-start ml-4">
                                    <span className="text-secondary mr-2">•</span>
                                    <span>3星（黄色）：一般</span>
                                </li>
                                <li className="flex items-start ml-4">
                                    <span className="text-secondary mr-2">•</span>
                                    <span>4星（浅绿色）：喜欢</span>
                                </li>
                                <li className="flex items-start ml-4">
                                    <span className="text-secondary mr-2">•</span>
                                    <span>5星（绿色）：非常喜欢</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-secondary mr-2">•</span>
                                    <span>原因说明可以帮助管理员更好地理解您的选择</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-secondary mr-2">•</span>
                                    <span>提交后可以在偏好列表中查看修改结果</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-secondary mr-2">•</span>
                                    <span>重置按钮可以恢复到最初的设置</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}