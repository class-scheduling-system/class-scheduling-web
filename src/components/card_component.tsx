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
import {JSX, useEffect, useState} from "react";

/**
 * # CardComponent
 * > 一个用于创建响应式卡片组件的函数。该组件支持自定义列宽、不同屏幕尺寸下的显示与隐藏规则以及样式大小等属性。
 *
 * @param col - 列宽度，可以是1到12之间的整数，默认值为空。
 * @param howScreenFull - 在指定屏幕尺寸下占据全部宽度的断点，默认值为空。
 * @param howScreenHide - 在指定屏幕尺寸下隐藏组件的断点，默认值为空。
 * @param children - 卡片内包含的内容，可以是JSX元素、元素数组或简单文本/数字。
 * @param padding - 卡片内容区域的内边距，默认为12px。
 * @param size - 卡片的预设尺寸，可选值有 "sm", "md", 和 "lg"，默认值为空。
 * @param clazz - 应用到最外层div上的额外CSS类名，默认值为空。
 * @param style - 应用到最外层div上的额外内联样式，默认值为空。
 * @returns JSX.Element - 返回一个配置了所需样式的JSX.Element类型的卡片组件。
 */
export function CardComponent({col, howScreenFull, howScreenHide, children, padding, size, clazz, style}: Readonly<{
    col?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12,
    howScreenHide?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl",
    howScreenFull?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl",
    children: JSX.Element | JSX.Element[] | string | number,
    padding?: number,
    size?: "sm" | "md" | "lg",
    clazz?: string,
    style?: React.CSSProperties
}>): JSX.Element {
    const screenHide = howScreenHide ? `hidden ${howScreenHide}:block` : "";
    const [colSpan, setColSpan] = useState<string>("");
    const [sizeOf, setSizeOf] = useState<string>("");

    useEffect(() => {
        if (col) {
            setColSpan(howScreenFull ? `col-span-full ${howScreenFull}:col-span-${col}` : `col-span-${col}`);
        } else {
            setColSpan("");
        }
    }, [col, howScreenFull]);

    useEffect(() => {
        switch (size) {
            case "sm":
                setSizeOf("card-sm");
                break;
            case "md":
                setSizeOf("card-md");
                break;
            case "lg":
                setSizeOf("card-lg");
                break;
            default:
                setSizeOf("");
        }
    }, [size]);

    return (
        <div className={`${colSpan} ${screenHide} ${clazz ?? ""}`} style={style}>
            <div
                className={`transition card ${sizeOf} bg-base-100 border border-base-200 shadow-sm hover:shadow-lg`}
                style={{padding: (padding ?? 3 * 4) + "px"}}
            >
                {children}
            </div>
        </div>
    );
}
