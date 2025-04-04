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

import { BaseApi, GetAuthorizationToken, MethodType } from "../assets/ts/base_api";
import { BaseResponse } from "../models/base_response";
import { PageSearchDTO } from "../models/dto/page/page_search_dto";
import { UnitCategoryDTO } from "../models/dto/unit_category_dto";
import { PageEntity } from "../models/entity/page_entity";
import { UnitCategoryEntity } from "../models/entity/unit_category_entity";
import { UnitCategoryLiteEntity } from "../models/entity/unit_category_lite_entity";

/**
 * # 获取单位类别信息
 * > 本接口用于获取单位类别信息，用于获取单个的单位类别信息。
 * 
 * @param unitCategory 单位类别主键
 * @returns 单位类别信息
 */
const GetUnitCategoryAPI = async (unitCategory: string): Promise<BaseResponse<UnitCategoryEntity> | undefined> => {
    return BaseApi<BaseResponse<UnitCategoryEntity>>(
        MethodType.GET,
        "/api/v1/unit/category",
        null,
        null,
        unitCategory,
        {"Authorization": GetAuthorizationToken()},
    );
}

/**
 * # 获取单位类别分页信息
 * > 本接口用于获取单位类别分页信息，用于获取单位类别分页信息。
 *
 * @param data 分页查询参数
 * @returns 单位类别分页信息
 */
const GetUnitCategoryPageAPI = async (data: PageSearchDTO): Promise<BaseResponse<PageEntity<UnitCategoryEntity>> | undefined> => {
    return BaseApi<BaseResponse<PageEntity<UnitCategoryEntity>>>(
        MethodType.GET,
        "/api/v1/unit/category/page",
        null,
        data,
        null,
        {"Authorization": GetAuthorizationToken()},
    );
}

/**
 * # 获取单位类别列表信息
 * > 本接口用于获取单位类别列表信息，用于获取单位类别列表信息。
 *
 * @returns 单位类别列表信息
 */
const GetUnitCategoryListAPI = async (): Promise<BaseResponse<UnitCategoryLiteEntity[]> | undefined> => {
    return BaseApi<BaseResponse<UnitCategoryLiteEntity[]>>(
        MethodType.GET,
        "/api/v1/unit/category/list",
        null,
        null,
        null,
        {"Authorization": GetAuthorizationToken()},
    );
}

/**
 * # 添加单位类别信息
 * > 本接口用于添加单位类别信息，用于添加单位类别信息。
 *
 * @param data 单位类别信息
 * @returns 单位类别信息
 */
const AddUnitCategoryAPI = async (data: UnitCategoryDTO): Promise<BaseResponse<UnitCategoryEntity> | undefined> => {
    return BaseApi<BaseResponse<UnitCategoryEntity>>(
        MethodType.POST,
        "/api/v1/unit/category",
        data,
        null,
        null,
        {"Authorization": GetAuthorizationToken()},
    );
}

/**
 * # 更新单位类别信息
 * > 本接口用于更新单位类别信息，用于更新单位类别信息。
 *
 * @param categoryUuid 单位类别主键
 * @param data 单位类别信息
 * @returns 单位类别信息
 */
const EditUnitCategoryAPI = async (categoryUuid: string, data: UnitCategoryDTO): Promise<BaseResponse<UnitCategoryEntity> | undefined> => {
    return BaseApi<BaseResponse<UnitCategoryEntity>>(
        MethodType.PUT,
        "/api/v1/unit/category/",
        data,
        null,
        categoryUuid,
        {"Authorization": GetAuthorizationToken()},
    );
}

/**
 * # 删除单位类别信息
 * > 本接口用于删除单位类别信息，用于删除单位类别信息。
 *
 * @param categoryUuid 单位类别主键
 * @returns 单位类别信息
 */
const DeleteUnitCategoryAPI = async (categoryUuid: string): Promise<BaseResponse<UnitCategoryEntity> | undefined> => {
    return BaseApi<BaseResponse<UnitCategoryEntity>>(
        MethodType.DELETE,
        "/api/v1/unit/category",
        null,
        null,
        categoryUuid,
        {"Authorization": GetAuthorizationToken()},
    );
}

export {
    GetUnitCategoryAPI,
    GetUnitCategoryPageAPI,
    GetUnitCategoryListAPI,
    AddUnitCategoryAPI,
    EditUnitCategoryAPI,
    DeleteUnitCategoryAPI,
}