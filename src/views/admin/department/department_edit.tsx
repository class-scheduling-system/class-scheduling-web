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

import {BuildingOne, CheckOne, CloseOne, Notes, PhoneTelephone, Tag} from "@icon-park/react";
import * as React from "react";
import {JSX, useEffect, useState} from "react";
import {DepartmentDTO} from "../../../models/dto/department_dto.ts";
import {EditDepartmentAPI, GetDepartmentAPI, GetDepartmentListAPI} from "../../../apis/department_api.ts";
import {DepartmentEntity} from "../../../models/entity/department_entity.ts";
import {CardComponent} from "../../../components/card_component.tsx";
import {useNavigate, useParams} from "react-router";
import dayjs from "dayjs";
import {SiteInfoEntity} from "../../../models/entity/site_info_entity.ts";
import {message} from "antd";
import {FormTabsComponent} from "../../../components/form/form_tabs_component.tsx";
import {BasicInfoSection} from "./components/basic_info_section.tsx";
import {ContactInfoSection} from "./components/contact_info_section.tsx";
import {DepartmentPropertiesSection} from "./components/department_properties_section.tsx";
import {NoteSection} from "./components/note_section.tsx";
import {PageHeader} from "./components/page_header.tsx";

/**
 * # 部门编辑页面
 * > 该函数用于创建一个完整的部门编辑页面，管理员可以通过该页面编辑已有部门信息。
 *
 * @param site - 站点信息
 * @returns {JSX.Element} 返回一个完整的部门编辑页面组件
 */
export function DepartmentEdit({site}: Readonly<{ site: SiteInfoEntity }>): JSX.Element {
    const navigate = useNavigate();
    const { uuid } = useParams<{ uuid: string }>();

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

    const [originalData, setOriginalData] = useState<DepartmentEntity | null>(null);
    const [departmentList, setDepartmentList] = useState<DepartmentEntity[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<string>("basic"); // 用于切换标签页
    const [showHelpText, setShowHelpText] = useState<boolean>(true); // 控制是否显示帮助文本

    // 设置页面标题
    useEffect(() => {
        document.title = `编辑部门 | ${site.name ?? "Frontleaves Technology"}`;
    }, [site.name]);

    // 获取部门详情和部门列表
    useEffect(() => {
        if (!uuid) {
            message.error("部门ID不存在，请返回列表重试").then();
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                // 获取部门详情
                const departmentResponse = await GetDepartmentAPI(uuid);
                if (departmentResponse?.output === "Success" && departmentResponse.data) {
                    const departmentEntity = departmentResponse.data;
                    setOriginalData(departmentEntity);

                    // 转换为 DTO 对象
                    const departmentDTO: DepartmentDTO = {
                        department_name: departmentEntity.department_name?.trim() ?? "",
                        department_code: departmentEntity.department_code?.trim() ?? "",
                        department_short_name: departmentEntity.department_short_name,
                        department_english_name: departmentEntity.department_english_name,
                        department_order: departmentEntity.department_order ?? 100,
                        is_enabled: departmentEntity.is_enabled ?? false,
                        is_entity: departmentEntity.is_entity ?? false,
                        is_attending_college: departmentEntity.is_attending_college ?? false,
                        is_teaching_college: departmentEntity.is_teaching_college ?? false,
                        is_teaching_office: departmentEntity.is_teaching_office ?? false,
                        establishment_date: departmentEntity.establishment_date
                            ? dayjs(departmentEntity.establishment_date).format("YYYY-MM-DD")
                            : today,
                        expiration_date: departmentEntity.expiration_date
                            ? dayjs(departmentEntity.expiration_date).format("YYYY-MM-DD")
                            : undefined,
                        unit_category: departmentEntity.unit_category?.trim() ?? "",
                        unit_type: departmentEntity.unit_type?.trim() ?? "",
                        department_address: departmentEntity.department_address,
                        fixed_phone: departmentEntity.fixed_phone,
                        administrative_head: departmentEntity.administrative_head,
                        party_committee_head: departmentEntity.party_committee_head,
                        assigned_teaching_building: departmentEntity.assigned_teaching_building,
                        parent_department: departmentEntity.parent_department,
                        remark: departmentEntity.remark
                    };

                    setData(departmentDTO);
                } else {
                    message.error(departmentResponse?.error_message ?? "获取部门详情失败");
                    setTimeout(() => navigate("/admin/department"), 1500);
                }

                // 获取部门列表（用于选择上级部门）
                const departmentListResponse = await GetDepartmentListAPI();
                if (departmentListResponse?.output === "Success") {
                    // 过滤掉当前部门，避免自己选择自己作为上级部门
                    const filteredList = departmentListResponse.data!.filter(
                        dept => dept.department_uuid !== uuid
                    );
                    setDepartmentList(filteredList);
                } else {
                    message.warning(departmentListResponse?.error_message ?? "获取部门列表失败");
                }
            } catch (error) {
                console.error("获取数据失败:", error);
                message.error("获取数据失败，请重试");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [uuid, navigate, today]);

    // 返回部门列表页面
    const handleBack = () => {
        navigate("/admin/department");
    };

    // 重置表单到原始数据
    const handleReset = () => {
        if (originalData) {
            const departmentDTO: DepartmentDTO = {
                department_name: originalData.department_name?.trim() ?? "",
                department_code: originalData.department_code?.trim() ?? "",
                department_short_name: originalData.department_short_name,
                department_english_name: originalData.department_english_name,
                department_order: originalData.department_order?? 100,
                is_enabled: originalData.is_enabled ?? false,
                is_entity: originalData.is_entity ?? false,
                is_attending_college: originalData.is_attending_college ?? false,
                is_teaching_college: originalData.is_teaching_college ?? false,
                is_teaching_office: originalData.is_teaching_office ?? false,
                establishment_date: originalData.establishment_date
                    ? dayjs(originalData.establishment_date).format("YYYY-MM-DD")
                    : today,
                expiration_date: originalData.expiration_date
                    ? dayjs(originalData.expiration_date).format("YYYY-MM-DD")
                    : undefined,
                unit_category: originalData.unit_category?.trim() ?? "",
                unit_type: originalData.unit_type?.trim() ?? "",
                department_address: originalData.department_address,
                fixed_phone: originalData.fixed_phone,
                administrative_head: originalData.administrative_head,
                party_committee_head: originalData.party_committee_head,
                assigned_teaching_building: originalData.assigned_teaching_building,
                parent_department: originalData.parent_department,
                remark: originalData.remark
            };

            setData(departmentDTO);
        }
    };

    // 提交表单
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!uuid) {
            message.error("部门ID不存在，无法更新");
            return;
        }

        setSubmitting(true);

        try {
            const response = await EditDepartmentAPI(uuid, data);
            if (response?.output === "Success") {
                message.success("部门更新成功");
                setTimeout(() => {
                    navigate("/admin/department");
                }, 500);
            } else {
                message.warning(response?.error_message ?? "部门更新失败");
            }
        } catch (error) {
            console.error("部门更新请求失败:", error);
            message.warning("部门更新失败");
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
                isEditMode={true}
            />

            {/* 加载中状态 */}
            {loading && (
                <div className="flex flex-col items-center justify-center my-8 p-10">
                    <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
                    <p className="text-base-content/70">正在加载部门数据，请稍候...</p>
                </div>
            )}

            {/* 数据加载失败状态 */}
            {!loading && !originalData && (
                <div className="alert alert-error shadow-lg my-8">
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>部门数据加载失败，请返回列表后重试。</span>
                    </div>
                    <div className="flex-none">
                        <button onClick={handleBack} className="btn btn-sm btn-primary">返回列表</button>
                    </div>
                </div>
            )}

            {/* 表单卡片 */}
            {!loading && originalData && (
                <CardComponent padding={18}>
                    <form id="department_edit" onSubmit={handleSubmit} className="space-y-3">
                        {/* 部门ID信息 */}
                        <div className="flex items-center justify-between bg-base-200 px-4 py-2 rounded-md">
                            <div className="text-sm">
                                <span className="font-medium">部门ID：</span> {originalData.department_uuid}
                            </div>
                            <div className="text-sm">
                                <span className="font-medium">创建时间：</span> {dayjs(originalData.created_at).format("YYYY-MM-DD HH:mm:ss")}
                            </div>
                        </div>

                        {/* 表单标签页 */}
                        <FormTabsComponent
                            tabs={formTabs}
                            activeTab={activeTab}
                            onTabChange={setActiveTab}
                            tabsStyle="tabs-boxed"
                        />

                        {/* 表单按钮 */}
                        <div className="flex justify-between">
                            <div>
                                {originalData && (
                                    <div className="text-sm text-base-content/70">
                                        最后更新: {dayjs(originalData.updated_at).format("YYYY-MM-DD HH:mm:ss")}
                                    </div>
                                )}
                            </div>
                            <div className="flex space-x-4">
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
                        </div>
                    </form>
                </CardComponent>
            )}
        </div>
    );
}
