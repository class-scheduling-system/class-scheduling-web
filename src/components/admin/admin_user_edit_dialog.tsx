import { useState, useEffect } from "react";
import {Delete, Editor, Envelope, User, UserPositioning} from "@icon-park/react";

interface EditUserData {
    name: string;
    role: string;
    email: string;
}

export function AdminEditUserDialog({
                                        defaultData,
                                    }: {
    defaultData: EditUserData | null;
}) {
    // 内部状态存储表单数据
    const [formData, setFormData] = useState<EditUserData>({
        name: "",
        role: "",
        email: "",
    });

    // 当外部传入的默认数据变化时，更新内部表单数据
    useEffect(() => {
        if (defaultData) {
            setFormData(defaultData);
        }
    }, [defaultData]);

    // 关闭对话框
    const handleCloseDialog = () => {
        const dialog = document.getElementById("my_modal_2");
        if (dialog) {
            dialog.close();
        }
    };

    return (
        <>
            <dialog id="my_modal_2" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">编辑用户</h3>
                    <div className="mt-3">
                        <form method="dialog" className="flex flex-col space-y-4 p-4">
                            {/* 输入框区域 */}
                            <div className="flex flex-col space-y-3">
                                <label className="input input-md transition flex items-center validator w-full">
                                    {/* 图标可保持不变 */}
                                    <User theme="outline" size="16" fill="#333"/>
                                    <input
                                        type="text"
                                        required
                                        className="grow ps-1"
                                        placeholder="用户名"
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({ ...formData, name: e.target.value })
                                        }
                                    />
                                </label>
                                <label className="input input-md transition flex items-center validator w-full">
                                    <UserPositioning theme="outline" size="16" fill="#333"/>
                                    <input
                                        type="text"
                                        required
                                        className="grow"
                                        placeholder="角色"
                                        value={formData.role}
                                        onChange={(e) =>
                                            setFormData({ ...formData, role: e.target.value })
                                        }
                                    />
                                </label>
                                <label className="input input-md transition flex items-center validator w-full">
                                    <Envelope theme="outline" size="16" fill="#333"/>
                                    <input
                                        type="email"
                                        required
                                        className="grow ps-1"
                                        placeholder="邮箱"
                                        value={formData.email}
                                        onChange={(e) =>
                                            setFormData({ ...formData, email: e.target.value })
                                        }
                                    />
                                </label>
                            </div>

                            {/* 按钮区域 */}
                            <div className="flex justify-end gap-2 w-full">
                                <button type="submit" className="btn btn-neutral">
                                    修改
                                </button>
                                <button type="button" className="btn" onClick={handleCloseDialog}>
                                    取消
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </dialog>
        </>
    );
}
