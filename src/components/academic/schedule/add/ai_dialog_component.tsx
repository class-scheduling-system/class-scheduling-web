import React, { useState } from "react";
import { useFormData } from "./form_data_provider";
import { ManualSchedulingAPI } from "../../../../apis/ai_api";
import { message } from "antd";
import { Robot, Send } from "@icon-park/react";
import { ClassAssignmentDTO } from "../../../../models/dto/class_assignment_dto";
import { ManualSchedulingDTO } from "../../../../models/dto/manual_scheduling_dto";
import { ScheduleFormData } from "./types";

// 定义排课的扩展类型，添加is_elective字段
interface ExtendedClassAssignmentDTO extends Partial<ClassAssignmentDTO> {
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
  data?: AIResponse;
}

// 组件属性接口
interface AiDialogComponentProps {
  onDataReceived?: (data: AIResponse) => void;
}

/**
 * AI对话组件
 * 
 * 用于与AI进行手动排课对话
 */
export const AiDialogComponent: React.FC<AiDialogComponentProps> = ({ onDataReceived }) => {
  const { formData, timeSlots, resetFormData } = useFormData();
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: '我是你的排课助手，可以帮助你进行排课安排。请告诉我你的排课需求，我会给你一些建议。' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 填充表单数据
  const fillFormData = (aiData: AIResponse) => {
    if (!aiData) return;

    // 准备要更新的表单数据
    const updates: Partial<ScheduleFormData> = {};

    // 逐个检查并填充数据
    if (aiData.semester_uuid) updates.semester_uuid = aiData.semester_uuid;
    if (aiData.course_uuid) updates.course_uuid = aiData.course_uuid;
    if (aiData.teacher_uuid) updates.teacher_uuid = aiData.teacher_uuid;
    if (aiData.classroom_uuid) updates.classroom_uuid = aiData.classroom_uuid;
    if (aiData.course_ownership) updates.course_ownership = aiData.course_ownership;
    if (aiData.teaching_class_name) updates.teaching_class_name = aiData.teaching_class_name;
    if (aiData.administrative_class_uuids) updates.administrative_class_uuids = aiData.administrative_class_uuids;
    if (aiData.student_count !== undefined) updates.student_count = aiData.student_count;
    if (aiData.credit_hour_type) updates.credit_hour_type = aiData.credit_hour_type;
    if (aiData.teaching_hours !== undefined) updates.teaching_hours = aiData.teaching_hours;
    if (aiData.scheduled_hours !== undefined) updates.scheduled_hours = aiData.scheduled_hours;
    if (aiData.total_hours !== undefined) updates.total_hours = aiData.total_hours;
    if (aiData.scheduling_priority !== undefined) updates.scheduling_priority = aiData.scheduling_priority;
    if (aiData.teaching_campus) updates.teaching_campus = aiData.teaching_campus;
    if (aiData.consecutive_sessions !== undefined) updates.consecutive_sessions = aiData.consecutive_sessions;

    // 使用resetFormData一次性更新所有数据
    console.log("AI助手：准备重置表单数据", updates);
    const success = resetFormData(updates, aiData.class_time);
    
    if (success) {
      // 显示成功消息
      message.success('已在表单中填充AI排课建议');
    }
  };

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
        teaching_class_name: formData.teaching_class_name,
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
        edit: false
      } as ManualSchedulingDTO);

      if (response?.output === "Success" && response.data) {
        // 处理AI回复
        let aiResponse = '抱歉，我无法处理您的请求。';
        let aiData: AIResponse | undefined;
        
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
        
        // 如果有排课数据，填充到表单
        if (aiData) {
          console.log("AI助手：准备处理排课数据", aiData);
          
          // 首先通过回调函数将数据传递给父组件
          if (onDataReceived) {
            console.log("AI助手：准备通过回调函数传递数据到父组件", aiData);
            onDataReceived(aiData);
          }
          
          // 然后直接填充表单数据
          fillFormData(aiData);
          message.success('已收到AI排课建议并填充到表单');
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
            排课助手
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
            placeholder="输入你的排课问题..."
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