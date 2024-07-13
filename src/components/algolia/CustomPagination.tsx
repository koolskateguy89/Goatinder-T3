import clsx from "clsx";
import {
  HiChevronDoubleLeft,
  HiChevronLeft,
  HiChevronRight,
  HiChevronDoubleRight,
} from "react-icons/hi2";
import {
  type UsePaginationProps,
  usePagination,
} from "react-instantsearch-hooks-web";

export default function CustomPagination(props: UsePaginationProps) {
  const {
    pages,
    currentRefinement, // current page
    nbPages,
    isFirstPage,
    isLastPage,
    canRefine,
    refine,
  } = usePagination(props);

  return (
    <div className="max-w-full overflow-x-auto">
      <div className="join">
        <button
          type="button"
          className="btn join-item max-md:btn-sm"
          onClick={() => refine(0)}
          aria-label="First"
          disabled={isFirstPage}
        >
          <HiChevronDoubleLeft />
        </button>
        <button
          type="button"
          className="btn join-item max-md:btn-sm"
          onClick={() => refine(currentRefinement - 1)}
          aria-label="Previous"
          disabled={isFirstPage}
        >
          <HiChevronLeft />
        </button>

        {pages.map((page) => {
          const isCurrentPage = page === currentRefinement;
          return (
            <button
              key={page}
              type="button"
              onClick={() => refine(page)}
              className={clsx(
                "btn join-item max-md:btn-sm",
                isCurrentPage && canRefine && "btn-secondary"
              )}
              aria-label={`Page ${page + 1}`}
            >
              {page + 1}
            </button>
          );
        })}

        <button
          type="button"
          className="btn join-item max-md:btn-sm"
          onClick={() => refine(currentRefinement + 1)}
          aria-label="Next"
          disabled={isLastPage}
        >
          <HiChevronRight />
        </button>
        <button
          type="button"
          className="btn join-item max-md:btn-sm"
          onClick={() => refine(nbPages - 1)}
          aria-label="Last"
          disabled={isLastPage}
        >
          <HiChevronDoubleRight />
        </button>
      </div>
    </div>
  );
}
