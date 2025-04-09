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

import {RequestLogEntity} from "./request_log_entity.ts";

/**
 * # AdminDashboardEntity
 *
 * > `AdminDashboardEntity` 是一个用于封装管理员仪表盘统计数据的数据传输对象。它包含了系统中各种资源的总数统计信息。
 *
 * 该实体主要用于管理员仪表盘页面，展示系统的整体运行状况和资源使用情况。
 *
 * @param {number} user_count - 系统中的用户总数
 * @param {number} building_count - 系统中的建筑总数
 * @param {number} teacher_count - 系统中的教师总数
 * @param {number} student_count - 系统中的学生总数
 * @param {number} campus_count - 系统中的校区总数
 * @param {RequestLogEntity[]} request_log_list - 系统中的请求日志列表
 */
export type AdminDashboardEntity = {
    /**
     * 用户总数
     */
    user_count: number;
    /**
     * 建筑总数
     */
    building_count: number;
    /**
     * 教师总数
     */
    teacher_count: number;
    /**
     * 学生总数
     */
    student_count: number;
    /**
     * 校区总数
     */
    campus_count: number;
    /**
     * 请求日志列表
     */
    request_log_list: RequestLogEntity[];
} 