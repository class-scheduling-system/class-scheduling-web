import { useState, useEffect, JSX } from "react";
import {
    AddUser, BuildingThree,
    CheckOne,
    CloseOne, DocDetail, EditName,
    Envelope,
    PhoneTelephone,
    User,
    UserPositioning
} from "@icon-park/react";
import { message, Modal } from "antd";
import * as React from "react";
import { TeacherEntity } from "../../models/entity/teacher_entity.ts";
import {GetDepartmentListAPI} from "../../apis/department_api.ts";
import {RoleEntity} from "../../models/entity/role_entity.ts";
import {DepartmentInfoEntity} from "../../models/entity/department__info_entity.ts";
import {PageSearchDTO} from "../../models/dto/page_search_dto.ts";
import {UserEditDTO} from "../../models/dto/user_edit_dto.ts";
import {TeacherEditDTO} from "../../models/dto/teacher_edit_dto.ts";
import {EditTeacherAPI} from "../../apis/teacher_api.ts";
import {GetUserListAPI} from "../../apis/user_api.ts";
import {UserInfoEntity} from "../../models/entity/user_info_entity.ts"; // 确保导入TeacherEntity

/**
 * # 编辑教师 dialog
 * > 该函数用于创建一个对话框，管理员可以通过该对话框编辑教师，修改教师的信息
 * @param show  控制该对话框是否显示
 * @param emit  控制该对话框是否提交
 * @param teacherUuid  教师uuid
 * @param defaultData   对话框的默认教师数据
 * @param onEditSuccess     编辑成功后的操作
 * @constructor
 */
export function AcademicEditTeacherDialog({ show, emit, teacherUuid, defaultData, onEditSuccess }: Readonly<{
    show: boolean;
    emit: (data: boolean) => void;
    teacherUuid: string;
    defaultData?: TeacherEntity | null;
    onEditSuccess?: () => void;
}>): JSX.Element {
    const [data, setData] = useState<TeacherEditDTO>(defaultData || {} as TeacherEditDTO);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [departmentList, setDepartmentList] = useState<DepartmentInfoEntity[]>([]);
    const [userList, setUserList] = useState<UserInfoEntity[]>([]);
    const [searchRequest] = useState<PageSearchDTO>({
        page: 1,
        size: 20,
        is_desc: true,
    } as PageSearchDTO);

    useEffect(() => {
        setIsModalOpen(show);
    }, [show]);

    useEffect(() => {
        emit(isModalOpen);
    }, [emit, isModalOpen]);

    // 当对话框打开且有 defaultData 时，同步到本地状态中
    useEffect(() => {
        if (show && defaultData) {
            setData(defaultData);
        }
    }, [show, defaultData]);

    // 关闭对话框
    const handleClose = () => {
        setIsModalOpen(false);
    };

    // 提交表单
    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        try {
            const getResp = await EditTeacherAPI(teacherUuid, data);
            if (getResp?.output === "Success") {
                message.success("编辑成功");
                onEditSuccess?.();
                handleClose();
            } else {
                message.error(getResp?.error_message ?? "编辑失败");
            }
        } catch (error) {
            console.error("编辑教师失败:", error);
            message.error("编辑失败");
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
                    setUserList(response.data!.records); // 修正: 设置到userList而不是departmentList
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
        <Modal
            open={isModalOpen}
            onCancel={handleClose}
            width={600}
            footer={
                <div className="modal-action">
                    <div className={"flex space-x-3"}>
                        <button type={"button"} onClick={handleClose} className={"btn btn-error"}>
                            <CloseOne theme="outline" size="16" />
                            <span>取消</span>
                        </button>
                        <button type={"submit"} form={"teacher_edit"} className={"btn btn-success"}>
                            <CheckOne theme="outline" size="16" />
                            <span>提交</span>
                        </button>
                    </div>
                </div>
            }
        >
            <div className="flex flex-col space-y-4">
                <h3 className="font-bold text-lg flex items-center space-x-2">
                    <EditName theme="outline" size="20" fill="#333"/>
                    <span>编辑教师</span>
                </h3>
                <form id={"teacher_edit"} onSubmit={onSubmit} className="py-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* 单位 */}
                    <fieldset className="flex flex-col">
                        <legend className="flex items-center space-x-1 mb-1">
                            <BuildingThree theme="outline" size="16" fill="#333"/>
                            <span>部门</span>
                        </legend>
                        <select
                            className="select w-full validator"
                            value={data.unit_uuid || ""}
                            onChange={(e) => setData({ ...data,unit_uuid: e.target.value })}
                            required
                        >
                            <option value="" disabled>
                                请选择部门
                            </option>
                            {departmentList?.map((department) => (
                                <option key={department.department_uuid} value={department.department_uuid}>
                                    {department.department_name}
                                </option>
                            )) || []}
                        </select>
                    </fieldset>

                    <fieldset className="flex flex-col">
                        <legend className="flex items-center space-x-1 mb-1">
                            <User theme="outline" size="16" fill="#333" />
                            <span>用户名</span>
                        </legend>
                        <select
                            className="select w-full validator"
                            value={data.user_uuid || ""}
                            onChange={(e) => setData({ ...data, user_uuid: e.target.value })}
                            required
                        >
                            <option value="" disabled>
                                请选择用户
                            </option>
                            {userList?.map((userInfo) => (
                                <option key={userInfo.user.user_uuid} value={userInfo.user.user_uuid}>
                                    {userInfo.user.name}
                                </option>
                            )) || []}
                        </select>
                    </fieldset>

                    {/* 教师工号 */}
                    <fieldset className="flex flex-col">
                        <legend className="flex items-center space-x-1 mb-1">
                            <User theme="outline" size="16" fill="#333" />
                            <span>教师工号</span>
                        </legend>
                        <input
                            type="text"
                            className="input w-full validator"
                            required
                            value={data.id || ""}
                            onChange={(e) => setData({ ...data, id: e.target.value })}
                        />
                    </fieldset>

                    {/* 教师姓名 */}
                    <fieldset className="flex flex-col">
                        <legend className="flex items-center space-x-1 mb-1">
                            <User theme="outline" size="16" fill="#333" />
                            <span>教师姓名</span>
                        </legend>
                        <input
                            type="text"
                            className="input w-full validator"
                            required
                            value={data.name || ""}
                            onChange={(e) => setData({ ...data, name: e.target.value })}
                        />
                    </fieldset>

                    {/* 教师英文名 */}
                    <fieldset className="flex flex-col">
                        <legend className="flex items-center space-x-1 mb-1">
                            <User theme="outline" size="16" fill="#333" />
                            <span>教师英文名</span>
                        </legend>
                        <input
                            type="text"
                            className="input w-full validator"
                            required
                            value={data.english_name || ""}
                            onChange={(e) => setData({ ...data, english_name: e.target.value })}
                        />
                    </fieldset>

                    {/* 教师民族 */}
                    <fieldset className="flex flex-col">
                        <legend className="flex items-center space-x-1 mb-1">
                            <User theme="outline" size="16" fill="#333" />
                            <span>教师民族</span>
                        </legend>
                        <input
                            type="text"
                            className="input w-full validator"
                            required
                            value={data.ethnic || ""}
                            onChange={(e) => setData({ ...data, ethnic: e.target.value })}
                        />
                    </fieldset>

                    {/* 教师性别 */}
                    <fieldset className="flex flex-col">
                        <legend className="flex items-center space-x-1 mb-1">
                            <User theme="outline" size="16" fill="#333" />
                            <span>教师性别</span>
                        </legend>
                        <select
                            className="select w-full validator"
                            value={data.sex !== undefined ? data.sex : ""}
                            onChange={(e) => setData({ ...data, sex: Number(e.target.value) })}
                            required
                        >
                            <option value="" disabled>请选择性别</option>
                            <option value="0">女</option>
                            <option value="1">男</option>
                        </select>
                    </fieldset>

                    {/* 邮箱 */}
                    <fieldset className="flex flex-col">
                        <legend className="flex items-center space-x-1 mb-1">
                            <Envelope theme="outline" size="16" fill="#333" />
                            <span>邮箱</span>
                        </legend>
                        <input
                            type="email"
                            className="input w-full validator"
                            value={data.email || ""}
                            onChange={(e) => setData({ ...data, email: e.target.value })}
                        />
                    </fieldset>

                    {/* 手机号 */}
                    <fieldset className="flex flex-col">
                        <legend className="flex items-center space-x-1 mb-1">
                            <PhoneTelephone theme="outline" size="16" fill="#333" />
                            <span>手机号</span>
                        </legend>
                        <input
                            type="text"
                            className="input w-full validator"
                            value={data.phone || ""}
                            onChange={(e) => setData({ ...data, phone: e.target.value })}
                        />
                    </fieldset>

                    {/* 教师职称 */}
                    <fieldset className="flex flex-col">
                        <legend className="flex items-center space-x-1 mb-1">
                            <UserPositioning theme="outline" size="16" fill="#333" />
                            <span>教师职称</span>
                        </legend>
                        <input
                            type="text"
                            className="input w-full validator"
                            value={data.job_title || ""}
                            onChange={(e) => setData({ ...data, job_title: e.target.value })}
                        />
                    </fieldset>



                    {/* 教师描述 */}
                    <fieldset className="flex flex-col col-span-1 md:col-span-2">
                        <legend className="flex items-center space-x-1 mb-1">
                            <DocDetail theme="outline" size="16" fill="#333"/>
                            <span>教师描述</span>
                        </legend>
                        <textarea
                            className="textarea w-full validator"
                            rows={4}
                            value={data.desc || ""}
                            onChange={(e) => setData({ ...data, desc: e.target.value })}
                        />
                    </fieldset>
                </form>
            </div>
        </Modal>
    );
}