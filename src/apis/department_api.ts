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
import {DepartmentDTO} from "../models/dto/department_dto.ts";
import {BaseResponse} from "../models/base_response.ts";
import {DepartmentEntity} from "../models/entity/department_entity.ts";
import {PageEntity} from "../models/entity/page_entity.ts";
import {PageSearchDTO} from "../models/dto/page_search_dto.ts";

/**
 * # 根据部门id获取部门信息
 * > 该函数用于通过API请求获取部门信息。它利用了Bearer令牌认证方式来确保安全地访问用户数据。
 *
 * @param {string} department_uuid - 部门的唯一标识符
 * @returns {Promise<BaseResponse<DepartmentEntity> | undefined>} - 返回一个Promise，解析为包含部门信息的BaseResponse对象或undefined，如果请求失败或没有有效响应。
 * @throws {Error} 当网络请求过程中遇到问题时抛出异常。
 */
const GetDepartmentInfoAPI = async (department_uuid: string): Promise<BaseResponse<DepartmentEntity> | undefined> => {
    return BaseApi<DepartmentEntity>(
        MethodType.GET,
        "/api/v1/department",
        null,
        null,
        department_uuid,
        {Authorization: `Bearer ${GetAuthorizationToken()}`},
    )
}

/**
 * # DeleteDepartmentAPI
 * > 该函数用于通过API删除指定部门的详细信息。它接受一个包含部门唯一标识符的字符串，并将其发送到指定的后端接口，以删除部门的详细信息。
 *
 * @param data - 包含待删除部门的唯一标识符的字符串。
 * @return 如果操作成功，则返回一个BaseResponse对象，其中包含具体的部门数据；若请求失败或遇到错误，则可能返回undefined。
 */
const DeleteDepartmentAPI = async (data: string): Promise<BaseResponse<void> | undefined> => {
    return BaseApi<void>(
        MethodType.DELETE,
        "/api/v1/department/",
        null,
        null,
        data,
        {"Authorization": `Bearer ${GetAuthorizationToken()}`}
    );
}


/**
 * # 获取部门简洁列表
 * > 该函数用于通过API请求获取部门简洁列表。它利用了Bearer令牌认证方式来确保安全地访问部门数据。
 *
 * @returns {Promise<BaseResponse<DepartmentEntity> | undefined>} - 返回一个Promise，解析为包含部门简洁列表的BaseResponse对象或undefined，如果请求失败或没有有效响应。
 * @throws {Error} 当网络请求过程中遇到问题时抛出异常。
 */
const GetDepartmentSimpleListAPI = async (): Promise<BaseResponse<DepartmentEntity> | undefined> => {
    return BaseApi<DepartmentEntity>(
        MethodType.GET,
        "/api/v1/department/list",
        null,
        null,
        null,
        {Authorization: `Bearer ${GetAuthorizationToken()}`},
    )
}

/**
 * # DepartmentAddAPI
 * > 该函数用于向后端API发送一个部门添加请求，包含了需要验证的部门信息。
 *
 * @param data - 包含需要验证的部门信息的对象。
 * @return 如果操作成功，则返回一个BaseResponse对象，其中包含具体的部门数据；若请求失败或遇到错误，则可能返回undefined。
 */
const DepartmentAddAPI = async (data: DepartmentDTO): Promise<BaseResponse<DepartmentEntity> | undefined> => {
    return BaseApi<DepartmentEntity>(
        MethodType.POST,
        "/api/v1/department",
        data,
        null,
        null,
        {"Authorization": `Bearer ${GetAuthorizationToken()}`}
    );
}

/**
 * # GetDepartmentAPI
 * > 该函数用于通过API获取指定部门的详细信息。它接受一个包含部门唯一标识符的字符串，并将其发送到指定的后端接口，以获取部门的详细信息。
 *
 * @param data - 包含待获取部门的唯一标识符的字符串。
 * @return 如果操作成功，则返回一个BaseResponse对象，其中包含具体的部门数据；若请求失败或遇到错误，则可能返回undefined。
 */
const GetDepartmentAPI = async (data: string): Promise<BaseResponse<DepartmentEntity> | undefined> => {
    return BaseApi<DepartmentEntity>(
        MethodType.GET,
        "/api/v1/department/",
        null,
        null,
        data,
        {"Authorization": `Bearer ${GetAuthorizationToken()}`}
    );
}

/**
 * # EditDepartmentAPI
 * > 该函数用于通过API向系统中更新指定的部门信息。它接受一个包含更新后部门详细数据的对象，并将其发送到指定的后端接口，以完成数据的持久化存储。
 *
 * @param uuid - 包含待更新部门的唯一标识符的字符串。
 * @param data - 包含待更新部门的所有必要信息的数据传输对象。
 * @return 如果操作成功，则返回一个BaseResponse对象，其中包含具体的结果数据；若请求失败或遇到错误，则可能返回undefined。
 */
const EditDepartmentAPI = async (uuid: string, data: DepartmentDTO): Promise<BaseResponse<DepartmentEntity> | undefined> => {
    return BaseApi<DepartmentEntity>(
        MethodType.PUT,
        "/api/v1/department/",
        data,
        null,
        uuid,
        {"Authorization": `Bearer ${GetAuthorizationToken()}`}
    );
}

/**
 * # GetDepartmentPageAPI
 * > 该函数用于通过API获取部门分页信息。它接受一个包含分页信息的对象，并将其发送到指定的后端接口，以获取部门的分页信息。
 *
 * @param data - 包含分页信息的对象。
 * @return 如果操作成功，则返回一个BaseResponse对象，其中包含具体的部门分页数据；若请求失败或遇到错误，则可能返回undefined。
 */
const GetDepartmentPageAPI = async (data: PageSearchDTO): Promise<BaseResponse<PageEntity<DepartmentEntity>> | undefined> => {
    return BaseApi<PageEntity<DepartmentEntity>>(
        MethodType.GET,
        "/api/v1/department/page",
        null,
        data,
        null,
        {"Authorization": `Bearer ${GetAuthorizationToken()}`}
    );
}

/**
 * # GetDepartmentListAPI
 * > 该函数用于通过API获取部门列表信息。它将发送请求到指定的后端接口，以获取部门的列表信息。
 *
 * @return 如果操作成功，则返回一个BaseResponse对象，其中包含具体的部门列表数据；若请求失败或遇到错误，则可能返回undefined。
 */
const GetDepartmentListAPI = async (): Promise<BaseResponse<DepartmentEntity[]> | undefined> => {
    return BaseApi<DepartmentEntity[]>(
        MethodType.GET,
        "/api/v1/department/list",
        null,
        null,
        null,
        {"Authorization": `Bearer ${GetAuthorizationToken()}`}
    );
}

export {
    GetDepartmentInfoAPI,
    GetDepartmentListAPI,
    GetDepartmentSimpleListAPI,
    DepartmentAddAPI,
    GetDepartmentAPI,
    DeleteDepartmentAPI,
    EditDepartmentAPI,
    GetDepartmentPageAPI,
}


