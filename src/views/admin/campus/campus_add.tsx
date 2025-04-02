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

import { AddUser, CheckOne, Info, Refresh, Return } from "@icon-park/react";
import { SiteInfoEntity } from "../../../models/entity/site_info_entity.ts";
import { JSX, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { CampusDTO } from "../../../models/dto/campus_dto.ts";
import { AddCampusAPI } from "../../../apis/campus_api.ts";
import { message } from "antd";
import { useDispatch } from "react-redux";
import { addRecord, setThisPage } from "../../../stores/ai_form_chat.ts";
import { HtmlRecordStore } from "@/models/store/ai_form_store.ts";

export function CampusAdd({ site }: Readonly<{ site: SiteInfoEntity }>): JSX.Element {
    const dispatch = useDispatch();

    const [data, setData] = useState<CampusDTO>({} as CampusDTO);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = `添加校区 | ${site.name ?? "Frontleaves Technology"}`;

        // 保存原有的onload处理函数（如果存在）
        const originalOnload = window.onload;

        // 设置新的onload处理函数
        window.onload = () => {
            // 获取表单中的所有可输入操作元素
            const element = document.querySelectorAll('input, select, textarea');

            // 遍历所有可输入元素
            element.forEach(ele => {
                // 基本属性
                const record: Partial<HtmlRecordStore> = {
                    type: '',
                    value: '',
                    required: false,
                    readonly: false,
                };
                
                // 根据元素类型设置特定属性
                if (ele instanceof HTMLInputElement || ele instanceof HTMLTextAreaElement) {
                    record.type = ele.type;
                    record.value = ele.value;
                    record.placeholder = ele.placeholder;
                    record.required = ele.required;
                    record.readonly = ele.readOnly;
                } else if (ele instanceof HTMLSelectElement) {
                    record.type = 'select';
                    record.value = ele.value;
                    record.required = ele.required;
                    // select元素没有placeholder和readOnly属性
                }
                
                // 使用元素ID作为键
                const elementId = ele.id || `element_${Math.random().toString(36).substr(2, 9)}`;
                dispatch(addRecord({
                    key: elementId,
                    value: record as HtmlRecordStore
                }));
            });
            
            // 设置当前页面
            dispatch(setThisPage("添加校区"));

            // 清理函数
            return () => {
                window.onload = originalOnload; // 还原原始的onload
            };
        }
    }, [site.name, dispatch]);

    // 提交表单
    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        try {
            const getResp = await AddCampusAPI(data);
            if (getResp?.output === "Success") {
                message.success("添加校区成功");
                navigate("/admin/campus");
            } else {
                message.error(getResp?.error_message ?? "添加校区失败");
            }
        } catch (error) {
            console.error("添加校区失败:", error);
            message.error("添加校区失败");
        }
    }

    // 重置表单
    const resetForm = () => {
        setData(
            {
                campus_name: "",
                campus_code: "",
                campus_desc: "",
                campus_address: "",
            } as CampusDTO);
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center space-x-2">
                <Link to={"/admin/campus"}>
                    <Return theme="outline" size="24" />
                </Link>
                <h2 className="text-2xl font-bold flex items-center space-x-2">
                    <span>添加新校区</span>
                </h2>
            </div>

            <div className="w-full">
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="lg:col-span-8 md:col-span-12 sm:col-span-12 flex">
                        <div className="card card-border bg-base-100 w-full shadow-md">
                            <h2 className="card-title bg-primary/10 rounded-t-lg p-3"><AddUser theme="outline" size="18" />添加校区信息</h2>
                            <div className="card-body">
                                <form id="campus_add" onSubmit={onSubmit} className="flex flex-col flex-grow space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                                        <fieldset className="flex flex-col">
                                            <legend className="flex items-center space-x-1 mb-1 text-sm">
                                                <span>校区名</span>
                                                <span className="text-red-500">*</span>
                                            </legend>
                                            <input
                                                id="campus_name"
                                                type="text"
                                                className="input input-sm w-full validator"
                                                value={data.campus_name || ""}
                                                onChange={(e) => setData({ ...data, campus_name: e.target.value })}
                                            />
                                        </fieldset>
                                        <fieldset className="flex flex-col">
                                            <legend className="flex items-center space-x-1 mb-1 text-sm">
                                                <span>校区编码</span>
                                                <span className="text-red-500">*</span>
                                            </legend>
                                            <input
                                                id="campus_code"
                                                type="text"
                                                className="input input-sm w-full validator"
                                                value={data.campus_code || ""}
                                                onChange={(e) => setData({ ...data, campus_code: e.target.value })}
                                            />
                                        </fieldset>

                                        <fieldset className="flex flex-col">
                                            <legend className="flex items-center space-x-1 mb-1 text-sm">
                                                <span>校区描述</span>
                                                <span className="text-red-500">*</span>
                                            </legend>
                                            <input
                                                id="campus_desc"
                                                type="text"
                                                className="input input-sm w-full validator"
                                                value={data.campus_desc || ""}
                                                onChange={(e) => setData({ ...data, campus_desc: e.target.value })}
                                            />
                                        </fieldset>
                                        <fieldset className="flex flex-col">
                                            <legend className="flex items-center space-x-1 mb-1 text-sm">
                                                <span>校区状态</span>
                                                <span className="text-red-500">*</span>
                                            </legend>
                                            <select
                                                id="campus_status"
                                                className="select select-sm w-full validator"
                                                value={data.campus_status !== undefined ? String(data.campus_status) : ""}
                                                onChange={(e) => setData({ ...data, campus_status: e.target.value === "true" })}
                                            >
                                                <option value="" disabled>请选择状态</option>
                                                <option value="true">启用</option>
                                                <option value="false">禁用</option>
                                            </select>
                                        </fieldset>
                                        <fieldset className="flex flex-col">
                                            <legend className="flex items-center space-x-1 mb-1 text-sm">
                                                <span>校区地址</span>
                                                <span className="text-red-500">*</span>
                                            </legend>
                                            <input
                                                id="campus_address"
                                                type="text"
                                                className="input input-sm w-full validator"
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
                                            <Refresh theme="outline" size="14" />
                                            <span>重置</span>
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-sm btn-primary"
                                        >
                                            <CheckOne theme="outline" size="14" />
                                            <span>提交</span>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-4 md:col-span-12 sm:col-span-12">
                        <div className="card card-border bg-base-100 w-full  shadow-md">
                            <h2 className="card-title bg-secondary/10 rounded-t-lg p-3"><Info theme="outline" size="18" />操作提示</h2>
                            <div className="card-body">
                                <ul className="space-y-1 text-gray-700">
                                    <li className="flex items-start">
                                        <span className="text-secondary mr-2">•</span>
                                        <span>加*为必填项</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-secondary mr-2">•</span>
                                        <span>校区名称应清晰区分不同校区</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-secondary mr-2">•</span>
                                        <span>校区编码为唯一标识，建议使用简短代码</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-secondary mr-2">•</span>
                                        <span>校区描述可填写校区特点或简介</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-secondary mr-2">•</span>
                                        <span>启用状态的校区可正常使用，禁用状态将不可用</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-secondary mr-2">•</span>
                                        <span>校区地址应填写详细位置信息</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-secondary mr-2">•</span>
                                        <span>重置按钮可恢复表单到初始状态</span>
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