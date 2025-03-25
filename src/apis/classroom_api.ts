import { BaseApi, GetAuthorizationToken, MethodType } from "../assets/ts/base_api"
import { BaseResponse } from "../models/base_response";
import { ClassroomInfoEntity } from "../models/entity/classroom_info_entity";
import { ClassroomTagEntity } from "../models/entity/classroom_tag_entity";
import { ClassroomTypeEntity } from "../models/entity/classroom_type_entity";
import { PageEntity } from "../models/entity/page_entity";
import { PageClassroomDTO } from "../models/dto/page/page_classroom_dto";
import { ClassroomLiteEntity } from "../models/entity/classroom_lite_entity";
import { ClassroomDTO } from "../models/dto/classroom_dto";
/**
 * # 获取教室标签列表
 * > 获取教室标签列表, 用于在创建教室时选择标签
 * 
 * @returns 教室标签列表
 */
const GetClassroomTagsAPI = async (): Promise<BaseResponse<ClassroomTagEntity[]> | undefined> => {
    return BaseApi<ClassroomTagEntity[]>(
        MethodType.GET,
        "/api/v1/classroom/tags",
        null,
        null,
        null,
        { "Authorization": `Bearer ${GetAuthorizationToken()}` }
    );
}

/**
 * # 获取教室类型列表
 * > 获取教室类型列表, 用于在创建教室时选择类型
 * 
 * @returns 教室类型列表
 */
const GetClassroomTypeAPI = async (): Promise<BaseResponse<ClassroomTypeEntity[]> | undefined> => {
    return BaseApi<ClassroomTypeEntity[]>(
        MethodType.GET,
        "/api/v1/classroom/types",
        null,
        null,
        null,
        { "Authorization": `Bearer ${GetAuthorizationToken()}` }
    );
}

/**
 * # 获取教室分页列表
 * > 获取教室分页列表, 用于在创建教室时选择类型
 * 
 * @returns 教室分页列表
 */
const GetClassroomPageAPI = async (data: PageClassroomDTO): Promise<BaseResponse<PageEntity<ClassroomInfoEntity>> | undefined> => {
    return BaseApi<PageEntity<ClassroomInfoEntity>>(
        MethodType.GET,
        "/api/v1/classroom/page",
        null,
        data,
        null,
        { "Authorization": `Bearer ${GetAuthorizationToken()}` }
    );
}

/**
 * # 获取教室列表
 * > 获取教室列表, 用于在创建教室时选择类型
 * 
 * @returns 教室列表
 */
const GetClassroomListAPI = async (keyword?: string): Promise<BaseResponse<ClassroomLiteEntity[]> | undefined> => {
    return BaseApi<ClassroomLiteEntity[]>(
        MethodType.GET,
        "/api/v1/classroom/list",
        null,
        { keyword },
        null,
        { "Authorization": `Bearer ${GetAuthorizationToken()}` }
    );
}

/**
 * # 创建教室
 * > 创建教室, 用于在创建教室时选择类型
 * 
 * @param data 教室信息
 * @returns 教室信息
 */
const CreateClassroomAPI = async (data: ClassroomDTO): Promise<BaseResponse<ClassroomInfoEntity> | undefined> => {
    return BaseApi<ClassroomInfoEntity>(
        MethodType.POST,
        "/api/v1/classroom/create",
        data,
        null,
        null,
        { "Authorization": `Bearer ${GetAuthorizationToken()}` }
    );
}

/** 
 * # 更新教室
 * > 更新教室, 用于在更新教室时选择类型
 * 
 * @param data 教室信息
 */
const UpdateClassroomAPI = async (classroomUuid: string, data: ClassroomDTO): Promise<BaseResponse<ClassroomInfoEntity> | undefined> => {
    return BaseApi<ClassroomInfoEntity>(
        MethodType.PUT,
        "/api/v1/classroom/",
        data,
        null,
        classroomUuid,
        { "Authorization": `Bearer ${GetAuthorizationToken()}` }
    );
}

/**
 * # 删除教室
 * > 删除教室, 用于在删除教室时选择类型
 * 
 * @param classroomUuid 教室主键
 */
const DeleteClassroomAPI = async (classroomUuid: string): Promise<BaseResponse<ClassroomInfoEntity> | undefined> => {
    return BaseApi<ClassroomInfoEntity>(
        MethodType.DELETE,
        "/api/v1/classroom/",
        null,
        null,
        classroomUuid,
        { "Authorization": `Bearer ${GetAuthorizationToken()}` }
    );
}

export {
    GetClassroomTagsAPI,
    GetClassroomTypeAPI,
    GetClassroomPageAPI,
    GetClassroomListAPI,
    CreateClassroomAPI,
    UpdateClassroomAPI,
    DeleteClassroomAPI
};