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
import { GradeEntity } from "../models/entity/grade_entity";
import { PageGradeSearchDTO } from "../models/dto/page/page_grade_search_dto";
import { GradeDTO } from "../models/dto/grade_dto";

/**
 * # 获取年级分页列表
 * > 获取年级分页列表, 支持分页搜索, 支持排序, 支持关键词搜索
 * 
 * @param data 分页搜索数据
 * @returns 分页列表
 */
const GetGradePageAPI = async (data: PageGradeSearchDTO): Promise<BaseResponse<PageEntity<GradeEntity>> | undefined> => {
    return BaseApi<BaseResponse<PageEntity<GradeEntity>>>(
        MethodType.GET,
        "/api/v1/grade/page",
        null,
        data,
        null,
        { "Authorization": `Bearer ${GetAuthorizationToken()}` }
    )
}

/**
 * # 获取年级列表
 * > 获取简单年级列表，不分页
 * 
 * @returns 年级列表
 */
const GetGradeListAPI = async (): Promise<BaseResponse<GradeEntity[]> | undefined> => {
    return BaseApi<BaseResponse<GradeEntity[]>>(
        MethodType.GET,
        "/api/v1/grade/list",
        null,
        null,
        null,
        { "Authorization": `Bearer ${GetAuthorizationToken()}` }
    )
}

/**
 * # 获取年级信息
 * > 根据年级UUID获取年级信息
 * 
 * @param grade_uuid 年级UUID
 * @returns 年级信息
 */
const GetGradeAPI = async (grade_uuid: string): Promise<BaseResponse<GradeEntity> | undefined> => {
    return BaseApi<BaseResponse<GradeEntity>>(
        MethodType.GET,
        `/api/v1/grade/`,
        null,
        null,
        grade_uuid,
        { "Authorization": `Bearer ${GetAuthorizationToken()}` }
    )
}

/**
 * # 添加年级
 * > 添加新年级信息
 * 
 * @param data 年级数据
 * @returns 添加结果
 */
const CreateGradeAPI = async (data: GradeDTO): Promise<BaseResponse<void> | undefined> => {
    return BaseApi<BaseResponse<void>>(
        MethodType.POST,
        `/api/v1/grade/`,
        data,
        null,
        null,
        { "Authorization": `Bearer ${GetAuthorizationToken()}` }
    )
}

/**
 * # 编辑年级
 * > 编辑年级信息
 * 
 * @param grade_uuid 年级UUID
 * @param data 年级数据
 * @returns 编辑结果
 */
const UpdateGradeAPI = async (grade_uuid: string, data: GradeDTO): Promise<BaseResponse<void> | undefined> => {
    return BaseApi<BaseResponse<void>>(
        MethodType.PUT,
        `/api/v1/grade/`,
        data,
        null,
        grade_uuid,
        { "Authorization": `Bearer ${GetAuthorizationToken()}` }
    )
}

/**
 * # 删除年级
 * > 删除年级信息
 * 
 * @param grade_uuid 年级UUID
 * @returns 删除结果
 */
const DeleteGradeAPI = async (grade_uuid: string): Promise<BaseResponse<void> | undefined> => {
    return BaseApi<BaseResponse<void>>(
        MethodType.DELETE,
        `/api/v1/grade/`,
        null,
        null,
        grade_uuid,
        { "Authorization": `Bearer ${GetAuthorizationToken()}` }
    )
}

export {
    GetGradePageAPI,
    GetGradeListAPI,
    GetGradeAPI,
    CreateGradeAPI,
    UpdateGradeAPI,
    DeleteGradeAPI
}; 