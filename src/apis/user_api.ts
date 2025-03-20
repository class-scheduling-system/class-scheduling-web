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

import {BaseApi, GetAuthorizationToken, MethodType} from "../assets/ts/base_api.ts";
import {BaseResponse} from "../models/base_response.ts";
import {UserInfoEntity} from "../models/entity/user_info_entity.ts";
import {PageSearchDTO} from "../models/dto/page_search_dto.ts";
import {PageEntity} from "../models/entity/page_entity.ts";

/**
 * # 获取当前用户信息
 * > 该函数用于通过API请求获取当前登录用户的信息。它利用了Bearer令牌认证方式来确保安全地访问用户数据。
 *
 * @returns {Promise<BaseResponse<UserInfoEntity> | undefined>} - 返回一个Promise，解析为包含用户信息的BaseResponse对象或undefined，如果请求失败或没有有效响应。
 * @throws {Error} 当网络请求过程中遇到问题时抛出异常。
 */
const GetCurrentUserAPI = async (): Promise<BaseResponse<UserInfoEntity> | undefined> => {
    return BaseApi<UserInfoEntity>(
        MethodType.GET,
        "/api/v1/user/current",
        null,
        null,
        null,
        {Authorization: `Bearer ${GetAuthorizationToken()}`},
    )
}

/**
 * # 获取用户信息
 * > 该函数用于通过API请求获取用户的信息。它利用了Bearer令牌认证方式来确保安全地访问用户数据。
 *
 * @returns {Promise<BaseResponse<UserInfoEntity> | undefined>} - 返回一个Promise，解析为包含用户信息的BaseResponse对象或undefined，如果请求失败或没有有效响应。
 * @throws {Error} 当网络请求过程中遇到问题时抛出异常。
 */
const GetUserInfoAPI = async (user_uuid: string): Promise<BaseResponse<UserInfoEntity> | undefined> => {
    return BaseApi<UserInfoEntity>(
        MethodType.GET,
        "/api/v1/user",
        null,
        null,
        user_uuid,
        {Authorization: `Bearer ${GetAuthorizationToken()}`},
    )
}



/**
 * # 获取用户列表
 * > 该函数用于通过API请求获取用户列表。它利用了Bearer令牌认证方式来确保安全地访问用户数据。
 *
 * @returns {Promise<BaseResponse<UserInfoEntity> | undefined>} - 返回一个Promise，解析为包含用户信息的BaseResponse对象或undefined，如果请求失败或没有有效响应。
 * @throws {Error} 当网络请求过程中遇到问题时抛出异常。
 */
const GetUserListAPI = async (data: PageSearchDTO): Promise<BaseResponse<PageEntity<UserInfoEntity>> | undefined> => {
    return BaseApi<PageEntity<UserInfoEntity>>(
        MethodType.GET,
        "/api/v1/user/list",
        null,
        data,
        null,
        {Authorization: `Bearer ${GetAuthorizationToken()}`},
    )
}



/**
 * # 增加用户
 * > 该函数用于通过API请求添加用户。它利用了Bearer令牌认证方式来确保安全地访问用户数据。
 *
 * @returns {Promise<BaseResponse<UserInfoEntity> | undefined>} - 返回一个Promise，解析为包含用户信息的BaseResponse对象或undefined，如果请求失败或没有有效响应。
 * @throws {Error} 当网络请求过程中遇到问题时抛出异常。
 */
const AddUserAPI = async (data: {
    role_uuid: string;
    name: string;
    password?: string;
    email: string;
    phone: string;
    permission?: string[];
}): Promise<BaseResponse<UserInfoEntity> | undefined> => {
    return BaseApi<UserInfoEntity>(
        MethodType.POST,
        "/api/v1/user",
        data,
        null,
        null,
        {
            Authorization: `Bearer ${GetAuthorizationToken()}`,
            "Content-Type": "application/json"
        }
    );
};



/**
 * # 删除用户
 * > 该函数用于通过API请求删除用户。它利用了Bearer令牌认证方式来确保安全地访问用户数据。
 *
 * @returns {Promise<BaseResponse<UserInfoEntity> | undefined>} - 返回一个Promise，解析为包含用户信息的BaseResponse对象或undefined，如果请求失败或没有有效响应。
 * @throws {Error} 当网络请求过程中遇到问题时抛出异常。
 */
const DeleteUserAPI = async (user_uuid: string): Promise<BaseResponse<UserInfoEntity> | undefined> => {
    return BaseApi<UserInfoEntity>(
        MethodType.DELETE,
        "/api/v1/user",
        null,
        null,
        user_uuid,
        { Authorization: `Bearer ${GetAuthorizationToken()}` }
    );
};


/**
 * # 编辑用户
 * > 该函数用于通过API请求编辑用户。它利用了Bearer令牌认证方式来确保安全地访问用户数据。
 *
 * @returns {Promise<BaseResponse<UserInfoEntity> | undefined>} - 返回一个Promise，解析为包含用户信息的BaseResponse对象或undefined，如果请求失败或没有有效响应。
 * @throws {Error} 当网络请求过程中遇到问题时抛出异常。
 */
const EditUserAPI = async (user_uuid: string, data: {
    name?: string;
    password?: string;
    email?: string;
    phone?: string;
    status?: number;
    ban?: boolean;
    role_uuid?: string;
    permission?: string[];
}): Promise<BaseResponse<UserInfoEntity> | undefined> => {
    return BaseApi<UserInfoEntity>(
        MethodType.PUT,  // 🔹 使用 PUT 方法
        `/api/v1/user`,  // 🔹 直接拼接 user_uuid
        data,
        null,  // 无 query 参数
        user_uuid,  // 无 path 参数
        {
            Authorization: `Bearer ${GetAuthorizationToken()}`,
            "Content-Type": "application/json"
        }
    );
};


export {
    GetCurrentUserAPI,
    GetUserInfoAPI,
    GetUserListAPI,
    AddUserAPI,
    DeleteUserAPI,
    EditUserAPI,
}
