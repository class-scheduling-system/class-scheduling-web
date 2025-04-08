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
import { Delete, EditTwo, PreviewOpen } from "@icon-park/react";
import { ClassroomEntity } from "../../../models/entity/schedule_entity";
import { LabelComponent } from "../../label_component";

export function ClassroomListComponent({
  classrooms,
  onView,
  onEdit,
  onDelete,
  loading
}: {
  classrooms: ClassroomEntity[];
  onView?: (classroom: ClassroomEntity) => void;
  onEdit?: (classroom: ClassroomEntity) => void;
  onDelete?: (classroom: ClassroomEntity) => void;
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
              <th>教室名称</th>
              <th>所属教学楼</th>
              <th>容量</th>
              <th>设施</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {classrooms.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6">
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-base-content/60">暂无数据</div>
                  </div>
                </td>
              </tr>
            ) : (
              classrooms.map((classroom) => (
                <tr key={classroom.id} className="hover transition">
                  <td>{classroom.name}</td>
                  <td>{classroom.building}</td>
                  <td>{classroom.capacity}</td>
                  <td>{classroom.facilities}</td>
                  <td>
                    {classroom.status === '可用' ? (
                      <LabelComponent
                        size="badge-sm"
                        style="badge-outline"
                        type="success"
                        text="可用"
                      />
                    ) : (
                      <LabelComponent
                        size="badge-sm"
                        style="badge-outline"
                        type="error"
                        text={classroom.status}
                      />
                    )}
                  </td>
                  <td className="space-x-1">
                    {onView && (
                      <button 
                        className="btn btn-xs btn-primary" 
                        title="查看"
                        onClick={() => onView(classroom)}
                      >
                        <PreviewOpen theme="outline" size="16" />
                      </button>
                    )}
                    {onEdit && (
                      <button 
                        className="btn btn-xs btn-warning" 
                        title="编辑"
                        onClick={() => onEdit(classroom)}
                      >
                        <EditTwo theme="outline" size="16" />
                      </button>
                    )}
                    {onDelete && (
                      <button 
                        className="btn btn-xs btn-error" 
                        title="删除"
                        onClick={() => onDelete(classroom)}
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