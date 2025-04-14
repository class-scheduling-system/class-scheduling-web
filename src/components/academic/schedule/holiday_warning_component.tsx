import React from 'react';
import { Alert, Table } from 'antd';
import { Info } from '@icon-park/react';
import { HolidayInfo, getHolidayInfo, isHoliday, getDateByWeekAndDay, ALL_HOLIDAYS, getWeekAndDayFromDate } from '../../../services/holiday_service';

interface HolidayWarningProps {
  dates: string[];
  onlyShowIfConflict?: boolean;
  semesterStartDate?: string; // 添加学期开始日期参数，用于计算周次和星期
}

interface HolidayConflict {
  date: string;
  holiday: HolidayInfo;
  weekInfo?: {
    week: number;
    dayOfWeek: number;
  };
}

// 获取星期几的中文名称
const getDayOfWeekName = (day: number): string => {
  const dayNames = ["", "周一", "周二", "周三", "周四", "周五", "周六", "周日"];
  return dayNames[day] || "未知";
};

/**
 * 节假日冲突警告组件
 * 显示排课时间与法定节假日的冲突警告
 */
export const HolidayWarningComponent: React.FC<HolidayWarningProps> = ({ 
  dates,
  onlyShowIfConflict = false,
  semesterStartDate
}) => {
  console.log("HolidayWarningComponent 接收到的日期:", dates);
  console.log("学期开始日期:", semesterStartDate);
  
  // 查找所有与节假日冲突的日期
  const conflicts: HolidayConflict[] = dates
    .filter(date => {
      const isHolidayDate = isHoliday(date);
      console.log(`检查日期 ${date}: ${isHolidayDate ? '是节假日' : '不是节假日'}`);
      return isHolidayDate;
    })
    .map(date => {
      const holiday = getHolidayInfo(date);
      console.log(`节假日信息 ${date}:`, holiday);
      
      // 如果提供了学期开始日期，计算周次和星期几
      let weekInfo = undefined;
      if (semesterStartDate) {
        try {
          weekInfo = getWeekAndDayFromDate(semesterStartDate, date);
          console.log(`日期 ${date} 对应第${weekInfo.week}周 ${getDayOfWeekName(weekInfo.dayOfWeek)}`);
        } catch (error) {
          console.error(`计算日期 ${date} 的周次和星期时出错:`, error);
        }
      }
      
      return { date, holiday: holiday!, weekInfo };
    });
  
  console.log("检测到的假日冲突:", conflicts.length, conflicts);
  
  // 如果没有冲突且设置为仅在冲突时显示，则不渲染任何内容
  if (conflicts.length === 0 && onlyShowIfConflict) {
    return null;
  }
  
  // 表格列定义
  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      width: 60,
    },
    {
      title: '节假日',
      dataIndex: 'holiday',
      key: 'holiday',
      render: (text: string) => <span className="font-medium text-warning">{text}</span>,
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: '课程信息',
      dataIndex: 'courseInfo',
      key: 'courseInfo',
      render: (text: string) => <span className="font-medium">{text}</span>,
    },
  ];
  
  // 准备表格数据
  const tableData = conflicts.map((conflict, index) => {
    // 准备课程信息字符串
    let courseInfo = "未知";
    if (conflict.weekInfo) {
      courseInfo = `第${conflict.weekInfo.week}周 ${getDayOfWeekName(conflict.weekInfo.dayOfWeek)}`;
    }
    
    return {
      key: index,
      index: index + 1,
      holiday: conflict.holiday.name,
      date: conflict.date,
      courseInfo: courseInfo,
    };
  });
  
  return (
    <div className="mt-4">
      {conflicts.length > 0 ? (
        <Alert
          type="warning"
          showIcon
          icon={<Info theme="filled" size="20" className="text-warning mt-0.5" />}
          message="排课与法定节假日冲突"
          description={
            <div className="text-sm">
              <p>以下排课时间与法定节假日冲突：</p>
              <div className="mt-2 border rounded-md overflow-hidden">
                <Table 
                  dataSource={tableData} 
                  columns={columns} 
                  pagination={false}
                  size="small"
                  className="holiday-conflict-table"
                />
              </div>
              <p className="mt-2 text-orange-500 font-medium">请考虑调整排课时间，避免在法定假期安排课程。</p>
            </div>
          }
        />
      ) : (
        <Alert
          type="info"
          showIcon
          message="排课日期信息"
          description={
            <div className="text-sm">
              <p>已检查 {dates.length} 个日期，未发现节假日冲突。</p>
              <p className="text-xs text-base-content/70 mt-1">
                检查的日期: {dates.slice(0, 5).join(', ')}{dates.length > 5 ? '...' : ''}
              </p>
              <p className="text-xs text-base-content/70 mt-1">
                节假日总数: {ALL_HOLIDAYS.length} 个
              </p>
            </div>
          }
        />
      )}
    </div>
  );
};

/**
 * 检查时间段是否与法定节假日冲突
 * 用于在组件外部使用，不需要渲染组件时可直接调用此函数
 * 
 * @param semesterStartDate 学期开始日期
 * @param timeSlots 时间段数组，包含周次和星期
 * @returns 冲突的日期数组
 */
export function checkHolidayConflicts(
  semesterStartDate: string,
  timeSlots: { week_numbers: number[], day_of_week: number }[]
): HolidayConflict[] {
  console.log("检查节假日冲突，学期开始日期:", semesterStartDate);
  console.log("时间槽数据:", timeSlots);
  
  if (!semesterStartDate || !timeSlots || timeSlots.length === 0) {
    console.log("没有有效的学期开始日期或时间槽数据");
    return [];
  }
  
  // 将学期开始日期标准化为YYYY-MM-DD格式
  let standardSemesterStartDate = semesterStartDate;
  if (typeof semesterStartDate === 'string' && !/^\d{4}-\d{2}-\d{2}$/.test(semesterStartDate)) {
    try {
      // 尝试转换时间戳为日期字符串
      const timestamp = Number(semesterStartDate);
      if (!isNaN(timestamp)) {
        standardSemesterStartDate = new Date(timestamp).toISOString().split('T')[0];
        console.log("转换时间戳为日期:", standardSemesterStartDate);
      }
    } catch (e) {
      console.error("学期开始日期格式转换错误:", e);
    }
  }
  
  const conflicts: HolidayConflict[] = [];
  
  // 检查每个时间段
  timeSlots.forEach((slot, slotIndex) => {
    console.log(`检查时间槽 #${slotIndex+1}:`, slot);
    
    if (!slot.week_numbers || slot.week_numbers.length === 0) {
      console.log(`时间槽 #${slotIndex+1} 没有周次数据`);
      return;
    }
    
    // 检查该时间段的每一周
    slot.week_numbers.forEach(week => {
      try {
        // 根据学期开始日期、周次和星期计算具体日期
        const date = getDateByWeekAndDay(String(standardSemesterStartDate), week, slot.day_of_week);
        console.log(`第${week}周星期${slot.day_of_week} -> ${date}`);
        
        // 检查是否是节假日
        if (isHoliday(date)) {
          const holidayInfo = getHolidayInfo(date);
          console.log(`发现假日冲突! ${date}:`, holidayInfo);
          if (holidayInfo) {
            conflicts.push({ 
              date, 
              holiday: holidayInfo,
              weekInfo: {
                week,
                dayOfWeek: slot.day_of_week
              }
            });
          }
        }
      } catch (error) {
        console.error(`计算第${week}周星期${slot.day_of_week}的日期时出错:`, error);
      }
    });
  });
  
  console.log(`总共发现 ${conflicts.length} 个节假日冲突`);
  return conflicts;
} 