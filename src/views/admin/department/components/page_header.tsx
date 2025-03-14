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

import {Attention, Back, BuildingOne, Down, Up} from "@icon-park/react";
import {JSX} from "react";

interface PageHeaderProps {
    onBack: () => void;
    showHelpText: boolean;
    toggleHelpText: () => void;
}

/**
 * # 页面标题组件
 * > 显示页面标题和导航按钮
 */
export function PageHeader({
    onBack,
    showHelpText,
    toggleHelpText
}: Readonly<PageHeaderProps>): JSX.Element {
    return (
        <>
            {/* 页面标题和导航 */}
            <div className="flex justify-between items-center mb-4 bg-base-200 p-4 rounded-lg shadow-sm">
                <h1 className="text-2xl font-bold flex items-center text-primary">
                    <BuildingOne theme="filled" size="28" className="mr-2" fill="currentColor"/>
                    添加部门
                </h1>
                <div className="flex space-x-2">
                    <button
                        onClick={onBack}
                        className="btn btn-outline btn-primary"
                    >
                        <Back theme="outline" size="18"/>
                        <span>返回列表</span>
                    </button>
                </div>
            </div>

            {/* 页面说明 */}
            <div className="alert alert-warning mb-6 shadow-sm">
                <Attention theme="filled" size="20"/>
                <span>在此页面添加新的部门信息。带有 <span className="text-error font-bold">*</span> 的字段为必填项。</span>
                <div className="flex-none">
                    <button className="btn btn-sm btn-ghost" onClick={toggleHelpText}>
                        {showHelpText ? "隐藏提示" : "显示提示"}
                        {showHelpText ? <Up theme="outline" size="16"/> : <Down theme="outline" size="16"/>}
                    </button>
                </div>
            </div>
        </>
    );
}
