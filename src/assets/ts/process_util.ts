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
 * # Util
 * > 该类包含一些实用的静态方法，用于处理页面中的对话框元素。
 *
 * @since v1.0.0
 * @version v1.0.0
 * @author xiao_lfeng
 */
export class Util {

    /**
     * # getDialog
     * > 该函数根据给定的名称获取页面中的对话框元素。它通过`document.getElementById`方法来查找指定ID的HTML对话框元素。
     *
     * @param {string} name - 对话框元素的ID。
     * @returns {HTMLDialogElement} - 返回找到的对话框元素，如果未找到则返回null。
     * @throws {TypeError} - 如果传入的name不是字符串类型。
     */
    public static getDialog(name: string): HTMLDialogElement {
        return document.getElementById(name) as HTMLDialogElement;
    }

    /**
     * # showDialog
     * > 显示具有指定名称的对话框。此函数查找给定ID的HTML元素，并将其作为对话框显示。
     *
     * @param {string} name - 要显示的对话框的ID。
     * @returns {void}
     * @throws {TypeError} 如果找到的元素不是HTMLDialogElement类型，则抛出此异常。
     * @throws {Error} 如果没有找到具有给定ID的元素，则抛出此异常。
     */
    public static showDialog(name: string): void {
        (document.getElementById(name) as HTMLDialogElement).showModal();
    }

    /**
     * # closeDialog
     * > 该函数用于关闭指定名称的对话框。
     *
     * @param {string} name - 对话框元素的ID，用于查找并关闭对应的对话框。
     * @returns {void}
     *
     * @throws {TypeError} 如果传入的name对应的元素不是HTMLDialogElement类型，则会抛出此异常。
     * @throws {ReferenceError} 如果根据给定的name没有找到任何元素，将抛出此异常。
     */
    public static closeDialog(name: string): void {
        (document.getElementById(name) as HTMLDialogElement).close();
    }
}
