type PaginationProps = {
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
};

export function Pagination({ page, pageSize, totalItems, onPageChange }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="pagination-bar" aria-label="تقسيم الصفحات">
      <button type="button" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        السابق
      </button>
      <span>
        صفحة {page.toLocaleString('ar')} من {totalPages.toLocaleString('ar')}
      </span>
      <button type="button" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
        التالي
      </button>
    </nav>
  );
}

export function paginateItems<T>(items: T[], page: number, pageSize: number) {
  const safePage = Math.max(1, page);
  const startIndex = (safePage - 1) * pageSize;
  return items.slice(startIndex, startIndex + pageSize);
}
