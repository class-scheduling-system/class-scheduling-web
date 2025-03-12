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

import {BaseApi, GetAuthorizationToken, MethodType} from "../assets/ts/base_api.ts";
import {BaseResponse} from "../models/base_response.ts";
import {DepartmentInfoEntity} from "../models/entity/department__info_entity.ts";
import {PageEntity} from "../models/entity/page_entity.ts";
import {PageSearchDTO} from "../models/dto/page_search_dto.ts";

/**
 * # 根据部门id获取部门信息
 * > 该函数用于通过API请求获取部门信息。它利用了Bearer令牌认证方式来确保安全地访问用户数据。
 *
 * @param {string} department_uuid - 部门的唯一标识符
 * @returns {Promise<BaseResponse<DepartmentInfoEntity> | undefined>} - 返回一个Promise，解析为包含部门信息的BaseResponse对象或undefined，如果请求失败或没有有效响应。
 * @throws {Error} 当网络请求过程中遇到问题时抛出异常。
 */
const GetDepartmentInfoAPI = async (department_uuid: string): Promise<BaseResponse<DepartmentInfoEntity> | undefined> => {
    return BaseApi<DepartmentInfoEntity>(
        MethodType.GET,
        "/api/v1/departments",
        null,
        null,
        department_uuid,
        {Authorization: `Bearer ${GetAuthorizationToken()}`},
    )
}


/**
 * # 获取部门列表
 * > 该函数用于通过API请求获取部门列表。它利用了Bearer令牌认证方式来确保安全地访问部门数据。
 *
 * @returns {Promise<BaseResponse<DepartmentInfoEntity> | undefined>} - 返回一个Promise，解析为包含部门信息的BaseResponse对象或undefined，如果请求失败或没有有效响应。
 * @throws {Error} 当网络请求过程中遇到问题时抛出异常。
 */
const GetDepartmentListAPI = async (data: PageSearchDTO): Promise<BaseResponse<PageEntity<DepartmentInfoEntity>> | undefined> => {
    return BaseApi<PageEntity<DepartmentInfoEntity>>(
        MethodType.GET,
        "/api/v1/departments",
        null,
        data,
        null,
        {Authorization: `Bearer ${GetAuthorizationToken()}`},
    )
}

export {
    GetDepartmentInfoAPI,
    GetDepartmentListAPI
}


