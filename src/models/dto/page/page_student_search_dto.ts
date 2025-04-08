export type PageStudentSearchDTO = {
    /**
     * 班级名称
     */
    class?: string;
    /**
     * 学生学号
     */
    id?: string;
    /**
     * 是否降序排列,默认为true
     */
    is_desc: boolean;
    /**
     * 是否毕业
     */
    is_graduated: boolean;
    /**
     * 学生姓名
     */
    name?: string;
    /**
     * 页码,从1开始
     */
    page: number;
    /**
     * 每页大小
     */
    size: number;
    /**
     * 学生状态(0:未注册, 1:已注册, 2:已停用)
     */
    status?: string;
    /**
     * 部门UUID，用于根据部门筛选学生
     */
    department_uuid?: string;
}