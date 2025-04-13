import React, { useState } from "react";
import { message } from "antd";
import { Robot, Send } from "@icon-park/react";
import { ManualSchedulingAPI } from "../../../../apis/ai_api";
import { ClassAssignmentDTO } from "../../../../models/dto/class_assignment_dto";
import { ManualSchedulingDTO } from "../../../../models/dto/manual_scheduling_dto";

// 定义排课的扩展类型，添加is_elective字段
interface ExtendedClassAssignmentDTO extends Partial<ClassAssignmentDTO> {
  is_elective?: boolean;
}

// 时间段类型
interface ScheduleTimeSlot {
  day_of_week: number;
  period_start: number;
  period_end: number;
  week_numbers: number[];
}

// 表单数据类型
interface ScheduleFormData {
  semester_uuid: string;
  teaching_class_uuid?: string;
  classroom_uuid: string;
  teacher_uuid: string;
  course_uuid: string;
  course_ownership: string;
  credit_hour_type: string;
  teaching_hours: number;
  scheduled_hours: number;
  total_hours: number;
  scheduling_priority: number;
  teaching_campus: string;
  consecutive_sessions: number;
  specified_time?: string;
  remarks?: string;
  administrative_class_uuids?: string[];
  student_count?: number;
  is_elective?: boolean;
}

// 定义API响应类型
interface AIResponse {
  semester_uuid?: string;
  course_uuid?: string;
  teacher_uuid?: string;
  classroom_uuid?: string;
  course_ownership?: string;
  teaching_class_name?: string;
  administrative_class_uuids?: string[];
  student_count?: number;
  credit_hour_type?: string;
  teaching_hours?: number;
  scheduled_hours?: number;
  total_hours?: number;
  scheduling_priority?: number;
  teaching_campus?: string;
  class_time?: Array<{
    day_of_week: number;
    period_start: number;
    period_end: number;
    week_numbers: number[];
  }>;
  consecutive_sessions?: number;
}

// API返回格式
interface AIResponseData {
  output?: string;
  message?: string;
  data?: AIResponse | AdjustmentResponse;
}

// 编辑模式下调整方案的响应格式
interface AdjustmentResponse {
  assignment_id?: string;
  adjustments?: {
    classroom_id?: string;
    teacher_id?: string;
    class_time?: Array<{
      day_of_week: number;
      period_start: number;
      period_end: number;
      week_numbers: number[];
    }>;
    consecutive_sessions?: number;
    scheduling_priority?: number;
  };
  adjust_teaching_class?: {
    teaching_class_uuid?: string;
    teaching_class_code?: string;
    teaching_class_name?: string;
    administrative_class_uuids?: string[];
    actual_student_count?: number;
    description?: string;
  };
  ignore_conflicts?: boolean;
  reason?: string;
}

// 组件属性接口
interface AiDialogComponentProps {
  formData: ScheduleFormData;
  timeSlots: ScheduleTimeSlot[];
  onDataReceived?: (aiData: AIResponse) => void;
}

/**
 * AI对话组件 - 编辑模式
 * 
 * 用于与AI进行手动排课对话，在编辑模式下使用
 */
export const AiDialogComponent: React.FC<AiDialogComponentProps> = ({ 
  formData, 
  timeSlots, 
  onDataReceived 
}) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: '我是你的排课助手，可以帮助你调整当前排课。请告诉我你的需求，我会给你一些建议。' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 发送消息到AI
  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    // 获取当前选择的学期UUID
    const semesterUuid = formData.semester_uuid;
    if (!semesterUuid) {
      message.warning('请先选择学期');
      return;
    }

    // 添加用户消息到对话
    const userMessage = inputMessage.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // 创建一个扩展的ClassAssignmentDTO对象，包含当前表单的所有数据
      const classAssignmentDTO: ExtendedClassAssignmentDTO = {
        semester_uuid: formData.semester_uuid,
        teaching_class_uuid: formData.teaching_class_uuid,
        classroom_uuid: formData.classroom_uuid,
        teacher_uuid: formData.teacher_uuid,
        course_uuid: formData.course_uuid,
        course_ownership: formData.course_ownership,
        credit_hour_type: formData.credit_hour_type,
        teaching_hours: formData.teaching_hours,
        scheduled_hours: formData.scheduled_hours,
        total_hours: formData.total_hours,
        scheduling_priority: formData.scheduling_priority,
        teaching_campus: formData.teaching_campus,
        consecutive_sessions: formData.consecutive_sessions,
        is_elective: formData.is_elective,
        student_count: formData.student_count,
        administrative_class_uuids: formData.administrative_class_uuids,
        class_time: timeSlots,
        remarks: formData.remarks
      };

      // 调用手动排课API
      const response = await ManualSchedulingAPI({
        structured_data: JSON.stringify(classAssignmentDTO),
        current_semester_uuid: semesterUuid,
        ask: userMessage,
        edit: true
      } as ManualSchedulingDTO);

      if (response?.output === "Success" && response.data) {
        // 处理AI回复
        let aiResponse = '抱歉，我无法处理您的请求。';
        let aiData: AIResponse | AdjustmentResponse | undefined;
        
        // 处理嵌套的JSON字符串响应
        try {
          // 尝试解析data字符串为JSON对象
          if (typeof response.data === 'string') {
            // 添加类型断言确保TypeScript识别response.data为字符串类型
            const responseDataStr = response.data as string;
            console.log("AI助手：收到字符串格式响应，尝试解析", 
              responseDataStr.length > 100 ? responseDataStr.substring(0, 100) + "..." : responseDataStr);
            const parsedData = JSON.parse(responseDataStr) as AIResponseData;
            
            // 提取消息
            if (parsedData.message) {
              aiResponse = parsedData.message;
              console.log("AI助手消息:", aiResponse);
            }
            
            // 提取数据
            if (parsedData.data) {
              aiData = parsedData.data;
              console.log("AI助手：解析JSON成功，收到排课数据", aiData);
            }
          } else if (typeof response.data === 'object') {
            // 直接从对象提取数据
            const responseObj = response.data as AIResponseData;
            
            if (responseObj.message) {
              aiResponse = responseObj.message;
            }
            
            if (responseObj.data) {
              aiData = responseObj.data;
            }
          }
        } catch (parseError) {
          console.error("解析AI响应JSON失败:", parseError);
          aiResponse = typeof response.data === 'string' ? response.data : '解析AI响应数据失败';
        }
        
        // 将AI回复添加到消息列表
        setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
        
        // 如果有排课数据，传递给父组件
        if (aiData) {
          console.log("AI助手：准备处理排课数据", aiData);
          
          // 判断是否为调整方案格式
          if ('adjustments' in aiData) {
            // 处理调整方案格式的数据
            const adjustmentData = aiData as AdjustmentResponse;
            console.log("AI助手：识别到调整方案格式数据", adjustmentData);
            
            // 转换为标准AIResponse格式
            const convertedData: AIResponse = {};
            
            // 提取调整信息
            if (adjustmentData.adjustments) {
              const adjustments = adjustmentData.adjustments;
              
              // 转换教室和教师ID (这里需要根据实际情况调整映射关系)
              if (adjustments.classroom_id) {
                convertedData.classroom_uuid = adjustments.classroom_id;
              }
              
              if (adjustments.teacher_id) {
                convertedData.teacher_uuid = adjustments.teacher_id;
              }
              
              // 转换时间段
              if (adjustments.class_time && adjustments.class_time.length > 0) {
                convertedData.class_time = adjustments.class_time;
              }
              
              // 转换其他属性
              if (adjustments.consecutive_sessions !== undefined) {
                convertedData.consecutive_sessions = adjustments.consecutive_sessions;
              }
              
              if (adjustments.scheduling_priority !== undefined) {
                convertedData.scheduling_priority = adjustments.scheduling_priority;
              }
            }
            
            // 提取教学班信息
            if (adjustmentData.adjust_teaching_class) {
              const teachingClass = adjustmentData.adjust_teaching_class;
              
              if (teachingClass.teaching_class_name) {
                convertedData.teaching_class_name = teachingClass.teaching_class_name;
              }
              
              if (teachingClass.administrative_class_uuids) {
                convertedData.administrative_class_uuids = teachingClass.administrative_class_uuids;
              }
              
              if (teachingClass.actual_student_count !== undefined) {
                convertedData.student_count = teachingClass.actual_student_count;
              }
            }
            
            console.log("AI助手：转换后的数据", convertedData);
            
            // 通过回调函数将转换后的数据传递给父组件
            if (onDataReceived && Object.keys(convertedData).length > 0) {
              onDataReceived(convertedData);
              message.success('已收到AI排课调整建议并更新表单');
            } else if (Object.keys(convertedData).length === 0) {
              message.info('AI没有提供任何可应用的调整建议');
            }
          } else {
            // 处理标准AIResponse格式的数据
            // 通过回调函数将数据传递给父组件
            if (onDataReceived) {
              console.log("AI助手：准备通过回调函数传递数据到父组件", aiData);
              onDataReceived(aiData as AIResponse);
              message.success('已收到AI排课建议并更新表单');
            }
          }
        }
      } else {
        // 处理错误响应
        const errorMsg = response?.error_message || '获取AI回复失败';
        message.error(errorMsg);
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: '抱歉，我遇到了一些问题，无法处理您的请求。' 
        }]);
      }
    } catch (error) {
      console.error('AI对话出错:', error);
      message.error('AI对话出错');
      setMessages(prev => [...prev, { role: 'assistant', content: '抱歉，我遇到了一些技术问题。' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card shadow-xl bg-base-100 h-full flex flex-col md:h-[600px] overflow-y-auto">
      <div className="card-body p-4 flex flex-col h-full">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Robot theme="outline" size="20" />
            排课调整助手
          </h3>
        </div>
        
        {/* 消息区域 */}
        <div className="flex-grow overflow-y-auto mb-4 pr-2 space-y-4">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`chat ${msg.role === 'user' ? 'chat-end' : 'chat-start'}`}
            >
              <div className={`chat-bubble ${msg.role === 'user' ? 'chat-bubble-primary' : 'bg-base-200'}`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="chat chat-start">
              <div className="chat-bubble bg-base-200">
                <span className="loading loading-dots loading-sm"></span>
              </div>
            </div>
          )}
        </div>
        
        {/* 输入区域 */}
        <div className="flex items-center">
          <input
            type="text"
            className="input input-bordered flex-grow mr-2"
            placeholder="输入你的排课调整问题..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            disabled={isLoading}
          />
          <button
            className="btn btn-primary"
            onClick={sendMessage}
            disabled={isLoading || !inputMessage.trim()}
          >
            <Send theme="outline" size="18" />
          </button>
        </div>
      </div>
    </div>
  );
}; 