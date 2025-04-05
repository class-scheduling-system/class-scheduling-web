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
import {FileEntity} from "../models/entity/file_entity.ts";
import {BatchImportResponseDTO} from "@/models/dto/building/batch_import_response_dto.ts";


/**
 * # 获取教师列表
 * > 该函数用于通过API请求获取教师列表。它利用了Bearer令牌认证方式来确保安全地访问教师数据。
 *
 * @returns {Promise<BaseResponse<Page<TeacherEntity>> | undefined>} - 返回一个Promise，解析为包含教师信息的BaseResponse对象或undefined，如果请求失败或没有有效响应。
 * @throws {Error} 当网络请求过程中遇到问题时抛出异常。
 */
const GetTeacherListAPI = async (data:PageTeacherSearchDTO):Promise<BaseResponse<PageEntity<TeacherEntity>>  | undefined> => {
    return BaseApi<BaseResponse<PageEntity<TeacherEntity>>>(
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
    return BaseApi<BaseResponse<TeacherEntity>>(
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
    return BaseApi<BaseResponse<TeacherEntity>>(
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
    return BaseApi<BaseResponse<TeacherEntity>>(
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


/**
 * # GetTeacherTemplateAPI
 * > 该函数用于获取教师导入模板。它会返回一个 Excel 文件的二进制数据，特别适用于管理员角色。
 * > 后端接口使用了 RequestRole 注解来限制只有具有"管理员"角色的用户才能访问此端点。
 * > 返回的响应将是一个包含模板文件的响应实体，设置为附件形式，文件名为"教师导入模板.xlsx"
 *
 * @returns {Promise<BaseResponse<FileEntity> | undefined>} - 如果操作成功，则返回一个包含文件实体的 BaseResponse；若请求失败或遇到错误，则可能返回 undefined。
 */
const GetTeacherTemplateAPI = async (): Promise<BaseResponse<FileEntity> | undefined> => {
    return BaseApi<BaseResponse<FileEntity>>(
        MethodType.GET,
        "/api/v1/teacher/get-template",
        null,
        null,
        null,
        {"Authorization": `Bearer ${GetAuthorizationToken()}`}
    );
}


/**
 * # BatchImportTeacherAPI
 * > 该函数用于批量导入教师信息。它接受一个包含教师信息的 Excel 文件的 base64 字符串，并将其发送到指定的后端接口进行处理。
 *
 * @param {string} base64Content - Excel 文件的 base64 编码内容。
 * @param {boolean} ignoreError - 是否忽略错误继续导入。
 * @returns {Promise<BaseResponse<BatchImportResponseDTO> | undefined>} - 如果操作成功，则返回一个包含导入结果的 BaseResponse 对象；若请求失败或遇到错误，则可能返回 undefined。
 */
const BatchImportTeacherAPI = async (base64Content: string, ignoreError: boolean): Promise<BaseResponse<BatchImportResponseDTO> | undefined> => {
    return BaseApi<BaseResponse<BatchImportResponseDTO>>(
        MethodType.POST,
        "/api/v1/teacher/batch-import",
        {
            file: base64Content,
            ignore_error: ignoreError
        },
        null,
        null,
        {"Authorization": `Bearer ${GetAuthorizationToken()}`}
    );
}


export{
    GetTeacherListAPI,
    AddTeacherAPI,
    DeleteTeacherAPI,
    EditTeacherAPI,
    GetTeacherTemplateAPI,
    BatchImportTeacherAPI
}