/*
 * --------------------------------------------------------------------------------
 * Copyright (c) 2022-NOW(至今) 锋楪技术团队
 * Author: 锋楪技术团队 (https://www.frontleaves.com)
 *
 * 本文件包含锋楪技术团队项目的源代码，项目的所有源代码均遵循 MIT 开源许可证协议。
 * --------------------------------------------------------------------------------
 */

/**
 * # 年级实体类
 * > 定义了年级信息的数据实体
 * 
 * @property {string} grade_uuid - 年级UUID主键
 * @property {string} name - 年级名称（如：2020级、2021级）
 * @property {number} year - 入学年份
 * @property {string} start_date - 年级开始日期
 * @property {string} end_date - 年级结束日期
 * @property {string} description - 年级描述
 * @property {number} created_at - 创建时间
 * @property {number} updated_at - 更新时间
 */
export type GradeEntity = {
    /**
     * 年级UUID主键
     */
    grade_uuid: string;
    
    /**
     * 年级名称（如：2020级、2021级）
     */
    name: string;
    
    /**
     * 入学年份
     */
    year: number;
    
    /**
     * 年级开始日期
     */
    start_date: string;
    
    /**
     * 年级结束日期
     */
    end_date: string;
    
    /**
     * 年级描述
     */
    description: string;
    
    /**
     * 创建时间
     */
    created_at: number;
    
    /**
     * 更新时间
     */
    updated_at: number;
} 