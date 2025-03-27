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

import {JSX} from "react";
import {Link} from "react-router";

/**
 * 创建一个导航链接组件，用于教师界面中显示特定的导航项。
 *
 * @param {Readonly<{title: string, icon: JSX.Element, path: string}>} - 该参数对象包含三个属性：
 * - title: 导航链接显示的文字标题
 * - icon: 与标题一同展示的图标元素
 * - path: 点击导航链接后跳转的目标路径
 *
 * @return {JSX.Element} 返回一个React组件，该组件渲染为一个带有指定标题、图标及目标路径的可点击链接。此链接根据其是否指向当前激活的路由自动应用不同的样式。
 */
export function TeacherNavLinkComponent({title, icon, path}: Readonly<{
    title: string,
    icon: JSX.Element,
    path: string
}>): JSX.Element {

    /**
     * 根据当前路径是否匹配给定的路由，返回相应的CSS类名。
     *
     * @param {string} route - 需要检查的路由路径。
     * @return {string} 如果当前路径与给定的路由匹配，则返回表示激活状态的CSS类名；否则，返回表示非激活状态的CSS类名。
     */
    function selectedRoute(route: string): string {
        if (location.pathname === route) {
            return "bg-primary text-white shadow-md";
        } else {
            return "hover:bg-primary-content hover:text-primary hover:shadow-md transition-all";
        }
    }

    return (
        <Link to={path}
              className={`transition-all duration-200 rounded-lg p-2 flex space-x-2 items-center ${selectedRoute(path)}`}>
            <div className="text-lg">{icon}</div>
            <span className="font-medium">{title}</span>
        </Link>
    );
} 