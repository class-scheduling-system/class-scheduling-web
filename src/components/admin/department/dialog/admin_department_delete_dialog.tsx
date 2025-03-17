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

import * as React from "react";
import {JSX, useEffect, useState} from "react";
import {message, Modal} from "antd";
import {BranchOne, CheckOne, CloseOne} from "@icon-park/react";
import {DeleteDepartmentAPI} from "../../../../apis/department_api.ts";
import {DepartmentEntity} from "../../../../models/entity/department_entity.ts";

/**
 * # AdminDepartmentDeleteDialog
 * > 用于显示一个删除部门的对话框，用户可以确认或取消删除操作。
 *
 * @param academic - 要删除的部门的实体对象。
 * @param show - 控制对话框是否显示的标志。
 * @param emit - 一个回调函数，用于在对话框状态改变时通知父组件。
 * @param requestRefresh - 一个回调函数，用于请求刷新数据。
 * @returns {JSX.Element} 返回一个React组件，表示删除部门的对话框。
 */
export function AdminDepartmentDeleteDialog({department, show, emit, requestRefresh}: Readonly<{
    department: DepartmentEntity;
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
        const getResp = await DeleteDepartmentAPI(department.department_uuid!);
        if (getResp?.output === "Success") {
            message.success("删除成功");
            requestRefresh(true);
            setIsModalOpen(false);
        } else {
            message.error(getResp?.error_message);
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
                           <button type={"submit"} form={"building_remove"}
                                   className={"btn btn-success"}>
                               <CheckOne theme="outline" size="16"/>
                               <span>提交</span>
                           </button>
                       </div>
                   </div>
               }>
            <div className="flex flex-col space-y-4">
                <h3 className="font-bold text-lg flex items-center space-x-1">
                    <BranchOne theme="outline" size="20"/>
                    <span>删除部门</span>
                </h3>
                <form id={"building_remove"} onSubmit={onSubmit} className="py-2 grid space-y-2">
                    <div className="text-base-content flex space-x-0.5">
                        <span>是否确认删除</span>
                        <strong className={"text-primary font-bold"}>{department.department_name}</strong>
                        <span>？</span>
                    </div>
                    <div className="text-error flex space-x-0.5">
                        <span>删除后将无法恢复，请谨慎操作！</span>
                    </div>
                    <div className={"text-base-content grid"}>
                        您删除{department.department_name}，请先手动删除被依赖项：
                        <ul className={"list-disc list-inside ps-4"}>
                            <li>该部门下的所有课程</li>
                            <li>该部门下的所有专业</li>
                            <li>该部门下的所有教师</li>
                        </ul>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
