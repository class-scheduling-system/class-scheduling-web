/*
 * --------------------------------------------------------------------------------
 * Copyright (c) 2022-NOW(至今) 锋楪技术团队
 * Author: 锋楪技术团队 (https://www.frontleaves.com)
 *
 * 本文件包含锋楪技术团队项目的源代码，项目的所有源代码均遵循 MIT 开源许可证协议。
 * --------------------------------------------------------------------------------
 */

/**
 * # 学时类型实体
 * 
 * 学时类型实体，用于定义课程的学时类型（如理论学时、实践学时等）
 */
export type CreditHourTypeEntity = {
  /**
   * 学时类型UUID
   */
  credit_hour_type_uuid: string;
  
  /**
   * 学时类型名称
   */
  name: string;
  
  /**
   * 学时类型描述
   */
  description?: string;
  
  /**
   * 课程类型
   */
  course_enu_type?: string;
  
  /**
   * 创建时间
   */
  created_at?: number;
  
  /**
   * 更新时间
   */
  updated_at?: number;
}; 