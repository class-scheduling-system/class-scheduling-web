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

import { useEffect, useRef, useState } from "react";
import { SiteInfoEntity } from "../../models/entity/site_info_entity.ts";
import { AddOne, ArrowLeft, Schedule, Search } from "@icon-park/react";
import { 
  ScheduleEntity, 
  ScheduleGridCell, 
  ScheduleGridEntity 
} from "../../models/entity/schedule_entity.ts";
import { ScheduleListComponent } from "../../components/academic/schedule/schedule_list_component.tsx";
import { PaginationComponent } from "../../components/academic/schedule/pagination_component.tsx";
import { ScheduleGridComponent } from "../../components/academic/schedule/schedule_grid_component.tsx";
import { Breadcrumb, BreadcrumbItem } from "../../components/breadcrumb_component";
import { message } from "antd";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useNavigate } from "react-router";
import { TimetableComponent } from "../../components/academic/schedule/timetable_component";

/**
 * # 排课管理组件
 * 
 * 教务端排课管理主页面，提供排课列表和课表视图功能
 * 
 * @param site 站点信息
 * @returns 排课管理组件
 */
export function AcademicSchedule({site}: Readonly<{
    site: SiteInfoEntity
}>) {
    
    // 基础状态
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isDescending, setIsDescending] = useState(true);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [loading, setLoading] = useState(false);
    
    // 视图状态
    const [viewMode, setViewMode] = useState<"list" | "grid" | "timetable">("list");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [selectedSchedule, setSelectedSchedule] = useState<ScheduleEntity | null>(null);
    const [selectedFilter, setSelectedFilter] = useState<{type: string, value: string} | null>(null);
    
    // 搜索引用
    const inputFocus = useRef<HTMLInputElement>(null);
    
    // 模拟数据 - 实际应用中应该通过API获取
    const [schedules] = useState<ScheduleEntity[]>([
        { id: 1, course: "计算机导论", teacher: "张教授", classroom: "主教101", time: "周一 1-2节", class: "计科2101", semester: "2024-2025-2" },
        { id: 2, course: "数据结构", teacher: "李教授", classroom: "主教102", time: "周一 3-4节", class: "计科2101", semester: "2024-2025-2" },
        { id: 3, course: "算法设计", teacher: "王教授", classroom: "主教103", time: "周二 1-2节", class: "软工2102", semester: "2024-2025-2" },
        { id: 4, course: "操作系统", teacher: "刘教授", classroom: "主教201", time: "周二 3-4节", class: "软工2102", semester: "2024-2025-2" },
        { id: 5, course: "数据库系统", teacher: "陈教授", classroom: "主教202", time: "周三 1-2节", class: "计科2101", semester: "2024-2025-2" },
        { id: 6, course: "计算机网络", teacher: "张教授", classroom: "主教203", time: "周三 3-4节", class: "软工2102", semester: "2024-2025-2" },
        { id: 7, course: "软件工程", teacher: "吴教授", classroom: "主教301", time: "周四 1-2节", class: "计科2101", semester: "2024-2025-2" },
        { id: 8, course: "人工智能", teacher: "赵教授", classroom: "主教302", time: "周四 3-4节", class: "软工2102", semester: "2024-2025-2" }
    ]);
    
    // 设置页面标题
    useEffect(() => {
        document.title = `排课管理 | ${site.name ?? "Frontleaves Technology"}`;
    }, [site.name]);
    
    // 键盘快捷键
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.ctrlKey && event.key === "k") {
                event.preventDefault();
                inputFocus.current?.focus();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);
    
    // 模拟二维课程表数据
    const generateScheduleGrid = (filterType: string, filterValue: string): ScheduleGridEntity => {
        // 定义行（节次）和列（星期）
        const rows = ["第1节", "第2节", "第3节", "第4节", "第5节", "第6节", "第7节", "第8节"];
        const columns = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
        
        // 初始化空网格
        const grid: ScheduleGridCell[][] = [];
        for (let i = 0; i < rows.length; i++) {
            grid[i] = [];
            for (let j = 0; j < columns.length; j++) {
                grid[i][j] = {};
            }
        }
        
        // 根据筛选条件填充网格数据
        const filteredSchedules = schedules.filter(schedule => {
            if (filterType === "class") {
                return schedule.class === filterValue;
            } else if (filterType === "teacher") {
                return schedule.teacher === filterValue;
            } else if (filterType === "classroom") {
                return schedule.classroom === filterValue;
            }
            return false;
        });
        
        // 填充课程数据到网格
        filteredSchedules.forEach(schedule => {
            // 解析时间信息，例如："周一 1-2节"
            const dayMatch = schedule.time.match(/周(一|二|三|四|五|六|日)/);
            const periodMatch = schedule.time.match(/(\d+)-(\d+)节/);
            
            if (dayMatch && periodMatch) {
                const dayMap: {[key: string]: number} = {
                    "一": 0, "二": 1, "三": 2, "四": 3, "五": 4, "六": 5, "日": 6
                };
                const day = dayMap[dayMatch[1]];
                const startPeriod = parseInt(periodMatch[1]) - 1;
                const endPeriod = parseInt(periodMatch[2]) - 1;
                
                // 填充第一个单元格
                grid[startPeriod][day] = {
                    id: schedule.id,
                    courseName: schedule.course,
                    teacherName: schedule.teacher,
                    classroom: schedule.classroom,
                    rowSpan: endPeriod - startPeriod + 1
                };
                
                // 标记被连堂课占用的单元格
                for (let i = startPeriod + 1; i <= endPeriod; i++) {
                    grid[i][day] = {
                        isOccupied: true
                    };
                }
            }
        });
        
        return { rows, columns, grid };
    };
    
    // 基于搜索词筛选数据
    const getFilteredSchedules = () => {
        return schedules.filter(schedule => 
            schedule.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
            schedule.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
            schedule.classroom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            schedule.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
            schedule.semester.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };
    
    // 使用排序方向对数据进行排序
    const getSortedSchedules = () => {
        const filteredData = getFilteredSchedules();
        return [...filteredData].sort((a, b) => isDescending ? b.id - a.id : a.id - b.id);
    };
    
    // 获取当前页数据
    const getCurrentPageSchedules = () => {
        const sortedData = getSortedSchedules();
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return sortedData.slice(indexOfFirstItem, indexOfLastItem);
    };
    
    // 计算总页数
    const getTotalPages = () => {
        return Math.ceil(getFilteredSchedules().length / itemsPerPage);
    };
    
    // 重置筛选条件
    const handleReset = () => {
        setSearchTerm("");
        setCurrentPage(1);
        
        if (viewMode === "grid") {
            setViewMode("list");
            setSelectedSchedule(null);
            setSelectedFilter(null);
        }
    };
    
    // 视图切换处理
    const handleViewScheduleGrid = (schedule: ScheduleEntity, filterType: string) => {
        setViewMode("grid");
        setSelectedSchedule(schedule);
        
        let filterValue = "";
        if (filterType === "class") {
            filterValue = schedule.class;
        } else if (filterType === "teacher") {
            filterValue = schedule.teacher;
        } else if (filterType === "classroom") {
            filterValue = schedule.classroom;
        }
        
        setSelectedFilter({ type: filterType, value: filterValue });
    };
    
    // 返回列表视图
    const handleBackToList = () => {
        setViewMode("list");
        setSelectedSchedule(null);
        setSelectedFilter(null);
    };
    
    // 获取二维课程表数据
    const getScheduleGridData = (): ScheduleGridEntity => {
        if (!selectedFilter) {
            return { rows: [], columns: [], grid: [] };
        }
        
        return generateScheduleGrid(selectedFilter.type, selectedFilter.value);
    };
    
    // 添加排课
    const handleAddSchedule = () => {
        message.info("添加排课功能待实现");
        // 实际应用中应该跳转到添加排课页面
        // navigate("/academic/schedule/add");
    };
    
    // 编辑排课
    const handleEditSchedule = (schedule: ScheduleEntity) => {
        message.info(`编辑排课：${schedule.course}`);
        // 实际应用中应该跳转到编辑排课页面
        // navigate(`/academic/schedule/edit/${schedule.id}`);
    };
    
    // 复制排课
    const handleCopySchedule = (schedule: ScheduleEntity) => {
        message.info(`复制排课：${schedule.course}`);
        // 实际应用中应该显示复制排课对话框或跳转到复制排课页面
    };
    
    // 删除排课
    const handleDeleteSchedule = (schedule: ScheduleEntity) => {
        message.info(`删除排课：${schedule.course}`);
        // 实际应用中应该显示确认删除对话框
    };
    
    // 渲染页面内容
    return (
        <div className="space-y-4 w-full">
            <Breadcrumb>
                <BreadcrumbItem href="/academic">教务中心</BreadcrumbItem>
                <BreadcrumbItem active>排课管理</BreadcrumbItem>
                {viewMode === "grid" && selectedFilter && (
                    <BreadcrumbItem active>
                        {selectedFilter.type === "class" && "班级课表"}
                        {selectedFilter.type === "teacher" && "教师课表"}
                        {selectedFilter.type === "classroom" && "教室课表"}
                    </BreadcrumbItem>
                )}
                {viewMode === "timetable" && (
                    <BreadcrumbItem active>课程总表</BreadcrumbItem>
                )}
            </Breadcrumb>
            
            {viewMode === "list" ? (
                <>
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* 左侧筛选区 */}
                        <div className="lg:w-72 w-full">
                            <div className="card bg-base-100 shadow-sm">
                                <div className="card-body gap-4">
                                    <h3 className="text-lg font-medium">排课筛选</h3>
                                    
                                    {/* 搜索框 */}
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                            <Search theme="outline" size="18" />
                                        </div>
                                        <input
                                            ref={inputFocus}
                                            type="text"
                                            placeholder="搜索排课..."
                                            className="input input-bordered w-full pl-10 pr-16"
                                            value={searchTerm}
                                            onChange={(e) => {
                                                setSearchTerm(e.target.value);
                                                setCurrentPage(1);
                                            }}
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                                            <kbd className="kbd kbd-sm">Ctrl</kbd>
                                            <span className="mx-1">+</span>
                                            <kbd className="kbd kbd-sm">K</kbd>
                                        </div>
                                    </div>
                                    
                                    {/* 重置按钮 */}
                                    <button 
                                        className="btn btn-outline btn-sm w-full"
                                        onClick={handleReset}
                                    >
                                        重置筛选
                                    </button>
                                    
                                    {/* 筛选条件列表 - 实际应用中可以添加更多筛选条件 */}
                                    <div className="space-y-2 mt-2">
                                        <h4 className="text-sm font-medium">学期</h4>
                                        <select className="select select-bordered w-full">
                                            <option value="">所有学期</option>
                                            <option value="2024-2025-2">2024-2025学年第2学期</option>
                                            <option value="2024-2025-1">2024-2025学年第1学期</option>
                                        </select>
                                        
                                        <h4 className="text-sm font-medium mt-4">班级</h4>
                                        <select className="select select-bordered w-full">
                                            <option value="">所有班级</option>
                                            <option value="计科2101">计科2101</option>
                                            <option value="软工2102">软工2102</option>
                                        </select>
                                        
                                        {/* 课程表视图按钮 */}
                                        <div className="mt-6">
                                            <button 
                                                className="btn btn-primary w-full"
                                                onClick={() => {
                                                    // 直接切换到课程表视图模式
                                                    setViewMode("timetable");
                                                }}
                                            >
                                                查看课程表视图
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* 右侧内容区 */}
                        <div className="flex-1 flex flex-col gap-4">
                            <div className="flex justify-between items-center">
                                <h1 className="text-2xl font-bold flex items-center gap-2">
                                    <Schedule theme="outline" size="24" />
                                    排课管理
                                </h1>
                                
                                <button 
                                    className="btn btn-primary flex items-center gap-1"
                                    onClick={handleAddSchedule}
                                >
                                    <AddOne theme="outline" size="18" />
                                    <span>添加排课</span>
                                </button>
                            </div>
                            
                            <ScheduleListComponent
                                schedules={getCurrentPageSchedules()}
                                loading={loading}
                                onView={(schedule) => handleViewScheduleGrid(schedule, "class")}
                                onEdit={handleEditSchedule}
                                onCopy={handleCopySchedule}
                                onDelete={handleDeleteSchedule}
                            />
                            
                            <PaginationComponent
                                currentPage={currentPage}
                                totalPages={getTotalPages()}
                                isDescending={isDescending}
                                itemsPerPage={itemsPerPage}
                                onPageChange={setCurrentPage}
                                onItemsPerPageChange={(value) => {
                                    setItemsPerPage(value);
                                    setCurrentPage(1);
                                }}
                                onSortDirectionChange={setIsDescending}
                            />
                        </div>
                    </div>
                </>
            ) : viewMode === "grid" ? (
                <>
                    {/* 课程表视图 */}
                    <div className="flex justify-between items-center">
                        <button
                            className="btn btn-sm btn-ghost flex items-center gap-1"
                            onClick={handleBackToList}
                        >
                            <ArrowLeft theme="outline" size="16" />
                            <span>返回列表</span>
                        </button>
                        
                        <h1 className="text-2xl font-bold">
                            {selectedFilter && (
                                <>
                                    {selectedFilter.type === "class" && `${selectedFilter.value} 课程表`}
                                    {selectedFilter.type === "teacher" && `${selectedFilter.value} 授课表`}
                                    {selectedFilter.type === "classroom" && `${selectedFilter.value} 排课表`}
                                </>
                            )}
                        </h1>
                        
                        <div className="w-32"></div> {/* 占位元素，保持标题居中 */}
                    </div>
                    
                    <ScheduleGridComponent
                        scheduleData={getScheduleGridData()}
                        loading={loading}
                        onCellClick={(cell) => console.log("点击课程:", cell)}
                    />
                </>
            ) : (
                // 新增的课程表二维视图
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <button
                            className="btn btn-sm btn-ghost flex items-center gap-1"
                            onClick={() => setViewMode("list")}
                        >
                            <ArrowLeft theme="outline" size="16" />
                            <span>返回列表</span>
                        </button>
                        
                        <h1 className="text-2xl font-bold">
                            课程安排表
                        </h1>
                        
                        <div className="w-32"></div> {/* 占位元素，保持标题居中 */}
                    </div>
                    
                    <TimetableComponent 
                        initialViewType="class"
                        initialClasses={
                            searchTerm && (searchTerm.includes("计科") || searchTerm.includes("软工")) 
                                ? [searchTerm] 
                                : []
                        }
                        onBack={() => setViewMode("list")}
                    />
                </div>
            )}
        </div>
    );
}
