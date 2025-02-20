import backgroundImage from "../../assets/images/init_background.jpg";
import { useState } from "react";

export function AuthForgetPassword() {
    const [formData, setFormData] = useState({
        identity: "", // 邮箱/手机号
        code: "", // 验证码
        newPassword: "", // 新密码
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({
        identity: "",
        code: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [isCodeSent, setIsCodeSent] = useState(false);
    const [countdown, setCountdown] = useState(0);

    // 密码强度验证
    const validatePassword = (password: string) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;
        return regex.test(password);
    };

    // 发送验证码
    const sendVerificationCode = () => {
        if (!formData.identity) {
            setErrors((prev) => ({ ...prev, identity: "请输入邮箱或手机号" }));
            return;
        }

        setIsCodeSent(true);
        setCountdown(60);
        const timer = setInterval(() => {
            setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        setTimeout(() => clearInterval(timer), 60000);
    };

    // 表单提交
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors = {
            identity: "",
            code: "",
            newPassword: "",
            confirmPassword: "",
        };

        let isValid = true;

        if (!formData.identity) {
            newErrors.identity = "请输入邮箱或手机号";
            isValid = false;
        }

        if (!formData.code) {
            newErrors.code = "请输入验证码";
            isValid = false;
        }

        if (!formData.newPassword) {
            newErrors.newPassword = "请输入新密码";
            isValid = false;
        } else if (!validatePassword(formData.newPassword)) {
            newErrors.newPassword = "密码需包含大小写字母和数字，至少6位";
            isValid = false;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = "两次输入的密码不一致";
            isValid = false;
        }

        setErrors(newErrors);

        if (isValid) {
            console.log("重置密码请求:", formData);
        }
    };

    return (
        <div className="w-full h-dvh grid grid-cols-2 bg-gray-50">
            {/* 左侧背景图 */}
            <div className="w-full h-lvh relative">
                <img
                    src={backgroundImage}
                    className="w-full h-full object-cover"
                    alt="background"
                />
            </div>

            {/* 右侧表单 */}
            <form
                onSubmit={handleSubmit}
                className="flex justify-center h-dvh items-center"
            >
                <div className="card bg-base-100 shadow-md flex flex-col gap-4 w-3/5 p-8 items-center">
                    <h1 className="text-2xl font-bold text-gray-700 mb-4">
                        重置密码
                    </h1>

                    {/* 身份验证（邮箱/手机） */}
                    <div className="w-4/5">
                        <label className="input input-bordered flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="请输入邮箱/手机号"
                                className="grow"
                                value={formData.identity}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        identity: e.target.value,
                                    })
                                }
                            />
                        </label>
                        {errors.identity && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.identity}
                            </p>
                        )}
                    </div>

                    {/* 验证码 + 发送按钮合并 */}
                    <div className="w-4/5">
                        <label className="input input-bordered flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="验证码"
                                className="grow"
                                value={formData.code}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        code: e.target.value,
                                    })
                                }
                            />
                            <button
                                type="button"
                                className={`text-sm px-2 py-1 rounded-lg ${
                                    isCodeSent
                                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        : "bg-blue-500 text-white"
                                }`}
                                onClick={sendVerificationCode}
                                disabled={isCodeSent}
                            >
                                {countdown > 0 ? `${countdown}s` : "获取验证码"}
                            </button>
                        </label>
                        {errors.code && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.code}
                            </p>
                        )}
                    </div>

                    {/* 新密码 */}
                    <div className="w-4/5">
                        <label className="input input-bordered flex items-center gap-2">
                            <input
                                type="password"
                                placeholder="新密码"
                                className="grow"
                                value={formData.newPassword}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        newPassword: e.target.value,
                                    })
                                }
                            />
                        </label>
                        {errors.newPassword && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.newPassword}
                            </p>
                        )}
                    </div>

                    {/* 确认密码 */}
                    <div className="w-4/5">
                        <label className="input input-bordered flex items-center gap-2">
                            <input
                                type="password"
                                placeholder="确认新密码"
                                className="grow"
                                value={formData.confirmPassword}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        confirmPassword: e.target.value,
                                    })
                                }
                            />
                        </label>
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.confirmPassword}
                            </p>
                        )}
                    </div>

                    {/* 密码要求提示 */}
                    <div className="w-4/5 text-sm text-gray-500">
                        <p className="font-medium">密码要求：</p>
                        <ul className="list-disc pl-5">
                            <li>至少6个字符</li>
                            <li>包含至少一个大写字母</li>
                            <li>包含至少一个小写字母</li>
                            <li>包含至少一个数字</li>
                        </ul>
                    </div>

                    {/* 提交按钮 */}
                    <button
                        type="submit"
                        className="btn btn-primary w-4/5 mt-4"
                    >
                        重置密码
                    </button>
                </div>
            </form>
        </div>
    );
}
