/**
 * 中国法定节假日服务
 * 提供法定节假日数据和相关工具函数
 */

/**
 * 节假日类型定义
 */
export interface HolidayInfo {
  name: string;      // 节假日名称
  date: string;      // 日期 YYYY-MM-DD
  isRestDay: boolean; // 是否为休息日
}

/**
 * 2024年中国法定节假日数据
 * 包含节假日和调休上班数据
 */
export const CHINA_HOLIDAYS_2024: HolidayInfo[] = [
  // 元旦
  { name: "元旦", date: "2024-01-01", isRestDay: true },
  
  // 春节
  { name: "春节调休上班", date: "2024-02-04", isRestDay: false }, // 调休上班
  { name: "春节调休上班", date: "2024-02-18", isRestDay: false }, // 调休上班
  { name: "除夕", date: "2024-02-09", isRestDay: true },
  { name: "春节", date: "2024-02-10", isRestDay: true },
  { name: "春节", date: "2024-02-11", isRestDay: true },
  { name: "春节", date: "2024-02-12", isRestDay: true },
  { name: "春节", date: "2024-02-13", isRestDay: true },
  { name: "春节", date: "2024-02-14", isRestDay: true },
  { name: "春节", date: "2024-02-15", isRestDay: true },
  { name: "春节", date: "2024-02-16", isRestDay: true },
  { name: "春节", date: "2024-02-17", isRestDay: true },
  
  // 清明节
  { name: "清明节调休上班", date: "2024-03-31", isRestDay: false }, // 调休上班
  { name: "清明节", date: "2024-04-04", isRestDay: true },
  { name: "清明节", date: "2024-04-05", isRestDay: true },
  { name: "清明节", date: "2024-04-06", isRestDay: true },
  
  // 劳动节
  { name: "劳动节调休上班", date: "2024-04-28", isRestDay: false }, // 调休上班
  { name: "劳动节调休上班", date: "2024-05-11", isRestDay: false }, // 调休上班
  { name: "劳动节", date: "2024-05-01", isRestDay: true },
  { name: "劳动节", date: "2024-05-02", isRestDay: true },
  { name: "劳动节", date: "2024-05-03", isRestDay: true },
  { name: "劳动节", date: "2024-05-04", isRestDay: true },
  { name: "劳动节", date: "2024-05-05", isRestDay: true },
  
  // 端午节
  { name: "端午节", date: "2024-06-08", isRestDay: true },
  { name: "端午节", date: "2024-06-09", isRestDay: true },
  { name: "端午节", date: "2024-06-10", isRestDay: true },
  
  // 中秋节
  { name: "中秋节", date: "2024-09-15", isRestDay: true },
  { name: "中秋节", date: "2024-09-16", isRestDay: true },
  { name: "中秋节", date: "2024-09-17", isRestDay: true },
  
  // 国庆节
  { name: "国庆节调休上班", date: "2024-09-29", isRestDay: false }, // 调休上班
  { name: "国庆节调休上班", date: "2024-10-12", isRestDay: false }, // 调休上班
  { name: "国庆节", date: "2024-10-01", isRestDay: true },
  { name: "国庆节", date: "2024-10-02", isRestDay: true },
  { name: "国庆节", date: "2024-10-03", isRestDay: true },
  { name: "国庆节", date: "2024-10-04", isRestDay: true },
  { name: "国庆节", date: "2024-10-05", isRestDay: true },
  { name: "国庆节", date: "2024-10-06", isRestDay: true },
  { name: "国庆节", date: "2024-10-07", isRestDay: true },
];

/**
 * 2025年中国法定节假日数据（预测）
 * 注意：此数据为预测数据，实际假期安排以国务院发布的官方通知为准
 * 包含节假日和可能的调休上班日
 */
export const CHINA_HOLIDAYS_2025: HolidayInfo[] = [
  // 元旦
  { name: "元旦", date: "2025-01-01", isRestDay: true },
  
  // 春节（农历正月初一：2025年1月29日）
  { name: "春节调休上班", date: "2025-01-26", isRestDay: false }, // 调休上班（预测）
  { name: "春节调休上班", date: "2025-02-09", isRestDay: false }, // 调休上班（预测）
  { name: "除夕", date: "2025-01-28", isRestDay: true },
  { name: "春节", date: "2025-01-29", isRestDay: true },
  { name: "春节", date: "2025-01-30", isRestDay: true },
  { name: "春节", date: "2025-01-31", isRestDay: true },
  { name: "春节", date: "2025-02-01", isRestDay: true },
  { name: "春节", date: "2025-02-02", isRestDay: true },
  { name: "春节", date: "2025-02-03", isRestDay: true },
  { name: "春节", date: "2025-02-04", isRestDay: true },
  
  // 清明节（2025年4月4日）
  { name: "清明节调休上班", date: "2025-03-30", isRestDay: false }, // 调休上班（预测）
  { name: "清明节", date: "2025-04-04", isRestDay: true },
  { name: "清明节", date: "2025-04-05", isRestDay: true },
  { name: "清明节", date: "2025-04-06", isRestDay: true },
  
  // 劳动节
  { name: "劳动节调休上班", date: "2025-04-27", isRestDay: false }, // 调休上班（预测）
  { name: "劳动节调休上班", date: "2025-05-11", isRestDay: false }, // 调休上班（预测）
  { name: "劳动节", date: "2025-05-01", isRestDay: true },
  { name: "劳动节", date: "2025-05-02", isRestDay: true },
  { name: "劳动节", date: "2025-05-03", isRestDay: true },
  { name: "劳动节", date: "2025-05-04", isRestDay: true },
  { name: "劳动节", date: "2025-05-05", isRestDay: true },
  
  // 端午节（农历五月初五：2025年5月31日）
  { name: "端午节", date: "2025-05-31", isRestDay: true },
  { name: "端午节", date: "2025-06-01", isRestDay: true },
  { name: "端午节", date: "2025-06-02", isRestDay: true },
  
  // 中秋节（农历八月十五：2025年9月6日）
  { name: "中秋节", date: "2025-09-06", isRestDay: true },
  { name: "中秋节", date: "2025-09-07", isRestDay: true },
  { name: "中秋节", date: "2025-09-08", isRestDay: true },
  
  // 国庆节
  { name: "国庆节调休上班", date: "2025-09-28", isRestDay: false }, // 调休上班（预测）
  { name: "国庆节调休上班", date: "2025-10-12", isRestDay: false }, // 调休上班（预测）
  { name: "国庆节", date: "2025-10-01", isRestDay: true },
  { name: "国庆节", date: "2025-10-02", isRestDay: true },
  { name: "国庆节", date: "2025-10-03", isRestDay: true },
  { name: "国庆节", date: "2025-10-04", isRestDay: true },
  { name: "国庆节", date: "2025-10-05", isRestDay: true },
  { name: "国庆节", date: "2025-10-06", isRestDay: true },
  { name: "国庆节", date: "2025-10-07", isRestDay: true },
];

/**
 * 所有支持年份的节假日数据合集
 */
export const ALL_HOLIDAYS: HolidayInfo[] = [
  ...CHINA_HOLIDAYS_2024,
  ...CHINA_HOLIDAYS_2025
];

/**
 * 检查指定日期是否为法定节假日
 * @param date 日期字符串 (YYYY-MM-DD) 或 Date 对象
 * @returns 是否为休息日的节假日
 */
export function isHoliday(date: string | Date): boolean {
  // 标准化日期格式
  let dateStr: string;
  if (date instanceof Date) {
    dateStr = date.toISOString().split('T')[0];
  } else if (typeof date === 'string') {
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      dateStr = date;
    } else {
      // 尝试解析其他格式的日期字符串
      try {
        dateStr = new Date(date).toISOString().split('T')[0];
      } catch (e) {
        console.error(`无法解析日期字符串: ${date}`, e);
        return false;
      }
    }
  } else {
    console.error(`无效的日期类型: ${typeof date}`);
    return false;
  }
  
  // 检查日期是否在节假日列表中
  const match = ALL_HOLIDAYS.find(
    holiday => holiday.date === dateStr && holiday.isRestDay
  );
  
  console.log(`检查日期是否为假日: ${dateStr} -> ${match ? `是(${match.name})` : '否'}`);
  return !!match;
}

/**
 * 检查指定日期是否为调休工作日
 * @param date 日期字符串 (YYYY-MM-DD) 或 Date 对象
 * @returns 是否为调休工作日
 */
export function isWorkday(date: string | Date): boolean {
  const dateStr = date instanceof Date ? 
    date.toISOString().split('T')[0] : 
    date;
  
  // 判断是否为调休工作日
  const isAdjustedWorkday = ALL_HOLIDAYS.some(
    holiday => holiday.date === dateStr && !holiday.isRestDay
  );
  
  if (isAdjustedWorkday) {
    return true;
  }
  
  // 判断是否为普通工作日（周一至周五）
  if (date instanceof Date) {
    const day = date.getDay();
    return day >= 1 && day <= 5; // 1代表周一，5代表周五
  } else {
    const parsedDate = new Date(date);
    const day = parsedDate.getDay();
    return day >= 1 && day <= 5;
  }
}

/**
 * 根据周数和星期获取具体日期
 * @param semesterStartDate 学期开始日期 (YYYY-MM-DD)，假设为学期第一周的周一
 * @param week 周数
 * @param dayOfWeek 星期几 (1-7，1代表周一)
 * @returns 具体日期 (YYYY-MM-DD)
 */
export function getDateByWeekAndDay(semesterStartDate: string, week: number, dayOfWeek: number): string {
  // 学期开始日期就是第一周周一
  const startDate = new Date(semesterStartDate);
  
  // 计算目标周的目标日期：(周数-1)*7天 + (星期几-1)天
  // 例如：第2周周三 = 开始日期 + (2-1)*7 + (3-1) = 开始日期 + 7 + 2 = 开始日期 + 9天
  const targetDate = new Date(startDate);
  targetDate.setDate(startDate.getDate() + (week - 1) * 7 + (dayOfWeek - 1));
  
  return targetDate.toISOString().split('T')[0];
}

/**
 * 获取给定日期的节假日信息
 * @param date 日期字符串 (YYYY-MM-DD) 或 Date 对象
 * @returns 节假日信息或null
 */
export function getHolidayInfo(date: string | Date): HolidayInfo | null {
  // 标准化日期格式
  let dateStr: string;
  if (date instanceof Date) {
    dateStr = date.toISOString().split('T')[0];
  } else if (typeof date === 'string') {
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      dateStr = date;
    } else {
      // 尝试解析其他格式的日期字符串
      try {
        dateStr = new Date(date).toISOString().split('T')[0];
      } catch (e) {
        console.error(`无法解析日期字符串: ${date}`, e);
        return null;
      }
    }
  } else {
    console.error(`无效的日期类型: ${typeof date}`);
    return null;
  }
  
  // 在节假日数据中查找
  const holiday = ALL_HOLIDAYS.find(h => h.date === dateStr);
  
  if (holiday) {
    console.log(`找到节假日信息: ${dateStr} -> ${holiday.name}`);
  }
  
  return holiday || null;
}

/**
 * 获取指定学期中某周次的所有日期
 * @param semesterStartDate 学期开始日期 (YYYY-MM-DD)，假设为学期第一周的周一
 * @param weekNumber 周次
 * @returns 该周的7天日期数组，格式为YYYY-MM-DD
 */
export function getWeekDatesInSemester(semesterStartDate: string, weekNumber: number): string[] {
  // 学期开始日期就是第一周周一
  const startDate = new Date(semesterStartDate);
  
  // 计算目标周的周一
  const targetWeekMonday = new Date(startDate);
  targetWeekMonday.setDate(startDate.getDate() + (weekNumber - 1) * 7);
  
  // 生成该周的每一天日期
  const weekDates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(targetWeekMonday);
    currentDate.setDate(targetWeekMonday.getDate() + i);
    weekDates.push(currentDate.toISOString().split('T')[0]);
  }
  
  return weekDates;
}

/**
 * 辅助函数：获取从学期开始日期到指定日期的周数和星期
 * @param semesterStartDate 学期开始日期 (YYYY-MM-DD)，假设为学期第一周的周一
 * @param date 目标日期 (YYYY-MM-DD)
 * @returns {week: number, dayOfWeek: number} 周数和星期几（1-7，1代表周一）
 */
export function getWeekAndDayFromDate(semesterStartDate: string, date: string): {week: number, dayOfWeek: number} {
  const startDate = new Date(semesterStartDate);
  const targetDate = new Date(date);
  
  // 计算两个日期之间的天数差
  const diffTime = targetDate.getTime() - startDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // 计算周数和星期几
  const week = Math.floor(diffDays / 7) + 1;
  const dayOfWeek = (diffDays % 7) + 1;
  
  return { week, dayOfWeek };
}

/**
 * 获取学期中指定周次和天数的所有日期
 * @param semesterStartDate 学期开始日期 (YYYY-MM-DD)，假设为学期第一周的周一
 * @param weekNumbers 周次数组
 * @param dayOfWeek 星期几 (1-7, 1代表周一)
 * @returns 日期数组，格式为YYYY-MM-DD
 */
export function getSpecificDaysInWeeks(semesterStartDate: string, weekNumbers: number[], dayOfWeek: number): string[] {
  if (!weekNumbers || weekNumbers.length === 0 || dayOfWeek < 1 || dayOfWeek > 7) {
    return [];
  }
  
  const dates: string[] = [];
  
  for (const weekNumber of weekNumbers) {
    try {
      // 使用更新后的日期计算逻辑
      const date = getDateByWeekAndDay(semesterStartDate, weekNumber, dayOfWeek);
      dates.push(date);
    } catch (error) {
      console.error(`计算第${weekNumber}周星期${dayOfWeek}的日期时出错:`, error);
    }
  }
  
  return dates;
}

/**
 * 获取指定时间段在学期中对应的所有具体日期
 * @param semesterStartDate 学期开始日期 (YYYY-MM-DD)，假设为学期第一周的周一
 * @param timeSlots 时间段数组，包含周次和星期
 * @returns 所有时间段对应的日期数组
 */
export function getAllDatesFromTimeSlots(
  semesterStartDate: string,
  timeSlots: { week_numbers: number[], day_of_week: number }[]
): string[] {
  if (!semesterStartDate || !timeSlots || timeSlots.length === 0) {
    return [];
  }
  
  const allDates: string[] = [];
  
  for (const slot of timeSlots) {
    if (!slot.week_numbers || slot.week_numbers.length === 0) {
      continue;
    }
    
    // 使用更新后的函数计算日期
    const slotDates = getSpecificDaysInWeeks(
      semesterStartDate,
      slot.week_numbers,
      slot.day_of_week
    );
    
    allDates.push(...slotDates);
  }
  
  // 去重
  return [...new Set(allDates)];
} 