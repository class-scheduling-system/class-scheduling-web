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

import React, { useEffect, useState } from 'react';
import { Skeleton, message, Modal } from 'antd';
import { Book, Search } from '@icon-park/react';
import { GetSemesterListAPI } from '../../apis/semester_api';
import { CardComponent } from '../../components/card_component';

// 课程选择状态类型
type CourseSelectionStatus = {
  [courseId: string]: boolean;
};

// 课程信息类型
interface CourseInfo {
  id: string;
  name: string;
  courseId: string;
  credit: number;
  instructor: string;
  department: string;
  time: string;
  location: string;
  capacity: number;
  enrolled: number;
  description: string;
  type: '必修' | '选修' | '通识';
}

const StudentCourse: React.FC = () => {
  // 使用状态管理页面数据和UI状态
  const [loading, setLoading] = useState<boolean>(true);
  const [semesters, setSemesters] = useState<{ id: string; name: string }[]>([]);
  const [currentSemester, setCurrentSemester] = useState<string>('');
  const [courses, setCourses] = useState<CourseInfo[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [courseType, setCourseType] = useState<string>('全部');
  const [selectedCount, setSelectedCount] = useState<number>(0);
  const [selectionStatus, setSelectionStatus] = useState<CourseSelectionStatus>({});
  const [currentCourse, setCurrentCourse] = useState<CourseInfo | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  // 页面加载时获取学期列表
  useEffect(() => {
    document.title = '选课系统';
    
    // 获取学期列表
    GetSemesterListAPI()
      .then((result) => {
        if (result.code === 200 && result.data) {
          setSemesters(result.data);
          if (result.data.length > 0) {
            setCurrentSemester(result.data[0].id);
          }
        } else {
          message.error('获取学期列表失败');
        }
      })
      .catch(() => {
        message.error('获取学期列表失败');
      });
      
    // 模拟获取课程数据
    setTimeout(() => {
      const mockCourses: CourseInfo[] = [
        {
          id: '1',
          name: '计算机网络',
          courseId: 'CS301',
          credit: 3,
          instructor: '张教授',
          department: '计算机学院',
          time: '周一 1-2节, 周三 3-4节',
          location: '教学楼A-101',
          capacity: 120,
          enrolled: 95,
          description: '本课程介绍计算机网络的基本概念、体系结构和协议等内容。',
          type: '必修'
        },
        {
          id: '2',
          name: '操作系统',
          courseId: 'CS302',
          credit: 4,
          instructor: '李教授',
          department: '计算机学院',
          time: '周二 3-4节, 周四 1-2节',
          location: '教学楼B-202',
          capacity: 100,
          enrolled: 85,
          description: '本课程介绍操作系统的基本概念、进程管理、内存管理和文件系统等内容。',
          type: '必修'
        },
        {
          id: '3',
          name: '数据库系统',
          courseId: 'CS303',
          credit: 3,
          instructor: '王教授',
          department: '计算机学院',
          time: '周一 5-6节, 周三 7-8节',
          location: '教学楼C-303',
          capacity: 150,
          enrolled: 120,
          description: '本课程介绍数据库系统的基本概念、关系模型和SQL语言等内容。',
          type: '必修'
        },
        {
          id: '4',
          name: '软件工程',
          courseId: 'CS304',
          credit: 3,
          instructor: '赵教授',
          department: '计算机学院',
          time: '周二 5-6节, 周四 3-4节',
          location: '教学楼A-201',
          capacity: 80,
          enrolled: 65,
          description: '本课程介绍软件工程的基本概念、需求分析和软件设计等内容。',
          type: '必修'
        },
        {
          id: '5',
          name: '人工智能',
          courseId: 'CS401',
          credit: 3,
          instructor: '刘教授',
          department: '计算机学院',
          time: '周一 7-8节, 周五 5-6节',
          location: '科技楼A-401',
          capacity: 60,
          enrolled: 58,
          description: '本课程介绍人工智能的基本概念、搜索算法和机器学习等内容。',
          type: '选修'
        },
        {
          id: '6',
          name: '大学英语',
          courseId: 'EN201',
          credit: 2,
          instructor: '陈教授',
          department: '外语学院',
          time: '周三 1-2节',
          location: '文科楼B-301',
          capacity: 200,
          enrolled: 180,
          description: '本课程旨在提高学生的英语听说读写能力。',
          type: '通识'
        }
      ];
      
      setCourses(mockCourses);
      setLoading(false);
    }, 1000);
  }, []);

  // 根据搜索关键词和课程类型筛选课程
  const filteredCourses = courses.filter((course) => {
    const matchesKeyword = searchKeyword === '' || 
      course.name.toLowerCase().includes(searchKeyword.toLowerCase()) || 
      course.courseId.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchKeyword.toLowerCase());
    
    const matchesType = courseType === '全部' || course.type === courseType;
    
    return matchesKeyword && matchesType;
  });

  // 处理选择学期变更
  const handleSemesterChange = (semesterId: string) => {
    setCurrentSemester(semesterId);
    setLoading(true);
    
    // 模拟加载数据
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  // 处理课程选择/取消选择
  const handleCourseSelection = (courseId: string) => {
    const newStatus = { ...selectionStatus };
    
    // 切换选课状态
    if (newStatus[courseId]) {
      newStatus[courseId] = false;
      setSelectedCount(selectedCount - 1);
    } else {
      // 检查已选课程数量限制
      if (selectedCount >= 6) {
        message.warning('最多只能选择6门课程');
        return;
      }
      
      newStatus[courseId] = true;
      setSelectedCount(selectedCount + 1);
    }
    
    setSelectionStatus(newStatus);
    
    // 显示提示信息
    if (newStatus[courseId]) {
      message.success(`成功选择课程: ${courses.find(c => c.id === courseId)?.name}`);
    } else {
      message.success(`已取消选择课程: ${courses.find(c => c.id === courseId)?.name}`);
    }
  };

  // 查看课程详情
  const viewCourseDetail = (course: CourseInfo) => {
    setCurrentCourse(course);
    setIsModalVisible(true);
  };

  // 提交选课结果
  const submitCourseSelection = () => {
    if (selectedCount === 0) {
      message.warning('请至少选择一门课程');
      return;
    }
    
    // 获取已选课程列表
    const selectedCourses = courses.filter(course => selectionStatus[course.id]);
    
    // 模拟提交选课请求
    message.loading('正在提交选课结果...', 1.5)
      .then(() => {
        console.log('已选课程:', selectedCourses);
        message.success('选课成功！已选择 ' + selectedCount + ' 门课程');
      });
  };

  return (
    <div className="container px-4 py-6 mx-auto">
      {/* 页面标题 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary mb-2">学生选课系统</h1>
        <div className="text-sm text-gray-500 flex items-center gap-1">
          <Book theme="outline" size="16" />
          <span>当前选课：{selectedCount}/6 门课程</span>
        </div>
      </div>

      {/* 筛选与搜索区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <CardComponent className="lg:col-span-2">
          <div className="p-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              {/* 学期选择 */}
              <div className="flex-1">
                <label className="label">
                  <span className="label-text font-medium text-base">学期</span>
                </label>
                <select 
                  className="select select-bordered w-full"
                  value={currentSemester}
                  onChange={(e) => handleSemesterChange(e.target.value)}
                  disabled={loading}
                >
                  {semesters.map((semester) => (
                    <option key={semester.id} value={semester.id}>
                      {semester.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* 课程类型筛选 */}
              <div className="flex-1">
                <label className="label">
                  <span className="label-text font-medium text-base">课程类型</span>
                </label>
                <select 
                  className="select select-bordered w-full"
                  value={courseType}
                  onChange={(e) => setCourseType(e.target.value)}
                  disabled={loading}
                >
                  <option value="全部">全部</option>
                  <option value="必修">必修</option>
                  <option value="选修">选修</option>
                  <option value="通识">通识</option>
                </select>
              </div>
              
              {/* 搜索框 */}
              <div className="flex-1">
                <label className="label">
                  <span className="label-text font-medium text-base">搜索课程</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className="input input-bordered w-full pl-10"
                    placeholder="课程名称/编号/教师"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    disabled={loading}
                  />
                  <Search className="absolute left-3 top-3" theme="outline" size="20" />
                </div>
              </div>
            </div>
          </div>
        </CardComponent>
        
        {/* 提交选课按钮 */}
        <CardComponent>
          <div className="p-4 h-full flex flex-col justify-center">
            <button 
              className="btn btn-primary w-full"
              onClick={submitCourseSelection}
              disabled={selectedCount === 0 || loading}
            >
              提交选课 ({selectedCount}/6)
            </button>
          </div>
        </CardComponent>
      </div>

      {/* 课程列表 */}
      <div className="mb-6">
        <CardComponent>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-6">
                <Skeleton active paragraph={{ rows: 6 }} />
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className="p-10 text-center text-gray-500">
                没有找到符合条件的课程
              </div>
            ) : (
              <table className="table table-zebra w-full">
                <thead>
                  <tr className="bg-base-200">
                    <th className="text-center">选择</th>
                    <th>课程编号</th>
                    <th>课程名称</th>
                    <th>课程类型</th>
                    <th>学分</th>
                    <th>授课教师</th>
                    <th>上课时间</th>
                    <th>已选/总容量</th>
                    <th className="text-center">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCourses.map((course) => (
                    <tr key={course.id} className="hover">
                      <td className="text-center">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-primary"
                          checked={selectionStatus[course.id] || false}
                          onChange={() => handleCourseSelection(course.id)}
                          disabled={course.enrolled >= course.capacity && !selectionStatus[course.id]}
                        />
                      </td>
                      <td>
                        <span className="font-mono">{course.courseId}</span>
                      </td>
                      <td>
                        <span className="font-medium">{course.name}</span>
                      </td>
                      <td>
                        <div className="badge badge-sm" 
                          style={{ 
                            backgroundColor: course.type === '必修' ? '#e11d48' : 
                                            course.type === '选修' ? '#0891b2' : '#84cc16',
                            color: 'white'
                          }}
                        >
                          {course.type}
                        </div>
                      </td>
                      <td>{course.credit}</td>
                      <td>{course.instructor}</td>
                      <td className="max-w-[180px] truncate">{course.time}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <span className={course.enrolled >= course.capacity ? 'text-error' : ''}>
                            {course.enrolled}/{course.capacity}
                          </span>
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                course.enrolled / course.capacity < 0.7 ? 'bg-success' :
                                course.enrolled / course.capacity < 0.9 ? 'bg-warning' : 'bg-error'
                              }`}
                              style={{ width: `${(course.enrolled / course.capacity) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="text-center">
                        <button 
                          className="btn btn-sm btn-ghost btn-circle"
                          onClick={() => viewCourseDetail(course)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </CardComponent>
      </div>

      {/* 选课说明 */}
      <CardComponent>
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-3">选课说明</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <p>1. 选课时间：2023年9月1日至9月10日</p>
            <p>2. 每位学生本学期最多可选择6门课程</p>
            <p>3. 必修课程为专业要求课程，建议优先选择</p>
            <p>4. 已满员课程无法选择，请关注退课动态</p>
            <p>5. 选课结果提交后，可在开学两周内申请退课</p>
          </div>
        </div>
      </CardComponent>

      {/* 课程详情模态框 */}
      <Modal
        title={currentCourse?.name}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <button 
            key="cancel" 
            className="btn btn-sm btn-ghost" 
            onClick={() => setIsModalVisible(false)}
          >
            关闭
          </button>,
          <button
            key="select"
            className={`btn btn-sm ${selectionStatus[currentCourse?.id || ''] ? 'btn-error' : 'btn-primary'}`}
            onClick={() => {
              if (currentCourse) {
                handleCourseSelection(currentCourse.id);
                setIsModalVisible(false);
              }
            }}
            disabled={currentCourse?.enrolled >= (currentCourse?.capacity || 0) && !selectionStatus[currentCourse?.id || '']}
          >
            {selectionStatus[currentCourse?.id || ''] ? '取消选择' : '选择课程'}
          </button>
        ]}
        width={700}
      >
        {currentCourse && (
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 mb-1">课程编号</p>
                <p className="font-mono">{currentCourse.courseId}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">课程类型</p>
                <div className="badge" 
                  style={{ 
                    backgroundColor: currentCourse.type === '必修' ? '#e11d48' : 
                                    currentCourse.type === '选修' ? '#0891b2' : '#84cc16',
                    color: 'white'
                  }}
                >
                  {currentCourse.type}
                </div>
              </div>
              <div>
                <p className="text-gray-500 mb-1">学分</p>
                <p>{currentCourse.credit}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">开课学院</p>
                <p>{currentCourse.department}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">授课教师</p>
                <p>{currentCourse.instructor}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">上课地点</p>
                <p>{currentCourse.location}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-500 mb-1">上课时间</p>
                <p>{currentCourse.time}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-500 mb-1">课程容量</p>
                <div className="flex items-center gap-3">
                  <span className={currentCourse.enrolled >= currentCourse.capacity ? 'text-error' : ''}>
                    {currentCourse.enrolled}/{currentCourse.capacity}
                  </span>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        currentCourse.enrolled / currentCourse.capacity < 0.7 ? 'bg-success' :
                        currentCourse.enrolled / currentCourse.capacity < 0.9 ? 'bg-warning' : 'bg-error'
                      }`}
                      style={{ width: `${(currentCourse.enrolled / currentCourse.capacity) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <p className="text-gray-500 mb-1">课程描述</p>
              <p className="bg-base-200 p-3 rounded text-sm">{currentCourse.description}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StudentCourse; 