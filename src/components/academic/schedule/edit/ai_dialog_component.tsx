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
  assignmentUuid?: string;
}

/**
 * AI对话组件 - 编辑模式
 * 
 * 用于与AI进行手动排课对话，在编辑模式下使用
 */
export const AiDialogComponent: React.FC<AiDialogComponentProps> = ({ 
  formData, 
  timeSlots, 
  onDataReceived,
  assignmentUuid
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
        remarks: formData.remarks,
        
      };

      // 调用手动排课API
      const response = await ManualSchedulingAPI({
        structured_data: JSON.stringify(classAssignmentDTO),
        current_semester_uuid: semesterUuid,
        ask: userMessage,
        edit: true,
        schedule_uuid: assignmentUuid || ""
      } as ManualSchedulingDTO);

      console.log("AI响应完整数据:", JSON.stringify(response));
      
      if (response?.output === "Success" && response.data) {
        // 记录完整的响应数据以便调试
        console.log("AI响应data字段:", typeof response.data, response.data);
        
        // 处理AI回复
        let aiResponse = '抱歉，我无法处理您的请求。';
        let aiData: AIResponse | AdjustmentResponse | undefined;
        
        try {
          // 解析响应数据，处理多层嵌套的JSON
          let parsedData: Record<string, unknown>;
          
          // 第一层解析：如果响应的data是字符串，尝试解析为JSON
          if (typeof response.data === 'string') {
            try {
              parsedData = JSON.parse(response.data);
              console.log("第一层解析成功:", parsedData);
            } catch (error) {
              console.error("第一层解析失败:", error);
              parsedData = { message: response.data };
            }
          } else {
            parsedData = response.data as Record<string, unknown>;
          }
          
          // 提取消息内容
          if (parsedData.message) {
            aiResponse = parsedData.message as string;
            console.log("提取到AI消息:", aiResponse);
          }
          
          // 第二层解析：如果parsedData.data存在且是字符串，尝试再次解析
          if (parsedData.data) {
            if (typeof parsedData.data === 'string') {
              try {
                const nestedData = JSON.parse(parsedData.data as string);
                console.log("第二层解析成功:", nestedData);
                console.log("嵌套数据结构:", Object.keys(nestedData));
                
                if (nestedData.adjustments) {
                  console.log("调整内容:", nestedData.adjustments);
                }
                
                if (nestedData.data) {
                  console.log("嵌套data内容:", nestedData.data);
                  console.log("嵌套data结构:", Object.keys(nestedData.data));
                }
                
                // 如果嵌套数据有message，优先使用它
                if (nestedData.message) {
                  aiResponse = nestedData.message as string;
                }
                
                // 提取调整数据
                if (nestedData.data) {
                  aiData = nestedData.data as AIResponse | AdjustmentResponse;
                } else {
                  aiData = nestedData as AIResponse | AdjustmentResponse;
                }
              } catch (error) {
                console.error("第二层解析失败:", error);
                // 修复类型错误
                if (typeof parsedData.data === 'object') {
                  aiData = parsedData.data as AIResponse | AdjustmentResponse;
                } else {
                  // 如果数据不是对象类型，不赋值给aiData
                  console.log("无法解析为排课数据:", parsedData.data);
                }
              }
            } else {
              // 如果parsedData.data不是字符串，直接使用
              aiData = parsedData.data as AIResponse | AdjustmentResponse;
            }
          }
          
          // 将AI回复添加到消息列表
          setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
          
          // 记录最终解析出的数据
          console.log("最终解析出的AI数据:", aiData);
          
          // 如果有排课数据，传递给父组件
          if (aiData && typeof aiData === 'object') {
            // 判断是否为调整方案格式
            if ('adjustments' in aiData) {
              // 处理调整方案格式的数据
              const adjustmentData = aiData as AdjustmentResponse;
              console.log("识别到调整方案格式数据:", adjustmentData);
              
              // 转换为标准AIResponse格式
              const convertedData: AIResponse = {};
              
              // 提取调整信息
              if (adjustmentData.adjustments) {
                const adjustments = adjustmentData.adjustments;
                
                // 转换教室和教师ID
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
              
              console.log("转换后的数据:", convertedData);
              
              // 通过回调函数将转换后的数据传递给父组件
              if (onDataReceived && Object.keys(convertedData).length > 0) {
                onDataReceived(convertedData);
                message.success('已收到AI排课调整建议，请查看更新后的表单');
              } else if (Object.keys(convertedData).length === 0) {
                message.info('AI没有提供任何可应用的调整建议');
              }
            } else if ('class_time' in aiData || 'teacher_uuid' in aiData || 'classroom_uuid' in aiData) {
              // 处理标准AIResponse格式的数据
              if (onDataReceived) {
                console.log("传递标准格式数据到父组件:", aiData);
                onDataReceived(aiData as AIResponse);
                message.success('已收到AI排课建议，请查看更新后的表单');
              }
            } else {
              console.log("未识别到可用的排课数据结构");
              message.info('AI提供了回复，但没有可应用的排课调整建议');
            }
          } else {
            console.log("没有解析出有效的排课数据");
            message.info('AI提供了回复，但没有可应用的排课调整建议');
          }
        } catch (error) {
          console.error("处理AI响应时出错:", error);
          setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
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