import { useEffect, useState } from "react";
import { DeleteStudentAPI } from "../../../apis/student_api";
import { message } from "antd";
import { Delete } from "@icon-park/react";

export function AcademicDeleteStudentDialog({ show, emit, studentUuid }: Readonly<{
    show: boolean;
    emit: (show: boolean) => void;
    studentUuid: string;
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
            const deleteResp = await DeleteStudentAPI(studentUuid);
            if (deleteResp?.output === "Success") {
                message.success("删除学生成功");
                emit(false);
            } else {
                message.error(deleteResp?.error_message ?? "删除学生失败");
            }
        } catch (error) {
            console.error("删除学生失败", error);
            message.error("删除学生失败");
        } finally {
            setLoading(false);
        }
    };

    return (
        <dialog className={`modal ${show ? "modal-open" : ""} backdrop-blur-sm`}>
            <div className="modal-box">
                <h3 className="font-bold text-lg flex items-center gap-2">
                    <Delete theme="outline" size="24" className="text-error" />
                    <span>删除学生</span>
                </h3>
                <p className="py-4">确定要删除该学生吗？此操作不可恢复！</p>
                <div className="modal-action">
                    <button
                        className="btn btn-error"
                        disabled={loading}
                        onClick={handleDelete}
                    >
                        {loading ? <span className="loading loading-spinner"></span> : null}
                        确认删除
                    </button>
                    <button
                        className="btn"
                        disabled={loading}
                        onClick={() => emit(false)}
                    >
                        取消
                    </button>
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button disabled={loading}>关闭</button>
            </form>
        </dialog>
    );
} 