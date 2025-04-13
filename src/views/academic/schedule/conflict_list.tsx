/*
 * --------------------------------------------------------------------------------
 * Copyright (c) 2022-NOW(至今) 锋楪技术团队
 * Author: 锋楪技术团队 (https://www.frontleaves.com)
 *
 * 本文件包含锋楪技术团队项目的源代码，项目的所有源代码均遵循 MIT 开源许可证协议。
 * --------------------------------------------------------------------------------
 */

import React, { useEffect, useState } from "react";
import { ArrowLeft, Attention, Refresh, Edit } from "@icon-park/react";
import { message, Modal, Table, Tag, TablePaginationConfig } from "antd";
import { useNavigate, useLocation } from "react-router";
import { GetConflictPageAPI, GetConflictDetailAPI } from "../../../apis/conflict_api";
import { SchedulingConflictDTO } from "../../../models/dto/scheduling_conflict_dto";
import { PageEntity } from "../../../models/entity/page_entity";
import { SiteInfoEntity } from "../../../models/entity/site_info_entity";
import { GetClassAssignmentListAPI } from "../../../apis/class_assignment_api";
import { ClassAssignmentEntity } from "../../../models/entity/class_assignment_entity";

/**
 * 排课冲突列表页面
 * 
 * @param site 站点信息
 * @returns 排课冲突列表页面组件
 */
export function ConflictList({ site }: Readonly<{ site: SiteInfoEntity }>) {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as { semesterUuid?: string } || {};
    
    const [loading, setLoading] = useState<boolean>(false);
    const [detailLoading, setDetailLoading] = useState<boolean>(false);
    const [conflicts, setConflicts] = useState<SchedulingConflictDTO[]>([]);
    const [selectedConflict, setSelectedConflict] = useState<SchedulingConflictDTO | null>(null);
    const [pagination, setPagination] = useState<{ current: number; pageSize: number; total: number }>({
        current: 1,
        pageSize: 10,
        total: 0
    });
    const [semesterUuid] = useState<string>(state.semesterUuid || "");
    const [conflictType, setConflictType] = useState<number | undefined>(undefined);
    const [resolutionStatus, setResolutionStatus] = useState<number | undefined>(undefined);
    
    // 模态框状态
    const [detailModalVisible, setDetailModalVisible] = useState<boolean>(false);
    const [editSelectionModalVisible, setEditSelectionModalVisible] = useState<boolean>(false);
    
    // 排课信息列表
    const [assignments, setAssignments] = useState<{[key: string]: ClassAssignmentEntity}>({});

    // 设置页面标题
    useEffect(() => {
        document.title = `排课冲突 | ${site.name ?? "课程排表系统"}`;
    }, [site.name]);
    
    // 获取排课分配列表
    useEffect(() => {
        if (semesterUuid) {
            fetchAssignments();
        }
    }, [semesterUuid]);

    // 加载冲突数据
    useEffect(() => {
        if (semesterUuid) {
            // 确保每次条件变化时重置为第一页
            if (pagination.current !== 1) {
                setPagination({
                    ...pagination,
                    current: 1
                });
            } else {
                fetchConflicts();
            }
        }
    }, [semesterUuid, conflictType, resolutionStatus, pagination.pageSize]);

    // 单独监听页码变化
    useEffect(() => {
        if (semesterUuid) {
            fetchConflicts();
        }
    }, [pagination.current]);

    // 获取排课分配列表
    const fetchAssignments = async () => {
        try {
            const response = await GetClassAssignmentListAPI(semesterUuid);
            if (response && response.output === "Success" && response.data) {
                // 将排课列表转换为以UUID为键的对象，方便查询
                const assignmentMap: {[key: string]: ClassAssignmentEntity} = {};
                response.data.forEach(assignment => {
                    assignmentMap[assignment.class_assignment_uuid] = assignment;
                });
                setAssignments(assignmentMap);
            }
        } catch (error) {
            console.error("获取排课列表失败:", error);
        }
    };

    // 获取冲突列表数据
    const fetchConflicts = async () => {
        if (!semesterUuid) {
            message.warning("请选择学期");
            return;
        }

        setLoading(true);
        try {
            // 修正：后端分页从第一页开始，不需要减1
            const response = await GetConflictPageAPI(
                pagination.current, // 后端分页从第一页开始
                pagination.pageSize,
                semesterUuid,
                conflictType,
                resolutionStatus
            );

            if (response && response.output === "Success" && response.data) {
                const pageData: PageEntity<SchedulingConflictDTO> = response.data;
                setConflicts(pageData.records || []);
                setPagination({
                    ...pagination,
                    total: pageData.total || 0
                });
            } else {
                message.error(response?.error_message || "获取冲突列表失败");
            }
        } catch (error) {
            console.error("获取冲突列表数据失败:", error);
            message.error("获取冲突列表数据失败，请检查网络连接");
        } finally {
            setLoading(false);
        }
    };

    // 处理页码变化
    const handleTableChange = (pagination: TablePaginationConfig) => {
        setPagination({
            current: pagination.current || 1,
            pageSize: pagination.pageSize || 10,
            total: pagination.total || 0
        });
    };

    // 获取冲突类型名称
    const getConflictTypeName = (type: number): string => {
        switch (type) {
            case 1:
                return "教师冲突";
            case 2:
                return "教室冲突";
            case 3:
                return "学生冲突";
            case 4:
                return "时间偏好冲突";
            case 5:
                return "资源分配冲突";
            default:
                return "未知冲突";
        }
    };

    // 获取冲突状态名称
    const getStatusName = (status: number): string => {
        switch (status) {
            case 0:
                return "未解决";
            case 1:
                return "已解决";
            case 2:
                return "已忽略";
            default:
                return "未知状态";
        }
    };

    // 查看冲突详情
    const handleViewConflictDetail = async (conflictUuid: string) => {
        setDetailLoading(true);
        try {
            const response = await GetConflictDetailAPI(conflictUuid);
            if (response && response.output === "Success" && response.data) {
                setSelectedConflict(response.data);
                setDetailModalVisible(true);
            } else {
                message.error(response?.error_message || "获取冲突详情失败");
            }
        } catch (error) {
            console.error("获取冲突详情失败:", error);
            message.error("获取冲突详情失败，请检查网络连接");
        } finally {
            setDetailLoading(false);
        }
    };
    
    // 编辑冲突
    const handleEditConflict = (conflict: SchedulingConflictDTO) => {
        setSelectedConflict(conflict);
        setEditSelectionModalVisible(true);
    };
    
    // 处理编辑选择
    const handleEditSelection = (assignmentUuid: string) => {
        setEditSelectionModalVisible(false);
        navigate(`/academic/schedule/edit/${assignmentUuid}`);
    };
    
    // 获取课程名称
    const getCourseName = (assignmentUuid: string): string => {
        const assignment = assignments[assignmentUuid];
        if (assignment) {
            return assignment.teaching_class_name || "未知课程";
        }
        return "未知课程";
    };

    return (
        <div className="space-y-6 w-full">
            {/* 顶部导航 */}
            <div className="flex items-center justify-between bg-base-100 p-4 rounded-lg shadow-sm border border-base-200">
                <div className="flex items-center space-x-3">
                    <button 
                        className="btn btn-sm btn-outline" 
                        onClick={() => navigate("/academic/schedule")}
                    >
                        <ArrowLeft />
                        返回排课管理
                    </button>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Attention theme="outline" size="24" />
                        排课冲突
                    </h2>
                </div>
                <div className="flex items-center space-x-2">
                    <button 
                        className="btn btn-sm btn-outline"
                        onClick={() => {
                            // 重置为第一页并刷新数据
                            setPagination({
                                ...pagination,
                                current: 1
                            });
                            setTimeout(fetchConflicts, 0);
                        }}
                        disabled={loading}
                    >
                        <Refresh />
                        刷新
                    </button>
                </div>
            </div>

            {/* 筛选条件区域 - 使用DaisyUI组件 */}
            <div className="bg-base-100 p-4 rounded-lg shadow-sm border border-base-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* 冲突类型筛选 */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">冲突类型</span>
                        </label>
                        <select 
                            className="select select-bordered w-full"
                            value={conflictType || ""}
                            onChange={(e) => setConflictType(e.target.value ? Number(e.target.value) : undefined)}
                        >
                            <option value="">全部冲突类型</option>
                            <option value="1">教师冲突</option>
                            <option value="2">教室冲突</option>
                            <option value="3">学生冲突</option>
                            <option value="4">时间偏好冲突</option>
                            <option value="5">资源分配冲突</option>
                        </select>
                    </div>

                    {/* 解决状态筛选 */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">解决状态</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                            <label className="label cursor-pointer gap-2">
                                <input 
                                    type="radio" 
                                    name="resolution-status" 
                                    className="radio radio-sm" 
                                    checked={resolutionStatus === undefined}
                                    onChange={() => setResolutionStatus(undefined)}
                                />
                                <span className="label-text">全部</span>
                            </label>
                            <label className="label cursor-pointer gap-2">
                                <input 
                                    type="radio" 
                                    name="resolution-status" 
                                    className="radio radio-sm radio-error" 
                                    checked={resolutionStatus === 0}
                                    onChange={() => setResolutionStatus(0)}
                                />
                                <span className="label-text">未解决</span>
                            </label>
                            <label className="label cursor-pointer gap-2">
                                <input 
                                    type="radio" 
                                    name="resolution-status" 
                                    className="radio radio-sm radio-success" 
                                    checked={resolutionStatus === 1}
                                    onChange={() => setResolutionStatus(1)}
                                />
                                <span className="label-text">已解决</span>
                            </label>
                            <label className="label cursor-pointer gap-2">
                                <input 
                                    type="radio" 
                                    name="resolution-status" 
                                    className="radio radio-sm" 
                                    checked={resolutionStatus === 2}
                                    onChange={() => setResolutionStatus(2)}
                                />
                                <span className="label-text">已忽略</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* 冲突列表 */}
            <div className="bg-base-100 p-4 rounded-lg shadow-sm border border-base-200">
                <Table
                    dataSource={conflicts.map((conflict, index) => ({ ...conflict, key: index }))}
                    columns={[
                        {
                            title: "冲突类型",
                            dataIndex: "conflict_type",
                            key: "conflict_type",
                            render: (type: number) => (
                                <Tag color="blue">{getConflictTypeName(type)}</Tag>
                            )
                        },
                        {
                            title: "冲突描述",
                            dataIndex: "description",
                            key: "description",
                            ellipsis: {
                                showTitle: false
                            },
                            render: (text: string) => (
                                <div className="tooltip" data-tip={text}>
                                    <div className="truncate max-w-xs">{text}</div>
                                </div>
                            )
                        },
                        {
                            title: "解决状态",
                            dataIndex: "resolution_status",
                            key: "resolution_status",
                            render: (status: number) => (
                                <div className={`badge ${
                                    status === 0 ? 'badge-error' : 
                                    status === 1 ? 'badge-success' : 
                                    'badge-ghost'
                                }`}>
                                    {getStatusName(status)}
                                </div>
                            )
                        },
                        {
                            title: "创建时间",
                            dataIndex: "created_at",
                            key: "created_at",
                            render: (date: string) => new Date(date).toLocaleString()
                        },
                        {
                            title: "操作",
                            key: "action",
                            render: (_, record: SchedulingConflictDTO) => (
                                <div className="flex gap-2">
                                    <button
                                        className="btn btn-xs btn-outline"
                                        onClick={() => handleViewConflictDetail(record.conflict_uuid)}
                                    >
                                        查看
                                    </button>
                                    {record.resolution_status === 0 && (
                                        <button
                                            className="btn btn-xs btn-outline btn-primary flex items-center gap-1"
                                            onClick={() => handleEditConflict(record)}
                                        >
                                            <Edit theme="outline" size="14" />
                                            编辑
                                        </button>
                                    )}
                                </div>
                            )
                        }
                    ]}
                    loading={loading}
                    pagination={{
                        current: pagination.current,
                        pageSize: pagination.pageSize,
                        total: pagination.total,
                        showSizeChanger: true,
                        showTotal: (total) => `共 ${total} 条冲突`
                    }}
                    onChange={handleTableChange}
                />
            </div>
            
            {/* 冲突详情模态框 */}
            <Modal
                title={
                    <div className="flex items-center gap-2">
                        <Attention theme="outline" size="20" fill="#ff4d4f" />
                        <span>冲突详情</span>
                    </div>
                }
                open={detailModalVisible}
                onCancel={() => setDetailModalVisible(false)}
                footer={[
                    <button key="close" className="btn" onClick={() => setDetailModalVisible(false)}>
                        关闭
                    </button>
                ]}
                width={700}
            >
                {detailLoading ? (
                    <div className="flex justify-center py-8">
                        <span className="loading loading-spinner loading-lg"></span>
                    </div>
                ) : selectedConflict ? (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">冲突类型</span>
                                </label>
                                <div className="badge badge-lg badge-primary">
                                    {getConflictTypeName(selectedConflict.conflict_type)}
                                </div>
                            </div>
                            
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">解决状态</span>
                                </label>
                                <div className={`badge badge-lg ${
                                    selectedConflict.resolution_status === 0 ? 'badge-error' :
                                    selectedConflict.resolution_status === 1 ? 'badge-success' : 'badge-ghost'
                                }`}>
                                    {getStatusName(selectedConflict.resolution_status)}
                                </div>
                            </div>
                        </div>
                        
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">冲突描述</span>
                            </label>
                            <div className="p-3 bg-base-200 rounded-lg text-sm">
                                {selectedConflict.description}
                            </div>
                        </div>
                        
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">冲突时间</span>
                            </label>
                            <div className="p-3 bg-base-200 rounded-lg">
                                <span className="font-medium">第 {selectedConflict.conflict_time.week} 周</span>
                                <span className="mx-2">|</span>
                                <span>星期 {['一', '二', '三', '四', '五', '六', '日'][selectedConflict.conflict_time.day - 1]}</span>
                                <span className="mx-2">|</span>
                                <span>第 {selectedConflict.conflict_time.period} 节</span>
                            </div>
                        </div>
                        
                        <div className="divider">冲突课程信息</div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="card bg-base-200 shadow-sm">
                                <div className="card-body p-4">
                                    <h3 className="card-title text-sm">冲突课程 1</h3>
                                    <div className="text-xs space-y-1">
                                        <p>排课ID: {selectedConflict.first_assignment_uuid.substring(0, 8)}...</p>
                                        <p>课程名称: {getCourseName(selectedConflict.first_assignment_uuid)}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="card bg-base-200 shadow-sm">
                                <div className="card-body p-4">
                                    <h3 className="card-title text-sm">冲突课程 2</h3>
                                    <div className="text-xs space-y-1">
                                        <p>排课ID: {selectedConflict.second_assignment_uuid.substring(0, 8)}...</p>
                                        <p>课程名称: {getCourseName(selectedConflict.second_assignment_uuid)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {selectedConflict.resolution_status !== 0 && (
                            <>
                                <div className="divider">解决方案</div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-medium">解决方法</span>
                                        </label>
                                        <div className="badge badge-lg badge-primary">
                                            {(() => {
                                                switch (selectedConflict.resolution_method) {
                                                    case 1: return "调整第一项";
                                                    case 2: return "调整第二项";
                                                    case 3: return "两项都调整";
                                                    case 4: return "忽略冲突";
                                                    default: return "未解决";
                                                }
                                            })()}
                                        </div>
                                    </div>
                                    
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-medium">解决人</span>
                                        </label>
                                        <div className="p-3 bg-base-200 rounded-lg text-sm">
                                            {selectedConflict.resolved_by || "未知"}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium">解决说明</span>
                                    </label>
                                    <div className="p-3 bg-base-200 rounded-lg text-sm">
                                        {selectedConflict.resolution_notes || "无"}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-8 text-error">未能加载冲突详情</div>
                )}
            </Modal>
            
            {/* 编辑选择模态框 */}
            <Modal
                title="选择要编辑的冲突项"
                open={editSelectionModalVisible}
                onCancel={() => setEditSelectionModalVisible(false)}
                footer={null}
                width={500}
            >
                {selectedConflict && (
                    <div className="space-y-6">
                        <p className="text-sm">请选择要编辑的冲突课程：</p>
                        
                        <div className="grid grid-cols-1 gap-4">
                            <div 
                                className="card bg-base-200 hover:bg-base-300 cursor-pointer border border-base-300 transition-colors"
                                onClick={() => handleEditSelection(selectedConflict.first_assignment_uuid)}
                            >
                                <div className="card-body p-4">
                                    <h3 className="card-title text-base flex items-center gap-2">
                                        <Edit theme="outline" size="18" />
                                        编辑冲突课程 1
                                    </h3>
                                    <div className="space-y-1">
                                        <p className="text-sm">排课ID: {selectedConflict.first_assignment_uuid}</p>
                                        <p className="text-sm font-medium">课程名称: {getCourseName(selectedConflict.first_assignment_uuid)}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div 
                                className="card bg-base-200 hover:bg-base-300 cursor-pointer border border-base-300 transition-colors"
                                onClick={() => handleEditSelection(selectedConflict.second_assignment_uuid)}
                            >
                                <div className="card-body p-4">
                                    <h3 className="card-title text-base flex items-center gap-2">
                                        <Edit theme="outline" size="18" />
                                        编辑冲突课程 2
                                    </h3>
                                    <div className="space-y-1">
                                        <p className="text-sm">排课ID: {selectedConflict.second_assignment_uuid}</p>
                                        <p className="text-sm font-medium">课程名称: {getCourseName(selectedConflict.second_assignment_uuid)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex justify-end mt-4">
                            <button className="btn" onClick={() => setEditSelectionModalVisible(false)}>
                                取消
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
} 