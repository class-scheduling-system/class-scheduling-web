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

import {JSX, ReactNode} from "react";
import {Link, useLocation} from "react-router";

interface TeacherNavLinkComponentProps {
    title: string;
    icon: ReactNode;
    path: string;
}

/**
 * 生成一个教师导航链接组件。
 * 该函数返回一个包含导航链接的组件。
 * @param {TeacherNavLinkComponentProps} props 组件属性
 * @return {JSX.Element} 包含导航链接的组件
 */
export function TeacherNavLinkComponent(props: TeacherNavLinkComponentProps): JSX.Element {
    const location = useLocation();

    // 判断当前路由是否被选中
    function selectedRoute(): boolean {
        return location.pathname.startsWith(props.path);
    }

    return (
        <Link to={props.path}
              className={`flex items-center px-4 py-2.5 rounded-xl group relative overflow-hidden ${
                  selectedRoute()
                      ? "text-primary-content"
                      : "text-gray-600 hover:text-primary-content"
              }`}>
            <div className={`absolute inset-0 transition-opacity duration-300 ease-in-out opacity-0 bg-gradient-to-r from-secondary/20 to-primary/20 ${
                selectedRoute() ? "opacity-100" : "group-hover:opacity-100"
            }`} />
            <div className={`relative z-10 mr-3 transition-all duration-300 ease-in-out transform ${
                selectedRoute() 
                    ? "text-primary scale-110" 
                    : "text-gray-400 group-hover:text-primary group-hover:scale-110"
            }`}>
                {props.icon}
            </div>
            <span className={`relative z-10 text-sm font-medium transition-all duration-300 ease-in-out ${
                selectedRoute()
                    ? "bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent"
                    : "group-hover:text-primary"
            }`}>
                {props.title}
            </span>
        </Link>
    );
} 