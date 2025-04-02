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
 * 本软件是"按原样"提供的，没有任何形式的明示或暗示的保证，包括但不限于
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

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AiFormStore, HtmlRecordStore } from "../models/store/ai_form_store.ts";

// 定义 addRecord 方法的 payload 类型
interface AddRecordPayload {
    key: string;
    value: HtmlRecordStore;
}

// 为 other_data 定义更具体的类型，与 AiFormStore 中定义兼容
type OtherDataType = Record<string, object>;

export const aiFormChatStore = createSlice({
    name: "aiFormChat",
    initialState: {
        user_input: '',
        role: '',
        form: '',
        other_data: {}, // 改为使用普通对象而不是 Map
        this_page: '',
        record: {} // 改为使用普通对象而不是 Map
    } as AiFormStore,
    reducers: {
        /**
         * 设置表单数据
         *           
         * @param state 
         * @param action 
         */
        setForm: (state, action: PayloadAction<string>) => {
            state.form = action.payload;
        },

        /**
         * 设置其他数据
         * 
         * @param state 
         * @param action 
         */
        setOtherData: (state, action: PayloadAction<OtherDataType>) => {
            state.other_data = action.payload;
        },

        /**
         * 添加记录
         * 
         * @param state 
         * @param action 
         */
        addRecord: (state, action: PayloadAction<AddRecordPayload>) => {
            // 使用对象属性赋值而不是 Map.set()
            const { key, value } = action.payload;
            state.record[key] = value;
        },

        /**
         * 设置当前页面
         * 
         * @param state 
         * @param action 
         */
        setThisPage: (state, action: PayloadAction<string>) => {
            state.this_page = action.payload;
        }
    }
});

export const { setForm, setOtherData, addRecord, setThisPage } = aiFormChatStore.actions;
export default aiFormChatStore.reducer;