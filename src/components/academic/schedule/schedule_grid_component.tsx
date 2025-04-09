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

import { CardComponent } from "../../card_component";
import { ScheduleGridCell, ScheduleGridEntity } from "../../../models/entity/schedule_entity";
import { useEffect, useState } from "react";

export function ScheduleGridComponent({
  scheduleData,
  title,
  loading,
  onCellClick
}: {
  scheduleData: ScheduleGridEntity;
  title?: string;
  loading?: boolean;
  onCellClick?: (cell: ScheduleGridCell) => void;
}) {
  const [columns, setColumns] = useState<string[]>([]);
  const [rows, setRows] = useState<string[]>([]);
  const [grid, setGrid] = useState<ScheduleGridCell[][]>([]);
  
  useEffect(() => {
    if (scheduleData) {
      setColumns(scheduleData.columns || ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]);
      setRows(scheduleData.rows || ["第1节", "第2节", "第3节", "第4节", "第5节"]);
      setGrid(scheduleData.grid || Array(rows.length).fill(Array(columns.length).fill({})));
    }
  }, [scheduleData]);
  
  if (loading) {
    return (
      <CardComponent>
        <div className="flex h-full justify-center items-center p-8">
          <span className="loading loading-bars loading-lg"></span>
        </div>
      </CardComponent>
    );
  }
  
  return (
    <CardComponent>
      <div className="p-4 space-y-4">
        {title && <h2 className="text-lg font-bold text-center">{title}</h2>}
        
        <div className="overflow-x-auto">
          <table className="table table-bordered border w-full">
            <thead>
              <tr className="bg-base-200">
                <th className="text-center border-r">时间/星期</th>
                {columns.map((column, index) => (
                  <th key={index} className="text-center p-3 border-l">{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td className="text-center font-medium p-3 bg-base-200 border-r">{row}</td>
                  {columns.map((_, colIndex) => {
                    const cell = grid[rowIndex]?.[colIndex] || {};
                    
                    // 如果单元格被标记为被上面的连堂课占用，则不渲染
                    if (cell.isOccupied) {
                      return null;
                    }
                    
                    return (
                      <td 
                        key={colIndex}
                        rowSpan={cell.rowSpan || 1}
                        className={`border-l p-0 ${cell.courseName ? 'bg-primary/10 hover:bg-primary/20 cursor-pointer' : ''}`}
                        onClick={() => cell.courseName && onCellClick && onCellClick(cell)}
                      >
                        {cell.courseName ? (
                          <div className="p-2 flex flex-col justify-center items-center h-full text-center gap-1">
                            <div className="font-medium">{cell.courseName}</div>
                            {cell.teacherName && <div className="text-sm">{cell.teacherName}</div>}
                            {cell.classroom && <div className="text-xs opacity-80">{cell.classroom}</div>}
                            {cell.weekInfo && (
                              <div className="week-info text-xs opacity-70 line-clamp-1">{cell.weekInfo}</div>
                            )}
                          </div>
                        ) : (
                          <div className="p-4"></div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </CardComponent>
  );
} 