export const outFields = () => [
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
    name: 'quantity',
    label: 'Quantity',
    type: 'text',
    placeholder: 'Enter Quantity',
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
