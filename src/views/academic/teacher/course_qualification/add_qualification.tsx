import { useState, useEffect, JSX } from "react";
import { Link, useNavigate } from "react-router";
import { Button, message, Radio, Switch } from "antd";
import { Return, Editor, User, Calendar, Check, Remind, NotebookOne, Info } from "@icon-park/react";
import { SiteInfoEntity } from "../../../../models/entity/site_info_entity.ts";
import { TeacherCourseQualificationDTO } from "../../../../models/dto/teacher_course_qualification_dto.ts";
import { AddTeacherCourseQualificationAPI } from "../../../../apis/teacher_course_qualification_api.ts";
import { GetTeacherListAPI } from "../../../../apis/teacher_api.ts";
import { GetCourseListAPI } from "../../../../apis/course_api.ts";
import { TeacherLiteEntity } from "../../../../models/entity/teacher_lite_entity.ts";
import { CourseLibraryEntity } from "../../../../models/entity/course_library_entity.ts";
import { useSelector } from "react-redux";
import { AcademicAffairsStore } from "@/models/store/academic_affairs_store.ts";

/**
 * 添加教师课程资格组件
 * 
 * 用于添加新的教师课程资格记录
 * 
 * @param site 站点信息
 * @returns 添加教师课程资格页面组件
 */
export function AcademicAddTeacherCourseQualification({ site }: Readonly<{
  site: SiteInfoEntity
}>): JSX.Element {
  const navigate = useNavigate();
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

  // 加载状态
  const [loading, setLoading] = useState<boolean>(false);
  
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

  // 设置页面标题
  useEffect(() => {
    document.title = `添加教师课程资格 | ${site.name ?? "Frontleaves Technology"}`;
  }, [site.name]);

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 表单验证
    if (!formData.teacher_uuid) {
      message.error("请选择教师");
      return;
    }
    
    if (!formData.course_uuid) {
      message.error("请选择课程");
      return;
    }

    if (formData.teach_years < 0) {
      message.error("教授年限不能为负数");
      return;
    }

    setLoading(true);

    try {
      const response = await AddTeacherCourseQualificationAPI(formData);
      
      if (response?.output === "Success") {
        message.success("添加教师课程资格成功");
        navigate("/academic/teacher-course-qualification");
      } else {
        message.error(response?.error_message ?? "添加教师课程资格失败");
      }
    } catch (error) {
      console.error("添加教师课程资格失败", error);
      message.error("添加教师课程资格失败");
    } finally {
      setLoading(false);
    }
  };

  // 重置表单
  const handleReset = () => {
    setFormData({
      teacher_uuid: "",
      course_uuid: "",
      qualification_level: 1,
      is_primary: false,
      teach_years: 1,
      remarks: ""
    });
    setTeacherSearch("");
    setCourseSearch("");
    message.success("表单已重置");
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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center space-x-2">
        <Link to={"/academic/teacher-course-qualification"}>
          <Return theme="outline" size="24"/>
        </Link>
        <h2 className="text-2xl font-bold flex items-center space-x-2">
          <span>添加教师课程资格</span>
        </h2>
      </div>
      <div className="w-full">
        <div className="grid grid-cols-12 gap-x-6">
          <div className="lg:col-span-8 md:col-span-12 sm:col-span-12 flex">
            <div className="card card-border bg-base-100 w-full shadow-md">
              <h2 className="card-title bg-neutral/10 rounded-t-lg p-3"><Editor theme="outline" size="18" />填写教师课程资格信息</h2>
              <div className="card-body">
                <form id="qualification_add" onSubmit={handleSubmit} className="flex flex-col flex-grow space-y-5">
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
                          />
                        </div>
                        <select
                          className="select select-sm select-bordered w-full validator"
                          required
                          value={formData.teacher_uuid}
                          onChange={(e) => setFormData({...formData, teacher_uuid: e.target.value})}
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
                          />
                        </div>
                        <select
                          className="select select-sm select-bordered w-full validator"
                          required
                          value={formData.course_uuid}
                          onChange={(e) => setFormData({...formData, course_uuid: e.target.value})}
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
                      loading={loading}
                    >
                      添加
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 md:col-span-12 sm:col-span-12 flex flex-col space-y-6">
            <div className="card card-border bg-base-100 w-full h-full shadow-md">
              <h2 className="card-title bg-secondary/55 rounded-t-lg p-3"><Info theme="outline" size="18" />操作提示</h2>
              <div className="card-body">
                <ul className="space-y-1 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-secondary mr-2">•</span>
                    <span>教师和课程为必选项</span>
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
                    <span>教授年限指教师已经教授此课程的年数</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-secondary mr-2">•</span>
                    <span>添加的资格记录默认为已审核状态</span>
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