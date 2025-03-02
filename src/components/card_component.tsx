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
 * # CardComponent
 *
 * > 用于创建一个响应式的卡片组件，支持自定义列宽、屏幕尺寸下的显示/隐藏行为以及卡片大小。该组件可以接受子元素作为其内容，并允许设置内边距。
 *
 * @param col - 可选参数，类型为1到12的数字之一，表示在网格布局中的列跨度，默认值为空（即不指定列跨度）。
 * @param howScreenFull - 可选参数，类型为"sm", "md", "lg", "xl", "2xl", "3xl", 或 "4xl"之一，指定了从哪个屏幕尺寸开始卡片将占据全列宽度。
 * @param howScreenHide - 可选参数，类型同`howScreenFull`，但功能相反，指定了从哪个屏幕尺寸起卡片将被隐藏。
 * @param children - 必需参数，类型为JSX.Element | string | number，代表要放置在卡片内部的内容。
 * @param padding - 可选参数，类型为number，用来设置卡片内的内边距，默认值为12px。
 * @param size - 可选参数，类型为"sm", "md", 或 "lg"之一，控制卡片的整体大小样式。
 *
 * @returns JSX.Element - 配置好的卡片组件。
 */
export function CardComponent({col, howScreenFull, howScreenHide, children, padding, size}: Readonly<{
    col?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12,
    howScreenHide?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl",
    howScreenFull?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl",
    children: JSX.Element | string | number,
    padding?: number,
    size?: "sm" | "md" | "lg",
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
    }, []);

    return (
        <div className={`${colSpan} ${screenHide}`}>
            <div
                className={`transition card ${sizeOf} bg-base-100 border border-base-200 shadow-sm hover:shadow-lg`}
                style={{padding: (padding ?? 3 * 4) + "px"}}
            >
                {children}
            </div>
        </div>
    );
}
