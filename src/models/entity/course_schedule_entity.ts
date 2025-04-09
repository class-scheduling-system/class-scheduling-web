/**
 * 学期信息
 */
export type SemesterInfoEntity = {
    /**
     * 学期UUID
     */
    semester_uuid: string;
    
    /**
     * 学期名称
     */
    semester_name: string;
    
    /**
     * 开始日期时间戳
     */
    start_date: number;
    
    /**
     * 结束日期时间戳
     */
    end_date: number;
}

/**
 * 课程表项实体
 */
export type ScheduleItemEntity = {
    /**
     * 排课分配UUID
     */
    class_assignment_uuid: string;
    
    /**
     * 课程UUID
     */
    course_uuid: string;
    
    /**
     * 课程名称
     */
    course_name: string;
    
    /**
     * 教师UUID
     */
    teacher_uuid: string;
    
    /**
     * 教师名称
     */
    teacher_name: string;
    
    /**
     * 教学班UUID
     */
    teaching_class_uuid: string;
    
    /**
     * 教学班名称
     */
    teaching_class_name: string;
    
    /**
     * 校区UUID
     */
    campus_uuid: string;
    
    /**
     * 校区名称
     */
    campus_name: string;
    
    /**
     * 教学楼UUID
     */
    building_uuid: string;
    
    /**
     * 教学楼名称
     */
    building_name: string;
    
    /**
     * 教室UUID
     */
    classroom_uuid: string;
    
    /**
     * 教室名称
     */
    classroom_name: string;
    
    /**
     * 学时类型UUID
     */
    credit_hour_type_uuid: string;
    
    /**
     * 学时类型名称
     */
    credit_hour_type_name: string;
    
    /**
     * 总课时
     */
    total_hours: number;
    
    /**
     * 星期几 (1-7 代表周一至周日)
     */
    day_of_week: number;
    
    /**
     * 开始节次
     */
    start_slot: number;
    
    /**
     * 结束节次
     */
    end_slot: number;
    
    /**
     * 连续课时数
     */
    consecutive_sessions: number;
    
    /**
     * 周次
     */
    week: number;
}

/**
 * 课程表数据实体
 */
export type CourseScheduleEntity = {
    /**
     * 学期信息
     */
    semester: SemesterInfoEntity;
    
    /**
     * 课程表项列表
     */
    schedule_items: ScheduleItemEntity[];
} 