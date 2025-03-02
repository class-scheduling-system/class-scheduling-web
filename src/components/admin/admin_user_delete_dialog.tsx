import { useState } from "react";
import { Attention } from "@icon-park/react";
import { DeleteUserAPI } from "../../apis/user_api.ts";

export function AdminDeleteUserDialog({ userUuid, onUserDeleted, onCancel }) {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!userUuid) return;

        setLoading(true);
        try {
            console.log("123")
            await DeleteUserAPI(userUuid);
            console.log(userUuid);
            alert("✅ 用户删除成功");

            // 关闭对话框
            document.getElementById("my_modal_3")?.close();

            // 通知 `AdminUser` 组件重新获取用户列表
            if (onUserDeleted) {
                onUserDeleted();
            }
        } catch (error) {
            console.error("❌ 删除用户失败:", error);
            alert("❌ 删除用户失败");
        } finally {
            setLoading(false);
        }
    };

    return (
        <dialog id="my_modal_3" className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg mb-2">删除用户</h3>
                <div className={"flex items-center"}>
                    <Attention theme="outline" size="24" fill="#FFD700" />
                    <p className="text-error ml-2">删除后将不可恢复，确定要删除吗？</p>
                </div>

                <div className="modal-action">
                    <form method="dialog">
                        <div className="flex justify-end gap-2 w-full">
                            {/* 绑定 onClick 事件，点击后执行删除 */}
                            <button
                                type="button"
                                className="btn btn-neutral"
                                onClick={handleDelete}
                                disabled={loading}
                            >
                                {loading ? "删除中..." : "删除"}
                            </button>
                            <button type="button" className="btn" onClick={onCancel} disabled={loading}>
                                取消
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </dialog>
    );
}
