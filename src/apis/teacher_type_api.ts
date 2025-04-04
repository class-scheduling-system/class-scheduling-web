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

import {BaseResponse} from "../models/base_response.ts";
import {TeacherTypeEntity} from "../models/entity/teacher_type_entity.ts";
import {BaseApi, GetAuthorizationToken, MethodType} from "../assets/ts/base_api.ts";
import {PageEntity} from "../models/entity/page_entity.ts";
import {PageTeacherTypeSearchDTO} from "../models/dto/page/page_teacher_type_search_dto.ts";


/**
 * # 获取教师类型分页列表
 * > 该函数用于通过API请求获取教师类型分页列表。它利用了Bearer令牌认证方式来确保安全地访问教师类型数据。
 *
 * @returns {Promise<BaseResponse<PageEntity<TeacherTypeEntity> | undefined>} - 返回一个Promise，解析为包含教师类型的BaseResponse对象或undefined，如果请求失败或没有有效响应。
 * @throws {Error} 当网络请求过程中遇到问题时抛出异常。
 */
const GetTeacherTypeListAPI = async (data: PageTeacherTypeSearchDTO): Promise<BaseResponse<PageEntity<TeacherTypeEntity>> | undefined> => {
    return BaseApi<BaseResponse<PageEntity<TeacherTypeEntity>>>(
        MethodType.GET,
        "/api/v1/teacher-type/page",
        null,
        data,
        null,
        {Authorization: `Bearer ${GetAuthorizationToken()}`},
    )
}

/**
 * # 获取教师类型简洁列表
 * > 该函数用于通过API请求获取教师类型简洁列表。它利用了Bearer令牌认证方式来确保安全地访问教师类型简洁数据。
 *
 * @returns {Promise<BaseResponse<TeacherTypeEntity> | undefined>} - 返回一个Promise，解析为包含教师类型简洁的BaseResponse对象或undefined，如果请求失败或没有有效响应。
 * @throws {Error} 当网络请求过程中遇到问题时抛出异常。
 */
const GetTeacherTypeSimpleListAPI = async (): Promise<BaseResponse<TeacherTypeEntity> | undefined> => {
    return BaseApi<BaseResponse<TeacherTypeEntity>>(
        MethodType.GET,
        "/api/v1/teacher-type/list",
        null,
        null,
        null,
        {Authorization: `Bearer ${GetAuthorizationToken()}`},
    )
}

/**
 * # 根据type_uuid获取教师类型信息
 * > 该函数用于通过API请求获取教师类型信息。它利用了Bearer令牌认证方式来确保安全地访问教师类型数据。
 *
 * @returns {Promise<BaseResponse<TeacherTypeEntity> | undefined>} - 返回一个Promise，解析为包含教师类型信息的BaseResponse对象或undefined，如果请求失败或没有有效响应。
 * @throws {Error} 当网络请求过程中遇到问题时抛出异常。
 */
const GetTeacherTypeInfoByTypeUuidAPI = async (teacher_type_uuid:string): Promise<BaseResponse<TeacherTypeEntity> | undefined> => {
    return BaseApi<BaseResponse<TeacherTypeEntity>>(
        MethodType.GET,
        "/api/v1/teacher-type",
        null,
        null,
        teacher_type_uuid,
        {Authorization: `Bearer ${GetAuthorizationToken()}`},
    )
}

export {
    GetTeacherTypeListAPI,
    GetTeacherTypeSimpleListAPI,
    GetTeacherTypeInfoByTypeUuidAPI
}