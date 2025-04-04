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

import {BuildingOne, CheckOne, CloseOne, Notes, PhoneTelephone, Tag} from "@icon-park/react";
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
import {FormTabsComponent} from "../../../components/form/form_tabs_component.tsx";
import {BasicInfoSection} from "../../../components/admin/department/editing_operations/basic_info_section.tsx";
import {ContactInfoSection} from "../../../components/admin/department/editing_operations/contact_info_section.tsx";
import {
    DepartmentPropertiesSection
} from "../../../components/admin/department/editing_operations/department_properties_section.tsx";
import {NoteSection} from "../../../components/admin/department/editing_operations/note_section.tsx";
import {PageHeader} from "../../../components/admin/department/editing_operations/page_header.tsx";
import { useDispatch, useSelector } from "react-redux";
import { addForm, setForBackData, setOtherData, setThisPage } from "../../../stores/ai_form_chat.ts";
import { HtmlRecordStore, AiFormStore } from "@/models/store/ai_form_store.ts";
import { GetUnitCategoryListAPI } from "../../../apis/unit_category_api.ts";
import { GetUnitTypeListAPI } from "../../../apis/unit_type_api.ts";
import { UnitCategoryLiteEntity } from "../../../models/entity/unit_category_lite_entity.ts";
import { UnitTypeLiteEntity } from "../../../models/entity/unit_type_lite_entity.ts";

/**
 * # 部门添加页面
 * > 该函数用于创建一个完整的部门添加页面，管理员可以通过该页面创建新部门。
 *
 * @param site - 站点信息
 * @returns {JSX.Element} 返回一个完整的部门添加页面组件
 */
export function DepartmentAdd({site}: Readonly<{ site: SiteInfoEntity }>): JSX.Element {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const aiFormChat = useSelector((state: { aiFormChat: AiFormStore }) => state.aiFormChat);
    
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
    const [unitCategories, setUnitCategories] = useState<UnitCategoryLiteEntity[]>([]);
    const [unitTypes, setUnitTypes] = useState<UnitTypeLiteEntity[]>([]);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<string>("basic"); // 用于切换标签页
    const [showHelpText, setShowHelpText] = useState<boolean>(true); // 控制是否显示帮助文本

    // 设置页面标题
    useEffect(() => {
        document.title = `添加部门 | ${site.name ?? "Frontleaves Technology"}`;
        
        // 设置当前页面名称，用于AI
        dispatch(setThisPage("添加部门"));
        
        dispatch(setOtherData(""));
        dispatch(setForBackData(""));
    }, [site.name, dispatch]);

    // 获取单位类别和单位办别列表
    useEffect(() => {
        const fetchUnitData = async () => {
            try {
                const [categoryResp, typeResp] = await Promise.all([
                    GetUnitCategoryListAPI(),
                    GetUnitTypeListAPI()
                ]);

                if (categoryResp?.output === "Success") {
                    setUnitCategories(categoryResp.data!);
                } else {
                    message.warning(categoryResp?.error_message ?? "获取单位类别列表失败");
                }

                if (typeResp?.output === "Success") {
                    setUnitTypes(typeResp.data!);
                } else {
                    message.warning(typeResp?.error_message ?? "获取单位办别列表失败");
                }
            } catch (error) {
                console.error("获取单位数据失败:", error);
                message.warning("获取单位数据失败");
            }
        };

        fetchUnitData();
    }, []);
    
    // 获取部门列表
    useEffect(() => {
        const fetchDepartmentList = async () => {
            try {
                const departmentListResponse = await GetDepartmentListAPI();
                if (departmentListResponse?.output === "Success") {
                    setDepartmentList(departmentListResponse.data!);
                } else {
                    message.warning(departmentListResponse?.error_message ?? "获取部门列表失败");
                }
                
                // 记录表单元素以供AI使用
                setTimeout(() => {
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
                        { name: "departmentList", data: departmentList },
                        { name: "unitCategories", data: unitCategories },
                        { name: "unitTypes", data: unitTypes },
                        { name: "today", data: today }
                    ];
                    dispatch(setOtherData(JSON.stringify(otherData)));
                }, 500); // 延迟500毫秒，确保表单元素已渲染
            } catch (error) {
                console.error("获取部门列表失败:", error);
                message.warning("获取部门列表失败");
            }
        };

        fetchDepartmentList();
    }, [dispatch, today]);
    
    // 处理AI表单数据回填
    useEffect(() => {
        if (aiFormChat.for_back_data) {
            const blob = new Blob([aiFormChat.for_back_data], { type: 'application/javascript' });
            const url = URL.createObjectURL(blob);
            const script = document.createElement('script');
            script.src = url;
            
            // 添加脚本执行完成的事件监听器
            script.onload = () => {
                // 获取并更新各个字段
                const nameInput = document.getElementById('department_name') as HTMLInputElement;
                const codeInput = document.getElementById('department_code') as HTMLInputElement;
                const shortNameInput = document.getElementById('department_short_name') as HTMLInputElement;
                const englishNameInput = document.getElementById('department_english_name') as HTMLInputElement;
                const orderInput = document.getElementById('department_order') as HTMLInputElement;
                const categoryInput = document.getElementById('unit_category') as HTMLSelectElement;
                const typeInput = document.getElementById('unit_type') as HTMLSelectElement;
                const establishmentDateInput = document.getElementById('establishment_date') as HTMLInputElement;
                const expirationDateInput = document.getElementById('expiration_date') as HTMLInputElement;
                const parentDepartmentSelect = document.getElementById('parent_department') as HTMLSelectElement;
                
                const isEnabledCheckbox = document.getElementById('is_enabled') as HTMLInputElement;
                const isEntityCheckbox = document.getElementById('is_entity') as HTMLInputElement;
                const isAttendingCollegeCheckbox = document.getElementById('is_attending_college') as HTMLInputElement;
                const isTeachingCollegeCheckbox = document.getElementById('is_teaching_college') as HTMLInputElement;
                const isTeachingOfficeCheckbox = document.getElementById('is_teaching_office') as HTMLInputElement;
                
                const addressInput = document.getElementById('department_address') as HTMLInputElement;
                const fixedPhoneInput = document.getElementById('fixed_phone') as HTMLInputElement;
                const adminHeadInput = document.getElementById('administrative_head') as HTMLInputElement;
                const partyHeadInput = document.getElementById('party_committee_head') as HTMLInputElement;
                const teachingBuildingInput = document.getElementById('assigned_teaching_building') as HTMLInputElement;
                const remarkTextarea = document.getElementById('remark') as HTMLTextAreaElement;
                
                // 更新数据，仅更新有值的字段
                const updatedData = { ...data };
                
                if (nameInput && nameInput.value) updatedData.department_name = nameInput.value;
                if (codeInput && codeInput.value) updatedData.department_code = codeInput.value;
                if (shortNameInput && shortNameInput.value) updatedData.department_short_name = shortNameInput.value;
                if (englishNameInput && englishNameInput.value) updatedData.department_english_name = englishNameInput.value;
                if (orderInput && orderInput.value) updatedData.department_order = parseInt(orderInput.value);
                if (categoryInput && categoryInput.value) updatedData.unit_category = categoryInput.value;
                if (typeInput && typeInput.value) updatedData.unit_type = typeInput.value;
                if (establishmentDateInput && establishmentDateInput.value) updatedData.establishment_date = establishmentDateInput.value;
                if (expirationDateInput && expirationDateInput.value) updatedData.expiration_date = expirationDateInput.value;
                if (parentDepartmentSelect && parentDepartmentSelect.value) {
                    updatedData.parent_department = parentDepartmentSelect.value;
                }
                
                if (isEnabledCheckbox) updatedData.is_enabled = isEnabledCheckbox.checked;
                if (isEntityCheckbox) updatedData.is_entity = isEntityCheckbox.checked;
                if (isAttendingCollegeCheckbox) updatedData.is_attending_college = isAttendingCollegeCheckbox.checked;
                if (isTeachingCollegeCheckbox) updatedData.is_teaching_college = isTeachingCollegeCheckbox.checked;
                if (isTeachingOfficeCheckbox) updatedData.is_teaching_office = isTeachingOfficeCheckbox.checked;
                
                if (addressInput && addressInput.value) updatedData.department_address = addressInput.value;
                if (fixedPhoneInput && fixedPhoneInput.value) updatedData.fixed_phone = fixedPhoneInput.value;
                if (adminHeadInput && adminHeadInput.value) updatedData.administrative_head = adminHeadInput.value;
                if (partyHeadInput && partyHeadInput.value) updatedData.party_committee_head = partyHeadInput.value;
                if (teachingBuildingInput && teachingBuildingInput.value) {
                    // 教学楼可能是多个值，按逗号分隔并转换为数组
                    updatedData.assigned_teaching_building = teachingBuildingInput.value.split(',').map(item => item.trim());
                }
                if (remarkTextarea && remarkTextarea.value) updatedData.remark = remarkTextarea.value;
                
                // 更新状态
                setData(updatedData);
                
                // 释放资源
                URL.revokeObjectURL(url);
                document.head.removeChild(script);
            };
            
            document.head.appendChild(script);
        }
    }, [aiFormChat.for_back_data]); // 移除了data依赖，避免无限执行

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
                }, 500);
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

    // 切换帮助提示的显示/隐藏
    const toggleHelpText = () => {
        setShowHelpText(!showHelpText);
    };

    // 定义表单标签页
    const formTabs = [
        {
            id: "basic",
            title: "基本信息",
            icon: <BuildingOne theme="outline" size="18" />,
            content: (
                <BasicInfoSection
                    data={data}
                    setData={setData}
                    departmentList={departmentList}
                    unitCategories={unitCategories}
                    unitTypes={unitTypes}
                    showHelpText={showHelpText}
                    today={today}
                />
            )
        },
        {
            id: "contact",
            title: "联系方式",
            icon: <PhoneTelephone theme="outline" size="18" />,
            content: (
                <ContactInfoSection
                    data={data}
                    setData={setData}
                    showHelpText={showHelpText}
                    hasSelected={activeTab === "contact"}
                />
            )
        },
        {
            id: "properties",
            title: "部门属性",
            icon: <Tag theme="outline" size="18" />,
            content: (
                <DepartmentPropertiesSection
                    data={data}
                    setData={setData}
                />
            )
        },
        {
            id: "notes",
            title: "备注信息",
            icon: <Notes theme="outline" size="18" />,
            content: (
                <NoteSection
                    data={data}
                    setData={setData}
                    showHelpText={showHelpText}
                />
            )
        }
    ];

    return (
        <div className="container mx-auto pb-6">
            {/* 页面标题和导航 */}
            <PageHeader
                onBack={handleBack}
                showHelpText={showHelpText}
                toggleHelpText={toggleHelpText}
                isEditMode={false}
            />

            {/* 表单卡片 */}
            <CardComponent padding={18}>
                <form id="department_add" onSubmit={handleSubmit} className="space-y-3">
                    {/* 表单标签页 */}
                    <FormTabsComponent
                        tabs={formTabs}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        tabsStyle="tabs-boxed"
                    />

                    {/* 表单按钮 */}
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={handleReset}
                            className="btn btn-outline"
                        >
                            <CloseOne theme="outline" size="18"/>
                            <span>重置</span>
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
                                    <span>保存</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </CardComponent>
        </div>
    );
}
