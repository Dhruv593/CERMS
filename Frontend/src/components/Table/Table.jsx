import React, { useState } from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';

export function Table({ buttonLabel = '', onButtonClick, searchProps, tableHeaders = [], tableData = [], renderRow }) {
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(tableData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentData = tableData.slice(startIndex, startIndex + pageSize) || [];

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePageChange = (e) => {
    let page = parseInt(e.target.value, 10);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="shadow-sm border-0 rounded-lg">
      <div className="border ">
        {/* Search Bar & Button Row */}
        <div className="card-header d-flex flex-column flex-sm-row justify-content-end align-items-center bg-light py-3 gap-2">
          {searchProps && (
            <input
              type="text"
              value={searchProps.value}
              onChange={searchProps.onChange}
              placeholder={searchProps.placeholder || 'Search...'}
              className="form-control w-100 w-sm-auto border shadow-sm"
              style={{ maxWidth: '200px' }}
            />
          )}
          {onButtonClick && (
            <button onClick={onButtonClick} className="btn btn-primary d-flex align-items-center fw-bold">
              <Plus className="me-1" size={16} />
              {buttonLabel}
            </button>
          )}
        </div>

        {/* Table Section */}
        <div className="card-body p-3 table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-primary text-center">
              <tr>
                {tableHeaders.map((col, index) => (
                  <th key={index} className="fw-semibold text-uppercase">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentData.length > 0 ? (
                currentData.map((row, index) =>
                  renderRow ? (
                    renderRow(row, index)
                  ) : (
                    <tr key={index}>
                      {tableHeaders.map((col, j) => (
                        <td key={j} className="text-center">
                          {col.toLowerCase().includes('image') ? (
                            <img
                              src={row[col.toLowerCase()]}
                              alt="Table Image"
                              className="table-img img-fluid rounded"
                              style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                            />
                          ) : (
                            row[col.toLowerCase()]
                          )}
                        </td>
                      ))}
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td colSpan={tableHeaders.length + 1} className="text-center text-muted">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="card-footer d-flex justify-content-center align-items-center bg-light gap-3 pb-3">
          <button onClick={handlePrevious} disabled={currentPage === 1} className="btn btn-sm btn-outline-dark">
            <ChevronLeft size={18} />
          </button>
          <div className="d-flex align-items-center gap-2">
            <span className="text-muted">Page</span>
            <input
              type="text"
              value={currentPage}
              onChange={handlePageChange}
              className="form-control text-center border rounded-pill shadow-sm"
              style={{ width: '50px' }}
            />
            <span className="text-muted">of {totalPages}</span>
          </div>
          <button onClick={handleNext} disabled={currentPage === totalPages} className="btn btn-sm btn-outline-dark">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Table;
