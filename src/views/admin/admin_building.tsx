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
 * 本软件是“按原样”提供的，没有任何形式的明示或暗示的保证，包括但不限于
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

import {SiteInfoEntity} from "../../models/entity/site_info_entity.ts";
import {useEffect, useState} from "react";
import {PageEntity} from "../../models/entity/page_entity.ts";
import {BuildingEntity} from "../../models/entity/building_entity.ts";
import {GetBuildingListAPI} from "../../apis/building_api.ts";
import {PageSearchDTO} from "../../models/dto/page_search_dto.ts";
import {useDispatch} from "react-redux";
import {addToast} from "../../stores/toast_store.ts";
import {Toast} from "../../models/store/toast_store.ts";

export function AdminBuilding({site}: Readonly<{
    site: SiteInfoEntity
}>) {
    const dispatch = useDispatch();

    const [buildingList, setBuildingList] = useState<PageEntity<BuildingEntity>>({} as PageEntity<BuildingEntity>);
    const [searchRequest, setSearchRequest] = useState<PageSearchDTO>({
        page: 1,
        size: 20,
        is_desc: true,
    } as PageSearchDTO);

    useEffect(() => {
        document.title = `教学楼管理 | ${site.name ?? "Frontleaves Technology"}`;
    }, [site.name]);

    useEffect(() => {
        const func = async () => {
            const getResp = await GetBuildingListAPI(searchRequest);
            if (getResp?.output === "Success") {
                setBuildingList(getResp.data!);
            } else {
                dispatch(addToast({
                    message: getResp?.error_message,
                    type: "error"
                } as Toast));
            }
        }
        func().then();
    }, [dispatch, searchRequest]);

    return (
        <div>
            <div className="overflow-x-auto">
                <table className="table">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>名字</th>
                        <th>状态</th>
                        <th>新建时间</th>
                        <th>修改时间</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        buildingList?.records?.map((building, index) => {
                            return (
                                <tr key={"building-" + index} className="transition hover:bg-base-200">
                                    <th>{index + 1}</th>
                                    <td>{building.building_name}</td>
                                    <td>{building.status}</td>
                                    <td>{building.created_at}</td>
                                    <td>{building.updated_at}</td>
                                    <td>操作</td>
                                </tr>
                            );
                        })
                    }
                    </tbody>
                </table>
            </div>
        </div>
    );
}
