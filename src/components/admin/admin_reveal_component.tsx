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

import CardBackground from "../../assets/images/card-background.webp";
import {Plus, Search} from "@icon-park/react";

function AdminRightCardComponent() {
    return (
        <div className={"flex flex-col space-y-4 col-span-3"}>
            <div className={"border border-gray-100 rounded-lg shadow-lg"}>
                <img src={CardBackground} alt={"CardBackground"} className={"rounded-t-lg"}/>
                <div className={"flex flex-col p-4 gap-4"}>
                    <div className="join w-full px-4"> {/* 添加 px-4 使搜索框左右两边离卡片距离一样 */}
                        <div className={"w-full"}> {/* 设置宽度为 100% */}
                            <label className="input validator join-item w-full"> {/* 设置宽度为 100% */}
                                <Search theme="outline" size="24" fill="#333"/>
                                <input type="text" placeholder="请输入用户名或角色" required className={"w-full"}/> {/* 设置宽度为 100% */}
                            </label>
                        </div>
                        <button className="btn btn-neutral join-item">搜索</button>
                    </div>

                    {/* 按钮容器 */}
                    <div className={"flex gap-4 px-4 w-full"}> {/* 添加 gap-4 使按钮之间的间距与边距一致 */}
                        <div className="w-full"> {/* 让按钮占满容器宽度 */}
                            <button className="btn w-full"
                                    onClick={() => document.getElementById('my_modal_1').showModal()}>
                                <Plus theme="outline" size="22"/>
                                添加用户
                            </button>
                        </div>
                        <div className="w-full"> {/* 让按钮占满容器宽度 */}
                            <button className="btn w-full"
                                    onClick={() => document.getElementById('my_modal_1').showModal()}>
                                <Plus theme="outline" size="22"/>
                                添加用户
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export {
    AdminRightCardComponent
}
