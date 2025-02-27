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

export function AdminAddUserDialog() {
    // 关闭对话框的函数
    const handleCloseDialog = () => {
        const dialog = document.getElementById('my_modal_1');
        if (dialog) {
            dialog.close(); // 关闭对话框
        }
    };

    return (
        <dialog id="my_modal_1" className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">添加用户</h3>
                <div className="mt-3">
                    <form method="dialog" className="flex flex-col space-y-4 p-4">
                        {/* 输入框容器 */}
                        <div className="flex flex-col space-y-3">
                            <label
                                className="input input-md transition flex items-center validator w-full">
                                <svg width="20" height="20" viewBox="0 0 48 48" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="24" cy="12" r="8" fill="none" stroke="#333" stroke-width="4"
                                            stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M42 44C42 34.0589 33.9411 26 24 26C14.0589 26 6 34.0589 6 44"
                                          stroke="#333" stroke-width="4" stroke-linecap="round"
                                          stroke-linejoin="round"/>
                                </svg>
                                <input
                                    type="text"
                                    required
                                    className="grow ps-1"
                                    placeholder="用户名"
                                />
                            </label>
                            <label
                                className="input input-md transition flex items-center validator w-full">
                                <svg width="24" height="24" viewBox="0 0 48 48" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="24" cy="16" r="6" fill="none" stroke="#333" stroke-width="4"
                                            stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M36 36C36 29.3726 30.6274 24 24 24C17.3726 24 12 29.3726 12 36"
                                          stroke="#333" stroke-width="4" stroke-linecap="round"
                                          stroke-linejoin="round"/>
                                    <path d="M36 4H44V12" stroke="#333" stroke-width="4" stroke-linecap="round"
                                          stroke-linejoin="round"/>
                                    <path d="M12 4H4V12" stroke="#333" stroke-width="4" stroke-linecap="round"
                                          stroke-linejoin="round"/>
                                    <path d="M36 44H44V36" stroke="#333" stroke-width="4" stroke-linecap="round"
                                          stroke-linejoin="round"/>
                                    <path d="M12 44H4V36" stroke="#333" stroke-width="4" stroke-linecap="round"
                                          stroke-linejoin="round"/>
                                </svg>
                                <input
                                    type="email"
                                    required
                                    className="grow"
                                    placeholder="角色"
                                />
                            </label>
                            <label
                                className="input input-md transition flex items-center validator w-full">
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
                        <div className="flex justify-end gap-2 w-full">
                            <button type={"submit"} className="btn btn-neutral">添加</button>
                            <button
                                type={"button"} // 注意：这里 type 为 "button"，避免触发表单提交
                                className="btn"
                                onClick={handleCloseDialog} // 绑定点击事件
                            >
                                取消
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </dialog>
    );
}
