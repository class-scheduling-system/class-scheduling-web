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

import {Link, useLocation, useNavigate, useParams} from "react-router";
import {SiteInfoEntity} from "../../../models/entity/site_info_entity.ts";
import {JSX, useEffect, useState} from "react";
import {CampusDTO} from "../../../models/dto/campus_dto.ts";
import {
    ApplicationEffect,
    BarCode,
    CheckOne,
    ConnectAddressOne,
    DocDetail,
    Editor,
    Info,
    Refresh,
    Return,
    School, ViewList
} from "@icon-park/react";
import { message } from "antd";
import { EditCampusAPI } from "../../../apis/campus_api.ts";

export function CampusEdit({site}: Readonly<{ site: SiteInfoEntity }>): JSX.Element {
    useEffect(() => {
        document.title = `编辑校区 | ${site.name ?? "Frontleaves Technology"}`;
    }, [site.name]);
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const { campusUuid } = useParams();
    const campusInfo = location.state?.CampusInfo;

    const [data, setData] = useState<CampusDTO>({} as CampusDTO);


    // 初始化表单信息
    useEffect(() => {
        if (campusInfo) {
            setData({
                campus_name: campusInfo.campus_name,
                campus_code:campusInfo.campus_code,
                campus_desc: campusInfo.campus_desc,
                campus_status: campusInfo.campus_status,
                campus_address: campusInfo.campus_address,
            });
            setLoading(false);
        } else {
            // 如果没有传递教师信息，返回教师列表页面
            message.error("未找到校区信息");
            navigate("/admin/campus");
        }
    }, [campusInfo, navigate]);

    // 提交表单
    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        try {
            const getResp = await EditCampusAPI(campusUuid || '', data);
            if (getResp?.output === "Success") {
                message.success("编辑校区成功");
                navigate("/admin/campus");
            } else {
                message.error(getResp?.error_message ?? "编辑校区失败");
            }
        } catch (error) {
            console.error("编辑校区失败:", error);
            message.error("编辑校区失败");
        }
    }

    // 重置表单
    const resetForm = () => {
        if (campusInfo) {
            // 重置为初始教师信息
            setData({
                campus_name: campusInfo.campus_name,
                campus_code:campusInfo.campus_code,
                campus_desc: campusInfo.campus_desc,
                campus_status: campusInfo.campus_status,
                campus_address: campusInfo.campus_address,
            });
            message.success("表单已重置");
        }
    };


    return (
        <div className="flex flex-col gap-6">
            {/* 顶部导航 */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <Link to={"/admin/campus"} className="btn btn-circle btn-sm btn-ghost">
                        <Return theme="outline" size="22"/>
                    </Link>
                    <h2 className="text-2xl font-bold">编辑校区</h2>
                </div>
            </div>

            {loading ? (
                // 加载中显示骨架屏
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {Array(6).fill(0).map((_, index) => (
                        <div key={index} className="animate-pulse rounded-lg bg-base-200 p-4">
                            <div className="h-5 bg-base-300 rounded w-1/3 mb-3"></div>
                            <div className="h-10 bg-base-300 rounded w-full"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="w-full space-y-6">
                    {/* 基本信息卡片 - 水平布局 */}
                    <div className="card bg-base-100 shadow-lg border border-base-200 overflow-hidden">
                        <div className="bg-primary/10 p-4 flex items-center space-x-2">
                            <Editor theme="outline" size="20" className="text-primary"/>
                            <h2 className="card-title text-lg m-0">编辑校区信息</h2>
                        </div>

                        <div className="card-body p-6">
                            <form id="user_edit" onSubmit={onSubmit} className=" flex flex-col h-full space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <fieldset className="flex flex-col">
                                        <legend className="flex items-center space-x-1 mb-1 text-sm">
                                            <School theme="outline" size="14"/>
                                            <span>校区名</span>
                                        </legend>
                                        <input
                                            type="text"
                                            className="input input-sm w-full validator"
                                            required
                                            value={data.campus_name || ""}
                                            onChange={(e) => setData({ ...data, campus_name: e.target.value })}
                                        />
                                    </fieldset>
                                    <fieldset className="flex flex-col">
                                        <legend className="flex items-center space-x-1 mb-1 text-sm">
                                            <BarCode theme="outline" size="14"/>
                                            <span>校区编码</span>
                                        </legend>
                                        <input
                                            type="text"
                                            className="input input-sm w-full validator"
                                            value={data.campus_code || ""}
                                            onChange={(e) => setData({ ...data, campus_code: e.target.value })}
                                        />
                                    </fieldset>
                                    <fieldset className="flex flex-col">
                                        <legend className="flex items-center space-x-1 mb-1 text-sm">
                                            <DocDetail theme="outline" size="14"/>
                                            <span>校区描述</span>
                                        </legend>
                                        <input
                                            type="text"
                                            className="input input-sm w-full validator"
                                            required
                                            value={data.campus_desc || ""}
                                            onChange={(e) => setData({ ...data, campus_desc: e.target.value })}
                                        />
                                    </fieldset>
                                    <fieldset className="flex flex-col">
                                        <legend className="flex items-center space-x-1 mb-1 text-sm">
                                            <ApplicationEffect theme="outline" size="14"/>
                                            <span>状态</span>
                                        </legend>
                                        <select
                                            className="select select-sm w-full validator"
                                            value={data.campus_status !== undefined ? String(data.campus_status) : ""}
                                            onChange={(e) => setData({...data, campus_status: e.target.value === "true"})}
                                            required
                                        >
                                            <option value="" disabled>
                                                请选择状态
                                            </option>
                                            <option value="true">启用</option>
                                            <option value="false">禁用</option>
                                        </select>
                                    </fieldset>
                                    <fieldset className="flex flex-col">
                                        <legend className="flex items-center space-x-1 mb-1 text-sm">
                                            <ConnectAddressOne theme="outline" size="14"/>
                                            <span>校区地址</span>
                                        </legend>
                                        <input
                                            type="text"
                                            className="input input-sm w-full validator"
                                            required
                                            value={data.campus_address || ""}
                                            onChange={(e) => setData({ ...data, campus_address: e.target.value })}
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
                                    >
                                        <CheckOne theme="outline" size="14"/>
                                        <span>提交</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* 信息展示和操作提示 - 水平并排卡片 */}
                    <div className="grid grid-cols-6 gap-6">
                        {/* 当前校区信息卡片 */}
                        <div className="card col-span-3 bg-base-100 shadow-lg border border-base-200 overflow-hidden h-full">
                            <div className="bg-info/10 p-4 flex items-center space-x-2">
                                <ViewList theme="outline" size="18"/>
                                <h2 className="card-title text-lg m-0">当前校区信息</h2>
                            </div>

                            <div className="card-body">
                                <div className="space-y-3">
                                    <div className="grid grid-cols-2 gap-2 items-center">
                                            <span className="text-sm text-gray-600 font-medium flex items-center space-x-2">
                                                <School theme="outline" size="14" className="text-secondary"/>
                                                <span>校区名</span>
                                            </span>
                                        <span className="text-right text-gray-800">{campusInfo?.campus_name || data.campus_name}</span>
                                    </div>
                                    <div className="border-b border-gray-200"></div>
                                    <div className="grid grid-cols-2 gap-2 items-center">
                                            <span className="text-sm text-gray-600 font-medium flex items-center space-x-2">
                                                <BarCode theme="outline" size="14" className="text-secondary"/>
                                                <span>校区编码</span>
                                            </span>
                                        <span className="text-right  text-gray-800">{campusInfo?.campus_code}</span>
                                    </div>
                                    <div className="border-b border-gray-200"></div>
                                    <div className="grid grid-cols-2 gap-2 items-center">
                                            <span className="text-sm text-gray-600 font-medium flex items-center space-x-2">
                                                <DocDetail theme="outline" size="14" className="text-secondary"/>
                                                <span>校区描述</span>
                                            </span>
                                        <span className="text-right  text-gray-800">{campusInfo?.campus_desc || data.campus_desc}</span>
                                    </div>
                                    <div className="border-b border-gray-200"></div>
                                    <div className="grid grid-cols-2 gap-2 items-center">
                                            <span className="text-sm text-gray-600 font-medium flex items-center space-x-2">
                                                <ConnectAddressOne theme="outline" size="14" className="text-secondary"/>
                                                <span>校区地址</span>
                                            </span>
                                        <span className="text-right  text-gray-800">{campusInfo?.campus_address || data.campus_address}</span>
                                    </div>
                                    <div className="border-b border-gray-200"></div>
                                    <div className="grid grid-cols-2 gap-2 items-center">
                                            <span className="text-sm text-gray-600 font-medium flex items-center space-x-2">
                                                <ApplicationEffect theme="outline" size="14" className="text-secondary" />
                                                <span>校区状态</span>
                                            </span>
                                        <div className="text-right">
                                            <div className={`badge badge-outline ${campusInfo?.campus_status? "badge-success" : "badge-error"} font-medium`}>
                                                {campusInfo?.campus_status? "启用" : "禁用"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 操作提示卡片 */}
                        <div className="card col-span-3 bg-base-100 shadow-lg border border-base-200 overflow-hidden h-full">
                            <div className="bg-secondary/10 p-4 flex items-center space-x-2">
                                <Info theme="outline" size="18" className="text-secondary"/>
                                <h2 className="card-title text-lg m-0">操作提示</h2>
                            </div>

                            <div className="card-body">
                                <li className="flex items-start">
                                    <span className="text-secondary mr-2">•</span>
                                    <span>校区名称为必填项，请确保填写准确</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-secondary mr-2">•</span>
                                    <span>校区编码应保持唯一性，用于系统内部识别</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-secondary mr-2">•</span>
                                    <span>校区描述应简明扼要地概述校区特点</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-secondary mr-2">•</span>
                                    <span>禁用状态的校区将不会在前台页面显示</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-secondary mr-2">•</span>
                                    <span>校区地址应填写完整，便于定位和导航</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-secondary mr-2">•</span>
                                    <span>修改校区信息会影响关联的班级和学生数据</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-secondary mr-2">•</span>
                                    <span>重置按钮可恢复表单到初始状态</span>
                                </li>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}