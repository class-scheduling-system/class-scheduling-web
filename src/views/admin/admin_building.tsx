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
import {JSX, useEffect, useState} from "react";
import {PageEntity} from "../../models/entity/page_entity.ts";
import {BuildingEntity} from "../../models/entity/building_entity.ts";
import {GetBuildingListAPI} from "../../apis/building_api.ts";
import {PageSearchDTO} from "../../models/dto/page_search_dto.ts";
import {useDispatch} from "react-redux";
import {animated, useTransition} from "@react-spring/web";
import {message} from "antd";

/**
 * # AdminBuilding
 * > 该函数用于显示和管理教学楼列表。它根据提供的站点信息加载相关联的教学楼数据，并允许用户查看这些数据。
 *
 * @param {Readonly<{site: SiteInfoEntity}>} - 包含站点信息的对象，其中`site`字段为`SiteInfoEntity`类型，提供必要的站点上下文信息。
 *
 * @returns {JSX.Element} - 返回一个React组件，用于展示教学楼的列表及相关操作。
 *
 * @throws 如果从API获取教学楼列表失败，则会通过dispatch抛出一个错误消息toast。
 */
export function AdminBuilding({site}: Readonly<{ site: SiteInfoEntity }>): JSX.Element {
    const dispatch = useDispatch();

    const [buildingList, setBuildingList] = useState<PageEntity<BuildingEntity>>({
        records: new Array(5).fill({}) as BuildingEntity[],
    } as PageEntity<BuildingEntity>);
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
                console.log(getResp);
                message.error(getResp?.message ?? "获取教学楼列表失败");
            }
        };
        func().then();
    }, [dispatch, searchRequest]);

    // 为每个 building 应用 useSpring 动画
    const transition = useTransition(buildingList.size ?? 0, {
        from: {opacity: 0},
        enter: {opacity: 1},
        config: {duration: 100},
    });

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
                    {transition((style, item) =>
                        item ? (
                            buildingList.records.map((building, index) => (
                                <animated.tr
                                    key={building.building_uuid}
                                    style={style}
                                    className="transition hover:bg-base-200"
                                >
                                    <td>{index + 1 + (buildingList.current - 1) * buildingList.size}</td>
                                    <td>{building?.building_name}</td>
                                    <td>{building?.status}</td>
                                    <td>{new Date(building.created_at).toLocaleString()}</td>
                                    <td>{new Date(building.updated_at).toLocaleString()}</td>
                                    <td>
                                        <div className="flex gap-2">
                                            <button className="btn btn-xs btn-outline">编辑</button>
                                            <button className="btn btn-xs btn-outline">删除</button>
                                        </div>
                                    </td>
                                </animated.tr>
                            ))
                        ) : (
                            buildingList.records.map((_, index) => (
                                <animated.tr
                                    key={"building-" + index}
                                    style={style}
                                    className="transition hover:bg-base-200"
                                >
                                    <td>
                                        <div className="skeleton h-4 w-full"></div>
                                    </td>
                                    <td>
                                        <div className="skeleton h-4 w-full"></div>
                                    </td>
                                    <td>
                                        <div className="skeleton h-4 w-full"></div>
                                    </td>
                                    <td>
                                        <div className="skeleton h-4 w-full"></div>
                                    </td>
                                    <td>
                                        <div className="skeleton h-4 w-full"></div>
                                    </td>
                                    <td>
                                        <div className="skeleton h-4 w-full"></div>
                                    </td>
                                </animated.tr>
                            ))
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
