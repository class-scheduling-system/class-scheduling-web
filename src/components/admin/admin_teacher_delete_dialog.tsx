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

import {JSX, useEffect, useState} from "react";
import {
    AddUser,
    CheckOne,
    CloseOne,
} from "@icon-park/react";
import {DeleteUserAPI} from "../../apis/user_api.ts";
import * as React from "react";
import {message, Modal} from "antd";


/**
 * # 管理员删除用户 dialog
 * > 该函数用于创建一个对话框，管理员可以通过该对话框删除用户
 * @param show  控制该对话框是否显示
 * @param emit  控制该对话框是否提交
 * @param userUuid  用户uuid
 * @param onDeletedSuccess  成功删除用户后的操作
 * @constructor
 */
export function AdminDeleteTeacherDialog({show, emit,userUuid, onDeletedSuccess}: Readonly<{
    show: boolean;
    emit: (data: boolean) => void;
    userUuid: string;
    onDeletedSuccess?: () => void;
}>) : JSX.Element {
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

    const handleClose = () => {
        setIsModalOpen(false);
    }

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        console.log("执行删除操作, userUuid:", userUuid); // 调试日志

        if (!userUuid) {
            message.error("用户 UUID 为空，无法删除！");
            return;
        }
        try {
            const getResp = await DeleteUserAPI(userUuid);
            if (getResp?.output === "Success") {
                message.success("删除成功");
                onDeletedSuccess?.();
                // 关闭弹窗
                handleOk();
                emit(false);
            } else {
                message.error(getResp?.error_message ?? "删除失败");
            }
        } catch (error) {
            console.error("删除用户失败:", error);
            message.error("删除失败");
        }
    }



    return (
        <>
            <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel}
                   footer={
                       <div className="modal-action">
                           <div className={"flex space-x-3"}>
                               <button type={"button"}
                                       onClick={handleClose}
                                       className={"btn btn-error"}>
                                   <CloseOne theme="outline" size="16"/>
                                   <span>取消</span>
                               </button>
                               <button
                                   type={"submit"} form={"user_delete"}
                                   className={"btn btn-success"}>
                                   <CheckOne theme="outline" size="16"/>
                                   <span>确定</span>
                               </button>
                           </div>
                       </div>
                   }>
                <div className="flex flex-col space-y-4">
                    <h3 className="font-bold text-lg flex items-center space-x-2">
                        <AddUser theme="outline" size="20" fill="#333"/>
                        <span>删除用户</span>
                    </h3>
                    <form id={"user_delete"} onSubmit={onSubmit}  className="py-2 grid space-y-2">
                        <p>确定要删除该用户吗？</p>
                    </form>
                </div>
            </Modal>
        </>
    )

}
