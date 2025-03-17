export const stockFields = (categories, subcategoriesdata) => [
  {
    name: 'category',
    label: 'Select Category',
    type: 'select',
    options: categories,
    placeholder: 'Select Category'
  },
  {
    name: 'subcategory',
    label: 'Select Subcategory',
    type: 'select',
    options: subcategoriesdata,
    placeholder: 'Select Subcategory'
  },
  { name: 'partyName', label: 'Party Name', type: 'text', placeholder: 'Party Name' },
  { name: 'partyContact', label: 'Party Contact Number', type: 'tel', placeholder: 'Contact Number' },
  { name: 'purchaseFrom', label: 'Purchase From', type: 'text', placeholder: 'Purchased From' },
  { name: 'purchaseDateTime', label: 'Purchase Date & Time', type: 'datetime-local' },
  {
    name: 'purchaseQuantity',
    label: 'Purchase Quantity',
    type: 'text',
    placeholder: 'Select Quantity'
  },
  {
    name: 'paymentMode',
    label: 'Payment Mode',
    type: 'select',
    options: ['Cash', 'Online', 'Cheque'],
    placeholder: 'Select Payment Mode'
  },
  {
    name: 'transportInclude',
    label: 'Transport Include',
    type: 'select',
    options: ['Yes', 'No'],
    placeholder: 'Select'
  },
  { name: 'stockPhoto', label: 'Upload Stock Photo', type: 'file' },
  { name: 'billPhoto', label: 'Upload Bill Photo', type: 'file' },
  { name: 'remarks', label: 'Remarks', type: 'textarea', placeholder: 'Remarks (Optional)' }
];
