/*
 * --------------------------------------------------------------------------------
 * Copyright (c) 2022-NOW(至今) 锋楪技术团队
 * Author: 锋楪技术团队 (https://www.frontleaves.com)
 *
 * 本文件包含锋楪技术团队项目的源代码，项目的所有源代码均遵循 MIT 开源许可证协议。
 * --------------------------------------------------------------------------------
 */

import { BaseApi, GetAuthorizationToken, MethodType } from "../assets/ts/base_api";
import { BaseResponse } from "../models/base_response";
import { PageEntity } from "../models/entity/page_entity";
import { SemesterEntity } from "../models/entity/semester_entity";
import { PageSemesterSearchDTO } from "../models/dto/page/page_semester_search_dto";
import { SemesterDTO } from "../models/dto/semester_dto";

/**
 * # 获取学期分页列表
 * > 获取学期分页列表, 支持分页搜索, 支持排序, 支持关键词搜索
 * 
 * @param data 分页搜索数据
 * @returns 分页列表
 */
const GetSemesterPageAPI = async (data: PageSemesterSearchDTO): Promise<BaseResponse<PageEntity<SemesterEntity>> | undefined> => {
    return BaseApi<BaseResponse<PageEntity<SemesterEntity>>>(
        MethodType.GET,
        "/api/v1/semester/page",
        null,
        data,
        null,
        { "Authorization": `Bearer ${GetAuthorizationToken()}` }
    )
}

/**
 * # 获取学期列表
 * > 获取启用的学期列表
 * 
 * @returns 学期列表
 */
const GetSemesterListAPI = async (): Promise<BaseResponse<SemesterEntity[]> | undefined> => {
    return BaseApi<BaseResponse<SemesterEntity[]>>(
        MethodType.GET,
        "/api/v1/semester/list",
        null,
        null,
        null,
        { "Authorization": `Bearer ${GetAuthorizationToken()}` }
    )
}

/**
 * # 获取学期信息
 * > 根据学期UUID获取学期信息
 * 
 * @param semester_uuid 学期UUID
 * @returns 学期信息
 */
const GetSemesterAPI = async (semester_uuid: string): Promise<BaseResponse<SemesterEntity> | undefined> => {
    return BaseApi<BaseResponse<SemesterEntity>>(
        MethodType.GET,
        `/api/v1/semester/`,
        null,
        null,
        semester_uuid,
        { "Authorization": `Bearer ${GetAuthorizationToken()}` }
    )
}

/**
 * # 添加学期
 * > 添加新学期信息
 * 
 * @param data 学期数据
 * @returns 添加结果
 */
const CreateSemesterAPI = async (data: SemesterDTO): Promise<BaseResponse<void> | undefined> => {
    return BaseApi<BaseResponse<void>>(
        MethodType.POST,
        `/api/v1/semester/`,
        data,
        null,
        null,
        { "Authorization": `Bearer ${GetAuthorizationToken()}` }
    )
}

/**
 * # 编辑学期
 * > 编辑学期信息
 * 
 * @param semester_uuid 学期UUID
 * @param data 学期数据
 * @returns 编辑结果
 */
const UpdateSemesterAPI = async (semester_uuid: string, data: SemesterDTO): Promise<BaseResponse<void> | undefined> => {
    return BaseApi<BaseResponse<void>>(
        MethodType.PUT,
        `/api/v1/semester/`,
        data,
        null,
        semester_uuid,
        { "Authorization": `Bearer ${GetAuthorizationToken()}` }
    )
}

/**
 * # 删除学期
 * > 删除学期信息
 * 
 * @param semester_uuid 学期UUID
 * @returns 删除结果
 */
const DeleteSemesterAPI = async (semester_uuid: string): Promise<BaseResponse<void> | undefined> => {
    return BaseApi<BaseResponse<void>>(
        MethodType.DELETE,
        `/api/v1/semester/`,
        null,
        null,
        semester_uuid,
        { "Authorization": `Bearer ${GetAuthorizationToken()}` }
    )
}

export {
    GetSemesterPageAPI,
    GetSemesterListAPI,
    GetSemesterAPI,
    CreateSemesterAPI,
    UpdateSemesterAPI,
    DeleteSemesterAPI
}; 