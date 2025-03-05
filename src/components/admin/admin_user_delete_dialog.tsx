import {JSX, useEffect, useState} from "react";
import {
    AddUser,
    CheckOne,
    CloseOne,
} from "@icon-park/react";
import {DeleteUserAPI} from "../../apis/user_api.ts";
import * as React from "react";
import {message, Modal} from "antd";


export function AdminDeleteUserDialog({show, emit,userUuid, onDeletedSuccess}: Readonly<{
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
                message.error(getResp?.message ?? "删除失败");
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
