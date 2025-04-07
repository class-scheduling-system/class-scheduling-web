/*
 * --------------------------------------------------------------------------------
 * Copyright (c) 2022-NOW(至今) 锋楪技术团队
 * Author: 锋楪技术团队 (https://www.frontleaves.com)
 *
 * 本文件包含锋楪技术团队项目的源代码，项目的所有源代码均遵循 MIT 开源许可证协议。
 * --------------------------------------------------------------------------------
 */

import * as React from "react";
import {JSX, useEffect, useState} from "react";
import {Calendar, CheckOne, CloseOne} from "@icon-park/react";
import {message, Modal} from "antd";
import {DeleteGradeAPI} from "../../../apis/grade_api.ts";
import {GradeEntity} from "../../../models/entity/grade_entity.ts";

/**
 * # AdminGradeDeleteDialog
 * > 用于显示一个删除年级的对话框，用户可以确认或取消删除操作。
 *
 * @param {GradeEntity} grade - 要删除的年级实体。
 * @param {boolean} show - 控制对话框是否显示的标志。
 * @param {(data: boolean) => void} emit - 一个回调函数，用于在对话框状态改变时通知父组件。
 * @param {(refresh: boolean) => void} requestRefresh - 一个回调函数，用于请求刷新列表。
 *
 * @returns {JSX.Element} 返回一个React组件，表示删除年级的对话框。
 */
export function AdminGradeDeleteDialog({grade, show, emit, requestRefresh}: Readonly<{
    grade: GradeEntity;
    show: boolean;
    emit: (data: boolean) => void;
    requestRefresh: (refresh: boolean) => void;
}>): JSX.Element {
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        setIsModalOpen(show);
    }, [show]);

    useEffect(() => {
        emit(isModalOpen);
    }, [emit, isModalOpen]);

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const getResp = await DeleteGradeAPI(grade.grade_uuid);
        if (getResp?.output === "Success") {
            message.success("删除成功");
            requestRefresh(true);
            setIsModalOpen(false);
        } else {
            message.error(getResp?.error_message || "删除失败");
        }
    }

    return (
        <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel}
               footer={
                   <div className="modal-action">
                       <div className={"flex space-x-3"}>
                           <button type={"button"}
                                   onClick={handleCancel}
                                   className={"btn btn-error"}>
                               <CloseOne theme="outline" size="16"/>
                               <span>取消</span>
                           </button>
                           <button type={"submit"} form={"grade_remove"}
                                   className={"btn btn-success"}>
                               <CheckOne theme="outline" size="16"/>
                               <span>提交</span>
                           </button>
                       </div>
                   </div>
               }>
            <div className="flex flex-col space-y-4">
                <h3 className="font-bold text-lg flex items-center space-x-1">
                    <Calendar theme="outline" size="20"/>
                    <span>删除年级</span>
                </h3>
                <form id={"grade_remove"} onSubmit={onSubmit} className="py-2 grid space-y-2">
                    <div className="text-base-content flex space-x-0.5">
                        <span>是否确认删除</span>
                        <strong className={"text-primary font-bold"}>{grade.name}</strong>
                        <span>？</span>
                    </div>
                    <div className="text-error flex space-x-0.5">
                        <span>删除后将无法恢复，请谨慎操作！</span>
                    </div>
                    <div className={"text-base-content grid"}>
                        删除{grade.name}，还会删除以下相关内容：
                        <ul className={"list-disc list-inside ps-4"}>
                            <li>该年级下的所有班级信息</li>
                            <li>该年级下的所有学生信息</li>
                        </ul>
                    </div>
                </form>
            </div>
        </Modal>
    );
} 