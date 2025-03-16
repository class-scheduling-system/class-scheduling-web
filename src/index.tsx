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

import {Route, Routes, useLocation, useNavigate} from "react-router";
import {BaseIndex} from "./views/base_index.tsx";
import {BaseInit} from "./views/base_init.tsx";
import {JSX, useEffect} from "react";
import {GetSiteInfoAPI} from "./apis/public_api.ts";
import {useDispatch} from "react-redux";
import {setSiteStore} from "./stores/site_store.ts";
import {BaseAdmin} from "./views/base_admin.tsx";
import {BaseAuth} from "./views/base_auth.tsx";
import {message} from "antd";
import {GetCurrentUserAPI} from "./apis/user_api.ts";
import {setUserInfo} from "./stores/user_store.ts";
import {PageNotFound} from "./views/404/page_not_found.tsx";
import {BaseAcademic} from "./views/base_academic.tsx";

/**
 * # Index
 *
 * > 该函数作为应用的入口点，负责初始化系统信息和用户信息，并根据状态渲染不同的路由页面。它通过检查本地存储来决定是否需要获取最新的站点信息，并且验证当前用户的登录状态。
 *
 * @returns {JSX.Element} 返回一个包含多个路由定义的React组件，这些路由指向不同的页面视图。
 */
export function Index(): JSX.Element {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    // 检查系统是否正在初始化
    useEffect(() => {
        const func = async () => {
            if (localStorage.getItem("has_init") === "0") {
                const getResp = await GetSiteInfoAPI();
                if (getResp?.output === "Success") {
                    dispatch(setSiteStore(getResp.data!));
                } else {
                    message.error("获取系统信息失败");
                }
            }
        }
        func().then();
    }, [dispatch]);

    // 获取用户信息
    useEffect(() => {
        const func = async () => {
            if (localStorage.getItem("has_init") === "0") {
                const getResp = await GetCurrentUserAPI();
                if (getResp?.output === "Success") {
                    dispatch(setUserInfo(getResp.data!));
                    if (location.pathname.startsWith("/auth")) {
                        message.info("您已登录，正在为您跳转...");
                        // 根据角色跳转不同页面
                        switch (getResp.data!.user?.role.role_name) {
                            case "管理员":
                                navigate("/admin/dashboard");
                                break;
                            case "教务":
                                navigate("/academic/dashboard");
                                break;
                            case "老师":
                                navigate("/teacher/dashboard");
                                break;
                            default:
                                break;
                        }
                    }
                } else if (location.pathname !== "/auth/login" && location.pathname !== "/init" && location.pathname !== "/") {
                    message.error("登录已失效");
                    navigate("/auth/login?fallback=" + location.pathname);
                }
            }
        }
        func().then();
    }, [dispatch, location.pathname, navigate]);

    return (
        <Routes location={location}>
            <Route path={"/"} element={<BaseIndex/>}/>
            <Route path={"/init"} element={<BaseInit/>}/>
            <Route path={"/auth/*"} element={<BaseAuth/>}/>
            <Route path={"/admin/*"} element={<BaseAdmin/>}/>
            <Route path={"/academic/*"} element={<BaseAcademic/>}/>
            <Route path={"/*"} element={<PageNotFound/>}/>
        </Routes>
    );
}
