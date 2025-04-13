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

import { useEffect, useState } from "react";
import { Empty, message, Modal, Pagination, Skeleton } from "antd";

// 组件
import { LabelComponent } from "../../components/label_component";

// 图标
import { 
    Search, 
    PlayCycle, 
    PreviewOpen,
    CloseOne
} from "@icon-park/react";

// API
import { GetTeacherPreferencesPageAPI, GetTeacherPreferenceAPI } from "../../apis/teacher_preferences_api";
import { GetTeacherListAPI } from "../../apis/teacher_api";
import { GetSemesterListAPI } from "../../apis/semester_api";

// 模型
import { TeacherPreferenceEntity } from "../../models/entity/teacher_preference_entity";
import { PageEntity } from "../../models/entity/page_entity";
import { PageTeacherPreferenceDTO } from "../../models/dto/page/page_teacher_preference_dto";
import { SiteInfoEntity } from "../../models/entity/site_info_entity";
import { SemesterEntity } from "../../models/entity/semester_entity";
import { useSelector } from "react-redux";
import { AcademicAffairsStore } from "@/models/store/academic_affairs_store";
import { TeacherLiteEntity } from "@/models/entity/teacher_lite_entity";

/**
 * # 教师课程偏好管理组件
 * 
 * 教务端教师课程偏好管理页面，提供教师课程偏好的查询和查看功能
 * 
 * @param site 站点信息
 * @returns 教师课程偏好管理组件
 */
export function AcademicTeacherPreference({ site }: Readonly<{
    site: SiteInfoEntity
}>) {
    const academicAffairs = useSelector((state: { academicAffairs: AcademicAffairsStore }) => state.academicAffairs);

    // 基础状态
    const [loading, setLoading] = useState(true);
    const [refreshFlag, setRefreshFlag] = useState(0);
    
    // 搜索状态
    const [teacherSearch, setTeacherSearch] = useState<string>("");
    const [semesterSearch, setSemesterSearch] = useState<string>("");
    
    // 分页状态
    const [preferenceList, setPreferenceList] = useState<PageEntity<TeacherPreferenceEntity>>({
        records: [],
        total: 0,
        size: 20,
        current: 1
    } as PageEntity<TeacherPreferenceEntity>);
    
    // 搜索参数
    const [searchRequest, setSearchRequest] = useState<PageTeacherPreferenceDTO>({
        page: 1,
        size: 20,
        is_desc: true,
        teacher_uuid: "",
        semester_uuid: ""
    } as PageTeacherPreferenceDTO);
    
    // 选项数据
    const [teacherList, setTeacherList] = useState<TeacherLiteEntity[]>([]);
    const [semesterList, setSemesterList] = useState<SemesterEntity[]>([]);
    
    // 详情模态框状态
    const [detailsModalVisible, setDetailsModalVisible] = useState(false);
    const [currentPreference, setCurrentPreference] = useState<TeacherPreferenceEntity | null>(null);
    const [loadingDetails, setLoadingDetails] = useState(false);
    
    // 加载教师列表
    const loadTeacherList = async () => {
        try {
            // 不传入department_uuid参数，获取所有教师
            const response = await GetTeacherListAPI();
            if (response && response.code === 200) {
                setTeacherList(response.data || []);
            } else {
                message.error("加载教师列表失败");
            }
        } catch (error) {
            console.error("加载教师列表出错:", error);
            message.error("加载教师列表失败");
        }
    };
    
    // 加载学期列表
    const loadSemesterList = async () => {
        try {
            const response = await GetSemesterListAPI();
            if (response && response.code === 200) {
                setSemesterList(response.data || []);
                setSemesterSearch(response.data?.[0]?.semester_uuid || "");
            } else {
                message.error("加载学期列表失败");
            }
        } catch (error) {
            console.error("加载学期列表出错:", error);
            message.error("加载学期列表失败");
        }
    };
    
    // 加载偏好列表
    const loadPreferenceList = async () => {
        setLoading(true);
        try {
            const response = await GetTeacherPreferencesPageAPI(searchRequest);
            if (response && response.code === 200) {
                setPreferenceList(response.data || {
                    records: [],
                    total: 0,
                    size: 20,
                    current: 1
                });
            } else {
                message.error("加载教师偏好列表失败");
            }
        } catch (error) {
            console.error("加载教师偏好列表出错:", error);
            message.error("加载教师偏好列表失败");
        } finally {
            setLoading(false);
        }
    };
    
    // 搜索按钮点击事件
    const handleSearch = () => {
        setSearchRequest({
            ...searchRequest,
            teacher_uuid: teacherSearch,
            semester_uuid: semesterSearch,
            page: 1
        });
        setRefreshFlag(refreshFlag + 1);
    };
    
    // 重置搜索按钮点击事件
    const handleResetSearch = () => {
        setTeacherSearch("");
        setSemesterSearch("");
        setSearchRequest({
            ...searchRequest,
            teacher_uuid: "",
            semester_uuid: "",
            page: 1
        });
        setRefreshFlag(refreshFlag + 1);
    };
    
    // 分页变化事件
    const handlePageChange = (page: number, pageSize: number) => {
        setSearchRequest({
            ...searchRequest,
            page: page,
            size: pageSize
        });
        setRefreshFlag(refreshFlag + 1);
    };
    
    // 查看教师偏好详情
    const handleViewPreference = async (preferenceUuid: string) => {
        setLoadingDetails(true);
        setDetailsModalVisible(true);
        
        try {
            const response = await GetTeacherPreferenceAPI(preferenceUuid);
            if (response && response.code === 200 && response.data) {
                setCurrentPreference(response.data);
            } else {
                message.error("获取教师偏好详情失败");
                setDetailsModalVisible(false);
            }
        } catch (error) {
            console.error("获取教师偏好详情出错:", error);
            message.error("获取教师偏好详情失败");
            setDetailsModalVisible(false);
        } finally {
            setLoadingDetails(false);
        }
    };
    
    // 获取星期几的中文表示
    const getDayOfWeekText = (day: number): string => {
        const dayMap: Record<number, string> = {
            1: "周一",
            2: "周二",
            3: "周三",
            4: "周四",
            5: "周五",
            6: "周六",
            7: "周日"
        };
        return dayMap[day] || "未知";
    };
    
    // 获取偏好级别的标签样式和文字
    const getPreferenceLevelLabel = (level: number) => {
        const levelMap: Record<number, { type: "success" | "warning" | "error" | "primary" | "secondary", text: string }> = {
            1: { type: "error", text: "最不期望" },
            2: { type: "warning", text: "尽量避免" },
            3: { type: "secondary", text: "可接受" },
            4: { type: "primary", text: "较期望" },
            5: { type: "success", text: "非常期望" }
        };
        return levelMap[level] || { type: "secondary", text: "未知" };
    };
    
    // 初始化数据
    useEffect(() => {
        if (academicAffairs.currentAcademicAffairs?.department) {
            loadTeacherList();
            loadSemesterList();
        }
        
        // 设置页面标题
        document.title = `教师课程偏好查看 | ${site.name || "教务系统"}`;
    }, [site.name, academicAffairs.currentAcademicAffairs?.department]);
    
    // 刷新数据
    useEffect(() => {
        loadPreferenceList();
    }, [refreshFlag, searchRequest.page, searchRequest.size]);
    
    // 渲染详情模态框内容
    const renderDetailsContent = () => {
        if (loadingDetails) {
            return (
                <div className="flex justify-center items-center py-8">
                    <Skeleton active paragraph={{ rows: 6 }} />
                </div>
            );
        }
        
        if (!currentPreference) {
            return <div>未找到数据</div>;
        }
        
        const teacherName = teacherList.find(t => t.teacher_uuid === currentPreference.teacher_uuid)?.teacher_name || "未知教师";
        const semesterName = semesterList.find(s => s.semester_uuid === currentPreference.semester_uuid)?.name || "未知学期";
        const preferenceLevel = getPreferenceLevelLabel(currentPreference.preference_level);
        
        return (
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 space-y-2">
                        <h3 className="text-lg font-medium">基本信息</h3>
                        <div className="divider mt-0 mb-2"></div>
                    </div>
                    
                    <div className="space-y-1">
                        <div className="text-sm text-gray-500">教师</div>
                        <div>{teacherName}</div>
                    </div>
                    
                    <div className="space-y-1">
                        <div className="text-sm text-gray-500">学期</div>
                        <div>{semesterName}</div>
                    </div>
                    
                    <div className="space-y-1">
                        <div className="text-sm text-gray-500">星期</div>
                        <div>{getDayOfWeekText(currentPreference.day_of_week)}</div>
                    </div>
                    
                    <div className="space-y-1">
                        <div className="text-sm text-gray-500">节次</div>
                        <div>第 {currentPreference.time_slot} 节</div>
                    </div>
                    
                    <div className="space-y-1">
                        <div className="text-sm text-gray-500">偏好程度</div>
                        <div>
                            <LabelComponent
                                size={"badge-sm"}
                                style={"badge-outline"}
                                type={preferenceLevel.type}
                                text={preferenceLevel.text}
                            />
                        </div>
                    </div>
                    
                    <div className="col-span-2 space-y-1">
                        <div className="text-sm text-gray-500">原因说明</div>
                        <div className="p-3 bg-base-200 rounded-md min-h-16">
                            {currentPreference.reason || "无原因说明"}
                        </div>
                    </div>
                    
                    <div className="col-span-2 space-y-1">
                        <div className="text-sm text-gray-500">创建时间</div>
                        <div>{new Date(currentPreference.created_at).toLocaleString()}</div>
                    </div>
                    
                    <div className="col-span-2 space-y-1">
                        <div className="text-sm text-gray-500">更新时间</div>
                        <div>{new Date(currentPreference.updated_at).toLocaleString()}</div>
                    </div>
                </div>
            </div>
        );
    };
    
    return (
        <div className="container mx-auto p-4">
            <div className="flex flex-col space-y-4">
                {/* 顶部搜索栏 */}
                <div className="flex flex-row space-x-2 pb-2 border-b border-base-300">
                    <div className="flex-1">
                        <h1 className="text-2xl font-semibold">教师课程偏好查看</h1>
                        <p className="text-sm text-base-content/70">查看教师对课程时间的偏好设置</p>
                    </div>
                </div>
                
                {/* 搜索过滤区域 */}
                <div className="flex flex-col space-y-4 p-4 bg-base-200 rounded-lg">
                    <div className="flex flex-row space-x-4 items-center">
                        <div className="w-56">
                            <label className="select select-sm transition flex items-center w-full validator">
                                <select
                                    className="grow ps-1 flex-1"
                                    value={teacherSearch}
                                    onChange={(e) => setTeacherSearch(e.target.value)}
                                >
                                    <option value="">请选择教师</option>
                                    {teacherList.map((teacher) => (
                                        <option key={teacher.teacher_uuid} value={teacher.teacher_uuid}>
                                            {teacher.teacher_name}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>
                        <div className="w-56">
                            <label className="select select-sm transition flex items-center w-full validator">
                                <select
                                    className="grow ps-1 flex-1"
                                    value={semesterSearch}
                                    onChange={(e) => setSemesterSearch(e.target.value)}
                                >
                                    <option value="">请选择学期</option>
                                    {semesterList.map((semester) => (
                                        <option key={semester.semester_uuid} value={semester.semester_uuid}>
                                            {semester.name}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>
                        <div className="flex-grow"></div>
                        <div className="flex flex-row space-x-2">
                            <button 
                                className="btn btn-sm btn-primary" 
                                onClick={handleSearch}
                            >
                                <Search theme="outline" size="18" />
                                搜索
                            </button>
                            <button 
                                className="btn btn-sm btn-ghost" 
                                onClick={handleResetSearch}
                            >
                                <PlayCycle theme="outline" size="18" />
                                重置
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* 数据表格 */}
                <div className="overflow-x-auto">
                    <table className="table table-zebra">
                        <thead>
                            <tr>
                                <th>教师</th>
                                <th>学期</th>
                                <th>星期</th>
                                <th>第几节课</th>
                                <th>偏好级别</th>
                                <th>原因</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                // 加载骨架屏
                                Array(5).fill(0).map((_, index) => (
                                    <tr key={index}>
                                        <td><Skeleton paragraph={{ rows: 0 }} title={{ width: 100 }} active /></td>
                                        <td><Skeleton paragraph={{ rows: 0 }} title={{ width: 120 }} active /></td>
                                        <td><Skeleton paragraph={{ rows: 0 }} title={{ width: 60 }} active /></td>
                                        <td><Skeleton paragraph={{ rows: 0 }} title={{ width: 60 }} active /></td>
                                        <td><Skeleton paragraph={{ rows: 0 }} title={{ width: 80 }} active /></td>
                                        <td><Skeleton paragraph={{ rows: 0 }} title={{ width: 150 }} active /></td>
                                        <td><Skeleton paragraph={{ rows: 0 }} title={{ width: 100 }} active /></td>
                                    </tr>
                                ))
                            ) : preferenceList.records.length > 0 ? (
                                preferenceList.records.map((preference) => (
                                    <tr key={preference.preference_uuid} className="transition hover:bg-base-200">
                                        <td className="text-nowrap">
                                            {teacherList.find(t => t.teacher_uuid === preference.teacher_uuid)?.teacher_name || "未知教师"}
                                        </td>
                                        <td className="text-nowrap">
                                            {semesterList.find(s => s.semester_uuid === preference.semester_uuid)?.name || "未知学期"}
                                        </td>
                                        <td>{getDayOfWeekText(preference.day_of_week)}</td>
                                        <td>第 {preference.time_slot} 节</td>
                                        <td>
                                            <LabelComponent
                                                size={"badge-sm"}
                                                style={"badge-outline"}
                                                type={getPreferenceLevelLabel(preference.preference_level).type}
                                                text={getPreferenceLevelLabel(preference.preference_level).text}
                                            />
                                        </td>
                                        <td className="max-w-xs truncate">
                                            {preference.reason || "无原因说明"}
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-xs btn-ghost"
                                                onClick={() => handleViewPreference(preference.preference_uuid)}
                                            >
                                                <PreviewOpen theme="outline" size="16" />
                                                查看
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="text-center py-4">
                                        <Empty description="暂无数据" />
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* 分页器 */}
                {preferenceList.records.length > 0 && (
                    <div className="flex justify-center mt-4">
                        <Pagination
                            current={preferenceList.current}
                            pageSize={preferenceList.size}
                            total={preferenceList.total}
                            onChange={handlePageChange}
                            showSizeChanger
                            showQuickJumper
                            showTotal={(total) => `共 ${total} 条数据`}
                        />
                    </div>
                )}
                
                {/* 详情模态框 */}
                <Modal
                    title="教师课程偏好详情"
                    open={detailsModalVisible}
                    onCancel={() => setDetailsModalVisible(false)}
                    width={700}
                    footer={[
                        <button
                            key="close"
                            className="btn btn-sm btn-primary"
                            onClick={() => setDetailsModalVisible(false)}
                        >
                            <CloseOne theme="outline" size="16" />
                            关闭
                        </button>
                    ]}
                >
                    {renderDetailsContent()}
                </Modal>
            </div>
        </div>
    );
} 