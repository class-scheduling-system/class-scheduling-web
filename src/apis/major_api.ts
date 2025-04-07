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
import {MajorEntity} from "../models/entity/major_entity.ts";
import {PageEntity} from "../models/entity/page_entity.ts";
import {PageSearchDTO} from "../models/dto/page/page_search_dto.ts";
import {MajorListDTO} from "../models/dto/major_list_dto.ts";

/**
 * # 获取专业简单列表
 * > 该函数用于通过API请求获取专业简单列表。它利用了Bearer令牌认证方式来确保安全地访问专业数据。
 * > 支持通过部门和专业名称筛选。
 *
 * @param {MajorListDTO} params - 可选参数，包含部门名称和专业名称
 * @returns {Promise<BaseResponse<MajorEntity[]> | undefined>} - 返回一个Promise，解析为包含专业列表的BaseResponse对象或undefined，如果请求失败或没有有效响应。
 * @throws {Error} 当网络请求过程中遇到问题时抛出异常。
 */
const GetMajorListAPI = async (params?: MajorListDTO): Promise<BaseResponse<MajorEntity[]> | undefined> => {
    return BaseApi<BaseResponse<MajorEntity[]>>(
        MethodType.GET,
        "/api/v1/major/list",
        null,
        params || null,
        null,
        {Authorization: `Bearer ${GetAuthorizationToken()}`},
    )
}

/**
 * # 获取专业分页列表 (管理员)
 * > 该函数用于通过API请求获取管理员视图下的专业分页列表。它利用了Bearer令牌认证方式来确保安全地访问专业数据。
 *
 * @param {PageSearchDTO} data - 分页查询参数
 * @returns {Promise<BaseResponse<PageEntity<MajorEntity>> | undefined>} - 返回一个Promise，解析为包含专业分页列表的BaseResponse对象或undefined，如果请求失败或没有有效响应。
 * @throws {Error} 当网络请求过程中遇到问题时抛出异常。
 */
const GetMajorPageAdminAPI = async (data: PageSearchDTO): Promise<BaseResponse<PageEntity<MajorEntity>> | undefined> => {
    return BaseApi<BaseResponse<PageEntity<MajorEntity>>>(
        MethodType.GET,
        "/api/v1/major/page/admin",
        null,
        data,
        null,
        {Authorization: `Bearer ${GetAuthorizationToken()}`},
    )
}

/**
 * # 获取专业分页列表 (教务)
 * > 该函数用于通过API请求获取教务视图下的专业分页列表。它利用了Bearer令牌认证方式来确保安全地访问专业数据。
 *
 * @param {PageSearchDTO} data - 分页查询参数
 * @returns {Promise<BaseResponse<PageEntity<MajorEntity>> | undefined>} - 返回一个Promise，解析为包含专业分页列表的BaseResponse对象或undefined，如果请求失败或没有有效响应。
 * @throws {Error} 当网络请求过程中遇到问题时抛出异常。
 */
const GetMajorPageAcademicAPI = async (data: PageSearchDTO): Promise<BaseResponse<PageEntity<MajorEntity>> | undefined> => {
    return BaseApi<BaseResponse<PageEntity<MajorEntity>>>(
        MethodType.GET,
        "/api/v1/major/page/academic",
        null,
        data,
        null,
        {Authorization: `Bearer ${GetAuthorizationToken()}`},
    )
}

/**
 * # 获取专业分页列表 (学生)
 * > 该函数用于通过API请求获取学生视图下的专业分页列表。它利用了Bearer令牌认证方式来确保安全地访问专业数据。
 *
 * @param {PageSearchDTO} data - 分页查询参数
 * @returns {Promise<BaseResponse<PageEntity<MajorEntity>> | undefined>} - 返回一个Promise，解析为包含专业分页列表的BaseResponse对象或undefined，如果请求失败或没有有效响应。
 * @throws {Error} 当网络请求过程中遇到问题时抛出异常。
 */
const GetMajorPageStudentAPI = async (data: PageSearchDTO): Promise<BaseResponse<PageEntity<MajorEntity>> | undefined> => {
    return BaseApi<BaseResponse<PageEntity<MajorEntity>>>(
        MethodType.GET,
        "/api/v1/major/page/student",
        null,
        data,
        null,
        {Authorization: `Bearer ${GetAuthorizationToken()}`},
    )
}

/**
 * # 获取专业信息
 * > 该函数用于通过API请求获取专业信息。它利用了Bearer令牌认证方式来确保安全地访问专业数据。
 *
 * @param {string} major_uuid - 专业的唯一标识符
 * @returns {Promise<BaseResponse<MajorEntity> | undefined>} - 返回一个Promise，解析为包含专业信息的BaseResponse对象或undefined，如果请求失败或没有有效响应。
 * @throws {Error} 当网络请求过程中遇到问题时抛出异常。
 */
const GetMajorInfoAPI = async (major_uuid: string): Promise<BaseResponse<MajorEntity> | undefined> => {
    return BaseApi<BaseResponse<MajorEntity>>(
        MethodType.GET,
        "/api/v1/major",
        null,
        null,
        major_uuid,
        {Authorization: `Bearer ${GetAuthorizationToken()}`},
    )
}

export {
    GetMajorListAPI,
    GetMajorPageAdminAPI,
    GetMajorPageAcademicAPI,
    GetMajorPageStudentAPI,
    GetMajorInfoAPI,
} 