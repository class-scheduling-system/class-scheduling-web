import { useEffect, useState } from "react";
import { Empty, message, Modal, Pagination, Skeleton } from "antd";
import { useSelector } from "react-redux";

// 组件
import { LabelComponent } from "../../components/label_component";

// 图标
import { 
    Plus, 
    PlayCycle, 
    PreviewOpen,
    CloseOne,
    Delete,
    Edit
} from "@icon-park/react";

// API
import { 
    GetMyTeacherPreferencesPageAPI, 
    GetTeacherPreferenceAPI,
    CreateTeacherPreferenceAPI,
    UpdateTeacherPreferenceAPI,
    DeleteTeacherPreferenceAPI
} from "../../apis/teacher_preferences_api";
import { GetSemesterListAPI } from "../../apis/semester_api";

// 模型
import { TeacherPreferenceEntity } from "../../models/entity/teacher_preference_entity";
import { PageEntity } from "../../models/entity/page_entity";
import { PageTeacherPreferenceDTO } from "../../models/dto/page/page_teacher_preference_dto";
import { SemesterEntity } from "../../models/entity/semester_entity";
import { SiteInfoEntity } from "../../models/entity/site_info_entity";
import { TeacherPreferenceDTO } from "../../models/dto/teacher_preference_dto";
import { UserInfoEntity } from "../../models/entity/user_info_entity";

/**
 * # 教师偏好组件
 * 
 * 教师端教师课程偏好管理页面，提供教师课程偏好的查询、新增、编辑和删除功能
 * 
 * @returns 教师课程偏好管理组件
 */
export default function TeacherPreference() {
    const site = useSelector((state: { site: SiteInfoEntity }) => state.site);
    const user = useSelector((state: { user: UserInfoEntity }) => state.user);

    // 基础状态
    const [loading, setLoading] = useState(true);
    const [refreshFlag, setRefreshFlag] = useState(0);
    
    // 搜索状态
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
        semester_uuid: ""
    } as PageTeacherPreferenceDTO);
    
    // 选项数据
    const [semesterList, setSemesterList] = useState<SemesterEntity[]>([]);
    
    // 表单数据
    const [formData, setFormData] = useState<TeacherPreferenceDTO>({
        teacher_uuid: user?.teacher?.teacher_uuid || "",
        semester_uuid: "",
        day_of_week: 1,
        time_slot: 1,
        preference_level: 3,
        reason: ""
    });
    
    // 详情模态框状态
    const [detailsModalVisible, setDetailsModalVisible] = useState(false);
    const [currentPreference, setCurrentPreference] = useState<TeacherPreferenceEntity | null>(null);
    const [loadingDetails, setLoadingDetails] = useState(false);
    
    // 编辑模态框状态
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingPreferenceUuid, setEditingPreferenceUuid] = useState<string>("");
    const [submitting, setSubmitting] = useState(false);
    
    // 加载学期列表
    const loadSemesterList = async () => {
        try {
            const response = await GetSemesterListAPI();
            if (response && response.code === 200) {
                const semesterData = response.data || [];
                setSemesterList(semesterData);
                
                // 找到当前启用的学期，默认选择它
                const enabledSemester = semesterData.find(s => s.is_enabled);
                if (enabledSemester) {
                    setSemesterSearch(enabledSemester.semester_uuid);
                    setSearchRequest(prev => ({...prev, semester_uuid: enabledSemester.semester_uuid}));
                    setFormData(prev => ({...prev, semester_uuid: enabledSemester.semester_uuid}));
                } else if (semesterData.length > 0) {
                    setSemesterSearch(semesterData[0].semester_uuid);
                    setSearchRequest(prev => ({...prev, semester_uuid: semesterData[0].semester_uuid}));
                    setFormData(prev => ({...prev, semester_uuid: semesterData[0].semester_uuid}));
                }
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
            const response = await GetMyTeacherPreferencesPageAPI(searchRequest);
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
            semester_uuid: semesterSearch,
            page: 1
        });
        setRefreshFlag(refreshFlag + 1);
    };
    
    // 重置搜索按钮点击事件
    const handleResetSearch = () => {
        setSemesterSearch("");
        setSearchRequest({
            ...searchRequest,
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
    
    // 打开新增教师偏好模态框
    const handleAddPreference = () => {
        setFormData({
            teacher_uuid: user?.teacher?.teacher_uuid || "",
            semester_uuid: semesterSearch || semesterList[0]?.semester_uuid || "",
            day_of_week: 1,
            time_slot: 1,
            preference_level: 3,
            reason: ""
        });
        setIsEditing(false);
        setEditingPreferenceUuid("");
        setEditModalVisible(true);
    };
    
    // 打开编辑教师偏好模态框
    const handleEditPreference = async (preferenceUuid: string) => {
        setLoadingDetails(true);
        setIsEditing(true);
        setEditingPreferenceUuid(preferenceUuid);
        
        try {
            const response = await GetTeacherPreferenceAPI(preferenceUuid);
            if (response && response.code === 200 && response.data) {
                const preference = response.data;
                setFormData({
                    teacher_uuid: user?.teacher?.teacher_uuid || "",
                    semester_uuid: preference.semester_uuid,
                    day_of_week: preference.day_of_week,
                    time_slot: preference.time_slot,
                    preference_level: preference.preference_level,
                    reason: preference.reason || ""
                });
                setEditModalVisible(true);
            } else {
                message.error("获取教师偏好详情失败");
            }
        } catch (error) {
            console.error("获取教师偏好详情出错:", error);
            message.error("获取教师偏好详情失败");
        } finally {
            setLoadingDetails(false);
        }
    };
    
    // 删除教师偏好
    const handleDeletePreference = async (preferenceUuid: string) => {
        Modal.confirm({
            title: "确认删除",
            content: "确定要删除这条教师偏好记录吗？此操作不可恢复。",
            okText: "确认",
            cancelText: "取消",
            okButtonProps: { danger: true },
            onOk: async () => {
                try {
                    const response = await DeleteTeacherPreferenceAPI(preferenceUuid);
                    if (response && response.code === 200) {
                        message.success("删除成功");
                        setRefreshFlag(refreshFlag + 1);
                    } else {
                        message.error(response?.message || "删除失败");
                    }
                } catch (error) {
                    console.error("删除教师偏好出错:", error);
                    message.error("删除失败");
                }
            }
        });
    };
    
    // 提交教师偏好表单
    const handleSubmitPreference = async () => {
        // 表单验证
        if (!formData.semester_uuid) {
            message.error("请选择学期");
            return;
        }
        
        // 确保教师UUID存在
        if (!formData.teacher_uuid) {
            message.error("未获取到教师信息");
            return;
        }
        
        setSubmitting(true);
        
        try {
            let response;
            if (isEditing) {
                response = await UpdateTeacherPreferenceAPI(editingPreferenceUuid, formData);
            } else {
                response = await CreateTeacherPreferenceAPI(formData);
            }
            
            if (response && response.code === 200) {
                message.success(isEditing ? "更新成功" : "添加成功");
                setEditModalVisible(false);
                setRefreshFlag(refreshFlag + 1);
            } else {
                message.error(response?.message || (isEditing ? "更新失败" : "添加失败"));
            }
        } catch (error) {
            console.error(isEditing ? "更新教师偏好出错:" : "添加教师偏好出错:", error);
            message.error(isEditing ? "更新失败" : "添加失败");
        } finally {
            setSubmitting(false);
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
        loadSemesterList();
        
        // 设置页面标题
        document.title = `教师课程偏好设置 | ${site.name || "教师系统"}`;
    }, [site.name]);
    
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
    
    // 渲染表单模态框内容
    const renderFormContent = () => {
        return (
            <div className="space-y-4">
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">学期 <span className="text-error">*</span></span>
                    </label>
                    <select 
                        className="select select-bordered w-full" 
                        value={formData.semester_uuid}
                        onChange={(e) => setFormData({...formData, semester_uuid: e.target.value})}
                    >
                        <option value="">请选择学期</option>
                        {semesterList.map((semester) => (
                            <option key={semester.semester_uuid} value={semester.semester_uuid}>
                                {semester.name}{semester.is_enabled ? " (当前学期)" : ""}
                            </option>
                        ))}
                    </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">星期 <span className="text-error">*</span></span>
                        </label>
                        <select 
                            className="select select-bordered w-full" 
                            value={formData.day_of_week}
                            onChange={(e) => setFormData({...formData, day_of_week: parseInt(e.target.value)})}
                        >
                            <option value="1">周一</option>
                            <option value="2">周二</option>
                            <option value="3">周三</option>
                            <option value="4">周四</option>
                            <option value="5">周五</option>
                            <option value="6">周六</option>
                            <option value="7">周日</option>
                        </select>
                    </div>
                    
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">节次 <span className="text-error">*</span></span>
                        </label>
                        <select 
                            className="select select-bordered w-full" 
                            value={formData.time_slot}
                            onChange={(e) => setFormData({...formData, time_slot: parseInt(e.target.value)})}
                        >
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(num => (
                                <option key={num} value={num}>第{num}节</option>
                            ))}
                        </select>
                    </div>
                </div>
                
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">偏好程度 <span className="text-error">*</span></span>
                    </label>
                    <div className="flex flex-col space-y-2">
                        {[5, 4, 3, 2, 1].map(level => {
                            const preference = getPreferenceLevelLabel(level);
                            return (
                                <label key={level} className="flex items-center space-x-2 cursor-pointer">
                                    <input 
                                        type="radio" 
                                        className="radio radio-sm" 
                                        name="preference_level" 
                                        checked={formData.preference_level === level}
                                        onChange={() => setFormData({...formData, preference_level: level})}
                                    />
                                    <LabelComponent
                                        size={"badge-sm"}
                                        style={"badge-outline"}
                                        type={preference.type}
                                        text={preference.text}
                                    />
                                </label>
                            );
                        })}
                    </div>
                </div>
                
                <div className="form-control flex flex-col">
                    <label className="label">
                        <span className="label-text">原因说明</span>
                    </label>
                    <textarea 
                        className="textarea textarea-bordered w-full h-24" 
                        placeholder="请输入设置此偏好的原因（选填）" 
                        value={formData.reason || ""}
                        onChange={(e) => setFormData({...formData, reason: e.target.value})}
                    ></textarea>
                </div>
            </div>
        );
    };
    
    return (
        <div className="container mx-auto p-4">
            <div className="flex flex-col space-y-4">
                {/* 顶部搜索栏 */}
                <div className="flex flex-row justify-between items-center pb-2 border-b border-base-300">
                    <div>
                        <h1 className="text-2xl font-semibold">教师课程偏好设置</h1>
                        <p className="text-sm text-base-content/70">设置您对课程时间的偏好，帮助排课系统更好地安排您的课表</p>
                    </div>
                    <button 
                        className="btn btn-primary"
                        onClick={handleAddPreference}
                    >
                        <Plus theme="outline" size="18" />
                        新增偏好
                    </button>
                </div>
                
                {/* 搜索过滤区域 */}
                <div className="flex flex-col space-y-4 p-4 bg-base-200 rounded-lg">
                    <div className="flex flex-row space-x-4 items-center">
                        <div className="w-56">
                            <label className="select select-sm transition flex items-center w-full validator">
                                <select
                                    className="grow ps-1 flex-1"
                                    value={semesterSearch}
                                    onChange={(e) => setSemesterSearch(e.target.value)}
                                >
                                    <option value="">所有学期</option>
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
                                <PreviewOpen theme="outline" size="18" />
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
                                            <div className="flex space-x-2">
                                                <button
                                                    className="btn btn-xs btn-ghost"
                                                    onClick={() => handleViewPreference(preference.preference_uuid)}
                                                >
                                                    <PreviewOpen theme="outline" size="16" />
                                                    查看
                                                </button>
                                                <button
                                                    className="btn btn-xs btn-ghost"
                                                    onClick={() => handleEditPreference(preference.preference_uuid)}
                                                >
                                                    <Edit theme="outline" size="16" />
                                                    编辑
                                                </button>
                                                <button
                                                    className="btn btn-xs btn-ghost text-error"
                                                    onClick={() => handleDeletePreference(preference.preference_uuid)}
                                                >
                                                    <Delete theme="outline" size="16" />
                                                    删除
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="text-center py-4">
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
                
                {/* 编辑/新增模态框 */}
                <Modal
                    title={isEditing ? "编辑教师课程偏好" : "新增教师课程偏好"}
                    open={editModalVisible}
                    onCancel={() => setEditModalVisible(false)}
                    width={600}
                    footer={[
                        <button
                            key="cancel"
                            className="btn btn-sm"
                            onClick={() => setEditModalVisible(false)}
                        >
                            取消
                        </button>,
                        <button
                            key="submit"
                            className="btn btn-sm btn-primary"
                            onClick={handleSubmitPreference}
                            disabled={submitting}
                        >
                            {submitting ? '提交中...' : '确认'}
                        </button>
                    ]}
                >
                    {renderFormContent()}
                </Modal>
            </div>
        </div>
    );
} 