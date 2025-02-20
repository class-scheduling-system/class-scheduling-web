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
import {SiteInfoEntity} from "../models/entity/site_info_entity.ts";

/**
 * 该变量 `siteStore` 是一个 Redux slice，用于管理与站点信息相关的状态。
 * 它定义了一个名为 "site" 的 slice，并提供了更新整个站点信息状态的 reducer。
 *
 * initialState: 站点信息的初始状态被设置为一个空对象（类型为 SiteInfoEntity）。
 * 这意味着在应用启动时或当站点信息未被初始化时，其默认值为空。
 *
 * reducers:
 * - setSiteStore: 此 reducer 允许你完全替换当前存储中的站点信息。通过传入一个新的 `SiteInfoEntity` 对象，
 *   可以更新 Redux store 中保存的所有站点相关数据。
 *   参数说明：
 *     - state: 当前站点信息的状态。
 *     - action: 包含新的站点信息实体的 action 对象。此对象应包含完整的站点信息结构。
 */
export const siteStore = createSlice({
    name: "site",
    initialState: {} as SiteInfoEntity,
    reducers: {
        /**
         * 更新站点信息存储。
         *
         * 该函数接收当前状态和一个包含站点信息的动作，然后使用动作中的负载数据更新状态中的所有相关属性。
         *
         * @param {SiteInfoEntity} state - 当前的状态对象。
         * @param {PayloadAction<SiteInfoEntity>} action - 包含站点信息的动作对象。
         */
        setSiteStore: (state: SiteInfoEntity, action: PayloadAction<SiteInfoEntity>) => {
            state.contact_email = action.payload.contact_email;
            state.contact_phone = action.payload.contact_phone;
            state.copyright_status = action.payload.copyright_status;
            state.description = action.payload.description;
            state.founder = action.payload.founder;
            state.icon_url = action.payload.icon_url;
            state.icp_link = action.payload.icp_link;
            state.icp_number = action.payload.icp_number;
            state.keywords = action.payload.keywords;
            state.launch_date = action.payload.launch_date;
            state.logo_url = action.payload.logo_url;
            state.name = action.payload.name;
            state.office_address = action.payload.office_address;
            state.open_source_license = action.payload.open_source_license;
            state.owner = action.payload.owner;
            state.security_record = action.payload.security_record;
            state.security_record_link = action.payload.security_record_link;
            state.sub_title = action.payload.sub_title;
            state.technology_stack = action.payload.technology_stack;
            state.title = action.payload.title;
            state.wechat_office_account = action.payload.wechat_office_account;
            state.weibo_url = action.payload.weibo_url;
        },
    }
});

export const {setSiteStore} = siteStore.actions;
