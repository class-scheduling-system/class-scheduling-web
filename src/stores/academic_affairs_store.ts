/*
 * --------------------------------------------------------------------------------
 * Copyright (c) 2022-NOW(至今) 锋楪技术团队
 * Author: 锋楪技术团队 (https://www.frontleaves.com)
 *
 * 本文件包含锋楪技术团队项目的源代码，项目的所有源代码均遵循 MIT 开源许可证协议。
 * --------------------------------------------------------------------------------
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AcademicAffairsEntity } from "../models/entity/academic_affairs_entity";
import { DepartmentEntity } from "../models/entity/department_entity";
import { AcademicAffairsStore } from "../models/store/academic_affairs_store";

/**
 * # 学术事务Store
 * > 该Store用于保存学术事务相关信息
 */

// 初始化状态
const initialState: AcademicAffairsStore = {
    currentAcademicAffairs: null,
    departmentInfo: null,
    loaded: false,
    departmentLoaded: false
};

// 创建academicAffairsStore切片
export const academicAffairsStore = createSlice({
    name: "academicAffairs",
    initialState,
    reducers: {
        /**
         * 设置当前学术事务信息
         * @param state 当前状态
         * @param action 包含学术事务信息的action
         */
        setCurrentAcademicAffairs: (state, action: PayloadAction<AcademicAffairsEntity>) => {
            state.currentAcademicAffairs = action.payload;
            state.loaded = true;
        },
        /**
         * 设置部门信息
         * @param state 当前状态
         * @param action 包含部门信息的action
         */
        setDepartmentInfo: (state, action: PayloadAction<DepartmentEntity>) => {
            state.departmentInfo = action.payload;
            state.departmentLoaded = true;
        },
        /**
         * 重置学术事务信息
         * @param state 当前状态
         */
        resetAcademicAffairs: (state) => {
            state.currentAcademicAffairs = null;
            state.departmentInfo = null;
            state.loaded = false;
            state.departmentLoaded = false;
        }
    }
});

// 导出actions
export const { setCurrentAcademicAffairs, setDepartmentInfo, resetAcademicAffairs } = academicAffairsStore.actions;

// 导出reducer
export default academicAffairsStore.reducer;