import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import { Button, Form } from 'react-bootstrap';
import { Plus, Edit, Trash2 } from 'lucide-react';
import ImageModal from '@/components/Modal/ImageModal';

export function Table({ buttonLabel = '', onButtonClick, tableHeaders = [], tableData = [], onEdit, onDelete }) {
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const IMG_URL = import.meta.env.VITE_IMG_URL;
  const [showImageModal, setShowImageModal] = useState(false); // NEW
  const [fullScreenImage, setFullScreenImage] = useState('');

  const handleImageClick = (imageUrl) => {
    setFullScreenImage(imageUrl);
    setShowImageModal(true);
  };

  // Normalize table headers to match data keys
  const normalizeKey = (header) => header.toLowerCase().replace(/\s+/g, '_');

  // Process table data
  const processedTableData = tableData.map((row) => {
    let filteredRow = {};
    tableHeaders.forEach((header) => {
      const key = normalizeKey(header);
      filteredRow[key] = row[key] !== undefined && row[key] !== null && row[key] !== '' ? row[key] : '—';
    });

    // Ensure images load properly
    // if (row.stockPhoto) {
    //   filteredRow.stock_photo = (
    //     <img
    //       src={`${IMG_URL}/${row.stockPhoto}`}
    //       alt="Stock"
    //       className="rounded shadow-sm"
    //       style={{ width: "50px", height: "50px", objectFit: "cover" }}
    //     />
    //   );
    // }
    // if (row.billPhoto) {
    //   filteredRow.bill_photo = (
    //     <img
    //       src={`${IMG_URL}/${row.billPhoto}`}
    //       alt="Bill"
    //       className="rounded shadow-sm"
    //       style={{ width: "50px", height: "50px", objectFit: "cover" }}
    //     />
    //   );
    // }
    // if (row.aadharPhoto) {
    //   filteredRow.aadharPhoto = (
    //     <img
    //       src={`${IMG_URL}/${row.aadharPhoto}`}
    //       alt="aadhar"
    //       className="rounded shadow-sm"
    //       style={{ width: "50px", height: "50px", objectFit: "cover" }}
    //     />
    //   );
    // }
    // if (row.other_proof) {
    //   filteredRow.other_proof = (
    //     <img
    //       src={`${IMG_URL}/${row.other_proof}`}
    //       alt="other"
    //       className="rounded shadow-sm"
    //       style={{ width: "50px", height: "50px", objectFit: "cover" }}
    //     />
    //   );
    // }

    // Action buttons
    filteredRow.actions = (
      <div className="d-flex justify-content-center gap-2">
        <Button variant="success" size="sm" onClick={() => onEdit(row)} className="d-flex align-items-center">
          <Edit size={16} />
        </Button>
        <Button variant="danger" size="sm" onClick={() => onDelete(row)} className="d-flex align-items-center">
          <Trash2 size={16} />
        </Button>
      </div>
    );

    return filteredRow;
  });

  // Define columns dynamically
  const columns = [
    { name: '#', selector: (_, index) => (currentPage - 1) * itemsPerPage + index + 1, sortable: false, width: '80px', center: true },
    ...tableHeaders.map((header) => ({
      name: <span style={{ color: '#ffffff', fontWeight: 'bold' }}>{header}</span>,
      selector: (row) => row[normalizeKey(header)] || '—',
      sortable: true,
      cell: (row) =>
        normalizeKey(header).includes('photo') || normalizeKey(header).includes('image') || normalizeKey(header).includes('proof') ? (
          <img
            src={row[normalizeKey(header)]}
            alt="Preview"
            className="rounded shadow-sm"
            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
            onClick={() => handleImageClick(row[normalizeKey(header)])}
          />
        ) : (
          row[normalizeKey(header)] || '—'
        )
    })),
    { name: 'Actions', selector: (row) => row.actions, center: true, width: '180px' }
  ];

  const filteredData = processedTableData.filter((row) =>
    Object.values(row).some((value) => String(value).toLowerCase().includes(searchValue.toLowerCase()))
  );

  return (
    <div className="shadow-sm rounded-lg border p-3 bg-white">
      {/* Search Bar & Button */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-3 gap-3">
        <Form.Control
          type="text"
          placeholder="Search..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="border shadow-sm w-100 w-md-50"
          style={{ maxWidth: '400px' }}
        />
        {onButtonClick && (
          <Button
            onClick={onButtonClick}
            variant="primary"
            className="d-flex align-items-center fw-bold shadow-sm"
            style={{
              minWidth: '150px',
              padding: '10px 15px',
              fontSize: '14px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Plus className="me-1" size={16} /> {buttonLabel}
          </Button>
        )}
      </div>

      {/* Data Table */}
      <div className="rounded overflow-hidden border shadow-sm">
        <DataTable
          columns={columns}
          data={filteredData}
          pagination
          highlightOnHover
          responsive
          striped
          paginationPerPage={itemsPerPage}
          onChangePage={(page) => setCurrentPage(page)}
          className="border rounded"
          customStyles={{
            headRow: {
              style: {
                backgroundColor: '#4a9eff',
                color: '#ffffff',
                fontSize: '14px'
              }
            },
            headCells: {
              style: {
                fontWeight: 'bold'
              }
            },
            rows: {
              style: {
                fontSize: '14px'
              }
            }
          }}
        />
      </div>

      <ImageModal show={showImageModal} onHide={() => setShowImageModal(false)} imageUrl={fullScreenImage} />
    </div>
  );
}

export default Table;
