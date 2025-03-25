/**
 * 教室简单数据传输对象
 * <p>
 * 该类是{@code ClassroomDTO} 的简化版本，仅包含下拉框所需的基本信息。
 * </p>
 *
 * ClassroomLiteDTO
 */
export type ClassroomLiteEntity = {
    /**
     * 教室容量
     */
    capacity?: number;
    /**
     * 教室主键
     */
    classroom_uuid?: string;
    /**
     * 教室名称
     */
    name?: string;
    /**
     * 教室编号
     */
    number?: string;
    /**
     * 教室状态 0:禁用 1:启用
     */
    status?: boolean;
}