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

import {createSlice} from "@reduxjs/toolkit";
import {ToastStore} from "../models/store/toast_store.ts";

/**
 * 用于管理 toaster 相关状态的 Redux slice。
 */
export const toasterStore = createSlice({
    name: "toaster",
    initialState: [{
        type: "normal",
        message: "",
    }] as ToastStore[],
    reducers: {
        /**
         * 向 toaster 状态添加新的通知。
         *
         * @param state - 当前的 toaster 状态数组。
         * @param action - 指示添加通知动作的对象，其 `payload` 包含：
         * {
         *   message: string,          // 显示的消息文本内容。
         *   type: "success" | "error" | "warning" | "info" | "normal", // 通知类型。
         *   time?: number,            // 通知展示时长（毫秒），默认为5000毫秒。
         *   icon?: JSX.Element,       // 可选的图标组件用于增强通知视觉效果。
         * }
         */
        addToast: (state, action) => {
            const newToast = {
                type: action.payload.type,
                message: action.payload.message,
                icon: action.payload.icon || <></>,
                time: action.payload.time || 5000,
            };
            state.push(newToast);
        },

        /**
         * 重置 toaster 状态，清空所有消息并恢复到初始默认状态。
         *
         * @param state - 当前的 toaster 状态对象。
         */
        resetToast: (state) => {
            state.splice(0, state.length); // 清空当前所有 toast 记录
            state.push({type: "normal", message: ""}); // 添加一个默认的空 toast 以保持非空状态
        }
    }
});

export const {addToast, resetToast} = toasterStore.actions;
