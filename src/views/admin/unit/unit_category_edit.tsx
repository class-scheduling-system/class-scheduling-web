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

import { JSX, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { message } from "antd";
import { Return, AddUser } from "@icon-park/react";
import { SiteInfoEntity } from "../../../models/entity/site_info_entity";
import { UnitCategoryDTO } from "../../../models/dto/unit_category_dto";
import { EditUnitCategoryAPI } from "../../../apis/unit_category_api";

export function AdminUnitCategoryEdit({ site }: Readonly<{ site: SiteInfoEntity }>): JSX.Element {
    const navigate = useNavigate();
    const location = useLocation();
    const unitCategoryInfo = location.state?.unitCategoryInfo;

    const [data, setData] = useState<UnitCategoryDTO>({
        name: "",
        short_name: "",
        english_name: "",
        is_entity: false,
        order: 0
    } as UnitCategoryDTO);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = `编辑单位类别 | ${site.name ?? "Frontleaves Technology"}`;
    }, [site.name]);

    // 初始化单位类别信息
    useEffect(() => {
        if (unitCategoryInfo) {
            setData({
                name: unitCategoryInfo.name,
                short_name: unitCategoryInfo.short_name,
                english_name: unitCategoryInfo.english_name,
                is_entity: unitCategoryInfo.is_entity,
                order: unitCategoryInfo.order
            });
            setLoading(false);
        } else {
            message.error("未找到单位类别信息");
            navigate("/admin/unit");
        }
    }, [unitCategoryInfo, navigate]);

    // 重置表单
    const resetForm = () => {
        if (unitCategoryInfo) {
            setData({
                name: unitCategoryInfo.name,
                short_name: unitCategoryInfo.short_name,
                english_name: unitCategoryInfo.english_name,
                is_entity: unitCategoryInfo.is_entity,
                order: unitCategoryInfo.order
            });
            message.success("表单已重置");
        }
    };

    // 提交表单
    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        try {
            const response = await EditUnitCategoryAPI(unitCategoryInfo.unit_category_uuid, data);
            if (response?.output === "Success") {
                message.success("编辑成功");
                navigate("/admin/unit");
            } else {
                message.error(response?.message ?? "编辑失败");
            }
        } catch (error) {
            console.error("编辑失败:", error);
            message.error("编辑失败");
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center space-x-2">
                <Link to="/admin/unit">
                    <Return theme="outline" size="24" />
                </Link>
                <h2 className="text-2xl font-bold flex items-center space-x-2">
                    <span>编辑单位类别</span>
                </h2>
            </div>

            {loading ? (
                // 加载中显示骨架屏
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array(4).fill(0).map((_, index) => (
                        <div key={index} className="animate-pulse">
                            <div className="h-4 bg-base-300 rounded w-24 mb-2"></div>
                            <div className="h-10 bg-base-300 rounded w-full"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card card-border bg-base-100 w-full shadow-md">
                    <h2 className="card-title bg-neutral/10 rounded-t-lg p-3">
                        <AddUser theme="outline" size="18" />编辑单位类别信息
                    </h2>
                    <div className="card-body">
                        <form id="unit_category_edit" onSubmit={onSubmit} className="flex flex-col space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* 单位类别名称 */}
                                <div className="form-control">
                                    <label className="label" htmlFor="name" aria-label="单位类别名称">
                                        <span className="label-text flex items-center gap-1">
                                            <span>单位类别名称</span>
                                            <span className="text-error">*</span>
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        className="input input-bordered w-full"
                                        value={data.name}
                                        onChange={(e) => setData({ ...data, name: e.target.value })}
                                        required
                                    />
                                </div>

                                {/* 单位类别简称 */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">单位类别简称</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="input input-bordered w-full"
                                        value={data.short_name}
                                        onChange={(e) => setData({ ...data, short_name: e.target.value })}
                                    />
                                </div>

                                {/* 英文名称 */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">英文名称</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="input input-bordered w-full"
                                        value={data.english_name}
                                        onChange={(e) => setData({ ...data, english_name: e.target.value })}
                                    />
                                </div>

                                {/* 排序 */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">排序</span>
                                    </label>
                                    <input
                                        type="number"
                                        className="input input-bordered w-full"
                                        value={data.order}
                                        onChange={(e) => setData({ ...data, order: parseInt(e.target.value) })}
                                    />
                                </div>

                                {/* 是否实体单位 */}
                                <div className="form-control">
                                    <label className="label cursor-pointer justify-start gap-2">
                                        <input
                                            type="checkbox"
                                            className="checkbox"
                                            checked={data.is_entity}
                                            onChange={(e) => setData({ ...data, is_entity: e.target.checked })}
                                        />
                                        <span className="label-text">是否实体单位</span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-2 pt-4">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="btn btn-ghost">
                                    重置
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary">
                                    提交
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}