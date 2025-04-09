/*
 * --------------------------------------------------------------------------------
 * Copyright (c) 2022-NOW(至今) 锋楪技术团队
 * Author: 锋楪技术团队 (https://www.frontleaves.com)
 *
 * 本文件包含锋楪技术团队项目的源代码，项目的所有源代码均遵循 MIT 开源许可证协议。
 * --------------------------------------------------------------------------------
 * 许可证声明：
 *
 * 版权所有 (c) 2022-2025 锋楪技术团队。保留所有权利。
 *
 * 本软件是"按原样"提供的，没有任何形式的明示或暗示的保证，包括但不限于
 * 对适销性、特定用途的适用性和非侵权性的暗示保证。在任何情况下，
 * 作者或版权持有人均不承担因软件或软件的使用或其他交易而产生的、
 * 由此引起的或以任何方式与此软件有关的任何索赔、损害或其他责任。
 *
 * 使用本软件即表示您了解此声明并同意其条款。
 *
 * 有关 MIT 许可证的更多信息，请查看项目根目录下的 LICENSE 文件或访问：
 * https://opensource.org/licenses/MIT
 * --------------------------------------------------------------------------------
 * 免责声明：
 *
 * 使用本软件的风险由用户自担。作者或版权持有人在法律允许的最大范围内，
 * 对因使用本软件内容而导致的任何直接或间接的损失不承担任何责任。
 * --------------------------------------------------------------------------------
 */

/**
 * # 教学班实体
 * 
 * > 教学班完整信息实体类
 */
export type TeachingClassEntity = {
    /**
     * 教学班UUID
     */
    teaching_class_uuid: string;
    
    /**
     * 学期UUID
     */
    semester_uuid: string;
    
    /**
     * 学期名称
     */
    semester_name: string;
    
    /**
     * 课程UUID
     */
    course_uuid: string;
    
    /**
     * 课程名称
     */
    course_name: string;
    
    /**
     * 教学班编号
     */
    teaching_class_code: string;
    
    /**
     * 教学班名称
     */
    teaching_class_name: string;
    
    /**
     * 行政班级字符串，多个行政班级用逗号分隔
     */
    administrative_classes: string;
    
    /**
     * 行政班级列表
     */
    administrative_class_list: Record<string, unknown>[];
    
    /**
     * 行政班级名称列表
     */
    administrative_class_names: string[];
    
    /**
     * 是否为行政班
     */
    is_administrative: boolean;
    
    /**
     * 班级人数
     */
    class_size: number;
    
    /**
     * 实际学生人数
     */
    actual_student_count: number;
    
    /**
     * 课程所属部门UUID
     */
    course_department_uuid: string;
    
    /**
     * 课程所属部门名称
     */
    course_department_name: string;
    
    /**
     * 描述
     */
    description?: string;
    
    /**
     * 是否启用
     */
    is_enabled: boolean;
    
    /**
     * 创建时间
     */
    created_at: number;
    
    /**
     * 更新时间
     */
    updated_at: number;
};

/**
 * # 教学班简要信息实体
 * 
 * > 教学班简要信息实体类，用于列表展示
 */
export type TeachingClassLiteEntity = {
    /**
     * 教学班UUID
     */
    teaching_class_uuid: string;
    
    /**
     * 教学班编号
     */
    teaching_class_code: string;
    
    /**
     * 教学班名称
     */
    teaching_class_name: string;
    
    /**
     * 课程UUID
     */
    course_uuid: string;
    
    /**
     * 课程名称
     */
    course_name: string;
    
    /**
     * 学期UUID
     */
    semester_uuid: string;
    
    /**
     * 学期名称
     */
    semester_name: string;
    
    /**
     * 课程所属部门UUID
     */
    course_department_uuid: string;
    
    /**
     * 课程所属部门名称
     */
    course_department_name: string;
    
    /**
     * 实际学生人数
     */
    actual_student_count: number;
    
    /**
     * 是否启用
     */
    is_enabled: boolean;
    
    /**
     * 创建时间
     */
    created_at: string;
    
    /**
     * 更新时间
     */
    updated_at: string;
}; 