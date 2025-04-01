import React from "react";
import { Modal, Button, Row, Col, Card, Table } from "react-bootstrap";

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
            <div className="table-responsive">
              <Table striped bordered hover className="text-center">
                <thead className="thead-dark">
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
                      <th>Deposit Return</th>
                      <th>Rent</th>
                      <th>Total Days</th>
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
                          <td>{item.date ? item.date.split("T")[0] : "N/A"}</td>
                        </>
                      ) : (
                        <>
                          <td>{item.return_quantity}</td>
                          <td>{item.return_date ? item.return_date.split("T")[0] : "N/A"}</td>
                          <td>{item.invoice || "N/A"}</td>
                          <td>{item.amount || "N/A"}</td>
                          <td>{item.deposit || "N/A"}</td>
                          <td>{item.rent || "N/A"}</td>
                          <td>{item.totalDays || "N/A"}</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
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
