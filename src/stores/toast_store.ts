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

import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Toast, ToastStore} from "../models/store/toast_store.ts";

/**
 * 用于管理 toaster 相关状态的 Redux slice。
 */
export const toastStore = createSlice({
    name: "toast",
    initialState: {
        toasts: []
    } as ToastStore,
    reducers: {
        /**
         * 向 Redux store 中添加一个新的 toast 通知。
         *
         * @param state - 当前的 Redux store 状态。
         * @param action - 包含新 toast 信息的 action 对象，结构为 {payload: {type: string, message: string, icon?: JSX.Element, time?: number}}。
         */
        addToast: (state, action: PayloadAction<Toast>) => {
            const newToast = {
                id: Date.now(),
                type: action.payload.type,
                message: action.payload.message,
                icon: action.payload.icon,
                time: action.payload.time ?? 3000,
                leave: true
            };

            // 检查是否已有相同的通知
            const isDuplicate = state.toasts.some(toast =>
                toast.type === newToast.type &&
                toast.message === newToast.message
            );

            // 如果不是重复的通知，将其添加到列表中
            if (!isDuplicate) {
                state.toasts.push(newToast);
            }
        },


        /**
         * 删除指定 ID 的 toast 通知。
         *
         * @param state - Redux store 中的当前状态。
         * @param action - 包含要删除的 toast ID 的 action 对象。
         */
        delToast: (state, action) => {
            // 使用 filter 方法移除匹配的 toast，避免直接修改 state.toasts 在迭代中的问题
            state.toasts = state.toasts.filter(toast => toast.id !== action.payload);
        },

        /**
         * 重置 toaster 状态，清空所有消息并恢复到初始默认状态。
         *
         * @param state - 当前的 toaster 状态对象。
         */
        resetToast: (state) => {
            state.toasts.splice(0, state.toasts.length); // 清空当前所有 toast 记录
        }
    }
});

export const {addToast, resetToast, delToast} = toastStore.actions;
