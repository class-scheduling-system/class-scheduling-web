import {BaseApi, GetAuthorizationToken, MethodType} from "../assets/ts/base_api.ts";
import {BaseResponse} from "../models/base_response.ts";


/**
 * 权限实体接口
 */
export interface PermissionEntity {
    permission_uuid: string;
    permission_key: string;
    name: string;
}

/**
 * # 获取权限列表
 * > 该函数用于通过API请求获取权限列表。它利用了Bearer令牌认证方式来确保安全地访问权限数据。
 *
 * @returns {Promise<BaseResponse<PermissionEntity[]> | undefined>} - 返回一个Promise，解析为包含权限信息的BaseResponse对象或undefined，如果请求失败或没有有效响应。
 * @throws {Error} 当网络请求过程中遇到问题时抛出异常。
 */
export const GetPermissionListAPI = async (): Promise<BaseResponse<PermissionEntity[]> | undefined> => {
    return BaseApi<PermissionEntity[]>(
        MethodType.GET,
        "/api/v1/permission/list",
        null,
        null,
        null,
        {Authorization: `Bearer ${GetAuthorizationToken()}`}
    );
};