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

import { ReactNode } from "react";
import { Link } from "react-router";

/**
 * # 面包屑导航组件
 * 
 * 使用DaisyUI的breadcrumbs组件创建的面包屑导航。
 * 通常与BreadcrumbItem组件一起使用。
 * 
 * @param children - 导航项目，通常是BreadcrumbItem组件
 * @returns 面包屑导航组件
 */
export function Breadcrumb({ children }: { children: ReactNode }) {
  return (
    <div className="breadcrumbs text-sm mb-4">
      <ul>
        {children}
      </ul>
    </div>
  );
}

/**
 * # 面包屑导航项组件
 * 
 * 面包屑导航中的单个项目。
 * 如果传入active属性，则该项目将显示为活动状态（当前页面）。
 * 
 * @param href - 链接地址，当active为true时可选
 * @param active - 是否为当前活动页面
 * @param children - 导航项的文本内容
 * @returns 面包屑导航项组件
 */
export function BreadcrumbItem({ 
  href, 
  active, 
  children 
}: { 
  href?: string; 
  active?: boolean; 
  children: ReactNode 
}) {
  return (
    <li className={active ? "font-medium" : ""}>
      {active ? (
        <span>{children}</span>
      ) : (
        <Link to={href || "#"}>{children}</Link>
      )}
    </li>
  );
} 