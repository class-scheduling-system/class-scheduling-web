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
import { Copy, Delete, EditTwo, PreviewOpen, Schedule, BookOne, User, School } from "@icon-park/react";
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
      <CardComponent padding={0} className="flex-1 shadow-md border border-base-200 rounded-xl overflow-hidden">
        <div className="flex h-[600px] justify-center items-center">
          <div className="flex flex-col items-center gap-3">
            <span className="loading loading-spinner text-primary loading-lg"></span>
            <p className="text-sm text-base-content/70">数据加载中...</p>
          </div>
        </div>
      </CardComponent>
    );
  }

  return (
    <div className="overflow-x-auto overflow-y-auto w-full">
      <table className="table w-full">
        <thead className="sticky top-0 bg-base-100 z-10 shadow-sm">
          <tr className="bg-base-200 rounded-t-lg overflow-hidden">
            <th className="font-semibold text-base-content/80">课程名称</th>
            <th className="font-semibold text-base-content/80">授课教师</th>
            <th className="font-semibold text-base-content/80">教室</th>
            <th className="font-semibold text-base-content/80">教学班</th>
            <th className="font-semibold text-base-content/80 text-end">操作</th>
          </tr>
        </thead>
        <tbody>
          {schedules.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-20 h-20 bg-base-200/50 rounded-full flex items-center justify-center">
                    <Schedule theme="outline" size="32" className="text-base-content/40" />
                  </div>
                  <div className="text-base-content/60 text-lg">暂无排课数据</div>
                  <div className="text-sm text-base-content/40 max-w-md text-center">
                    请尝试调整筛选条件或添加新的排课信息
                  </div>
                </div>
              </td>
            </tr>
          ) : (
            schedules.map((schedule) => (
              <tr key={schedule.id} className="hover:bg-base-100/50 transition-colors duration-200">
                <td className="font-medium text-primary whitespace-nowrap py-2 px-2">
                  <div className="flex items-center gap-1">
                    <BookOne theme="outline" size="16" className="text-primary flex-shrink-0" />
                    <span className="truncate" title={schedule.course}>{schedule.course}</span>
                  </div>
                </td>
                <td className="whitespace-nowrap py-2 px-2">
                  <div className="flex items-center gap-1">
                    <User theme="outline" size="16" className="text-base-content/70 flex-shrink-0" />
                    <span className="truncate" title={schedule.teacher}>{schedule.teacher}</span>
                  </div>
                </td>
                <td className="whitespace-nowrap py-2 px-2">
                  <div className="flex items-center gap-1" title={schedule.classroom}>
                    <School theme="outline" size="16" className="text-base-content/70 flex-shrink-0" />
                    <span className="truncate">{schedule.classroom}</span>
                  </div>
                </td>
                <td className="whitespace-nowrap py-2 px-2">
                  <div className="flex items-center gap-1">
                    <BookOne theme="outline" size="16" className="text-base-content/70 flex-shrink-0" />
                    <span className="truncate" title={schedule.class}>{schedule.class}</span>
                  </div>
                </td>
                <td className="py-2 px-1 text-end">
                  <div className="flex justify-end gap-0">
                    {onView && (
                      <button
                        className="btn btn-xs btn-ghost hover:btn-primary tooltip tooltip-left p-0 h-6 w-6 min-h-0"
                        data-tip="查看课表"
                        onClick={() => onView(schedule)}
                      >
                        <PreviewOpen theme="outline" size="14" />
                      </button>
                    )}
                    {onEdit && (
                      <button
                        className="btn btn-xs btn-ghost hover:btn-warning tooltip tooltip-left p-0 h-6 w-6 min-h-0"
                        data-tip="编辑排课"
                        onClick={() => onEdit(schedule)}
                      >
                        <EditTwo theme="outline" size="14" />
                      </button>
                    )}
                    {onCopy && (
                      <button
                        className="btn btn-xs btn-ghost hover:btn-info tooltip tooltip-left p-0 h-6 w-6 min-h-0"
                        data-tip="复制排课"
                        onClick={() => onCopy(schedule)}
                      >
                        <Copy theme="outline" size="14" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        className="btn btn-xs btn-ghost hover:btn-error tooltip tooltip-left p-0 h-6 w-6 min-h-0"
                        data-tip="删除排课"
                        onClick={() => onDelete(schedule)}
                      >
                        <Delete theme="outline" size="14" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}