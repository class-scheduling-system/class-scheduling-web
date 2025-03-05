import {useState, useEffect, JSX} from "react";
import { Envelope, User, UserPositioning } from "@icon-park/react";
import { EditUserAPI } from "../../apis/user_api.ts";

interface EditUserData {
    user_uuid: string;
    name: string;
    role_uuid: string;
    email: string;
    phone: string;
    status?: number;
    ban?: number;
    permission?: string[];
}

export function AdminEditUserDialog({show, emit,userUuid}: Readonly<{
    show: boolean;
    emit: (data: boolean) => void;
    userUuid: string;
}>) : JSX.Element {
    const [formData, setFormData] = useState<EditUserData>({
        user_uuid: "",
        name: "",
        role_uuid: "",
        email: "",
        phone: "",
        status: 1,  // 默认正常状态
        ban: 0,  // 默认不封禁
        permission: []
    });

    const [loading, setLoading] = useState(false);

    // 角色列表
    const roles = [
        { role_uuid: "33257a18893a46919fd255a730cb1508", name: "管理员", icon: <UserPositioning theme="outline" size="18" fill="#333" /> },
        { role_uuid: "4d58ff23ce494b5d83d2bcad9eed30d7", name: "教务", icon: <UserPositioning theme="outline" size="18" fill="#333" /> },
        { role_uuid: "60c4d7ce00af44f0a382aa73f64aa3c2", name: "老师", icon: <UserPositioning theme="outline" size="18" fill="#555" /> },
        { role_uuid: "e02425859d904c5bacde77401be48cc9", name: "学生", icon: <UserPositioning theme="outline" size="18" fill="#777" /> },
    ];


    const handleCloseDialog = () => {
        document.getElementById("my_modal_2")?.close();
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectRole = (role_uuid: string) => {
        setFormData((prev) => ({
            ...prev,
            role_uuid,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await EditUserAPI(formData.user_uuid, formData);
            if (response) {
                alert("✅ 用户修改成功");
                handleCloseDialog();
            } else {
                alert("❌ 修改用户失败");
            }
        } catch (error) {
            console.error("❌ 修改用户失败:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <dialog id="my_modal_2" className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">编辑用户</h3>
                <div className="mt-3">
                    <form onSubmit={handleSubmit} className="flex flex-col space-y-4 p-4">
                        <label className="input input-md flex items-center w-full">
                            <User theme="outline" size="18" fill="#333" />
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="用户名"
                                className="grow"
                            />
                        </label>

                        <div className="dropdown w-full">
                            <label tabIndex={0} className="input input-md flex items-center justify-between w-full cursor-pointer border border-gray-300 rounded-md focus-within:border-blue-500">
                                <div className="flex items-center">
                                    {roles.find((r) => r.role_uuid === formData.role_uuid)?.icon}
                                    <span className="ml-2">{roles.find((r) => r.role_uuid === formData.role_uuid)?.name}</span>
                                </div>
                            </label>

                            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-md w-full border border-gray-300">
                                {roles.map((role) => (
                                    <li key={role.role_uuid} onClick={() => handleSelectRole(role.role_uuid)}>
                                        <a className="flex items-center">
                                            {role.icon} <span className="ml-2">{role.name}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <label className="input input-md flex items-center w-full">
                            <Envelope theme="outline" size="18" fill="#333" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="邮箱"
                                className="grow"
                            />
                        </label>

                        <label className="input input-md flex items-center w-full">
                            <Envelope theme="outline" size="18" fill="#333" />
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                placeholder="手机号"
                                className="grow"
                            />
                        </label>

                        <div className="flex justify-end gap-2 w-full">
                            <button type="submit" className="btn btn-neutral" disabled={loading}>
                                {loading ? "修改中..." : "修改"}
                            </button>
                            <button type="button" className="btn" onClick={handleCloseDialog}>
                                取消
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </dialog>
    );
}
