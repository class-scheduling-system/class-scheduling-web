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

import React, { JSX, useEffect, useState } from 'react';
import { Return, Refresh, Info, Editor, GreenHouse, UserPositioning, CheckOne } from "@icon-park/react";
import { message, Transfer } from "antd";
import { CreateClassroomAPI, GetClassroomTagsAPI, GetClassroomTypeAPI } from "../../../apis/classroom_api.ts";
import { ClassroomDTO } from "../../../models/dto/classroom_dto.ts";
import { ClassroomTagEntity } from "../../../models/entity/classroom_tag_entity.ts";
import { ClassroomTypeEntity } from "../../../models/entity/classroom_type_entity.ts";
import { Link } from "react-router";
import { SiteInfoEntity } from '../../../models/entity/site_info_entity.ts';
import { GetBuildingListAPI } from "../../../apis/building_api.ts";
import { GetCampusListAPI } from "../../../apis/campus_api.ts";
import { BuildingLiteEntity } from "../../../models/entity/building_lite_entity.ts";
import { ListOfCampusEntity } from "../../../models/entity/list_of_campus_entity.ts";
import { Key } from "antd/es/table/interface";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { addForm, setForBackData, setOtherData, setThisPage } from "../../../stores/ai_form_chat.ts";
import { HtmlRecordStore, AiFormStore } from "@/models/store/ai_form_store.ts";

interface TransferItem {
    key: string;
    title: string;
    description: string;
}

interface RecentClassroom {
    name: string;
    type: string;
    time: string;
}

export function AdminClassroomAddPage({ site }: Readonly<{ site: SiteInfoEntity }>): JSX.Element {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const aiFormChat = useSelector((state: { aiFormChat: AiFormStore }) => state.aiFormChat);

    const [data, setData] = useState<Partial<ClassroomDTO>>({
        tag: [],
        status: true,
        is_multimedia: false,
        is_air_conditioned: false,
        examination_room: false,
    });
    const [tagList, setTagList] = useState<ClassroomTagEntity[]>([]);
    const [typeList, setTypeList] = useState<ClassroomTypeEntity[]>([]);
    const [buildingList, setBuildingList] = useState<BuildingLiteEntity[]>([]);
    const [campusList, setCampusList] = useState<ListOfCampusEntity[]>([]);
    const [targetKeys, setTargetKeys] = useState<string[]>([]);
    
    useEffect(() => {
        document.title = `添加教室 | ${site.name}`;
        
        // 设置当前页面名称，用于AI
        dispatch(setThisPage("添加教室"));

        dispatch(setOtherData(""));
        dispatch(setForBackData(""));
        
        // 记录表单元素以供AI使用
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
                record.options = Array.from(ele.options).map(option => option.value);
            }
            
            // 使用元素ID作为键
            if (ele.id) {
                dispatch(addForm({
                    key: ele.id,
                    value: record as HtmlRecordStore
                }));
            }
        });

        // 收集其他数据
        const otherData = [
            { name: "tagList", data: tagList },
            { name: "typeList", data: typeList },
            { name: "buildingList", data: buildingList },
            { name: "campusList", data: campusList }
        ];
        dispatch(setOtherData(JSON.stringify(otherData)));

    }, [site.name, dispatch, tagList, typeList, buildingList, campusList]);

    // 处理AI表单数据回填
    useEffect(() => {
        if (aiFormChat.for_back_data) {
            const blob = new Blob([aiFormChat.for_back_data], { type: 'application/javascript' });
            const url = URL.createObjectURL(blob);
            const script = document.createElement('script');
            script.src = url;
            
            // 添加脚本执行完成的事件监听器
            script.onload = () => {
                const updatedData = { ...data };
                
                // 获取并更新各个字段
                const nameInput = document.getElementById('classroom_name') as HTMLInputElement;
                const typeSelect = document.getElementById('classroom_type') as HTMLSelectElement;
                const buildingSelect = document.getElementById('building_uuid') as HTMLSelectElement;
                const campusSelect = document.getElementById('campus_uuid') as HTMLSelectElement;
                const capacityInput = document.getElementById('classroom_capacity') as HTMLInputElement;
                const areaInput = document.getElementById('classroom_area') as HTMLInputElement;
                const numberInput = document.getElementById('classroom_number') as HTMLInputElement;
                const floorInput = document.getElementById('classroom_floor') as HTMLInputElement;
                const descriptionTextarea = document.getElementById('classroom_description') as HTMLTextAreaElement;
                const isMultimediaCheckbox = document.getElementById('is_multimedia') as HTMLInputElement;
                const isAirConditionedCheckbox = document.getElementById('is_air_conditioned') as HTMLInputElement;
                const examinationRoomCheckbox = document.getElementById('examination_room') as HTMLInputElement;
                const examinationRoomCapacityInput = document.getElementById('examination_room_capacity') as HTMLInputElement;
                
                // 更新数据，仅更新有值的字段
                if (nameInput && nameInput.value) {
                    updatedData.name = nameInput.value;
                }
                
                if (typeSelect && typeSelect.value) {
                    updatedData.type = typeSelect.value;
                }
                
                if (buildingSelect && buildingSelect.value) {
                    updatedData.building_uuid = buildingSelect.value;
                }
                
                if (campusSelect && campusSelect.value) {
                    updatedData.campus_uuid = campusSelect.value;
                }
                
                if (capacityInput && capacityInput.value) {
                    updatedData.capacity = parseInt(capacityInput.value);
                }
                
                if (areaInput && areaInput.value) {
                    updatedData.area = parseFloat(areaInput.value);
                }
                
                if (numberInput && numberInput.value) {
                    updatedData.number = numberInput.value;
                }
                
                if (floorInput && floorInput.value) {
                    updatedData.floor = floorInput.value;
                }
                
                if (descriptionTextarea && descriptionTextarea.value) {
                    updatedData.description = descriptionTextarea.value;
                }
                
                if (isMultimediaCheckbox) {
                    updatedData.is_multimedia = isMultimediaCheckbox.checked;
                }
                
                if (isAirConditionedCheckbox) {
                    updatedData.is_air_conditioned = isAirConditionedCheckbox.checked;
                }
                
                if (examinationRoomCheckbox) {
                    updatedData.examination_room = examinationRoomCheckbox.checked;
                }
                
                if (examinationRoomCapacityInput && examinationRoomCapacityInput.value && updatedData.examination_room) {
                    updatedData.examination_room_capacity = parseInt(examinationRoomCapacityInput.value);
                }
                
                // 更新状态
                setData(updatedData);
                
                // 释放资源
                URL.revokeObjectURL(url);
            };
            
            document.head.appendChild(script);
        }
    }, [aiFormChat.for_back_data]);

    // 最近添加的教室列表状态 - 从localStorage获取或使用空数组作为默认值
    const [recentClassrooms, setRecentClassrooms] = useState<RecentClassroom[]>(() => {
        const savedClassrooms = localStorage.getItem('recentAddedClassrooms');
        return savedClassrooms ? JSON.parse(savedClassrooms) : [];
    });

    // 获取教室标签列表
    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await GetClassroomTagsAPI();
                if (response?.output === "Success") {
                    console.log("获取教室标签列表成功:", response.data);
                    setTagList(response.data!);
                    
                    // 更新AI可用的数据
                    dispatch(setOtherData(JSON.stringify({
                        type: "tagList",
                        data: response.data
                    })));
                } else {
                    message.error(response?.message ?? "获取教室标签列表失败");
                }
            } catch (error) {
                console.error("教室标签列表请求失败:", error);
                message.error("获取教室标签列表失败");
            }
        };
        fetchTags().then();
    }, [dispatch]);

    // 获取教室类型列表
    useEffect(() => {
        const fetchTypes = async () => {
            try {
                const response = await GetClassroomTypeAPI();
                if (response?.output === "Success") {
                    console.log("获取教室类型列表成功:", response.data);
                    setTypeList(response.data!);
                    
                    // 更新AI可用的数据
                    dispatch(setOtherData(JSON.stringify({
                        type: "typeList",
                        data: response.data
                    })));
                } else {
                    message.error(response?.message ?? "获取教室类型列表失败");
                }
            } catch (error) {
                console.error("教室类型列表请求失败:", error);
                message.error("获取教室类型列表失败");
            }
        };
        fetchTypes().then();
    }, [dispatch]);

    // 获取建筑列表
    useEffect(() => {
        const fetchBuildings = async () => {
            try {
                const response = await GetBuildingListAPI("");
                if (response?.output === "Success") {
                    console.log("获取建筑列表成功:", response.data);
                    setBuildingList(response.data!);
                    
                    // 更新AI可用的数据
                    dispatch(setOtherData(JSON.stringify({
                        type: "buildingList",
                        data: response.data
                    })));
                } else {
                    message.error(response?.message ?? "获取建筑列表失败");
                }
            } catch (error) {
                console.error("建筑列表请求失败:", error);
                message.error("获取建筑列表失败");
            }
        };
        fetchBuildings().then();
    }, [dispatch]);

    // 获取校区列表
    useEffect(() => {
        const fetchCampus = async () => {
            try {
                const response = await GetCampusListAPI();
                if (response?.output === "Success") {
                    console.log("获取校区列表成功:", response.data);
                    setCampusList(response.data!);
                    
                    // 更新AI可用的数据
                    dispatch(setOtherData(JSON.stringify({
                        type: "campusList",
                        data: response.data
                    })));
                } else {
                    message.error(response?.message ?? "获取校区列表失败");
                }
            } catch (error) {
                console.error("校区列表请求失败:", error);
                message.error("获取校区列表失败");
            }
        };
        fetchCampus().then();
    }, [dispatch]);

    // 重置表单
    const resetForm = () => {
        setData({
            tag: [],
            status: true,
            is_multimedia: false,
            is_air_conditioned: false,
            examination_room: false,
        });
        setTargetKeys([]);
    };

    // 更新最近添加的教室列表
    const updateRecentClassrooms = (newClassroom: Partial<ClassroomDTO>) => {
        const now = new Date();
        const timeString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        const classroomRecord: RecentClassroom = {
            name: newClassroom.name ?? "",
            type: typeList.find(type => type.class_type_uuid === newClassroom.type)?.name ?? "",
            time: timeString
        };

        const updatedRecentClassrooms = [classroomRecord, ...recentClassrooms.slice(0, 2)];
        setRecentClassrooms(updatedRecentClassrooms);
        localStorage.setItem('recentAddedClassrooms', JSON.stringify(updatedRecentClassrooms));
    };

    // 提交表单
    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const payload = { ...data, tag: targetKeys } as ClassroomDTO;

        try {
            const getResp = await CreateClassroomAPI(payload);
            if (getResp?.output === "Success") {
                updateRecentClassrooms(payload);
                message.success("添加成功");
                resetForm();
                setTimeout(() => {
                    navigate("/admin/classroom");
                }, 500);
            } else {
                message.error(getResp?.error_message ?? "添加失败");
            }
        } catch (error) {
            console.error("添加教室失败:", error);
            message.error("添加教室失败");
        }
    }

    // 处理标签选择变化
    const handleTransferChange = (newTargetKeys: Key[]) => {
        const stringKeys = newTargetKeys.map(key => key.toString());
        setTargetKeys(stringKeys);
        setData({ ...data, tag: stringKeys });
    };

    // 标签过滤选项
    const filterOption = (inputValue: string, option: TransferItem) => {
        if (!inputValue) {
            return true;
        }
        return option.title.toLowerCase().indexOf(inputValue.toLowerCase()) > -1;
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center space-x-2">
                <Link to={"/admin/classroom"}>
                    <Return theme="outline" size="24" />
                </Link>
                <h2 className="text-2xl font-bold flex items-center space-x-2">
                    <span>添加新教室</span>
                </h2>
            </div>
            <div className="w-full">
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="lg:col-span-8 md:col-span-12 sm:col-span-12 flex">
                        <div className="card card-border bg-base-100 w-full shadow-md">
                            <h2 className="card-title bg-neutral/10 rounded-t-lg p-3"><Editor theme="outline" size="18" />添加教室信息</h2>
                            <div className="card-body">
                                <form id="classroom_add" onSubmit={onSubmit} className="flex flex-col flex-grow space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                                        {/* 教室名称 */}
                                        <fieldset className="flex flex-col">
                                            <legend className="flex items-center space-x-1 mb-1 text-sm">
                                                <GreenHouse theme="outline" size="14" />
                                                <span>教室名称</span>
                                                <span className="text-red-500">*</span>
                                            </legend>
                                            <input
                                                id="classroom_name"
                                                type="text"
                                                className="input input-sm w-full validator"
                                                required
                                                value={data.name ?? ""}
                                                onChange={(e) => setData({ ...data, name: e.target.value })}
                                                placeholder="请输入教室名称"
                                            />
                                        </fieldset>

                                        {/* 教室类型 */}
                                        <fieldset className="flex flex-col">
                                            <legend className="flex items-center space-x-1 mb-1 text-sm">
                                                <UserPositioning theme="outline" size="14" />
                                                <span>教室类型</span>
                                                <span className="text-red-500">*</span>
                                            </legend>
                                            <select
                                                id="classroom_type"
                                                className="select select-sm w-full validator"
                                                required
                                                value={data.type ?? ""}
                                                onChange={(e) => setData({ ...data, type: e.target.value })}
                                            >
                                                <option value="">请选择教室类型</option>
                                                {typeList.map((type) => (
                                                    <option key={type.class_type_uuid} value={type.class_type_uuid}>
                                                        {type.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </fieldset>

                                        {/* 所属建筑 */}
                                        <fieldset className="flex flex-col">
                                            <legend className="flex items-center space-x-1 mb-1 text-sm">
                                                <GreenHouse theme="outline" size="14" />
                                                <span>所属建筑</span>
                                                <span className="text-red-500">*</span>
                                            </legend>
                                            <select
                                                id="building_uuid"
                                                className="select select-sm w-full validator"
                                                required
                                                value={data.building_uuid ?? ""}
                                                onChange={(e) => setData({ ...data, building_uuid: e.target.value })}
                                            >
                                                <option value="">请选择所属建筑</option>
                                                {buildingList.map((building) => (
                                                    <option key={building.building_uuid} value={building.building_uuid}>
                                                        {building.building_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </fieldset>

                                        {/* 所属校区 */}
                                        <fieldset className="flex flex-col">
                                            <legend className="flex items-center space-x-1 mb-1 text-sm">
                                                <GreenHouse theme="outline" size="14" />
                                                <span>所属校区</span>
                                                <span className="text-red-500">*</span>
                                            </legend>
                                            <select
                                                id="campus_uuid"
                                                className="select select-sm w-full validator"
                                                required
                                                value={data.campus_uuid ?? ""}
                                                onChange={(e) => setData({ ...data, campus_uuid: e.target.value })}
                                            >
                                                <option value="">请选择所属校区</option>
                                                {campusList.map((campus) => (
                                                    <option key={campus.campus_uuid} value={campus.campus_uuid}>
                                                        {campus.campus_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </fieldset>

                                        {/* 容纳人数 */}
                                        <fieldset className="flex flex-col">
                                            <legend className="flex items-center space-x-1 mb-1 text-sm">
                                                <UserPositioning theme="outline" size="14" />
                                                <span>容纳人数</span>
                                                <span className="text-red-500">*</span>
                                            </legend>
                                            <input
                                                id="classroom_capacity"
                                                type="number"
                                                className="input input-sm w-full validator"
                                                required
                                                min="1"
                                                value={data.capacity ?? ""}
                                                onChange={(e) => setData({ ...data, capacity: parseInt(e.target.value) })}
                                                placeholder="请输入容纳人数"
                                            />
                                        </fieldset>

                                        {/* 教室面积 */}
                                        <fieldset className="flex flex-col">
                                            <legend className="flex items-center space-x-1 mb-1 text-sm">
                                                <GreenHouse theme="outline" size="14" />
                                                <span>教室面积</span>
                                                <span className="text-red-500">*</span>
                                            </legend>
                                            <input
                                                id="classroom_area"
                                                type="number"
                                                className="input input-sm w-full validator"
                                                required
                                                min="0"
                                                step="0.01"
                                                value={data.area ?? ""}
                                                onChange={(e) => setData({ ...data, area: parseFloat(e.target.value) })}
                                                placeholder="请输入教室面积（平方米）"
                                            />
                                        </fieldset>

                                        {/* 教室编号 */}
                                        <fieldset className="flex flex-col">
                                            <legend className="flex items-center space-x-1 mb-1 text-sm">
                                                <Info theme="outline" size="14" />
                                                <span>教室编号</span>
                                                <span className="text-red-500">*</span>
                                            </legend>
                                            <input
                                                id="classroom_number"
                                                type="text"
                                                className="input input-sm w-full validator"
                                                required
                                                value={data.number ?? ""}
                                                onChange={(e) => setData({ ...data, number: e.target.value })}
                                                placeholder="请输入教室编号"
                                            />
                                        </fieldset>

                                        {/* 楼层 */}
                                        <fieldset className="flex flex-col">
                                            <legend className="flex items-center space-x-1 mb-1 text-sm">
                                                <GreenHouse theme="outline" size="14" />
                                                <span>楼层</span>
                                                <span className="text-red-500">*</span>
                                            </legend>
                                            <input
                                                id="classroom_floor"
                                                type="text"
                                                className="input input-sm w-full validator"
                                                required
                                                pattern="^(B?\d+|G){1,4}$"
                                                value={data.floor ?? ""}
                                                onChange={(e) => setData({ ...data, floor: e.target.value })}
                                                placeholder="请输入楼层 (如: 0001, B001, G001)"
                                            />
                                        </fieldset>

                                        {/* 考场设置 */}
                                        <fieldset className="flex flex-col">
                                            <legend className="flex items-center space-x-1 mb-1 text-sm">
                                                <Info theme="outline" size="14" />
                                                <span>考场设置</span>
                                            </legend>
                                            <div className="flex flex-col gap-2">
                                                <label className="flex items-center gap-2">
                                                    <input
                                                        id="examination_room"
                                                        type="checkbox"
                                                        className="checkbox checkbox-sm"
                                                        checked={data.examination_room}
                                                        onChange={(e) => setData({ ...data, examination_room: e.target.checked })}
                                                    />
                                                    <span>是否为考场</span>
                                                </label>
                                                {data.examination_room && (
                                                    <input
                                                        id="examination_room_capacity"
                                                        type="number"
                                                        className="input input-sm w-full"
                                                        min="1"
                                                        value={data.examination_room_capacity ?? ""}
                                                        onChange={(e) => setData({ ...data, examination_room_capacity: parseInt(e.target.value) })}
                                                        placeholder="请输入考场容量"
                                                    />
                                                )}
                                            </div>
                                        </fieldset>

                                        {/* 设备设置 */}
                                        <fieldset className="flex flex-col">
                                            <legend className="flex items-center space-x-1 mb-1 text-sm">
                                                <Info theme="outline" size="14" />
                                                <span>设备设置</span>
                                            </legend>
                                            <div className="flex flex-col gap-2">
                                                <label className="flex items-center gap-2">
                                                    <input
                                                        id="is_multimedia"
                                                        type="checkbox"
                                                        className="checkbox checkbox-sm"
                                                        checked={data.is_multimedia}
                                                        onChange={(e) => setData({ ...data, is_multimedia: e.target.checked })}
                                                    />
                                                    <span>多媒体教室</span>
                                                </label>
                                                <label className="flex items-center gap-2">
                                                    <input
                                                        id="is_air_conditioned"
                                                        type="checkbox"
                                                        className="checkbox checkbox-sm"
                                                        checked={data.is_air_conditioned}
                                                        onChange={(e) => setData({ ...data, is_air_conditioned: e.target.checked })}
                                                    />
                                                    <span>空调设备</span>
                                                </label>
                                            </div>
                                        </fieldset>

                                        {/* 教室描述 */}
                                        <fieldset className="flex flex-col md:col-span-2">
                                            <legend className="flex items-center space-x-1 mb-1 text-sm">
                                                <Info theme="outline" size="14" />
                                                <span>教室描述</span>
                                            </legend>
                                            <textarea
                                                id="classroom_description"
                                                className="textarea textarea-sm w-full h-24"
                                                value={data.description ?? ""}
                                                onChange={(e) => setData({ ...data, description: e.target.value })}
                                                placeholder="请输入教室描述信息"
                                            />
                                        </fieldset>

                                        {/* 教室标签 */}
                                        <fieldset className="flex flex-col md:col-span-2 flex-grow">
                                            <legend className="flex items-center space-x-1 mb-1 text-sm">
                                                <Info theme="outline" size="14" />
                                                <span>教室标签</span>
                                            </legend>
                                            <div className="flex-grow">
                                                <Transfer<TransferItem>
                                                    dataSource={tagList.map(tag => ({
                                                        key: tag.class_tag_uuid,
                                                        title: tag.name,
                                                        description: tag.description
                                                    }))}
                                                    showSearch
                                                    filterOption={filterOption}
                                                    targetKeys={targetKeys}
                                                    onChange={handleTransferChange}
                                                    render={(item) => (
                                                        <div>
                                                            <div>{item.title}</div>
                                                            {item.description && (
                                                                <div className="text-xs text-gray-500">{item.description}</div>
                                                            )}
                                                        </div>
                                                    )}
                                                    listStyle={{
                                                        width: '100%',
                                                        height: 280,
                                                    }}
                                                />
                                            </div>
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
                    <div className="lg:col-span-4 md:col-span-12 sm:col-span-12 flex flex-col space-y-6">
                        <div className="card card-border bg-base-100 w-full shadow-md">
                            <h2 className="card-title bg-secondary/55 rounded-t-lg p-3"><Info theme="outline" size="18" />操作提示</h2>
                            <div className="card-body">
                                <ul className="space-y-2 text-gray-700">
                                    <li className="flex items-start">
                                        <span className="text-secondary mr-2">•</span>
                                        <span>教室名称应该简洁明了，便于识别</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-secondary mr-2">•</span>
                                        <span>教室类型决定了教室的主要用途</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-secondary mr-2">•</span>
                                        <span>所属建筑用于定位教室的具体位置</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-secondary mr-2">•</span>
                                        <span>容纳人数影响教室的分配策略</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-secondary mr-2">•</span>
                                        <span>标签可以帮助更好地筛选和管理教室</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-secondary mr-2">•</span>
                                        <span>重置按钮可恢复表单到初始状态</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        {recentClassrooms.length > 0 && (
                            <div className="card card-border bg-base-100 w-full shadow-md">
                                <h2 className="card-title bg-neutral/10 rounded-t-lg p-3"><Info theme="outline" size="18" />最近添加</h2>
                                <div className="card-body">
                                    <div className="space-y-4">
                                        {recentClassrooms.map((classroom, index) => (
                                            <div key={index} className="bg-base-200 p-4 rounded-lg">
                                                <div className="font-semibold">{classroom.name}</div>
                                                <div className="text-sm text-gray-500">
                                                    类型: {classroom.type}
                                                </div>
                                                <div className="text-xs text-gray-400">
                                                    {classroom.time}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 