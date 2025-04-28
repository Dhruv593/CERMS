import React from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBIcon,
  MDBTypography,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
} from "mdb-react-ui-kit";

export default function InvoiceModal({ invoiceData, onClose }) {
  if (!invoiceData) return null;

  const {
    customer,
    receiver,
    payMode,
    deposit,
    cartItems = [],
    in_out_id,
    created_at,
    status
  } = invoiceData;

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.totalAmount || 0), 0);
  };

  const totalAmount = calculateTotal();

  const handlePrint = () => {
    const printContents = document.getElementById('invoice-content').innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  return (
    <MDBContainer className="py-5">
      <MDBCard className="p-4">
        <MDBCardBody id="invoice-content">
          <MDBContainer className="mb-2 mt-3">
            <MDBRow className="d-flex align-items-baseline">
              <MDBCol xl="9">
                <p style={{ color: "#7e8d9f", fontSize: "20px" }}>
                  Invoice &gt; &gt; <strong>ID: #{in_out_id}</strong>
                </p>
              </MDBCol>
              <MDBCol xl="3" className="float-end">
                <MDBBtn
                  color="light"
                  ripple="dark"
                  className="text-capitalize border-0"
                  onClick={handlePrint}
                >
                  <MDBIcon fas icon="print" color="primary" className="me-1" />
                  Print
                </MDBBtn>
                <MDBBtn
                  color="light"
                  ripple="dark"
                  className="text-capitalize border-0 ms-2"
                >
                  <MDBIcon
                    far
                    icon="file-pdf"
                    color="danger"
                    className="me-1"
                  />
                  Export
                </MDBBtn>
                <hr />
              </MDBCol>
            </MDBRow>
          </MDBContainer>
          <MDBRow>
            <MDBCol xl="8">
              <MDBTypography listUnStyled>
                <li className="text-muted">
                  To: <span style={{ color: "#5d9fc5" }}>{customer}</span>
                </li>
                <li className="text-muted">Receiver: {receiver}</li>
                <li className="text-muted">Payment Mode: {payMode}</li>
                <li className="text-muted">
                  Deposit: ₹{deposit}
                </li>
              </MDBTypography>
            </MDBCol>
            <MDBCol xl="4">
              <p className="text-muted">Invoice</p>
              <MDBTypography listUnStyled>
                <li className="text-muted">
                  <MDBIcon fas icon="circle" style={{ color: "#84B0CA" }} />
                  <span className="fw-bold ms-1">ID:</span>#{in_out_id}
                </li>
                <li className="text-muted">
                  <MDBIcon fas icon="circle" style={{ color: "#84B0CA" }} />
                  <span className="fw-bold ms-1">Creation Date: </span>
                  {new Date(created_at).toLocaleDateString()}
                </li>
                <li className="text-muted">
                  <MDBIcon fas icon="circle" style={{ color: "#84B0CA" }} />
                  <span className="fw-bold ms-1">Status:</span>
                  <span className={`badge ${status === 'paid' ? 'bg-success' : 'bg-warning'} text-black fw-bold ms-1`}>
                    {status || 'Unpaid'}
                  </span>
                </li>
              </MDBTypography>
            </MDBCol>
          </MDBRow>
          <MDBRow className="my-2 mx-1 justify-content-center">
            <MDBTable striped borderless>
              <MDBTableHead
                className="text-white"
                style={{ backgroundColor: "#84B0CA" }}
              >
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Category</th>
                  <th scope="col">Subcategory</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Return Date</th>
                </tr>
              </MDBTableHead>
              <MDBTableBody>
                {cartItems.map((item, index) => (
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>{item.category}</td>
                    <td>{item.subcategory}</td>
                    <td>{item.quantity}</td>
                    <td>{item.returnDate}</td>
                  </tr>
                ))}
              </MDBTableBody>
            </MDBTable>
          </MDBRow>
          <MDBRow>
            <MDBCol xl="8">
              <p className="ms-3">
                Thank you for your business
              </p>
            </MDBCol>
            <MDBCol xl="3">
              <MDBTypography listUnStyled>
                <li className="text-muted ms-3">
                  <span className="text-black me-4">Total Amount</span>₹{totalAmount}
                </li>
                <li className="text-muted ms-3 mt-2">
                  <span className="text-black me-4">Deposit</span>₹{deposit}
                </li>
              </MDBTypography>
              <p className="text-black float-start">
                <span className="text-black me-3"> Final Amount</span>
                <span style={{ fontSize: "25px" }}>₹{totalAmount - deposit}</span>
              </p>
            </MDBCol>
          </MDBRow>
          <hr />
          <MDBRow>
            <MDBCol xl="10">
              <p>Thank you for your business</p>
            </MDBCol>
            <MDBCol xl="2">
              <MDBBtn
                className="text-capitalize"
                style={{ backgroundColor: "#60bdf3" }}
              >
                Pay Now
              </MDBBtn>
            </MDBCol>
          </MDBRow>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
}