import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import { Plus } from "lucide-react";

export function Tables({
  headerTitle = "",
  buttonLabel = "",
  onButtonClick,         // optional callback for the header button
  searchProps,           // optional object: { value, onChange, placeholder }
  tableHeaders = [],     // array of header strings (e.g., ["Category", "Subcategory", ...])
  tableData = [],        // array of data objects (each row)
  renderRow,             // optional custom function: (row, index) => JSX.Element
}) {
  // *** Pagination State and Logic ***
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(tableData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentData = tableData.slice(startIndex, startIndex + pageSize);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="mt-8">
      <Card className="border border-gray-300 shadow-sm">
        {/* Card Header */}
        <CardHeader className="flex justify-between items-center p-4 bg-[#2C2C2C]">
          <Typography variant="h5" className="text-white font-semibold">
            {headerTitle}
          </Typography>
          {onButtonClick && (
            <button
              onClick={onButtonClick}
              className="flex items-center bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
            >
              <Plus className="mr-1" />
              {buttonLabel}
            </button>
          )}
        </CardHeader>

        {/* Separate Search Bar */}
        {searchProps && (
          <div className="px-4 pt-4">
            <input
              type="text"
              value={searchProps.value}
              onChange={searchProps.onChange}
              placeholder={searchProps.placeholder || "Search..."}
              className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
        )}

        {/* Card Body containing the table */}
        <CardBody className="p-4 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-300 bg-gray-200">
                {tableHeaders.map((col, index) => (
                  <th
                    key={index}
                    className="px-4 py-3 text-base font-bold text-gray-800 uppercase tracking-wide"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentData.map((row, index) =>
                renderRow ? (
                  renderRow(row, index)
                ) : (
                  <tr key={index} className="border-b hover:bg-gray-100 transition">
                    {tableHeaders.map((col, j) => (
                      <td key={j} className="px-2 py-2">
                        {row[col.toLowerCase()]}
                      </td>
                    ))}
                  </tr>
                )
              )}
            </tbody>
          </table>
        </CardBody>
        {/* Pagination Controls */}
        <div className="p-4 flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="bg-gray-200 text-gray-700 px-3 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <Typography variant="small" className="text-gray-700">
            Page {currentPage} of {totalPages}
          </Typography>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="bg-gray-200 text-gray-700 px-3 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </Card>
    </div>
  );
}

export default Tables;
