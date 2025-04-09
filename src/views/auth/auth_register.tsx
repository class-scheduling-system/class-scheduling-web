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
 * 本软件是"按原样"提供的，没有任何形式的明示或暗示的保证，包括但不限于
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
import {DoubleLeft, DoubleRight, Key, Mail, PhoneTelephone, User} from "@icon-park/react";
import {message} from "antd";
import {Link, useNavigate, useParams} from "react-router";
import {SiteInfoEntity} from "../../models/entity/site_info_entity";
import {useSelector} from "react-redux";
import {AuthRegisterAPI} from "../../apis/auth_api";

/**
 * # 函数描述
 * > `AuthRegister` 函数用于渲染一个用户注册界面，用户可以通过该界面完成账号注册。
 *
 * @returns {JSX.Element} 返回一个包含注册表单的 JSX 元素。
 */
export function AuthRegister(): JSX.Element {
    const site = useSelector((state: { site: SiteInfoEntity }) => state.site);
    const navigate = useNavigate();
    const params = useParams();
    
    // 获取路由参数
    const userType = params.type === 'student' ? true : false; // teacher为true, student为false
    const userUuid = params.student_id || '';
    
    const [formData, setFormData] = useState({
        type: userType,
        user: userUuid,
        name: '',
        new_password: '', // 必须使用后端定义的字段名new_password
        email: '',
        phone: ''
    });
    
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [submitDisabled, setSubmitDisabled] = useState(true);

    useEffect(() => {
        document.title = `用户注册 | ${site.title}`;
    }, [site.title]);

    useEffect(() => {
        setPasswordMatch(formData.new_password === confirmPassword || confirmPassword === '');
    }, [formData.new_password, confirmPassword]);

    useEffect(() => {
        // 验证表单是否可提交
        const isFormValid = 
            formData.user.trim() !== '' &&
            formData.name.trim() !== '' &&
            formData.new_password.trim() !== '' &&
            formData.email.trim() !== '' &&
            formData.phone.trim() !== '' &&
            passwordMatch &&
            formData.new_password !== '';
        
        setSubmitDisabled(!isFormValid);
    }, [formData, passwordMatch]);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        
        if (!passwordMatch) {
            message.error("两次密码输入不一致");
            return;
        }

        try {
            const resp = await AuthRegisterAPI(formData);
            if (resp?.output === "Success") {
                message.success("注册成功");
                navigate("/auth/login");
            } else {
                message.error(resp?.error_message || "注册失败，请稍后重试");
            }
        } catch (error) {
            console.error("注册请求出错:", error);
            message.error("注册失败，请稍后重试");
        }
    }

    function handleCancel() {
        navigate("/auth/login");
    }

    return (
        <form className="flex justify-center h-dvh items-center" onSubmit={handleSubmit}>
            <div className="card bg-base-100 shadow-md flex flex-col gap-6 w-3/5 p-8 items-center">
                <div className={"w-full flex flex-col space-y-0.5"}>
                    <span className="text-2xl text-gray-700 font-bold text-center">{site.title}</span>
                    <div className="text-xl text-gray-700 font-bold text-center flex justify-center items-center">
                        <DoubleRight theme="outline" size="20"/>
                        <span>用户注册</span>
                        <DoubleLeft theme="outline" size="20"/>
                    </div>
                </div>

                {/* 输入框部分 */}
                <div className="flex flex-col gap-4 w-4/5 items-center">
                    <div className={"w-full"}>
                        <label className="bg-gray-50 input input-md transition flex items-center w-full validator">
                            <User theme="outline" size="20"/>
                            <input 
                                type="text" 
                                className="grow text-md px-4 self-center" 
                                placeholder="用户名" 
                                required
                                value={formData.name}
                                pattern="^[0-9A-Za-z_-]{4,32}$"
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />
                        </label>
                        <div className="validator-hint hidden">
                            <div className={"flex flex-col"}>
                                <span>用户名长度在 <b>4</b> 至 <b>32</b> 之间</span>
                                <span>用户名只允许键入 <kbd>0-9,A-Z,a-z</kbd> 以及 <kbd>-</kbd> 和 <kbd>_</kbd></span>
                            </div>
                        </div>
                    </div>

                    <div className={"w-full"}>
                        <label className="bg-gray-50 input input-md transition flex items-center w-full validator">
                            <Key theme="outline" size="20"/>
                            <input 
                                type="password" 
                                className="grow text-md px-4 self-center" 
                                placeholder="设置密码" 
                                required
                                pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$"
                                onChange={(e) => setFormData({...formData, new_password: e.target.value})}
                            />
                        </label>
                        <div className="validator-hint hidden">
                            <div className={"flex flex-col"}>
                                <span>密码强度要求不符合</span>
                                <span>必须包含 <b>大小写字母</b> 和 <b>数字</b> 的组合，可以使用 <b>特殊字符</b></span>
                                <span>长度在 <b>6</b> 位数以上</span>
                            </div>
                        </div>
                    </div>

                    <div className={"w-full"}>
                        <label className={`bg-gray-50 input input-md transition flex items-center w-full ${!passwordMatch ? 'input-error' : ''}`}>
                            <Key theme="outline" size="20"/>
                            <input 
                                type="password" 
                                className="grow text-md px-4 self-center" 
                                placeholder="确认密码" 
                                required
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </label>
                        {!passwordMatch && (
                            <div className="text-red-500 text-sm mt-1">
                                <span>两次密码输入不一致</span>
                            </div>
                        )}
                    </div>

                    <div className={"w-full"}>
                        <label className="bg-gray-50 input input-md transition flex items-center w-full validator">
                            <Mail theme="outline" size="20"/>
                            <input 
                                type="email" 
                                className="grow text-md px-4 self-center" 
                                placeholder="邮箱" 
                                required
                                pattern="^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$"
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                        </label>
                        <div className="validator-hint hidden">
                            <div className={"flex flex-col"}>
                                <span>邮箱格式不正确</span>
                            </div>
                        </div>
                    </div>

                    <div className={"w-full"}>
                        <label className="bg-gray-50 input input-md transition flex items-center w-full validator">
                            <PhoneTelephone theme="outline" size="20"/>
                            <input 
                                type="tel" 
                                className="grow text-md px-4 self-center" 
                                placeholder="手机号" 
                                required
                                pattern="^1[3456789]\d{9}$"
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            />
                        </label>
                        <div className="validator-hint hidden">
                            <div className={"flex flex-col"}>
                                <span>手机号格式不正确</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 按钮部分 */}
                <div className="flex items-center justify-center gap-4 w-full">
                    <button 
                        type="submit" 
                        className="btn btn-primary btn-md w-40"
                        disabled={submitDisabled}
                    >
                        注册
                    </button>
                    <button 
                        type="button" 
                        className="btn btn-outline btn-md w-40"
                        onClick={handleCancel}
                    >
                        取消
                    </button>
                </div>

                <div className="flex justify-end w-full pt-3">
                    <div>已有账号？</div>
                    <div className={"px-2"}>|</div>
                    <Link to="/auth/login" className="transition text-primary hover:text-primary-content">
                        立即登录
                    </Link>
                </div>
            </div>
        </form>
    );
}
