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

import { Left, Right, SortFour } from "@icon-park/react";

export function PaginationComponent({
  currentPage,
  totalPages,
  isDescending,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  onSortDirectionChange
}: {
  currentPage: number;
  totalPages: number;
  isDescending: boolean;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  onSortDirectionChange: (isDescending: boolean) => void;
}) {
  // 生成页码数组，控制显示的数量
  const getPageNumbers = () => {
    const pageNumbers: number[] = [];
    const maxPagesToShow = 5; // 最多显示的页码数
    
    if (totalPages <= maxPagesToShow) {
      // 页数少于最大显示数，全部显示
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // 页数多，使用省略显示
      if (currentPage <= 3) {
        // 当前页靠近开始
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push(-1); // -1表示省略号
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // 当前页靠近结尾
        pageNumbers.push(1);
        pageNumbers.push(-1);
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // 当前页在中间
        pageNumbers.push(1);
        pageNumbers.push(-1);
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push(-1);
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  return (
    <div className="flex justify-between items-center p-3 bg-base-100 border-t border-base-200">
      <div className="text-sm text-base-content/70">
        共 {totalPages} 页，当前第 {currentPage} 页
      </div>
      
      <div className="join shadow-sm">
        <button
          className="btn btn-sm join-item btn-ghost hover:bg-base-200"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <Left theme="outline" size="16" />
          <span className="hidden sm:inline ml-1">上一页</span>
        </button>

        {getPageNumbers().map((number, index) => 
          number === -1 ? (
            <button key={`ellipsis-${index}`} className="join-item btn btn-sm btn-ghost btn-disabled">
              ...
            </button>
          ) : (
            <button
              key={number}
              className={`join-item btn btn-sm ${
                currentPage === number 
                ? 'btn-primary text-white' 
                : 'btn-ghost hover:bg-base-200'
              }`}
              onClick={() => onPageChange(number)}
            >
              {number}
            </button>
          )
        )}

        <button
          className="btn btn-sm join-item btn-ghost hover:bg-base-200"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          <span className="hidden sm:inline mr-1">下一页</span>
          <Right theme="outline" size="16" />
        </button>

        <div className="divider divider-horizontal mx-1 h-6 my-auto"></div>

        <select
          className="select select-sm join-item bg-base-100 border border-base-200 focus:outline-none focus:border-primary"
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
        >
          <option value={5}>5条/页</option>
          <option value={10}>10条/页</option>
          <option value={15}>15条/页</option>
          <option value={20}>20条/页</option>
          <option value={50}>50条/页</option>
        </select>

        <button
          className={`btn btn-sm join-item tooltip tooltip-left ${
            isDescending 
            ? 'btn-ghost bg-base-200 hover:bg-base-300' 
            : 'btn-ghost hover:bg-base-200'
          }`}
          onClick={() => onSortDirectionChange(!isDescending)}
          data-tip={isDescending ? "当前为降序" : "当前为升序"}
        >
          <SortFour theme="outline" size="16" className={isDescending ? "rotate-180" : ""} />
        </button>
      </div>
      
      <div className="text-sm text-base-content/70">
        {totalPages === 0 
          ? "暂无数据" 
          : `共 ${totalPages * itemsPerPage} 条数据`
        }
      </div>
    </div>
  );
} 