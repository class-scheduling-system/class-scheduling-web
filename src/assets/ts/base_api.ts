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

import axios, {type AxiosResponse} from "axios";
import cookie from 'react-cookies';
import type {BaseResponse} from "../../models/base_response.ts";

const BASE_API_URL: string = import.meta.env.VITE_BASE_API_URL;

/**
 * Http 方法类型枚举
 */
enum MethodType {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
    OPTIONS = "OPTIONS",
    HEAD = "HEAD",
}

/**
 * # 基础请求方法
 * - 这是一个基础的请求方法，用于发送请求，返回 Promise 对象；简化了 axios 的使用，减少了重复代码；
 * - 其他接口在进行调用的时候，可以直接调用这个方法，传入对应的参数即可；若出现报错内容，此方法直接执行报错内容输出；
 * - 对于可选的内容，若不需要，可以传入 null，不会影响请求；请不要传递空字符串，将会以空字符串进行请求；而不是不传递；
 *
 * @param method 请求方法
 * @param url 请求地址(不包含基础地址)
 * @param bodyData 请求体数据(选)
 * @param paramData 请求参数数据(选)
 * @param pathData 请求路径数据(选)
 * @param headers 请求头数据(选)
 * @constructor 返回 Promise 对象
 * @returns Promise 对象
 */
async function BaseApi<E>(
    method: MethodType,
    url: string,
    bodyData: Record<string, unknown> | null,
    paramData: Record<string, unknown> | null,
    pathData: string | null,
    headers: Record<string, string> | null
): Promise<BaseResponse<E> | undefined> {
    return axios({
        method: method,
        url: makeURL(url, pathData),
        data: makeData(bodyData),
        params: paramData,
        headers: pushHeader(headers)
    }).then((response: AxiosResponse<BaseResponse<E>, object>) => {
        return response.data;
    }).catch((error) => {
        console.error("[API] 请求出现问题", error);
        const getResponse: BaseResponse<E> = error.response.data
        if (getResponse) {
            return getResponse;
        }
    }).finally(() => {
        console.log("[API] 请求 [" + method + "] " + makeURL(url, pathData) + " 接口");
    });
}

/**
 * # 拼接 URL
 * 拼接 URL，将基础地址和请求地址拼接在一起，返回拼接后的地址；
 * 若有路径数据，则拼接路径数据；若没有路径数据，则不拼接路径数据；
 *
 * @param url 请求地址
 * @param pathData 路径数据
 * @returns 拼接后的地址
 */
const makeURL = (url: string, pathData: string | null): string => {
    if (pathData) {
        if (url.endsWith("/")) {
            return `${BASE_API_URL}${url}${pathData}`;
        } else {
            return `${BASE_API_URL}${url}/${pathData}`;
        }
    } else {
        return `${BASE_API_URL}${url}`;
    }

}

/**
 * # 处理数据
 * 处理数据，将数据进行处理，若数据存在，则返回数据；若数据不存在，则返回 null；
 *
 * @param data 数据
 * @returns 处理后的数据
 */
const makeData = (data: unknown): unknown => {
    if (data) {
        return data;
    } else {
        return null;
    }
}

const pushHeader = (headers: Record<string, string> | null): Record<string, string> => {
    if (headers) {
        headers["Content-Type"] = "application/json";
        return headers;
    } else {
        return {
            "Content-Type": "application/json"
        }
    }
}

function GetAuthorizationToken(): string {
    const token = cookie.load("token");
    if (token) {
        return token.replace("Bearer ", "");
    } else {
        return ""
    }
}

export {BaseApi, MethodType, GetAuthorizationToken};
