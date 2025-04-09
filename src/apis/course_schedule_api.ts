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

import {BaseApi, GetAuthorizationToken, MethodType} from "../assets/ts/base_api";
import {BaseResponse} from "../models/base_response";
import {CourseScheduleEntity} from "../models/entity/course_schedule_entity";

/**
 * # 获取教师课程表API
 * > 该函数用于通过API请求获取教师课程表数据。它利用了Bearer令牌认证方式来确保安全地访问数据。
 *
 * @param {string} [semesterUuid] - 可选参数，学期UUID。如果提供，将获取指定学期的课程表；否则获取默认学期课程表。
 * @returns {Promise<BaseResponse<CourseScheduleEntity> | undefined>} - 返回一个Promise，解析为包含课程表数据的BaseResponse对象或undefined。
 * @throws {Error} 当网络请求过程中遇到问题时抛出异常。
 */
const GetTeacherCourseScheduleAPI = async (semesterUuid?: string): Promise<BaseResponse<CourseScheduleEntity> | undefined> => {
    const params = semesterUuid ? { semester_uuid: semesterUuid } : null;
    return BaseApi<BaseResponse<CourseScheduleEntity>>(
        MethodType.GET,
        "/api/v1/course-schedule/teacher",
        null,
        params,
        null,
        {Authorization: `Bearer ${GetAuthorizationToken()}`},
    );
}

/**
 * # 获取学生课程表API
 * > 该函数用于通过API请求获取学生课程表数据。它利用了Bearer令牌认证方式来确保安全地访问数据。
 *
 * @param {string} [semesterUuid] - 可选参数，学期UUID。如果提供，将获取指定学期的课程表；否则获取默认学期课程表。
 * @returns {Promise<BaseResponse<CourseScheduleEntity> | undefined>} - 返回一个Promise，解析为包含课程表数据的BaseResponse对象或undefined。
 * @throws {Error} 当网络请求过程中遇到问题时抛出异常。
 */
const GetStudentCourseScheduleAPI = async (semesterUuid?: string): Promise<BaseResponse<CourseScheduleEntity> | undefined> => {
    const params = semesterUuid ? { semester_uuid: semesterUuid } : null;
    return BaseApi<BaseResponse<CourseScheduleEntity>>(
        MethodType.GET,
        "/api/v1/course-schedule/student",
        null,
        params,
        null,
        {Authorization: `Bearer ${GetAuthorizationToken()}`},
    );
}

export {
    GetTeacherCourseScheduleAPI,
    GetStudentCourseScheduleAPI
} 