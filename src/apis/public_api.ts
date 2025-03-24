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
import {SiteInfoEntity} from "../models/entity/site_info_entity.ts";
import {BaseResponse} from "../models/base_response.ts";
import { SystemInfoEntity } from "../models/entity/system_info_entity.ts";
import { JvmStackEntity } from "../models/entity/jvm_stack_entity.ts";

/**
 * # 获取站点信息的异步API调用。
 * > 该函数通过发送GET请求到"/api/v1/web/info"来获取站点的相关信息。
 *
 * @returns {Promise<BaseResponse<SiteInfoEntity> | undefined>} 返回一个Promise，解析为包含站点信息实体的BaseResponse对象，或在失败时返回undefined。
 */
const GetSiteInfoAPI = async (): Promise<BaseResponse<SiteInfoEntity> | undefined> => {
    return BaseApi<SiteInfoEntity>(
        MethodType.GET,
        "/api/v1/web/info",
        null,
        null,
        null,
        null
    );
}

/**
 * # 获取系统信息
 * > 该函数通过发送GET请求到 "/api/v1/web/system" 来获取系统信息。
 * 
 * @returns {Promise<BaseResponse<SystemInfoEntity> | undefined>} 返回一个Promise，解析为包含系统信息实体的BaseResponse对象，或在失败时返回undefined。
 */
const GetSystemInfoAPI = async (): Promise<BaseResponse<SystemInfoEntity> | undefined> => {
    return BaseApi<SystemInfoEntity>(
        MethodType.GET,
        "/api/v1/web/system",
        null,
        null,
        null,
        {"Authorization": `Bearer ${GetAuthorizationToken()}`}
    );
}

/**
 * # 获取 JVM 堆栈信息
 * > 该函数通过发送GET请求到 "/api/v1/web/jvm-stack" 来获取 JVM 堆栈信息。
 * 
 * @returns {Promise<BaseResponse<JvmStackEntity> | undefined>} 返回一个Promise，解析为包含 JVM 堆栈信息实体的BaseResponse对象，或在失败时返回undefined。
 */
const GetJvmStackInfoAPI = async (): Promise<BaseResponse<JvmStackEntity> | undefined> => {
    return BaseApi<JvmStackEntity>(
        MethodType.GET,
        "/api/v1/web/jvm-stack",
        null,
        null,
        null,
        {"Authorization": `Bearer ${GetAuthorizationToken()}`}
    );
}

export {
    GetSiteInfoAPI,
    GetSystemInfoAPI,
    GetJvmStackInfoAPI
}
