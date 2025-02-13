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

import backgroundImage from "../assets/images/init_background.jpg";

export function BaseLogin() {

    return (
        <div className={"w-full h-dvh grid grid-cols-2 bg-gray-50"}>
            <div className={"w-full h-lvh relative"}>
                <img src={backgroundImage} className={"w-full h-full object-cover"} alt={"init-background"}/>
            </div>
            <form className="flex justify-center h-dvh items-center">
                <div className="card bg-base-100 shadow-md flex flex-col gap-6 w-3/5 p-8 items-center">
                    <span className="text-3xl text-gray-700 font-bold text-center"></span>
                    <span className="text-2xl text-gray-700 font-bold pb-4 text-center">请登录您的账户</span>

                    {/* 输入框部分 */}
                    <div className="flex flex-col gap-4 w-4/5 items-center">
                        <label className="bg-gray-50 input input-md transition flex items-center w-full">
                            <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="24" cy="12" r="8" fill="none" stroke="#333" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M42 44C42 34.0589 33.9411 26 24 26C14.0589 26 6 34.0589 6 44" stroke="#333" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <input type="text" className="grow text-md px-4 self-center" placeholder="用户名/邮箱/手机号/学号/工号" />
                        </label>

                        <label className="bg-gray-50 input input-md transition flex items-center w-full">
                            <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.8682 24.2982C25.4105 26.7935 26.4138 30.4526 25.4971 33.8863C24.5805 37.32 21.8844 40.0019 18.4325 40.9137C14.9806 41.8256 11.3022 40.8276 8.79375 38.2986C5.02208 34.4141 5.07602 28.2394 8.91499 24.4206C12.754 20.6019 18.9613 20.5482 22.8664 24.3L22.8682 24.2982Z" fill="none" stroke="#333" strokeWidth="4" strokeLinejoin="round"/>
                                <path d="M23 24L40 7" stroke="#333" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M30.3052 16.9001L35.7337 22.3001L42.0671 16.0001L36.6385 10.6001L30.3052 16.9001Z" fill="none" stroke="#333" strokeWidth="4" strokeLinejoin="round"/>
                            </svg>
                            <input type="password" className="grow text-md px-4 self-center" placeholder="密码" />
                        </label>

                        <p className="validator-hint hidden text-red-500 text-sm text-center">
                            <div className="flex flex-col">
                                <span>密码强度要求不符合</span>
                                <span>必须包含 <b>大小写字母</b> 和 <b>数字</b> 的组合，可以使用 <b>特殊字符</b></span>
                                <span>长度在 <b>6</b> 位数以上</span>
                            </div>
                        </p>
                    </div>

                    {/* 登录按钮 */}
                    <div className="w-full flex justify-center mt-2"> {/* 减少上边距 */}
                        <button className="btn btn-primary btn-lg w-48 text-gray-100">登录</button>
                    </div>

                    {/* 分割线 */}
                    <div className="divider my-1"></div> {/* 减少分割线的上下边距 */}

                    {/* 重置密码和修改密码 */}
                    <div className="flex gap-4"> {/* 减少上边距，增加按钮之间的水平间距 */}
                        <button className="hover:text-green-600">重置密码？</button>
                        <button className="hover:text-green-600">修改密码？</button>
                    </div>
                </div>
            </form>
        </div>
    );
}
