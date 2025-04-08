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

import { JSX, useEffect, useState } from "react";
import { SiteInfoEntity } from "../../models/entity/site_info_entity";
import { useSelector } from "react-redux";
import { Skeleton, message, Tabs, Badge, Modal } from "antd";
import { ExternalTransmission, Refresh, Download, AlarmClock } from "@icon-park/react";
import { CardComponent } from "../../components/card_component";
import { SemesterEntity } from "../../models/entity/semester_entity";
import { GetSemesterListAPI } from "../../apis/semester_api";

// 考试信息类型
interface ExamInfo {
    id: string;
    courseName: string;
    courseId: string;
    examType: string;
    examDate: string;
    startTime: string;
    endTime: string;
    location: string;
    seat?: string;
    notes?: string;
    status: "upcoming" | "completed" | "ongoing";
}

/**
 * 学生考试安排页面组件
 * 
 * @param site 站点信息
 * @returns 学生考试安排页面
 */
export function StudentExam({ site }: Readonly<{ site?: SiteInfoEntity }>): JSX.Element {
    const [loading, setLoading] = useState<boolean>(true);
    const [semesters, setSemesters] = useState<SemesterEntity[]>([]);
    const [currentSemester, setCurrentSemester] = useState<string>("");
    const [activeTab, setActiveTab] = useState<string>("upcoming");
    const [exams, setExams] = useState<ExamInfo[]>([]);
    const [examDetailVisible, setExamDetailVisible] = useState<boolean>(false);
    const [selectedExam, setSelectedExam] = useState<ExamInfo | null>(null);

    // 获取学期列表
    useEffect(() => {
        const fetchSemesters = async () => {
            try {
                const response = await GetSemesterListAPI();
                if (response?.output === "Success" && response.data) {
                    setSemesters(response.data);
                    // 默认选择第一个学期
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

    // 加载考试数据
    useEffect(() => {
        if (currentSemester) {
            setLoading(true);
            
            // 模拟加载考试数据
            setTimeout(() => {
                // 获取当前日期
                const now = new Date();
                const today = now.toISOString().split('T')[0];
                const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
                
                // 模拟考试数据
                const mockExams: ExamInfo[] = [
                    {
                        id: "1",
                        courseName: "计算机导论",
                        courseId: "CS101",
                        examType: "期末考试",
                        examDate: "2024-07-15",
                        startTime: "09:00",
                        endTime: "11:00",
                        location: "教学楼A-301",
                        seat: "A区-12号",
                        status: "upcoming"
                    },
                    {
                        id: "2",
                        courseName: "高等数学",
                        courseId: "MATH102",
                        examType: "期末考试",
                        examDate: "2024-07-10",
                        startTime: "14:00",
                        endTime: "16:00",
                        location: "教学楼B-201",
                        seat: "C区-05号",
                        status: "upcoming"
                    },
                    {
                        id: "3",
                        courseName: "数据结构与算法",
                        courseId: "CS201",
                        examType: "期中考试",
                        examDate: "2024-05-20",
                        startTime: "14:00",
                        endTime: "16:00",
                        location: "教学楼A-401",
                        seat: "B区-18号",
                        status: "completed"
                    },
                    {
                        id: "4",
                        courseName: "大学英语",
                        courseId: "ENG101",
                        examType: "期中考试",
                        examDate: "2024-05-15",
                        startTime: "09:00",
                        endTime: "11:00",
                        location: "外语楼-101",
                        seat: "A区-25号",
                        status: "completed"
                    },
                    {
                        id: "5",
                        courseName: "大学物理",
                        courseId: "PHY101",
                        examType: "期末考试",
                        examDate: today,
                        startTime: "08:00",
                        endTime: "10:00",
                        location: "物理楼-201",
                        seat: "D区-30号",
                        notes: "请携带计算器，不允许使用手机",
                        status: currentTime >= "08:00" && currentTime <= "10:00" ? "ongoing" : (currentTime > "10:00" ? "completed" : "upcoming")
                    }
                ];
                
                // 更新考试状态
                const updatedExams = mockExams.map(exam => {
                    const examDateTime = new Date(`${exam.examDate}T${exam.endTime}`);
                    
                    if (exam.status !== "ongoing") {
                        if (examDateTime < now) {
                            return { ...exam, status: "completed" };
                        } else {
                            const examStartDateTime = new Date(`${exam.examDate}T${exam.startTime}`);
                            if (examStartDateTime <= now && now <= examDateTime) {
                                return { ...exam, status: "ongoing" };
                            } else {
                                return { ...exam, status: "upcoming" };
                            }
                        }
                    }
                    
                    return exam;
                });
                
                setExams(updatedExams);
                setLoading(false);
            }, 1000);
        }
    }, [currentSemester]);

    // 设置页面标题
    useEffect(() => {
        document.title = `考试安排 | ${site?.name ?? "Frontleaves Technology"}`;
    }, [site?.name]);

    // 切换学期
    const handleSemesterChange = (semesterUuid: string) => {
        setCurrentSemester(semesterUuid);
    };

    // 刷新考试列表
    const handleRefresh = () => {
        if (currentSemester) {
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
                message.success("考试列表已刷新");
            }, 1000);
        }
    };

    // 导出考试安排
    const handleExport = () => {
        message.info("导出功能待实现");
    };

    // 查看考试详情
    const handleViewExamDetail = (exam: ExamInfo) => {
        setSelectedExam(exam);
        setExamDetailVisible(true);
    };

    // 根据考试状态获取相应的标签颜色和文本
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "upcoming":
                return <Badge status="warning" text="待考" />;
            case "ongoing":
                return <Badge status="processing" text="进行中" />;
            case "completed":
                return <Badge status="default" text="已结束" />;
            default:
                return <Badge status="default" text="未知" />;
        }
    };

    // 按状态筛选考试
    const getFilteredExams = (status: string) => {
        return exams.filter(exam => {
            if (status === "all") return true;
            return exam.status === status;
        });
    };

    // 获取倒计时
    const getCountdown = (examDate: string, startTime: string) => {
        const now = new Date();
        const examDateTime = new Date(`${examDate}T${startTime}`);
        const diffTime = examDateTime.getTime() - now.getTime();
        
        if (diffTime <= 0) return "已开始";
        
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
        
        if (diffDays > 0) {
            return `${diffDays}天${diffHours}小时后`;
        } else if (diffHours > 0) {
            return `${diffHours}小时${diffMinutes}分钟后`;
        } else {
            return `${diffMinutes}分钟后`;
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* 标题和操作区 */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-primary-content flex items-center gap-2">
                    <ExternalTransmission theme="outline" size="24" className="text-primary" />
                    <span>考试安排</span>
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
                                    {semester.name} 考试
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
                        className="btn btn-sm md:btn-md btn-primary btn-outline flex items-center gap-1"
                        onClick={handleExport}
                        disabled={loading}
                    >
                        <Download theme="outline" size="16" />
                        <span className="hidden md:inline">导出</span>
                    </button>
                </div>
            </div>

            {/* 考试状态概览 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <CardComponent className="bg-warning/10 border-warning/20">
                    <div className="p-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-bold">待考试</h2>
                            <span className="text-2xl font-bold text-warning">
                                {loading ? <span className="loading loading-spinner loading-sm"></span> : exams.filter(e => e.status === "upcoming").length}
                            </span>
                        </div>
                        <p className="text-sm text-base-content/70 mt-2">
                            即将到来的考试，请提前准备
                        </p>
                    </div>
                </CardComponent>
                
                <CardComponent className="bg-info/10 border-info/20">
                    <div className="p-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-bold">进行中</h2>
                            <span className="text-2xl font-bold text-info">
                                {loading ? <span className="loading loading-spinner loading-sm"></span> : exams.filter(e => e.status === "ongoing").length}
                            </span>
                        </div>
                        <p className="text-sm text-base-content/70 mt-2">
                            正在进行的考试，祝你考试顺利
                        </p>
                    </div>
                </CardComponent>
                
                <CardComponent className="bg-base-200">
                    <div className="p-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-bold">已结束</h2>
                            <span className="text-2xl font-bold text-base-content/70">
                                {loading ? <span className="loading loading-spinner loading-sm"></span> : exams.filter(e => e.status === "completed").length}
                            </span>
                        </div>
                        <p className="text-sm text-base-content/70 mt-2">
                            已完成的考试，成绩将择日公布
                        </p>
                    </div>
                </CardComponent>
            </div>

            {/* 考试列表 */}
            <CardComponent>
                {loading ? (
                    <div className="p-8">
                        <Skeleton active paragraph={{ rows: 10 }} />
                    </div>
                ) : (
                    <div>
                        <Tabs
                            defaultActiveKey="upcoming"
                            activeKey={activeTab}
                            onChange={setActiveTab}
                            items={[
                                {
                                    key: 'upcoming',
                                    label: '待考试',
                                    children: (
                                        <ExamList 
                                            exams={getFilteredExams('upcoming')} 
                                            onViewDetail={handleViewExamDetail} 
                                            getCountdown={getCountdown}
                                            getStatusBadge={getStatusBadge}
                                        />
                                    ),
                                },
                                {
                                    key: 'ongoing',
                                    label: '进行中',
                                    children: (
                                        <ExamList 
                                            exams={getFilteredExams('ongoing')} 
                                            onViewDetail={handleViewExamDetail}
                                            getCountdown={getCountdown}
                                            getStatusBadge={getStatusBadge}
                                        />
                                    ),
                                },
                                {
                                    key: 'completed',
                                    label: '已结束',
                                    children: (
                                        <ExamList 
                                            exams={getFilteredExams('completed')} 
                                            onViewDetail={handleViewExamDetail}
                                            getCountdown={getCountdown}
                                            getStatusBadge={getStatusBadge}
                                        />
                                    ),
                                },
                                {
                                    key: 'all',
                                    label: '全部',
                                    children: (
                                        <ExamList 
                                            exams={getFilteredExams('all')} 
                                            onViewDetail={handleViewExamDetail}
                                            getCountdown={getCountdown}
                                            getStatusBadge={getStatusBadge}
                                        />
                                    ),
                                },
                            ]}
                        />
                    </div>
                )}
            </CardComponent>

            {/* 考试须知 */}
            <div className="mt-6">
                <CardComponent>
                    <div className="p-4">
                        <h2 className="text-lg font-bold mb-2">考试须知</h2>
                        <ul className="list-disc list-inside text-sm text-base-content/80 space-y-1">
                            <li>请考生至少提前15分钟到达考场，进入考场后请保持安静</li>
                            <li>考试需携带学生证、身份证等有效证件，遗失证件请提前办理临时证明</li>
                            <li>严禁携带手机、智能手表等通讯设备进入考场，如有违反按作弊处理</li>
                            <li>部分考试可能有变动，请以老师通知或教务系统最新安排为准</li>
                            <li>缺考未经批准将记为"0"分，请遵守考试纪律，诚信应考</li>
                        </ul>
                    </div>
                </CardComponent>
            </div>

            {/* 考试详情模态框 */}
            <Modal
                title="考试详情"
                open={examDetailVisible}
                onCancel={() => setExamDetailVisible(false)}
                footer={null}
                width={600}
            >
                {selectedExam && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-start">
                            <h3 className="text-xl font-bold">{selectedExam.courseName}</h3>
                            {getStatusBadge(selectedExam.status)}
                        </div>
                        
                        <p className="text-base-content/70">课程代码: {selectedExam.courseId}</p>
                        
                        <div className="divider my-2"></div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h4 className="font-semibold flex items-center gap-2">
                                    <AlarmClock theme="outline" size="18" />
                                    考试时间
                                </h4>
                                <ul className="space-y-1 mt-2">
                                    <li><span className="font-medium">考试类型:</span> {selectedExam.examType}</li>
                                    <li><span className="font-medium">考试日期:</span> {selectedExam.examDate}</li>
                                    <li><span className="font-medium">开始时间:</span> {selectedExam.startTime}</li>
                                    <li><span className="font-medium">结束时间:</span> {selectedExam.endTime}</li>
                                    {selectedExam.status === "upcoming" && (
                                        <li>
                                            <span className="font-medium">倒计时:</span> 
                                            <span className="text-warning font-medium">
                                                {getCountdown(selectedExam.examDate, selectedExam.startTime)}
                                            </span>
                                        </li>
                                    )}
                                </ul>
                            </div>
                            
                            <div>
                                <h4 className="font-semibold">考试地点</h4>
                                <ul className="space-y-1 mt-2">
                                    <li><span className="font-medium">考场:</span> {selectedExam.location}</li>
                                    {selectedExam.seat && (
                                        <li><span className="font-medium">座位号:</span> {selectedExam.seat}</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                        
                        {selectedExam.notes && (
                            <div className="mt-4 p-3 bg-warning/10 rounded-lg">
                                <h4 className="font-semibold">特别说明</h4>
                                <p className="mt-1 text-base-content/80">{selectedExam.notes}</p>
                            </div>
                        )}
                        
                        <div className="flex justify-end pt-4">
                            <button 
                                className="btn btn-primary"
                                onClick={() => setExamDetailVisible(false)}
                            >
                                关闭
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}

/**
 * 考试列表组件
 */
function ExamList({ 
    exams, 
    onViewDetail,
    getCountdown,
    getStatusBadge
}: { 
    exams: ExamInfo[], 
    onViewDetail: (exam: ExamInfo) => void,
    getCountdown: (date: string, time: string) => string,
    getStatusBadge: (status: string) => JSX.Element
}): JSX.Element {
    if (exams.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <p className="text-base-content/60 mb-4">暂无考试数据</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
                <thead>
                    <tr>
                        <th>考试名称</th>
                        <th>类型</th>
                        <th>时间</th>
                        <th>地点</th>
                        <th>状态</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    {exams.map((exam) => (
                        <tr key={exam.id} className={exam.status === "ongoing" ? "bg-info/10" : ""}>
                            <td>
                                <div>
                                    <div className="font-medium">{exam.courseName}</div>
                                    <div className="text-sm opacity-70">{exam.courseId}</div>
                                </div>
                            </td>
                            <td>{exam.examType}</td>
                            <td>
                                <div>
                                    <div>{exam.examDate}</div>
                                    <div className="text-sm opacity-70">{exam.startTime} - {exam.endTime}</div>
                                    {exam.status === "upcoming" && (
                                        <div className="text-xs text-warning">
                                            {getCountdown(exam.examDate, exam.startTime)}
                                        </div>
                                    )}
                                </div>
                            </td>
                            <td>{exam.location}</td>
                            <td>{getStatusBadge(exam.status)}</td>
                            <td>
                                <button 
                                    className="btn btn-ghost btn-xs"
                                    onClick={() => onViewDetail(exam)}
                                >
                                    查看详情
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
} 