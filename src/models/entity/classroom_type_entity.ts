/**
 * 教室类型数据传输对象
 * <p>
 * 该类是{@code ClassroomTypeDO} 实体类的 DTO，用于在数据传输过程中传递教室类型信息。
 * </p>
 *
 * ClassroomTypeDTO
 */
export type ClassroomTypeEntity = {
    /**
     * 教室类型主键
     */
    class_type_uuid: string;
    /**
     * 创建时间，时间戳以数字格式返回
     */
    created_at: number;
    /**
     * 教室类型描述
     */
    description: string;
    /**
     * 教室类型名称
     */
    name: string;
    /**
     * 更新时间，时间戳以数字格式返回
     */
    updated_at: number;
}