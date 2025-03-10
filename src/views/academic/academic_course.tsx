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
import {AddOne, Book, Delete, EditTwo, PreviewOpen, Search} from "@icon-park/react";

export function AcademicCourse({site}: Readonly<{
    site: SiteInfoEntity
}>) {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isDescending, setIsDescending] = useState(true);
    const inputFocus = useRef<HTMLInputElement | null>(null);

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

    // 模拟课程数据
    const [courses] = useState([
        { id: 1, code: "CS101", name: "计算机导论", credit: 3, department: "计算机学院", teacher: "张教授", type: "必修" },
        { id: 2, code: "CS201", name: "数据结构", credit: 4, department: "计算机学院", teacher: "李教授", type: "必修" },
        { id: 3, code: "CS301", name: "算法设计与分析", credit: 3, department: "计算机学院", teacher: "王教授", type: "必修" },
        { id: 4, code: "CS401", name: "操作系统", credit: 4, department: "计算机学院", teacher: "刘教授", type: "必修" },
        { id: 5, code: "CS501", name: "数据库系统", credit: 3, department: "计算机学院", teacher: "陈教授", type: "必修" },
        { id: 6, code: "CS601", name: "计算机网络", credit: 3, department: "计算机学院", teacher: "张教授", type: "必修" },
        { id: 7, code: "CS701", name: "软件工程", credit: 4, department: "计算机学院", teacher: "吴教授", type: "必修" },
        { id: 8, code: "CS801", name: "人工智能", credit: 3, department: "计算机学院", teacher: "赵教授", type: "选修" }
    ]);

    useEffect(() => {
        document.title = `课程管理 | ${site.name ?? "Frontleaves Technology"}`;
    }, [site.name]);

    // 筛选课程
    const filteredCourses = courses.filter(
        course => course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 course.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 course.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 使用排序方向重新排序
    const sortedCourses = [...filteredCourses];
    if (isDescending) {
        sortedCourses.sort((a, b) => b.id - a.id); // 降序
    } else {
        sortedCourses.sort((a, b) => a.id - b.id); // 升序
    }

    // 分页逻辑
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedCourses.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);

    // 分页控制
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="space-y-6 w-full">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Book theme="outline" size="24" />
                    课程管理
                </h1>

                <div className="flex gap-2">
                    <div className="relative">
                        <input
                            ref={inputFocus}
                            type="text"
                            placeholder="搜索课程..."
                            className="input input-bordered pr-10"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1); // 重置页码
                            }}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <Search theme="outline" size="18" />
                            <kbd className="hidden sm:inline kbd kbd-sm ml-1">Ctrl</kbd>
                            <kbd className="hidden sm:inline kbd kbd-sm">K</kbd>
                        </div>
                    </div>

                    <button className="btn btn-primary flex items-center gap-1">
                        <AddOne theme="outline" size="18" />
                        <span className="hidden sm:inline">添加课程</span>
                        <span className="sm:hidden">添加</span>
                    </button>
                </div>
            </div>

            <div className="card bg-base-100 shadow-md overflow-hidden">
                <div className="card-body p-0">
                    <div className="overflow-x-auto overflow-hidden">
                        <table className="table table-zebra">
                            <thead className="bg-base-200">
                                <tr>
                                    <th>课程代码</th>
                                    <th>课程名称</th>
                                    <th>学分</th>
                                    <th>所属院系</th>
                                    <th>授课教师</th>
                                    <th>课程类型</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map(course => (
                                    <tr key={course.id}>
                                        <td>{course.code}</td>
                                        <td>{course.name}</td>
                                        <td>{course.credit}</td>
                                        <td>{course.department}</td>
                                        <td>{course.teacher}</td>
                                        <td>
                                            <div className={`badge ${course.type === '必修' ? 'badge-primary' : 'badge-secondary'}`}>
                                                {course.type}
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
                    </div>
                </div>
            </div>

            {/* 分页控制 - 移动到card外部 */}
            <div className="flex justify-center mt-4">
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
