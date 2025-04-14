import React, { useEffect, useState } from "react";
import { Calendar, Delete, Filter, Plus } from "@icon-park/react";
import { ScheduleTimeSlot } from "./types";
import { useFormData } from "./form_data_provider";
import { useData } from "./data_provider";
import { HolidayWarningComponent } from "../holiday_warning_component";
import { isHoliday, getAllDatesFromTimeSlots } from "../../../../services/holiday_service";

/**
 * 时间段列表组件
 * 用于管理排课时间段
 */
export const TimeSlotComponent: React.FC = () => {
  const { timeSlots, setTimeSlots, formData } = useFormData();
  const { semesters } = useData();
  
  // 节假日检查状态
  const [holidayConflictDates, setHolidayConflictDates] = useState<string[]>([]);
  const [showHolidayWarning, setShowHolidayWarning] = useState(false);
  
  // 周次过滤器
  const [weekFilter, setWeekFilter] = useState<number[]>([]);
  const [filterActive, setFilterActive] = useState(false);

  // 添加时间段
  const handleAddTimeSlot = () => {
    const newTimeSlots = [
      ...timeSlots,
      { day_of_week: 1, period_start: 1, period_end: 2, week_numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16] }
    ];
    setTimeSlots(newTimeSlots);
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
  
  // 设置过滤器
  const applyWeekFilter = (weeks: number[]) => {
    setWeekFilter(weeks);
    setFilterActive(weeks.length > 0);
  };
  
  // 清除过滤器
  const clearFilter = () => {
    setWeekFilter([]);
    setFilterActive(false);
  };
  
  // 独立的节假日检查 useEffect
  useEffect(() => {
    if (!formData.semester_uuid || timeSlots.length === 0) {
      setHolidayConflictDates([]);
      setShowHolidayWarning(false);
      return;
    }
    
    try {
      // 获取当前学期信息
      const semester = semesters.find(sem => sem.semester_uuid === formData.semester_uuid);
      if (!semester) {
        setHolidayConflictDates([]);
        setShowHolidayWarning(false);
        return;
      }
      
      // 将学期开始日期从时间戳转换为ISO日期字符串 YYYY-MM-DD
      const semesterStartDate = new Date(semester.start_date).toISOString().split('T')[0];
      console.log("学期开始日期:", semesterStartDate, "原始时间戳:", semester.start_date);
      
      // 使用服务函数获取所有日期
      const allDates = getAllDatesFromTimeSlots(semesterStartDate, timeSlots);
      console.log("计算出的所有日期:", allDates);
      
      setHolidayConflictDates(allDates);
      setShowHolidayWarning(allDates.some(date => isHoliday(date))); 
    } catch (error) {
      console.error("检查节假日冲突出错:", error);
    }
  }, [timeSlots, formData.semester_uuid, semesters]);

  // 过滤后的时间段
  const filteredTimeSlots = React.useMemo(() => {
    if (!filterActive || weekFilter.length === 0) return timeSlots;
    
    return timeSlots.map(slot => {
      // 过滤周次，只保留在过滤器中的周次
      const filteredWeeks = slot.week_numbers.filter(week => weekFilter.includes(week));
      return { ...slot, week_numbers: filteredWeeks };
    });
  }, [timeSlots, weekFilter, filterActive]);

  return (
    <div className="border border-base-300 rounded-lg p-4 mt-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Calendar theme="outline" size="20" />
          排课时间段
          {/* 添加节假日警告指示器 */}
          {holidayConflictDates.filter(date => isHoliday(date)).length > 0 && (
            <span className="badge badge-warning text-xs px-2 font-medium animate-pulse">
              ⚠️ 包含法定节假日
            </span>
          )}
        </h3>
        <div className="flex gap-2">
          <div className="dropdown dropdown-end">
            <button 
              type="button" 
              tabIndex={0} 
              className={`btn btn-sm ${filterActive ? 'btn-secondary' : 'btn-outline'}`}
            >
              <Filter theme="outline" size="16" />
              周次过滤
              {filterActive && <span className="badge badge-sm badge-secondary ml-1">{weekFilter.length}</span>}
            </button>
            <div tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-60 mt-1">
              <div className="p-2">
                <h4 className="font-medium mb-2">选择要显示的周次</h4>
                <WeekFilterSelector 
                  selectedWeeks={weekFilter} 
                  onChange={applyWeekFilter} 
                  onClear={clearFilter}
                />
              </div>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-primary"
            onClick={handleAddTimeSlot}
          >
            <Plus theme="outline" size="16" />
            添加时间段
          </button>
        </div>
      </div>
      
      {/* 节假日冲突警告 */}
      {showHolidayWarning && (
        <div className="mb-4">
          <HolidayWarningComponent 
            dates={holidayConflictDates} 
            semesterStartDate={formData.semester_uuid ? 
              semesters.find(sem => sem.semester_uuid === formData.semester_uuid)?.start_date ?
              new Date(semesters.find(sem => sem.semester_uuid === formData.semester_uuid)!.start_date).toISOString().split('T')[0] : 
              undefined : 
              undefined
            }
          />
        </div>
      )}

      {timeSlots.length === 0 ? (
        <div className="text-center text-base-content/60 py-8">
          <p>请添加排课时间段</p>
        </div>
      ) : (
        <div className="space-y-4">
          {(filterActive ? filteredTimeSlots : timeSlots).map((slot, index) => (
            <TimeSlotItem 
              key={index} 
              slot={slot} 
              index={index} 
              onRemove={handleRemoveTimeSlot} 
              onChange={handleTimeSlotChange} 
              filtered={filterActive}
              originalIndex={timeSlots.indexOf(slot)}
            />
          ))}
          
          {filterActive && filteredTimeSlots.length === 0 && (
            <div className="text-center text-base-content/60 py-8 border border-dashed border-base-300 rounded-lg">
              <p>过滤后没有符合条件的时间段</p>
              <button 
                onClick={clearFilter} 
                className="btn btn-xs btn-outline mt-2"
              >
                清除过滤器
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * 周次过滤器选择器组件
 */
interface WeekFilterSelectorProps {
  selectedWeeks: number[];
  onChange: (weeks: number[]) => void;
  onClear: () => void;
}

const WeekFilterSelector: React.FC<WeekFilterSelectorProps> = ({ selectedWeeks, onChange, onClear }) => {
  const allWeeks = Array.from({ length: 20 }, (_, i) => i + 1);
  
  const handleWeekClick = (week: number) => {
    const newSelection = selectedWeeks.includes(week)
      ? selectedWeeks.filter(w => w !== week)
      : [...selectedWeeks, week].sort((a, b) => a - b);
    
    onChange(newSelection);
  };
  
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1">
        {allWeeks.map(week => (
          <button
            key={week}
            type="button"
            className={`px-2 py-1 text-xs rounded-md transition-colors ${
              selectedWeeks.includes(week)
                ? 'bg-secondary text-white'
                : 'bg-base-200 hover:bg-base-300'
            }`}
            onClick={() => handleWeekClick(week)}
          >
            {week}
          </button>
        ))}
      </div>
      <div className="flex gap-2 justify-between">
        <div className="flex gap-2">
          <button
            type="button"
            className="text-xs text-secondary underline"
            onClick={() => onChange(allWeeks)}
          >
            全选
          </button>
          <button
            type="button"
            className="text-xs text-secondary underline"
            onClick={onClear}
          >
            清空
          </button>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="text-xs text-secondary underline"
            onClick={() => onChange(allWeeks.filter(w => w % 2 === 1))}
          >
            单周
          </button>
          <button
            type="button"
            className="text-xs text-secondary underline"
            onClick={() => onChange(allWeeks.filter(w => w % 2 === 0))}
          >
            双周
          </button>
        </div>
      </div>
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
  filtered?: boolean;
  originalIndex?: number;
}

const TimeSlotItem: React.FC<TimeSlotItemProps> = ({ 
  slot, 
  index, 
  onRemove, 
  onChange, 
  filtered = false,
  originalIndex = index 
}) => {
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
                onChange(originalIndex, 'week_numbers', newWeeks);
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
            onClick={() => onChange(originalIndex, 'week_numbers', allWeeks)}
          >
            全选
          </button>
          <button
            type="button"
            className="text-xs text-primary underline"
            onClick={() => onChange(originalIndex, 'week_numbers', [])}
          >
            清空
          </button>
          <button
            type="button"
            className="text-xs text-primary underline"
            onClick={() => onChange(originalIndex, 'week_numbers', allWeeks.filter(w => w % 2 === 1))}
          >
            单周
          </button>
          <button
            type="button"
            className="text-xs text-primary underline"
            onClick={() => onChange(originalIndex, 'week_numbers', allWeeks.filter(w => w % 2 === 0))}
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
        <h4 className="font-medium flex items-center gap-2">
          时间段 #{originalIndex + 1}
          {filtered && <span className="badge badge-sm badge-secondary">已过滤</span>}
        </h4>
        <button
          type="button"
          className="btn btn-sm btn-error"
          onClick={() => onRemove(originalIndex)}
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