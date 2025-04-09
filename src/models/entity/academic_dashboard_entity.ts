/**
 * 教务仪表盘统计数据实体
 */
export type AcademicDashboardEntity = {
    /**
     * 教师人数
     */
    teacher_count: number;
    
    /**
     * 学生人数
     */
    student_count: number;
    
    /**
     * 专业学生人数统计
     */
    major_student_counts: MajorStudentCount[];
    
    /**
     * 行政班数量
     */
    administrative_class_count: number;
    
    /**
     * 教学班总数
     */
    teaching_class_count: number;
    
    /**
     * 课程库总数
     */
    course_library_count: number;
}

/**
 * 专业学生人数统计
 */
export type MajorStudentCount = {
    /**
     * 专业UUID
     */
    major_uuid: string;
    
    /**
     * 专业名称
     */
    major_name: string;
    
    /**
     * 学生数量
     */
    count: number;
} 