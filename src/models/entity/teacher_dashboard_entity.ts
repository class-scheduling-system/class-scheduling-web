/**
 * 教师仪表盘统计数据实体
 */
export type TeacherDashboardEntity = {
    /**
     * 课程总数
     */
    course_count: number;
    
    /**
     * 学生总数
     */
    student_count: number;
    
    /**
     * 班级总数
     */
    class_count: number;
    
    /**
     * 总课时数
     */
    total_hours: number;
    
    /**
     * 班级详情
     */
    class_details: ClassDetail[];
}

/**
 * 班级详情信息
 */
export type ClassDetail = {
    /**
     * 教学班UUID
     */
    teaching_class_uuid: string;
    
    /**
     * 教学班名称
     */
    teaching_class_name: string;
    
    /**
     * 课程名称
     */
    course_name: string;
    
    /**
     * 学生数量
     */
    student_count: number;
    
    /**
     * 总课时
     */
    total_hours: number;
    
    /**
     * 学时类型
     */
    credit_hour_type: string;
} 