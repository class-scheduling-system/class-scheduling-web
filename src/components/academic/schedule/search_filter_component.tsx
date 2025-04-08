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

import { CardComponent } from "../../card_component";
import { Delete, Filter, Refresh, Search } from "@icon-park/react";
import { RefObject } from "react";

export function SearchFilterComponent({
  title,
  searchTerm,
  onSearchChange,
  onReset,
  inputRef,
  children,
  keyboardShortcut = { ctrl: true, key: "k" }
}: {
  title: string;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onReset: () => void;
  inputRef: RefObject<HTMLInputElement>;
  children?: React.ReactNode;
  keyboardShortcut?: { ctrl?: boolean; meta?: boolean; key: string };
}) {
  return (
    <CardComponent padding={18}>
      <div className="space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2 text-primary-content">
          <Filter theme="outline" size="20" />
          <span>{title}</span>
        </h2>

        <div className="space-y-3">
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <Search theme="outline" size="18" />
            </div>
            <input
              ref={inputRef}
              type="text"
              placeholder="搜索..."
              className="input input-sm input-bordered w-full pl-10 pr-16"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {searchTerm && (
              <button
                className="absolute right-10 top-1/2 -translate-y-1/2 transition hover:bg-error/45 rounded-md p-1.5"
                onClick={() => onSearchChange("")}
              >
                <Delete
                  theme="outline"
                  size="16"
                  className="transition text-black hover:text-error-content"
                />
              </button>
            )}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-xs text-base-content/70">
              {keyboardShortcut.meta && <kbd className="kbd kbd-xs">⌘</kbd>}
              {keyboardShortcut.ctrl && <kbd className="kbd kbd-xs">Ctrl</kbd>}
              <span>+</span>
              <kbd className="kbd kbd-xs">{keyboardShortcut.key.toUpperCase()}</kbd>
            </div>
          </div>

          {children}

          <button
            className="btn btn-sm btn-outline btn-primary w-full"
            onClick={onReset}
          >
            <Refresh theme="outline" size="16" />
            <span>重置筛选</span>
          </button>
        </div>
      </div>
    </CardComponent>
  );
} 