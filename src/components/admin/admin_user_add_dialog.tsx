import { useState, useEffect } from "react";
import { Down, Envelope, Key, PhoneTelephone, User, UserPositioning } from "@icon-park/react";
import { AddUserAPI } from "../../apis/user_api.ts";

export function AdminAddUserDialog({ onUserAdded }) {
    // 表单数据状态
    const [formData, setFormData] = useState({
        role_uuid: "",
        name: "",
        password: "",
        email: "",
        phone: "",
        permission: "",
    });

    const [loading, setLoading] = useState(false);

    // 角色列表
    const roles = [
        { role_uuid: "33257a18893a46919fd255a730cb1508", name: "管理员", icon: <UserPositioning theme="outline" size="18" fill="#333" /> },
        { role_uuid: "4d58ff23ce494b5d83d2bcad9eed30d7", name: "教务", icon: <UserPositioning theme="outline" size="18" fill="#333" /> },
        { role_uuid: "60c4d7ce00af44f0a382aa73f64aa3c2", name: "老师", icon: <UserPositioning theme="outline" size="18" fill="#555" /> },
        { role_uuid: "e02425859d904c5bacde77401be48cc9", name: "学生", icon: <UserPositioning theme="outline" size="18" fill="#777" /> },
    ];

    // 初始化角色
    const [selectedRole, setSelectedRole] = useState(roles[0].role_uuid);

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            role_uuid: roles[0].role_uuid, // ✅ 确保 role_uuid 正确
        }));
    }, []);


    // 处理输入框变化
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "permission") {
            setFormData({ ...formData, permission: value.split(",") }); // ✅ 逗号分隔，转为数组
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };


    // 处理角色选择
    const handleSelect = (role) => {
        setSelectedRole(role.role_uuid);
        setFormData((prev) => ({
            ...prev,
            role_uuid: role.role_uuid, // ✅ 直接更新 formData
        }));
    };

    // 关闭对话框的函数
    const handleCloseDialog = () => {
        document.getElementById("my_modal_1")?.close();
    };

    // 提交表单
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 🚀 打印最终的请求数据
        console.log("最终提交的表单数据:", JSON.stringify(formData, null, 2));

        setLoading(true);
        try {
            const response = await AddUserAPI(formData);
            console.log(response);
            if (response) {
                alert("用户添加成功");
                handleCloseDialog();
                onUserAdded();
            } else {
                alert("添加用户失败");
            }
        } catch (error) {
            console.error("添加用户失败:", error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <dialog id="my_modal_1" className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">添加用户</h3>
                <div className="mt-3">
                    <form onSubmit={handleSubmit} className="flex flex-col space-y-4 p-4">
                        <label className="input input-md flex items-center w-full">
                            <User theme="outline" size="18" fill="#333" />
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="用户名" className="grow" />
                        </label>

                        <label className="input input-md flex items-center w-full">
                            <Key theme="outline" size="18" fill="#333" />
                            <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="密码" className="grow" />
                        </label>

                        {/* 角色选择下拉框 */}
                        <div className="dropdown w-full">
                            <label tabIndex={0} className="input input-md flex items-center justify-between w-full cursor-pointer border border-gray-300 rounded-md focus-within:border-blue-500">
                                <div className="flex items-center">
                                    {roles.find((r) => r.role_uuid === selectedRole)?.icon}
                                    <span className="ml-2">{roles.find((r) => r.role_uuid === selectedRole)?.name}</span>
                                </div>
                                <Down theme="outline" size="24" fill="#333" />
                            </label>

                            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-md w-full border border-gray-300">
                                {roles.map((role) => (
                                    <li key={role.role_uuid} onClick={() => handleSelect(role)}>
                                        <a className="flex items-center">
                                            {role.icon} <span className="ml-2">{role.name}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <label className="input input-md flex items-center w-full">
                            <Envelope theme="outline" size="18" fill="#333" />
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="邮箱" className="grow" />
                        </label>

                        <label className="input input-md flex items-center w-full">
                            <PhoneTelephone theme="outline" size="18" fill="#333" />
                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="手机号" className="grow" />
                        </label>
                        <label className="input input-md flex items-center w-full">
                            <PhoneTelephone theme="outline" size="18" fill="#333" />
                            <input type="text" name="permission" value={formData.permission} onChange={handleChange} required placeholder="权限" className="grow" />
                        </label>
                        <div className="flex justify-end gap-2 w-full">
                            <button type="submit" className="btn btn-neutral" disabled={loading}>
                                {loading ? "添加中..." : "添加"}
                            </button>
                            <button type="button" className="btn" onClick={handleCloseDialog} disabled={loading}>
                                取消
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </dialog>
    );
}
