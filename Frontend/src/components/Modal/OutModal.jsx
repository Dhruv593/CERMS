import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col, Table as BootstrapTable } from 'react-bootstrap';

const OutModal = ({
  show,
  onClose,
  initialData,
  onSubmit,
  categories,
  subcategories,
  renters,
  payModes,
  getDepositRate
}) => {
  // Main modal fields
  const [renter, setRenter] = useState(initialData?.renter || '');
  const [payMode, setPayMode] = useState(initialData?.payMode || '');
  // Cart items (material information)
  const [cartItems, setCartItems] = useState(initialData?.cartItems || []);
  
  // Fields for adding a new cart item
  const [cartCategory, setCartCategory] = useState('');
  const [cartSubcategory, setCartSubcategory] = useState('');
  const [cartQuantity, setCartQuantity] = useState('');
  // Set default return date to one month from today
  const [cartReturnDate, setCartReturnDate] = useState(() => {
    const today = new Date();
    today.setMonth(today.getMonth() + 1);
    // Convert to ISO string and take the date portion (YYYY-MM-DD)
    return today.toISOString().split('T')[0];
  });

  // Compute total deposit from cart items
  const totalDeposit = cartItems.reduce((sum, item) => {
    const rate = getDepositRate ? getDepositRate(item.category, item.subcategory) : 0;
    return sum + rate * Number(item.quantity);
  }, 0);

  // Handler to add a cart item
  const handleAddCartItem = () => {
    if (!cartCategory || !cartSubcategory || !cartQuantity || !cartReturnDate) {
      alert('Please fill all material information fields.');
      return;
    }
    const newItem = {
      category: cartCategory,
      subcategory: cartSubcategory,
      quantity: cartQuantity,
      returnDate: cartReturnDate
    };
    setCartItems([...cartItems, newItem]);
    // Clear fields after adding and reset the return date to default (1 month from today)
    setCartCategory('');
    setCartSubcategory('');
    setCartQuantity('');
    setCartReturnDate(() => {
      const today = new Date();
      today.setMonth(today.getMonth() + 1);
      return today.toISOString().split('T')[0];
    });
  };

  // Handler to delete a cart item by index
  const handleDeleteCartItem = (index) => {
    const newCart = [...cartItems];
    newCart.splice(index, 1);
    setCartItems(newCart);
  };

  // Final submit handler
  const handleSubmit = () => {
    const data = {
      renter,
      payMode,
      totalDeposit,
      cartItems
    };
    onSubmit(data);
  };

  return (
    <Modal show={show} onHide={onClose} size="xl" centered style={{ maxWidth: '95%' }}>
      <Modal.Header closeButton style={{ backgroundColor: '#f8f9fa' }}>
        <Modal.Title>{initialData ? 'Edit Out' : 'Add Out'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* Material Information / Cart Section */}
          <h5 className="mb-3">Material Information</h5>
          <Row className="mb-3">
            <Col xs={12} md={3}>
              <Form.Group controlId="cartCategory">
                <Form.Label>Select Category</Form.Label>
                <Form.Control
                  as="select"
                  value={cartCategory}
                  onChange={(e) => setCartCategory(e.target.value)}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col xs={12} md={3}>
              <Form.Group controlId="cartSubcategory">
                <Form.Label>Select Subcategory</Form.Label>
                <Form.Control
                  as="select"
                  value={cartSubcategory}
                  onChange={(e) => setCartSubcategory(e.target.value)}
                >
                  <option value="">Select Subcategory</option>
                  {subcategories.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col xs={12} md={2}>
              <Form.Group controlId="cartQuantity">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="text"
                  value={cartQuantity}
                  onChange={(e) => setCartQuantity(e.target.value)}
                  placeholder="Quantity"
                />
              </Form.Group>
            </Col>
            <Col xs={12} md={3}>
              <Form.Group controlId="cartReturnDate">
                <Form.Label>Return Date</Form.Label>
                <Form.Control
                  type="date"
                  value={cartReturnDate}
                  onChange={(e) => setCartReturnDate(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col xs={12} md={1} className="d-flex align-items-end justify-content-center">
              <Button variant="primary" onClick={handleAddCartItem}>
                Add
              </Button>
            </Col>
          </Row>

          {/* Cart Table */}
          {cartItems.length > 0 && (
            <div className="table-responsive mb-3">
              <BootstrapTable striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Category</th>
                    <th>Subcategory</th>
                    <th>Quantity</th>
                    <th>Return Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.category}</td>
                      <td>{item.subcategory}</td>
                      <td>{item.quantity}</td>
                      <td>{item.returnDate}</td>
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
          <Row>
            <Col xs={12} md={6}>
              <Form.Group controlId="renter">
                <Form.Label>Select Renter (Customer Name)</Form.Label>
                <Form.Control
                  as="select"
                  value={renter}
                  onChange={(e) => setRenter(e.target.value)}
                >
                  <option value="">Select Renter</option>
                  {renters.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col xs={12} md={6}>
              <Form.Group controlId="payMode">
                <Form.Label>Payment Mode</Form.Label>
                <Form.Control
                  as="select"
                  value={payMode}
                  onChange={(e) => setPayMode(e.target.value)}
                >
                  <option value="">Select Payment Mode</option>
                  {payModes.map((pm) => (
                    <option key={pm} value={pm}>
                      {pm}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Form.Group controlId="totalDeposit">
            <Form.Label>Total Deposit</Form.Label>
            <Form.Control type="text" value={totalDeposit} readOnly />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="justify-content-end">
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OutModal;
