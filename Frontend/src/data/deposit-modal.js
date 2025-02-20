export const depositFields = [
    {
      name: "deposit_date",
      label: "Deposit Date",
      type: "datetime-local",
      placeholder: "Select Deposit Date"
    },
    {
      name: "deposit_amount",
      label: "Deposit Amount",
      type: "number",
      placeholder: "Enter Deposit Amount"
    },
    {
      name: "payment_method",
      label: "Payment Method",
      type: "select",
      options: ["Bank", "Cash", "Cheque", "Online Transfer"],
      placeholder: "Select Payment Method"
    },
    {
      name: "reference_number",
      label: "Reference Number",
      type: "text",
      placeholder: "Enter Reference Number (Optional)"
    },
    {
      name: "depositor_name",
      label: "Depositor Name",
      type: "text",
      placeholder: "Enter Depositor Name"
    },
    {
      name: "account_details",
      label: "Account Details",
      type: "text",
      placeholder: "Enter Account/Branch Details (Optional)"
    },
    {
      name: "remarks",
      label: "Remarks",
      type: "textarea",
      placeholder: "Any additional remarks (Optional)"
    }
  ];
  
  //     name: "category",
  //     label: "Select Category",
  //     type: "select",
  //     options: ["Category 1", "Category 2"],
  //     placeholder: "Select Category",
  //   },
  //   {
  //     name: "subcategory",
  //     label: "Select Subcategory",
  //     type: "select",
  //     options: ["Subcategory 1", "Subcategory 2"],
  //     placeholder: "Select Subcategory",
  //   },
  //   { name: "deposit", label: "Deposit", type: "text", placeholder: "Deposit" },
    
  // ];
