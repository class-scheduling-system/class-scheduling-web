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

/**
 * 代表站点信息的实体类型。
 * 包含了站点的基础信息、联系与社交方式、备案与版权信息以及高级元数据等属性。
 * 允许存在未定义的其他属性，以提供灵活性。
 */
export type SiteInfoEntity = {
    /**
     * 站点联系与社交
     */
    contact_email?: string;
    contact_phone?: string;
    copyright_status?: string;
    description?: string;
    founder?: string;
    icon_url?: string;
    icp_link?: string;
    /**
     * 站点备案与版权
     */
    icp_number?: string;
    keywords?: string;
    launch_date?: string;
    logo_url?: string;
    /**
     * 站点基础信息
     */
    name?: string;
    office_address?: string;
    open_source_license?: string;
    /**
     * 站点高级元数据
     */
    owner?: string;
    security_record?: string;
    security_record_link?: string;
    sub_title?: string;
    technology_stack?: string;
    title?: string;
    wechat_office_account?: string;
    weibo_url?: string;
}
