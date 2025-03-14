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

import {
    Back,
    BuildingOne,
    Calendar,
    CalendarThirty,
    CheckOne,
    CloseOne,
    Notes,
    People,
    PhoneTelephone,
    Sort,
    Tag
} from "@icon-park/react";
import * as React from "react";
import {JSX, useEffect, useState} from "react";
import {DepartmentDTO} from "../../../models/dto/department_dto.ts";
import {DepartmentAddAPI, GetDepartmentListAPI} from "../../../apis/department_api.ts";
import {DepartmentEntity} from "../../../models/entity/department_entity.ts";
import {CardComponent} from "../../../components/card_component.tsx";
import {useNavigate} from "react-router";
import dayjs from "dayjs";
import {SiteInfoEntity} from "../../../models/entity/site_info_entity.ts";
import {message} from "antd";

/**
 * # 部门添加页面
 * > 该函数用于创建一个完整的部门添加页面，管理员可以通过该页面添加新的部门信息。
 *
 * @param site - 站点信息
 * @returns {JSX.Element} 返回一个完整的部门添加页面组件
 */
export function DepartmentAdd({site}: Readonly<{ site: SiteInfoEntity }>): JSX.Element {
    const navigate = useNavigate();

    // 今天的日期
    const today = dayjs().format("YYYY-MM-DD");

    // 初始化表单数据
    const [data, setData] = useState<DepartmentDTO>({
        department_name: "",
        department_code: "",
        department_order: 100,
        is_enabled: true,
        is_entity: true,
        is_attending_college: false,
        is_teaching_college: false,
        is_teaching_office: false,
        establishment_date: today,
        unit_category: "",
        unit_type: ""
    } as DepartmentDTO);

    const [departmentList, setDepartmentList] = useState<DepartmentEntity[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [submitting, setSubmitting] = useState<boolean>(false);

    // 设置页面标题
    useEffect(() => {
        document.title = `添加部门 | ${site.name ?? "Frontleaves Technology"}`;
    }, [site.name]);

    // 获取部门列表，用于选择上级部门
    useEffect(() => {
        const fetchDepartments = async () => {
            setLoading(true);
            try {
                const response = await GetDepartmentListAPI();
                if (response?.output === "Success") {
                    setDepartmentList(response.data!);
                } else {
                    message.warning(response?.error_message ?? "获取部门列表失败");
                }
            } catch (error) {
                console.error("获取部门列表失败:", error);
                message.warning("获取部门列表失败");
            } finally {
                setLoading(false);
            }
        };

        fetchDepartments().then();
    }, []);

    // 返回部门列表页面
    const handleBack = () => {
        navigate("/admin/department");
    };

    // 重置表单
    const handleReset = () => {
        setData({
            department_name: "",
            department_code: "",
            department_order: 100,
            is_enabled: true,
            is_entity: true,
            is_attending_college: false,
            is_teaching_college: false,
            is_teaching_office: false,
            establishment_date: today,
            unit_category: "",
            unit_type: ""
        } as DepartmentDTO);
    };

    // 提交表单
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSubmitting(true);

        try {
            const response = await DepartmentAddAPI(data);
            if (response?.output === "Success") {
                message.success("部门添加成功");
                setTimeout(() => {
                    navigate("/admin/department");
                }, 1500);
            } else {
                message.warning(response?.error_message ?? "部门添加失败");
            }
        } catch (error) {
            console.error("部门添加请求失败:", error);
            message.warning("部门添加失败");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="container mx-auto pb-6">
            {/* 页面标题 */}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold flex items-center">
                    <BuildingOne theme="outline" size="24" className="mr-2" fill="#333"/>
                    添加部门
                </h1>
                <button
                    onClick={handleBack}
                    className="btn btn-outline btn-primary"
                >
                    <Back theme="outline" size="18"/>
                    <span>返回列表</span>
                </button>
            </div>

            {/* 加载中状态 */}
            {loading && (
                <div className="flex justify-center my-8">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
            )}

            {/* 表单卡片 */}
            <CardComponent innerMargin={"p-4"}>
                <form id="department_add" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* 基本信息部分 */}
                        <div className="lg:col-span-3">
                            <h2 className="text-lg font-semibold border-l-4 border-primary pl-3 mb-4">基本信息</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* 部门名称 */}
                                <fieldset className="flex flex-col">
                                    <legend className="flex items-center space-x-1 mb-1 text-sm font-medium">
                                        <BuildingOne theme="outline" size="16" fill="#333"/>
                                        <span>部门名称</span>
                                        <span className="text-red-500">*</span>
                                    </legend>
                                    <input
                                        type="text"
                                        className="input input-bordered w-full"
                                        required
                                        value={data.department_name}
                                        onChange={(e) => setData({...data, department_name: e.target.value})}
                                        placeholder="例如: 计算机科学与技术学院"
                                    />
                                </fieldset>

                                {/* 部门编码 */}
                                <fieldset className="flex flex-col">
                                    <legend className="flex items-center space-x-1 mb-1 text-sm font-medium">
                                        <Tag theme="outline" size="16" fill="#333"/>
                                        <span>部门编码</span>
                                        <span className="text-red-500">*</span>
                                    </legend>
                                    <input
                                        type="text"
                                        className="input input-bordered w-full"
                                        required
                                        value={data.department_code}
                                        onChange={(e) => setData({...data, department_code: e.target.value})}
                                        placeholder="例如: CS001"
                                    />
                                </fieldset>

                                {/* 部门简称 */}
                                <fieldset className="flex flex-col">
                                    <legend className="flex items-center space-x-1 mb-1 text-sm font-medium">
                                        <Tag theme="outline" size="16" fill="#333"/>
                                        <span>部门简称</span>
                                    </legend>
                                    <input
                                        type="text"
                                        className="input input-bordered w-full"
                                        value={data.department_short_name || ""}
                                        onChange={(e) => setData({...data, department_short_name: e.target.value})}
                                        placeholder="例如: 计算机学院"
                                    />
                                </fieldset>

                                {/* 部门英文名称 */}
                                <fieldset className="flex flex-col">
                                    <legend className="flex items-center space-x-1 mb-1 text-sm font-medium">
                                        <Tag theme="outline" size="16" fill="#333"/>
                                        <span>部门英文名称</span>
                                    </legend>
                                    <input
                                        type="text"
                                        className="input input-bordered w-full"
                                        value={data.department_english_name || ""}
                                        onChange={(e) => setData({...data, department_english_name: e.target.value})}
                                        placeholder="例如: School of Computer Science"
                                    />
                                </fieldset>

                                {/* 单位类别 */}
                                <fieldset className="flex flex-col">
                                    <legend className="flex items-center space-x-1 mb-1 text-sm font-medium">
                                        <Tag theme="outline" size="16" fill="#333"/>
                                        <span>单位类别</span>
                                        <span className="text-red-500">*</span>
                                    </legend>
                                    <input
                                        type="text"
                                        className="input input-bordered w-full"
                                        required
                                        value={data.unit_category}
                                        onChange={(e) => setData({...data, unit_category: e.target.value})}
                                        placeholder="例如: 学院/部门/中心"
                                    />
                                </fieldset>

                                {/* 单位办别 */}
                                <fieldset className="flex flex-col">
                                    <legend className="flex items-center space-x-1 mb-1 text-sm font-medium">
                                        <Tag theme="outline" size="16" fill="#333"/>
                                        <span>单位办别</span>
                                        <span className="text-red-500">*</span>
                                    </legend>
                                    <input
                                        type="text"
                                        className="input input-bordered w-full"
                                        required
                                        value={data.unit_type}
                                        onChange={(e) => setData({...data, unit_type: e.target.value})}
                                        placeholder="例如: 教学/科研/行政"
                                    />
                                </fieldset>

                                {/* 部门排序 */}
                                <fieldset className="flex flex-col">
                                    <legend className="flex items-center space-x-1 mb-1 text-sm font-medium">
                                        <Sort theme="outline" size="16" fill="#333"/>
                                        <span>部门排序</span>
                                        <span className="text-red-500">*</span>
                                    </legend>
                                    <input
                                        type="number"
                                        className="input input-bordered w-full"
                                        required
                                        value={data.department_order}
                                        onChange={(e) => setData({...data, department_order: parseInt(e.target.value)})}
                                        placeholder="例如: 100"
                                    />
                                </fieldset>

                                {/* 上级部门 */}
                                <fieldset className="flex flex-col">
                                    <legend className="flex items-center space-x-1 mb-1 text-sm font-medium">
                                        <BuildingOne theme="outline" size="16" fill="#333"/>
                                        <span>上级部门</span>
                                    </legend>
                                    <select
                                        className="select select-bordered w-full"
                                        value={data.parent_department || ""}
                                        onChange={(e) => setData({
                                            ...data,
                                            parent_department: e.target.value || undefined
                                        })}
                                    >
                                        <option value="">无上级部门</option>
                                        {departmentList.map((department) => (
                                            <option key={department.department_uuid} value={department.department_uuid}>
                                                {department.department_name}
                                            </option>
                                        ))}
                                    </select>
                                </fieldset>

                                {/* 成立日期 */}
                                <fieldset className="flex flex-col">
                                    <legend className="flex items-center space-x-1 mb-1 text-sm font-medium">
                                        <Calendar theme="outline" size="16" fill="#333"/>
                                        <span>成立日期</span>
                                        <span className="text-red-500">*</span>
                                    </legend>
                                    <input
                                        type="date"
                                        className="input input-bordered w-full"
                                        required
                                        value={data.establishment_date}
                                        onChange={(e) => setData({
                                            ...data,
                                            establishment_date: e.target.value || today
                                        })}
                                    />
                                </fieldset>

                                {/* 失效日期 */}
                                <fieldset className="flex flex-col">
                                    <legend className="flex items-center space-x-1 mb-1 text-sm font-medium">
                                        <CalendarThirty theme="outline" size="16" fill="#333"/>
                                        <span>失效日期</span>
                                    </legend>
                                    <input
                                        type="date"
                                        className="input input-bordered w-full"
                                        value={data.expiration_date || ""}
                                        onChange={(e) => setData({
                                            ...data,
                                            expiration_date: e.target.value || undefined
                                        })}
                                    />
                                </fieldset>
                            </div>
                        </div>

                        {/* 联系方式部分 */}
                        <div className="lg:col-span-3">
                            <h2 className="text-lg font-semibold border-l-4 border-primary pl-3 mb-4">联系方式</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* 部门地址 */}
                                <fieldset className="flex flex-col">
                                    <legend className="flex items-center space-x-1 mb-1 text-sm font-medium">
                                        <BuildingOne theme="outline" size="16" fill="#333"/>
                                        <span>部门地址</span>
                                    </legend>
                                    <input
                                        type="text"
                                        className="input input-bordered w-full"
                                        value={data.department_address || ""}
                                        onChange={(e) => setData({...data, department_address: e.target.value})}
                                        placeholder="例如: 主校区思源楼B305"
                                    />
                                </fieldset>

                                {/* 固定电话 */}
                                <fieldset className="flex flex-col">
                                    <legend className="flex items-center space-x-1 mb-1 text-sm font-medium">
                                        <PhoneTelephone theme="outline" size="16" fill="#333"/>
                                        <span>固定电话</span>
                                    </legend>
                                    <input
                                        type="tel"
                                        className="input input-bordered w-full"
                                        value={data.fixed_phone || ""}
                                        onChange={(e) => setData({...data, fixed_phone: e.target.value})}
                                        placeholder="例如: 020-12345678"
                                    />
                                </fieldset>

                                {/* 行政负责人 */}
                                <fieldset className="flex flex-col">
                                    <legend className="flex items-center space-x-1 mb-1 text-sm font-medium">
                                        <People theme="outline" size="16" fill="#333"/>
                                        <span>行政负责人</span>
                                    </legend>
                                    <input
                                        type="text"
                                        className="input input-bordered w-full"
                                        value={data.administrative_head || ""}
                                        onChange={(e) => setData({...data, administrative_head: e.target.value})}
                                        placeholder="例如: 张三"
                                    />
                                </fieldset>

                                {/* 党委负责人 */}
                                <fieldset className="flex flex-col">
                                    <legend className="flex items-center space-x-1 mb-1 text-sm font-medium">
                                        <People theme="outline" size="16" fill="#333"/>
                                        <span>党委负责人</span>
                                    </legend>
                                    <input
                                        type="text"
                                        className="input input-bordered w-full"
                                        value={data.party_committee_head || ""}
                                        onChange={(e) => setData({...data, party_committee_head: e.target.value})}
                                        placeholder="例如: 李四"
                                    />
                                </fieldset>

                                {/* 分配教学楼 */}
                                <fieldset className="flex flex-col lg:col-span-2">
                                    <legend className="flex items-center space-x-1 mb-1 text-sm font-medium">
                                        <BuildingOne theme="outline" size="16" fill="#333"/>
                                        <span>分配教学楼</span>
                                    </legend>
                                    <input
                                        type="text"
                                        className="input input-bordered w-full"
                                        value={data.assigned_teaching_building || ""}
                                        onChange={(e) => setData({...data, assigned_teaching_building: e.target.value})}
                                        placeholder="例如: 思源楼,行政楼"
                                    />
                                </fieldset>
                            </div>
                        </div>

                        {/* 备注信息 */}
                        <div className="lg:col-span-3">
                            <h2 className="text-lg font-semibold border-l-4 border-primary pl-3 mb-4">备注信息</h2>
                            <fieldset className="flex flex-col">
                                <legend className="flex items-center space-x-1 mb-1 text-sm font-medium">
                                    <Notes theme="outline" size="16" fill="#333"/>
                                    <span>备注</span>
                                </legend>
                                <textarea
                                    className="textarea textarea-bordered w-full"
                                    value={data.remark || ""}
                                    onChange={(e) => setData({...data, remark: e.target.value})}
                                    placeholder="请输入备注信息（可选）"
                                    rows={3}
                                />
                            </fieldset>
                        </div>

                        {/* 部门属性 */}
                        <div className="lg:col-span-3">
                            <h2 className="text-lg font-semibold border-l-4 border-primary pl-3 mb-4">部门属性</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="space-y-4">
                                    <div className="tooltip" data-tip="设置部门是否可用">
                                        <fieldset className="flex items-center space-x-3">
                                            <input
                                                type="checkbox"
                                                className="toggle toggle-primary"
                                                checked={data.is_enabled}
                                                onChange={(e) => setData({...data, is_enabled: e.target.checked})}
                                            />
                                            <span>启用部门</span>
                                        </fieldset>
                                    </div>

                                    <div className="tooltip" data-tip="设置是否为实体部门">
                                        <fieldset className="flex items-center space-x-3">
                                            <input
                                                type="checkbox"
                                                className="toggle toggle-primary"
                                                checked={data.is_entity}
                                                onChange={(e) => setData({...data, is_entity: e.target.checked})}
                                            />
                                            <span>实体部门</span>
                                        </fieldset>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="tooltip" data-tip="设置是否为上课院系">
                                        <fieldset className="flex items-center space-x-3">
                                            <input
                                                type="checkbox"
                                                className="toggle toggle-primary"
                                                checked={data.is_attending_college}
                                                onChange={(e) => setData({
                                                    ...data,
                                                    is_attending_college: e.target.checked
                                                })}
                                            />
                                            <span>上课院系</span>
                                        </fieldset>
                                    </div>

                                    <div className="tooltip" data-tip="设置是否为开课院系">
                                        <fieldset className="flex items-center space-x-3">
                                            <input
                                                type="checkbox"
                                                className="toggle toggle-primary"
                                                checked={data.is_teaching_college}
                                                onChange={(e) => setData({
                                                    ...data,
                                                    is_teaching_college: e.target.checked
                                                })}
                                            />
                                            <span>开课院系</span>
                                        </fieldset>
                                    </div>

                                    <div className="tooltip" data-tip="设置是否为开课教研室">
                                        <fieldset className="flex items-center space-x-3">
                                            <input
                                                type="checkbox"
                                                className="toggle toggle-primary"
                                                checked={data.is_teaching_office}
                                                onChange={(e) => setData({
                                                    ...data,
                                                    is_teaching_office: e.target.checked
                                                })}
                                            />
                                            <span>开课教研室</span>
                                        </fieldset>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 表单按钮 */}
                    <div className="mt-8 flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={handleReset}
                            className="btn btn-outline"
                        >
                            <CloseOne theme="outline" size="18"/>
                            <span>重置表单</span>
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={submitting}
                        >
                            {submitting ? (
                                <>
                                    <span className="loading loading-spinner loading-sm"></span>
                                    <span>提交中...</span>
                                </>
                            ) : (
                                <>
                                    <CheckOne theme="outline" size="18"/>
                                    <span>提交</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </CardComponent>
        </div>
    );
}
