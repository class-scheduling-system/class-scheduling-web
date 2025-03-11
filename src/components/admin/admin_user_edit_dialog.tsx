import { useState, useEffect, JSX } from "react";
import {
    AddUser, ApplicationEffect,
    CheckOne,
    CloseOne,
    Envelope, Forbid,
    Key, Permissions,
    PhoneTelephone,
    User,
    UserPositioning
} from "@icon-park/react";
import { EditUserAPI } from "../../apis/user_api.ts";
import { message, Modal } from "antd";
import * as React from "react";
import { UserAddDTO } from "../../models/dto/user_add_dto.ts";
import { PageSearchDTO } from "../../models/dto/page_search_dto.ts";
import { GetRoleListAPI } from "../../apis/role_api.ts";
import { RoleEntity } from "../../models/entity/role_entity.ts";
import { UserEditDTO } from "../../models/dto/user_edit_dto.ts";

/**
 * # 编辑用户 dialog
 * > 该函数用于创建一个对话框，管理员可以通过该对话框编辑用户，修改用户的信息
 * @param show  控制该对话框是否显示
 * @param emit  控制该对话框是否提交
 * @param userUuid  用户uuid
 * @param defaultData   对话框的默认用户数据
 * @param onEditSuccess     编辑成功后的操作
 * @constructor
 */
export function AdminEditUserDialog({ show, emit, userUuid, defaultData,onEditSuccess }: Readonly<{
    show: boolean;
    emit: (data: boolean) => void;
    userUuid: string;
    defaultData?: UserEditDTO | null;
    onEditSuccess?: () => void;
}>): JSX.Element {
    const [data, setData] = useState<UserEditDTO>(defaultData || {} as UserEditDTO);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [roleList, setRoleList] = useState<RoleEntity[]>([]);
    const [searchRequest] = useState<PageSearchDTO>({
        page: 1,
        size: 20,
        is_desc: true,
    } as PageSearchDTO);

    useEffect(() => {
        setIsModalOpen(show);
    }, [show]);

    useEffect(() => {
        emit(isModalOpen);
    }, [emit, isModalOpen]);

    // 当对话框打开且有 defaultData 时，同步到本地状态中
    useEffect(() => {
        if (show && defaultData) {
            setData(defaultData);
        }
    }, [show, defaultData]);

    // 关闭对话框
    const handleClose = () => {
        setIsModalOpen(false);
    };

    // 提交表单
    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        try {
            const getResp = await EditUserAPI(userUuid, data);
            if (getResp?.output === "Success") {
                message.success("编辑成功");

                // 调用父组件传来的回调，刷新用户列表
                onEditSuccess?.();

                handleClose();
            } else {
                message.error(getResp?.error_message ?? "编辑失败");
            }
        } catch (error) {
            console.error("编辑用户失败:", error);
            message.error("编辑失败");
        }
    }

    // 获取角色列表
    useEffect(() => {
        GetRoleListAPI(searchRequest)
            .then(response => {
                if (response?.output === "Success") {
                    console.log("获取角色列表成功:", response.data);
                    setRoleList(response.data!.records);
                } else {
                    message.error(response?.error_message ?? "获取角色列表失败");
                }
            })
            .catch(error => {
                console.error("角色列表请求失败:", error);
                message.error("获取角色列表失败");
            });
    }, [searchRequest]);


    return (
        <Modal
            open={isModalOpen}
            onCancel={handleClose}
            footer={
                <div className="modal-action">
                    <div className={"flex space-x-3"}>
                        <button type={"button"} onClick={handleClose} className={"btn btn-error"}>
                            <CloseOne theme="outline" size="16" />
                            <span>取消</span>
                        </button>
                        <button type={"submit"} form={"user_edit"} className={"btn btn-success"}>
                            <CheckOne theme="outline" size="16" />
                            <span>提交</span>
                        </button>
                    </div>
                </div>
            }
        >
            <div className="flex flex-col space-y-4">
                <h3 className="font-bold text-lg flex items-center space-x-2">
                    <AddUser theme="outline" size="20" fill="#333" />
                    <span>编辑用户</span>
                </h3>
                <form id={"user_edit"} onSubmit={onSubmit} className="py-2 grid space-y-2">
                    {/* 用户名 */}
                    <fieldset className="flex flex-col">
                        <legend className="flex items-center space-x-1 mb-1">
                            <User theme="outline" size="16" fill="#333" />
                            <span>用户名</span>
                        </legend>
                        <input
                            type="text"
                            className="input w-full validator"
                            required
                            value={data.name || ""}
                            onChange={(e) => setData({ ...data, name: e.target.value })}
                        />
                    </fieldset>
                    {/* 密码（留空表示不修改） */}
                    <fieldset className="flex flex-col">
                        <legend className="flex items-center space-x-1 mb-1">
                            <Key theme="outline" size="16" fill="#333" />
                            <span>密码</span>
                        </legend>
                        <input
                            type="password"
                            className="input w-full validator"
                            placeholder="如需修改密码，请输入新密码"
                            onChange={(e) => setData({ ...data, password: e.target.value })}
                        />
                    </fieldset>
                    {/* 邮箱 */}
                    <fieldset className="flex flex-col">
                        <legend className="flex items-center space-x-1 mb-1">
                            <Envelope theme="outline" size="16" fill="#333" />
                            <span>邮箱</span>
                        </legend>
                        <input
                            type="email"
                            className="input w-full validator"
                            required
                            value={data.email || ""}
                            onChange={(e) => setData({ ...data, email: e.target.value })}
                        />
                    </fieldset>
                    {/* 手机号 */}
                    <fieldset className="flex flex-col">
                        <legend className="flex items-center space-x-1 mb-1">
                            <PhoneTelephone theme="outline" size="16" fill="#333" />
                            <span>手机号</span>
                        </legend>
                        <input
                            type="text"
                            className="input w-full validator"
                            required
                            value={data.phone || ""}
                            onChange={(e) => setData({ ...data, phone: e.target.value })}
                        />
                    </fieldset>
                    {/* 角色选择 */}
                    <fieldset className="flex flex-col">
                        <legend className="flex items-center space-x-1 mb-1">
                            <UserPositioning theme="outline" size="16" fill="#333" />
                            <span>角色</span>
                        </legend>
                        <select
                            className="select w-full validator"
                            value={data.role_uuid || ""}
                            onChange={(e) => setData({ ...data, role_uuid: e.target.value })}
                            required
                        >
                            <option value="" disabled>
                                请选择角色
                            </option>
                            {roleList?.map((role) => (
                                <option key={role.role_uuid} value={role.role_uuid}>
                                    {role.role_name}
                                </option>
                            ))|| []}
                        </select>
                    </fieldset>
                    {/* 权限选择（可选多选） */}
                    <fieldset className="flex flex-col">
                        <legend className="flex items-center space-x-1 mb-1">
                            <Permissions theme="outline" size="16" fill="#333" />
                            <span>权限</span>
                        </legend>
                        <select
                            className="select w-full validator"
                            value={data.permission && data.permission.length ? data.permission[0] : ""}
                            onChange={(e) => setData({ ...data, permission: [e.target.value] })}
                            required
                        >
                            <option value="" disabled>
                                请选择权限
                            </option>
                            <option value="user">user</option>
                            <option value="admin">admin</option>
                            <option value="super">super</option>
                        </select>
                    </fieldset>
                    <fieldset className="flex flex-col">
                        <legend className="flex items-center space-x-1 mb-1">
                            <ApplicationEffect theme="outline" size="16" fill="#333"/>
                            <span>状态</span>
                        </legend>
                        <select
                            className="select w-full validator"
                            value={data.status !== undefined ? data.status : ""}
                            onChange={(e) => setData({ ...data, status: Number(e.target.value) })}
                            required
                        >
                            <option value="" disabled>
                                请选择状态
                            </option>
                            <option value="1">启用</option>
                            <option value="0">禁用</option>
                        </select>
                    </fieldset>
                    <fieldset className="flex flex-col">
                        <legend className="flex items-center space-x-1 mb-1">
                            <Forbid theme="outline" size="16" fill="#333"/>
                            <span>封禁</span>
                        </legend>
                        <select
                            className="select w-full validator"
                            value={data.ban !== undefined ? data.ban : ""}
                            onChange={(e) => setData({ ...data, ban: Number(e.target.value) })}
                            required
                        >
                            <option value="" disabled>
                                请选择封禁状态
                            </option>
                            <option value="0">未封禁</option>
                            <option value="1">封禁</option>
                        </select>
                    </fieldset>


                </form>
            </div>
        </Modal>
    );
}
