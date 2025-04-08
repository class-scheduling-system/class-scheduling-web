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
 * 课程安排实体
 */
export type ScheduleEntity = {
    /**
     * 课程安排ID
     */
    id: number;
    
    /**
     * 课程名称
     */
    course: string;
    
    /**
     * 授课教师
     */
    teacher: string;
    
    /**
     * 教室
     */
    classroom: string;
    
    /**
     * 上课时间
     */
    time: string;
    
    /**
     * 班级
     */
    class: string;
    
    /**
     * 学期
     */
    semester: string;
};

/**
 * 教室实体
 */
export type ClassroomEntity = {
    /**
     * 教室ID
     */
    id: number;
    
    /**
     * 教室名称
     */
    name: string;
    
    /**
     * 所属教学楼
     */
    building: string;
    
    /**
     * 容量
     */
    capacity: number;
    
    /**
     * 设施
     */
    facilities: string;
    
    /**
     * 状态
     */
    status: string;
};

/**
 * 课程表单元格实体
 */
export type ScheduleGridCell = {
    /**
     * 课程ID
     */
    id?: number;
    
    /**
     * 课程名称
     */
    courseName?: string;
    
    /**
     * 教师姓名
     */
    teacherName?: string;
    
    /**
     * 教室
     */
    classroom?: string;
    
    /**
     * 行跨度（用于连堂课）
     */
    rowSpan?: number;
    
    /**
     * 是否被上一行连堂课占用
     */
    isOccupied?: boolean;
};

/**
 * 课程表实体
 */
export type ScheduleGridEntity = {
    /**
     * 行信息（代表时间段）
     */
    rows: string[];
    
    /**
     * 列信息（代表星期）
     */
    columns: string[];
    
    /**
     * 课程表数据
     */
    grid: ScheduleGridCell[][];
}; 