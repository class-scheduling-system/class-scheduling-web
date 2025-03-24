/**
 * 单位办别精简DTO
 * <p>
 * 用于传输单位办别的简要信息，适用于列表查询等场景
 * </p>
 *
 * UnitTypeLiteDTO
 */
export type UnitTypeLiteEntity = {
    /**
     * 单位名称
     */
    name?: string;
    /**
     * 单位排序
     */
    order?: number;
    /**
     * 单位简称
     */
    short_name?: string;
    /**
     * 单位办别主键
     */
    unit_type_uuid?: string;
}