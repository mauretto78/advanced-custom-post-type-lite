import React from "react";
import {Link} from "react-router-dom";
import PropTypes from 'prop-types';
import {getPagination} from "../../utils/pagination.jsx";
import useTranslation from "../../hooks/useTranslation.jsx";

const TablePagination = ({currentPage, totalRows, baseLink}) => {

    const {prevPage, nextPage, start, end, totalPages, pageIndex} = getPagination(currentPage, totalRows);

    const getPageItems = (current, total) => {
        const range = [];
        const rangeWithDots = [];
        let l;

        for (let i = 0; i < total; i++) {
            if (
                i === 0 ||
                i === total - 1 ||
                (i >= current - 1 && i <= current + 1)
            ) {
                range.push(i);
            }
        }

        for (let i of range) {
            if (l !== undefined) {
                if (i - l === 2) {
                    rangeWithDots.push(l + 1);
                } else if (i - l > 2) {
                    rangeWithDots.push("...");
                }
            }
            rangeWithDots.push(i);
            l = i;
        }

        return rangeWithDots;
    };

    const pageItems = getPageItems(pageIndex, totalPages);

    return (
        <div
            data-testid="table-pagination"
            className="flex-between"
        >
            <span data-testid="table-pagination-label">
                {useTranslation("Showing {{start}}–{{end}} of {{total}} records", {start, end, total: totalRows})}
            </span>
            <div
                data-testid="table-pagination-links"
                className="i-flex-center s-4"
                role="navigation"
            >
                <Link
                    aria-disabled={prevPage === null}
                    to={`${baseLink}/${prevPage}`}
                >
                    <button
                        className="acpt-btn acpt-btn-outlined-primary acpt-btn-xs"
                        disabled={prevPage === null}
                    >
                        &lt;
                    </button>
                </Link>
                {pageItems.map((p, idx) =>
                    p === "..." ? (
                        <span key={idx} className="px-1">...</span>
                    ) : (
                        <Link
                            key={p}
                            to={`${baseLink}/${p+1}`}
                            aria-disabled={p === pageIndex}
                        >
                            <button className={`acpt-btn ${p === pageIndex ? 'acpt-btn-primary' : 'acpt-btn-outlined-primary'} acpt-btn-xs`}>
                                {p + 1}
                            </button>
                        </Link>
                    )
                )}
                <Link
                    aria-disabled={nextPage === null}
                    to={`${baseLink}/${nextPage}`}
                >
                    <button
                        className="acpt-btn acpt-btn-outlined-primary acpt-btn-xs"
                        disabled={nextPage === null}
                    >
                        &gt;
                    </button>
                </Link>

            </div>
        </div>
    );
};

TablePagination.propTypes = {
    currentPage: PropTypes.number.isRequired,
    totalRows: PropTypes.number.isRequired,
    baseLink: PropTypes.string.isRequired,
};

export default TablePagination;

