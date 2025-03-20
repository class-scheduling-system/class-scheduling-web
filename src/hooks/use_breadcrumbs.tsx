import { JSX, useMemo } from "react";
import { Link, useLocation } from "react-router";
import { Home } from "@icon-park/react";
import { adminRouteConfig } from "../models/config/admin_route_config";

/**
 * 生成面包屑导航的自定义Hook
 * @param baseUrl - 基础URL路径（如 '/admin'）
 * @returns 返回面包屑导航项数组
 */
export function useBreadcrumbs(baseUrl: string, routeConfig: Record<string, string> = adminRouteConfig): JSX.Element[] {
    const location = useLocation();

    return useMemo(() => {
        const pathSegments = location.pathname.split('/').filter(segment => segment);
        const breadcrumbItems: JSX.Element[] = [];

        if (pathSegments.length > 1) {
            // 处理主要路径
            const mainSection = pathSegments[1];
            const mainTitle = routeConfig[mainSection] || mainSection;

            breadcrumbItems.push(
                <li key={mainSection} className={"flex items-center space-x-1"}>
                    <Home theme="outline" size="16" />
                    <Link to={`${baseUrl}/${mainSection}`}>{mainTitle}</Link>
                </li>
            );

            // 处理子路径
            if (pathSegments.length > 2) {
                for (let i = 2; i < pathSegments.length; i++) {
                    const subPath = pathSegments[i];
                    const subTitle = getSubPathTitle(subPath);

                    breadcrumbItems.push(
                        <li key={subPath}>
                            <Link to={`${baseUrl}/${pathSegments.slice(1, i + 1).join('/')}`}>
                                {subTitle}
                            </Link>
                        </li>
                    );
                }
            }
        }

        return breadcrumbItems;
    }, [location.pathname, baseUrl]);
}

/**
 * 获取子路径的显示标题
 * @param subPath - 子路径名称
 * @returns 格式化后的显示标题
 */
function getSubPathTitle(subPath: string): string {
    if (subPath.includes('add')) return '添加';
    if (subPath.includes('edit')) return '编辑';
    if (subPath.includes('view')) return '查看';
    if (subPath.includes('delete')) return '删除';
    if (subPath.includes('assign')) return '分配';
    if (subPath.includes('permission')) return '权限';
    return subPath.replace(/-/g, ' ');
}