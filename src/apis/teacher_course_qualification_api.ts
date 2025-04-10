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
import { TeacherCourseQualificationEntity } from "../models/entity/teacher_course_qualification_entity";
import { PageTeacherCourseQualificationDTO } from "../models/dto/page/page_teacher_course_qualification_dto";
import { PageEntity } from "../models/entity/page_entity";
import { TeacherCourseQualificationDTO } from "../models/dto/teacher_course_qualification_dto";

/**
 * # 分页获取教师课程资格列表
 * > 获取教师课程资格列表，支持分页、排序和多种筛选条件
 * 
 * @param data 分页查询参数
 * @returns 教师课程资格分页列表
 */
const GetTeacherCourseQualificationPageAPI = async (data: PageTeacherCourseQualificationDTO): Promise<BaseResponse<PageEntity<TeacherCourseQualificationEntity>> | undefined> => {
  return BaseApi<BaseResponse<PageEntity<TeacherCourseQualificationEntity>>>(
    MethodType.GET,
    "/api/v1/teacher-course-qualification/page",
    null,
    data,
    null,
    { "Authorization": `Bearer ${GetAuthorizationToken()}` }
  );
}

/**
 * # 获取教师课程资格列表（不分页）
 * > 获取教师课程资格列表，支持多种筛选条件
 * 
 * @param teacherUuid 教师UUID，可选
 * @param courseUuid 课程UUID，可选
 * @param qualificationLevel 资格等级，可选
 * @param isPrimary 是否主讲教师，可选
 * @param status 状态，可选
 * @returns 教师课程资格列表
 */
const GetTeacherCourseQualificationListAPI = async (
  teacherUuid?: string,
  courseUuid?: string,
  qualificationLevel?: number,
  isPrimary?: boolean,
  status?: number
): Promise<BaseResponse<TeacherCourseQualificationEntity[]> | undefined> => {
  return BaseApi<BaseResponse<TeacherCourseQualificationEntity[]>>(
    MethodType.GET,
    "/api/v1/teacher-course-qualification/list",
    null,
    {
      teacher_uuid: teacherUuid,
      course_uuid: courseUuid,
      qualification_level: qualificationLevel,
      is_primary: isPrimary,
      status: status
    },
    null,
    { "Authorization": `Bearer ${GetAuthorizationToken()}` }
  );
}

/**
 * # 获取教师课程资格详情
 * > 根据资格UUID获取教师课程资格的详细信息
 * 
 * @param qualificationUuid 资格UUID
 * @returns 教师课程资格详情
 */
const GetTeacherCourseQualificationDetailAPI = async (qualificationUuid: string): Promise<BaseResponse<TeacherCourseQualificationEntity> | undefined> => {
  return BaseApi<BaseResponse<TeacherCourseQualificationEntity>>(
    MethodType.GET,
    "/api/v1/teacher-course-qualification",
    null,
    null,
    qualificationUuid,
    { "Authorization": `Bearer ${GetAuthorizationToken()}` }
  );
}

/**
 * # 添加教师课程资格
 * > 直接添加新的教师课程资格，状态为已审核
 * 
 * @param data 教师课程资格数据
 * @returns 添加结果
 */
const AddTeacherCourseQualificationAPI = async (data: TeacherCourseQualificationDTO): Promise<BaseResponse<string> | undefined> => {
  return BaseApi<BaseResponse<string>>(
    MethodType.POST,
    "/api/v1/teacher-course-qualification",
    data,
    null,
    null,
    { "Authorization": `Bearer ${GetAuthorizationToken()}` }
  );
}

/**
 * # 更新教师课程资格
 * > 更新指定资格UUID的教师课程资格信息
 * 
 * @param qualificationUuid 资格UUID
 * @param data 教师课程资格数据
 * @returns 更新结果
 */
const UpdateTeacherCourseQualificationAPI = async (qualificationUuid: string, data: TeacherCourseQualificationDTO): Promise<BaseResponse<void> | undefined> => {
  return BaseApi<BaseResponse<void>>(
    MethodType.PUT,
    "/api/v1/teacher-course-qualification",
    data,
    null,
    qualificationUuid,
    { "Authorization": `Bearer ${GetAuthorizationToken()}` }
  );
}

/**
 * # 删除教师课程资格
 * > 删除指定资格UUID的教师课程资格记录
 * 
 * @param qualificationUuid 资格UUID
 * @returns 删除结果
 */
const DeleteTeacherCourseQualificationAPI = async (qualificationUuid: string): Promise<BaseResponse<void> | undefined> => {
  return BaseApi<BaseResponse<void>>(
    MethodType.DELETE,
    "/api/v1/teacher-course-qualification",
    null,
    null,
    qualificationUuid,
    { "Authorization": `Bearer ${GetAuthorizationToken()}` }
  );
}

/**
 * # 审核教师课程资格
 * > 审核指定资格UUID的教师课程资格申请
 * 
 * @param qualificationUuid 资格UUID
 * @param status 审核状态（1:通过 2:驳回）
 * @param remarks 审核备注，可选
 * @returns 审核结果
 */
const ApproveTeacherCourseQualificationAPI = async (qualificationUuid: string, status: number, remarks?: string): Promise<BaseResponse<void> | undefined> => {
  return BaseApi<BaseResponse<void>>(
    MethodType.PUT,
    `/api/v1/teacher-course-qualification/${qualificationUuid}/approve`,
    null,
    {
      status: status,
      remarks: remarks
    },
    null,
    { "Authorization": `Bearer ${GetAuthorizationToken()}` }
  );
}

/**
 * # 申请教师课程资格
 * > 教师申请新的课程资格，状态为待审核
 * 
 * @param data 教师课程资格数据
 * @returns 申请结果
 */
const ApplyTeacherCourseQualificationAPI = async (data: TeacherCourseQualificationDTO): Promise<BaseResponse<string> | undefined> => {
  return BaseApi<BaseResponse<string>>(
    MethodType.POST,
    "/api/v1/teacher-course-qualification/apply",
    data,
    null,
    null,
    { "Authorization": `Bearer ${GetAuthorizationToken()}` }
  );
}

export {
  GetTeacherCourseQualificationPageAPI,
  GetTeacherCourseQualificationListAPI,
  GetTeacherCourseQualificationDetailAPI,
  AddTeacherCourseQualificationAPI,
  UpdateTeacherCourseQualificationAPI,
  DeleteTeacherCourseQualificationAPI,
  ApproveTeacherCourseQualificationAPI,
  ApplyTeacherCourseQualificationAPI
}; 