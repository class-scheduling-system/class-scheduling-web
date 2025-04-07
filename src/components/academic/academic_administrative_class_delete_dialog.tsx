/*
 * --------------------------------------------------------------------------------
 * Copyright (c) 2022-NOW(至今) 锋楪技术团队
 * Author: 锋楪技术团队 (https://www.frontleaves.com)
 *
 * 本文件包含锋楪技术团队项目的源代码，项目的所有源代码均遵循 MIT 开源许可证协议。
 * --------------------------------------------------------------------------------
 */

import { useEffect, useState } from "react";
import { DeleteAdministrativeClassAPI } from "../../apis/administrative_class_api";
import { message, Modal } from "antd";
import { Delete } from "@icon-park/react";

export function AcademicAdministrativeClassDeleteDialog({ show, emit, classUuid, className }: Readonly<{
    show: boolean;
    emit: (show: boolean) => void;
    classUuid: string;
    className: string;
}>) {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!show) {
            setLoading(false);
        }
    }, [show]);

    const handleDelete = async () => {
        try {
            setLoading(true);
            const deleteResp = await DeleteAdministrativeClassAPI(classUuid);
            if (deleteResp?.output === "Success") {
                message.success("删除行政班成功");
                emit(false);
            } else {
                message.error(deleteResp?.error_message ?? "删除行政班失败");
            }
        } catch (error) {
            console.error("删除行政班失败", error);
            message.error("删除行政班失败");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-2">
                    <Delete theme="outline" size="24" className="text-error" />
                    <span>删除行政班</span>
                </div>
            }
            open={show}
            onCancel={() => emit(false)}
            onOk={handleDelete}
            okText="确认删除"
            cancelText="取消"
            confirmLoading={loading}
            okButtonProps={{ danger: true }}
        >
            <p className="py-4">确定要删除行政班 <strong>{className}</strong> 吗？此操作不可恢复！</p>
        </Modal>
    );
} 