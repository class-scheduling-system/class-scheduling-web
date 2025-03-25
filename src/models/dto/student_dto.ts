/**
 * 学生视图对象,包含从前端传入的学生信息
 *
 * StudentVO
 */
export type StudentDTO = {
    /**
     * 班级名称
     */ 
    clazz: string;
    /**
     * 性别
     */
    gender: boolean;
    /**
     * 学生学号
     */
    id: string;
    /**
     * 学生姓名
     */
    name: string;
}
