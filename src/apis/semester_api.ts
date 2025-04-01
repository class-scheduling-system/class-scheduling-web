import { BaseApi, GetAuthorizationToken, MethodType } from "../assets/ts/base_api";
import { SemesterEntity } from "../models/entity/semester_entity";
import { BaseResponse } from "../models/base_response";
import { PageEntity } from "../models/entity/page_entity";
import { PageSearchDTO } from "../models/dto/page/page_search_dto";


/**
 * # 获取学期列表
 * > 获取学期列表, 支持分页搜索, 支持排序, 支持关键词搜索
 * 
 * @param data 分页搜索数据
 * @returns 分页列表
 */
const GetSemesterListAPI = async (data: PageSearchDTO):Promise<BaseResponse<PageEntity<SemesterEntity>> | undefined> => {
    return BaseApi<PageEntity<SemesterEntity>>(
        MethodType.GET,
        "/api/v1/semester/page",
        null,
        data,
        null,
        { "Authorization": `Bearer ${GetAuthorizationToken()}` }
    )
}


/**
 * # 获取启用学期列表
 * > 获取启用学期列表
 * 
 * @returns 启用学期列表
 */
const GetEnabledSemesterListAPI = async ():Promise<BaseResponse<SemesterEntity[]> | undefined> => {
    return BaseApi<SemesterEntity[]>(
        MethodType.GET,
        "/api/v1/semester/list",
        null,
        null,
        null,
        { "Authorization": `Bearer ${GetAuthorizationToken()}` }
    )
}



export { GetSemesterListAPI, GetEnabledSemesterListAPI };
