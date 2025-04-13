import React, { createContext, useContext, useState } from "react";
import { Modal } from "antd";
import { Attention } from "@icon-park/react";
import { ConflictContext } from "./types";
import { SchedulingConflictDTO } from "../../../../models/dto/scheduling_conflict_dto";

// 冲突上下文
const ConflictModalContext = createContext<ConflictContext | undefined>(undefined);

/**
 * 冲突处理提供者组件
 */
export const ConflictModalProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [conflicts, setConflicts] = useState<SchedulingConflictDTO[]>([]);
  const [showConflicts, setShowConflicts] = useState(false);

  return (
    <ConflictModalContext.Provider value={{ conflicts, showConflicts, setConflicts, setShowConflicts }}>
      {children}
      <ConflictModal />
    </ConflictModalContext.Provider>
  );
};

/**
 * 使用冲突上下文Hook
 * @returns 冲突上下文
 */
export const useConflictModal = (): ConflictContext => {
  const context = useContext(ConflictModalContext);
  if (!context) {
    throw new Error("useConflictModal必须在ConflictModalProvider内部使用");
  }
  return context;
};

/**
 * 冲突信息对话框组件
 */
const ConflictModal: React.FC = () => {
  const { conflicts, showConflicts, setConflicts, setShowConflicts } = useConflictModal();

  // 处理冲突确认
  const handleConflictConfirm = () => {
    setShowConflicts(false);
  };

  // 处理冲突取消
  const handleConflictCancel = () => {
    setShowConflicts(false);
    setConflicts([]);
  };

  // 获取冲突类型文字描述
  const getConflictTypeText = (type: number): string => {
    switch (type) {
      case 1:
        return "教师冲突";
      case 2:
        return "教室冲突";
      case 3:
        return "班级冲突";
      default:
        return "未知冲突";
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center text-error gap-2">
          <Attention theme="filled" size="24" fill="#ff4d4f" />
          <span>发现排课冲突</span>
        </div>
      }
      open={showConflicts}
      onOk={handleConflictConfirm}
      onCancel={handleConflictCancel}
      okText="确认"
      cancelText="取消"
      width={700}
    >
      <div className="py-2">
        <p className="mb-4">系统检测到以下排课冲突，请查看并决定如何处理:</p>

        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>冲突类型</th>
                <th>冲突时间</th>
                <th>描述</th>
              </tr>
            </thead>
            <tbody>
              {conflicts.map((conflict, index) => (
                <tr key={index}>
                  <td>
                    <span className="badge badge-error">
                      {getConflictTypeText(conflict.conflict_type)}
                    </span>
                  </td>
                  <td>
                    第{conflict.conflict_time.week}周
                    周{["一", "二", "三", "四", "五", "六", "日"][conflict.conflict_time.day - 1] || "未知"}
                    第{conflict.conflict_time.period}节
                  </td>
                  <td>{conflict.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
}; 