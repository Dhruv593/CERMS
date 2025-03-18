export const outMainFields = (customers, payModes) => [
  {
    name: 'receiver',
    label: 'Receiver Name',
    type: 'text',
    placeholder: 'Receiver Name',
    width: 4,
  },
  {
    name: 'payMode',
    label: 'Payment Mode',
    type: 'select',
    options: payModes, 
    placeholder: 'Select Payment Mode',
    width: 4,
  },
  {
    name: 'aadharPhoto',
    label: 'Aadhar Photo',
    type: 'file',
    width: 4,
  },
  {
    name: 'other_proof',
    label: 'Other Proof',
    type: 'file',
    width: 4,
  },
  {
    name: 'deposit',
    label: 'Deposit',
    type: 'text',
    readOnly: true,
    width: 4,
  },
  {
    name: 'remark',
    label: 'Remark',
    type: 'textarea',
    placeholder: 'Enter remarks...',
    width: 12,
  },
];
