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
 * 课程库添加请求对象，包含需要验证的课程库信息
 */
export type CourseLibraryDTO = {
    /**
     * 课程ID
     */
    id: string;
    /**
     * 课程名称
     */
    name: string;
    /**
     * 课程英文名称
     */
    english_name?: string;
    /**
     * 课程类别
     */
    category?: string;
    /**
     * 课程属性
     */
    property?: string;
    /**
     * 课程类型
     */
    type: string;
    /**
     * 课程性质
     */
    nature?: string;
    /**
     * 所属院系
     */
    department: string;
    /**
     * 是否启用
     */
    is_enabled: boolean;
    /**
     * 总课时
     */
    total_hours: number;
    /**
     * 周课时
     */
    week_hours: number;
    /**
     * 理论课时
     */
    theory_hours: number;
    /**
     * 实验课时
     */
    experiment_hours: number;
    /**
     * 实践课时
     */
    practice_hours: number;
    /**
     * 上机课时
     */
    computer_hours: number;
    /**
     * 其他课时
     */
    other_hours: number;
    /**
     * 学分
     */
    credit: number;
    /**
     * 理论教室类型
     */
    theory_classroom_type?: string;
    /**
     * 实验教室类型
     */
    experiment_classroom_type?: string;
    /**
     * 实践教室类型
     */
    practice_classroom_type?: string;
    /**
     * 上机教室类型
     */
    computer_classroom_type?: string;
    /**
     * 课程描述
     */
    description?: string;
}