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

import {useNavigate} from "react-router";
import {JSX} from "react";
import {animated, useSpring} from "@react-spring/web";

/**
 * # PageNotFound
 * > 该函数用于在用户访问不存在的页面时显示404错误页面。它提供了一个友好的用户界面，告知用户请求的页面无法找到，并提供一个按钮让用户可以返回到上一个页面。
 *
 * @returns {JSX.Element} 返回一个React组件，展示404错误页面，包括错误信息和一个返回上一页的按钮。
 */
export function PageNotFound(): JSX.Element {
    const navigate = useNavigate();

    const fade = useSpring({
        opacity: 1,
        from: { opacity: 0 },
        config: { tension: 120, friction: 26 },
    });

    return (
        <animated.div style={fade} className="grid h-screen place-content-center bg-white px-4">
            <div className="text-center">
                <h1 className="text-9xl font-black text-gray-200 selec select-none">404</h1>
                <p className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl select-none">Uh-oh!</p>
                <p className="mt-4 text-gray-500 select-none">我们找不到该页面。</p>
                <button
                    onClick={() => navigate(-1)}
                    className="btn btn-primary btn-lg mt-6 select-none"

                >
                    返回上一页
                </button>
            </div>
        </animated.div>
    );
}
