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

import {Route, Routes, useLocation, useNavigate} from "react-router";
import {AuthLogin} from "./auth/auth_login.tsx";
import {AuthRegister} from "./auth/auth_register.tsx";
import {AuthAlterPassword} from "./auth/auth_change_password.tsx";
import {AuthForgetPassword} from "./auth/auth_forget_password.tsx";
import {JSX, useEffect, useState} from "react";
import {animated, useSpring, useTransition} from "@react-spring/web";
import backgroundImage from "../assets/images/init_background.jpg";
import {InitCheckAPI} from "../apis/init_api.ts";
import {message} from "antd";
import {SimplePageNotFoundHasButton} from "./404/simple_page_not_found_has_button.tsx";

/**
 * # 函数描述
 * > 该函数用于设置基础认证路由，包括登录、注册、修改密码和忘记密码等页面的路由配置。
 *
 * @returns {JSX.Element} 返回一个包含多个认证相关页面路由配置的React组件。
 *
 * @throws {Error} 如果在路由配置过程中遇到任何错误（例如无效的路径或元素），则可能抛出异常。
 */
export function BaseAuth(): JSX.Element {
    const location = useLocation();  // 获取当前路径
    const navigate = useNavigate();

    // 用来控制图片动画只在第一次加载时执行
    const [hasLoaded, setHasLoaded] = useState(false);

    // 图片背景的 useSpring 动画，仅在页面加载时触发
    const imageSpring = useSpring({
        opacity: hasLoaded ? 1 : 0,
        config: {
            tension: 64,
            friction: 26,
        },
    });

    const transitions = useTransition(location, {
        key: location.pathname,
        from: {opacity: 0, transform: 'translateY(-50px)'},
        enter: {opacity: 1, transform: 'translateY(0%)'},
        config: {
            tension: 170,
            friction: 26,
        },
        delay: 150,
    });

    useEffect(() => {
        setHasLoaded(true);
    }, []);

    // 检查系统初始化状态
    useEffect(() => {
        const func = async () => {
            try {
                const getResp = await InitCheckAPI();
                if (getResp?.output === "Success") {
                    if (getResp.data!.system_init) {
                        navigate("/init");
                    } else {
                        if (location.pathname === "/auth") {
                            navigate("/auth/login");
                        }
                    }
                } else {
                    message.error("系统初始化检查失败，请联系管理员!");
                }
            } catch (e) {
                console.error(e);
            }
        }
        func().then();
    }, [location.pathname, navigate]);

    const fade = useSpring({
        opacity: 1,
        from: {opacity: 0},
        config: {tension: 120, friction: 26},
    });

    return (
        <animated.div style={fade} className={"w-full grid grid-cols-2 bg-gray-50 overflow-hidden"}>
            {/* 图片背景使用单独的 useSpring 动画 */}
            <animated.div style={imageSpring} className={"w-full h-lvh relative hidden md:block"}>
                <img src={backgroundImage} className={"w-full h-full object-cover"} alt={"init-background"}/>
            </animated.div>
            {/* 路由内容的动画 */}
            <div className={"col-span-full md:col-span-1 overflow-hidden"}>
                {
                    transitions((style, item) => (
                        <animated.div style={style} className={"w-full h-full"}>
                            <Routes location={item}>
                                <Route path={"/login"} element={<AuthLogin/>}/>
                                <Route path={"/register"} element={<AuthRegister/>}/>
                                <Route path={"/alter-password"} element={<AuthAlterPassword/>}/>
                                <Route path={"/forget-password"} element={<AuthForgetPassword/>}/>
                                <Route path={"/*"} element={<SimplePageNotFoundHasButton/>}/>
                            </Routes>
                        </animated.div>
                    ))
                }
            </div>
        </animated.div>
    );
}
