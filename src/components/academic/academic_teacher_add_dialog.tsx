import {
    AddUser,
    CheckOne,
    CloseOne,
    Envelope,
    Key,
    PhoneTelephone,
    User,
    IdCard,
    Book,
    Write,
    School, EmotionHappy, AllApplication, ChinesePavilion, English, AddTextTwo
} from "@icon-park/react";
import * as React from "react";
import { JSX, useEffect, useState } from "react";
import { message, Modal, Radio, Select } from "antd";
import { PageSearchDTO } from "../../models/dto/page_search_dto.ts";
import { AddTeacherAPI } from "../../apis/teacher_api.ts";
import { TeacherAddDTO } from "../../models/dto/teacher_add_dto.ts";

/**
 * # 管理员添加教师 Dialog
 * > 该函数用于创建一个添加教师对话框，管理员可以在该对话框中添加教师
 *
 * @param show - 控制该对话框是否显示
 * @param emit - 控制该对话框是否提交
 * @param onAddSuccess - 成功添加教师后的操作
 * @constructor
 */
export function AdminAddTeacherDialog({ show, emit, onAddSuccess }: Readonly<{
    show: boolean;
    emit: (data: boolean) => void;
    onAddSuccess?: () => void
}>): JSX.Element {
    const [data, setData] = useState<TeacherAddDTO>(
        {
            name: "",
            english_name: "",
            ethnic: "汉族",
            sex: 1,
            phone: "",
            email: "",
            job_title: "",
            desc: "",
            status: 1,
            unit_uuid: "",
            user_uuid: "",
            id: ""
        } as TeacherAddDTO);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchRequest] = useState<PageSearchDTO>({
        page: 1,
        size: 20,
        is_desc: true,
    } as PageSearchDTO);

    // 民族列表
    const ethnicOptions = [
        "汉族", "蒙古族", "回族", "藏族", "维吾尔族", "苗族", "彝族", "壮族", "布依族", "朝鲜族",
        "满族", "侗族", "瑶族", "白族", "土家族", "哈尼族", "哈萨克族", "傣族", "黎族", "傈僳族",
        "佤族", "畲族", "高山族", "拉祜族", "水族", "东乡族", "纳西族", "景颇族", "柯尔克孜族", "土族",
        "达斡尔族", "仫佬族", "羌族", "布朗族", "撒拉族", "毛南族", "仡佬族", "锡伯族", "阿昌族", "普米族",
        "塔吉克族", "怒族", "乌孜别克族", "俄罗斯族", "鄂温克族", "德昂族", "保安族", "裕固族", "京族", "塔塔尔族",
        "独龙族", "鄂伦春族", "赫哲族", "门巴族", "珞巴族", "基诺族"
    ];

    useEffect(() => {
        setIsModalOpen(show);
    }, [show]);

    useEffect(() => {
        emit(isModalOpen);
    }, [emit, isModalOpen]);

    // 关闭对话框
    const handleClose = () => {
        setData({
            name: "",
            english_name: "",
            ethnic: "汉族",
            sex: 1,
            phone: "",
            email: "",
            job_title: "",
            desc: "",
            status: 1,
            unit_uuid: "",
            user_uuid: "",
            id: ""
        } as TeacherAddDTO);
        setIsModalOpen(false);
    };

    // 提交表单
    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        try {
            // 验证必填字段
            if (!data.name || !data.english_name || !data.ethnic || data.sex === undefined || !data.unit_uuid || !data.id) {
                message.error("请填写所有必填字段");
                return;
            }

            const getResp = await AddTeacherAPI(data);
            if (getResp?.output === "Success") {
                message.success("添加教师成功");
                onAddSuccess?.();
                handleClose();
            } else {
                message.error(getResp?.error_message ?? "添加教师失败");
            }
        } catch (error) {
            console.error("添加教师失败:", error);
            message.error("添加教师失败");
        }
    }

    return (
        <Modal
            title={
                <h3 className="font-bold text-lg flex items-center space-x-2">
                    <AddUser theme="outline" size="20" fill="#333" />
                    <span>添加教师</span>
                </h3>
            }
            open={isModalOpen}
            onCancel={handleClose}
            width={700}
            footer={
                <div className="modal-action">
                    <div className={"flex space-x-3"}>
                        <button type={"button"} onClick={handleClose} className={"btn btn-error"}>
                            <CloseOne theme="outline" size="16" />
                            <span>取消</span>
                        </button>
                        <button type={"submit"} form={"teacher_add"} className={"btn btn-success"}>
                            <CheckOne theme="outline" size="16" />
                            <span>提交</span>
                        </button>
                    </div>
                </div>
            }
        >
            <div className="flex flex-col space-y-4">
                <form id={"teacher_add"} onSubmit={onSubmit} className="py-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* 姓名 */}
                    <fieldset className="flex flex-col">
                        <legend className="flex items-center space-x-1 mb-1">
                            <User theme="outline" size="16" fill="#333" />
                            <span>姓名</span>
                            <span className="text-red-500">*</span>
                        </legend>
                        <input
                            type="text"
                            className="input input-bordered w-full"
                            required
                            placeholder="请输入教师姓名"
                            value={data.name}
                            onChange={(e) => setData({ ...data, name: e.target.value })}
                        />
                    </fieldset>

                    {/* 英文名 */}
                    <fieldset className="flex flex-col">
                        <legend className="flex items-center space-x-1 mb-1">
                            <English theme="outline" size="16" fill="#333"/>
                            <span>英文名</span>
                            <span className="text-red-500">*</span>
                        </legend>
                        <input
                            type="text"
                            className="input input-bordered w-full"
                            required
                            placeholder="请输入英文名"
                            value={data.english_name}
                            onChange={(e) => setData({ ...data, english_name: e.target.value })}
                        />
                    </fieldset>

                    {/* 工号 */}
                    <fieldset className="flex flex-col">
                        <legend className="flex items-center space-x-1 mb-1">
                            <IdCard theme="outline" size="16" fill="#333" />
                            <span>工号</span>
                            <span className="text-red-500">*</span>
                        </legend>
                        <input
                            type="text"
                            className="input input-bordered w-full"
                            required
                            placeholder="请输入教师工号"
                            value={data.id}
                            onChange={(e) => setData({ ...data, id: e.target.value })}
                        />
                    </fieldset>

                    {/* 性别 */}
                    <fieldset className="flex flex-col">
                        <legend className="flex items-center space-x-1 mb-1">
                            <EmotionHappy theme="outline" size="16" fill="#333"/>
                            <span>性别</span>
                            <span className="text-red-500">*</span>
                        </legend>
                        <Radio.Group
                            value={data.sex}
                            onChange={(e) => setData({ ...data, sex: e.target.value })}
                            className="flex space-x-4 pt-2"
                        >
                            <Radio value={0}>女</Radio>
                            <Radio value={1}>男</Radio>
                        </Radio.Group>
                    </fieldset>

                    {/* 单位UUID */}
                    <fieldset className="flex flex-col">
                        <legend className="flex items-center space-x-1 mb-1">
                            <ChinesePavilion theme="outline" size="16" fill="#333"/>
                            <span>单位</span>
                            <span className="text-red-500">*</span>
                        </legend>
                        <input
                            type="text"
                            className="input input-bordered w-full"
                            required
                            placeholder="请输入单位UUID"
                            value={data.unit_uuid}
                            onChange={(e) => setData({ ...data, unit_uuid: e.target.value })}
                        />
                    </fieldset>

                    {/* 用户UUID */}
                    <fieldset className="flex flex-col">
                        <legend className="flex items-center space-x-1 mb-1">
                            <Key theme="outline" size="16" fill="#333" />
                            <span>用户UUID</span>
                            <span className="text-red-500">*</span>
                        </legend>
                        <input
                            type="text"
                            className="input input-bordered w-full"
                            required
                            placeholder="请输入用户UUID"
                            value={data.user_uuid}
                            onChange={(e) => setData({ ...data, user_uuid: e.target.value })}
                        />
                    </fieldset>

                    {/* 民族 */}
                    <fieldset className="flex flex-col">
                        <legend className="flex items-center space-x-1 mb-1">
                            <AllApplication theme="outline" size="16" fill="#333"/>
                            <span>民族</span>
                            <span className="text-red-500">*</span>
                        </legend>
                        <Select
                            className="w-full"
                            value={data.ethnic}
                            onChange={(value) => setData({ ...data, ethnic: value })}
                            options={ethnicOptions.map(ethnic => ({ value: ethnic, label: ethnic }))}
                        />
                    </fieldset>

                    {/* 电话 */}
                    <fieldset className="flex flex-col">
                        <legend className="flex items-center space-x-1 mb-1">
                            <PhoneTelephone theme="outline" size="16" fill="#333" />
                            <span>电话</span>
                        </legend>
                        <input
                            type="tel"
                            className="input input-bordered w-full"
                            placeholder="请输入联系电话"
                            value={data.phone}
                            onChange={(e) => setData({ ...data, phone: e.target.value })}
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
                            className="input input-bordered w-full"
                            placeholder="请输入电子邮箱"
                            value={data.email}
                            onChange={(e) => setData({ ...data, email: e.target.value })}
                        />
                    </fieldset>

                    {/* 职称 */}
                    <fieldset className="flex flex-col">
                        <legend className="flex items-center space-x-1 mb-1">
                            <AddTextTwo theme="outline" size="16" fill="#333"/>
                            <span>职称</span>
                        </legend>
                        <input
                            type="text"
                            className="input input-bordered w-full"
                            placeholder="请输入职称"
                            value={data.job_title}
                            onChange={(e) => setData({ ...data, job_title: e.target.value })}
                        />
                    </fieldset>

                    {/* 状态 */}
                    <fieldset className="flex flex-col">
                        <legend className="flex items-center space-x-1 mb-1">
                            <User theme="outline" size="16" fill="#333" />
                            <span>状态</span>
                        </legend>
                        <Radio.Group
                            value={data.status}
                            onChange={(e) => setData({ ...data, status: e.target.value })}
                            className="flex space-x-4 pt-2"
                        >
                            <Radio value={1}>在职</Radio>
                            <Radio value={0}>休假</Radio>
                        </Radio.Group>
                    </fieldset>

                    {/* 描述 - 跨越两列 */}
                    <fieldset className="flex flex-col md:col-span-2">
                        <legend className="flex items-center space-x-1 mb-1">
                            <Write theme="outline" size="16" fill="#333" />
                            <span>描述</span>
                        </legend>
                        <textarea
                            className="textarea textarea-bordered w-full"
                            placeholder="请输入教师描述"
                            rows={3}
                            value={data.desc}
                            onChange={(e) => setData({ ...data, desc: e.target.value })}
                        />
                    </fieldset>
                </form>
            </div>
        </Modal>
    );
}