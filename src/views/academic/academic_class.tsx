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
import {AddOne, Delete, EditTwo, PreviewOpen, School, Search} from "@icon-park/react";

export function AcademicClass({site}: Readonly<{
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

    // 模拟班级数据
    const [classes] = useState([
        { id: 1, name: "计算机科学与技术2101班", department: "计算机学院", studentCount: 42, headTeacher: "张明", createdAt: "2021-09-01" },
        { id: 2, name: "软件工程2102班", department: "计算机学院", studentCount: 45, headTeacher: "李华", createdAt: "2021-09-01" },
        { id: 3, name: "数据科学2101班", department: "计算机学院", studentCount: 38, headTeacher: "王强", createdAt: "2021-09-01" },
        { id: 4, name: "物联网工程2101班", department: "计算机学院", studentCount: 40, headTeacher: "刘伟", createdAt: "2021-09-01" },
        { id: 5, name: "电子信息工程2101班", department: "电子工程学院", studentCount: 44, headTeacher: "陈红", createdAt: "2021-09-01" },
        { id: 6, name: "通信工程2101班", department: "电子工程学院", studentCount: 43, headTeacher: "张波", createdAt: "2021-09-01" },
        { id: 7, name: "自动化2101班", department: "自动化学院", studentCount: 46, headTeacher: "赵刚", createdAt: "2021-09-01" },
        { id: 8, name: "机械工程2101班", department: "机械工程学院", studentCount: 41, headTeacher: "钱明", createdAt: "2021-09-01" }
    ]);

    useEffect(() => {
        document.title = `班级管理 | ${site.name ?? "Frontleaves Technology"}`;
    }, [site.name]);

    // 筛选班级
    const filteredClasses = classes.filter(
        cls => cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               cls.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
               cls.headTeacher.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 使用排序方向重新排序
    let sortedClasses = [...filteredClasses];
    if (isDescending) {
        sortedClasses.sort((a, b) => b.id - a.id); // 降序
    } else {
        sortedClasses.sort((a, b) => a.id - b.id); // 升序
    }

    // 分页逻辑
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedClasses.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredClasses.length / itemsPerPage);

    // 分页控制
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="space-y-6 w-full">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <School theme="outline" size="24" />
                    班级管理
                </h1>

                <div className="flex gap-2">
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                            <Search theme="outline" size="18" />
                        </div>
                        <input
                            ref={inputFocus}
                            type="text"
                            placeholder="搜索班级..."
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
                        <span className="hidden sm:inline">添加班级</span>
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
                                    <th>班级名称</th>
                                    <th>所属院系</th>
                                    <th>学生人数</th>
                                    <th>班主任</th>
                                    <th>创建时间</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map(cls => (
                                    <tr key={cls.id}>
                                        <td>{cls.name}</td>
                                        <td>{cls.department}</td>
                                        <td>{cls.studentCount}</td>
                                        <td>{cls.headTeacher}</td>
                                        <td>{cls.createdAt}</td>
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
