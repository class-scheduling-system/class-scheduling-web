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

/**
 * # RequestLogEntity
 *
 * > `RequestLogEntity` 是一个用于封装请求日志数据的数据传输对象。它包含了系统中每个请求的详细信息。
 *
 * @param {string} request_log_uuid - 请求日志的唯一标识符
 * @param {string} user_uuid - 发起请求的用户的唯一标识符
 * @param {string} request_ip - 请求的来源IP地址
 * @param {string} user_agent - 请求的用户代理信息
 * @param {string} request_url - 请求的URL
 * @param {string} request_method - 请求的HTTP方法
 * @param {string} request_params - 请求的参数
 * @param {string} request_body - 请求的主体内容
 * @param {number} response_code - 响应的状态码
 * @param {string} error_message - 错误信息（如果有）
 * @param {number} execution_time - 请求执行时间（毫秒）
 * @param {number} request_time - 请求开始时间（时间戳）
 * @param {number} response_time - 响应时间（时间戳）
 * @param {number} created_at - 记录创建时间（时间戳）
 */
export type RequestLogEntity = {
    /**
     * 请求日志的唯一标识符
     */
    request_log_uuid: string;
    /**
     * 发起请求的用户的唯一标识符
     */
    user_uuid: string;
    /**
     * 请求的来源IP地址
     */
    request_ip: string;
    /**
     * 请求的用户代理信息
     */
    user_agent: string;
    /**
     * 请求的URL
     */
    request_url: string;
    /**
     * 请求的HTTP方法
     */
    request_method: string;
    /**
     * 请求的参数
     */
    request_params: string;
    /**
     * 请求的主体内容
     */
    request_body: string;
    /**
     * 响应的状态码
     */
    response_code: number;
    /**
     * 错误信息（如果有）
     */
    error_message: string;
    /**
     * 请求执行时间（毫秒）
     */
    execution_time: number;
    /**
     * 请求开始时间（时间戳）
     */
    request_time: number;
    /**
     * 响应时间（时间戳）
     */
    response_time: number;
    /**
     * 记录创建时间（时间戳）
     */
    created_at: number;
} 