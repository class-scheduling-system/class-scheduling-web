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
    <div className="flex justify-center mt-4">
      <div className="join">
        <button
          className="btn btn-sm join-item"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          上一页
        </button>

        {getPageNumbers().map((number, index) => 
          number === -1 ? (
            <button key={`ellipsis-${index}`} className="join-item btn btn-sm btn-disabled">
              ...
            </button>
          ) : (
            <button
              key={number}
              className={`join-item btn btn-sm ${currentPage === number ? 'btn-active' : ''}`}
              onClick={() => onPageChange(number)}
            >
              {number}
            </button>
          )
        )}

        <button
          className="btn btn-sm join-item"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          下一页
        </button>

        <select
          className="select select-sm join-item border-l-0"
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
          className={`btn btn-sm join-item ${isDescending ? 'btn-active' : ''}`}
          onClick={() => onSortDirectionChange(!isDescending)}
          title={isDescending ? "当前为降序" : "当前为升序"}
        >
          {isDescending ? "↓" : "↑"}
        </button>
      </div>
    </div>
  );
} 