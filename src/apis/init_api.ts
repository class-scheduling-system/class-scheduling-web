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

/**
 * 初始化系统API
 *
 * @async
 * @param {SystemInitDTO} data - 系统初始化所需的数据对象
 * @returns {Promise<BaseResponse<void> | undefined>} - 包含初始化结果的Promise，成功时返回BaseResponse对象，失败或异常时可能返回undefined
 *
 * 调用此函数以发起一个异步请求，用于系统的初始化过程。它向服务器的/api/v1/init端点发送POST请求，并传入数据data。
 * 返回的Promise解析为一个BaseResponse对象，表示操作的结果；如果发生错误或异常，则可能返回undefined。
 */
const InitAPI = async (data: SystemInitDTO): Promise<BaseResponse<void> | undefined> => {
    return BaseApi<void>(
        MethodType.POST,
        "/api/v1/init",
        data,
        null,
        null,
        null
    );
}

export {
    InitAPI,
}
