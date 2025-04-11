import { BaseApi, GetAuthorizationToken, MethodType } from "../assets/ts/base_api";
import { BaseResponse } from "../models/base_response";
import { CreditHourTypeEntity } from "../models/entity/credit_hour_type_entity";

/**
 * # 获取学时类型列表
 * > 获取系统中所有学时类型的列表，不需要分页
 * 
 * @returns 学时类型列表
 */
const GetCreditHourTypeListAPI = async (): Promise<BaseResponse<CreditHourTypeEntity[]> | undefined> => {
  return BaseApi<BaseResponse<CreditHourTypeEntity[]>>(
    MethodType.GET,
    "/api/v1/credit-hour-type/list",
    null,
    null,
    null,
    { "Authorization": `Bearer ${GetAuthorizationToken()}` }
  );
};

export {
  GetCreditHourTypeListAPI
}; 