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
 * # 课程时间安排DTO
 * 
 * 用于表示课程的时间安排
 */
export type ClassTimeDTO = {
    /**
     * 星期几 (例如，1代表周一, 2代表周二)
     */
    day_of_week: number;
    
    /**
     * 开始节次
     */
    period_start: number;
    
    /**
     * 结束节次
     */
    period_end: number;
    
    /**
     * 周次列表，例如 [1, 2, 3, 4, 5] 表示第1-5周
     */
    week_numbers: number[];
}

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
     * 教学班UUID
     */
    teaching_class_uuid: string;
    
    /**
     * 课程归属
     */
    course_ownership: string;
    
    /**
     * 教学班名称
     */
    teaching_class_name: string;
    
    /**
     * 行政班级UUID列表
     */
    administrative_class_uuids?: string[];
    
    /**
     * 学生数量
     */
    student_count?: number;
    
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
     * 教学校区
     */
    teaching_campus: string;
    
    /**
     * 上课时间
     */
    class_time: ClassTimeDTO[];
    
    /**
     * 连堂课节数
     */
    consecutive_sessions: number;
    
    /**
     * 指定时间（可选）
     */
    specified_time?: string;
    
    /**
     * 备注（可选）
     */
    remarks?: string;
}

/**
 * # 排课调整详情DTO
 */
export type AdjustmentDetailsDTO = {
    /**
     * 新教室ID（可选）
     */
    classroom_id?: string;
    
    /**
     * 新教师ID（可选）
     */
    teacher_id?: string;
    
    /**
     * 新时间安排（可选）
     */
    class_time?: ClassTimeDTO[];
    
    /**
     * 连堂节数（可选）
     */
    consecutive_sessions?: number;
    
    /**
     * 排课优先级（可选）
     */
    scheduling_priority?: number;
}

/**
 * # 教学班调整DTO
 */
export type AdjustTeachingClassDTO = {
    /**
     * 教学班UUID
     */
    teaching_class_uuid: string;
    
    /**
     * 教学班编号（可选）
     */
    teaching_class_code?: string;
    
    /**
     * 教学班名称（可选）
     */
    teaching_class_name?: string;
    
    /**
     * 行政班级UUID（可选）
     */
    administrative_class_uuids?: string[];
    
    /**
     * 实际学生人数（可选）
     */
    actual_student_count?: number;
    
    /**
     * 描述（可选）
     */
    description?: string;
}

/**
 * # 排课调整DTO
 * 
 * 用于调整排课分配的数据传输对象
 */
export type AdjustmentDTO = {
    /**
     * 排课分配ID
     */
    assignment_id: string;
    
    /**
     * 具体的调整内容
     */
    adjustments: AdjustmentDetailsDTO;
    
    /**
     * 教学班调整
     */
    adjust_teaching_class: AdjustTeachingClassDTO;
    
    /**
     * 是否忽略可能产生的冲突，默认false
     */
    ignore_conflicts?: boolean;
    
    /**
     * 调整原因（可选）
     */
    reason?: string;
} 