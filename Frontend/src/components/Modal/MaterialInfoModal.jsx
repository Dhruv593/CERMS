import React from 'react';
import { Modal, Button, Row, Col, Card, Table } from 'react-bootstrap';

const MaterialInfoModal = ({ show, onClose, materialData, mode }) => {
  if (!show || !materialData || materialData.length === 0) return null;

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Material Information</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Card>
          <Card.Body>
            <Row>
              <Col>
                <Table striped bordered hover>
                  <thead>
                    {mode === "out" ? (
                      <tr>
                        <th>S.No.</th>
                        <th>Category</th>
                        <th>Subcategory</th>
                        <th>Quantity</th>
                        <th>Return Date</th>
                      </tr>
                    ) : (
                      <tr>
                        <th>S.No.</th>
                        <th>Category</th>
                        <th>Subcategory</th>
                        <th>Return Quantity</th>
                        <th>Return Date</th>
                        <th>Invoice</th>
                        <th>Total Amount</th>
                        <th>Rent</th>
                      </tr>
                    )}
                  </thead>
                  <tbody>
                    {materialData.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.category}</td>
                        <td>{item.subcategory}</td>
                        {mode === "out" ? (
                          <>
                            <td>{item.quantity}</td>
                            <td>{item.date ? item.date.split('T')[0] : 'N/A'}</td>
                          </>
                        ) : (
                          <>
                            <td>{item.returnQuantity}</td>
                            <td>{item.returnDate ? item.returnDate.split('T')[0] : 'N/A'}</td>
                            <td>{item.invoice || 'N/A'}</td>
                            <td>{item.totalAmount || 'N/A'}</td>
                            <td>{item.rent || 'N/A'}</td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MaterialInfoModal;


// import React from 'react';
// import { Modal, Button, Row, Col, Card, Table } from 'react-bootstrap';

// const MaterialInfoModal = ({ show, onClose, materialData }) => {
//   if (!show || !materialData || materialData.length === 0) return null;

//   return (
//     <Modal show={show} onHide={onClose} centered>
//       <Modal.Header closeButton>
//         <Modal.Title>Material Information</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <Card>
//           <Card.Body>
//             <Row>
//               <Col>
//                 <Table striped bordered hover>
//                   <thead>
//                     <tr>
//                       <th>S.No.</th>  {/* Serial Number Column */}
//                       <th>Category</th>
//                       <th>Subcategory</th>
//                       <th>Quantity</th>
//                       <th>Return Date</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {materialData.map((item, index) => (
//                       <tr key={index}>
//                         <td>{index + 1}</td>  {/* Serial Number */}
//                         <td>{item.category}</td>
//                         <td>{item.subcategory}</td>
//                         <td>{item.quantity}</td>
//                         <td>{item.date ? item.date.split('T')[0] : 'N/A'}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </Table>
//               </Col>
//             </Row>
//           </Card.Body>
//         </Card>
//       </Modal.Body>
//       <Modal.Footer>
//         <Button variant="secondary" onClick={onClose}>
//           Close
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );
// };

// export default MaterialInfoModal;
