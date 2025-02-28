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

import {AdminRightCardComponent} from "../../components/admin/admin_reveal_component.tsx";
import {SiteInfoEntity} from "../../models/entity/site_info_entity.ts";
import {useEffect} from "react";
import {Delete, Editor} from "@icon-park/react";
import {AdminAddUserDialog} from "../../components/admin/admin_user_add_dialog.tsx";
import {AdminEditUserDialog} from "../../components/admin/admin_user_edit_dialog.tsx";
import {AdminDeleteUserDialog} from "../../components/admin/admin_user_delete_dialog.tsx";

export function AdminUser({site}: Readonly<{
    site: SiteInfoEntity
}>) {

    useEffect(() => {
        document.title = `用户管理 | ${site.name ?? "Frontleaves Technology"}`;
    }, [site.name]);

    return (
        <>
            <div className={"grid grid-cols-10 gap-6"}>
                <div className={"col-span-7 space-y-6"}>
                    <div className="overflow-x-auto border border-gray-100 rounded-lg shadow-lg">
                        <table className="table table-zebra">
                            {/* 表头 */}
                            <thead>
                            <tr>
                                <th>序号</th>
                                <th>用户名</th>
                                <th>角色</th>
                                <th>邮箱</th>
                                <th className={"text-end"}>操作</th>
                                {/* 新增操作列 */}
                            </tr>
                            </thead>
                            <tbody>
                            {/* 使用循环动态生成表格行 */}
                            {[
                                {id: 1, name: "Cy Ganderton", role: "Quality Control Specialist", email: "Blue"},
                                {id: 2, name: "Hart Hagerty", role: "Desktop Support Technician", email: "Purple"},
                                {id: 3, name: "Brice Swyre", role: "Tax Accountant", email: "Red"},
                            ].map((row, index) => (
                                <tr key={row.id}>
                                    <th>{index + 1}</th>
                                    <td>{row.name}</td>
                                    <td>{row.role}</td>
                                    <td>{row.email}</td>
                                    <td>
                                        <div className="flex gap-2 justify-end">
                                            <button
                                                onClick={() => document.getElementById('my_modal_2').showModal()}
                                                className={"text-xs flex items-center font-medium text-info hover:text-secondary space-x-0.5 cursor-pointer"}
                                            >
                                                <Editor theme="outline" size="14"/>
                                                <span>编辑</span>
                                            </button>

                                            <button
                                                onClick={() => document.getElementById('my_modal_3').showModal()}
                                                className={"text-xs font-medium text-accent hover:text-error" +
                                                    " flex items-center space-x-0.5 cursor-pointer"}>
                                                <Delete theme="outline" size="14"/>
                                                <span>删除</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    <nav aria-label="Page navigation example" className={"w-full flex justify-center"}>
                        <ul className="flex items-center -space-x-px h-8 text-sm">
                            <li>
                                <a href="#"
                                   className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700">
                                    <span className="sr-only">Previous</span>
                                    <svg className="w-2.5 h-2.5 rtl:rotate-180" aria-hidden="true"
                                         xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                              stroke-width="2" d="M5 1 1 5l4 4"/>
                                    </svg>
                                </a>
                            </li>
                            <li>
                                <a href="#"
                                   className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">1</a>
                            </li>
                            <li>
                                <a href="#"
                                   className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">2</a>
                            </li>
                            <li>
                                <a href="#" aria-current="page"
                                   className="z-10 flex items-center justify-center px-3 h-8 leading-tight text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700">3</a>
                            </li>
                            <li>
                                <a href="#"
                                   className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">4</a>
                            </li>
                            <li>
                                <a href="#"
                                   className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">5</a>
                            </li>
                            <li>
                                <a href="#"
                                   className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700">
                                    <span className="sr-only">Next</span>
                                    <svg className="w-2.5 h-2.5 rtl:rotate-180" aria-hidden="true"
                                         xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                              stroke-width="2" d="m1 9 4-4-4-4"/>
                                    </svg>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
                <AdminRightCardComponent/>
            </div>
            <AdminEditUserDialog/>
            <AdminAddUserDialog/>
            <AdminDeleteUserDialog/>
        </>
    );
}
