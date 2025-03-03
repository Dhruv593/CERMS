export const rentFields = (categories, subcategories) => [
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
      name: "rent",
      label: "Rent Amount",
      type: "text",
      placeholder: "Rent Amount",
    },
  ];