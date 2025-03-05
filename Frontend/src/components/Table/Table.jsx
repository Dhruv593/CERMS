import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import { Button, Form } from 'react-bootstrap';
import { Plus, Edit, Trash2 } from 'lucide-react';

export function Table({ buttonLabel = '', onButtonClick, tableData = [], onEdit, onDelete }) {
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Normalize table headers to match data keys
  const normalizeKey = (header) => header.toLowerCase().replace(/\s+/g, '_');

  // Add "Actions" field to each row dynamically
  const processedTableData = tableData.map((row, index) => ({
    ...row,
    actions: (
      <div className="d-flex justify-content-center gap-2">
        <Button variant="success" size="sm" onClick={() => onEdit(row)} className="d-flex align-items-center gap-1">
          <Edit size={16} />
        </Button>
        <Button variant="danger" size="sm" onClick={() => onDelete(row)} className="d-flex align-items-center gap-1">
          <Trash2 size={16} />
        </Button>
      </div>
    )
  }));

  // Define columns dynamically based on data keys
// Define columns dynamically based on data keys
const columns = [
  {
    name: '#',
    selector: (_, index) => (currentPage - 1) * itemsPerPage + index + 1,
    sortable: false,
    width: '80px',
    center: true
  },
  ...(processedTableData.length > 0 ? 
    Object.keys(processedTableData[0]).filter(key => key !== 'actions').map((key) => ({
      name: key.replace(/_/g, ' ').replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase()))),
      selector: (row) => row[key],
      sortable: true,
      cell: (row) =>
        key.includes('photo') || key.includes('image') ? (
          <img
            src={row[key]}
            alt="Table"
            className="img-fluid rounded"
            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
          />
        ) : (
          row[key] || 'N/A'
        )
    })) : []),
  {
    name: 'Actions',
    selector: (row) => row.actions,
    center: true,
    width: '180px'
  }
];


  // Filter table data based on search input
  const filteredData = processedTableData.filter((row) =>
    Object.values(row).some((value) => String(value).toLowerCase().includes(searchValue.toLowerCase()))
  );

  return (
    <div className="shadow-sm border-0 rounded-lg p-3">
      {/* Search Bar & Button */}
      <div className="card-header d-flex flex-column flex-sm-row justify-content-end align-items-center bg-light py-3 gap-2">
        <Form.Control
          type="text"
          placeholder="Search..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="w-50 border shadow-sm"
        />

        {onButtonClick && (
          <Button onClick={onButtonClick} variant="primary" className="d-flex align-items-center fw-bold">
            <Plus className="me-1" size={16} />
            {buttonLabel}
          </Button>
        )}
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredData}
        pagination
        highlightOnHover
        responsive
        striped
        paginationPerPage={itemsPerPage}
        onChangePage={(page) => setCurrentPage(page)}
      />
    </div>
  );
}

export default Table;
