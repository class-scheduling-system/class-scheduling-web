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

import {useEffect, useRef, useState} from "react";
import {SiteInfoEntity} from "../../models/entity/site_info_entity.ts";
import {AddOne, Copy, Delete, EditTwo, PreviewOpen, Schedule, Search} from "@icon-park/react";

export function AcademicSchedule({site}: Readonly<{
    site: SiteInfoEntity
}>) {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isDescending, setIsDescending] = useState(true);
    const [activeTab, setActiveTab] = useState("schedule");
    const inputFocus = useRef<HTMLInputElement>(null);

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

    // 模拟排课数据
    const [schedules] = useState([
        { id: 1, course: "计算机导论", teacher: "张教授", classroom: "主教101", time: "周一 1-2节", class: "计科2101", semester: "2024-2025-2" },
        { id: 2, course: "数据结构", teacher: "李教授", classroom: "主教102", time: "周一 3-4节", class: "计科2101", semester: "2024-2025-2" },
        { id: 3, course: "算法设计", teacher: "王教授", classroom: "主教103", time: "周二 1-2节", class: "软工2102", semester: "2024-2025-2" },
        { id: 4, course: "操作系统", teacher: "刘教授", classroom: "主教201", time: "周二 3-4节", class: "软工2102", semester: "2024-2025-2" },
        { id: 5, course: "数据库系统", teacher: "陈教授", classroom: "主教202", time: "周三 1-2节", class: "计科2101", semester: "2024-2025-2" },
        { id: 6, course: "计算机网络", teacher: "张教授", classroom: "主教203", time: "周三 3-4节", class: "软工2102", semester: "2024-2025-2" },
        { id: 7, course: "软件工程", teacher: "吴教授", classroom: "主教301", time: "周四 1-2节", class: "计科2101", semester: "2024-2025-2" },
        { id: 8, course: "人工智能", teacher: "赵教授", classroom: "主教302", time: "周四 3-4节", class: "软工2102", semester: "2024-2025-2" }
    ]);

    // 模拟教室数据
    const [classrooms] = useState([
        { id: 1, name: "主教101", building: "主教学楼", capacity: 60, facilities: "投影仪、空调", status: "可用" },
        { id: 2, name: "主教102", building: "主教学楼", capacity: 60, facilities: "投影仪、空调", status: "可用" },
        { id: 3, name: "主教103", building: "主教学楼", capacity: 60, facilities: "投影仪、空调", status: "可用" },
        { id: 4, name: "主教201", building: "主教学楼", capacity: 80, facilities: "投影仪、空调、多媒体", status: "可用" },
        { id: 5, name: "主教202", building: "主教学楼", capacity: 80, facilities: "投影仪、空调、多媒体", status: "维修中" },
        { id: 6, name: "主教203", building: "主教学楼", capacity: 80, facilities: "投影仪、空调、多媒体", status: "可用" }
    ]);

    useEffect(() => {
        document.title = `排课管理 | ${site.name ?? "Frontleaves Technology"}`;
    }, [site.name]);

    // 基于当前标签筛选数据
    const filteredData = activeTab === "schedule"
        ? schedules.filter(
            schedule => schedule.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      schedule.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      schedule.classroom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      schedule.class.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : classrooms.filter(
            classroom => classroom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       classroom.building.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       classroom.facilities.toLowerCase().includes(searchTerm.toLowerCase())
          );

    // 使用排序方向重新排序
    const sortedData = [...filteredData];
    if (isDescending) {
        sortedData.sort((a, b) => b.id - a.id); // 降序
    } else {
        sortedData.sort((a, b) => a.id - b.id); // 升序
    }

    // 分页逻辑
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    // 分页控制
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    // 切换标签时重置页码
    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    return (
        <div className="space-y-6 w-full">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Schedule theme="outline" size="24" />
                    排课管理
                </h1>

                <div className="flex gap-2">
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                            <Search theme="outline" size="18" />
                        </div>
                        <input
                            ref={inputFocus}
                            type="text"
                            placeholder={`搜索${activeTab === "schedule" ? "排课" : "教室"}...`}
                            className="input input-bordered pl-10 pr-16"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1); // 重置页码
                            }}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                            <kbd className="kbd kbd-sm">Ctrl</kbd>
                            <span className="mx-1">+</span>
                            <kbd className="kbd kbd-sm">K</kbd>
                        </div>
                    </div>

                    <button className="btn btn-primary flex items-center gap-1">
                        <AddOne theme="outline" size="18" />
                        <span className="hidden sm:inline">添加{activeTab === "schedule" ? "排课" : "教室"}</span>
                        <span className="sm:hidden">添加</span>
                    </button>
                </div>
            </div>

            <div className="tabs tabs-boxed bg-base-200 p-1">
                <button
                    className={`tab ${activeTab === "schedule" ? "tab-active" : ""}`}
                    onClick={() => handleTabChange("schedule")}
                >
                    课程安排
                </button>
                <button
                    className={`tab ${activeTab === "classroom" ? "tab-active" : ""}`}
                    onClick={() => handleTabChange("classroom")}
                >
                    教室管理
                </button>
            </div>

            <div className="card bg-base-100 shadow-md overflow-hidden">
                <div className="card-body p-0">
                    <div className="overflow-x-auto overflow-hidden">
                        {activeTab === "schedule" ? (
                            <table className="table table-zebra">
                                <thead className="bg-base-200">
                                    <tr>
                                        <th>课程名称</th>
                                        <th>授课教师</th>
                                        <th>教室</th>
                                        <th>时间</th>
                                        <th>班级</th>
                                        <th>学期</th>
                                        <th>操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((schedule: any) => (
                                        <tr key={schedule.id}>
                                            <td>{schedule.course}</td>
                                            <td>{schedule.teacher}</td>
                                            <td>{schedule.classroom}</td>
                                            <td>{schedule.time}</td>
                                            <td>{schedule.class}</td>
                                            <td>{schedule.semester}</td>
                                            <td className="space-x-1">
                                                <button className="btn btn-xs btn-primary" title="查看">
                                                    <PreviewOpen theme="outline" size="16" />
                                                </button>
                                                <button className="btn btn-xs btn-warning" title="编辑">
                                                    <EditTwo theme="outline" size="16" />
                                                </button>
                                                <button className="btn btn-xs btn-info" title="复制">
                                                    <Copy theme="outline" size="16" />
                                                </button>
                                                <button className="btn btn-xs btn-error" title="删除">
                                                    <Delete theme="outline" size="16" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <table className="table table-zebra">
                                <thead className="bg-base-200">
                                    <tr>
                                        <th>教室名称</th>
                                        <th>所属教学楼</th>
                                        <th>容量</th>
                                        <th>设施</th>
                                        <th>状态</th>
                                        <th>操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((classroom: any) => (
                                        <tr key={classroom.id}>
                                            <td>{classroom.name}</td>
                                            <td>{classroom.building}</td>
                                            <td>{classroom.capacity}</td>
                                            <td>{classroom.facilities}</td>
                                            <td>
                                                <div className={`badge ${classroom.status === '可用' ? 'badge-success' : 'badge-error'}`}>
                                                    {classroom.status}
                                                </div>
                                            </td>
                                            <td className="space-x-1">
                                                <button className="btn btn-xs btn-primary" title="查看">
                                                    <PreviewOpen theme="outline" size="16" />
                                                </button>
                                                <button className="btn btn-xs btn-warning" title="编辑">
                                                    <EditTwo theme="outline" size="16" />
                                                </button>
                                                <button className="btn btn-xs btn-error" title="删除">
                                                    <Delete theme="outline" size="16" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
            {/* 移动分页控制到卡片外部 */}
            <div className="flex justify-center">
                <div className="join">
                    <button
                        className="btn btn-sm join-item"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        上一页
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                        <button
                            key={number}
                            className={`join-item btn btn-sm ${currentPage === number ? 'btn-active' : ''}`}
                            onClick={() => handlePageChange(number)}
                        >
                            {number}
                        </button>
                    ))}

                    <button
                        className="btn btn-sm join-item"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        下一页
                    </button>

                    <select
                        className="select select-sm join-item border-l-0"
                        value={itemsPerPage}
                        onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1); // 重置页码
                        }}
                    >
                        <option value={5}>5条/页</option>
                        <option value={10}>10条/页</option>
                        <option value={15}>15条/页</option>
                        <option value={20}>20条/页</option>
                        <option value={50}>50条/页</option>
                    </select>

                    <button
                        className={`btn btn-sm join-item ${isDescending ? 'btn-active' : ''}`}
                        onClick={() => setIsDescending(!isDescending)}
                        title={isDescending ? "当前为降序" : "当前为升序"}
                    >
                        {isDescending ? "↓" : "↑"}
                    </button>
                </div>
            </div>
        </div>
    );
}
