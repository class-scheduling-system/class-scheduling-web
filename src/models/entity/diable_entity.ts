/**
 * DisableDTO
 */
export type DisableEntity = {
    /**
     * 是否禁用
     */
    status?: boolean;
    /**
     * 学生UUID
     */
    student_uuid?: string;
    /**
     * 教师UUID
     */
    teacher_uuid?: string;
}