/**
 * 包含要添加的单位办别信息的请求体
 *
 * UnitTypeVO
 */
export type UnitTypeDTO = {
    /**
     * 单位英文名称
     */
    english_name?: string;
    /**
     * 单位名称
     */
    name: string;
    /**
     * 单位排序
     */
    order?: number;
    /**
     * 单位简称
     */
    short_name?: string;
}
