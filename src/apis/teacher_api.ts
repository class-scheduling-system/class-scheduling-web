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
import {BaseApi, GetAuthorizationToken, MethodType} from "../assets/ts/base_api.ts";
import {PageEntity} from "../models/entity/page_entity.ts";
import {TeacherEntity} from "../models/entity/teacher_entity.ts";
import {PageTeacherSearchDTO} from "../models/dto/page/page_teacher_search_dto.ts";
import {TeacherDTO} from "../models/dto/teacher_dto.ts";

/**
 * # 获取教师列表
 * > 该函数用于通过API请求获取教师列表。它利用了Bearer令牌认证方式来确保安全地访问教师数据。
 *
 * @returns {Promise<BaseResponse<Page<TeacherEntity>> | undefined>} - 返回一个Promise，解析为包含教师信息的BaseResponse对象或undefined，如果请求失败或没有有效响应。
 * @throws {Error} 当网络请求过程中遇到问题时抛出异常。
 */
const GetTeacherListAPI = async (data:PageTeacherSearchDTO):Promise<BaseResponse<PageEntity<TeacherEntity>>  | undefined> => {
    return BaseApi<PageEntity<TeacherEntity>>(
        MethodType.GET,
        "/api/v1/teacher/page",
        null,
        data,
        null,
        {Authorization: `Bearer ${GetAuthorizationToken()}`},
    )
}


/**
 * # 增加教师
 * > 该函数用于通过API请求添加教师。它利用了Bearer令牌认证方式来确保安全地访问教师数据。
 *
 * @returns {Promise<BaseResponse<UserInfoEntity> | undefined>} - 返回一个Promise，解析为包含教师信息的BaseResponse对象或undefined，如果请求失败或没有有效响应。
 * @throws {Error} 当网络请求过程中遇到问题时抛出异常。
 */
const AddTeacherAPI = async (data:TeacherDTO): Promise<BaseResponse<TeacherEntity> | undefined> => {
    return BaseApi<TeacherEntity>(
        MethodType.POST,
        "/api/v1/teacher",
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
 * # 删除教师
 * > 该函数用于通过API请求删除教师。它利用了Bearer令牌认证方式来确保安全地访问教师数据。
 *
 * @returns {Promise<BaseResponse<UserInfoEntity> | undefined>} - 返回一个Promise，解析为包含教师信息的BaseResponse对象或undefined，如果请求失败或没有有效响应。
 * @throws {Error} 当网络请求过程中遇到问题时抛出异常。
 */
const DeleteTeacherAPI = async (teacher_uuid: string): Promise<BaseResponse<TeacherEntity> | undefined> => {
    return BaseApi<TeacherEntity>(
        MethodType.DELETE,
        "/api/v1/teacher/",
        null,
        null,
        teacher_uuid,
        { Authorization: `Bearer ${GetAuthorizationToken()}` }
    );
};



/**
 * # 编辑教师
 * > 该函数用于通过API请求编辑教师。它利用了Bearer令牌认证方式来确保安全地访问教师数据。
 *
 * @returns {Promise<BaseResponse<TeacherEntity> | undefined>} - 返回一个Promise，解析为包含教师信息的BaseResponse对象或undefined，如果请求失败或没有有效响应。
 * @throws {Error} 当网络请求过程中遇到问题时抛出异常。
 */
const EditTeacherAPI = async (teacher_uuid: string, data: TeacherDTO): Promise<BaseResponse<TeacherEntity> | undefined> => {
    return BaseApi<TeacherEntity>(
        MethodType.PUT,
        `/api/v1/teacher`,
        data,
        null,
        teacher_uuid,
        {
            Authorization: `Bearer ${GetAuthorizationToken()}`,
            "Content-Type": "application/json"
        }
    );
};

export{
    GetTeacherListAPI,
    AddTeacherAPI,
    DeleteTeacherAPI,
    EditTeacherAPI
}