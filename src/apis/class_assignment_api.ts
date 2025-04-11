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
import { AdjustmentDTO, ClassAssignmentDTO } from "../models/dto/class_assignment_dto";
import { PageClassAssignmentSearchDTO } from "../models/dto/page/page_class_assignment_search_dto";
import { ClassAssignmentEntity } from "../models/entity/class_assignment_entity";
import { PageEntity } from "../models/entity/page_entity";
import { SchedulingConflictDTO } from "../models/dto/scheduling_conflict_dto";

/**
 * # 获取排课分配信息
 * > 本接口用于获取单个排课分配信息
 * 
 * @param classAssignmentUuid 排课分配UUID
 * @returns 排课分配信息
 */
const GetClassAssignmentAPI = async (classAssignmentUuid: string): Promise<BaseResponse<ClassAssignmentEntity> | undefined> => {
    return BaseApi<BaseResponse<ClassAssignmentEntity>>(
        MethodType.GET,
        "/api/v1/class-assignments",
        null,
        null,
        classAssignmentUuid,
        {"Authorization": `Bearer ${GetAuthorizationToken()}`},
    );
}

/**
 * # 获取排课分配分页信息
 * > 本接口用于获取排课分配分页信息
 * 
 * @param params 分页查询参数，包含页码、每页大小和学期UUID等
 * @returns 排课分配分页信息
 */
const GetClassAssignmentPageAPI = async (params: PageClassAssignmentSearchDTO): Promise<BaseResponse<PageEntity<ClassAssignmentEntity>> | undefined> => {
    return BaseApi<BaseResponse<PageEntity<ClassAssignmentEntity>>>(
        MethodType.GET,
        "/api/v1/class-assignments/page",
        null,
        params,
        null,
        {"Authorization": `Bearer ${GetAuthorizationToken()}`},
    );
}

/**
 * # 获取排课分配列表
 * > 本接口用于获取排课分配列表（不分页）
 * 
 * @param semesterUuid 学期UUID
 * @param courseUuid 课程UUID（可选）
 * @param teacherUuid 教师UUID（可选）
 * @returns 排课分配列表
 */
const GetClassAssignmentListAPI = async (
    semesterUuid: string,
    courseUuid?: string,
    teacherUuid?: string
): Promise<BaseResponse<ClassAssignmentEntity[]> | undefined> => {
    const params: Record<string, string> = {
        semester_uuid: semesterUuid
    };
    
    if (courseUuid) {
        params.course_uuid = courseUuid;
    }
    
    if (teacherUuid) {
        params.teacher_uuid = teacherUuid;
    }
    
    return BaseApi<BaseResponse<ClassAssignmentEntity[]>>(
        MethodType.GET,
        "/api/v1/class-assignments/list",
        null,
        params,
        null,
        {"Authorization": `Bearer ${GetAuthorizationToken()}`},
    );
}

/**
 * # 添加排课分配
 * > 本接口用于添加新的排课分配
 * 
 * @param data 排课分配信息，请确保字段与后端ClassAssignmentVO规范一致
 * @returns 如果有冲突，返回冲突列表；否则返回空数组
 */
const AddClassAssignmentAPI = async (data: ClassAssignmentDTO): Promise<BaseResponse<SchedulingConflictDTO[]> | undefined> => {
    return BaseApi<BaseResponse<SchedulingConflictDTO[]>>(
        MethodType.POST,
        "/api/v1/class-assignments",
        data as Record<string, unknown>,
        null,
        null,
        {"Authorization": `Bearer ${GetAuthorizationToken()}`},
    );
}

/**
 * # 更新排课分配
 * > 本接口用于更新排课信息
 * 
 * @param adjustmentData 排课调整数据，直接遵循 AdjustmentDTO 结构
 * @returns 操作结果
 */
const UpdateClassAssignmentAPI = async (adjustmentData: AdjustmentDTO): Promise<BaseResponse<void> | undefined> => {
    return BaseApi<BaseResponse<void>>(
        MethodType.PUT,
        "/api/v1/class-assignments",
        adjustmentData as Record<string, unknown>,
        null,
        null,
        {"Authorization": `Bearer ${GetAuthorizationToken()}`},
    );
}

/**
 * # 删除排课分配
 * > 本接口用于删除排课分配
 * 
 * @param classAssignmentUuid 排课分配UUID
 * @returns 操作结果
 */
const DeleteClassAssignmentAPI = async (classAssignmentUuid: string): Promise<BaseResponse<void> | undefined> => {
    return BaseApi<BaseResponse<void>>(
        MethodType.DELETE,
        "/api/v1/class-assignments",
        null,
        null,
        classAssignmentUuid,
        {"Authorization": `Bearer ${GetAuthorizationToken()}`},
    );
}

export {
    GetClassAssignmentAPI,
    GetClassAssignmentPageAPI,
    GetClassAssignmentListAPI,
    AddClassAssignmentAPI,
    UpdateClassAssignmentAPI,
    DeleteClassAssignmentAPI,
    GetClassAssignmentAPI as GetClassAssignmentDetailAPI
}; 