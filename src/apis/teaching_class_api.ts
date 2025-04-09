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
import {PageEntity} from "../models/entity/page_entity.ts";
import {TeachingClassDTO} from "../models/dto/teaching_class_dto.ts";
import {TeachingClassEntity, TeachingClassLiteEntity} from "../models/entity/teaching_class_entity.ts";
import {PageTeachingClassDTO} from "../models/dto/page/page_teaching_class_dto.ts";

/**
 * # 分页获取教学班列表
 * > 根据查询参数获取教学班列表，支持分页、关键字搜索、按部门和学期筛选等功能
 * 
 * @param params 查询参数，包含页码、每页大小、关键字、部门UUID、学期UUID和排序方式
 * @returns 教学班分页列表
 */
const GetTeachingClassPageAPI = async (params: PageTeachingClassDTO): Promise<BaseResponse<PageEntity<TeachingClassLiteEntity>> | undefined> => {
    return BaseApi<BaseResponse<PageEntity<TeachingClassLiteEntity>>>(
        MethodType.GET,
        "/api/v1/teaching-class",
        null,
        params,
        null,
        {"Authorization": `Bearer ${GetAuthorizationToken()}`},
    );
};

/**
 * # 根据学期UUID获取教学班列表
 * > 获取指定学期下的所有教学班列表
 * 
 * @param semesterUuid 学期UUID
 * @returns 教学班列表
 */
const GetTeachingClassBySemesterAPI = async (semesterUuid: string): Promise<BaseResponse<TeachingClassEntity[]> | undefined> => {
    return BaseApi<BaseResponse<TeachingClassEntity[]>>(
        MethodType.GET,
        `/api/v1/teaching-class/semester/${semesterUuid}`,
        null,
        null,
        null,
        {"Authorization": `Bearer ${GetAuthorizationToken()}`},
    );
};

/**
 * # 根据部门UUID获取教学班列表
 * > 获取指定部门下的所有教学班列表
 * 
 * @param departmentUuid 部门UUID
 * @returns 教学班列表
 */
const GetTeachingClassByDepartmentAPI = async (departmentUuid: string): Promise<BaseResponse<TeachingClassLiteEntity[]> | undefined> => {
    return BaseApi<BaseResponse<TeachingClassLiteEntity[]>>(
        MethodType.GET,
        `/api/v1/teaching-class/department/${departmentUuid}`,
        null,
        null,
        null,
        {"Authorization": `Bearer ${GetAuthorizationToken()}`},
    );
};

/**
 * # 根据UUID获取教学班详情
 * > 获取单个教学班的详细信息
 * 
 * @param teachingClassUuid 教学班UUID
 * @returns 教学班详情
 */
const GetTeachingClassDetailAPI = async (teachingClassUuid: string): Promise<BaseResponse<TeachingClassEntity> | undefined> => {
    return BaseApi<BaseResponse<TeachingClassEntity>>(
        MethodType.GET,
        `/api/v1/teaching-class/${teachingClassUuid}`,
        null,
        null,
        null,
        {"Authorization": `Bearer ${GetAuthorizationToken()}`},
    );
};

/**
 * # 创建新教学班
 * > 创建一个新的教学班
 * 
 * @param data 教学班数据
 * @returns 创建的教学班详情
 */
const CreateTeachingClassAPI = async (data: TeachingClassDTO): Promise<BaseResponse<TeachingClassEntity> | undefined> => {
    return BaseApi<BaseResponse<TeachingClassEntity>>(
        MethodType.POST,
        "/api/v1/teaching-class",
        data,
        null,
        null,
        {"Authorization": `Bearer ${GetAuthorizationToken()}`},
    );
};

/**
 * # 更新教学班
 * > 更新现有教学班的信息
 * 
 * @param teachingClassUuid 教学班UUID
 * @param data 更新的教学班数据
 * @returns 更新后的教学班详情
 */
const UpdateTeachingClassAPI = async (teachingClassUuid: string, data: TeachingClassDTO): Promise<BaseResponse<TeachingClassEntity> | undefined> => {
    return BaseApi<BaseResponse<TeachingClassEntity>>(
        MethodType.PUT,
        `/api/v1/teaching-class/${teachingClassUuid}`,
        data,
        null,
        null,
        {"Authorization": `Bearer ${GetAuthorizationToken()}`},
    );
};

/**
 * # 删除教学班
 * > 删除指定的教学班
 * 
 * @param teachingClassUuid 教学班UUID
 * @returns 操作结果
 */
const DeleteTeachingClassAPI = async (teachingClassUuid: string): Promise<BaseResponse<void> | undefined> => {
    return BaseApi<BaseResponse<void>>(
        MethodType.DELETE,
        `/api/v1/teaching-class/${teachingClassUuid}`,
        null,
        null,
        null,
        {"Authorization": `Bearer ${GetAuthorizationToken()}`},
    );
};

/**
 * # 获取教学班列表（不分页）
 * > 获取所有教学班列表，支持多种条件筛选
 * 
 * @param params 筛选参数
 * @returns 教学班列表
 */
const GetTeachingClassListAPI = async (params?: {
    keyword?: string;
    department_uuid?: string;
    semester_uuid?: string;
    teacher_uuid?: string;
    is_enabled?: boolean;
    is_desc?: boolean;
}): Promise<BaseResponse<TeachingClassLiteEntity[]> | undefined> => {
    return BaseApi<BaseResponse<TeachingClassLiteEntity[]>>(
        MethodType.GET,
        "/api/v1/teaching-class/list",
        null,
        params || null,
        null,
        {"Authorization": `Bearer ${GetAuthorizationToken()}`},
    );
};

export {
    GetTeachingClassPageAPI,
    GetTeachingClassBySemesterAPI,
    GetTeachingClassByDepartmentAPI,
    GetTeachingClassDetailAPI,
    CreateTeachingClassAPI,
    UpdateTeachingClassAPI,
    DeleteTeachingClassAPI,
    GetTeachingClassListAPI,
}; 