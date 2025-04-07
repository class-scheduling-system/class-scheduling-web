/*
 * --------------------------------------------------------------------------------
 * Copyright (c) 2022-NOW(至今) 锋楪技术团队
 * Author: 锋楪技术团队 (https://www.frontleaves.com)
 *
 * 本文件包含锋楪技术团队项目的源代码，项目的所有源代码均遵循 MIT 开源许可证协议。
 * --------------------------------------------------------------------------------
 */

import { BaseApi, GetAuthorizationToken, MethodType } from "../assets/ts/base_api";
import { BaseResponse } from "../models/base_response";
import { AcademicAffairsEntity } from "../models/entity/academic_affairs_entity";

/**
 * # 获取当前学术事务信息
 * > 该方法用于获取当前登录用户的教务权限信息。如果用户具有教务权限，
 * > 则返回对应的权限信息；如果用户没有教务权限，则返回空数据。
 *
 * @returns {Promise<BaseResponse<AcademicAffairsEntity> | undefined>} - 返回一个Promise，解析为包含学术事务信息的BaseResponse对象或undefined
 * @throws {Error} 当网络请求过程中遇到问题时抛出异常
 */
const GetCurrentAcademicAffairsAPI = async (): Promise<BaseResponse<AcademicAffairsEntity> | undefined> => {
    return BaseApi<BaseResponse<AcademicAffairsEntity>>(
        MethodType.GET,
        "/api/v1/academic-affairs/current",
        null,
        null,
        null,
        { "Authorization": `Bearer ${GetAuthorizationToken()}` }
    );
};

export {
    GetCurrentAcademicAffairsAPI
}; 