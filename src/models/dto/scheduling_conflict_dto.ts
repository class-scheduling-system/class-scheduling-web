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
 * 本软件是"按原样"提供的，没有任何形式的明示或暗示的保证，包括但不限于
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
 * # 冲突时间DTO
 */
export type ConflictTimeDTO = {
    /**
     * 冲突发生的周次
     */
    week: number;
    
    /**
     * 冲突发生的星期几
     */
    day: number;
    
    /**
     * 冲突发生的节次
     */
    period: number;
};

/**
 * # 排课冲突DTO
 * 
 * 用于表示排课过程中产生的冲突信息
 */
export type SchedulingConflictDTO = {
    /**
     * 冲突记录UUID
     */
    conflict_uuid: string;
    
    /**
     * 学期UUID
     */
    semester_uuid: string;
    
    /**
     * 第一个冲突排课UUID
     */
    first_assignment_uuid: string;
    
    /**
     * 第二个冲突排课UUID
     */
    second_assignment_uuid: string;
    
    /**
     * 冲突类型
     * 1-教师冲突，2-教室冲突，3-班级冲突
     */
    conflict_type: number;
    
    /**
     * 冲突时间
     */
    conflict_time: ConflictTimeDTO;
    
    /**
     * 冲突描述
     */
    description: string;
    
    /**
     * 解决状态
     * 0-未解决，1-已解决
     */
    resolution_status: number;
    
    /**
     * 解决方法
     * 0-未解决，1-调整第一项，2-调整第二项，3-两项都调整，4-忽略冲突
     */
    resolution_method: number;
    
    /**
     * 解决说明
     */
    resolution_notes: string;
    
    /**
     * 解决人
     */
    resolved_by: string;
    
    /**
     * 解决时间
     */
    resolved_at: number;
    
    /**
     * 创建时间
     */
    created_at: number;
    
    /**
     * 更新时间
     */
    updated_at: number;
}; 