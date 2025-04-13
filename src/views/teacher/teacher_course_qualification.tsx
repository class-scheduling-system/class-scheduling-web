import { useEffect, useState } from "react";
import { Empty, message, Modal, Skeleton } from "antd";
import { useSelector } from "react-redux";

// 图标
import {
    Plus,
    PreviewOpen,
    CloseOne
} from "@icon-park/react";

// API
import {
    GetTeacherCourseQualificationListAPI,
    GetTeacherCourseQualificationDetailAPI,
    ApplyTeacherCourseQualificationAPI
} from "../../apis/teacher_course_qualification_api";
import { GetCourseListAPI } from "../../apis/course_api";

// 模型
import { TeacherCourseQualificationEntity } from "../../models/entity/teacher_course_qualification_entity";
import { SiteInfoEntity } from "../../models/entity/site_info_entity";
import { TeacherCourseQualificationDTO } from "../../models/dto/teacher_course_qualification_dto";
import { CourseLibraryEntity } from "../../models/entity/course_library_entity";
import { UserInfoEntity } from "../../models/entity/user_info_entity";

// 组件
import { LabelComponent } from "../../components/label_component";

/**
 * # 教师课程资格组件
 * 
 * 教师端教师课程资格管理页面，提供教师查看自己的课程资格和申请新的课程资格功能
 * 
 * @returns 教师课程资格管理组件
 */
export default function TeacherCourseQualification() {
    const site = useSelector((state: { site: SiteInfoEntity }) => state.site);
    const user = useSelector((state: { user: UserInfoEntity }) => state.user);

    // 基础状态
    const [loading, setLoading] = useState(true);
    const [refreshFlag, setRefreshFlag] = useState(0);

    // 分页状态
    const [qualificationList, setQualificationList] = useState<TeacherCourseQualificationEntity[]>([]);

    // 课程列表
    const [courseList, setCourseList] = useState<CourseLibraryEntity[]>([]);

    // 详情模态框状态
    const [detailsModalVisible, setDetailsModalVisible] = useState(false);
    const [currentQualification, setCurrentQualification] = useState<TeacherCourseQualificationEntity | null>(null);
    const [loadingDetails, setLoadingDetails] = useState(false);

    // 申请模态框状态
    const [applyModalVisible, setApplyModalVisible] = useState(false);
    const [formData, setFormData] = useState<TeacherCourseQualificationDTO>({
        teacher_uuid: user.teacher?.teacher_uuid || "",
        course_uuid: "",
        qualification_level: 1,
        is_primary: false,
        teach_years: 0,
        remarks: ""
    });
    const [submitting, setSubmitting] = useState(false);

    // 加载课程列表
    const loadCourseList = async () => {
        try {
            const response = await GetCourseListAPI(undefined, undefined, undefined, undefined, user.teacher?.unit_uuid);
            if (response && response.code === 200 && response.data) {
                setCourseList(response.data);
            } else {
                message.error("加载课程列表失败");
            }
        } catch (error) {
            console.error("加载课程列表出错:", error);
            message.error("加载课程列表失败");
        }
    };

    // 加载课程资格列表
    const loadQualificationList = async () => {
        setLoading(true);
        try {
            if (!user.teacher?.teacher_uuid) {
                message.error("未获取到教师信息");
                setLoading(false);
                return;
            }
            const response = await GetTeacherCourseQualificationListAPI(user.teacher.teacher_uuid);
            if (response && response.code === 200) {
                setQualificationList(response.data || []);
            } else {
                message.error("加载课程资格列表失败");
            }
        } catch (error) {
            console.error("加载课程资格列表出错:", error);
            message.error("加载课程资格列表失败");
        } finally {
            setLoading(false);
        }
    };

    // 查看课程资格详情
    const handleViewQualification = async (qualificationUuid: string) => {
        setLoadingDetails(true);
        setDetailsModalVisible(true);

        try {
            const response = await GetTeacherCourseQualificationDetailAPI(qualificationUuid);
            if (response && response.code === 200 && response.data) {
                setCurrentQualification(response.data);
            } else {
                message.error("获取课程资格详情失败");
                setDetailsModalVisible(false);
            }
        } catch (error) {
            console.error("获取课程资格详情出错:", error);
            message.error("获取课程资格详情失败");
            setDetailsModalVisible(false);
        } finally {
            setLoadingDetails(false);
        }
    };

    // 打开申请课程资格模态框
    const handleOpenApplyModal = () => {
        setFormData({
            teacher_uuid: user.teacher?.teacher_uuid || "",
            course_uuid: "",
            qualification_level: 1,
            is_primary: false,
            teach_years: 0,
            remarks: ""
        });
        setApplyModalVisible(true);
    };

    // 提交申请课程资格表单
    const handleSubmitApplication = async () => {
        // 表单验证
        if (!formData.course_uuid) {
            message.error("请选择课程");
            return;
        }

        if (!formData.teacher_uuid) {
            message.error("未获取到教师信息");
            return;
        }

        setSubmitting(true);

        try {
            const response = await ApplyTeacherCourseQualificationAPI(formData);

            if (response && response.code === 200) {
                message.success("申请成功，请等待审核");
                setApplyModalVisible(false);
                setRefreshFlag(refreshFlag + 1);
            } else {
                message.error(response?.message || "申请失败");
            }
        } catch (error) {
            console.error("申请课程资格出错:", error);
            message.error("申请失败");
        } finally {
            setSubmitting(false);
        }
    };

    // 获取资格等级的标签样式和文字
    const getQualificationLevelLabel = (level: number) => {
        const levelMap: Record<number, { type: "success" | "warning" | "error" | "primary" | "secondary", text: string }> = {
            1: { type: "secondary", text: "初级" },
            2: { type: "primary", text: "中级" },
            3: { type: "success", text: "高级" }
        };
        return levelMap[level] || { type: "secondary", text: "未知" };
    };

    // 获取状态的标签样式和文字
    const getStatusLabel = (status: number) => {
        const statusMap: Record<number, { type: "success" | "warning" | "error" | "primary" | "secondary", text: string }> = {
            0: { type: "warning", text: "待审核" },
            1: { type: "success", text: "已审核" },
            2: { type: "error", text: "已驳回" }
        };
        return statusMap[status] || { type: "secondary", text: "未知" };
    };

    // 初始化数据
    useEffect(() => {
        if (user.teacher?.unit_uuid) {
            loadCourseList();
        }

        // 设置页面标题
        document.title = `教师课程资格 | ${site.name || "教师系统"}`;
    }, [site.name, user.teacher?.unit_uuid]);

    // 刷新数据
    useEffect(() => {
        loadQualificationList();
    }, [refreshFlag, user.teacher?.teacher_uuid]);

    // 渲染详情模态框内容
    const renderDetailsContent = () => {
        if (loadingDetails) {
            return (
                <div className="flex justify-center items-center py-8">
                    <Skeleton active paragraph={{ rows: 6 }} />
                </div>
            );
        }

        if (!currentQualification) {
            return <div>未找到数据</div>;
        }

        // 从课程列表中查找课程名称
        const courseName = currentQualification.course_name || "未知课程";
        const qualificationLevel = getQualificationLevelLabel(currentQualification.qualification_level);
        const statusLabel = getStatusLabel(currentQualification.status);

        return (
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 space-y-2">
                        <h3 className="text-lg font-medium">基本信息</h3>
                        <div className="divider mt-0 mb-2"></div>
                    </div>

                    <div className="space-y-1">
                        <div className="text-sm text-gray-500">课程</div>
                        <div>{courseName}</div>
                    </div>

                    <div className="space-y-1">
                        <div className="text-sm text-gray-500">资格等级</div>
                        <div>
                            <LabelComponent
                                size={"badge-sm"}
                                style={"badge-outline"}
                                type={qualificationLevel.type}
                                text={qualificationLevel.text}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="text-sm text-gray-500">是否主讲教师</div>
                        <div>{currentQualification.is_primary ? "是" : "否"}</div>
                    </div>

                    <div className="space-y-1">
                        <div className="text-sm text-gray-500">状态</div>
                        <div>
                            <LabelComponent
                                size={"badge-sm"}
                                style={"badge-outline"}
                                type={statusLabel.type}
                                text={statusLabel.text}
                            />
                        </div>
                    </div>

                    <div className="col-span-2 space-y-1">
                        <div className="text-sm text-gray-500">备注说明</div>
                        <div className="p-3 bg-base-200 rounded-md min-h-16">
                            {currentQualification.remarks || "无备注说明"}
                        </div>
                    </div>

                    {currentQualification.approved_by && (
                        <div className="col-span-2 space-y-1">
                            <div className="text-sm text-gray-500">审核意见</div>
                            <div className="p-3 bg-base-200 rounded-md min-h-16">
                                {currentQualification.remarks || "无审核意见"}
                            </div>
                        </div>
                    )}

                    <div className="col-span-2 space-y-1">
                        <div className="text-sm text-gray-500">创建时间</div>
                        <div>{new Date(currentQualification.created_at).toLocaleString()}</div>
                    </div>

                    <div className="col-span-2 space-y-1">
                        <div className="text-sm text-gray-500">更新时间</div>
                        <div>{new Date(currentQualification.updated_at).toLocaleString()}</div>
                    </div>
                </div>
            </div>
        );
    };

    // 渲染申请表单模态框内容
    const renderApplyFormContent = () => {
        return (
            <div className="space-y-4">
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">课程 <span className="text-error">*</span></span>
                    </label>
                    <select
                        className="select select-bordered w-full"
                        value={formData.course_uuid}
                        onChange={(e) => setFormData({ ...formData, course_uuid: e.target.value })}
                    >
                        <option value="">请选择课程</option>
                        {courseList.map((course) => (
                            <option key={course.course_library_uuid} value={course.course_library_uuid}>
                                {course.name} ({course.id})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">资格等级 <span className="text-error">*</span></span>
                    </label>
                    <div className="flex flex-col space-y-2">
                        {[1, 2, 3].map(level => {
                            const qualification = getQualificationLevelLabel(level);
                            return (
                                <label key={level} className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        className="radio radio-sm"
                                        name="qualification_level"
                                        checked={formData.qualification_level === level}
                                        onChange={() => setFormData({ ...formData, qualification_level: level })}
                                    />
                                    <LabelComponent
                                        size={"badge-sm"}
                                        style={"badge-outline"}
                                        type={qualification.type}
                                        text={qualification.text}
                                    />
                                </label>
                            );
                        })}
                    </div>
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">教授年限 <span className="text-error">*</span></span>
                    </label>
                    <input
                        type="number"
                        className="input input-bordered"
                        value={formData.teach_years}
                        min={0}
                        onChange={(e) => setFormData({ ...formData, teach_years: parseInt(e.target.value) || 0 })}
                    />
                </div>

                <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-2">
                        <input
                            type="checkbox"
                            className="checkbox checkbox-sm"
                            checked={formData.is_primary}
                            onChange={(e) => setFormData({ ...formData, is_primary: e.target.checked })}
                        />
                        <span className="label-text">是否申请为主讲教师</span>
                    </label>
                </div>

                <div className="form-control flex flex-col">
                    <label className="label">
                        <span className="label-text">申请理由</span>
                    </label>
                    <textarea
                        className="textarea textarea-bordered w-full h-24"
                        placeholder="请输入申请理由（选填）"
                        value={formData.remarks || ""}
                        onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
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
                        <h1 className="text-2xl font-semibold">教师课程资格</h1>
                        <p className="text-sm text-base-content/70">查看您的课程资格或申请新的课程资格</p>
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={handleOpenApplyModal}
                    >
                        <Plus theme="outline" size="18" />
                        申请资格
                    </button>
                </div>

                {/* 数据表格 */}
                <div className="overflow-x-auto">
                    <table className="table table-zebra">
                        <thead>
                            <tr>
                                <th>课程</th>
                                <th>资格等级</th>
                                <th>是否主讲</th>
                                <th>状态</th>
                                <th>申请时间</th>
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
                                        <td><Skeleton paragraph={{ rows: 0 }} title={{ width: 100 }} active /></td>
                                        <td><Skeleton paragraph={{ rows: 0 }} title={{ width: 100 }} active /></td>
                                    </tr>
                                ))
                            ) : qualificationList.length > 0 ? (
                                qualificationList.map((qualification) => (
                                    <tr key={qualification.qualification_uuid} className="transition hover:bg-base-200">
                                        <td className="text-nowrap">
                                            {qualification.course_name || "未知课程"}
                                        </td>
                                        <td>
                                            <LabelComponent
                                                size={"badge-sm"}
                                                style={"badge-outline"}
                                                type={getQualificationLevelLabel(qualification.qualification_level).type}
                                                text={getQualificationLevelLabel(qualification.qualification_level).text}
                                            />
                                        </td>
                                        <td>{qualification.is_primary ? "是" : "否"}</td>
                                        <td>
                                            <LabelComponent
                                                size={"badge-sm"}
                                                style={"badge-outline"}
                                                type={getStatusLabel(qualification.status).type}
                                                text={getStatusLabel(qualification.status).text}
                                            />
                                        </td>
                                        <td>{new Date(qualification.created_at).toLocaleDateString()}</td>
                                        <td>
                                            <div className="flex space-x-2">
                                                <button
                                                    className="btn btn-xs btn-ghost"
                                                    onClick={() => handleViewQualification(qualification.qualification_uuid)}
                                                >
                                                    <PreviewOpen theme="outline" size="16" />
                                                    查看
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

                {/* 详情模态框 */}
                <Modal
                    title="课程资格详情"
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

                {/* 申请模态框 */}
                <Modal
                    title="申请课程资格"
                    open={applyModalVisible}
                    onCancel={() => setApplyModalVisible(false)}
                    width={600}
                    footer={[
                        <div className="flex flex-row justify-end gap-1">
                            <button
                                key="cancel"
                                className="btn btn-sm"
                                onClick={() => setApplyModalVisible(false)}
                            >
                                取消
                            </button>
                            <button
                                key="submit"
                                className="btn btn-sm btn-primary"
                                onClick={handleSubmitApplication}
                                disabled={submitting}
                            >
                                {submitting ? '提交中...' : '确认申请'}
                            </button>
                        </div>
                    ]}
                >
                    {renderApplyFormContent()}
                </Modal>
            </div>
        </div>
    );
} 