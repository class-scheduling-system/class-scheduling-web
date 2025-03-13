/*
 * --------------------------------------------------------------------------------
 * Copyright (c) 2022-NOW(至今) 锋楪技术团队
 * Author: 锋楪技术团队 (https://www.frontleaves.com)
 *
 * 本文件包含锋楪技术团队项目的源代码，项目的所有源代码均遵循 MIT 开源许可证协议。
 * --------------------------------------------------------------------------------
 * 许可证声明：
 *
 * 版权所有 (c) 2022-2025 锋楪技术团队。保留所有权利。
 *
 * 本软件是“按原样”提供的，没有任何形式的明示或暗示的保证，包括但不限于
 * 对适销性、特定用途的适用性和非侵权性的暗示保证。在任何情况下，
 * 作者或版权持有人均不承担因软件或软件的使用或其他交易而产生的、
 * 由此引起的或以任何方式与此软件有关的任何索赔、损害或其他责任。
 *
 * 使用本软件即表示您了解此声明并同意其条款。
 *
 * 有关 MIT 许可证的更多信息，请查看项目根目录下的 LICENSE 文件或访问：
 * https://opensource.org/licenses/MIT
 * --------------------------------------------------------------------------------
 * 免责声明：
 *
 * 使用本软件的风险由用户自担。作者或版权持有人在法律允许的最大范围内，
 * 对因使用本软件内容而导致的任何直接或间接的损失不承担任何责任。
 * --------------------------------------------------------------------------------
 */

/**
 * DepartmentDTO
 */
export type DepartmentEntity = {
    /**
     * 行政负责人
     */
    administrative_head?: string;
    /**
     * 分配教学楼
     */
    assigned_teaching_building?: string;
    /**
     * 创建时间
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
     * 部门主键
     */
    department_uuid?: string;
    /**
     * 成立日期
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
     * 更新时间
     */
    updated_at?: number;
}
