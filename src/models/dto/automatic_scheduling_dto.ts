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
 * # 自动排课请求VO
 * 
 * 用于请求自动排课的视图对象
 */
export type AutomaticClassSchedulingDTO = {
    /**
     * 学期UUID，对应cs_semester表的semester_uuid
     */
    semester_uuid: string;
    
    /**
     * 院系UUID，对应cs_department表的department_uuid，限定排课范围
     */
    department_uuid: string;
    
    /**
     * 排课策略
     * - OPTIMAL: 最优（优先保证质量，耗时长）
     * - BALANCED: 平衡（质量和速度平衡）
     * - QUICK: 快速（优先保证速度）
     */
    strategy?: "OPTIMAL" | "BALANCED" | "QUICK";
    
    /**
     * 排课约束
     */
    constraints: ConstraintsDTO;
    
    /**
     * 优先级设置
     */
    priority_settings: PrioritySettingsDTO;
    
    /**
     * 时间偏好
     */
    time_preferences: TimePreferencesDTO;
    
    /**
     * 排课范围设置
     */
    scope_settings: ScopeSettingsDTO;
};

/**
 * # 排课约束
 */
export type ConstraintsDTO = {
    /**
     * 是否考虑教师时间偏好
     */
    teacher_preference: boolean;
    
    /**
     * 是否优化教室资源分配
     */
    room_optimization: boolean;
    
    /**
     * 是否避免学生班级冲突
     */
    student_conflict_avoidance: boolean;
    
    /**
     * 是否优先安排连堂课
     */
    consecutive_courses_preferred: boolean;
    
    /**
     * 专业教室匹配(如实验课安排在实验室)
     */
    specialization_room_matching: boolean;
};

/**
 * # 优先级设置
 */
export type PrioritySettingsDTO = {
    /**
     * 课程类型优先级设置
     */
    course_types?: CourseTypePriorityVO[];
};

/**
 * # 课程类型优先级
 */
export type CourseTypePriorityVO = {
    /**
     * 课程类型UUID
     */
    course_type_uuid: string;
    
    /**
     * 优先级（1-10，数字越大优先级越高）
     */
    priority_level: number;
};

/**
 * # 时间偏好
 */
export type TimePreferencesDTO = {
    /**
     * 是否避免晚间课程安排
     */
    avoid_evening_courses: boolean;
    
    /**
     * 是否平衡周内课程分布
     */
    balance_weekday_courses: boolean;
    
    /**
     * 优先时间段
     */
    preferred_time_slots?: PreferredTimeSlotVO[];
};

/**
 * # 优先时间段
 */
export type PreferredTimeSlotVO = {
    /**
     * 星期几（1-7，对应周一到周日）
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
     * 优先级（1-10，数字越大优先级越高）
     */
    priority_level: number;
};

/**
 * # 排课范围设置
 */
export type ScopeSettingsDTO = {
    /**
     * 指定课程ID列表
     */
    specific_course_ids?: SpecificCourseIdVO[];
    
    /**
     * 允许的教学楼ID列表
     */
    allowed_building_ids?: string[];
};

/**
 * # 特定课程ID视图对象
 */
export type SpecificCourseIdVO = {
    /**
     * 课程ID
     */
    course_id: string;
    
    /**
     * 班级ID列表，如果是选修课则为[null]
     */
    class_id: string[] | null[];
    
    /**
     * 人数，如果是必修课则为班级人数总和
     */
    number: number | null;
    
    /**
     * 周学时
     */
    weekly_hours: number;
    
    /**
     * 课程类型
     * - THEORY: 理论课
     * - PRACTICE: 实践课
     * - MIXED: 混合课
     */
    course_enu_type: "THEORY" | "PRACTICE" | "MIXED" | "EXPERIMENT" | "COMPUTER" | "OTHER";
    
    /**
     * 是否单周排课
     */
    is_odd_week: boolean;
    
    /**
     * 开始周
     */
    start_week: number;
    
    /**
     * 结束周
     */
    end_week: number;
};

/**
 * # 排课任务DTO
 */
export type SchedulingTaskDTO = {
    /**
     * 排课任务ID
     */
    task_id: string;
    
    /**
     * 学期主键
     */
    semester_uuid: string;
    
    /**
     * 部门主键
     */
    department_uuid: string;
    
    /**
     * 任务状态
     * - processing: 处理中
     * - completed: 已完成
     * - failed: 失败
     */
    status: "PROCESSING" | "COMPLETED" | "FAILED";
    
    /**
     * 预计完成时间(秒)
     */
    estimated_time: number;
    
    /**
     * 任务创建时间（时间戳）
     */
    created_at: number;
    
    /**
     * 创建用户UUID
     */
    created_by: string;
}; 