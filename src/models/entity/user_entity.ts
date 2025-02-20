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

import {RoleEntity} from "./role_entity.ts";

/**
 * # UserEntity
 * > 代表用户实体的数据结构，用于存储用户的详细信息，包括但不限于用户的联系方式、权限以及角色等。
 *
 * @param {number} ban - 用户是否被禁止的标志，通常0表示未被禁止，1表示已被禁止。
 * @param {number} created_at - 用户账户创建的时间戳。
 * @param {string} email - 用户注册时使用的电子邮件地址。
 * @param {string} name - 用户的名字或昵称。
 * @param {string[]} [permission] - 可选参数，用户所拥有的权限列表。
 * @param {string} phone - 用户的联系电话。
 * @param {RoleEntity} role - 用户的角色对象，定义了用户在系统中的角色。
 * @param {number} status - 用户当前的状态代码，具体的含义依赖于应用上下文。
 * @param {number} updated_at - 用户信息最后一次更新的时间戳。
 * @param {string} user_uuid - 用户的唯一标识符。
 */
export type UserEntity = {
    ban: number;
    created_at: number;
    email: string;
    name: string;
    permission?: string[];
    phone: string;
    role: RoleEntity;
    status: number;
    updated_at: number;
    user_uuid: string;
}
