import { BaseApi, GetAuthorizationToken, MethodType } from "../assets/ts/base_api";
import { PageStudentSearchDTO } from "../models/dto/page/page_student_search_dto";
import { PageEntity } from "../models/entity/page_entity";
import { StudentEntity } from "../models/entity/student_entity";
import { BaseResponse } from "../models/base_response";
import { StudentDTO } from "../models/dto/student_dto";
import { DisableEntity } from "../models/entity/diable_entity";

/**
 * # 获取学生分页列表
 * > 获取学生分页列表, 支持分页搜索, 支持排序, 支持关键词搜索
 * 
 * @param data 分页搜索数据
 * @returns 分页列表
 */
const GetStudentPageAPI = async (data: PageStudentSearchDTO): Promise<BaseResponse<PageEntity<StudentEntity>> | undefined> => {
    return BaseApi<BaseResponse<PageEntity<StudentEntity>>>(
        MethodType.GET,
        "/api/v1/students/page",
        null,
        data,
        null,
        { "Authorization": `Bearer ${GetAuthorizationToken()}` }
    )
}

/**
 * # 获取学生信息
 * > 获取学生信息, 支持根据学生UUID获取学生信息
 * 
 * @param student_uuid 学生UUID
 * @returns 学生信息
 */
const GetStudentAPI = async (student_uuid: string): Promise<BaseResponse<StudentEntity> | undefined> => {
    return BaseApi<BaseResponse<StudentEntity>>(
        MethodType.GET,
        `/api/v1/students/`,
        null,
        null,
        student_uuid,
        { "Authorization": `Bearer ${GetAuthorizationToken()}` }
    )
}

/**
 * # 创建学生
 * > 创建学生, 支持根据学生UUID获取学生信息
 * 
 * @param student_uuid 学生UUID
 * @returns 学生信息
 */
const CreateStudentAPI = async (data: StudentDTO): Promise<BaseResponse<StudentEntity> | undefined> => {
    return BaseApi<BaseResponse<StudentEntity>>(
        MethodType.POST,
        `/api/v1/students/`,
        data,
        null,
        null,
        { "Authorization": `Bearer ${GetAuthorizationToken()}` }
    )
}

/**
 * # 禁用学生
 * > 禁用学生, 支持根据学生UUID禁用学生
 * 
 * @param student_uuid 学生UUID
 * @param disable 是否禁用
 * @returns 学生信息
 */
const DisableStudentAPI = async (student_uuid: string, disable: boolean): Promise<BaseResponse<DisableEntity> | undefined> => {
    return BaseApi<BaseResponse<DisableEntity>>(
        MethodType.PUT,
        `/api/v1/students/disable/${student_uuid}`,
        null,
        { "disable": disable },
        null,
        { "Authorization": `Bearer ${GetAuthorizationToken()}` }
    )
}

/**
 * # 删除学生
 * > 删除学生, 支持根据学生UUID删除学生
 * 
 * @param student_uuid 学生UUID
 * @returns 空
 */
const DeleteStudentAPI = async (student_uuid: string): Promise<BaseResponse<void> | undefined> => {
    return BaseApi<BaseResponse<void>>(
        MethodType.DELETE,
        "/api/v1/students/",
        null,
        null,   
        student_uuid,
        { "Authorization": `Bearer ${GetAuthorizationToken()}` }
    )
}

/**
 * # 编辑学生
 * > 编辑学生, 支持根据学生UUID编辑学生
 * 
 * @param student_uuid 学生UUID
 * @param data 学生信息
 * @returns 学生信息
 */
const EditStudentAPI = async (student_uuid: string, data: StudentDTO): Promise<BaseResponse<StudentEntity> | undefined> => {
    return BaseApi<BaseResponse<StudentEntity>>(
        MethodType.PUT,
        "/api/v1/students/disable/",
        data,
        null,
        student_uuid,
        { "Authorization": `Bearer ${GetAuthorizationToken()}` }
    )
}

export {
    GetStudentPageAPI,
    GetStudentAPI,
    CreateStudentAPI,
    DisableStudentAPI,
    DeleteStudentAPI,
    EditStudentAPI
};