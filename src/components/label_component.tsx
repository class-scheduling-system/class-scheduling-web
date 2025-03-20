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

import {JSX, useEffect, useState} from "react";

/**
 * # LabelComponent
 *
 * > 用于显示标签的组件，支持不同类型、图标、文本、样式和大小的标签。
 *
 * @param type - 标签类型
 * @param icon - 标签图标
 * @param text - 标签文本
 * @param style - 标签样式
 * @param size - 标签大小
 *
 * @returns {JSX.Element} - 返回一个标签组件
 */
export function LabelComponent({type, icon, text, style, size}: Readonly<{
    type: "success" | "info" | "warning" | "error" | "primary" | "secondary" | "base";
    text?: string;
    icon?: JSX.Element;
    style?: "badge-soft" | "badge-dash" | "badge-outline";
    size?: "badge-xs" | "badge-sm" | "badge-lg" | "badge-xl";
}>): JSX.Element {
    const [selectedStyle, setSelectedStyle] = useState<string>("");

    useEffect(() => {
        switch (type) {
            case "success":
                setSelectedStyle("badge badge-success");
                break;
            case "info":
                setSelectedStyle("badge badge-info");
                break;
            case "warning":
                setSelectedStyle("badge badge-warning");
                break;
            case "error":
                setSelectedStyle("badge badge-error");
                break;
            case "primary":
                setSelectedStyle("badge badge-primary");
                break;
            case "secondary":
                setSelectedStyle("badge badge-secondary");
                break;
            case "base":
                setSelectedStyle("badge badge-base");
                break;
        }
    }, [type]);

    return (
        <span className={`inline-flex items-center whitespace-nowrap rounded-full select-none ${size} ${style} ${selectedStyle}`}>
            {icon}
            {text}
        </span>
    )
}
