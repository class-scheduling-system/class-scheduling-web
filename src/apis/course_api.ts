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
import { BatchAddCourseDTO } from "../models/dto/batch_add_course_dto";
import { CourseLibraryDTO } from "../models/dto/course_library_dto";
import { PageCourseSearchDTO } from "../models/dto/page/page_course_search_dto";
import { BatchAddCourseEntity } from "../models/entity/batch_add_course_entity";
import { CourseLibraryEntity } from "../models/entity/course_library_entity";
import { CourseLibraryLiteEntity } from "../models/entity/course_library_lite_entity";
import { FileEntity } from "../models/entity/file_entity";
import { PageEntity } from "../models/entity/page_entity";

/**
 * # 获取课程库信息
 * > 本接口用于获取课程库信息，用于获取单个的课程库信息。
 * 
 * @param courseUuid 课程库主键
 * @returns 课程库信息
 */
const GetCourseAPI = async (courseUuid: string): Promise<BaseResponse<CourseLibraryEntity> | undefined> => {
    return BaseApi<BaseResponse<CourseLibraryEntity>>(
        MethodType.GET,
        "/api/v1/course",
        null,
        null,
        courseUuid,
        {"Authorization": `Bearer ${GetAuthorizationToken()}`},
    );
}

/**
 * # 获取课程库分页信息
 * > 本接口用于获取课程库分页信息，用于获取课程库分页信息。
 *
 * @param data 分页查询参数，包含部门UUID过滤条件
 * @returns 课程库分页信息
 */
const GetCoursePageAPI = async (data: PageCourseSearchDTO): Promise<BaseResponse<PageEntity<CourseLibraryEntity>> | undefined> => {
    return BaseApi<BaseResponse<PageEntity<CourseLibraryEntity>>>(
        MethodType.GET,
        "/api/v1/course/page",
        null,
        data,
        null,
        {"Authorization": `Bearer ${GetAuthorizationToken()}`},
    );
}

/**
 * # 获取课程库简洁列表
 * > 本接口用于获取课程库简洁列表，可根据各种条件筛选。
 *
 * @param courseCategoryUuid 课程类别UUID（可选）
 * @param coursePropertyUuid 课程属性UUID（可选）
 * @param courseTypeUuid 课程类型UUID（可选）
 * @param courseNatureUuid 课程性质UUID（可选）
 * @param courseDepartmentUuid 课程部门UUID（可选）
 * @returns 课程库简洁列表
 */
const GetCourseListAPI = async (
    courseCategoryUuid?: string,
    coursePropertyUuid?: string,
    courseTypeUuid?: string,
    courseNatureUuid?: string,
    courseDepartmentUuid?: string
): Promise<BaseResponse<CourseLibraryEntity[]> | undefined> => {
    const params: Record<string, string> = {};
    
    if (courseCategoryUuid) params.course_category_uuid = courseCategoryUuid;
    if (coursePropertyUuid) params.course_property_uuid = coursePropertyUuid;
    if (courseTypeUuid) params.course_type_uuid = courseTypeUuid;
    if (courseNatureUuid) params.course_nature_uuid = courseNatureUuid;
    if (courseDepartmentUuid) params.course_department_uuid = courseDepartmentUuid;

    return BaseApi<BaseResponse<CourseLibraryEntity[]>>(
        MethodType.GET,
        "/api/v1/course/list",
        null,
        Object.keys(params).length > 0 ? params : null,
        null,
        {"Authorization": `Bearer ${GetAuthorizationToken()}`},
    );
}

/**
 * # 添加课程库
 * > 本接口用于添加课程库信息，用于添加课程库信息。
 *
 * @param data 课程库信息
 * @returns 操作结果
 */
const AddCourseAPI = async (data: CourseLibraryDTO): Promise<BaseResponse<void> | undefined> => {
    return BaseApi<BaseResponse<void>>(
        MethodType.POST,
        "/api/v1/course",
        data,
        null,
        null,
        {"Authorization": `Bearer ${GetAuthorizationToken()}`},
    );
}

/**
 * # 更新课程库
 * > 本接口用于更新课程库信息，用于更新课程库信息。
 *
 * @param courseUuid 课程库主键
 * @param data 课程库信息
 * @returns 操作结果
 */
const UpdateCourseAPI = async (courseUuid: string, data: CourseLibraryDTO): Promise<BaseResponse<void> | undefined> => {
    return BaseApi<BaseResponse<void>>(
        MethodType.PUT,
        "/api/v1/course",
        data,
        null,
        courseUuid,
        {"Authorization": `Bearer ${GetAuthorizationToken()}`},
    );
}

/**
 * # 删除课程库
 * > 本接口用于删除课程库信息，用于删除课程库信息。
 *
 * @param courseUuid 课程库主键
 * @returns 操作结果
 */
const DeleteCourseAPI = async (courseUuid: string): Promise<BaseResponse<void> | undefined> => {
    return BaseApi<BaseResponse<void>>(
        MethodType.DELETE,
        "/api/v1/course",
        null,
        null,
        courseUuid,
        {"Authorization": `Bearer ${GetAuthorizationToken()}`},
    );
}

/**
 * # 获取课程导入模板
 * > 本接口用于获取课程导入模板，用于批量导入课程。
 *
 * @returns 课程导入模板（包含Base64编码的Excel文件）
 */
const GetCourseTemplateAPI = async (): Promise<BaseResponse<FileEntity> | undefined> => {
    return BaseApi<BaseResponse<FileEntity>>(
        MethodType.GET,
        "/api/v1/course/get-template",
        null,
        null,
        null,
        {"Authorization": `Bearer ${GetAuthorizationToken()}`}
    );
}

/**
 * # 批量导入课程
 * > 本接口用于批量导入课程，用于批量添加课程信息。
 *
 * @param data 导入信息，包含base64编码的Excel文件和是否忽略错误的标志
 * @returns 批量导入结果
 */
const BatchImportCourseAPI = async (data: BatchAddCourseDTO): Promise<BaseResponse<BatchAddCourseEntity> | undefined> => {
    return BaseApi<BaseResponse<BatchAddCourseEntity>>(
        MethodType.POST,
        "/api/v1/course/batch-import",
        data,
        null,
        null,
        {"Authorization": `Bearer ${GetAuthorizationToken()}`},
    );
}

export {
    GetCourseAPI,
    GetCoursePageAPI,
    GetCourseListAPI,
    AddCourseAPI,
    UpdateCourseAPI,
    DeleteCourseAPI,
    GetCourseTemplateAPI,
    BatchImportCourseAPI
};