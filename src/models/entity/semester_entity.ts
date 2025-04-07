/*
 * --------------------------------------------------------------------------------
 * Copyright (c) 2022-NOW(至今) 锋楪技术团队
 * Author: 锋楪技术团队 (https://www.frontleaves.com)
 *
 * 本文件包含锋楪技术团队项目的源代码，项目的所有源代码均遵循 MIT 开源许可证协议。
 * --------------------------------------------------------------------------------
 */

/**
 * # 学期实体
 * > 学期实体定义
 */
export type SemesterEntity = {
    /** 学期UUID */
    semester_uuid: string;
    /** 学期名称 */
    name: string;
    /** 学期描述 */
    description?: string;
    /** 开始日期时间戳（毫秒） */
    start_date: number;
    /** 结束日期时间戳（毫秒） */
    end_date: number;
    /** 是否启用 */
    is_enabled: boolean;
    /** 创建时间戳（毫秒） */
    created_at?: number;
    /** 更新时间戳（毫秒） */
    updated_at?: number;
} 