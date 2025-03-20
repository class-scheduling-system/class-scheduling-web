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

import {JSX, ReactNode} from "react";

interface FormSectionProps {
    title: string;
    icon?: JSX.Element;
    children: ReactNode;
    className?: string;
    badgeColor?: string;
}

/**
 * # FormSectionComponent
 * > 一个用于创建表单分区的组件，带有标题和图标。
 *
 * @param title - 分区标题
 * @param icon - 分区图标
 * @param children - 子元素
 * @param className - 额外的CSS类名
 * @param badgeColor - 徽章颜色
 * @returns JSX.Element - 返回表单分区组件
 */
export function FormSectionComponent({
    title,
    icon,
    children,
    className = "",
    badgeColor = "badge-primary"
}: Readonly<FormSectionProps>): JSX.Element {
    return (
        <div className={`card bg-base-100 border border-base-200 ${className}`}>
            <div className="card-body">
                <h2 className="card-title text-lg font-semibold flex items-center mb-4">
                    {icon && (
                        <div className={`badge ${badgeColor} p-3 mr-2`}>
                            {icon}
                        </div>
                    )}
                    {title}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {children}
                </div>
            </div>
        </div>
    );
}
