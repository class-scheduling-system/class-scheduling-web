/**
 * UnitCategoryDTO
 */
export type UnitCategoryEntity = {
    /**
     * 创建时间
     */
    created_at?: number;
    /**
     * 单位类别英文名称
     */
    english_name?: string;
    /**
     * 是否实体单位类别
     */
    is_entity?: boolean;
    /**
     * 单位类别名称
     */
    name?: string;
    /**
     * 单位类别排序
     */
    order?: number;
    /**
     * 单位类别简称
     */
    short_name?: string;
    /**
     * 单位类别主键
     */
    unit_category_uuid?: string;
    /**
     * 更新时间
     */
    updated_at?: number;
}