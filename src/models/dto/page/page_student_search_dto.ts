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
}