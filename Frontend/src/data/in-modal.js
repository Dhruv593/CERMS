export const inFields = () => [
  {
    name: 'category',
    label: 'Select Category',
    type: 'select',
    options: ['Category 1', 'Category 2'],
    placeholder: 'Select Category',
    width: 3
  },
  {
    name: 'subcategory',
    label: 'Select Subcategory',
    type: 'select',
    options: ['Subcategory 1', 'Subcategory 2'],
    placeholder: 'Select Subcategory',
    width: 3
  },
  {
    name: 'invoice',
    label: 'Select Invoice',
    type: 'select',
    options: ['Invoice 1001', 'Invoice 1002'],
    placeholder: 'Select Invoice',
    width: 3
  },
  {
    name: 'returnQuantity',
    label: 'Return Quantity',
    type: 'text',
    placeholder: 'Enter Return Quantity',
    width: 3
  },
  {
    name: 'returnDate',
    label: 'Return Date',
    type: 'date',
    placeholder: 'Select Return Date',
    width: 3
  }
];
