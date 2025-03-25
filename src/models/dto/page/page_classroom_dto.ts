export type PageClassroomDTO = {
    /**
     * 是否按降序排序，默认值为true
     */
    is_desc: boolean;
    /**
     * 查询的关键字，可选参数
     */
    keyword?: string;
    /**
     * 分页的页码，从1开始，默认值为1
     */
    page: number;
    /**
     * 每页显示的数据条数，默认值为20，最大值为200
     */
    size: number;
    /**
     * 查询的标签，可选参数
     */
    tag?: string;
    /**
     * 查询的类型，可选参数
     */
    type?: string;
}
