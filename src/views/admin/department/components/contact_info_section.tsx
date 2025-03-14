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

import {BuildingOne, People, PhoneTelephone} from "@icon-park/react";
import * as React from "react";
import {JSX} from "react";
import {DepartmentDTO} from "../../../../models/dto/department_dto.ts";
import {FormFieldComponent} from "../../../../components/form/form_field_component.tsx";
import {FormSectionComponent} from "../../../../components/form/form_section_component.tsx";

interface ContactInfoSectionProps {
    data: DepartmentDTO;
    setData: React.Dispatch<React.SetStateAction<DepartmentDTO>>;
    showHelpText: boolean;
}

/**
 * # 部门联系方式组件
 * > 显示和编辑部门的联系方式信息
 */
export function ContactInfoSection({
    data,
    setData,
    showHelpText
}: Readonly<ContactInfoSectionProps>): JSX.Element {
    return (
        <FormSectionComponent
            title="联系方式"
            icon={<PhoneTelephone theme="outline" size="16" fill="currentColor"/>}
            badgeColor="badge-secondary"
        >
            {/* 部门地址 */}
            <FormFieldComponent
                label="部门地址"
                icon={<BuildingOne theme="outline" size="16"/>}
                helpText="部门的主要办公地点"
                showHelpText={showHelpText}
            >
                <input
                    type="text"
                    className="input input-bordered w-full"
                    value={data.department_address || ""}
                    onChange={(e) => setData({...data, department_address: e.target.value})}
                    placeholder="例如: 主校区思源楼B305"
                />
            </FormFieldComponent>

            {/* 固定电话 */}
            <FormFieldComponent
                label="固定电话"
                icon={<PhoneTelephone theme="outline" size="16"/>}
                helpText="格式：区号-电话号码"
                showHelpText={showHelpText}
            >
                <input
                    type="tel"
                    className="input input-bordered w-full"
                    value={data.fixed_phone || ""}
                    onChange={(e) => setData({...data, fixed_phone: e.target.value})}
                    placeholder="例如: 020-12345678"
                    pattern="[0-9\-]+"
                />
            </FormFieldComponent>

            {/* 行政负责人 */}
            <FormFieldComponent
                label="行政负责人"
                icon={<People theme="outline" size="16"/>}
                helpText="部门行政主要负责人姓名"
                showHelpText={showHelpText}
            >
                <input
                    type="text"
                    className="input input-bordered w-full"
                    value={data.administrative_head || ""}
                    onChange={(e) => setData({...data, administrative_head: e.target.value})}
                    placeholder="例如: 张三"
                />
            </FormFieldComponent>

            {/* 党委负责人 */}
            <FormFieldComponent
                label="党委负责人"
                icon={<People theme="outline" size="16"/>}
                helpText="部门党委主要负责人姓名"
                showHelpText={showHelpText}
            >
                <input
                    type="text"
                    className="input input-bordered w-full"
                    value={data.party_committee_head || ""}
                    onChange={(e) => setData({...data, party_committee_head: e.target.value})}
                    placeholder="例如: 李四"
                />
            </FormFieldComponent>

            {/* 分配教学楼 */}
            <FormFieldComponent
                label="分配教学楼"
                icon={<BuildingOne theme="outline" size="16"/>}
                tooltip="多个教学楼用英文逗号分隔"
                helpText="该部门可使用的教学楼列表"
                showHelpText={showHelpText}
                fullWidth={true}
                className="lg:col-span-2"
            >
                <input
                    type="text"
                    className="input input-bordered w-full"
                    value={data.assigned_teaching_building || ""}
                    onChange={(e) => setData({...data, assigned_teaching_building: e.target.value})}
                    placeholder="例如: 思源楼,行政楼"
                />
            </FormFieldComponent>
        </FormSectionComponent>
    );
}
