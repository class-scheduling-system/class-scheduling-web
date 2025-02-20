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
 * 本软件是“按原样”提供的，没有任何形式的明示或暗示的保证，包括但不限于
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

import {TeacherEntity} from "./teacher_entity.ts";
import {TokenEntity} from "./token_entity.ts";
import {UserEntity} from "./user_entity.ts";
import {StudentEntity} from "./student_entity.ts";

/**
 * # UserLoginEntity
 *
 * > 代表用户登录后的实体信息，包括初始化状态、角色特定的数据（如学生或教师）、认证令牌以及用户基本信息。
 *
 * @param {boolean} initialization - 是否是初始化用户，指示用户是否首次使用或未完全注册
 * @param {null | StudentEntity} [student] - 学生数据传输对象，仅在学生登录时有效，其他身份登录则为 null
 * @param {null | TeacherEntity} [teacher] - 教师数据传输对象，仅在教师登录时有效，其他身份登录则为 null
 * @param {null | TokenEntity} [token] - 令牌对象，包含认证信息
 * @param {null | UserEntity} [user] - 用户数据传输对象，若用户未注册则为 null
 *
 * @returns {UserLoginEntity} 返回一个包含用户登录后所有相关信息的对象
 */
export type UserLoginEntity = {
    /**
     * 是否是初始化用户，指示用户是否首次使用或未完全注册
     */
    initialization: boolean;
    /**
     * 学生数据传输对象，仅在学生登录时有效，其他身份登录则为{@code null}
     */
    student?: null | StudentEntity;
    /**
     * 教师数据传输对象，仅在教师登录时有效，其他身份登录则为{@code null}
     */
    teacher?: null | TeacherEntity;
    /**
     * 令牌对象，包含认证信息
     */
    token?: null | TokenEntity;
    /**
     * 用户数据传输对象，若用户未注册则为{@code null}
     */
    user?: null | UserEntity;
}
