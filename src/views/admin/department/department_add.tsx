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
import {DepartmentAddAPI, GetDepartmentListAPI} from "../../../apis/department_api.ts";
import {DepartmentEntity} from "../../../models/entity/department_entity.ts";
import {CardComponent} from "../../../components/card_component.tsx";
import {useNavigate} from "react-router";
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
    const [activeTab, setActiveTab] = useState<string>("basic"); // 用于切换标签页
    const [showHelpText, setShowHelpText] = useState<boolean>(true); // 控制是否显示帮助文本

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

            {/* 加载中状态 */}
            {loading && (
                <div className="flex flex-col items-center justify-center my-8 p-10">
                    <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
                    <p className="text-base-content/70">正在加载部门数据，请稍候...</p>
                </div>
            )}

            {/* 表单卡片 */}
            {!loading && (
                <CardComponent padding={18}>
                    <form id="department_add" onSubmit={handleSubmit} className={"space-y-3"}>
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
            )}
        </div>
    );
}
