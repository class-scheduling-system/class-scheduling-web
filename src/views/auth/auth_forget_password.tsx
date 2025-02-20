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

import {useState} from "react";

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
            setErrors((prev) => ({...prev, identity: "请输入邮箱或手机号"}));
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
    );
}
