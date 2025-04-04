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

import {BuildingOne, Calendar, CalendarThirty, Sort, Tag} from "@icon-park/react";
import * as React from "react";
import {JSX} from "react";
import {DepartmentDTO} from "../../../../models/dto/department_dto.ts";
import {DepartmentEntity} from "../../../../models/entity/department_entity.ts";
import {FormFieldComponent} from "../../../form/form_field_component.tsx";
import {FormSectionComponent} from "../../../form/form_section_component.tsx";
import {UnitCategoryLiteEntity} from "../../../../models/entity/unit_category_lite_entity.ts";
import {UnitTypeLiteEntity} from "../../../../models/entity/unit_type_lite_entity.ts";

interface BasicInfoSectionProps {
    data: DepartmentDTO;
    setData: React.Dispatch<React.SetStateAction<DepartmentDTO>>;
    departmentList: DepartmentEntity[];
    unitCategories: UnitCategoryLiteEntity[];
    unitTypes: UnitTypeLiteEntity[];
    showHelpText: boolean;
    today: string;
}

/**
 * # 部门基本信息组件
 * > 显示和编辑部门的基本信息
 */
export function BasicInfoSection({
    data,
    setData,
    departmentList,
    unitCategories,
    unitTypes,
    showHelpText,
    today
}: Readonly<BasicInfoSectionProps>): JSX.Element {
    return (
        <FormSectionComponent
            title="基本信息"
            icon={<BuildingOne theme="outline" size="16"/>}
            badgeColor="badge-primary"
        >
            {/* 部门名称 */}
            <FormFieldComponent
                label="部门名称"
                icon={<BuildingOne theme="outline" size="16"/>}
                required={true}
                tooltip="请输入部门的完整名称，如'计算机科学与技术学院'"
                helpText="请输入完整的官方部门名称"
                showHelpText={showHelpText}
            >
                <input
                    id="department_name"
                    type="text"
                    className="input input-bordered w-full"
                    required
                    value={data.department_name}
                    onChange={(e) => setData({...data, department_name: e.target.value})}
                    placeholder="例如: 计算机科学与技术学院"
                />
            </FormFieldComponent>

            {/* 部门编码 */}
            <FormFieldComponent
                label="部门编码"
                icon={<Tag theme="outline" size="16"/>}
                required={true}
                tooltip="部门编码应唯一，通常采用字母和数字的组合"
                helpText="唯一标识码，不可重复"
                showHelpText={showHelpText}
            >
                <input
                    id="department_code"
                    type="text"
                    className="input input-bordered w-full"
                    required
                    value={data.department_code}
                    onChange={(e) => setData({...data, department_code: e.target.value})}
                    placeholder="例如: CS001"
                />
            </FormFieldComponent>

            {/* 部门简称 */}
            <FormFieldComponent
                label="部门简称"
                icon={<Tag theme="outline" size="16"/>}
                tooltip="部门常用的简称，如'计算机学院'"
                helpText="常用于日常称呼的简称"
                showHelpText={showHelpText}
            >
                <input
                    id="department_short_name"
                    type="text"
                    className="input input-bordered w-full"
                    value={data.department_short_name || ""}
                    onChange={(e) => setData({...data, department_short_name: e.target.value})}
                    placeholder="例如: 计算机学院"
                />
            </FormFieldComponent>

            {/* 部门英文名称 */}
            <FormFieldComponent
                label="部门英文名称"
                icon={<Tag theme="outline" size="16"/>}
                helpText="用于国际交流场合"
                showHelpText={showHelpText}
            >
                <input
                    id="department_english_name"
                    type="text"
                    className="input input-bordered w-full"
                    value={data.department_english_name || ""}
                    onChange={(e) => setData({...data, department_english_name: e.target.value})}
                    placeholder="例如: School of Computer Science"
                />
            </FormFieldComponent>

            {/* 单位类别 */}
            <FormFieldComponent
                label="单位类别"
                icon={<Tag theme="outline" size="16"/>}
                required={true}
                tooltip="标明是何种类型的单位，如'学院/部门/中心'"
                helpText="单位的组织类型"
                showHelpText={showHelpText}
            >
                <select
                    id="unit_category"
                    className="select select-bordered w-full"
                    required
                    value={data.unit_category}
                    onChange={(e) => setData({...data, unit_category: e.target.value})}
                >
                    <option value="" disabled>请选择单位类别</option>
                    {unitCategories.map((category) => (
                        <option key={category.unit_category_uuid} value={category.unit_category_uuid}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </FormFieldComponent>

            {/* 单位办别 */}
            <FormFieldComponent
                label="单位办别"
                icon={<Tag theme="outline" size="16"/>}
                required={true}
                helpText="单位的主要职能"
                showHelpText={showHelpText}
            >
                <select
                    id="unit_type"
                    className="select select-bordered w-full"
                    required
                    value={data.unit_type}
                    onChange={(e) => setData({...data, unit_type: e.target.value})}
                >
                    <option value="" disabled>请选择单位办别</option>
                    {unitTypes.map((type) => (
                        <option key={type.unit_type_uuid} value={type.unit_type_uuid}>
                            {type.name}
                        </option>
                    ))}
                </select>
            </FormFieldComponent>

            {/* 部门排序 */}
            <FormFieldComponent
                label="部门排序"
                icon={<Sort theme="outline" size="16"/>}
                required={true}
                tooltip="数值越小排序越靠前，默认为100"
                helpText="影响部门在列表中的显示顺序"
                showHelpText={showHelpText}
            >
                <input
                    id="department_order"
                    type="number"
                    className="input input-bordered w-full"
                    required
                    value={data.department_order}
                    onChange={(e) => setData({...data, department_order: parseInt(e.target.value)})}
                    placeholder="例如: 100"
                    min="1"
                />
            </FormFieldComponent>

            {/* 上级部门 */}
            <FormFieldComponent
                label="上级部门"
                icon={<BuildingOne theme="outline" size="16"/>}
                helpText="可选，选择该部门的直接上级"
                showHelpText={showHelpText}
            >
                <select
                    id="parent_department"
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
            </FormFieldComponent>

            {/* 成立日期 */}
            <FormFieldComponent
                label="成立日期"
                icon={<Calendar theme="outline" size="16"/>}
                required={true}
                helpText="部门正式成立的日期"
                showHelpText={showHelpText}
            >
                <input
                    id="establishment_date"
                    type="date"
                    className="input input-bordered w-full"
                    required
                    value={data.establishment_date}
                    onChange={(e) => setData({
                        ...data,
                        establishment_date: e.target.value || today
                    })}
                />
            </FormFieldComponent>

            {/* 失效日期 */}
            <FormFieldComponent
                label="失效日期"
                icon={<CalendarThirty theme="outline" size="16"/>}
                tooltip="部门如有计划终止或合并日期，请在此填写"
                helpText="可选，部门计划撤销或合并的日期"
                showHelpText={showHelpText}
            >
                <input
                    id="expiration_date"
                    type="date"
                    className="input input-bordered w-full"
                    value={data.expiration_date || ""}
                    onChange={(e) => setData({
                        ...data,
                        expiration_date: e.target.value || undefined
                    })}
                />
            </FormFieldComponent>
        </FormSectionComponent>
    );
}
