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

import {PageSearchDTO} from "../models/dto/page_search_dto.ts";
import {BaseApi, MethodType} from "../assets/ts/base_api.ts";
import {BaseResponse} from "../models/base_response.ts";
import {PageEntity} from "../models/entity/page_entity.ts";
import {BuildingEntity} from "../models/entity/building_entity.ts";

/**
 * # 获取建筑列表 API
 * > 该函数用于通过指定的搜索条件异步获取建筑列表。它封装了对后端API的调用，返回的数据包括分页信息和具体的建筑实体。
 *
 * @param {PageSearchDTO} data - 包含搜索条件的对象，例如页码、每页显示条数等信息。
 * @returns {Promise<BaseResponse<PageEntity<BuildingEntity>> | undefined>} - 返回一个 Promise 对象，解析后得到的是一个包含分页信息及建筑实体列表的响应对象或 undefined。
 * @throws {Error} 当网络请求失败或服务器返回错误时抛出异常。
 */
const GetBuildingListAPI = async (data: PageSearchDTO): Promise<BaseResponse<PageEntity<BuildingEntity>> | undefined> => {
    return BaseApi<PageEntity<BuildingEntity>>(
        MethodType.GET,
        "/api/v1/building/list",
        null,
        data,
        null,
        null
    );
}

export {
    GetBuildingListAPI
}
