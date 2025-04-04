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

import {ListOfCampusEntity} from "../models/entity/list_of_campus_entity.ts";
import {BaseResponse} from "../models/base_response.ts";
import {BaseApi, GetAuthorizationToken, MethodType} from "../assets/ts/base_api.ts";
import {PageEntity} from "../models/entity/page_entity.ts";
import {CampusEntity} from "../models/entity/campus_entity.ts";
import {PageSearchDTO} from "../models/dto/page/page_search_dto.ts";
import {CampusDTO} from "../models/dto/campus_dto.ts";

/**
 * # GetCampusListAPI
 * > 该函数用于从服务器获取校园列表。通过发送一个GET请求到指定的API端点，返回校园列表数据。
 *
 * @returns {Promise<BaseResponse<ListOfCampusEntity[]> | undefined>} - 返回包含校园列表的BaseResponse对象或undefined。
 * @throws {Error} - 如果请求过程中出现网络错误或者服务器响应异常时抛出。
 */
const GetCampusListAPI = async (): Promise<BaseResponse<ListOfCampusEntity[]> | undefined> => {
    return BaseApi<BaseResponse<ListOfCampusEntity[]>>(
        MethodType.GET,
        "/api/v1/campus/list",
        null,
        null,
        null,
        {"Authorization": `Bearer ${GetAuthorizationToken()}`}
    );
}


/**
 * # GetCampusPageListAPI
 * > 该函数用于从服务器获取校园分页列表。通过发送一个GET请求到指定的API端点，返回校园列表数据。
 *
 * @returns Promise<BaseResponse<PageEntity<CampusEntity>> | undefined>  - 返回包含校园分页列表的BaseResponse对象或undefined。
 * @throws {Error} - 如果请求过程中出现网络错误或者服务器响应异常时抛出。
 */
const GetCampusPageListAPI = async (data: PageSearchDTO): Promise<BaseResponse<PageEntity<CampusEntity>> | undefined> => {
    return BaseApi<BaseResponse<PageEntity<CampusEntity>>>(
        MethodType.GET,
        "/api/v1/campus/page",
        null,
        data,
        null,
        {"Authorization": `Bearer ${GetAuthorizationToken()}`}
    );
}


/**
 * # 增加校园
 * > 该函数用于通过API请求添加校园。它利用了Bearer令牌认证方式来确保安全地访问校园数据。
 *
 * @returns {Promise<BaseResponse<CampusEntity> | undefined>} - 返回一个Promise，解析为包含校园信息的BaseResponse对象或undefined，如果请求失败或没有有效响应。
 * @throws {Error} 当网络请求过程中遇到问题时抛出异常。
 */
const AddCampusAPI = async (data: CampusDTO): Promise<BaseResponse<CampusEntity> | undefined> => {
    return BaseApi<BaseResponse<CampusEntity>>(
        MethodType.POST,
        "/api/v1/campus",
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
 * # 删除校园
 * > 该函数用于通过API请求删除校园。它利用了Bearer令牌认证方式来确保安全地访问校园数据。
 *
 * @returns {Promise<BaseResponse<CampusEntity> | undefined>} - 返回一个Promise，解析为包含校园信息的BaseResponse对象或undefined，如果请求失败或没有有效响应。
 * @throws {Error} 当网络请求过程中遇到问题时抛出异常。
 */
const DeleteCampusAPI = async (campus_uuid: string): Promise<BaseResponse<CampusEntity> | undefined> => {
    return BaseApi<BaseResponse<CampusEntity>>(
        MethodType.DELETE,
        "/api/v1/campus",
        null,
        null,
        campus_uuid,
        { Authorization: `Bearer ${GetAuthorizationToken()}` }
    );
};


/**
 * # 编辑校园
 * > 该函数用于通过API请求编辑校园。它利用了Bearer令牌认证方式来确保安全地访问校园数据。
 *
 * @returns {Promise<BaseResponse<CampusEntity> | undefined>} - 返回一个Promise，解析为包含校园信息的BaseResponse对象或undefined，如果请求失败或没有有效响应。
 * @throws {Error} 当网络请求过程中遇到问题时抛出异常。
 */
const EditCampusAPI = async (campus_uuid: string, data: CampusDTO): Promise<BaseResponse<CampusEntity> | undefined> => {
    return BaseApi<BaseResponse<CampusEntity>>(
        MethodType.PUT,
        `/api/v1/campus`,
        data,
        null,
        campus_uuid,
        {
            Authorization: `Bearer ${GetAuthorizationToken()}`,
            "Content-Type": "application/json"
        }
    );
};

export {
    GetCampusListAPI,
    GetCampusPageListAPI,
    AddCampusAPI,
    DeleteCampusAPI,
    EditCampusAPI
}
