/*
 * --------------------------------------------------------------------------------
 * Copyright (c) 2022-NOW(至今) 锋楪技术团队
 * Author: 锋楪技术团队 (https://www.frontleaves.com)
 *
 * 本文件包含锋楪技术团队项目的源代码，项目的所有源代码均遵循 MIT 开源许可证协议。
 * --------------------------------------------------------------------------------
 */

import {Calendar, CheckOne, CloseOne, Notes, Pencil, One} from "@icon-park/react";
import * as React from "react";
import {JSX, useEffect, useState} from "react";
import {GradeDTO} from "../../../models/dto/grade_dto.ts";
import {message, Modal} from "antd";
import {CreateGradeAPI} from "../../../apis/grade_api.ts";
import dayjs from "dayjs";
import {DatePicker} from "antd";

/**
 * # AdminGradeAddDialog
 *
 * > 该函数用于创建一个对话框，管理员可以通过这个对话框添加新的年级信息。此组件以模态对话框的形式呈现，并且提供了关闭对话框的功能。
 *
 * @returns {JSX.Element} 返回一个包含标题、表单和按钮的模态对话框组件。
 */
export function AdminGradeAddDialog({show, emit, requestRefresh}: Readonly<{
    show: boolean;
    emit: (data: boolean) => void;
    requestRefresh: (refresh: boolean) => void;
}>): JSX.Element {
    const [data, setData] = useState<GradeDTO>({
        name: "",
        year: new Date().getFullYear(),
        start_date: "",
        end_date: "",
        description: ""
    } as GradeDTO);
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
            year: new Date().getFullYear(),
            start_date: "",
            end_date: "",
            description: ""
        } as GradeDTO);
        setStartDate(null);
        setEndDate(null);
        setIsModalOpen(false);
    }

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        
        // 设置日期字符串
        const updatedData = {
            ...data,
            start_date: startDate ? startDate.format('YYYY-MM-DD') : "",
            end_date: endDate ? endDate.format('YYYY-MM-DD') : undefined
        };
        
        const getResp = await CreateGradeAPI(updatedData);
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
                           <button type={"submit"} form={"grade_add"}
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
                    <span>添加年级</span>
                </h3>
                <form id={"grade_add"} onSubmit={onSubmit} className="py-2 grid space-y-2">
                    <fieldset className="flex flex-col">
                        <legend className="flex items-center space-x-1 mb-1">
                            <Pencil theme="outline" size="16"/>
                            <span>年级名称</span>
                        </legend>
                        <input
                            onChange={(e) => setData({...data, name: e.target.value})}
                            value={data.name}
                            type="text" className="input w-full validator" placeholder="2023级" required/>
                        <p className="fieldset-label hidden validator-hint">年级名称不能为空</p>
                    </fieldset>
                    
                    <fieldset className="flex flex-col">
                        <legend className="flex items-center space-x-1 mb-1">
                            <One theme="outline" size="16"/>
                            <span>入学年份</span>
                        </legend>
                        <input
                            onChange={(e) => setData({...data, year: parseInt(e.target.value) || 0})}
                            value={data.year}
                            type="number" className="input w-full validator" placeholder="2023" required/>
                        <p className="fieldset-label hidden validator-hint">入学年份不能为空</p>
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
                        />
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
                    </fieldset>
                    
                    <fieldset className="flex flex-col">
                        <legend className="flex items-center space-x-1 mb-1">
                            <Notes theme="outline" size="16"/>
                            <span>年级描述</span>
                        </legend>
                        <textarea
                            onChange={(e) => setData({...data, description: e.target.value})}
                            value={data.description || ""}
                            className="textarea w-full" placeholder="可选描述信息" rows={2}/>
                    </fieldset>
                </form>
            </div>
        </Modal>
    );
} 