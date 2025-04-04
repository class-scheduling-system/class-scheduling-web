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

import {Tag} from "@icon-park/react";
import * as React from "react";
import {JSX} from "react";
import {DepartmentDTO} from "../../../../models/dto/department_dto.ts";
import {FormSectionComponent} from "../../../form/form_section_component.tsx";

interface DepartmentPropertiesSectionProps {
    data: DepartmentDTO;
    setData: React.Dispatch<React.SetStateAction<DepartmentDTO>>;
}

/**
 * # 部门属性组件
 * > 显示和编辑部门的属性信息
 */
export function DepartmentPropertiesSection({data, setData}: Readonly<DepartmentPropertiesSectionProps>): JSX.Element {
    return (
        <FormSectionComponent
            title="部门属性"
            icon={<Tag theme="outline" size="16" fill="currentColor"/>}
            badgeColor="badge-accent"
        >
            <div className="lg:col-span-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4 bg-base-200 p-4 rounded-lg">
                        <h3 className="font-medium text-base">基本属性</h3>
                        <div className="divider my-2"></div>

                        <div className="tooltip w-full" data-tip="设置部门是否可用">
                            <div className="flex items-center justify-between bg-base-100 p-3 rounded-md">
                                <span className="text-sm">启用部门</span>
                                <input
                                    id="is_enabled"
                                    type="checkbox"
                                    className="toggle toggle-primary"
                                    checked={data.is_enabled ?? false}
                                    onChange={(e) => setData({...data, is_enabled: e.target.checked})}
                                />
                            </div>
                        </div>

                        <div className="tooltip w-full" data-tip="设置是否为实体部门">
                            <div className="flex items-center justify-between bg-base-100 p-3 rounded-md">
                                <span className="text-sm">实体部门</span>
                                <input
                                    id="is_entity"
                                    type="checkbox"
                                    className="toggle toggle-primary"
                                    checked={data.is_entity}
                                    onChange={(e) => setData({...data, is_entity: e.target.checked})}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 bg-base-200 p-4 rounded-lg">
                        <h3 className="font-medium text-base">教学属性</h3>
                        <div className="divider my-2"></div>

                        <div className="tooltip w-full" data-tip="设置是否为上课院系">
                            <div className="flex items-center justify-between bg-base-100 p-3 rounded-md">
                                <span className="text-sm">上课院系</span>
                                <input
                                    id="is_attending_college"
                                    type="checkbox"
                                    className="toggle toggle-primary"
                                    checked={data.is_attending_college}
                                    onChange={(e) => setData({
                                        ...data,
                                        is_attending_college: e.target.checked
                                    })}
                                />
                            </div>
                        </div>

                        <div className="tooltip w-full" data-tip="设置是否为开课院系">
                            <div className="flex items-center justify-between bg-base-100 p-3 rounded-md">
                                <span className="text-sm">开课院系</span>
                                <input
                                    id="is_teaching_college"
                                    type="checkbox"
                                    className="toggle toggle-primary"
                                    checked={data.is_teaching_college}
                                    onChange={(e) => setData({
                                        ...data,
                                        is_teaching_college: e.target.checked
                                    })}
                                />
                            </div>
                        </div>

                        <div className="tooltip w-full" data-tip="设置是否为开课教研室">
                            <div className="flex items-center justify-between bg-base-100 p-3 rounded-md">
                                <span className="text-sm">开课教研室</span>
                                <input
                                    id="is_teaching_office"
                                    type="checkbox"
                                    className="toggle toggle-primary"
                                    checked={data.is_teaching_office}
                                    onChange={(e) => setData({
                                        ...data,
                                        is_teaching_office: e.target.checked
                                    })}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </FormSectionComponent>
    );
}
