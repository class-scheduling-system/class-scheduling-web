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

import React, { useEffect, useState } from "react";
import { Empty, Modal, Skeleton, Tag, message } from "antd";
import { CardComponent } from "../../components/card_component";
import { SiteInfoEntity } from "../../models/entity/site_info_entity";
import { Search, Book, Refresh, DownloadOne } from "@icon-park/react";
import { GetSemesterListAPI } from "../../apis/semester_api";
import { SemesterEntity } from "../../models/entity/semester_entity";

// 成绩信息类型
interface GradeInfo {
    id: string;
    courseName: string;
    courseId: string;
    credit: number;
    type: string;
    score: number;
    gpa: number;
    semester: string;
    teacher: string;
    examType: string;
    status: "passed" | "failed" | "retake" | "exempted";
}

/**
 * 学生成绩查询页面组件
 * 
 * @param site 站点信息
 * @returns 学生成绩查询页面
 */
export function StudentGrade({ site }: Readonly<{ site?: SiteInfoEntity }>): React.ReactElement {
    const [loading, setLoading] = useState<boolean>(true);
    const [semesters, setSemesters] = useState<SemesterEntity[]>([]);
    const [currentSemester, setCurrentSemester] = useState<string>("");
    const [grades, setGrades] = useState<GradeInfo[]>([]);
    const [searchKeyword, setSearchKeyword] = useState<string>("");
    const [activeTab, setActiveTab] = useState<string>("all");
    const [selectedGrade, setSelectedGrade] = useState<GradeInfo | null>(null);
    const [gradeDetailVisible, setGradeDetailVisible] = useState<boolean>(false);

    // 获取学期列表
    useEffect(() => {
        const fetchSemesters = async () => {
            try {
                const response = await GetSemesterListAPI();
                if (response?.output === "Success" && response.data) {
                    setSemesters(response.data);
                    if (response.data.length > 0) {
                        setCurrentSemester(response.data[0].semester_uuid);
                    }
                } else {
                    message.error(response?.error_message ?? "获取学期列表失败");
                }
            } catch (error) {
                console.error("获取学期列表失败", error);
                message.error("获取学期列表失败");
            }
        };

        fetchSemesters();
    }, []);

    // 加载成绩数据
    useEffect(() => {
        if (currentSemester) {
            setLoading(true);
            
            // 模拟加载成绩数据
            setTimeout(() => {
                // 模拟成绩数据
                const mockGrades: GradeInfo[] = [
                    {
                        id: "1",
                        courseName: "计算机导论",
                        courseId: "CS101",
                        credit: 3,
                        type: "必修",
                        score: 85,
                        gpa: 3.5,
                        semester: "2023-2024-1",
                        teacher: "张教授",
                        examType: "期末考试",
                        status: "passed"
                    },
                    {
                        id: "2",
                        courseName: "高等数学",
                        courseId: "MATH102",
                        credit: 4,
                        type: "必修",
                        score: 92,
                        gpa: 4.0,
                        semester: "2023-2024-1",
                        teacher: "李教授",
                        examType: "期末考试",
                        status: "passed"
                    },
                    {
                        id: "3",
                        courseName: "大学英语",
                        courseId: "ENG101",
                        credit: 3,
                        type: "必修",
                        score: 78,
                        gpa: 2.7,
                        semester: "2023-2024-1",
                        teacher: "王教授",
                        examType: "期末考试",
                        status: "passed"
                    },
                    {
                        id: "4",
                        courseName: "数据结构",
                        courseId: "CS201",
                        credit: 4,
                        type: "必修",
                        score: 55,
                        gpa: 0,
                        semester: "2023-2024-1",
                        teacher: "刘教授",
                        examType: "期末考试",
                        status: "failed"
                    },
                    {
                        id: "5",
                        courseName: "数据库原理",
                        courseId: "CS301",
                        credit: 3,
                        type: "必修",
                        score: 88,
                        gpa: 3.7,
                        semester: "2023-2024-1",
                        teacher: "赵教授",
                        examType: "期末考试",
                        status: "passed"
                    },
                    {
                        id: "6",
                        courseName: "操作系统",
                        courseId: "CS302",
                        credit: 4,
                        type: "必修",
                        score: 81,
                        gpa: 3.3,
                        semester: "2023-2024-1",
                        teacher: "孙教授",
                        examType: "期末考试",
                        status: "passed"
                    },
                    {
                        id: "7",
                        courseName: "体育",
                        courseId: "PE101",
                        credit: 1,
                        type: "必修",
                        score: 95,
                        gpa: 4.0,
                        semester: "2023-2024-1",
                        teacher: "钱教授",
                        examType: "考查",
                        status: "passed"
                    }
                ];
                
                setGrades(mockGrades);
                setLoading(false);
            }, 1000);
        }
    }, [currentSemester]);

    // 设置页面标题
    useEffect(() => {
        document.title = `成绩查询 | ${site?.name ?? "Frontleaves Technology"}`;
    }, [site?.name]);

    // 切换学期
    const handleSemesterChange = (semesterUuid: string) => {
        setCurrentSemester(semesterUuid);
    };

    // 刷新成绩
    const handleRefresh = () => {
        if (currentSemester) {
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
                message.success("成绩已刷新");
            }, 1000);
        }
    };

    // 导出成绩单
    const handleExport = () => {
        message.info("导出功能待实现");
    };

    // 查看成绩详情
    const viewGradeDetail = (grade: GradeInfo) => {
        setSelectedGrade(grade);
        setGradeDetailVisible(true);
    };

    // 计算成绩统计信息
    const calculateStats = () => {
        if (grades.length === 0) return { totalCredits: 0, averageGPA: 0, passRate: 0 };
        
        const totalCredits = grades.reduce((sum, grade) => sum + grade.credit, 0);
        const totalGPAPoints = grades.reduce((sum, grade) => sum + (grade.gpa * grade.credit), 0);
        const averageGPA = totalGPAPoints / totalCredits;
        const passedCount = grades.filter(grade => grade.status === "passed" || grade.status === "exempted").length;
        const passRate = (passedCount / grades.length) * 100;
        
        return {
            totalCredits,
            averageGPA: averageGPA.toFixed(2),
            passRate: passRate.toFixed(1)
        };
    };

    // 过滤成绩
    const filteredGrades = grades.filter(grade => {
        // 根据搜索关键词过滤
        const matchesKeyword = searchKeyword === "" || 
            grade.courseName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            grade.courseId.toLowerCase().includes(searchKeyword.toLowerCase());
        
        // 根据标签页过滤
        let matchesTab = true;
        if (activeTab === "passed") {
            matchesTab = grade.status === "passed" || grade.status === "exempted";
        } else if (activeTab === "failed") {
            matchesTab = grade.status === "failed" || grade.status === "retake";
        }
        
        return matchesKeyword && matchesTab;
    });

    // 获取成绩状态标签
    const getStatusTag = (status: "passed" | "failed" | "retake" | "exempted") => {
        switch (status) {
            case "passed":
                return <Tag color="success">通过</Tag>;
            case "failed":
                return <Tag color="error">不通过</Tag>;
            case "retake":
                return <Tag color="warning">重修</Tag>;
            case "exempted":
                return <Tag color="processing">免修</Tag>;
            default:
                return null;
        }
    };

    // 获取成绩状态文本颜色
    const getScoreTextColor = (status: "passed" | "failed" | "retake" | "exempted") => {
        switch (status) {
            case "passed":
            case "exempted":
                return "text-success";
            case "failed":
                return "text-error";
            case "retake":
                return "text-warning";
            default:
                return "";
        }
    };

    // 统计信息
    const stats = calculateStats();

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* 标题和操作区 */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-primary-content flex items-center gap-2">
                    <Book theme="outline" size="24" className="text-primary" />
                    <span>成绩查询</span>
                </h1>
                
                <div className="flex flex-wrap gap-2">
                    <select 
                        className="select select-bordered select-sm md:select-md"
                        value={currentSemester}
                        onChange={(e) => handleSemesterChange(e.target.value)}
                        disabled={loading || semesters.length === 0}
                    >
                        {semesters.length === 0 ? (
                            <option value="">暂无学期数据</option>
                        ) : (
                            semesters.map((semester) => (
                                <option key={semester.semester_uuid} value={semester.semester_uuid}>
                                    {semester.name}
                                </option>
                            ))
                        )}
                    </select>
                    
                    <button 
                        className="btn btn-sm md:btn-md btn-primary btn-outline flex items-center gap-1"
                        onClick={handleRefresh}
                        disabled={loading}
                    >
                        <Refresh theme="outline" size="16" />
                        <span className="hidden md:inline">刷新</span>
                    </button>
                    
                    <button 
                        className="btn btn-sm md:btn-md btn-secondary btn-outline flex items-center gap-1"
                        onClick={handleExport}
                        disabled={loading}
                    >
                        <DownloadOne theme="outline" size="16" />
                        <span className="hidden md:inline">导出</span>
                    </button>
                </div>
            </div>

            <CardComponent>
                {loading ? (
                    <div className="p-8">
                        <Skeleton active paragraph={{ rows: 10 }} />
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* 搜索和统计 */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="md:col-span-3 form-control">
                                <label className="input input-bordered flex items-center gap-2">
                                    <Search theme="outline" size="16" />
                                    <input 
                                        type="text" 
                                        className="grow" 
                                        placeholder="搜索课程名称或代码"
                                        value={searchKeyword}
                                        onChange={(e) => setSearchKeyword(e.target.value)}
                                    />
                                </label>
                            </div>
                            
                            <div className="flex md:justify-end">
                                <div className="join">
                                    <button 
                                        className={`join-item btn ${activeTab === 'all' ? 'btn-active' : ''}`}
                                        onClick={() => setActiveTab('all')}
                                    >
                                        全部
                                    </button>
                                    <button 
                                        className={`join-item btn ${activeTab === 'passed' ? 'btn-active' : ''}`}
                                        onClick={() => setActiveTab('passed')}
                                    >
                                        已通过
                                    </button>
                                    <button 
                                        className={`join-item btn ${activeTab === 'failed' ? 'btn-active' : ''}`}
                                        onClick={() => setActiveTab('failed')}
                                    >
                                        未通过
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        {/* 统计数据 */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="stat bg-base-200/50 rounded-lg p-4">
                                <div className="stat-title">总学分</div>
                                <div className="stat-value text-primary">{stats.totalCredits}</div>
                                <div className="stat-desc">当前学期所有课程</div>
                            </div>
                            <div className="stat bg-base-200/50 rounded-lg p-4">
                                <div className="stat-title">平均绩点</div>
                                <div className="stat-value text-secondary">{stats.averageGPA}</div>
                                <div className="stat-desc">GPA</div>
                            </div>
                            <div className="stat bg-base-200/50 rounded-lg p-4">
                                <div className="stat-title">通过率</div>
                                <div className="stat-value text-accent">{stats.passRate}%</div>
                                <div className="stat-desc">已通过/全部课程</div>
                            </div>
                        </div>
                        
                        {/* 成绩列表 */}
                        {filteredGrades.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="table table-zebra">
                                    <thead>
                                        <tr className="bg-base-200">
                                            <th>课程编号</th>
                                            <th>课程名称</th>
                                            <th>学分</th>
                                            <th>成绩</th>
                                            <th>绩点</th>
                                            <th>状态</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredGrades.map((grade) => (
                                            <tr key={grade.id} className="hover">
                                                <td className="font-mono">{grade.courseId}</td>
                                                <td>{grade.courseName}</td>
                                                <td>{grade.credit}</td>
                                                <td className={`font-bold ${getScoreTextColor(grade.status)}`}>
                                                    {grade.score}
                                                </td>
                                                <td>{grade.gpa.toFixed(1)}</td>
                                                <td>{getStatusTag(grade.status)}</td>
                                                <td>
                                                    <button 
                                                        className="btn btn-xs btn-ghost" 
                                                        onClick={() => viewGradeDetail(grade)}
                                                    >
                                                        详情
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16">
                                <Empty description="没有找到成绩记录" />
                            </div>
                        )}
                    </div>
                )}
            </CardComponent>
            
            {/* 成绩详情弹窗 */}
            <Modal
                title={
                    <div className="text-lg font-bold">
                        成绩详情
                    </div>
                }
                open={gradeDetailVisible}
                onCancel={() => setGradeDetailVisible(false)}
                footer={null}
                width={600}
            >
                {selectedGrade && (
                    <div className="space-y-6">
                        <div className="p-6 bg-base-200/50 rounded-lg">
                            <h2 className="text-xl font-bold mb-4">{selectedGrade.courseName}</h2>
                            <div className="flex items-end gap-3">
                                <span className={`text-4xl font-bold ${getScoreTextColor(selectedGrade.status)}`}>
                                    {selectedGrade.score}
                                </span>
                                <span className="text-base-content/70">
                                    {selectedGrade.status === 'passed' ? '通过' : 
                                     selectedGrade.status === 'failed' ? '不通过' : 
                                     selectedGrade.status === 'retake' ? '重修' : '免修'}
                                </span>
                            </div>
                        </div>
                        
                        <div className="divider"></div>
                        
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <div className="text-sm opacity-70">课程编号</div>
                                <div className="font-medium">{selectedGrade.courseId}</div>
                            </div>
                            <div>
                                <div className="text-sm opacity-70">课程类型</div>
                                <div className="font-medium">{selectedGrade.type}</div>
                            </div>
                            <div>
                                <div className="text-sm opacity-70">学分</div>
                                <div className="font-medium">{selectedGrade.credit}</div>
                            </div>
                            <div>
                                <div className="text-sm opacity-70">绩点</div>
                                <div className="font-medium">{selectedGrade.gpa.toFixed(1)}</div>
                            </div>
                            <div>
                                <div className="text-sm opacity-70">教师</div>
                                <div className="font-medium">{selectedGrade.teacher}</div>
                            </div>
                            <div>
                                <div className="text-sm opacity-70">考核方式</div>
                                <div className="font-medium">{selectedGrade.examType}</div>
                            </div>
                            <div>
                                <div className="text-sm opacity-70">学期</div>
                                <div className="font-medium">{selectedGrade.semester}</div>
                            </div>
                        </div>
                        
                        <div className="divider"></div>
                        
                        <div className="bg-base-200/30 p-4 rounded-lg">
                            <div className="text-sm opacity-70">备注</div>
                            <p className="text-sm">成绩信息最终以教务系统为准</p>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
} 