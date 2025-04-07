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
import { AdministrativeClassEntity } from "../models/entity/administrative_class_entity";
import { AdministrativeClassDTO } from "../models/dto/administrative_class_dto";
import { PageEntity } from "../models/entity/page_entity";
import { PageAdministrativeClassDTO } from "../models/dto/page/page_administrative_class_dto";

/**
 * # 创建行政班级
 * > 本接口通过POST请求接收一个AdministrativeClassDTO对象,用于创建新的行政班级信息.
 *
 * @param administrativeClassDTO 新行政班级的详细信息
 * @returns 创建的行政班级信息
 */
const CreateAdministrativeClassAPI = async (
    administrativeClassDTO: AdministrativeClassDTO
): Promise<BaseResponse<AdministrativeClassEntity> | undefined> => {
    return BaseApi<BaseResponse<AdministrativeClassEntity>>(
        MethodType.POST,
        "/api/v1/administrative-class",
        administrativeClassDTO,
        null,
        null,
        {"Authorization": `Bearer ${GetAuthorizationToken()}`},
    );
}

/**
 * # 修改行政班级
 * > 本接口通过PUT请求编辑已有行政班级信息.
 *
 * @param administrativeClassUuid 行政班级UUID
 * @param administrativeClassDTO 修改后的行政班级详细信息
 * @returns 修改后的行政班级信息
 */
const UpdateAdministrativeClassAPI = async (
    administrativeClassUuid: string,
    administrativeClassDTO: AdministrativeClassDTO
): Promise<BaseResponse<AdministrativeClassEntity> | undefined> => {
    return BaseApi<BaseResponse<AdministrativeClassEntity>>(
        MethodType.PUT,
        "/api/v1/administrative-class",
        administrativeClassDTO,
        null,
        administrativeClassUuid,
        {"Authorization": `Bearer ${GetAuthorizationToken()}`},
    );
}

/**
 * # 删除行政班级
 * > 本接口通过DELETE请求删除指定的行政班级信息.
 *
 * @param administrativeClassUuid 行政班级UUID
 * @returns 操作结果
 */
const DeleteAdministrativeClassAPI = async (
    administrativeClassUuid: string
): Promise<BaseResponse<void> | undefined> => {
    return BaseApi<BaseResponse<void>>(
        MethodType.DELETE,
        "/api/v1/administrative-class",
        null,
        null,
        administrativeClassUuid,
        {"Authorization": `Bearer ${GetAuthorizationToken()}`},
    );
}

/**
 * # 查询行政班级
 * > 本接口根据行政班级的UUID查询行政班级信息.
 *
 * @param administrativeClassUuid 行政班级UUID
 * @returns 行政班级详细信息
 */
const GetAdministrativeClassInfoAPI = async (
    administrativeClassUuid: string
): Promise<BaseResponse<AdministrativeClassEntity> | undefined> => {
    return BaseApi<BaseResponse<AdministrativeClassEntity>>(
        MethodType.GET,
        "/api/v1/administrative-class",
        null,
        null,
        administrativeClassUuid,
        {"Authorization": `Bearer ${GetAuthorizationToken()}`},
    );
}

/**
 * # 获取行政班级列表(管理员)
 * > 此接口允许管理员根据分页参数和可选的排序、部门、专业和名称筛选条件来获取行政班级信息列表.
 *
 * @param page 页码
 * @param size 每页数量
 * @param isDesc 是否降序，默认为true
 * @param departmentUuid 部门UUID(可选)
 * @param majorUuid 专业UUID(可选)
 * @param name 行政班级名称(可选)
 * @returns 行政班级分页列表
 */
const GetAdministrativeClassListAdminAPI = async (param: PageAdministrativeClassDTO): Promise<BaseResponse<PageEntity<AdministrativeClassEntity>> | undefined> => {
    return BaseApi<BaseResponse<PageEntity<AdministrativeClassEntity>>>(
        MethodType.GET,
        "/api/v1/administrative-class/list/admin",
        null,
        param,
        null,
        {"Authorization": `Bearer ${GetAuthorizationToken()}`},
    );
}

/**
 * # 获取行政班级列表(教务)
 * > 该接口用于分页查询行政班级信息，支持按部门UUID、专业UUID和班级名称进行筛选.
 *
 * @param page 页码
 * @param size 每页数量
 * @param isDesc 是否降序，默认为true
 * @param departmentUuid 部门UUID(可选)
 * @param majorUuid 专业UUID(可选)
 * @param name 行政班级名称(可选)
 * @returns 行政班级分页列表
 */
const GetAdministrativeClassListAcademicAPI = async (param: PageAdministrativeClassDTO): Promise<BaseResponse<PageEntity<AdministrativeClassEntity>> | undefined> => {
    return BaseApi<BaseResponse<PageEntity<AdministrativeClassEntity>>>(
        MethodType.GET,
        "/api/v1/administrative-class/list/academic",
        null,
        param,
        null,
        {"Authorization": `Bearer ${GetAuthorizationToken()}`},
    );
}

/**
 * # 获取行政班级列表(学生)
 * > 该接口用于学生用户获取行政班级列表,支持分页查询和排序.
 *
 * @param page 页码
 * @param size 每页数量
 * @param isDesc 是否降序，默认为true
 * @param departmentUuid 部门UUID(可选)
 * @param majorUuid 专业UUID(可选)
 * @param name 行政班级名称(可选)
 * @returns 行政班级分页列表
 */
const GetAdministrativeClassListStudentAPI = async (param: PageAdministrativeClassDTO): Promise<BaseResponse<PageEntity<AdministrativeClassEntity>> | undefined> => {
    return BaseApi<BaseResponse<PageEntity<AdministrativeClassEntity>>>(
        MethodType.GET,
        "/api/v1/administrative-class/list/student",
        null,
        param,
        null,
        {"Authorization": `Bearer ${GetAuthorizationToken()}`},
    );
}

/**
 * # 获取所有行政班级列表(不分页)
 * > 该接口用于获取所有行政班级的简单列表，常用于下拉选择框等场景.
 *
 * @returns 所有行政班级列表
 */
const GetAllAdministrativeClassListAPI = async (): Promise<BaseResponse<AdministrativeClassEntity[]> | undefined> => {
    return BaseApi<BaseResponse<AdministrativeClassEntity[]>>(
        MethodType.GET,
        "/api/v1/administrative-class/list/all",
        null,
        null,
        null,
        {"Authorization": `Bearer ${GetAuthorizationToken()}`},
    );
}

export {
    CreateAdministrativeClassAPI,
    UpdateAdministrativeClassAPI,
    DeleteAdministrativeClassAPI,
    GetAdministrativeClassInfoAPI,
    GetAdministrativeClassListAdminAPI,
    GetAdministrativeClassListAcademicAPI,
    GetAdministrativeClassListStudentAPI,
    GetAllAdministrativeClassListAPI
}; 