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
import { Copy, Delete, EditTwo, PreviewOpen } from "@icon-park/react";
import { ScheduleEntity } from "../../../models/entity/schedule_entity";

export function ScheduleListComponent({
  schedules,
  onView,
  onEdit,
  onCopy,
  onDelete,
  loading
}: {
  schedules: ScheduleEntity[];
  onView?: (schedule: ScheduleEntity) => void;
  onEdit?: (schedule: ScheduleEntity) => void;
  onCopy?: (schedule: ScheduleEntity) => void;
  onDelete?: (schedule: ScheduleEntity) => void;
  loading?: boolean;
}) {
  
  if (loading) {
    return (
      <CardComponent padding={0} className="flex-1 flex overflow-auto">
        <div className="flex h-full justify-center items-center">
          <span className="loading loading-bars loading-lg"></span>
        </div>
      </CardComponent>
    );
  }
  
  return (
    <CardComponent padding={0} className="flex-1 flex overflow-auto">
      <div className="overflow-x-auto overflow-y-auto w-full">
        <table className="table table-zebra">
          <thead className="sticky top-0 bg-base-100 z-10">
            <tr>
              <th>课程名称</th>
              <th>授课教师</th>
              <th>教室</th>
              <th>时间</th>
              <th>班级</th>
              <th>学期</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {schedules.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-6">
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-base-content/60">暂无数据</div>
                  </div>
                </td>
              </tr>
            ) : (
              schedules.map((schedule) => (
                <tr key={schedule.id} className="hover transition">
                  <td>{schedule.course}</td>
                  <td>{schedule.teacher}</td>
                  <td>{schedule.classroom}</td>
                  <td>{schedule.time}</td>
                  <td>{schedule.class}</td>
                  <td>{schedule.semester}</td>
                  <td className="space-x-1">
                    {onView && (
                      <button 
                        className="btn btn-xs btn-primary" 
                        title="查看"
                        onClick={() => onView(schedule)}
                      >
                        <PreviewOpen theme="outline" size="16" />
                      </button>
                    )}
                    {onEdit && (
                      <button 
                        className="btn btn-xs btn-warning" 
                        title="编辑"
                        onClick={() => onEdit(schedule)}
                      >
                        <EditTwo theme="outline" size="16" />
                      </button>
                    )}
                    {onCopy && (
                      <button 
                        className="btn btn-xs btn-info" 
                        title="复制"
                        onClick={() => onCopy(schedule)}
                      >
                        <Copy theme="outline" size="16" />
                      </button>
                    )}
                    {onDelete && (
                      <button 
                        className="btn btn-xs btn-error" 
                        title="删除"
                        onClick={() => onDelete(schedule)}
                      >
                        <Delete theme="outline" size="16" />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </CardComponent>
  );
} 