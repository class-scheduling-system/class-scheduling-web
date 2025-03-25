/**
 * 教室标签数据传输对象
 * <p>
 * 该类是{@code ClassroomTagDO} 实体类的 DTO，用于在数据传输过程中传递教室标签信息。
 * </p>
 *
 * ClassroomTagDTO
 */
export type ClassroomTagEntity = {
    /**
     * 教室标签主键
     */
    class_tag_uuid: string;
    /**
     * 创建时间
     */
    created_at: number;
    /**
     * 教室标签描述
     */
    description: string;
    /**
     * 教室标签名称
     */
    name: string;
    /**
     * 更新时间
     */
    updated_at: number;
}