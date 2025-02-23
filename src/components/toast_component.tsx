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

import {animated, useTransition} from "@react-spring/web";
import {Toast, ToastStore} from "../models/store/toast_store.ts";
import {Alarm, Attention, Error, Info, Success} from "@icon-park/react";
import {useSelector} from "react-redux";

export function ToastComponent() {
    const toast = useSelector((state: { toast: ToastStore }) => state.toast);

    const toastTransition = useTransition(toast?.toasts ?? [], {
        from: {
            opacity: 0,
            transform: 'translateY(-10px)', // 初始状态
        },
        enter: {
            opacity: 1,
            transform: 'translateY(0)', // 进入动画
        },
        leave: {
            opacity: 0,
            transform: 'translateY(-10px)',
        },
        config: {tension: 170, friction: 26},
    });

    // 获取不同类型的 toast 样式
    function getToastClass(type: string) {
        switch (type) {
            case "success":
                return "alert-success text-success-content";
            case "info":
                return "alert-info text-info-content";
            case "warning":
                return "alert-warning text-warning-content";
            case "error":
                return "alert-error text-error-content";
            case "normal":
                return "alert-horizontal text-base-content";
            default:
                return "";
        }
    }

    // 根据 toast 类型选择图标
    function getToastIcon(toast: Toast) {
        if (!toast.icon) {
            switch (toast.type) {
                case "success":
                    return <Success theme="outline" size="16"/>;
                case "info":
                    return <Info theme="outline" size="16"/>;
                case "warning":
                    return <Alarm theme="outline" size="16"/>;
                case "error":
                    return <Error theme="outline" size="16"/>;
                case "normal":
                    return <Attention theme="outline" size="16"/>;
                default:
                    return null;
            }
        } else {
            return toast.icon;
        }
    }

    return (
        toastTransition((style, item) => (
            <animated.div
                key={item.id} // 为每个 toast 添加唯一 key
                style={style} // 应用动画样式
                className={`toast toast-top toast-center z-50 pt-6`}>
                <div
                    className={`alert ${getToastClass(item.type)} text-base-content flex transition shadow-md hover:shadow-lg`}>
                    {getToastIcon(item)}
                    <span>{item.message}</span>
                </div>
            </animated.div>
        ))
    )
}
