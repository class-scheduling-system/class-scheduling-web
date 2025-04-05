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

import { CheckOne, CloseOne, Download, Upload, User} from "@icon-park/react";
import {JSX, useEffect, useState} from "react";
import {message, Modal, Upload as AntUpload} from "antd";
import {RcFile} from "antd/es/upload";
import {UploadRequestOption} from "rc-upload/lib/interface";
import {BatchImportStudentAPI, GetStudentTemplateAPI} from "../../../apis/student_api.ts";


/**
 * # AcademicStudentBatchImportDialog
 * > 该组件用于创建一个对话框，教务可以通过这个对话框下载学生导入模板并批量导入学生信息。
 *
 * @param show - 一个布尔值，表示对话框是否显示。
 * @param emit - 一个函数，用于向父组件发送数据。
 * @param requestRefresh - 一个函数，用于请求刷新数据。
 * @constructor
 */
export function AcademicStudentBatchImportDialog({show, emit, requestRefresh}: Readonly<{
    show: boolean;
    emit: (data: boolean) => void;
    requestRefresh: (refresh: boolean) => void;
}>): JSX.Element {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [file, setFile] = useState<RcFile | null>(null);
    const [ignoreError, setIgnoreError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
        setFile(null);
        setErrorMessage(null);
    };

    const downloadTemplate = async () => {
        try {
            const getResp = await GetStudentTemplateAPI();
            
            if (getResp?.output !== 'Success' || !getResp?.data) {
                throw new Error(getResp?.message || '下载模板失败：服务器返回为空');
            }
            
            // 从 FileEntity 中获取文件数据
            let fileData = getResp.data.data;
            const fileName = getResp.data.name || '学生导入模板.xlsx';
            const fileType = getResp.data.type || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            
            // 检查并去除 data URI 前缀
            if (fileData.startsWith('data:')) {
                fileData = fileData.split(',')[1];
            }
            
            // 将 Base64 数据转换为二进制数据
            const binaryString = window.atob(fileData);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            
            for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            
            // 创建 Blob 对象
            const blob = new Blob([bytes], { type: fileType });
            
            // 创建临时下载链接
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = fileName;
            
            // 添加到文档并触发下载
            document.body.appendChild(link);
            link.click();
            
            // 清理
            setTimeout(() => {
                document.body.removeChild(link);
                window.URL.revokeObjectURL(downloadUrl);
            }, 1000);
            
            message.success('模板下载成功');
        } catch (error) {
            console.error('下载模板失败:', error);
            message.error('下载模板失败，请稍后重试');
        }
    };

    const customRequest = async (options: UploadRequestOption) => {
        const { file, onSuccess, onError } = options;
        setErrorMessage(null); // 清除之前的错误信息
        
        try {
            // 将文件转换为 base64
            const reader = new FileReader();
            reader.readAsDataURL(file as Blob);
            reader.onload = async () => {
                const base64Content = reader.result as string;
                // 不移除 base64 的前缀，直接使用完整的 base64Content
                
                try {
                    const result = await BatchImportStudentAPI(base64Content, ignoreError);
                    
                    if (result?.output === 'Success' && result.data) {
                        const { total_count, success_count, failed_count, failed_details } = result.data;
                        
                        // 只显示总体的成功消息，不显示每行具体错误的 message
                        message.success(`导入成功：共 ${total_count} 条，成功 ${success_count} 条，失败 ${failed_count} 条`);
                        
                        if (failed_count > 0) {
                            // 如果选择了忽略错误，显示错误信息并延迟关闭
                            if (ignoreError) {
                                // 设置合并的错误信息
                                const errorDetails = failed_details.map(detail => `第 ${detail.row} 行：${detail.reason}`).join('\n');
                                setErrorMessage(`有 ${failed_count} 条数据导入失败:\n${errorDetails}`);
                                
                                // 延迟 5 秒后自动关闭对话框
                                setTimeout(() => {
                                    onSuccess?.(result);
                                    handleCancel();
                                    requestRefresh(true);
                                }, 5000);
                            } else {
                                // 未选择忽略错误，维持对话框打开状态，显示错误信息
                                const errorDetails = failed_details.map(detail => `第 ${detail.row} 行：${detail.reason}`).join('\n');
                                setErrorMessage(`有 ${failed_count} 条数据导入失败:\n${errorDetails}`);
                                onSuccess?.(result); // 仍然调用成功回调，但不关闭对话框
                                requestRefresh(true);
                            }
                        } else {
                            // 没有错误数据，直接关闭对话框
                            onSuccess?.(result);
                            handleCancel();
                            requestRefresh(true);
                        }
                    } else {
                        // API 调用成功但返回错误
                        const errMsg = result?.error_message || '导入失败';
                        setErrorMessage(errMsg);
                        
                        if (ignoreError) {
                            // 如果选择了忽略错误，延迟关闭
                            setTimeout(() => {
                                onError?.(new Error(errMsg));
                                handleCancel();
                            }, 5000);
                        } else {
                            onError?.(new Error(errMsg));
                        }
                    }
                } catch (error) {
                    // API 调用异常
                    const errMsg = error instanceof Error ? error.message : '导入过程中发生错误';
                    setErrorMessage(errMsg);
                    
                    if (ignoreError) {
                        // 如果选择了忽略错误，延迟关闭
                        setTimeout(() => {
                            onError?.(error as Error);
                            handleCancel();
                        }, 5000);
                    } else {
                        onError?.(error as Error);
                    }
                }
            };
            
            reader.onerror = () => {
                // 文件读取错误
                const errMsg = '文件读取失败';
                setErrorMessage(errMsg);
                
                if (ignoreError) {
                    // 如果选择了忽略错误，延迟关闭
                    setTimeout(() => {
                        onError?.(new Error(errMsg));
                        handleCancel();
                    }, 5000);
                } else {
                    onError?.(new Error(errMsg));
                }
            };
        } catch (error) {
            // 其他错误
            const errMsg = error instanceof Error ? error.message : '导入失败';
            setErrorMessage(errMsg);
            
            if (ignoreError) {
                // 如果选择了忽略错误，延迟关闭
                setTimeout(() => {
                    onError?.(error as Error);
                    handleCancel();
                }, 5000);
            } else {
                onError?.(error as Error);
            }
        }
    }

    return (
        <Modal 
            open={isModalOpen} 
            onOk={handleOk} 
            onCancel={handleCancel}
            className="building-import-modal"
            width={600}
            title={
                <div className="text-xl font-bold text-primary flex items-center gap-2 py-2">
                    <User theme="outline" size="18"/>
                    <span>批量导入学生</span>
                </div>
            }
            footer={
                <div className="modal-action flex justify-end gap-3 mt-6">
                    <button 
                        type="button"
                        onClick={handleCancel}
                        className="btn btn-outline btn-error px-6">
                        <CloseOne theme="outline" size="18"/>
                        <span>取消</span>
                    </button>
                    <button 
                        type="submit"
                        disabled={!file}
                        onClick={() => customRequest({
                            file: file as RcFile,
                            onSuccess: () => {
                                setFile(null);
                            },
                            onError: () => {
                                // 错误信息已经设置到 errorMessage 中，这里不清除文件
                                // 允许用户修改后重试
                            },
                            action: '',
                            method: 'POST'
                        })}
                        className="btn btn-primary px-6">
                        <CheckOne theme="outline" size="18"/>
                        <span>提交</span>
                    </button>
                </div>
            }>
            <div className="flex flex-col space-y-6 py-3">
                {/* 说明部分 */}
                <div className="bg-base-200 p-4 rounded-lg shadow-sm">
                    <h4 className="font-medium text-base mb-2">批量导入说明</h4>
                    <ul className="list-disc pl-5 text-sm space-y-1 text-base-content/80">
                        <li>请先下载导入模板，按照模板格式填写学生信息</li>
                        <li>支持 Excel 文件格式（.xlsx 和 .xls）</li>
                        <li>导入前请确保数据格式正确，避免导入失败</li>
                        <li>如遇部分数据错误，可选择"忽略错误继续导入"选项</li>
                    </ul>
                </div>

                {/* 错误信息显示区域 */}
                {errorMessage && (
                    <div className="bg-error/10 border border-error/30 text-error p-4 rounded-lg shadow-sm">
                        <h4 className="font-medium text-base mb-1 flex items-center">
                            <CloseOne theme="outline" size="18" className="mr-1.5"/>
                            导入错误
                        </h4>
                        <p className="text-sm whitespace-pre-wrap">{errorMessage}</p>
                    </div>
                )}

                {/* 操作区域 */}
                <div className="grid grid-cols-1 gap-5">
                    {/* 下载模板按钮 */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">第一步：下载模板</label>
                        <button 
                            onClick={downloadTemplate}
                            className="btn btn-outline btn-info w-full h-12 shadow-sm hover:shadow-md transition-all">
                            <Download theme="outline" size="20"/>
                            <span>下载学生导入模板</span>
                        </button>
                    </div>

                    {/* 上传区域 */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">第二步：上传填写好的 Excel 文件</label>
                        <AntUpload
                            maxCount={1}
                            customRequest={customRequest}
                            beforeUpload={(file) => {
                                const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                                    file.type === 'application/vnd.ms-excel';
                                if (!isExcel) {
                                    message.error('只能上传 Excel 文件（.xlsx 或 .xls）！');
                                    return false;
                                }
                                setFile(file);
                                setErrorMessage(null); // 清除之前的错误信息
                                return false;
                            }}
                            onRemove={() => {
                                setFile(null);
                                setErrorMessage(null); // 清除错误信息
                            }}>
                            <div className={`border-2 border-dashed ${errorMessage ? 'border-error/50' : 'border-primary/50'} rounded-lg p-6 text-center flex flex-col items-center justify-center gap-3 hover:border-primary transition-colors cursor-pointer 
                                ${file ? 'bg-primary/5' : 'bg-base-200/50'}`}>
                                <Upload theme="outline" size="28" fill={errorMessage ? "#ff4d4f" : (file ? "#4096ff" : "#888")} />
                                <div>
                                    <p className="font-medium">{file ? file.name : '点击或拖拽文件到此区域上传'}</p>
                                    <p className="text-xs text-base-content/60 mt-1">
                                        {file ? `${(file.size / 1024).toFixed(2)} KB` : '支持 Excel 文件格式（.xlsx 和 .xls）'}
                                    </p>
                                </div>
                            </div>
                        </AntUpload>
                    </div>

                    {/* 选项区域 */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">第三步：导入选项</label>
                        <div className="bg-base-200/70 p-3 rounded-lg flex items-center gap-3">
                            <input
                                type="checkbox"
                                className="toggle toggle-primary"
                                checked={ignoreError}
                                onChange={(e) => setIgnoreError(e.target.checked)}
                            />
                            <div>
                                <p className="font-medium">忽略错误继续导入</p>
                                <p className="text-xs text-base-content/70">启用此选项后，导入过程中遇到错误数据将被跳过，其他正确数据继续导入</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
} 