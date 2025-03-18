// outFields.js
export const outFields = (categories, subcategories) => [
  {
    name: 'category',
    label: 'Select Category',
    type: 'select',
    options: categories,
    placeholder: 'Select Category',
    width: 3,
  },
  {
    name: 'subcategory',
    label: 'Select Subcategory',
    type: 'select',
    options: subcategories,
    placeholder: 'Select Subcategory',
    width: 3,
  },
  {
    name: 'quantity',
    label: 'Quantity',
    type: 'text',
    placeholder: 'Enter Quantity',
    width: 3,
  },
  {
    name: 'date',
    label: 'Return Date',
    type: 'date',
    placeholder: 'Select Return Date',
    width: 3,
  },
  // You can add more material-related fields here if needed.
];
