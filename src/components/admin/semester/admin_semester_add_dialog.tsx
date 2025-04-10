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
 * 本软件是"按原样"提供的，没有任何形式的明示或暗示的保证，包括但不限于
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

import {Calendar, CheckOne, CloseOne, Notes, Pencil} from "@icon-park/react";
import * as React from "react";
import {JSX, useEffect, useState} from "react";
import {SemesterDTO} from "../../../models/dto/semester_dto.ts";
import {message, Modal} from "antd";
import {CreateSemesterAPI} from "../../../apis/semester_api.ts";
import dayjs from "dayjs";
import {DatePicker} from "antd";

/**
 * # AdminSemesterAddDialog
 *
 * > 该函数用于创建一个对话框，管理员可以通过这个对话框添加新的学期信息。此组件以模态对话框的形式呈现，并且提供了关闭对话框的功能。
 *
 * @returns {JSX.Element} 返回一个包含标题、表单和按钮的模态对话框组件。
 */
export function AdminSemesterAddDialog({show, emit, requestRefresh}: Readonly<{
    show: boolean;
    emit: (data: boolean) => void;
    requestRefresh: (refresh: boolean) => void;
}>): JSX.Element {
    const [data, setData] = useState<SemesterDTO>({
        name: "",
        code: "",
        description: "",
        start_date: 0,
        end_date: 0,
        is_enabled: true
    } as SemesterDTO);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null);
    const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(null);

    useEffect(() => {
        setIsModalOpen(show);
    }, [show]);

    useEffect(() => {
        emit(isModalOpen);
    }, [emit, isModalOpen]);

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleClose = () => {
        setData({
            name: "",
            description: "",
            start_date: 0,
            end_date: 0,
            is_enabled: true
        } as SemesterDTO);
        setStartDate(null);
        setEndDate(null);
        setIsModalOpen(false);
    }

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        
        // 验证日期选择
        if (!startDate) {
            message.error("请选择开始日期");
            return;
        }
        
        // 验证开始日期早于结束日期
        if (endDate && startDate.isAfter(endDate)) {
            message.error("开始日期必须早于结束日期");
            return;
        }
        
        // 设置时间戳
        const updatedData = {
            ...data,
            start_date: startDate.valueOf(),
            end_date: endDate?.valueOf() || 0
        };
        
        const getResp = await CreateSemesterAPI(updatedData);
        if (getResp?.output === "Success") {
            message.success("添加成功");
            handleClose();
            requestRefresh(true);
        } else {
            message.error(getResp?.error_message || "添加失败");
        }
    }

    return (
        <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel}
               footer={
                   <div className="modal-action">
                       <div className={"flex space-x-3"}>
                           <button type={"button"}
                                   onClick={handleClose}
                                   className={"btn btn-error"}>
                               <CloseOne theme="outline" size="16"/>
                               <span>取消</span>
                           </button>
                           <button type={"submit"} form={"semester_add"}
                                   className={"btn btn-success"}>
                               <CheckOne theme="outline" size="16"/>
                               <span>提交</span>
                           </button>
                       </div>
                   </div>
               }>
            <div className="flex flex-col space-y-4">
                <h3 className="font-bold text-lg flex items-center space-x-2">
                    <Calendar theme="outline" size="20"/>
                    <span>添加学期</span>
                </h3>
                <form id={"semester_add"} onSubmit={onSubmit} className="py-2 grid space-y-2">
                    <fieldset className="flex flex-col">
                        <legend className="flex items-center space-x-1 mb-1">
                            <Pencil theme="outline" size="16"/>
                            <span>学期名称</span>
                        </legend>
                        <input
                            onChange={(e) => setData({...data, name: e.target.value})}
                            value={data.name}
                            type="text" className="input w-full validator" placeholder="2023-2024学年第一学期" required/>
                        <p className="fieldset-label hidden validator-hint">学期名称不能为空</p>
                    </fieldset>

                    <fieldset className="flex flex-col">
                        <legend className="flex items-center space-x-1 mb-1">
                            <Pencil theme="outline" size="16"/>
                            <span>学期代码</span>
                        </legend>
                        <input
                            onChange={(e) => setData({...data, code: e.target.value})}
                            value={data.code}
                            type="text" className="input w-full validator" placeholder="2023202401" required/>
                        <p className="fieldset-label hidden validator-hint">学期代码不能为空</p>
                    </fieldset>

                    <fieldset className="flex flex-col">
                        <legend className="flex items-center space-x-1 mb-1">
                            <Notes theme="outline" size="16"/>
                            <span>学期描述</span>
                        </legend>
                        <textarea
                            onChange={(e) => setData({...data, description: e.target.value})}
                            value={data.description || ""}
                            className="textarea w-full" placeholder="可选描述信息" rows={2}/>
                    </fieldset>
                    
                    <fieldset className="flex flex-col">
                        <legend className="flex items-center space-x-1 mb-1">
                            <Calendar theme="outline" size="16"/>
                            <span>开始日期</span>
                        </legend>
                        <DatePicker 
                            className="w-full"
                            placeholder="请选择开始日期"
                            value={startDate}
                            onChange={(date) => setStartDate(date)}
                            format="YYYY-MM-DD"
                            required
                        />
                        <p className="fieldset-label hidden validator-hint">请选择开始日期</p>
                    </fieldset>
                    
                    <fieldset className="flex flex-col">
                        <legend className="flex items-center space-x-1 mb-1">
                            <Calendar theme="outline" size="16"/>
                            <span>结束日期</span>
                        </legend>
                        <DatePicker 
                            className="w-full"
                            placeholder="请选择结束日期"
                            value={endDate}
                            onChange={(date) => setEndDate(date)}
                            format="YYYY-MM-DD"
                        />
                        <p className="fieldset-label hidden validator-hint">请选择结束日期</p>
                    </fieldset>
                    
                    <fieldset className="flex items-center space-x-3">
                        <input
                            onChange={(e) => setData({...data, is_enabled: e.target.checked})}
                            type="checkbox" className={"toggle toggle-sm"} defaultChecked/>
                        <span>启用学期</span>
                    </fieldset>
                </form>
            </div>
        </Modal>
    );
} 