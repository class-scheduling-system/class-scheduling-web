/**
 * 格式化时间段
 * @param startSlot 开始节次
 * @param endSlot 结束节次
 * @returns 格式化后的时间段字符串，如 "第1-3节"
 */
export const formatTimeSlot = (startSlot: number, endSlot: number): string => {
  return `第${startSlot}-${endSlot}节`;
};

/**
 * 格式化时间戳为日期时间字符串
 * @param timestamp 时间戳（毫秒）
 * @returns 格式化后的日期时间字符串
 */
export const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

/**
 * 格式化日期
 * @param timestamp 时间戳（毫秒）
 * @returns 格式化后的日期字符串，如 "2023年12月31日"
 */
export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * 获取当前时间的问候语
 * @returns 根据当前时间返回合适的问候语
 */
export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 6) return '深夜了，注意休息';
  if (hour < 9) return '早上好';
  if (hour < 12) return '上午好';
  if (hour < 14) return '中午好';
  if (hour < 18) return '下午好';
  return '晚上好';
}; 