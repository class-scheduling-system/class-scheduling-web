export type DepartmentInfoEntity = {
    /**
     * 行政负责人
     */
    administrative_head?: string;
    /**
     * 分配教学楼
     */
    assigned_teaching_building?: string;
    /**
     * 创建时间，自动填充
     */
    created_at?: number;
    /**
     * 部门地址
     */
    department_address?: string;
    /**
     * 部门编码
     */
    department_code?: string;
    /**
     * 部门英文名称
     */
    department_english_name?: string;
    /**
     * 部门名称
     */
    department_name?: string;
    /**
     * 部门排序 默认100
     */
    department_order?: number;
    /**
     * 部门简称
     */
    department_short_name?: string;
    /**
     * 部门主键，采用 UUID 自动生成
     */
    department_uuid?: string;
    /**
     * 成立日期，默认当前日期
     */
    establishment_date?: string;
    /**
     * 失效日期
     */
    expiration_date?: string;
    /**
     * 固定电话
     */
    fixed_phone?: string;
    /**
     * 是否为上课院系
     */
    is_attending_college?: boolean;
    /**
     * 是否启用
     */
    is_enabled?: boolean;
    /**
     * 是否实体部门
     */
    is_entity?: boolean;
    /**
     * 是否为开课院系
     */
    is_teaching_college?: boolean;
    /**
     * 是否为开课教研室
     */
    is_teaching_office?: boolean;
    /**
     * 上级部门
     */
    parent_department?: string;
    /**
     * 党委负责人
     */
    party_committee_head?: string;
    /**
     * 备注
     */
    remark?: string;
    /**
     * 单位类别
     */
    unit_category?: string;
    /**
     * 单位办别
     */
    unit_type?: string;
    /**
     * 更新时间，自动填充
     */
    updated_at?: number;
}