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

import { useState, useEffect, JSX } from "react";
import {
    AllApplication,
    BuildingThree,
    CheckOne, Chinese,
    CloseOne, Column, DocDetail, EditName, English,
    Envelope, Keyboard,
    PhoneTelephone, Return,
    User, UserBusiness
} from "@icon-park/react";
import { message } from "antd";
import * as React from "react";
import {GetDepartmentListAPI} from "../../apis/department_api.ts";
import {DepartmentInfoEntity} from "../../models/entity/department__info_entity.ts";
import {PageSearchDTO} from "../../models/dto/page_search_dto.ts";
import {TeacherEditDTO} from "../../models/dto/teacher_edit_dto.ts";
import {EditTeacherAPI} from "../../apis/teacher_api.ts";
import {GetUserListAPI} from "../../apis/user_api.ts";
import {UserInfoEntity} from "../../models/entity/user_info_entity.ts";
import {SiteInfoEntity} from "../../models/entity/site_info_entity.ts";
import {Link, useLocation, useNavigate, useParams} from "react-router";

/**
 * # 编辑教师页面
 * > 该函数用于创建一个编辑教师页面，管理员可以通过该页面修改教师的信息
 * @constructor
 */
export function AcademicEditTeacher({site}: Readonly<{
    site: SiteInfoEntity
}>): JSX.Element {
    const navigate = useNavigate();
    const location = useLocation();
    const { teacherId } = useParams(); // 从URL获取教师ID

    // 从路由参数获取教师信息
    const teacherInfo = location.state?.teacherInfo;

    const [data, setData] = useState<TeacherEditDTO>({
        phone: "",
        email: "",
        job_title: "",
        desc: ""
    } as TeacherEditDTO);

    const [departmentList, setDepartmentList] = useState<DepartmentInfoEntity[]>([]);
    const [userList, setUserList] = useState<UserInfoEntity[]>([]);
    const [searchRequest] = useState<PageSearchDTO>({
        page: 1,
        size: 100, // 加载更多数据以便选择
        is_desc: true,
    } as PageSearchDTO);
    const [loading, setLoading] = useState(true);

    // 初始化教师信息
    useEffect(() => {
        if (teacherInfo) {
            // 使用传递过来的教师信息初始化表单
            setData({
                name: teacherInfo.name,
                english_name: teacherInfo.english_name,
                ethnic: teacherInfo.ethnic,
                sex: teacherInfo.sex,
                phone: teacherInfo.phone,
                email: teacherInfo.email,
                job_title: teacherInfo.job_title,
                desc: teacherInfo.desc,
                id: teacherInfo.id,
                unit_uuid: teacherInfo.unit_uuid,
                user_uuid: teacherInfo.user_uuid,
                type: teacherInfo.type,
            });
            setLoading(false);
        } else {
            // 如果没有传递教师信息，返回教师列表页面
            message.error("未找到教师信息");
            navigate("/academic/teacher");
        }
    }, [teacherInfo, navigate]);

    // 设置文档标题
    useEffect(() => {
        document.title = `编辑教师 | ${site.name ?? "Frontleaves Technology"}`;
    }, [site.name]);

    // 重置表单
    const resetForm = () => {
        if (teacherInfo) {
            // 重置为初始教师信息
            setData({
                name: teacherInfo.name,
                english_name: teacherInfo.english_name,
                ethnic: teacherInfo.ethnic,
                sex: teacherInfo.sex,
                type:teacherInfo.type,
                phone: teacherInfo.phone,
                email: teacherInfo.email,
                job_title: teacherInfo.job_title,
                desc: teacherInfo.desc,
                id: teacherInfo.id,
                unit_uuid: teacherInfo.unit_uuid,
                user_uuid: teacherInfo.user_uuid,
            });
        }
    };

    // 提交表单
    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        try {
            // 验证必填字段
            if (!data.name || !data.english_name || !data.ethnic || data.sex === undefined || !data.id) {
                message.error("请填写所有必填字段");
                return;
            }

            const getResp = await EditTeacherAPI(teacherId || '', data);
            if (getResp?.output === "Success") {
                message.success("编辑教师成功");
                navigate("/academic/teacher"); // 编辑成功后返回教师列表
            } else {
                message.error(getResp?.error_message ?? "编辑教师失败");
            }
        } catch (error) {
            console.error("编辑教师失败:", error);
            message.error("编辑教师失败");
        }
    }

    // 获取部门列表
    useEffect(() => {
        GetDepartmentListAPI(searchRequest)
            .then(response => {
                if (response?.output === "Success") {
                    console.log("获取部门列表成功:", response.data);
                    setDepartmentList(response.data!.records);
                } else {
                    message.error(response?.error_message ?? "获取部门列表失败");
                }
            })
            .catch(error => {
                console.error("部门列表请求失败:", error);
                message.error("获取部门列表失败");
            });
    }, [searchRequest]);

    // 获取用户列表
    useEffect(() => {
        GetUserListAPI(searchRequest)
            .then(response => {
                if (response?.output === "Success") {
                    console.log("获取用户列表成功:", response.data);
                    setUserList(response.data!.records);
                } else {
                    message.error(response?.error_message ?? "获取用户列表失败");
                }
            })
            .catch(error => {
                console.error("用户列表请求失败:", error);
                message.error("获取用户列表失败");
            });
    }, [searchRequest]);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center space-x-2 pb-2">
                <Link to={"/academic/teacher"}>
                    <Return theme="outline" size="24"/>
                </Link>
                <h2 className="text-2xl font-bold flex items-center space-x-2">
                    <EditName theme="outline" size="24" />
                    <span>编辑教师</span>
                </h2>
            </div>

            {loading ? (
                // 加载中显示骨架屏
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array(8).fill(0).map((_, index) => (
                        <div key={index} className="animate-pulse">
                            <div className="h-4 bg-base-300 rounded w-24 mb-2"></div>
                            <div className="h-10 bg-base-300 rounded w-full"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="">
                    <form id="teacher_edit" onSubmit={onSubmit} className="py-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <fieldset className="flex flex-col">
                            <legend className="flex items-center space-x-1 mb-1">
                                <Chinese theme="outline" size="16" fill="#333"/>
                                <span>姓名</span>
                                <span className="text-red-500">*</span>
                            </legend>
                            <input
                                type="text"
                                className="input input-bordered w-full"
                                required
                                placeholder="请输入教师姓名"
                                value={data.name || ""}
                                onChange={(e) => setData({...data, name: e.target.value})}
                            />
                        </fieldset>
                        <fieldset className="flex flex-col">
                            <legend className="flex items-center space-x-1 mb-1">
                                <English theme="outline" size="16" fill="#333"/>
                                <span>英文名</span>
                                <span className="text-red-500">*</span>
                            </legend>
                            <input
                                type="text"
                                className="input input-bordered w-full"
                                required
                                placeholder="请输入英文名"
                                value={data.english_name || ""}
                                onChange={(e) => setData({...data, english_name: e.target.value})}
                            />
                        </fieldset>

                        <fieldset className="flex flex-col">
                            <legend className="flex items-center space-x-1 mb-1">
                                <Keyboard theme="outline" size="16" fill="#333"/>
                                <span>工号</span>
                                <span className="text-red-500">*</span>
                            </legend>
                            <input
                                type="text"
                                className="input input-bordered w-full"
                                required
                                placeholder="请输入教师工号"
                                value={data.id || ""}
                                onChange={(e) => setData({...data, id: e.target.value})}
                            />
                        </fieldset>
                        <fieldset className="flex flex-col">
                            <legend className="flex items-center space-x-1 mb-1">
                                <Column theme="outline" size="16" fill="#333"/>
                                <span>性别</span>
                                <span className="text-red-500">*</span>
                            </legend>
                            <select
                                className="select select-bordered w-full"
                                value={data.sex !== undefined ? String(data.sex) : ""}
                                onChange={(e) => setData({...data, sex: e.target.value === '1'})}
                                required
                            >
                                <option value="" disabled>请选择性别</option>
                                <option value="0">女</option>
                                <option value="1">男</option>
                            </select>
                        </fieldset>
                        {/* 教师类型 */}
                        <fieldset className="flex flex-col">
                            <legend className="flex items-center space-x-1 mb-1">
                                <Envelope theme="outline" size="16" fill="#333" />
                                <span>教师类型</span>
                            </legend>
                            <input
                                type="text"
                                className="input w-full validator"
                                value={data.type || ""}
                                onChange={(e) => setData({ ...data, type: e.target.value })}
                            />
                        </fieldset>
                        <fieldset className="flex flex-col">
                            <legend className="flex items-center space-x-1 mb-1">
                                <BuildingThree theme="outline" size="16" fill="#333"/>
                                <span>单位</span>
                                <span className="text-red-500">*</span>
                            </legend>
                            <select
                                className="select select-bordered w-full"
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
                            <legend className="flex items-center space-x-1 mb-1">
                                <User theme="outline" size="16" fill="#333"/>
                                <span>用户名</span>
                                <span className="text-red-500">*</span>
                            </legend>
                            <select
                                className="select select-bordered w-full"
                                value={data.user_uuid || ""}
                                onChange={(e) => setData({...data, user_uuid: e.target.value})}
                                required
                            >
                                <option value="" disabled>请选择用户</option>
                                {userList?.map((userInfo: UserInfoEntity) => (
                                    <option
                                        key={userInfo.user?.user_uuid}
                                        value={userInfo.user?.user_uuid ?? ''}
                                    >
                                        {userInfo.user?.name}
                                    </option>
                                )) ?? []}
                            </select>
                        </fieldset>
                        <fieldset className="flex flex-col">
                            <legend className="flex items-center space-x-1 mb-1">
                                <AllApplication theme="outline" size="16" fill="#333"/>
                                <span>民族</span>
                                <span className="text-red-500">*</span>
                            </legend>
                            <input
                                type="text"
                                className="input input-bordered w-full"
                                required
                                placeholder="请输入民族"
                                value={data.ethnic || ""}
                                onChange={(e) => setData({...data, ethnic: e.target.value})}
                            />
                        </fieldset>
                        <fieldset className="flex flex-col">
                            <legend className="flex items-center space-x-1 mb-1">
                                <PhoneTelephone theme="outline" size="16" fill="#333"/>
                                <span>电话</span>
                            </legend>
                            <input
                                type="tel"
                                className="input input-bordered w-full"
                                placeholder="请输入联系电话"
                                value={data.phone || ""}
                                onChange={(e) => setData({...data, phone: e.target.value})}
                            />
                        </fieldset>
                        <fieldset className="flex flex-col">
                            <legend className="flex items-center space-x-1 mb-1">
                                <Envelope theme="outline" size="16" fill="#333"/>
                                <span>邮箱</span>
                            </legend>
                            <input
                                type="email"
                                className="input input-bordered w-full"
                                placeholder="请输入电子邮箱"
                                value={data.email || ""}
                                onChange={(e) => setData({...data, email: e.target.value})}
                            />
                        </fieldset>
                        <fieldset className="flex flex-col">
                            <legend className="flex items-center space-x-1 mb-1">
                                <UserBusiness theme="outline" size="16" fill="#333"/>
                                <span>职称</span>
                            </legend>
                            <input
                                type="text"
                                className="input input-bordered w-full"
                                placeholder="请输入职称"
                                value={data.job_title || ""}
                                onChange={(e) => setData({...data, job_title: e.target.value})}
                            />
                        </fieldset>
                        <fieldset className="flex flex-col md:col-span-2">
                            <legend className="flex items-center space-x-1 mb-1">
                                <DocDetail theme="outline" size="16" fill="#333"/>
                                <span>描述</span>
                            </legend>
                            <textarea
                                className="textarea textarea-bordered w-full"
                                placeholder="请输入教师描述"
                                rows={3}
                                value={data.desc || ""}
                                onChange={(e) => setData({...data, desc: e.target.value})}
                            />
                        </fieldset>
                        {/* 操作按钮 */}
                        <div className="md:col-span-2 mt-6 flex space-x-4">
                            <button
                                type="button"
                                className="btn btn-ghost"
                                onClick={resetForm}
                            >
                                <CloseOne theme="outline" size="16"/>
                                <span>重置</span>
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                <CheckOne theme="outline" size="16"/>
                                <span>提交</span>
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}