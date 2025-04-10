import { useEffect, useRef, useState } from "react";
import { SiteInfoEntity } from "../../models/entity/site_info_entity.ts";
import {
  AddOne,
  AllApplication,
  ChartGraph,
  Delete,
  Editor,
  Info,
  Refresh,
  Search,
  Check,
  CloseOne
} from "@icon-park/react";
import { 
  GetTeacherCourseQualificationPageAPI, 
  ApproveTeacherCourseQualificationAPI, 
  DeleteTeacherCourseQualificationAPI 
} from "../../apis/teacher_course_qualification_api.ts";
import { Button, Empty, message, Modal, Pagination, Skeleton } from "antd";
import { PageEntity } from "../../models/entity/page_entity.ts";
import { TeacherCourseQualificationEntity } from "../../models/entity/teacher_course_qualification_entity.ts";
import { animated, useTransition } from "@react-spring/web";
import { useNavigate } from "react-router";
import { PageTeacherCourseQualificationDTO } from "../../models/dto/page/page_teacher_course_qualification_dto.ts";
import { useSelector } from "react-redux";
import { CurrentInfoStore } from "../../models/store/current_info_store.ts";
import { GetTeacherListAPI } from "../../apis/teacher_api.ts";
import { GetCourseListAPI } from "../../apis/course_api.ts";
import { TeacherLiteEntity } from "../../models/entity/teacher_lite_entity.ts";
import { CourseLibraryEntity } from "../../models/entity/course_library_entity.ts";
import { formatTimestamp } from "../../utils/time_utils.ts";
import { AcademicAffairsStore } from "@/models/store/academic_affairs_store.ts";

export function AcademicTeacherCourseQualification({ site }: Readonly<{
  site: SiteInfoEntity
}>) {
  const inputFocus = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const getCurrent = useSelector((state: { current: CurrentInfoStore }) => state.current);
  const academicAffairs = useSelector((state: { academicAffairs: AcademicAffairsStore }) => state.academicAffairs);

  // 教师课程资格列表状态
  const [qualificationList, setQualificationList] = useState<PageEntity<TeacherCourseQualificationEntity>>({
    records: new Array(5).fill({}) as TeacherCourseQualificationEntity[],
    total: 0,
    size: 20,
    current: 1
  } as PageEntity<TeacherCourseQualificationEntity>);

  // 教师列表状态
  const [teacherList, setTeacherList] = useState<TeacherLiteEntity[]>([]);

  // 课程列表状态
  const [courseList, setCourseList] = useState<CourseLibraryEntity[]>([]);

  // 搜索参数状态
  const [searchRequest, setSearchRequest] = useState<PageTeacherCourseQualificationDTO>({
    page: 1,
    size: 20,
    is_desc: true,
    teacher_uuid: '',
    course_uuid: '',
    department_uuid: academicAffairs.currentAcademicAffairs?.department,
    qualification_level: undefined,
    is_primary: undefined,
    status: undefined
  });

  // 搜索条件状态
  const [teacherSearch, setTeacherSearch] = useState<string>("");
  const [courseSearch, setCourseSearch] = useState<string>("");
  const [levelSearch, setLevelSearch] = useState<string>("");
  const [primarySearch, setPrimarySearch] = useState<string>("");
  const [statusSearch, setStatusSearch] = useState<string>("");

  // 页面加载状态
  const [loading, setLoading] = useState(true);
  
  // 删除确认对话框状态
  const [dialogDelete, setDialogDelete] = useState<boolean>(false);
  const [deleteQualificationUuid, setDeleteQualificationUuid] = useState("");
  
  // 审核对话框状态
  const [dialogApprove, setDialogApprove] = useState<boolean>(false);
  const [approveQualificationUuid, setApproveQualificationUuid] = useState("");
  const [approveStatus, setApproveStatus] = useState<number>(1); // 1-通过，2-驳回
  const [approveRemarks, setApproveRemarks] = useState<string>("");
  
  // 统计显示状态
  const [showStats, setShowStats] = useState(false);

  // 页面加载过渡动画
  const transitionSearch = useTransition(loading ?? 0, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    config: { duration: 100 },
  });

  useEffect(() => {
    setSearchRequest({
      ...searchRequest,
      department_uuid: academicAffairs.currentAcademicAffairs?.department
    });
  }, [academicAffairs.currentAcademicAffairs?.department]);

  // 设置页面标题
  useEffect(() => {
    document.title = `教师课程资格管理 | ${site.name ?? "Frontleaves Technology"}`;
  }, [site.name]);

  // 键盘快捷键设置
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (getCurrent?.system) {
        if (event.metaKey && event.key === "k") {
          event.preventDefault();
          inputFocus.current?.focus();
        }
      } else if (event.ctrlKey && event.key === "k") {
        event.preventDefault();
        inputFocus.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [getCurrent?.system]);

  // 获取教师列表
  useEffect(() => {
    const fetchTeacherList = async () => {
      try {
        const teacherResp = await GetTeacherListAPI();
        if (teacherResp?.output === "Success" && teacherResp.data) {
          setTeacherList(teacherResp.data);
        } else {
          message.error(teacherResp?.error_message ?? "获取教师列表失败");
        }
      } catch (error) {
        console.error("获取教师列表失败", error);
        message.error("获取教师列表失败");
      }
    };

    fetchTeacherList().then();
  }, []);

  // 获取课程列表
  useEffect(() => {
    const fetchCourseList = async () => {
      try {
        const courseResp = await GetCourseListAPI(undefined, undefined, undefined, undefined, academicAffairs.currentAcademicAffairs?.department);
        if (courseResp?.output === "Success" && courseResp.data) {
          setCourseList(courseResp.data);
        } else {
          message.error(courseResp?.error_message ?? "获取课程列表失败");
        }
      } catch (error) {
        console.error("获取课程列表失败", error);
        message.error("获取课程列表失败");
      }
    };

    if (academicAffairs.currentAcademicAffairs?.department) {
      fetchCourseList().then();
    }
  }, [academicAffairs.currentAcademicAffairs?.department]);

  // 获取教师课程资格列表
  useEffect(() => {
    const fetchQualificationList = async () => {
      try {
        const qualificationResp = await GetTeacherCourseQualificationPageAPI(searchRequest);
        if (qualificationResp?.output === "Success") {
          setQualificationList({
            ...qualificationResp.data!,
            records: qualificationResp.data!.records
          });
          setLoading(false);
        } else {
          console.log(qualificationResp);
          message.error(qualificationResp?.error_message ?? "获取教师课程资格列表失败");
          setLoading(false);
        }
      } catch (error) {
        console.error("获取教师课程资格列表失败", error);
        message.error("获取教师课程资格列表失败");
        setLoading(false);
      }
    };

    if (academicAffairs.currentAcademicAffairs?.department) {
      fetchQualificationList().then();
    }
  }, [academicAffairs.currentAcademicAffairs?.department]);

  // 当对话框关闭时刷新数据
  useEffect(() => {
    if (!dialogDelete && deleteQualificationUuid) {
      setDeleteQualificationUuid('');
    }
  }, [dialogDelete]);

  useEffect(() => {
    if (!dialogApprove && approveQualificationUuid) {
      setApproveQualificationUuid('');
      setApproveRemarks('');
    }
  }, [dialogApprove]);

  // 统计数据计算
  const qualificationStats = {
    total: qualificationList.total || 0,
    byLevel: {
      junior: qualificationList.records.filter(q => q.qualification_level === 1).length,
      intermediate: qualificationList.records.filter(q => q.qualification_level === 2).length,
      senior: qualificationList.records.filter(q => q.qualification_level === 3).length
    },
    byStatus: {
      pending: qualificationList.records.filter(q => q.status === 0).length,
      approved: qualificationList.records.filter(q => q.status === 1).length,
      rejected: qualificationList.records.filter(q => q.status === 2).length
    },
    byPrimary: {
      primary: qualificationList.records.filter(q => q.is_primary).length,
      notPrimary: qualificationList.records.filter(q => !q.is_primary).length
    }
  };

  // 处理搜索表单提交
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchRequest({
      ...searchRequest,
      page: 1,
      teacher_uuid: teacherSearch || undefined,
      course_uuid: courseSearch || undefined,
      qualification_level: levelSearch ? parseInt(levelSearch) : undefined,
      is_primary: primarySearch ? (primarySearch === "1") : undefined,
      status: statusSearch ? parseInt(statusSearch) : undefined
    });
  };

  // 处理页码变更
  const handlePageChange = (page: number, pageSize?: number) => {
    setSearchRequest({
      ...searchRequest,
      page,
      size: pageSize || searchRequest.size
    });
  };

  // 处理删除资格
  const handleDeleteQualification = async () => {
    if (!deleteQualificationUuid) return;
    
    try {
      const deleteResp = await DeleteTeacherCourseQualificationAPI(deleteQualificationUuid);
      if (deleteResp?.output === "Success") {
        message.success("删除教师课程资格成功");
        setDialogDelete(false);
      } else {
        message.error(deleteResp?.error_message ?? "删除教师课程资格失败");
      }
    } catch (error) {
      console.error("删除教师课程资格失败", error);
      message.error("删除教师课程资格失败");
    }
  };

  // 处理审核资格
  const handleApproveQualification = async () => {
    if (!approveQualificationUuid) return;
    
    try {
      const approveResp = await ApproveTeacherCourseQualificationAPI(
        approveQualificationUuid, 
        approveStatus, 
        approveRemarks
      );
      
      if (approveResp?.output === "Success") {
        message.success(approveStatus === 1 ? "审核通过成功" : "驳回申请成功");
        setDialogApprove(false);
      } else {
        message.error(approveResp?.error_message ?? "审核操作失败");
      }
    } catch (error) {
      console.error("审核操作失败", error);
      message.error("审核操作失败");
    }
  };

  // 打开删除对话框
  const openDeleteDialog = (qualificationUuid: string) => {
    setDeleteQualificationUuid(qualificationUuid);
    setDialogDelete(true);
  };

  // 打开审核对话框
  const openApproveDialog = (qualificationUuid: string, initialStatus: number = 1) => {
    setApproveQualificationUuid(qualificationUuid);
    setApproveStatus(initialStatus);
    setDialogApprove(true);
  };

  // 渲染资格等级文本
  const renderQualificationLevel = (level: number) => {
    switch (level) {
      case 1:
        return <span className="text-blue-600">初级</span>;
      case 2:
        return <span className="text-green-600">中级</span>;
      case 3:
        return <span className="text-orange-600">高级</span>;
      default:
        return <span className="text-gray-600">未知</span>;
    }
  };

  // 渲染资格状态文本
  const renderQualificationStatus = (status: number) => {
    switch (status) {
      case 0:
        return <span className="text-yellow-600">待审核</span>;
      case 1:
        return <span className="text-green-600">已审核</span>;
      case 2:
        return <span className="text-red-600">已驳回</span>;
      default:
        return <span className="text-gray-600">未知</span>;
    }
  };

  return (
    <div className="container mx-auto">
      <div className="card shadow-xl bg-base-100">
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <h2 className="card-title text-2xl">教师课程资格管理</h2>
            <div className="flex gap-2">
              <button
                type="button"
                className="btn btn-sm btn-outline"
                onClick={() => setShowStats(!showStats)}
              >
                <ChartGraph theme="outline" size="18" />
                {showStats ? "隐藏统计" : "显示统计"}
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline btn-success"
                onClick={() => {
                  setSearchRequest({
                    page: 1,
                    size: 20,
                    is_desc: true
                  });
                  setTeacherSearch("");
                  setCourseSearch("");
                  setLevelSearch("");
                  setPrimarySearch("");
                  setStatusSearch("");
                }}
              >
                <Refresh theme="outline" size="18" />
                重置
              </button>
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={() => navigate("/academic/teacher-course-qualification/add")}
              >
                <AddOne theme="outline" size="18" />
                添加
              </button>
            </div>
          </div>

          {/* 统计卡片 - 有条件显示 */}
          {showStats && (
            <div className="stats mb-4 shadow">
              <div className="stat">
                <div className="stat-figure text-primary">
                  <AllApplication theme="outline" size="24" />
                </div>
                <div className="stat-title">资格总数</div>
                <div className="stat-value text-primary">{qualificationStats.total}</div>
              </div>
              
              <div className="stat">
                <div className="stat-figure text-warning">
                  <Info theme="outline" size="24" />
                </div>
                <div className="stat-title">待审核资格</div>
                <div className="stat-value text-warning">{qualificationStats.byStatus.pending}</div>
              </div>
              
              <div className="stat">
                <div className="stat-figure text-success">
                  <Info theme="outline" size="24" />
                </div>
                <div className="stat-title">主讲教师资格</div>
                <div className="stat-value text-success">{qualificationStats.byPrimary.primary}</div>
              </div>
              
              <div className="stat">
                <div className="stat-figure text-secondary">
                  <Info theme="outline" size="24" />
                </div>
                <div className="stat-title">高级资格</div>
                <div className="stat-value text-secondary">{qualificationStats.byLevel.senior}</div>
              </div>
            </div>
          )}

          {/* 搜索表单 */}
          <form onSubmit={handleSearchSubmit} className="mb-4">
            <div className="card bg-base-200 shadow-sm mb-4">
              <div className="card-body p-4">
                <div className="flex items-center mb-2">
                  <Search theme="outline" size="18" className="mr-2 text-primary" />
                  <h3 className="text-lg font-medium">搜索条件</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="form-control">
                    <label className="label py-1">
                      <span className="label-text font-medium">教师</span>
                    </label>
                    <select
                      className="select select-bordered select-sm w-full"
                      value={teacherSearch}
                      onChange={(e) => setTeacherSearch(e.target.value)}
                    >
                      <option value="">全部教师</option>
                      {teacherList.map((teacher) => (
                        <option key={teacher.teacher_uuid} value={teacher.teacher_uuid}>
                          {teacher.teacher_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label py-1">
                      <span className="label-text font-medium">课程</span>
                    </label>
                    <select
                      className="select select-bordered select-sm w-full"
                      value={courseSearch}
                      onChange={(e) => setCourseSearch(e.target.value)}
                    >
                      <option value="">全部课程</option>
                      {courseList.map((course) => (
                        <option key={course.course_library_uuid} value={course.course_library_uuid}>
                          {course.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label py-1">
                      <span className="label-text font-medium">资格等级</span>
                    </label>
                    <select
                      className="select select-bordered select-sm w-full"
                      value={levelSearch}
                      onChange={(e) => setLevelSearch(e.target.value)}
                    >
                      <option value="">全部等级</option>
                      <option value="1">初级</option>
                      <option value="2">中级</option>
                      <option value="3">高级</option>
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label py-1">
                      <span className="label-text font-medium">主讲教师</span>
                    </label>
                    <select
                      className="select select-bordered select-sm w-full"
                      value={primarySearch}
                      onChange={(e) => setPrimarySearch(e.target.value)}
                    >
                      <option value="">全部</option>
                      <option value="1">是</option>
                      <option value="0">否</option>
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label py-1">
                      <span className="label-text font-medium">状态</span>
                    </label>
                    <select
                      className="select select-bordered select-sm w-full"
                      value={statusSearch}
                      onChange={(e) => setStatusSearch(e.target.value)}
                    >
                      <option value="">全部状态</option>
                      <option value="0">待审核</option>
                      <option value="1">已审核</option>
                      <option value="2">已驳回</option>
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label py-1 opacity-0">
                      <span className="label-text">操作</span>
                    </label>
                    <div className="flex gap-2">
                      <button type="submit" className="btn btn-primary btn-sm flex-1">
                        <Search theme="outline" size="16" />
                        搜索
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-outline btn-sm" 
                        onClick={() => {
                          setSearchRequest({
                            page: 1,
                            size: 20,
                            is_desc: true
                          });
                          setTeacherSearch("");
                          setCourseSearch("");
                          setLevelSearch("");
                          setPrimarySearch("");
                          setStatusSearch("");
                        }}
                      >
                        <Refresh theme="outline" size="16" />
                        重置
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>

          {/* 表格区域 */}
          <div className="overflow-x-auto">
            {transitionSearch((style, item) =>
              item ? (
                <animated.div style={{ ...style }}>
                  <Skeleton active paragraph={{ rows: 10 }} />
                </animated.div>
              ) : (
                <animated.div style={{ ...style }}>
                  {qualificationList.records.length > 0 ? (
                    <table className="table table-zebra">
                      <thead>
                        <tr>
                          <th>教师</th>
                          <th>课程</th>
                          <th>资格等级</th>
                          <th>主讲教师</th>
                          <th>教授年限</th>
                          <th>状态</th>
                          <th>创建时间</th>
                          <th className="text-right">操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        {qualificationList.records.map((qualification, index) => (
                          <tr key={qualification.qualification_uuid || index}>
                            <td>{qualification.teacher_name}</td>
                            <td>{qualification.course_name}</td>
                            <td>{renderQualificationLevel(qualification.qualification_level)}</td>
                            <td>
                              {qualification.is_primary ? 
                                <span className="text-success">是</span> : 
                                <span className="text-base-content/60">否</span>
                              }
                            </td>
                            <td>{qualification.teach_years}年</td>
                            <td>{renderQualificationStatus(qualification.status)}</td>
                            <td>{formatTimestamp(qualification.created_at)}</td>
                            <td className="text-right">
                              <div className="flex justify-end gap-1">
                                {qualification.status === 0 && (
                                  <>
                                    <button
                                      className="btn btn-xs btn-success"
                                      onClick={() => openApproveDialog(qualification.qualification_uuid, 1)}
                                    >
                                      <Check theme="outline" size="14" />
                                      通过
                                    </button>
                                    <button
                                      className="btn btn-xs btn-error"
                                      onClick={() => openApproveDialog(qualification.qualification_uuid, 2)}
                                    >
                                      <CloseOne theme="outline" size="14" />
                                      驳回
                                    </button>
                                  </>
                                )}
                                <button
                                  className="btn btn-xs btn-primary"
                                  onClick={() => navigate(`/academic/teacher-course-qualification/edit/${qualification.qualification_uuid}`)}
                                >
                                  <Editor theme="outline" size="14" />
                                  编辑
                                </button>
                                <button
                                  className="btn btn-xs btn-error"
                                  onClick={() => openDeleteDialog(qualification.qualification_uuid)}
                                >
                                  <Delete theme="outline" size="14" />
                                  删除
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="flex items-center justify-center p-8">
                      <Empty description="暂无教师课程资格数据" />
                    </div>
                  )}
                </animated.div>
              )
            )}

            {/* 分页 */}
            {!loading && qualificationList.records.length > 0 && (
              <div className="flex justify-center mt-4">
                <Pagination
                  current={qualificationList.current}
                  pageSize={qualificationList.size}
                  total={qualificationList.total}
                  onChange={handlePageChange}
                  showSizeChanger
                  showQuickJumper
                  showTotal={(total) => `共 ${total} 条数据`}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 删除确认对话框 */}
      <Modal
        title="删除确认"
        open={dialogDelete}
        onCancel={() => setDialogDelete(false)}
        footer={[
          <Button key="cancel" onClick={() => setDialogDelete(false)}>
            取消
          </Button>,
          <Button key="delete" danger type="primary" onClick={handleDeleteQualification}>
            删除
          </Button>
        ]}
      >
        <p>确定要删除此教师课程资格记录吗？此操作不可恢复。</p>
      </Modal>

      {/* 审核对话框 */}
      <Modal
        title={approveStatus === 1 ? "通过申请" : "驳回申请"}
        open={dialogApprove}
        onCancel={() => setDialogApprove(false)}
        footer={[
          <Button key="cancel" onClick={() => setDialogApprove(false)}>
            取消
          </Button>,
          <Button 
            key="approve" 
            type="primary" 
            onClick={handleApproveQualification}
            className={approveStatus === 1 ? "bg-green-500" : "bg-red-500"}
          >
            {approveStatus === 1 ? "通过" : "驳回"}
          </Button>
        ]}
      >
        <div className="space-y-4">
          <p>
            {approveStatus === 1 
              ? "确定要通过此教师课程资格申请吗？" 
              : "确定要驳回此教师课程资格申请吗？"}
          </p>
          <div>
            <label htmlFor="approve-remarks" className="block mb-1 text-sm font-medium text-gray-700">
              审核备注(可选)
            </label>
            <textarea
              id="approve-remarks"
              className="textarea textarea-bordered w-full"
              value={approveRemarks}
              onChange={(e) => setApproveRemarks(e.target.value)}
              placeholder="请输入审核备注..."
              rows={3}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
} 