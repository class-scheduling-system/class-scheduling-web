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

import { useState } from "react";
import { message } from "antd";
import { CardComponent } from "../../card_component";

/**
 * # 课程表组件
 * 
 * 显示课程表的组件，支持按班级或教师筛选。
 * 
 * @param initialSemester 初始学期
 * @param initialViewType 初始查看方式
 * @param initialClasses 初始班级列表
 * @param initialTeacher 初始教师
 * @returns 课程表组件
 */
export function TimetableComponent({
    initialSemester = "2024-2025-2",
    initialViewType = "class",
    initialClasses = [],
    initialTeacher = "",
    onBack
}: {
    initialSemester?: string;
    initialViewType?: "class" | "teacher";
    initialClasses?: string[];
    initialTeacher?: string;
    onBack?: () => void;
}) {
    // 课程表视图状态
    const [timetableViewType, setTimetableViewType] = useState<"class" | "teacher">(initialViewType);
    const [selectedClasses, setSelectedClasses] = useState<string[]>(initialClasses);
    const [selectedTeacher, setSelectedTeacher] = useState<string>(initialTeacher);
    const [currentSemester, setCurrentSemester] = useState<string>(initialSemester);
    
    // 生成课程表
    const handleGenerateTimetable = () => {
        // 实际应用中应该根据选择的班级或教师获取课程表数据
        message.success(`已生成${timetableViewType === "class" ? "班级" : "教师"}课程表`);
    };
    
    // 导出课程表
    const handleExportTimetable = () => {
        message.info("导出课程表功能待实现");
    };
    
    // 打印课程表
    const handlePrintTimetable = () => {
        message.info("打印课程表功能待实现");
    };
    
    return (
        <div className="space-y-4">
            {/* 课程表筛选条件 */}
            <CardComponent>
                <div className="p-4">
                    <h3 className="text-lg font-medium mb-4">筛选条件</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="label">
                                <span className="label-text">学期</span>
                            </label>
                            <select 
                                className="select select-bordered w-full"
                                value={currentSemester}
                                onChange={(e) => setCurrentSemester(e.target.value)}
                            >
                                <option value="2024-2025-2">2024-2025学年第2学期</option>
                                <option value="2024-2025-1">2024-2025学年第1学期</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="label">
                                <span className="label-text">查看方式</span>
                            </label>
                            <select 
                                className="select select-bordered w-full"
                                value={timetableViewType}
                                onChange={(e) => {
                                    setTimetableViewType(e.target.value as "class" | "teacher");
                                    // 切换查看方式时重置选中的内容
                                    if (e.target.value === "class") {
                                        setSelectedTeacher("");
                                    } else {
                                        setSelectedClasses([]);
                                    }
                                }}
                            >
                                <option value="class">按班级</option>
                                <option value="teacher">按教师</option>
                            </select>
                        </div>
                        
                        {timetableViewType === "class" ? (
                            <div>
                                <label className="label">
                                    <span className="label-text">选择班级（可多选）</span>
                                </label>
                                <select 
                                    multiple 
                                    className="select select-bordered w-full h-24"
                                    value={selectedClasses}
                                    onChange={(e) => {
                                        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                                        setSelectedClasses(selectedOptions);
                                    }}
                                >
                                    <option value="计科2101">计科2101</option>
                                    <option value="计科2102">计科2102</option>
                                    <option value="软工2101">软工2101</option>
                                    <option value="软工2102">软工2102</option>
                                    <option value="网工2101">网工2101</option>
                                </select>
                            </div>
                        ) : (
                            <div>
                                <label className="label">
                                    <span className="label-text">选择教师</span>
                                </label>
                                <select 
                                    className="select select-bordered w-full"
                                    value={selectedTeacher}
                                    onChange={(e) => setSelectedTeacher(e.target.value)}
                                >
                                    <option value="">请选择教师</option>
                                    <option value="张教授">张教授</option>
                                    <option value="李教授">李教授</option>
                                    <option value="王教授">王教授</option>
                                    <option value="刘教授">刘教授</option>
                                    <option value="陈教授">陈教授</option>
                                </select>
                            </div>
                        )}
                    </div>
                    
                    <div className="mt-4">
                        <button 
                            className="btn btn-primary"
                            onClick={handleGenerateTimetable}
                            disabled={(timetableViewType === "class" && selectedClasses.length === 0) || 
                                     (timetableViewType === "teacher" && !selectedTeacher)}
                        >
                            生成课程表
                        </button>
                    </div>
                </div>
            </CardComponent>
            
            {/* 课程表 */}
            <CardComponent className="overflow-x-auto">
                <div className="p-4">
                    <h3 className="text-lg font-medium mb-4 text-center">
                        {timetableViewType === "class" 
                            ? (selectedClasses.length > 0 
                                ? `${selectedClasses.join("、")} 班级课表` 
                                : "班级课表")
                            : (selectedTeacher 
                                ? `${selectedTeacher} 教师课表` 
                                : "教师课表")
                        }
                    </h3>
                    
                    <table className="table table-bordered w-full border-collapse">
                        <thead>
                            <tr className="bg-base-200">
                                <th className="text-center">节次/星期</th>
                                <th className="text-center">周一</th>
                                <th className="text-center">周二</th>
                                <th className="text-center">周三</th>
                                <th className="text-center">周四</th>
                                <th className="text-center">周五</th>
                                <th className="text-center">周六</th>
                                <th className="text-center">周日</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* 第1-2节 */}
                            <tr>
                                <td className="text-center font-medium bg-base-200" rowSpan={2}>
                                    1-2<br/>节<br/>
                                    <span className="text-xs">08:00-09:30</span>
                                </td>
                                <td className="bg-primary/10 p-2" rowSpan={2}>
                                    <div className="text-center">
                                        <div className="font-medium">计算机导论</div>
                                        <div className="text-sm">张教授</div>
                                        <div className="text-xs">主教101</div>
                                        <div className="text-xs text-gray-500">计科2101</div>
                                    </div>
                                </td>
                                <td className="bg-primary/10 p-2" rowSpan={2}>
                                    <div className="text-center">
                                        <div className="font-medium">算法设计</div>
                                        <div className="text-sm">王教授</div>
                                        <div className="text-xs">主教103</div>
                                        <div className="text-xs text-gray-500">软工2102</div>
                                    </div>
                                </td>
                                <td className="p-2"></td>
                                <td className="p-2"></td>
                                <td className="p-2"></td>
                                <td className="p-2"></td>
                                <td className="p-2"></td>
                            </tr>
                            <tr>
                                <td className="p-2"></td>
                                <td className="p-2"></td>
                                <td className="p-2"></td>
                                <td className="p-2"></td>
                                <td className="p-2"></td>
                            </tr>
                            
                            {/* 第3-4节 */}
                            <tr>
                                <td className="text-center font-medium bg-base-200" rowSpan={2}>
                                    3-4<br/>节<br/>
                                    <span className="text-xs">10:00-11:30</span>
                                </td>
                                <td className="bg-primary/10 p-2" rowSpan={2}>
                                    <div className="text-center">
                                        <div className="font-medium">数据结构</div>
                                        <div className="text-sm">李教授</div>
                                        <div className="text-xs">主教102</div>
                                        <div className="text-xs text-gray-500">计科2101</div>
                                    </div>
                                </td>
                                <td className="bg-primary/10 p-2" rowSpan={2}>
                                    <div className="text-center">
                                        <div className="font-medium">操作系统</div>
                                        <div className="text-sm">刘教授</div>
                                        <div className="text-xs">主教201</div>
                                        <div className="text-xs text-gray-500">软工2102</div>
                                    </div>
                                </td>
                                <td className="p-2"></td>
                                <td className="p-2"></td>
                                <td className="p-2"></td>
                                <td className="p-2"></td>
                                <td className="p-2"></td>
                            </tr>
                            <tr>
                                <td className="p-2"></td>
                                <td className="p-2"></td>
                                <td className="p-2"></td>
                                <td className="p-2"></td>
                                <td className="p-2"></td>
                            </tr>
                            
                            {/* 第5-6节 */}
                            <tr>
                                <td className="text-center font-medium bg-base-200" rowSpan={2}>
                                    5-6<br/>节<br/>
                                    <span className="text-xs">14:00-15:30</span>
                                </td>
                                <td className="p-2"></td>
                                <td className="p-2"></td>
                                <td className="bg-primary/10 p-2" rowSpan={2}>
                                    <div className="text-center">
                                        <div className="font-medium">数据库系统</div>
                                        <div className="text-sm">陈教授</div>
                                        <div className="text-xs">主教202</div>
                                        <div className="text-xs text-gray-500">计科2101</div>
                                    </div>
                                </td>
                                <td className="bg-primary/10 p-2" rowSpan={2}>
                                    <div className="text-center">
                                        <div className="font-medium">软件工程</div>
                                        <div className="text-sm">吴教授</div>
                                        <div className="text-xs">主教301</div>
                                        <div className="text-xs text-gray-500">计科2101</div>
                                    </div>
                                </td>
                                <td className="p-2"></td>
                                <td className="p-2"></td>
                                <td className="p-2"></td>
                            </tr>
                            <tr>
                                <td className="p-2"></td>
                                <td className="p-2"></td>
                                <td className="p-2"></td>
                                <td className="p-2"></td>
                                <td className="p-2"></td>
                            </tr>
                            
                            {/* 第7-8节 */}
                            <tr>
                                <td className="text-center font-medium bg-base-200" rowSpan={2}>
                                    7-8<br/>节<br/>
                                    <span className="text-xs">16:00-17:30</span>
                                </td>
                                <td className="p-2"></td>
                                <td className="p-2"></td>
                                <td className="bg-primary/10 p-2" rowSpan={2}>
                                    <div className="text-center">
                                        <div className="font-medium">计算机网络</div>
                                        <div className="text-sm">张教授</div>
                                        <div className="text-xs">主教203</div>
                                        <div className="text-xs text-gray-500">软工2102</div>
                                    </div>
                                </td>
                                <td className="bg-primary/10 p-2" rowSpan={2}>
                                    <div className="text-center">
                                        <div className="font-medium">人工智能</div>
                                        <div className="text-sm">赵教授</div>
                                        <div className="text-xs">主教302</div>
                                        <div className="text-xs text-gray-500">软工2102</div>
                                    </div>
                                </td>
                                <td className="p-2"></td>
                                <td className="p-2"></td>
                                <td className="p-2"></td>
                            </tr>
                            <tr>
                                <td className="p-2"></td>
                                <td className="p-2"></td>
                                <td className="p-2"></td>
                                <td className="p-2"></td>
                                <td className="p-2"></td>
                            </tr>
                        </tbody>
                    </table>
                    
                    <div className="text-right mt-4">
                        <button 
                            className="btn btn-sm btn-outline mr-2"
                            onClick={handleExportTimetable}
                        >
                            导出Excel
                        </button>
                        <button 
                            className="btn btn-sm btn-outline"
                            onClick={handlePrintTimetable}
                        >
                            打印课表
                        </button>
                    </div>
                </div>
            </CardComponent>
        </div>
    );
} 