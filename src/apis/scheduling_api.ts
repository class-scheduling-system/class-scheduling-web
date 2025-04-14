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
import { AutomaticClassSchedulingDTO } from "../models/dto/automatic_scheduling_dto";
import { SchedulingTaskEntity } from "../models/entity/scheduling_task_entity";
import { SchedulingTaskStatusEntity } from "../models/entity/scheduling_task_status_entity";

/**
 * # 自动排课
 * > 本接口用于提交自动排课任务
 * 
 * @param params 自动排课参数，包含学期UUID、院系UUID、排课策略等
 * @returns 排课任务信息
 */
const AutomaticSchedulingAPI = async (
    params: AutomaticClassSchedulingDTO
): Promise<BaseResponse<SchedulingTaskEntity> | undefined> => {
    return BaseApi<BaseResponse<SchedulingTaskEntity>>(
        MethodType.POST,
        "/api/v1/scheduling/auto",
        params as Record<string, unknown>,
        null,
        null,
        {"Authorization": `Bearer ${GetAuthorizationToken()}`},
    );
};

/**
 * # 获取排课任务列表
 * > 本接口用于获取所有排课任务的列表
 * 
 * @returns 排课任务ID列表
 */
const GetSchedulingTasksAPI = async (): Promise<BaseResponse<string[]> | undefined> => {
    return BaseApi<BaseResponse<string[]>>(
        MethodType.GET,
        "/api/v1/scheduling/tasks",
        null,
        null,
        null,
        {"Authorization": `Bearer ${GetAuthorizationToken()}`},
    );
};

/**
 * # 获取排课任务状态
 * > 本接口用于获取指定排课任务的详细状态
 * 
 * @param taskId 排课任务ID
 * @returns 排课任务状态详情
 */
const GetSchedulingTaskStatusAPI = async (taskId: string): Promise<BaseResponse<SchedulingTaskStatusEntity> | undefined> => {
    return BaseApi<BaseResponse<SchedulingTaskStatusEntity>>(
        MethodType.GET,
        `/api/v1/scheduling/tasks/${taskId}`,
        null,
        null,
        null,
        {"Authorization": `Bearer ${GetAuthorizationToken()}`},
    );
};

export {
    AutomaticSchedulingAPI,
    GetSchedulingTasksAPI,
    GetSchedulingTaskStatusAPI
}; 