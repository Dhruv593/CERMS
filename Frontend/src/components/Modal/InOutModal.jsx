import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col, Card, Table as BootstrapTable } from 'react-bootstrap';

const InOutModal = ({
  show,
  onClose,
  initialData,
  onSubmit,
  mode, // 'in' or 'out'
  cartFields, // Array of field definitions from inFields.js or outFields.js
  customers,
  payModes,
  getDepositRate,
  onCategoryChange
}) => {
  // Main modal fields
  const [customer, setCustomer] = useState(initialData?.customer || '');
  const [payMode, setPayMode] = useState(initialData?.payMode || '');
  // Cart items state
  const [cartItems, setCartItems] = useState(initialData?.cartItems || []);
  
  // Build initial state for cart form based on provided cartFields.
  const initialCartState = {};
  cartFields.forEach(field => {
    if (field.type === 'date' && field.name === 'returnDate') {
      const today = new Date();
      today.setMonth(today.getMonth() + 1);
      initialCartState[field.name] = today.toISOString().split('T')[0];
    } else {
      initialCartState[field.name] = '';
    }
  });
  const [cartForm, setCartForm] = useState(initialCartState);

  // Handle cart form field change
  const handleCartFieldChange = (e, fieldName) => {
    if(fieldName === 'category'){
      console.log(e.target.value);
      const categoryValue = e.target.value;
      if (onCategoryChange) {
        onCategoryChange(categoryValue);
      }
    }
    setCartForm({ ...cartForm, [fieldName]: e.target.value });
  };

  // Handler to add cart item
  const handleAddCartItem = () => {
    // Validate required fields
    for (const field of cartFields) {
      if (!cartForm[field.name]) {
        alert(`Please fill ${field.label}`);
        return;
      }
    }
    setCartItems([...cartItems, cartForm]);
    setCartForm(initialCartState);
  };

  // Handler to delete a cart item
  const handleDeleteCartItem = (index) => {
    const newCart = [...cartItems];
    newCart.splice(index, 1);
    setCartItems(newCart);
  };

  // Dummy summary calculation (example only)
  const summary = {
    totalAmount: cartItems.reduce((sum, item) => {
      const rate = getDepositRate ? getDepositRate(item.category, item.subcategory) : 0;
      const qty = mode === 'in' ? Number(item.returnQuantity) : Number(item.quantity);
      return sum + rate * qty;
    }, 0)
  };

  // For mode "in", if category and subcategory are selected, render a card.
  // Replace the pending value with your actual pending data.
  const renderSubcategoryCard = () => {
    if (mode === 'in' && cartForm.category && cartForm.subcategory) {
      // Dummy pending value
      const pending = 50; 
      return (
        <Card className="mb-3">
          <Card.Body>
            <Card.Title>{cartForm.subcategory}</Card.Title>
            <Card.Text>
              Pending: {pending}
            </Card.Text>
          </Card.Body>
        </Card>
      );
    }
    return null;
  };

  // Define table columns based on mode
  let tableColumns = [];
  if (mode === 'in') {
    tableColumns = [
      { label: '#', key: 'index' },
      { label: 'Category', key: 'category' },
      { label: 'Subcategory', key: 'subcategory' },
      { label: 'Invoice', key: 'invoice' },
      { label: 'Return Quantity', key: 'returnQuantity' },
      { label: 'Return Date', key: 'returnDate' },
      { label: 'Total Days', key: 'totalDays' },
      { label: 'Rent', key: 'rent' },
      { label: 'Deposit', key: 'deposit' },
      { label: 'Action', key: 'action' }
    ];
  } else {
    tableColumns = [
      { label: '#', key: 'index' },
      { label: 'Category', key: 'category' },
      { label: 'Subcategory', key: 'subcategory' },
      { label: 'Quantity', key: 'quantity' },
      { label: 'Return Date', key: 'returnDate' },
      { label: 'Action', key: 'action' }
    ];
  }

  // Final submit handler
  const handleSubmit = () => {
    const data = {
      customer,
      payMode,
      cartItems,
      summary
    };
    onSubmit(data);
  };

  return (
    <Modal show={show} onHide={onClose} size="xl" centered style={{ maxWidth: '95%' }}>
      <Modal.Header closeButton style={{ backgroundColor: '#f8f9fa' }}>
        <Modal.Title>{initialData ? `Edit ${mode.toUpperCase()}` : `Add ${mode.toUpperCase()}`}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* Cart Section */}
          <h5 className="mb-3">Material Information</h5>
          <Row className="mb-3">
          <Col xs={12} md={6}>
              <Form.Group controlId="customer">
                <Form.Label>Select Customer</Form.Label>
                <Form.Control
                  as="select"
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                >
                  <option value="">Select Customer</option>
                  {customers.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            {cartFields.map(field => (
              <Col xs={12} md={field.width || 3} key={field.name}>
                <Form.Group controlId={`cart_${field.name}`}>
                  <Form.Label>{field.label}</Form.Label>
                  {field.type === 'select' ? (
                    <Form.Control 
                      as="select"
                      value={cartForm[field.name]}
                      onChange={(e) => handleCartFieldChange(e, field.name)}
                    >
                      <option value="">{field.placeholder || `Select ${field.label}`}</option>
                      {field.options && field.options.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </Form.Control>
                  ) : (
                    <Form.Control 
                      type={field.type}
                      value={cartForm[field.name]}
                      onChange={(e) => handleCartFieldChange(e, field.name)}
                      placeholder={field.placeholder || ''}
                    />
                  )}
                </Form.Group>
              </Col>
            ))}
            <Col xs={12} md={2} className="d-flex align-items-end justify-content-center mt-3">
              <Button variant="primary" onClick={handleAddCartItem}>Update</Button>
            </Col>
          </Row>

          {/* Render subcategory card if available */}
          {renderSubcategoryCard()}

          {/* Cart Table */}
          {cartItems.length > 0 && (
            <div className="table-responsive mb-3">
              <BootstrapTable striped bordered hover>
                <thead>
                  <tr>
                    {tableColumns.map(col => <th key={col.key}>{col.label}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      {mode === 'in' ? (
                        <>
                          <td>{item.category}</td>
                          <td>{item.subcategory}</td>
                          <td>{item.invoice}</td>
                          <td>{item.returnQuantity}</td>
                          <td>{item.returnDate}</td>
                          <td>{/* totalDays placeholder */}</td>
                          <td>{/* rent placeholder */}</td>
                          <td>{/* deposit placeholder */}</td>
                        </>
                      ) : (
                        <>
                          <td>{item.category}</td>
                          <td>{item.subcategory}</td>
                          <td>{item.quantity}</td>
                          <td>{item.returnDate}</td>
                        </>
                      )}
                      <td>
                        <Button variant="danger" size="sm" onClick={() => handleDeleteCartItem(index)}>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </BootstrapTable>
            </div>
          )}

          <hr />

          {/* Main Fields Section */}
          <Row className="mb-3">
            <Col xs={12} md={6}>
              <Form.Group controlId="payMode">
                <Form.Label>Payment Mode</Form.Label>
                <Form.Control
                  as="select"
                  value={payMode}
                  onChange={(e) => setPayMode(e.target.value)}
                >
                  <option value="">Select Payment Mode</option>
                  {payModes.map(pm => (
                    <option key={pm} value={pm}>{pm}</option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Form.Group controlId="summary">
            <Form.Label>Deposit</Form.Label>
            <Form.Control
              type="text"
              value={summary.totalAmount || ''}
              readOnly
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="justify-content-end">
        <Button variant="secondary" onClick={onClose}>Close</Button>
        <Button variant="primary" onClick={handleSubmit}>Submit</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default InOutModal;
