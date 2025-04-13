import { useState, useEffect, JSX } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { Button, message, Radio, Switch, Skeleton } from "antd";
import { Return, Editor, User, Calendar, Check, Remind, NotebookOne, Info } from "@icon-park/react";
import { SiteInfoEntity } from "../../../../models/entity/site_info_entity.ts";
import { TeacherCourseQualificationDTO } from "../../../../models/dto/teacher_course_qualification_dto.ts";
import { 
  GetTeacherCourseQualificationDetailAPI, 
  UpdateTeacherCourseQualificationAPI 
} from "../../../../apis/teacher_course_qualification_api.ts";
import { GetTeacherListAPI } from "../../../../apis/teacher_api.ts";
import { GetCourseListAPI } from "../../../../apis/course_api.ts";
import { TeacherLiteEntity } from "../../../../models/entity/teacher_lite_entity.ts";
import { CourseLibraryEntity } from "../../../../models/entity/course_library_entity.ts";
import { TeacherCourseQualificationEntity } from "../../../../models/entity/teacher_course_qualification_entity.ts";
import { useSelector } from "react-redux";
import { AcademicAffairsStore } from "@/models/store/academic_affairs_store.ts";

/**
 * 编辑教师课程资格组件
 * 
 * 用于编辑现有教师课程资格记录
 * 
 * @param site 站点信息
 * @returns 编辑教师课程资格页面组件
 */
export function AcademicEditTeacherCourseQualification({ site }: Readonly<{
  site: SiteInfoEntity
}>): JSX.Element {
  const navigate = useNavigate();
  const { qualificationId } = useParams(); // 从URL获取资格ID
  const academicAffairs = useSelector((state: { academicAffairs: AcademicAffairsStore }) => state.academicAffairs);

  // 表单数据
  const [formData, setFormData] = useState<TeacherCourseQualificationDTO>({
    teacher_uuid: "",
    course_uuid: "",
    qualification_level: 1,
    is_primary: false,
    teach_years: 1,
    remarks: ""
  });

  // 资格信息
  const [qualification, setQualification] = useState<TeacherCourseQualificationEntity | null>(null);

  // 加载状态
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  
  // 选项数据
  const [teacherList, setTeacherList] = useState<TeacherLiteEntity[]>([]);
  const [courseList, setCourseList] = useState<CourseLibraryEntity[]>([]);

  // 教师搜索
  const [teacherSearch, setTeacherSearch] = useState<string>("");
  // 课程搜索
  const [courseSearch, setCourseSearch] = useState<string>("");

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

  // 获取资格详情
  useEffect(() => {
    const fetchQualificationDetail = async () => {
      if (!qualificationId) {
        message.error("资格ID不能为空");
        navigate("/academic/teacher-course-qualification");
        return;
      }

      try {
        const response = await GetTeacherCourseQualificationDetailAPI(qualificationId);
        
        if (response?.output === "Success" && response.data) {
          const qualificationData = response.data;
          setQualification(qualificationData);
          
          // 初始化表单数据
          setFormData({
            teacher_uuid: qualificationData.teacher_uuid,
            course_uuid: qualificationData.course_uuid,
            qualification_level: qualificationData.qualification_level,
            is_primary: qualificationData.is_primary,
            teach_years: qualificationData.teach_years,
            remarks: qualificationData.remarks || ""
          });
          
          setLoading(false);
        } else {
          message.error(response?.error_message ?? "获取教师课程资格详情失败");
          navigate("/academic/teacher-course-qualification");
        }
      } catch (error) {
        console.error("获取教师课程资格详情失败", error);
        message.error("获取教师课程资格详情失败");
        navigate("/academic/teacher-course-qualification");
      }
    };

    fetchQualificationDetail();
  }, [qualificationId, navigate]);

  // 设置页面标题
  useEffect(() => {
    document.title = `编辑教师课程资格 | ${site.name ?? "Frontleaves Technology"}`;
  }, [site.name]);

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 表单验证 - 不再验证教师和课程，因为它们是只读的
    if (formData.teach_years < 0) {
      message.error("教授年限不能为负数");
      return;
    }

    if (!qualificationId) {
      message.error("资格ID不能为空");
      return;
    }

    setSubmitting(true);

    try {
      // 使用原始教师和课程UUID，确保不会被修改
      const updateData = {
        ...formData,
        teacher_uuid: qualification?.teacher_uuid || formData.teacher_uuid,
        course_uuid: qualification?.course_uuid || formData.course_uuid
      };
      
      const response = await UpdateTeacherCourseQualificationAPI(qualificationId, updateData);
      
      if (response?.output === "Success") {
        message.success("更新教师课程资格成功");
        navigate("/academic/teacher-course-qualification");
      } else {
        message.error(response?.error_message ?? "更新教师课程资格失败");
      }
    } catch (error) {
      console.error("更新教师课程资格失败", error);
      message.error("更新教师课程资格失败");
    } finally {
      setSubmitting(false);
    }
  };

  // 重置表单
  const handleReset = () => {
    if (qualification) {
      setFormData({
        teacher_uuid: qualification.teacher_uuid,
        course_uuid: qualification.course_uuid,
        qualification_level: qualification.qualification_level,
        is_primary: qualification.is_primary,
        teach_years: qualification.teach_years,
        remarks: qualification.remarks || ""
      });
      setTeacherSearch("");
      setCourseSearch("");
      message.success("表单已重置为原始数据");
    }
  };

  // 过滤后的教师列表
  const filteredTeacherList = teacherSearch
    ? teacherList.filter(teacher => 
        teacher.teacher_name.toLowerCase().includes(teacherSearch.toLowerCase()))
    : teacherList;

  // 过滤后的课程列表
  const filteredCourseList = courseSearch
    ? courseList.filter(course => 
        course.name.toLowerCase().includes(courseSearch.toLowerCase()))
    : courseList;

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
    <div className="flex flex-col gap-4">
      <div className="flex items-center space-x-2">
        <Link to={"/academic/teacher-course-qualification"}>
          <Return theme="outline" size="24"/>
        </Link>
        <h2 className="text-2xl font-bold flex items-center space-x-2">
          <span>编辑教师课程资格</span>
        </h2>
      </div>
      <div className="w-full">
        <div className="grid grid-cols-12 gap-x-6">
          <div className="lg:col-span-8 md:col-span-12 sm:col-span-12 flex">
            <div className="card card-border bg-base-100 w-full shadow-md">
              <h2 className="card-title bg-neutral/10 rounded-t-lg p-3"><Editor theme="outline" size="18" />编辑教师课程资格信息</h2>
              <div className="card-body">
                {loading ? (
                  <Skeleton active paragraph={{ rows: 8 }} />
                ) : (
                  <form id="qualification_edit" onSubmit={handleSubmit} className="flex flex-col flex-grow space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                      <fieldset className="flex flex-col">
                        <legend className="flex items-center space-x-1 mb-1 text-sm">
                          <User theme="outline" size="14" />
                          <span>教师</span>
                          <span className="text-red-500">*</span>
                        </legend>
                        <div className="flex flex-col space-y-2">
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              className="input input-sm input-bordered flex-grow validator"
                              placeholder="搜索教师"
                              value={teacherSearch}
                              onChange={(e) => setTeacherSearch(e.target.value)}
                              disabled
                            />
                          </div>
                          <select
                            className="select select-sm select-bordered w-full validator bg-gray-100"
                            required
                            value={formData.teacher_uuid}
                            onChange={(e) => setFormData({...formData, teacher_uuid: e.target.value})}
                            disabled
                          >
                            <option value="">请选择教师</option>
                            {filteredTeacherList.map((teacher) => (
                              <option key={teacher.teacher_uuid} value={teacher.teacher_uuid}>
                                {teacher.teacher_name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </fieldset>

                      <fieldset className="flex flex-col">
                        <legend className="flex items-center space-x-1 mb-1 text-sm">
                          <Calendar theme="outline" size="14" />
                          <span>课程</span>
                          <span className="text-red-500">*</span>
                        </legend>
                        <div className="flex flex-col space-y-2">
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              className="input input-sm input-bordered flex-grow validator"
                              placeholder="搜索课程"
                              value={courseSearch}
                              onChange={(e) => setCourseSearch(e.target.value)}
                              disabled
                            />
                          </div>
                          <select
                            className="select select-sm select-bordered w-full validator bg-gray-100"
                            required
                            value={formData.course_uuid}
                            onChange={(e) => setFormData({...formData, course_uuid: e.target.value})}
                            disabled
                          >
                            <option value="">请选择课程</option>
                            {filteredCourseList.map((course) => (
                              <option key={course.course_library_uuid} value={course.course_library_uuid}>
                                {course.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </fieldset>

                      <fieldset className="flex flex-col">
                        <legend className="flex items-center space-x-1 mb-1 text-sm">
                          <NotebookOne theme="outline" size="14" />
                          <span>课程资格等级</span>
                          <span className="text-red-500">*</span>
                        </legend>
                        <Radio.Group
                          value={formData.qualification_level}
                          onChange={(e) => setFormData({...formData, qualification_level: e.target.value})}
                          className="flex flex-wrap gap-2"
                        >
                          <Radio value={1}>初级</Radio>
                          <Radio value={2}>中级</Radio>
                          <Radio value={3}>高级</Radio>
                        </Radio.Group>
                      </fieldset>

                      <fieldset className="flex flex-col">
                        <legend className="flex items-center space-x-1 mb-1 text-sm">
                          <Remind theme="outline" size="14" />
                          <span>主讲教师</span>
                        </legend>
                        <div className="form-control w-full">
                          <label className="cursor-pointer label justify-start gap-4 py-1">
                            <Switch
                              checked={formData.is_primary}
                              onChange={(checked) => setFormData({...formData, is_primary: checked})}
                            />
                            <span className="label-text">设为主讲教师</span>
                          </label>
                        </div>
                      </fieldset>

                      <fieldset className="flex flex-col">
                        <legend className="flex items-center space-x-1 mb-1 text-sm">
                          <Check theme="outline" size="14" />
                          <span>教授年限</span>
                          <span className="text-red-500">*</span>
                        </legend>
                        <input
                          type="number"
                          className="input input-sm input-bordered w-full validator"
                          required
                          min="0"
                          value={formData.teach_years}
                          onChange={(e) => setFormData({...formData, teach_years: parseInt(e.target.value) || 0})}
                        />
                      </fieldset>

                      <fieldset className="flex flex-col md:col-span-2">
                        <legend className="flex items-center space-x-1 mb-1 text-sm">
                          <NotebookOne theme="outline" size="14" />
                          <span>备注说明</span>
                        </legend>
                        <textarea
                          className="textarea textarea-sm textarea-bordered w-full h-24"
                          placeholder="请输入备注说明（选填）"
                          value={formData.remarks || ""}
                          onChange={(e) => setFormData({...formData, remarks: e.target.value})}
                        />
                      </fieldset>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                      <Button onClick={handleReset} type="default" className="btn-outline">
                        重置
                      </Button>
                      <Button 
                        htmlType="submit" 
                        type="primary" 
                        className="btn-primary"
                        loading={submitting}
                      >
                        保存
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 md:col-span-12 sm:col-span-12 flex flex-col space-y-6">
            <div className="card card-border bg-base-100 w-full h-full shadow-md">
              <h2 className="card-title bg-neutral/10 rounded-t-lg p-3"><User theme="outline" size="18" />当前资格信息</h2>
              <div className="card-body">
                {loading ? (
                  <Skeleton active paragraph={{ rows: 6 }} />
                ) : qualification ? (
                  <div className="space-y-1">
                    <div className="grid grid-cols-2 gap-2 items-center">
                      <span className="text-sm text-gray-600 font-medium flex items-center space-x-2">
                        <User theme="outline" size="14" className="text-secondary" />
                        <span>教师</span>
                      </span>
                      <span className="text-right text-gray-800">{qualification.teacher_name}</span>
                    </div>
                    <div className="border-b border-gray-200"></div>
                    
                    <div className="grid grid-cols-2 gap-2 items-center">
                      <span className="text-sm text-gray-600 font-medium flex items-center space-x-2">
                        <Calendar theme="outline" size="14" className="text-secondary" />
                        <span>课程</span>
                      </span>
                      <span className="text-right text-gray-800">{qualification.course_name}</span>
                    </div>
                    <div className="border-b border-gray-200"></div>
                    
                    <div className="grid grid-cols-2 gap-2 items-center">
                      <span className="text-sm text-gray-600 font-medium flex items-center space-x-2">
                        <NotebookOne theme="outline" size="14" className="text-secondary" />
                        <span>状态</span>
                      </span>
                      <span className="text-right">{renderQualificationStatus(qualification.status)}</span>
                    </div>
                    <div className="border-b border-gray-200"></div>
                    
                    <div className="grid grid-cols-2 gap-2 items-center">
                      <span className="text-sm text-gray-600 font-medium flex items-center space-x-2">
                        <Check theme="outline" size="14" className="text-secondary" />
                        <span>创建时间</span>
                      </span>
                      <span className="text-right text-gray-800">
                        {new Date(qualification.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">无法加载资格信息</div>
                )}
              </div>
            </div>
            
            <div className="card card-border bg-base-100 w-full h-full shadow-md">
              <h2 className="card-title bg-secondary/55 rounded-t-lg p-3"><Info theme="outline" size="18" />操作提示</h2>
              <div className="card-body">
                <ul className="space-y-1 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-secondary mr-2">•</span>
                    <span>教师和课程信息不可修改</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-secondary mr-2">•</span>
                    <span>资格等级分为初级、中级和高级</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-secondary mr-2">•</span>
                    <span>主讲教师拥有课程的主要授课权限</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-secondary mr-2">•</span>
                    <span>编辑操作不会改变资格的审核状态</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 