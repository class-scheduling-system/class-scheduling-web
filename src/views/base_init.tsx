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

import * as React from "react";
import {useEffect, useState} from "react";
import {SystemInitDTO} from "../models/dto/system_init_dto.ts";

import backgroundImage from "../assets/images/init_background.jpg";
import {InitAPI} from "../apis/init_api.ts";
import {useNavigate} from "react-router";

export function BaseInit() {
    const navigate = useNavigate();

    const [data, setData] = useState<SystemInitDTO>({} as SystemInitDTO);
    const [rePassword, setRePassword] = useState<string>("" as string);
    const [checkPasswordClass, setCheckPasswordClass] = useState<string>("" as string);
    const [checkPasswordWord, setCheckPasswordWord] = useState<string>("" as string);

    useEffect(() => {
        // TODO-[25021103] 检查是否已经完成初始化（接口）
        // 如果检查通过禁止访问当前页面
    }, []);

    useEffect(() => {
        if (rePassword) {
            if (rePassword === data.password) {
                setCheckPasswordWord("hidden");
                setCheckPasswordClass("input-success");
            } else {
                setCheckPasswordWord("");
                setCheckPasswordClass("input-error");
            }
        } else {
            setCheckPasswordWord("hidden");
            setCheckPasswordClass("");
        }
    }, [rePassword, data.password]);

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (rePassword !== data.password) {
            // TODO-[25021101] Tocast
            console.log("密码不正确");
        }

        const getResp = await InitAPI(data);
        if (getResp?.output === "Success") {
            navigate("/");
        } else {
            // TODO-[25021102] Tocast
        }
    }

    return (
        <div className={"w-full h-dvh grid grid-cols-2 bg-base-100"}>
            <div className={"w-full h-lvh relative"}>
                <img src={backgroundImage} className={"w-full h-full object-cover"} alt={"init-background"} draggable={false}/>
            </div>
            <form onSubmit={onSubmit} className={"flex justify-center h-dvh items-center"}>
                <div className={"flex flex-col gap-3 w-3/5"}>
                    <span className={"text-4xl font-bold pb-6 text-center"}>系统初始化</span>
                    <div className={"w-full"}>
                        <label className="input validator w-full input-lg transition">
                            <span className="label">用户名</span>
                            <input type="text" placeholder="xiao_lfeng" required
                                   pattern={"^[0-9A-Za-z\\-_]+$"}
                                   minLength={4} maxLength={32}
                                   onChange={(e) => setData({...data, username: e.target.value})}
                            />
                        </label>
                        <p className="validator-hint hidden">
                            <div className={"flex flex-col"}>
                                <span>用户名长度在 <b>4</b> 至 <b>32</b> 之间</span>
                                <span>用户名只允许键入 <kbd>0-9,A-Z,a-z</kbd> 以及 <kbd>-</kbd> 和 <kbd>_</kbd></span>
                            </div>
                        </p>
                    </div>
                    <div className={"w-full"}>
                        <label className="input validator w-full input-lg transition">
                            <span className="label">邮箱</span>
                            <input type="email" placeholder="example@x-lf.cn" required
                                   pattern={"^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$"}
                                   onChange={(e) => setData({...data, email: e.target.value})}
                            />
                        </label>
                        <p className="validator-hint hidden">
                            <div className={"flex flex-col"}>
                                <span>邮箱格式不正确</span>
                            </div>
                        </p>
                    </div>
                    <div className={"w-full"}>
                        <label className="input validator w-full input-lg transition">
                            <span className="label">手机</span>
                            <input type="text" placeholder="13388888888" required
                                   pattern={"^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\\d{8}$"}
                                   minLength={11} maxLength={11}
                                   onChange={(e) => setData({...data, phone: e.target.value})}
                            />
                        </label>
                        <p className="validator-hint hidden">
                            <div className={"flex flex-col"}>
                                <span>手机号格式不正确</span>
                            </div>
                        </p>
                    </div>
                    <div className={"w-full"}>
                        <label className="input validator w-full input-lg transition">
                            <span className="label">密码</span>
                            <input type="password" placeholder="******" required
                                   pattern={"^(?=.*[0-9])(?=.*[a-zA-Z])[A-Za-z0-9]{6,}$"}
                                   onChange={(e) => setData({...data, password: e.target.value})}
                            />
                        </label>
                        <p className="validator-hint hidden">
                            <div className={"flex flex-col"}>
                                <span>密码强度要求不符合</span>
                                <span>必须包含 <b>大小写字母</b> 和 <b>数字</b> 的组合，可以使用 <b>特殊字符</b></span>
                                <span>长度在 <b>6</b> 位数以上</span>
                            </div>
                        </p>
                    </div>
                    <div className={"w-full"}>
                        <label className={"input w-full input-lg transition " + checkPasswordClass}>
                            <span className="label">重复密码</span>
                            <input type="password" placeholder="******" required
                                   onChange={(e) => setRePassword(e.target.value)}
                            />
                        </label>
                        <p className={"text-error text-xs pt-2 " + checkPasswordWord}>
                            <div className={"flex flex-col"}>
                                <span>两次密码不一致</span>
                            </div>
                        </p>
                    </div>
                    <div className={"w-full flex justify-center"}>
                        <button className={"btn btn-primary btn-lg"} type={"submit"}>初始化</button>
                    </div>
                </div>
            </form>
        </div>
    );
}
