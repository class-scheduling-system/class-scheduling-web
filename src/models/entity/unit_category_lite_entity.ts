/**
 * 单位类别精简DTO
 * <p>
 * 用于传输单位类别的简要信息，适用于列表查询等场景
 * </p>
 *
 * UnitCategoryLiteDTO
 */
export type UnitCategoryLiteEntity = {
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
}
