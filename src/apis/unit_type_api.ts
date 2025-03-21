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

import { BaseApi, GetAuthorizationToken, MethodType } from "../assets/ts/base_api";
import { BaseResponse } from "../models/base_response";
import { PageSearchDTO } from "../models/dto/page_search_dto";
import { UnitTypeDTO } from "../models/dto/unit_type_dto";
import { PageEntity } from "../models/entity/page_entity";
import { UnitTypeEntity } from "../models/entity/unit_type_entity";
import { UnitTypeLiteEntity } from "../models/entity/unit_type_lite_entity";

/**
 * # 获取单位办别信息
 * > 本接口用于获取单位办别信息，用于获取单个的单位办别信息。
 * 
 * @param unitType 单位办别主键
 * @returns 单位办别信息
 */
const GetUnitTypeAPI = async (unitType: string): Promise<BaseResponse<UnitTypeEntity> | undefined> => {
    return BaseApi<UnitTypeEntity>(
        MethodType.GET,
        "/api/v1/unit/type",
        null,
        null,
        unitType,
        {"Authorization": GetAuthorizationToken()},
    );
}

/**
 * # 获取单位办别分页信息
 * > 本接口用于获取单位办别分页信息，用于获取单位办别分页信息。
 *
 * @param data 分页查询参数
 * @returns 单位办别分页信息
 */
const GetUnitTypePageAPI = async (data: PageSearchDTO): Promise<BaseResponse<PageEntity<UnitTypeEntity>> | undefined> => {
    return BaseApi<PageEntity<UnitTypeEntity>>(
        MethodType.GET,
        "/api/v1/unit/type/page",
        data,
        null,
        null,
        {"Authorization": GetAuthorizationToken()},
    );
}

/**
 * # 获取单位办别列表信息
 * > 本接口用于获取单位办别列表信息，用于获取单位办别列表信息。
 *
 * @returns 单位办别列表信息
 */
const GetUnitTypeListAPI = async (): Promise<BaseResponse<UnitTypeLiteEntity[]> | undefined> => {
    return BaseApi<UnitTypeLiteEntity[]>(
        MethodType.GET,
        "/api/v1/unit/type/list",
        null,
        null,
        null,
        {"Authorization": GetAuthorizationToken()},
    );
}

/**
 * # 添加单位办别信息
 * > 本接口用于添加单位办别信息，用于添加单位办别信息。
 *
 * @param data 单位办别信息
 * @returns 单位办别信息
 */
const AddUnitTypeAPI = async (data: UnitTypeDTO): Promise<BaseResponse<UnitTypeEntity> | undefined> => {
    return BaseApi<UnitTypeEntity>(
        MethodType.POST,
        "/api/v1/unit/type",
        null,
        data,
        null,
        {"Authorization": GetAuthorizationToken()},
    );
}

/**
 * # 更新单位办别信息
 * > 本接口用于更新单位办别信息，用于更新单位办别信息。
 *
 * @param typeUuid 单位办别主键
 * @param data 单位办别信息
 * @returns 单位办别信息
 */
const UpdateUnitTypeAPI = async (typeUuid: string, data: UnitTypeDTO): Promise<BaseResponse<UnitTypeEntity> | undefined> => {
    return BaseApi<UnitTypeEntity>(
        MethodType.PUT,
        "/api/v1/unit/type/",
        null,
        data,
        typeUuid,
        {"Authorization": GetAuthorizationToken()},
    );
}

/**
 * # 删除单位办别信息
 * > 本接口用于删除单位办别信息，用于删除单位办别信息。
 *
 * @param typeUuid 单位办别主键
 * @returns 单位办别信息
 */
const DeleteUnitTypeAPI = async (typeUuid: string): Promise<BaseResponse<UnitTypeEntity> | undefined> => {
    return BaseApi<UnitTypeEntity>(
        MethodType.DELETE,
        "/api/v1/unit/type",
        null,
        null,
        typeUuid,
        {"Authorization": GetAuthorizationToken()},
    );
}

export {
    GetUnitTypeAPI,
    GetUnitTypePageAPI,
    GetUnitTypeListAPI,
    AddUnitTypeAPI,
    UpdateUnitTypeAPI,
    DeleteUnitTypeAPI,
}