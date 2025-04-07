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
import {GetGradeAPI, UpdateGradeAPI} from "../../../apis/grade_api.ts";
import dayjs from "dayjs";
import {DatePicker} from "antd";

/**
 * # AdminGradeEditDialog
 * > 该函数用于创建一个对话框，管理员可以通过这个对话框编辑已有的年级信息。此组件以模态对话框的形式呈现，并且提供了关闭对话框的功能。
 *
 * @param show - 一个布尔值，表示对话框是否显示。
 * @param emit - 一个函数，用于向父组件发送数据。
 * @param editGradeUuid - 一个字符串，表示待编辑的年级的唯一标识符。
 * @param requestRefresh - 一个函数，用于请求刷新数据。
 * @returns {JSX.Element} 返回一个包含标题、表单和按钮的模态对话框组件。
 */
export function AdminGradeEditDialog({show, emit, editGradeUuid, requestRefresh}: Readonly<{
    show: boolean;
    editGradeUuid: string;
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

    // 获取年级信息
    useEffect(() => {
        const func = async () => {
            if (!editGradeUuid) return;
            
            const getResp = await GetGradeAPI(editGradeUuid);
            if (getResp?.output === "Success") {
                const gradeData = getResp.data!;
                setData({
                    name: gradeData.name,
                    year: gradeData.year,
                    description: gradeData.description || "",
                    start_date: gradeData.start_date,
                    end_date: gradeData.end_date
                } as GradeDTO);
                
                // 设置日期选择器的值（如果有日期）
                if (gradeData.start_date) {
                    setStartDate(dayjs(gradeData.start_date));
                }
                
                if (gradeData.end_date) {
                    setEndDate(dayjs(gradeData.end_date));
                }
            } else {
                message.error(getResp?.error_message || "获取年级信息失败");
            }
        }
        
        if (editGradeUuid) {
            func().then();
        }
    }, [editGradeUuid]);

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        
        // 设置日期字符串
        const updatedData = {
            ...data,
            start_date: startDate ? startDate.format('YYYY-MM-DD') : "",
            end_date: endDate ? endDate.format('YYYY-MM-DD') : undefined
        };
        
        const getResp = await UpdateGradeAPI(editGradeUuid, updatedData);
        if (getResp?.output === "Success") {
            message.success("更新成功");
            handleCancel();
            requestRefresh(true);
        } else {
            message.error(getResp?.error_message || "更新失败");
        }
    }

    return (
        <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel}
               footer={
                   <div className="modal-action">
                       <div className={"flex space-x-3"}>
                           <button type={"button"}
                                   onClick={handleCancel}
                                   className={"btn btn-error"}>
                               <CloseOne theme="outline" size="16"/>
                               <span>取消</span>
                           </button>
                           <button type={"submit"} form={"grade_edit"}
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
                    <span>编辑年级</span>
                </h3>
                <form id={"grade_edit"} onSubmit={onSubmit} className="py-2 grid space-y-2">
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