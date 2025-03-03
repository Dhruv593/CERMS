export const depositFields = (categories, subcategories) => [
    {
      name: "category",
      label: "Select Category",
      type: "select",
      options: categories,
      placeholder: "Select Category",
    },
    {
      name: "subcategory",
      label: "Select Subcategory",
      type: "select",
      options: subcategories,
      placeholder: "Select Subcategory",
    },
    {
      name: "deposit",
      label: "Deposit Amount",
      type: "text",
      placeholder: "Deposit Amount",
    },
  ];