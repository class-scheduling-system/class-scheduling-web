import React from "react";
import { Calendar, Delete, Plus } from "@icon-park/react";
import { ScheduleTimeSlot } from "./types";
import { useFormData } from "./form_data_provider";

/**
 * 时间段列表组件
 * 用于管理排课时间段
 */
export const TimeSlotComponent: React.FC = () => {
  const { timeSlots, setTimeSlots } = useFormData();

  // 添加时间段
  const handleAddTimeSlot = () => {
    setTimeSlots([
      ...timeSlots,
      { day_of_week: 1, period_start: 1, period_end: 2, week_numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16] }
    ]);
  };

  // 删除时间段
  const handleRemoveTimeSlot = (index: number) => {
    const newTimeSlots = [...timeSlots];
    newTimeSlots.splice(index, 1);
    setTimeSlots(newTimeSlots);
  };

  // 更新时间段信息
  const handleTimeSlotChange = (index: number, field: keyof ScheduleTimeSlot, value: number | number[]) => {
    const newTimeSlots = [...timeSlots];
    newTimeSlots[index] = { ...newTimeSlots[index], [field]: value };
    setTimeSlots(newTimeSlots);
  };

  return (
    <div className="border border-base-300 rounded-lg p-4 mt-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Calendar theme="outline" size="20" />
          排课时间段
        </h3>
        <button
          type="button"
          className="btn btn-sm btn-primary"
          onClick={handleAddTimeSlot}
        >
          <Plus theme="outline" size="16" />
          添加时间段
        </button>
      </div>

      {timeSlots.length === 0 ? (
        <div className="text-center text-base-content/60 py-8">
          <p>请添加排课时间段</p>
        </div>
      ) : (
        <div className="space-y-4">
          {timeSlots.map((slot, index) => (
            <TimeSlotItem 
              key={index} 
              slot={slot} 
              index={index} 
              onRemove={handleRemoveTimeSlot} 
              onChange={handleTimeSlotChange} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * 单个时间段项组件
 */
interface TimeSlotItemProps {
  slot: ScheduleTimeSlot;
  index: number;
  onRemove: (index: number) => void;
  onChange: (index: number, field: keyof ScheduleTimeSlot, value: number | number[]) => void;
}

const TimeSlotItem: React.FC<TimeSlotItemProps> = ({ slot, index, onRemove, onChange }) => {
  // 渲染周次选择器
  const renderWeekSelector = (currentWeeks: number[]) => {
    const allWeeks = Array.from({ length: 20 }, (_, i) => i + 1);

    return (
      <div className="space-y-2">
        <div className="flex flex-wrap gap-1.5">
          {allWeeks.map(week => (
            <button
              key={week}
              type="button"
              className={`px-2 py-1 text-xs rounded-md transition-colors ${currentWeeks.includes(week)
                ? 'bg-primary text-white'
                : 'bg-base-200 hover:bg-base-300'
                }`}
              onClick={() => {
                const newWeeks = currentWeeks.includes(week)
                  ? currentWeeks.filter(w => w !== week)
                  : [...currentWeeks, week].sort((a, b) => a - b);
                onChange(index, 'week_numbers', newWeeks);
              }}
            >
              {week}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="text-xs text-primary underline"
            onClick={() => onChange(index, 'week_numbers', allWeeks)}
          >
            全选
          </button>
          <button
            type="button"
            className="text-xs text-primary underline"
            onClick={() => onChange(index, 'week_numbers', [])}
          >
            清空
          </button>
          <button
            type="button"
            className="text-xs text-primary underline"
            onClick={() => onChange(index, 'week_numbers', allWeeks.filter(w => w % 2 === 1))}
          >
            单周
          </button>
          <button
            type="button"
            className="text-xs text-primary underline"
            onClick={() => onChange(index, 'week_numbers', allWeeks.filter(w => w % 2 === 0))}
          >
            双周
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="border border-base-200 rounded-lg p-4 bg-base-100/50">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-medium">时间段 #{index + 1}</h4>
        <button
          type="button"
          className="btn btn-sm btn-error"
          onClick={() => onRemove(index)}
        >
          <Delete theme="outline" size="16" />
          删除
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 星期 */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">星期</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={slot.day_of_week}
            onChange={(e) => onChange(index, 'day_of_week', parseInt(e.target.value))}
          >
            <option value={1}>周一</option>
            <option value={2}>周二</option>
            <option value={3}>周三</option>
            <option value={4}>周四</option>
            <option value={5}>周五</option>
            <option value={6}>周六</option>
            <option value={7}>周日</option>
          </select>
        </div>

        {/* 开始节次 */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">开始节次</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={slot.period_start}
            onChange={(e) => {
              const startValue = parseInt(e.target.value);
              onChange(index, 'period_start', startValue);
              if (startValue > slot.period_end) {
                onChange(index, 'period_end', startValue);
              }
            }}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map(num => (
              <option key={num} value={num}>第{num}节</option>
            ))}
          </select>
        </div>

        {/* 结束节次 */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">结束节次</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={slot.period_end}
            onChange={(e) => onChange(index, 'period_end', parseInt(e.target.value))}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1)
              .filter(num => num >= slot.period_start)
              .map(num => (
                <option key={num} value={num}>第{num}节</option>
              ))}
          </select>
        </div>
      </div>

      {/* 周次选择 */}
      <div className="mt-4">
        <label className="label">
          <span className="label-text">授课周次</span>
        </label>
        {renderWeekSelector(slot.week_numbers)}
      </div>
    </div>
  );
}; 