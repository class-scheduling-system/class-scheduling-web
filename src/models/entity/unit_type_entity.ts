/**
 * UnitTypeDTO
 */
export type UnitTypeEntity = {
    /**
     * 创建时间
     */
    created_at?: number;
    /**
     * 单位英文名称
     */
    english_name?: string;
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
    /**
     * 更新时间
     */
    updated_at?: number;
}