import { BaseApi, GetAuthorizationToken, MethodType } from "../assets/ts/base_api";
import { PageStudentSearchDTO } from "../models/dto/page/page_student_search_dto";
import { PageEntity } from "../models/entity/page_entity";
import { StudentEntity } from "../models/entity/student_entity";
import { BaseResponse } from "../models/base_response";
import { StudentDTO } from "../models/dto/student_dto";
import { DisableEntity } from "../models/entity/diable_entity";
import {BatchImportResponseDTO} from "../models/dto/building/batch_import_response_dto.ts";
import {FileEntity} from "../models/entity/file_entity.ts";

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


/**
 * # GetStudentTemplateAPI
 * > 该函数用于获取学生导入模板。它会返回一个 Excel 文件的二进制数据，特别适用于教务角色。
 * > 后端接口使用了 RequestRole 注解来限制只有具有"教务"角色的用户才能访问此端点。
 * > 返回的响应将是一个包含模板文件的响应实体，设置为附件形式，文件名为"学生导入模板.xlsx"
 *
 * @returns {Promise<BaseResponse<FileEntity> | undefined>} - 如果操作成功，则返回一个包含文件实体的 BaseResponse；若请求失败或遇到错误，则可能返回 undefined。
 */
const GetStudentTemplateAPI = async (): Promise<BaseResponse<FileEntity> | undefined> => {
    return BaseApi<BaseResponse<FileEntity>>(
        MethodType.GET,
        "/api/v1/students/get-template",
        null,
        null,
        null,
        {"Authorization": `Bearer ${GetAuthorizationToken()}`}
    );
}


/**
 * # BatchImportStudentAPI
 * > 该函数用于批量导入学生信息。它接受一个包含学生信息的 Excel 文件的 base64 字符串，并将其发送到指定的后端接口进行处理。
 *
 * @param {string} base64Content - Excel 文件的 base64 编码内容。
 * @param {boolean} ignoreError - 是否忽略错误继续导入。
 * @returns {Promise<BaseResponse<BatchImportResponseDTO> | undefined>} - 如果操作成功，则返回一个包含导入结果的 BaseResponse 对象；若请求失败或遇到错误，则可能返回 undefined。
 */
const BatchImportStudentAPI = async (base64Content: string, ignoreError: boolean): Promise<BaseResponse<BatchImportResponseDTO> | undefined> => {
    return BaseApi<BaseResponse<BatchImportResponseDTO>>(
        MethodType.POST,
        "/api/v1/students/batch-import",
        {
            file: base64Content,
            ignore_error: ignoreError
        },
        null,
        null,
        {"Authorization": `Bearer ${GetAuthorizationToken()}`}
    );
} 

export {
    GetStudentPageAPI,
    GetStudentAPI,
    CreateStudentAPI,
    DisableStudentAPI,
    DeleteStudentAPI,
    EditStudentAPI,
    GetStudentTemplateAPI,
    BatchImportStudentAPI
};