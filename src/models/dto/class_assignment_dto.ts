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
 * # 排课分配DTO
 * 
 * 用于请求创建排课分配的数据传输对象
 */
export type ClassAssignmentDTO = {
    /**
     * 学期UUID
     */
    semester_uuid: string;
    
    /**
     * 课程UUID
     */
    course_uuid: string;
    
    /**
     * 教师UUID
     */
    teacher_uuid: string;
    
    /**
     * 教室UUID
     */
    classroom_uuid: string;
    
    /**
     * 教学班组成
     */
    teaching_class_composition: string;
    
    /**
     * 课程归属
     */
    course_ownership: string;
    
    /**
     * 教学班名称
     */
    teaching_class_name: string;
    
    /**
     * 学时类型
     */
    credit_hour_type: string;
    
    /**
     * 教学学时
     */
    teaching_hours: number;
    
    /**
     * 已排学时
     */
    scheduled_hours: number;
    
    /**
     * 总学时
     */
    total_hours: number;
    
    /**
     * 排课优先级
     */
    scheduling_priority: number;
    
    /**
     * 班级人数
     */
    class_size: number;
    
    /**
     * 教学校区
     */
    teaching_campus: string;
    
    /**
     * 上课时间
     */
    class_time: string;
    
    /**
     * 连堂课节数
     */
    consecutive_sessions: number;
    
    /**
     * 教室类型
     */
    classroom_type: string;
    
    /**
     * 指定教室
     */
    designated_classroom: string;
    
    /**
     * 指定教学楼
     */
    designated_teaching_building: string;
    
    /**
     * 指定时间
     */
    specified_time: string;
}

/**
 * # 排课调整DTO
 * 
 * 用于调整排课分配的数据传输对象
 */
export type AdjustmentDTO = {
    /**
     * 排课分配UUID
     */
    class_assignment_uuid: string;
    
    /**
     * 教室UUID
     */
    classroom_uuid?: string;
    
    /**
     * 教师UUID
     */
    teacher_uuid?: string;
    
    /**
     * 上课时间
     */
    class_time?: string;
    
    /**
     * 连堂课节数
     */
    consecutive_sessions?: number;
    
    /**
     * 排课优先级
     */
    scheduling_priority?: number;
    
    /**
     * 调整原因
     */
    reason: string;
} 