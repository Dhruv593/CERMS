export const inFields = (categories = [], subcategories = []) => {
  const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
  return [
    {
      name: 'category',
      label: 'Select Category',
      type: 'select',
      options: categories, // dynamically injected
      placeholder: categories.length > 0 ? 'Select Category' : 'No categories available',
      width: 3,
    },
    {
      name: 'subcategory',
      label: 'Select Subcategory',
      type: 'select',
      options: subcategories, // dynamically injected
      placeholder: subcategories.length > 0 ? 'Select Subcategory' : 'No subcategories available',
      width: 3,
    },
    {
      name: 'invoice',
      label: 'Select Invoice',
      type: 'select',
      options: ['Invoice 1001', 'Invoice 1002'],
      placeholder: 'Select Invoice',
      width: 3,
    },
    {
      name: 'returnQuantity',
      label: 'Return Quantity',
      type: 'text',
      placeholder: 'Enter Return Quantity',
      width: 3,
    },
    {
      name: 'returnDate',
      label: 'Return Date',
      type: 'date',
      placeholder: 'Select Return Date',
      width: 3,
      initialValue: today, // Pre-populate with today's date
    },
  ];
};
