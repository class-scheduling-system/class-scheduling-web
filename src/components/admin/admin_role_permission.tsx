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

import { useState } from "react";

export function AdminRolePermissionDialog() {
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        email: '',
        permissions: [],
    });

    const permissionsList = [
        "查看用户", "编辑用户", "删除用户", "管理角色", "查看报表"
    ];

    // 关闭对话框的函数
    const handleCloseDialog = () => {
        const dialog = document.getElementById('my_modal_2');
        if (dialog) {
            dialog.close(); // 关闭对话框
        }
    };

    // 处理权限勾选
    const handlePermissionChange = (permission) => {
        setFormData((prev) => {
            const newPermissions = prev.permissions.includes(permission)
                ? prev.permissions.filter((p) => p !== permission)
                : [...prev.permissions, permission];
            return { ...prev, permissions: newPermissions };
        });
    };

    return (
        <>
            <dialog id="my_modal_2" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">权限列表</h3>
                    <div className="mt-3">
                        <form method="dialog" className="flex flex-col space-y-4 p-4">
                            {/* 权限选择列表 */}
                            <div className="flex flex-col space-y-2">
                                {permissionsList.map((permission) => (
                                    <label key={permission} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={formData.permissions.includes(permission)}
                                            onChange={() => handlePermissionChange(permission)}
                                        />
                                        <span>{permission}</span>
                                    </label>
                                ))}
                            </div>

                            <div className="flex justify-end gap-2 w-full">
                                <button type="submit" className="btn btn-neutral">修改</button>
                                <button type="button" className="btn" onClick={handleCloseDialog}>取消</button>
                            </div>
                        </form>
                    </div>
                </div>
            </dialog>
        </>
    );
}

