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

import { SiteInfoEntity } from "../../models/entity/site_info_entity.ts";
import { useEffect } from "react";

export function AdminSystemInfo({ site }: Readonly<{ site: SiteInfoEntity }>) {
    useEffect(() => {
        document.title = `系统信息 | ${site.name ?? "Frontleaves Technology"}`;
    }, [site.name]);

    // 模拟系统信息数据
    const systemInfo = {
        cpu: {
            name: "Intel(R) Core(TM) i7-10700K CPU @ 3.80GHz",
            cores: 8,
            usage: 65, // CPU 使用率
        },
        memory: {
            total: "16 GB", // 总内存大小
            free: "4 GB", // 空闲内存大小
            usage: 75, // 内存使用率
        },
        heapMemory: {
            init: "512 MB", // 初始堆内存大小
            used: "256 MB", // 已使用的堆内存大小
            max: "2 GB", // 最大堆内存大小
        },
        disk: {
            total: "1 TB", // 总磁盘空间
            free: "500 GB", // 空闲磁盘空间
            usage: 50, // 磁盘使用率
        },
        os: {
            name: "Windows 10 Pro", // 操作系统名称
            version: "10.0.19043", // 操作系统版本
            arch: "x64", // 操作系统架构
        },
    };

    return (
        <div className="p-6">

            {/* 系统概览 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {/* CPU 信息 */}
                <div className="card bg-base-200 shadow-md">
                    <div className="card-body">
                        <h2 className="card-title">CPU 信息</h2>
                        <div className="space-y-2">
                            <p className="text-sm">名称: {systemInfo.cpu.name}</p>
                            <p className="text-sm">核心数: {systemInfo.cpu.cores}</p>
                            <div className="flex justify-center items-center">
                                <div
                                    className="radial-progress text-primary"
                                    style={{ "--value": systemInfo.cpu.usage, "--size": "8rem" }}
                                    role="progressbar"
                                >
                                    {systemInfo.cpu.usage}%
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 内存信息 */}
                <div className="card bg-base-200 shadow-md">
                    <div className="card-body">
                        <h2 className="card-title">内存信息</h2>
                        <div className="space-y-2">
                            <p className="text-sm">总内存: {systemInfo.memory.total}</p>
                            <p className="text-sm">空闲内存: {systemInfo.memory.free}</p>
                            <div className="flex justify-center items-center">
                                <div
                                    className="radial-progress text-secondary"
                                    style={{ "--value": systemInfo.memory.usage, "--size": "8rem" }}
                                    role="progressbar"
                                >
                                    {systemInfo.memory.usage}%
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 磁盘信息 */}
                <div className="card bg-base-200 shadow-md">
                    <div className="card-body">
                        <h2 className="card-title">磁盘信息</h2>
                        <div className="space-y-2">
                            <p className="text-sm">总磁盘空间: {systemInfo.disk.total}</p>
                            <p className="text-sm">空闲磁盘空间: {systemInfo.disk.free}</p>
                            <div className="flex justify-center items-center">
                                <div
                                    className="radial-progress text-accent"
                                    style={{ "--value": systemInfo.disk.usage, "--size": "8rem" }}
                                    role="progressbar"
                                >
                                    {systemInfo.disk.usage}%
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 堆内存信息和操作系统信息 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* 堆内存信息 */}
                <div className="card bg-base-200 shadow-md">
                    <div className="card-body">
                        <h2 className="card-title">堆内存信息</h2>
                        <div className="overflow-x-auto">
                            <table className="table w-full">
                                <tbody>
                                <tr>
                                    <td>初始堆内存</td>
                                    <td>{systemInfo.heapMemory.init}</td>
                                </tr>
                                <tr>
                                    <td>已使用堆内存</td>
                                    <td>{systemInfo.heapMemory.used}</td>
                                </tr>
                                <tr>
                                    <td>最大堆内存</td>
                                    <td>{systemInfo.heapMemory.max}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* 操作系统信息 */}
                <div className="card bg-base-200 shadow-md">
                    <div className="card-body">
                        <h2 className="card-title">操作系统信息</h2>
                        <div className="overflow-x-auto">
                            <table className="table w-full">
                                <tbody>
                                <tr>
                                    <td>名称</td>
                                    <td>{systemInfo.os.name}</td>
                                </tr>
                                <tr>
                                    <td>版本</td>
                                    <td>{systemInfo.os.version}</td>
                                </tr>
                                <tr>
                                    <td>架构</td>
                                    <td>{systemInfo.os.arch}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
