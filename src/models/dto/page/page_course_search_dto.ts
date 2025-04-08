/*
 * --------------------------------------------------------------------------------
 * Copyright (c) 2022-NOW(至今) 锋楪技术团队
 * Author: 锋楪技术团队 (https://www.frontleaves.com)
 *
 * 本文件包含锋楪技术团队项目的源代码，项目的所有源代码均遵循 MIT 开源许可证协议。
 * --------------------------------------------------------------------------------
 */

/**
 * # 课程分页搜索DTO
 * > 用于课程分页搜索的数据传输对象，包含部门UUID筛选
 */
export type PageCourseSearchDTO = {
    /** 页码 */
    page: number;
    /** 每页大小 */
    size: number;
    /** 是否降序排序 */
    is_desc: boolean;
    /** 搜索关键字 */
    keyword?: string;
    /** 部门UUID */
    department_uuid?: string;
    /** 索引签名，解决类型兼容问题 */
    [key: string]: unknown;
} 