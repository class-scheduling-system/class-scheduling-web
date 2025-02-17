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

import backgroundImage from "../../assets/images/init_background.jpg";


export function AuthRegister() {

    return (
        <div className={"w-full h-dvh grid grid-cols-2 bg-gray-50"}>
            <div className={"w-full h-lvh relative"}>
                <img src={backgroundImage} className={"w-full h-full object-cover"} alt={"init-background"}/>
            </div>
            <form className="flex justify-center h-dvh items-center">
                <div className="card bg-base-100 shadow-md flex flex-col gap-6 w-3/5 p-8 items-center">
                    <span className="text-3xl text-gray-700 font-bold text-center"></span>
                    <span className="text-2xl text-gray-700 font-bold pb-4 text-center">用户注册</span>

                    {/* 输入框部分 */}
                    <div className="flex flex-col gap-4 w-4/5 items-center">
                        <label className="bg-gray-50 input input-md transition flex items-center w-full">
                            <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="24" cy="12" r="8" fill="none" stroke="#333" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M42 44C42 34.0589 33.9411 26 24 26C14.0589 26 6 34.0589 6 44" stroke="#333" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <input type="text" className="grow text-md px-4 self-center" placeholder="用户名" />
                        </label>
                        <label className="bg-gray-50 input input-md transition flex items-center w-full">
                            <svg className="w-6 h-6 text-gray-800" aria-hidden="true"
                                 xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                 viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                      stroke-width="2"
                                      d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.949 8.949 0 0 0 4.951-1.488A3.987 3.987 0 0 0 13 16h-2a3.987 3.987 0 0 0-3.951 3.512A8.948 8.948 0 0 0 12 21Zm3-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                            </svg>

                            <input type="text" className="grow text-md px-4 self-center" placeholder="姓名"/>
                        </label>

                        <label className="bg-gray-50 input input-md transition flex items-center w-full">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 opacity-70">
                                <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
                            </svg>
                            <input type="password" className="grow text-md px-4 self-center" placeholder="默认密码" />
                        </label>
                        <label className="bg-gray-50 input input-md transition flex items-center w-full">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 opacity-70">
                                <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
                            </svg>
                            <input type="password" className="grow text-md px-4 self-center" placeholder="新密码" />
                        </label>
                        <label className="bg-gray-50 input input-md transition flex items-center w-full">
                            <svg className="w-6 h-6 text-gray-800" aria-hidden="true"
                                 xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                 viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="round" stroke-width="2"
                                      d="m3.5 5.5 7.893 6.036a1 1 0 0 0 1.214 0L20.5 5.5M4 19h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z"/>
                            </svg>

                            <input type="password" className="grow text-md px-4 self-center" placeholder="邮箱"/>
                        </label>
                        <label className="bg-gray-50 input input-md transition flex items-center w-full">
                            <svg className="w-6 h-6 text-gray-800" aria-hidden="true"
                                 xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                 viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                      stroke-width="2"
                                      d="M18.427 14.768 17.2 13.542a1.733 1.733 0 0 0-2.45 0l-.613.613a1.732 1.732 0 0 1-2.45 0l-1.838-1.84a1.735 1.735 0 0 1 0-2.452l.612-.613a1.735 1.735 0 0 0 0-2.452L9.237 5.572a1.6 1.6 0 0 0-2.45 0c-3.223 3.2-1.702 6.896 1.519 10.117 3.22 3.221 6.914 4.745 10.12 1.535a1.601 1.601 0 0 0 0-2.456Z"/>
                            </svg>

                            <input type="password" className="grow text-md px-4 self-center" placeholder="手机号"/>
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
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-full flex justify-center mt-2"> {/* 减少上边距 */}
                            <button className="btn btn-primary btn-md w-48">注册</button>
                        </div>
                        <div className="w-full flex justify-center mt-2"> {/* 减少上边距 */}
                            <button className="btn btn-primary btn-md w-48">取消</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
