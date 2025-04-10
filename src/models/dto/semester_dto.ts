/*
 * --------------------------------------------------------------------------------
 * Copyright (c) 2022-NOW(至今) 锋楪技术团队
 * Author: 锋楪技术团队 (https://www.frontleaves.com)
 *
 * 本文件包含锋楪技术团队项目的源代码，项目的所有源代码均遵循 MIT 开源许可证协议。
 * --------------------------------------------------------------------------------
 */

/**
 * # 学期数据传输对象
 * > 用于添加或更新学期信息
 */
export type SemesterDTO = {
    /** 学期名称 */
    name: string;
    /** 学期代码 */
    code: string;
    /** 学期描述 */
    description?: string;
    /** 开始日期时间戳（毫秒） */
    start_date: number;
    /** 结束日期时间戳（毫秒） */
    end_date: number;
    /** 是否启用 */
    is_enabled: boolean;
    /** 索引签名，解决类型兼容问题 */
    [key: string]: unknown;
} 