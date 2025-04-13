import { SiteInfoEntity } from "../../../models/entity/site_info_entity";
import { ScheduleAddComponent } from "../../../components/academic/schedule/add";

/**
 * 添加排课页面
 * 
 * 用于创建新的排课信息
 * 
 * @param site 站点信息
 * @returns 排课添加页面
 */
export function ScheduleAdd({ site }: Readonly<{ site: SiteInfoEntity }>) {
  return <ScheduleAddComponent site={site} />;
} 