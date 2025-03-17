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

import {BuildingOne, Delete, People, PhoneTelephone, Plus} from "@icon-park/react";
import * as React from "react";
import {JSX, useEffect, useState} from "react";
import {DepartmentDTO} from "../../../../models/dto/department_dto.ts";
import {FormFieldComponent} from "../../../form/form_field_component.tsx";
import {FormSectionComponent} from "../../../form/form_section_component.tsx";
import {GetBuildingListAPI} from "../../../../apis/building_api.ts";
import {BuildingLiteEntity} from "../../../../models/entity/building_lite_entity.ts";
import {message} from "antd";

interface ContactInfoSectionProps {
    data: DepartmentDTO;
    setData: React.Dispatch<React.SetStateAction<DepartmentDTO>>;
    showHelpText: boolean;
    hasSelected: boolean;
}

interface SelectedBuildings {
    building_name: string;
    building_uuid: string;
}

/**
 * # 部门联系方式组件
 * > 显示和编辑部门的联系方式信息
 */
export function ContactInfoSection({data, setData, showHelpText, hasSelected}: Readonly<ContactInfoSectionProps>): JSX.Element {
    const [buildingList, setBuildingList] = useState<BuildingLiteEntity[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchKeyword, setSearchKeyword] = useState<string>("");
    const [selectedBuildings, setSelectedBuildings] = useState<SelectedBuildings[]>([]);

    // 加载已分配的教学楼
    useEffect(() => {
        const getBuilding = data.assigned_teaching_building;
        const building = buildingList.filter(building => getBuilding!.includes(building.building_uuid));
        setSelectedBuildings(building);
    }, [data.assigned_teaching_building, hasSelected]);

    // 获取建筑列表
    useEffect(() => {
        const fetchBuildingList = async () => {
            setLoading(true);
            try {
                const response = await GetBuildingListAPI(searchKeyword);
                if (response?.output === "Success") {
                    setBuildingList(response.data!);
                } else {
                    message.warning(response?.error_message || "获取教学楼列表失败");
                }
            } catch (error) {
                console.error("获取教学楼列表失败:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBuildingList().then();
    }, [searchKeyword]);

    // 添加教学楼
    const handleAddBuilding = (buildingUuid: string, buildingName: string) => {
        selectedBuildings.map(building => {
            if (building.building_name === buildingName) {
                return;
            }
        });
        selectedBuildings.push({building_name: buildingName, building_uuid: buildingUuid});
        setData({
            ...data,
            assigned_teaching_building: selectedBuildings.map(b => b.building_uuid) || undefined
        });
    };

    // 移除教学楼
    const handleRemoveBuilding = (buildingUuid: string) => {
        const newSelectedBuildings = selectedBuildings.filter(b => b.building_uuid !== buildingUuid);
        setSelectedBuildings(newSelectedBuildings);
        setData({
            ...data,
            assigned_teaching_building: newSelectedBuildings.map(b => b.building_uuid) || undefined
        });
    };

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
                tooltip="选择该学院可使用的教学楼"
                helpText="该部门可使用的教学楼列表"
                showHelpText={showHelpText}
                fullWidth={true}
                className="lg:col-span-3"
            >
                <div className="space-y-4">
                    {/* 搜索框 */}
                    <div className="flex w-full items-center">
                        <input
                            type="text"
                            className="input input-bordered w-full"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            placeholder="搜索教学楼..."
                        />
                    </div>

                    {/* 选择的教学楼显示 */}
                    <div className="flex flex-wrap gap-2 my-2">
                        {selectedBuildings.map((building) => (
                            <div key={building.building_uuid} className="badge badge-lg gap-2 badge-secondary p-3">
                                <BuildingOne theme="outline" size="16"/>
                                {building.building_name}
                                <button
                                    onClick={() => handleRemoveBuilding(building.building_uuid)}
                                    className="btn btn-xs btn-circle btn-ghost"
                                >
                                    <Delete theme="outline" size="14"/>
                                </button>
                            </div>
                        ))}
                        {selectedBuildings.length === 0 &&
                            <div className="text-base-content/60 text-sm">未选择任何教学楼</div>
                        }
                    </div>

                    {/* 教学楼选择列表 */}
                    <div className="mt-2 border border-base-300 rounded-md p-2 max-h-60 overflow-y-auto">
                        <h3 className="font-medium text-sm mb-2">可选教学楼列表</h3>

                        {loading ? (
                            <div className="flex justify-center py-4">
                                <span className="loading loading-spinner loading-sm"></span>
                            </div>
                        ) : buildingList.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                                {buildingList.map((building) => (
                                    <div
                                        key={building.building_uuid}
                                        className={`
                                            flex justify-between items-center p-2 rounded-md cursor-pointer
                                            ${selectedBuildings.map(b => b.building_uuid).includes(building.building_uuid) ? 'bg-secondary/20' : 'bg-base-200 hover:bg-base-300'}
                                        `}
                                        onClick={() => handleAddBuilding(building.building_uuid, building.building_name)}
                                    >
                                        <span className="text-sm">{building.building_name}</span>
                                        <Plus
                                            theme="outline"
                                            size="16"
                                            className={selectedBuildings.map(b => b.building_uuid).includes(building.building_uuid) ? 'opacity-0' : ''}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-4 text-base-content/60">
                                {searchKeyword ? "未找到匹配的教学楼" : "无可用教学楼"}
                            </div>
                        )}
                    </div>
                </div>
            </FormFieldComponent>
        </FormSectionComponent>
    );
}
