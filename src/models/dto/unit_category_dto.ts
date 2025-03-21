/**
 * 包含要添加的单位类别信息的请求体
 *
 * UnitCategoryVO
 */
export type UnitCategoryDTO = {
    /**
     * 单位类别英文名称
     */
    english_name?: string;
    /**
     * 是否实体单位类别
     */
    is_entity: boolean;
    /**
     * 单位类别名称
     */
    name: string;
    /**
     * 单位类别排序
     */
    order?: number;
    /**
     * 单位类别简称
     */
    short_name?: string;
}
