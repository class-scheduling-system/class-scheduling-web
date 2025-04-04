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

import { BaseApi, GetAuthorizationToken, MethodType } from '../assets/ts/base_api';
import { BaseResponse } from '../models/base_response';
import { TeacherPreferenceEntity } from '../models/entity/teacher_preference_entity';
import { TeacherPreferenceDTO } from '../models/dto/teacher_preference_dto';
import { PageTeacherPreferenceDTO } from '../models/dto/page/page_teacher_preference_dto';
import { PageEntity } from '../models/entity/page_entity';

/**
 * # 获取教师课程偏好列表分页数据（管理员和教务使用）
 * > 获取教师课程偏好分页列表，支持分页搜索，支持排序，支持按教师和学期筛选
 * 
 * @param data 分页搜索数据
 * @returns 分页列表
 */
const GetTeacherPreferencesPageAPI = async (data: PageTeacherPreferenceDTO): Promise<BaseResponse<PageEntity<TeacherPreferenceEntity>> | undefined> => {
  return BaseApi<BaseResponse<PageEntity<TeacherPreferenceEntity>>>(
    MethodType.GET,
    '/api/v1/teacher/preferences/page',
    null,
    data,
    null,
    { "Authorization": `Bearer ${GetAuthorizationToken()}` }
  );
}

/**
 * # 获取当前登录教师的课程偏好列表分页数据
 * > 获取当前教师的课程偏好分页列表，支持分页搜索，支持排序，支持按学期筛选
 * 
 * @param data 分页搜索数据
 * @returns 分页列表
 */
const GetMyTeacherPreferencesPageAPI = async (data: PageTeacherPreferenceDTO): Promise<BaseResponse<PageEntity<TeacherPreferenceEntity>> | undefined> => {
  return BaseApi<BaseResponse<PageEntity<TeacherPreferenceEntity>>>(
    MethodType.GET,
    '/api/v1/teacher/preferences/page/me',
    null,
    data,
    null,
    { "Authorization": `Bearer ${GetAuthorizationToken()}` }
  );
}

/**
 * # 获取教师在指定学期的课程偏好列表
 * > 获取指定教师在指定学期的所有课程偏好列表
 * 
 * @param teacherUuid 教师UUID
 * @param semesterUuid 学期UUID
 * @returns 课程偏好列表
 */
const GetTeacherPreferencesListAPI = async (teacherUuid: string, semesterUuid: string): Promise<BaseResponse<TeacherPreferenceEntity[]> | undefined> => {
  return BaseApi<BaseResponse<TeacherPreferenceEntity[]>>(
    MethodType.GET,
    '/api/v1/teacher/preferences/list',
    null,
    {
      teacher_uuid: teacherUuid,
      semester_uuid: semesterUuid,
    },
    null,
    { "Authorization": `Bearer ${GetAuthorizationToken()}` }
  );
}

/**
 * # 获取单个教师课程偏好信息
 * > 根据偏好UUID获取单个教师课程偏好详细信息
 * 
 * @param preferenceUuid 教师课程偏好的唯一标识符
 * @returns 课程偏好信息
 */
const GetTeacherPreferenceAPI = async (preferenceUuid: string): Promise<BaseResponse<TeacherPreferenceEntity> | undefined> => {
  return BaseApi<BaseResponse<TeacherPreferenceEntity>>(
    MethodType.GET,
    '/api/v1/teacher/preferences',
    null,
    null,
    preferenceUuid,
    { "Authorization": `Bearer ${GetAuthorizationToken()}` }
  );
}

/**
 * # 编辑教师课程偏好
 * > 根据偏好UUID更新教师课程偏好信息
 * 
 * @param preferenceUuid 教师课程偏好的唯一标识符
 * @param data 教师课程偏好数据
 * @returns 更新后的课程偏好信息
 */
const UpdateTeacherPreferenceAPI = async (preferenceUuid: string, data: TeacherPreferenceDTO): Promise<BaseResponse<TeacherPreferenceEntity> | undefined> => {
  return BaseApi<BaseResponse<TeacherPreferenceEntity>>(
    MethodType.PUT,
    '/api/v1/teacher/preferences',
    data,
    null,
    preferenceUuid,
    { "Authorization": `Bearer ${GetAuthorizationToken()}` }
  );
}

/**
 * # 删除教师课程偏好
 * > 根据偏好UUID删除教师课程偏好
 * 
 * @param preferenceUuid 教师课程偏好的唯一标识符
 * @returns void
 */
const DeleteTeacherPreferenceAPI = async (preferenceUuid: string): Promise<BaseResponse<void> | undefined> => {
  return BaseApi<BaseResponse<void>>(
    MethodType.DELETE,
    '/api/v1/teacher/preferences',
    null,
    null,
    preferenceUuid,
    { "Authorization": `Bearer ${GetAuthorizationToken()}` }
  );
}

/**
 * # 添加教师课程偏好
 * > 创建新的教师课程偏好记录
 * 
 * @param data 教师课程偏好数据
 * @returns 创建的课程偏好信息
 */
const CreateTeacherPreferenceAPI = async (data: TeacherPreferenceDTO): Promise<BaseResponse<TeacherPreferenceEntity> | undefined> => {
  return BaseApi<BaseResponse<TeacherPreferenceEntity>>(
    MethodType.POST,
    '/api/v1/teacher/preferences',
    data,
    null,
    null,
    { "Authorization": `Bearer ${GetAuthorizationToken()}` }
  );
}

export {
  GetTeacherPreferencesPageAPI,
  GetMyTeacherPreferencesPageAPI,
  GetTeacherPreferencesListAPI,
  GetTeacherPreferenceAPI,
  UpdateTeacherPreferenceAPI,
  DeleteTeacherPreferenceAPI,
  CreateTeacherPreferenceAPI
}; 