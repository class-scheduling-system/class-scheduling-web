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

import {useEffect} from "react";
import {useNavigate} from "react-router";

// 主页，会根据逻辑判断跳转页面
export function BaseIndex() {
    const navigate = useNavigate();

    // 用于判断用户应该跳转到哪里
    useEffect(() => {
        const func = async () => {
            if (!localStorage.getItem("user-token")) {
                navigate("/auth/login");
            }
        }

        func().then();
    }, [navigate]);

    // 用于检查是否是初始化模式
    useEffect(() => {
        const func = async () => {
            if (localStorage.getItem("has_init")) {
                // 获取初始化接口
                localStorage.setItem("has_init", "1");
                navigate("/init");
            } else {
                localStorage.setItem("has_init", "0");
            }
        }

        func().then();
    }, [navigate]);


    return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"/>
        </div>
    );
}
