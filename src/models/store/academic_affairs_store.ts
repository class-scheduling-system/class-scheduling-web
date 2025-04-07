import { AcademicAffairsEntity } from "../entity/academic_affairs_entity";
import { DepartmentEntity } from "../entity/department_entity";

/**
 * # 学术事务Store
 * > 该Store用于保存学术事务相关信息
 */
export type AcademicAffairsStore = {
    /** 当前学术事务信息 */
    currentAcademicAffairs: AcademicAffairsEntity | null;
    /** 当前学术事务所属部门信息 */
    departmentInfo: DepartmentEntity | null;
    /** 是否已加载学术事务信息 */
    loaded: boolean;
    /** 是否已加载部门信息 */
    departmentLoaded: boolean;
}