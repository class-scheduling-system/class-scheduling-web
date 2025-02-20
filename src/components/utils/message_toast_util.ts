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

import {addToast, delToast, resetToast} from "../../stores/toast_store.ts";
import {JSX} from "react";
import {Toast} from "../../models/store/toast_store.ts";
import {Dispatch} from "@reduxjs/toolkit";


/**
 * 显示消息提示的函数。
 *
 * @param {Dispatch} dispatch - Redux中的调度函数，用于触发状态更新。
 * @param {"success" | "error" | "warning" | "info" | "normal"} type - 消息的类型，决定展示样式。
 * @param {string} message - 要显示的消息内容。
 * @param {number} [time=2000] - 消息自动消失的时间（毫秒），默认为2000毫秒。
 * @param {JSX.Element} [icon] - 自定义图标元素，可选。
 *
 * 此函数创建一个具有唯一ID的消息，并使用调度函数将其添加到应用状态中。根据提供的`time`，
 * 它还设置了一个定时器，在指定时间后通过调用`dispatch(delToast)`来自动删除该消息。
 */
function Message(
    dispatch: Dispatch,
    type: "success" | "error" | "warning" | "info" | "normal",
    message: string,
    time?: number,
    icon?: JSX.Element
) {
    const newId = Date.now();

    dispatch(resetToast());

    dispatch(addToast({
        id: newId,
        type: type,
        message: message,
        time: time,
        icon: icon
    } as Toast));

    setTimeout(() => {
        dispatch(delToast(newId));
    }, time ?? 3000);
}

export {Message};
