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

import {
    CheckOne,
    Envelope,
    PhoneTelephone,
    IdCard,
    Write,
    AllApplication,
    English,
    AddTextTwo,
    Return,
    Column,
    Chinese,
    BuildingThree,
    Refresh,
    UserBusiness, AddUser, Info
} from "@icon-park/react";
import * as React from "react";
import {JSX, useEffect, useState} from "react";
import { message} from "antd";
import { AddTeacherAPI } from "../../../apis/teacher_api.ts";
import {Link} from "react-router";
import {PageSearchDTO} from "../../../models/dto/page/page_search_dto.ts";
import {GetDepartmentSimpleListAPI} from "../../../apis/department_api.ts";
import {TeacherTypeEntity} from "../../../models/entity/teacher_type_entity.ts";
import {GetTeacherTypeSimpleListAPI} from "../../../apis/teacher_type_api.ts";
import {DepartmentEntity} from "../../../models/entity/department_entity.ts";
import {TeacherDTO} from "../../../models/dto/teacher_dto.ts";
import { SiteInfoEntity } from "../../../models/entity/site_info_entity.ts";


export function AcademicAddTeacher({site}: Readonly<{
    site: SiteInfoEntity
}>): JSX.Element {
    const [data, setData] = useState<TeacherDTO>(
        {
            phone: "",
            email: "",
            job_title: "",
            desc: "",
        } as TeacherDTO);

    const [departmentList, setDepartmentList] = useState<DepartmentEntity[]>([]);
    const [teacherTypeList, setTeacherTypeList] = useState<TeacherTypeEntity[]>([]);
    const [searchRequest] = useState<PageSearchDTO>({
        page: 1,
        size: 100, // 加载更多数据以便选择
        is_desc: true,
    } as PageSearchDTO);

    interface RecentTeacher {
        name: string;
        department: string;
        time: string;
    }

    // 最近添加的教师列表状态 - 从localStorage获取或使用空数组作为默认值
    const [recentTeachers, setRecentTeachers] = useState<RecentTeacher[]>(() => {
        const savedTeachers = localStorage.getItem('recentAddedTeachers');
        return savedTeachers ? JSON.parse(savedTeachers) : [];
    });

    useEffect(() => {
        document.title = `添加教师 | ${site.name ?? "Frontleaves Technology"}`;
    }, [site.name]);

    // 获取部门列表
    useEffect(() => {
        GetDepartmentSimpleListAPI()
            .then(response => {
                if (response?.output === "Success") {
                    console.log("获取部门列表成功:", response.data);
                    setDepartmentList(response.data! as DepartmentEntity[]);
                } else {
                    message.error(response?.error_message ?? "获取部门列表失败");
                }
            })
            .catch(error => {
                console.error("部门列表请求失败:", error);
                message.error("获取部门列表失败");
            });
    }, [searchRequest]);

    // 重置表单
    const resetForm = () => {
        setData(
            {
                phone: "",
                email: "",
                job_title: "",
                desc: "",
            } as TeacherDTO);
    };

    // 更新最近添加的教师列表
    const updateRecentTeachers = (newTeacher: { desc?: string | undefined; email?: string | undefined; english_name?: string; ethnic?: string; id?: string; job_title?: string | undefined; name: string; phone?: string | undefined; sex?: boolean; type?: string; unit_uuid: string; user_uuid?: string; }) => {
        // 创建当前时间格式化字符串
        const now = new Date();
        const timeString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        // 获取部门名称
        const getDepartmentName = (deptUuid: string | undefined) => {
            const selectedDept = departmentList.find(dept => dept.department_uuid === deptUuid);
            return selectedDept ? selectedDept.department_name : "";
        };

        // 创建新教师记录
        const teacherRecord: RecentTeacher = {
            name: newTeacher.name,
            department: getDepartmentName(newTeacher.unit_uuid) || "", // 确保即使找不到部门也返回空字符串
            time: timeString
        };

        // 将新教师添加到最近教师列表的最前面，并只保留前三个
        const updatedRecentTeachers: RecentTeacher[] = [teacherRecord, ...recentTeachers.slice(0, 2)];

// 更新状态
        setRecentTeachers(updatedRecentTeachers);

        // 保存到localStorage
        localStorage.setItem('recentAddedTeachers', JSON.stringify(updatedRecentTeachers));
    };

    useEffect(() => {
        GetTeacherTypeSimpleListAPI()
            .then(response => {
                if (response?.output === "Success") {
                    console.log("获取教师类型列表成功:", response.data);
                    setTeacherTypeList(response.data! as TeacherTypeEntity[]);
                } else {
                    message.error(response?.error_message ?? "获取教师类型列表失败");
                }
            })
            .catch(error => {
                console.error("教师类型列表请求失败:", error);
                message.error("获取教师类型列表失败");
            });
    }, []);

    // 提交表单
    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        try {
            // 验证必填字段
            if (!data.name || !data.english_name || !data.ethnic || data.sex === undefined || !data.unit_uuid || !data.id) {
                message.error("请填写所有必填字段");
                return;
            }

            const getResp = await AddTeacherAPI(data);
            if (getResp?.output === "Success") {
                // 更新最近添加的教师列表
                updateRecentTeachers(data);

                message.success("添加教师成功");
                // 重置表单，便于继续添加教师
                resetForm();
            } else {
                message.error(getResp?.error_message ?? "添加教师失败");
            }
        } catch (error) {
            console.error("添加教师失败:", error);
            message.error("添加教师失败");
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center space-x-2">
                <Link to={"/academic/teacher"}>
                    <Return theme="outline" size="24"/>
                </Link>
                <h2 className="text-2xl font-bold flex items-center space-x-2">
                    <span>添加新教师</span>
                </h2>
            </div>

            <div className="w-full">
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="lg:col-span-8 md:col-span-12 sm:col-span-12 flex">
                        <div className="card card-border bg-base-100 w-full shadow-md">
                            <h2 className="card-title bg-neutral/10 rounded-t-lg p-3"><AddUser theme="outline" size="18"/>添加教师信息</h2>
                            <div className="card-body">
                                <form id="teacher_add" onSubmit={onSubmit} className="flex flex-col flex-grow space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                                        <fieldset className="flex flex-col">
                                            <legend className="flex items-center space-x-1 mb-1 text-sm">
                                                <Chinese theme="outline" size="14"/>
                                                <span>姓名</span>
                                                <span className="text-red-500">*</span>
                                            </legend>
                                            <input
                                                type="text"
                                                className="input input-sm w-full validator"
                                                required
                                                placeholder="请输入教师姓名"
                                                value={data.name || ""}
                                                onChange={(e) => setData({...data, name: e.target.value})}
                                            />
                                        </fieldset>
                                        <fieldset className="flex flex-col">
                                            <legend className="flex items-center space-x-1 mb-1 text-sm">
                                                <English theme="outline" size="14"/>
                                                <span>英文名</span>
                                                <span className="text-red-500">*</span>
                                            </legend>
                                            <input
                                                type="text"
                                                className="input input-sm w-full validator"
                                                required
                                                placeholder="请输入英文名"
                                                value={data.english_name || ""}
                                                onChange={(e) => setData({...data, english_name: e.target.value})}
                                            />
                                        </fieldset>

                                        <fieldset className="flex flex-col">
                                            <legend className="flex items-center space-x-1 mb-1 text-sm">
                                                <IdCard theme="outline" size="14"/>
                                                <span>工号</span>
                                                <span className="text-red-500">*</span>
                                            </legend>
                                            <input
                                                type="text"
                                                className="input input-sm w-full validator"
                                                required
                                                placeholder="请输入教师工号"
                                                value={data.id || ""}
                                                onChange={(e) => setData({...data, id: e.target.value})}
                                            />
                                        </fieldset>
                                        <fieldset className="flex flex-col">
                                            <legend className="flex items-center space-x-1 mb-1 text-sm">
                                                <Column theme="outline" size="14"/>
                                                <span>性别</span>
                                                <span className="text-red-500">*</span>
                                            </legend>
                                            <select
                                                className="select select-sm w-full validator"
                                                value={data.sex !== undefined ? String(data.sex) : ""}
                                                onChange={(e) => setData({...data, sex: e.target.value === "true"})}
                                                required
                                            >
                                                <option value="" disabled>请选择性别</option>
                                                <option value="false">女</option>
                                                <option value="true">男</option>
                                            </select>
                                        </fieldset>
                                        <fieldset className="flex flex-col">
                                            <legend className="flex items-center space-x-1 mb-1 text-sm">
                                                <UserBusiness theme="outline" size="14"/>
                                                <span>教师类型</span>
                                                <span className="text-red-500">*</span>
                                            </legend>
                                            <select
                                                className="select select-sm w-full validator"
                                                value={data.type || ""}
                                                onChange={(e) => setData({ ...data, type: e.target.value })}
                                                required
                                            >
                                                <option value="" disabled>请选择教师类型</option>
                                                {teacherTypeList.map((type) => (
                                                    <option key={type.teacher_type_uuid} value={type.teacher_type_uuid}>
                                                        {type.type_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </fieldset>
                                        <fieldset className="flex flex-col">
                                            <legend className="flex items-center space-x-1 mb-1 text-sm">
                                                <BuildingThree theme="outline" size="14"/>
                                                <span>单位</span>
                                                <span className="text-red-500">*</span>
                                            </legend>
                                            <select
                                                className="select select-sm w-full validator"
                                                value={data.unit_uuid || ""}
                                                onChange={(e) => setData({...data, unit_uuid: e.target.value})}
                                                required
                                            >
                                                <option value="" disabled>请选择单位</option>
                                                {departmentList.map((department) => (
                                                    <option key={department.department_uuid} value={department.department_uuid}>
                                                        {department.department_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </fieldset>
                                        <fieldset className="flex flex-col">
                                            <legend className="flex items-center space-x-1 mb-1 text-sm">
                                                <AllApplication theme="outline" size="14"/>
                                                <span>民族</span>
                                                <span className="text-red-500">*</span>
                                            </legend>
                                            <input
                                                type="text"
                                                className="input input-sm w-full validator"
                                                required
                                                placeholder="请输入教师民族"
                                                value={data.ethnic || ""}
                                                onChange={(e) => setData({...data, ethnic: e.target.value})}
                                            />
                                        </fieldset>
                                        <fieldset className="flex flex-col">
                                            <legend className="flex items-center space-x-1 mb-1 text-sm">
                                                <PhoneTelephone theme="outline" size="14"/>
                                                <span>电话</span>
                                            </legend>
                                            <input
                                                type="tel"
                                                className="input input-sm w-full validator"
                                                placeholder="请输入联系电话"
                                                value={data.phone || ""}
                                                onChange={(e) => setData({...data, phone: e.target.value})}
                                            />
                                        </fieldset>
                                        <fieldset className="flex flex-col">
                                            <legend className="flex items-center space-x-1 mb-1 text-sm">
                                                <Envelope theme="outline" size="14"/>
                                                <span>邮箱</span>
                                            </legend>
                                            <input
                                                type="email"
                                                className="input input-sm w-full validator"
                                                placeholder="请输入电子邮箱"
                                                value={data.email || ""}
                                                onChange={(e) => setData({...data, email: e.target.value})}
                                            />
                                        </fieldset>
                                        <fieldset className="flex flex-col">
                                            <legend className="flex items-center space-x-1 mb-1 text-sm">
                                                <AddTextTwo theme="outline" size="14"/>
                                                <span>职称</span>
                                            </legend>
                                            <input
                                                type="text"
                                                className="input input-sm w-full validator"
                                                placeholder="请输入职称"
                                                value={data.job_title || ""}
                                                onChange={(e) => setData({...data, job_title: e.target.value})}
                                            />
                                        </fieldset>
                                        <fieldset className="flex flex-col md:col-span-2">
                                            <legend className="flex items-center space-x-1 mb-1 text-sm">
                                                <Write theme="outline" size="14"/>
                                                <span>描述</span>
                                            </legend>
                                            <textarea
                                                className="textarea textarea-bordered textarea-sm w-full validator"
                                                placeholder="请输入教师描述"
                                                rows={3}
                                                value={data.desc || ""}
                                                onChange={(e) => setData({...data, desc: e.target.value})}
                                            />
                                        </fieldset>
                                    </div>
                                    <div className="card-actions justify-end flex">
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline"
                                            onClick={resetForm}
                                        >
                                            <Refresh theme="outline" size="14"/>
                                            <span>重置</span>
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-sm btn-primary"
                                        >
                                            <CheckOne theme="outline" size="14"/>
                                            <span>提交</span>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-4 md:col-span-12 sm:col-span-12">
                        <div className="card card-border bg-base-100 w-full  shadow-md">
                            <h2 className="card-title bg-secondary/55 rounded-t-lg p-3"><Info theme="outline" size="18"/>操作提示</h2>
                            <div className="card-body">
                                <ul className="space-y-1 text-gray-700">
                                    <li className="flex items-start">
                                        <span className="text-secondary mr-2">•</span>
                                        <span>姓名、英文名、工号为必填项</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-secondary mr-2">•</span>
                                        <span>单位决定教师所属的院系或部门</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-secondary mr-2">•</span>
                                        <span>职称信息用于学校管理和统计</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-secondary mr-2">•</span>
                                        <span>电话和邮箱用于系统通知及联系</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-secondary mr-2">•</span>
                                        <span>描述可填写教师简介或专业特长</span>
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