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

import {BaseApi, MethodType} from "../assets/ts/base_api.ts";
import {BaseResponse} from "../models/base_response.ts";
import {SystemInitDTO} from "../models/dto/system_init_dto.ts";
import {SystemInitCheckEntity} from "../models/entity/system_init_check_entity.ts";

/**
 * # InitAPI
 * > 该函数用于初始化系统，通过向服务器发送初始化数据来完成系统设置。
 *
 * @param {SystemInitDTO} data - 包含系统初始化所需的所有参数的数据传输对象。
 * @returns {Promise<BaseResponse<void> | undefined>} - 返回一个 Promise 对象，解析为 BaseResponse 类型的结果，其中包含响应信息。如果请求成功但没有返回内容，则可能返回 undefined。
 * @throws {Error} - 当网络请求失败或服务端返回错误时抛出异常。
 */
const InitAPI = async (data: SystemInitDTO): Promise<BaseResponse<void> | undefined> => {
    return BaseApi<BaseResponse<void>>(
        MethodType.POST,
        "/api/v1/init",
        data,
        null,
        null,
        null
    );
}

/**
 * # InitCheckAPI
 * > 用于初始化检查的 API 函数，通过发送 GET 请求到指定的后端接口来获取系统初始化状态的信息。
 *
 * @returns {Promise<BaseResponse<SystemInitCheckEntity> | undefined>} - 返回一个 Promise，解析为包含系统初始化状态信息的 BaseResponse 对象或 undefined。
 * @throws {Error} - 当网络请求失败或响应状态码非 2xx 时抛出异常。
 */
const InitCheckAPI = async (): Promise<BaseResponse<SystemInitCheckEntity> | undefined> => {
    return BaseApi<BaseResponse<SystemInitCheckEntity>>(
        MethodType.GET,
        "/api/v1/init/check",
        null,
        null,
        null,
        null
    );
}

export {
    InitAPI,
    InitCheckAPI
}
