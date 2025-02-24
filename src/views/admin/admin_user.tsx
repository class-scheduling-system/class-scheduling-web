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

import {SiteInfoEntity} from "../../models/entity/site_info_entity.ts";
import {useEffect} from "react";
import {User} from "@icon-park/react";
import * as React from "react";

export function AdminUser({site}: Readonly<{
    site: SiteInfoEntity
}>) {

    useEffect(() => {
        document.title = `用户管理 | ${site.name ?? "Frontleaves Technology"}`;
    }, [site.name]);

    return (
        <>
            <div className={"grid grid-cols-10 gap-7"}>
                <div className="overflow-x-auto col-span-7 border border-gray-100 rounded-lg shadow-lg">
                    <table className="table table-zebra">
                        {/* 表头 */}
                        <thead>
                        <tr>
                            <th></th>
                            <th>用户名</th>
                            <th>角色</th>
                            <th>邮箱</th>
                            <th>操作</th> {/* 新增操作列 */}
                        </tr>
                        </thead>
                        <tbody>
                        {/* 使用循环动态生成表格行 */}
                        {[
                            { id: 1, name: "Cy Ganderton", role: "Quality Control Specialist", email: "Blue" },
                            { id: 2, name: "Hart Hagerty", role: "Desktop Support Technician", email: "Purple" },
                            { id: 3, name: "Brice Swyre", role: "Tax Accountant", email: "Red" },
                        ].map((row, index) => (
                            <tr key={row.id}>
                                <th>{index + 1}</th>
                                <td>{row.name}</td>
                                <td>{row.role}</td>
                                <td>{row.email}</td>
                                <td>
                                    <div className="flex gap-2">
                                        <button className={"text-xs font-medium text-sky-500 inline-flex items-center"}>
                                            <svg className="w-4 h-4 text-sky-500" aria-hidden="true"
                                                 xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                                 viewBox="0 0 24 24">
                                                <path stroke="currentColor" stroke-linecap="round"
                                                      stroke-linejoin="round" stroke-width="2"
                                                      d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
                                            </svg>
                                            <span>编辑</span>
                                        </button>
                                        <button
                                            className={"text-xs font-medium  text-red-400 inline-flex items-center"}>
                                            <svg className={"w-4 h-4 text-red-400"} aria-hidden="true"
                                                 xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                                 viewBox="0 0 24 24">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
                                            </svg>
                                            <span>删除</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <div className={"flex flex-col space-y-4 col-span-3"}>
                    <div className={"border border-gray-100 rounded-lg shadow-lg p-6"}>
                        <div className={"flex flex-col space-y-4  gap-2"}>
                            <div className="join">
                                <div>
                                    <label className="input validator join-item">
                                        <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M21 38C30.3888 38 38 30.3888 38 21C38 11.6112 30.3888 4 21 4C11.6112 4 4 11.6112 4 21C4 30.3888 11.6112 38 21 38Z" fill="none" stroke="#333" stroke-width="4" stroke-linejoin="round"/>
                                            <path d="M26.657 14.3431C25.2093 12.8954 23.2093 12 21.0001 12C18.791 12 16.791 12.8954 15.3433 14.3431" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M33.2216 33.2217L41.7069 41.707" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                        <input type="text" placeholder="请输入用户名或角色" required/>
                                    </label>
                                    <div className="validator-hint hidden">Enter valid email address</div>
                                </div>
                                <button className="btn btn-neutral join-item">搜索</button>
                            </div>
                            <div>
                                <button className="btn" onClick={()=>document.getElementById('my_modal_1').showModal()}>
                                    <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M24.0605 10L24.0239 38" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M10 24L38 24" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    添加用户
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={"flex col-span-8 justify-center items-center"}>
                    <nav aria-label="Page navigation example">
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
            </div>

            {/*对话框*/}
            <dialog id="my_modal_1" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">添加用户</h3>
                    <div className="mt-3">
                        <form method="dialog" className="flex flex-col space-y-4 p-4">
                            {/* 输入框容器 */}
                            <div className="flex flex-col space-y-3">
                                <label className="input input-md transition flex items-center validator w-full"> {/* 添加 w-full */}
                                    <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="24" cy="12" r="8" fill="none" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M42 44C42 34.0589 33.9411 26 24 26C14.0589 26 6 34.0589 6 44" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    <input
                                        type="text"
                                        required
                                        className="grow ps-1"
                                        placeholder="用户名"
                                    />
                                </label>
                                <label className="input input-md transition flex items-center validator w-full"> {/* 添加 w-full */}
                                    <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="24" cy="16" r="6" fill="none" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M36 36C36 29.3726 30.6274 24 24 24C17.3726 24 12 29.3726 12 36" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M36 4H44V12" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M12 4H4V12" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M36 44H44V36" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M12 44H4V36" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    <input
                                        type="email"
                                        required
                                        className="grow"
                                        placeholder="角色"
                                    />
                                </label>
                                <label className="input input-md transition flex items-center validator w-full"> {/* 添加 w-full */}
                                    <svg
                                        className="w-6 h-6 text-gray-700"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeWidth="2"
                                            d="m3.5 5.5 7.893 6.036a1 1 0 0 0 1.214 0L20.5 5.5M4 19h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z"
                                        />
                                    </svg>
                                    <input
                                        type="email"
                                        required
                                        className="grow ps-1"
                                        placeholder="邮箱"
                                    />
                                </label>
                            </div>

                            {/* 按钮容器 */}
                            <div className="flex justify-end gap-2 w-full"> {/* 添加 w-full 和 justify-end */}
                                <button className="btn btn-neutral">添加</button>
                                <button className="btn">取消</button>
                            </div>
                        </form>
                    </div>
                </div>
            </dialog>
        </>
    );
}
