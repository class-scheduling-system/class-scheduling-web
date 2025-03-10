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

import {
    AddUser,
    CheckOne,
    CloseOne,
    Envelope,
    Key,
    PhoneTelephone,
    User,
} from "@icon-park/react";
import * as React from "react";
import { JSX, useEffect, useState } from "react";
import { message, Modal } from "antd";
import { PageSearchDTO } from "../../models/dto/page_search_dto.ts";
import {AddTeacherAPI} from "../../apis/teacher_api.ts";
import {TeacherAddDTO} from "../../models/dto/teacher_add_dto.ts";


/**
 * # 管理员添加用户 Dialog
 * > 该函数用户创建一个添加用户对话框，管理员可以在该对话框中添加用户
 *
 * @param show - 控制该对话框是否显示
 * @param emit - 控制该对话框是否提交
 * @param onAddSuccess - 成功添加用户后的操作
 * @constructor
 */
export function AdminAddTeacherDialog({ show, emit, onAddSuccess }: Readonly<{
    show: boolean;
    emit: (data: boolean) => void;
    onAddSuccess?: () => void
}>): JSX.Element {
    const [data, setData] = useState<TeacherAddDTO>(
        {
            desc:"",
            email: "",
            phone: "",
        } as TeacherAddDTO);

    const [isModalOpen, setIsModalOpen] = useState(false);
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


    // 关闭对话框
    const handleClose = () => {
        setData({} as TeacherAddDTO);
        setIsModalOpen(false);
    };

    // 提交表单
    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        try {
            const getResp = await AddTeacherAPI();
            if (getResp?.output === "Success") {
                message.success("添加成功");
                onAddSuccess?.();
                handleClose();
            } else {
                message.error(getResp?.error_message ?? "添加失败");
            }
        } catch (error) {
            console.error("添加用户失败:", error);
            message.error("添加失败");
        }
    }

    return (
        <Modal
            open={isModalOpen}
            onCancel={handleClose}
            footer={
                <div className="modal-action">
                    <div className={"flex space-x-3"}>
                        <button type={"button"} onClick={handleClose} className={"btn btn-error"}>
                            <CloseOne theme="outline" size="16" />
                            <span>取消</span>
                        </button>
                        <button type={"submit"} form={"user_add"} className={"btn btn-success"}>
                            <CheckOne theme="outline" size="16" />
                            <span>提交</span>
                        </button>
                    </div>
                </div>
            }
        >
            <div className="flex flex-col space-y-4">
                <h3 className="font-bold text-lg flex items-center space-x-2">
                    <AddUser theme="outline" size="20" fill="#333" />
                    <span>添加教师</span>
                </h3>
                <form id={"teacher_add"} onSubmit={onSubmit} className="py-2 grid space-y-2">
                    {/* 姓名 */}
                    <fieldset className="flex flex-col">
                        <legend className="flex items-center space-x-1 mb-1">
                            <User theme="outline" size="16" fill="#333" />
                            <span>姓名</span>
                            <span className="text-red-500">*</span>
                        </legend>
                        <input
                            type="text"
                            className="input w-full validator"
                            required
                            value={data.name || ""}
                            onChange={(e) => setData({ ...data, name: e.target.value })}
                        />
                    </fieldset>
                    {/* 工号 */}
                    <fieldset className="flex flex-col">
                        <legend className="flex items-center space-x-1 mb-1">
                            <Key theme="outline" size="16" fill="#333" />
                            <span>工号</span>
                        </legend>
                        <input
                            type="password"
                            className="input w-full validator"
                            value={data.id || ""}
                            onChange={(e) => setData({ ...data, id: e.target.value })}
                        />
                    </fieldset>
                    {/* 联系方式 */}
                    <fieldset className="flex flex-col">
                        <legend className="flex items-center space-x-1 mb-1">
                            <Envelope theme="outline" size="16" fill="#333" />
                            <span>联系方式</span>
                            <span className="text-red-500">*</span>
                        </legend>
                        <input
                            type="email"
                            className="input w-full validator"
                            required
                            value={data.phone || ""}
                            onChange={(e) => setData({ ...data, phone: e.target.value })}
                        />
                    </fieldset>

                    {/* 单位 */}
                    <fieldset className="flex flex-col">
                        <legend className="flex items-center space-x-1 mb-1">
                            <PhoneTelephone theme="outline" size="16" fill="#333" />
                            <span>单位</span>
                            <span className="text-red-500">*</span>
                        </legend>
                        <input
                            type="tel"
                            className="input w-full validator"
                            required
                            value={data.unit_uuid || ""}
                            onChange={(e) => setData({ ...data, unit_uuid: e.target.value })}
                        />
                    </fieldset>
                    <fieldset className="flex flex-col">
                        <legend className="flex items-center space-x-1 mb-1">
                            <PhoneTelephone theme="outline" size="16" fill="#333" />
                            <span>职称</span>
                            <span className="text-red-500">*</span>
                        </legend>
                        <input
                            type="tel"
                            className="input w-full validator"
                            required
                            value={data.job_title || ""}
                            onChange={(e) => setData({ ...data, job_title: e.target.value })}
                        />
                    </fieldset>
                </form>
            </div>
        </Modal>

    );
}