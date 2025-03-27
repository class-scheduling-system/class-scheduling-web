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
import {UserInfoEntity} from "../models/entity/user_info_entity.ts";

/**
 * # setUserInfo
 * > 该函数用于更新用户信息，包括用户的基本信息、学生信息以及教师信息。通过接收新的用户实体对象来覆盖当前存储的状态。
 *
 * @param state - 当前的用户信息状态，类型为 `UserInfoEntity`。
 * @param action - 包含新用户信息的动作对象，类型为 `PayloadAction<UserInfoEntity>`。
 */
export const userStore = createSlice({
    name: "user",
    initialState: {loading: true} as UserInfoEntity,
    reducers: {
        /**
         * # setUserInfo
         * > 该函数用于更新用户信息，包括用户的基本信息、学生信息以及教师信息。通过接收新的用户实体对象来覆盖当前存储的状态。
         *
         * @param state - UserInfoEntity 类型，表示当前的用户信息状态。
         * @param action - PayloadAction<UserInfoEntity> 类型，包含新的用户信息数据，用以更新现有状态。
         */
        setUserInfo: (state: UserInfoEntity, action: PayloadAction<UserInfoEntity>) => {
            state.user = action.payload.user;
            state.student = action.payload.student;
            state.teacher = action.payload.teacher;
            state.loading = false;
        },
    }
});

export const {setUserInfo} = userStore.actions;
