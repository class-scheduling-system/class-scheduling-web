/**
 * 教师简单信息数据传输对象
 * <p>
 * 该类用于传输教师的基本信息，包括教师UUID、姓名、部门和类型等。
 * 主要用于列表展示等不需要完整教师信息的场景。
 * </p>
 */
export type TeacherLiteEntity = {
    /**
     * 部门名称
     */
    department_name: string;
    /**
     * 教师姓名
     */
    teacher_name: string;
    /**
     * 教师类型名称
     */
    teacher_type_name: string;
    /**
     * 教师UUID
     */
    teacher_uuid: string;
}