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
    Column, DocDetail, English,
    Envelope, Keyboard,
    PhoneTelephone, Return, Refresh,
    UserBusiness, Announcement, User,
} from "@icon-park/react";
import {message, Card} from "antd";
import * as React from "react";
import { GetDepartmentSimpleListAPI} from "../../../apis/department_api.ts";
import {PageSearchDTO} from "../../../models/dto/page_search_dto.ts";
import {EditTeacherAPI} from "../../../apis/teacher_api.ts";
import {SiteInfoEntity} from "../../../models/entity/site_info_entity.ts";
import {Link, useLocation, useNavigate, useParams} from "react-router";
import {TeacherTypeEntity} from "../../../models/entity/teacher_type_entity.ts";
import {GetTeacherTypeSimpleListAPI} from "../../../apis/teacher_type_api.ts";
import {DepartmentEntity} from "../../../models/entity/department_entity.ts";
import {TeacherDTO} from "../../../models/dto/teacher_dto.ts";


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

    const [data, setData] = useState<TeacherDTO>({
        phone: "",
        email: "",
        job_title: "",
        desc: ""
    } as TeacherDTO);

    const [departmentList, setDepartmentList] = useState<DepartmentEntity[]>([]);
    const [teacherTypeList, setTeacherTypeList] = useState<TeacherTypeEntity[]>([]);
    const [searchRequest] = useState<PageSearchDTO>({
        page: 1,
        size: 100, // 加载更多数据以便选择
        is_desc: true,
    } as PageSearchDTO);

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
                type: teacherInfo.type_uuid,
                phone: teacherInfo.phone,
                email: teacherInfo.email,
                job_title: teacherInfo.job_title,
                desc: teacherInfo.desc,
                id: teacherInfo.id,
                unit_uuid: teacherInfo.unit_uuid,
                user_uuid: teacherInfo.user_uuid,
            });
            message.success("表单已重置");
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

    // 获取教师类型列表
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


    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center space-x-2">
                <Link to={"/academic/teacher"}>
                    <Return theme="outline" size="24"/>
                </Link>
                <h2 className="text-2xl font-bold flex items-center space-x-2">
                    <span>编辑教师</span>
                </h2>
            </div>

            <div className="w-full">
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="lg:col-span-8 md:col-span-12 sm:col-span-12 flex">
                        <Card
                            title={
                                <div className="flex items-center gap-1">
                                    <User theme="outline" size="18" fill="#333"/>
                                    <span>编辑教师信息</span>
                                </div>
                            }
                            className="shadow-lg w-full flex flex-col"
                            headStyle={{ backgroundColor: '#f0f2f5'}}
                            bodyStyle={{
                                display: 'flex',
                                flexDirection: 'column',
                                flexGrow: 1,
                                padding: '16px'
                            }}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                height: 'calc(100% - 0px)'
                            }}
                        >
                            <form id="teacher_edit" onSubmit={onSubmit} className="py-1 flex flex-col flex-grow">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                                    <fieldset className="flex flex-col">
                                        <legend className="flex items-center space-x-1 mb-1 text-sm">
                                            <Chinese theme="outline" size="14" fill="#333"/>
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
                                            <English theme="outline" size="14" fill="#333"/>
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
                                            <Keyboard theme="outline" size="14" fill="#333"/>
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
                                            <Column theme="outline" size="14" fill="#333"/>
                                            <span>性别</span>
                                            <span className="text-red-500">*</span>
                                        </legend>
                                        <select
                                            className="select select-sm w-full validator"
                                            value={data.sex ? "0" : !data.sex ? "1" : ""}
                                            onChange={(e) => setData({...data, sex: e.target.value === '0'})}
                                            required
                                        >
                                            <option value="" disabled>请选择性别</option>
                                            <option value="0">女</option>
                                            <option value="1">男</option>
                                        </select>
                                    </fieldset>
                                    <fieldset className="flex flex-col">
                                        <legend className="flex items-center space-x-1 mb-1 text-sm">
                                            <UserBusiness theme="outline" size="14" fill="#333" />
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
                                                <option
                                                    key={type.teacher_type_uuid}
                                                    value={type.teacher_type_uuid}
                                                >
                                                    {type.type_name}
                                                </option>
                                            ))}
                                        </select>
                                    </fieldset>
                                    <fieldset className="flex flex-col">
                                        <legend className="flex items-center space-x-1 mb-1 text-sm">
                                            <BuildingThree theme="outline" size="14" fill="#333"/>
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
                                            <AllApplication theme="outline" size="14" fill="#333"/>
                                            <span>民族</span>
                                            <span className="text-red-500">*</span>
                                        </legend>
                                        <input
                                            type="text"
                                            className="input input-sm w-full validator"
                                            required
                                            placeholder="请输入民族"
                                            value={data.ethnic || ""}
                                            onChange={(e) => setData({...data, ethnic: e.target.value})}
                                        />
                                    </fieldset>
                                    <fieldset className="flex flex-col">
                                        <legend className="flex items-center space-x-1 mb-1 text-sm">
                                            <PhoneTelephone theme="outline" size="14" fill="#333"/>
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
                                            <Envelope theme="outline" size="14" fill="#333"/>
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
                                            <UserBusiness theme="outline" size="14" fill="#333"/>
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
                                            <DocDetail theme="outline" size="14" fill="#333"/>
                                            <span>描述</span>
                                        </legend>
                                        <textarea
                                            className="textarea textarea-sm textarea-bordered w-full h-24"
                                            placeholder="请输入教师描述"
                                            value={data.desc || ""}
                                            onChange={(e) => setData({...data, desc: e.target.value})}
                                        />
                                    </fieldset>
                                </div>
                                <div className="flex justify-end space-x-4 pt-2 mb-0">
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
                        </Card>
                    </div>
                    {/* 右侧辅助卡片区域 */}
                    <div className="lg:col-span-4 md:col-span-12 sm:col-span-12 flex flex-col space-y-6" style={{ height: '100%' }}>
                        <div className="flex-1">
                            {/* 最近添加的教师 */}
                            <Card
                                className="shadow-lg border-t-4 border-blue-500 bg-white w-full h-full"
                                bordered={true}
                                title={
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <Announcement theme="outline" size="18"/>
                                            <span className="text-lg font-semibold text-gray-800">当前教师信息</span>
                                        </div>
                                        <div className="text-sm text-gray-500 font-mono">
                                            ID: {teacherId?.substring(0, 12)}...
                                        </div>
                                    </div>
                                }
                                headStyle={{
                                    backgroundColor: '#f0f4f8',
                                    borderBottom: '1px solid #e2e8f0',
                                    padding: '12px 16px'
                                }}
                            >
                                <div className="space-y-1 p-2">
                                    <div className="grid grid-cols-2 gap-2 items-center">
                                            <span className="text-sm text-gray-600 font-medium flex items-center space-x-2">
                                                <Chinese theme="outline" size="14" className="text-secondary" />
                                                <span>姓名</span>
                                            </span>
                                        <span className="text-right font-semibold text-gray-800">{teacherInfo?.name || data.name}</span>
                                    </div>
                                    <div className="border-b border-gray-200"></div>
                                    <div className="grid grid-cols-2 gap-2 items-center">
                                            <span className="text-sm text-gray-600 font-medium flex items-center space-x-2">
                                                <English theme="outline" size="14" className="text-secondary" />
                                                <span>英文名</span>
                                            </span>
                                        <span className="text-right text-gray-800">{teacherInfo?.english_name || data.english_name}</span>
                                    </div>
                                    <div className="border-b border-gray-200"></div>
                                    <div className="grid grid-cols-2 gap-2 items-center">
                                            <span className="text-sm text-gray-600 font-medium flex items-center space-x-2">
                                                <Keyboard theme="outline" size="14" className="text-secondary" />
                                                <span>工号</span>
                                            </span>
                                        <span className="text-right text-gray-800">{teacherInfo?.id || data.id}</span>
                                    </div>
                                    <div className="border-b border-gray-200"></div>
                                    <div className="grid grid-cols-2 gap-2 items-center">
                                            <span className="text-sm text-gray-600 font-medium flex items-center space-x-2">
                                                <Column theme="outline" size="14" className="text-secondary" />
                                                <span>性别</span>
                                            </span>
                                        <span className="text-right text-gray-800">{teacherInfo?.sex ? "女" : "男"}</span>
                                    </div>
                                    <div className="border-b border-gray-200"></div>
                                    <div className="grid grid-cols-2 gap-2 items-center">
                                            <span className="text-sm text-gray-600 font-medium flex items-center space-x-2">
                                                <UserBusiness theme="outline" size="14" className="text-secondary" />
                                                <span>教师类型</span>
                                            </span>
                                        <span className="text-right text-gray-800">
                                                {teacherTypeList.find(type => type.teacher_type_uuid === (teacherInfo?.type || data.type))?.type_name || "未设置"}
                                            </span>
                                    </div>
                                    <div className="border-b border-gray-200"></div>
                                    <div className="grid grid-cols-2 gap-2 items-center">
                                            <span className="text-sm text-gray-600 font-medium flex items-center space-x-2">
                                                <BuildingThree theme="outline" size="14" className="text-secondary" />
                                                <span>所属单位</span>
                                            </span>
                                        <span className="text-right text-gray-800">
                                                {departmentList.find(dept => dept.department_uuid === teacherInfo?.unit_uuid)?.department_name || "未知"}
                                            </span>
                                    </div>
                                    <div className="border-b border-gray-200"></div>
                                    <div className="grid grid-cols-2 gap-2 items-center">
                                            <span className="text-sm text-gray-600 font-medium flex items-center space-x-2">
                                                <PhoneTelephone theme="outline" size="14" className="text-secondary" />
                                                <span>电话</span>
                                            </span>
                                        <span className="text-right text-gray-800">{teacherInfo?.phone || data.phone || "未设置"}</span>
                                    </div>
                                    <div className="border-b border-gray-200"></div>
                                    <div className="grid grid-cols-2 gap-2 items-center">
                                            <span className="text-sm text-gray-600 font-medium flex items-center space-x-2">
                                                <Envelope theme="outline" size="14" className="text-secondary" />
                                                <span>邮箱</span>
                                            </span>
                                        <span className="text-right text-gray-800">{teacherInfo?.email || data.email || "未设置"}</span>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* 提示信息卡片 */}
                        <div className="flex-1">
                            <Card
                                title={
                                    <div className="flex items-center">
                                        <span className="text-secondary">操作提示</span>
                                    </div>
                                }
                                bordered={true}
                                className="shadow-lg bg-info w-full h-full"
                                headStyle={{ backgroundColor: '#e6f7ff', borderBottom: '1px solid #91caff' }}
                            >
                                <ul className="space-y-2 text-gray-700">
                                    <li className="flex items-start">
                                        <span className="text-secondary mr-2">•</span>
                                        <span>姓名、英文名、工号为必填项</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-secondary mr-2">•</span>
                                        <span>教师必须关联到现有用户才能登录系统</span>
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
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


