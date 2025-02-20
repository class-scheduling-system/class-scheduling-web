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

import {BaseResponse} from "../models/base_response.ts";
import {BaseApi, MethodType} from "../assets/ts/base_api.ts";
import {AuthLoginDTO} from "../models/dto/auth_login_dto.ts";
import {UserLoginEntity} from "../models/entity/user_login_entity.ts";

/**
 * # AuthLoginAPI
 * > 该函数用于处理用户登录请求，通过向指定的后端接口发送包含登录信息的数据包，获取用户的登录状态。
 *
 * @param data - {AuthLoginDTO} 用户提供的登录凭据，如用户名和密码等信息。
 * @returns {Promise<BaseResponse<UserLoginEntity> | undefined>} - 返回一个 Promise 对象，解析为 BaseResponse<UserLoginEntity> 类型或者 undefined。其中包含了用户登录后的相关信息或登录失败的原因。
 * @throws 当网络请求失败、服务器响应异常或传入参数不符合要求时，可能会抛出错误。
 */
const AuthLoginAPI = async (data: AuthLoginDTO): Promise<BaseResponse<UserLoginEntity> | undefined> => {
    return BaseApi<UserLoginEntity>(
        MethodType.POST,
        "/api/v1/user/login",
        data,
        null,
        null,
        null
    );
}

export {
    AuthLoginAPI
}
