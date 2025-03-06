import React, { useEffect, useState } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import OrderCard from '@/components/Widgets/Statistic/OrderCard';
import { fetchDashboardStats } from '@/api/dashboardApi';

const DashAnalytics = () => {
  const [stats, setStats] = useState({
    totalCategories: 0,
    totalSubcategories: 0,
    totalStock: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const getStats = async () => {
      const data = await fetchDashboardStats();
      setStats(data);
    };
    getStats();
  }, []);

  return (
    <React.Fragment>
      {/* Rental Action Section */}
      <Row className="mb-4 text-center">
        
        <Col xs={12} sm={6} className="d-flex justify-content-center mb-2">
          <Button
            variant="success"
            className="fw-bold px-5 py-3 fs-5 shadow-md"
            onClick={() => navigate('/rentals/in')}
          >
            🚛 IN - Incoming Rentals
          </Button>
        </Col>
        <Col xs={12} sm={6} className="d-flex justify-content-center mb-2">
          <Button
            variant="danger"
            className="fw-bold px-5 py-3 fs-5 shadow-md"
            onClick={() => navigate('/rentals/out')}
          >
            📦 OUT - Outgoing Rentals
          </Button>
        </Col>
      </Row>

      {/* Order Cards Section */}
      <Row>
        <Col md={6} xl={3}>
          <div onClick={() => navigate('/master/category')} style={{ cursor: 'pointer' }}>
            <OrderCard
              params={{
                title: 'Total Categories',
                class: 'bg-c-blue',
                icon: 'feather icon-layers',
                primaryText: stats.totalCategories,
                secondaryText: 'Available Categories',
                extraText: ''
              }}
            />
          </div>
        </Col>
        <Col md={6} xl={3}>
          <div onClick={() => navigate('/master/subcategory')} style={{ cursor: 'pointer' }}>
            <OrderCard
              params={{
                title: 'Total Subcategories',
                class: 'bg-c-green',
                icon: 'feather icon-grid',
                primaryText: stats.totalSubcategories,
                secondaryText: 'Available Subcategories',
                extraText: ''
              }}
            />
          </div>
        </Col>
        <Col md={6} xl={3}>
          <div onClick={() => navigate('/master/stock')} style={{ cursor: 'pointer' }}>
            <OrderCard
              params={{
                title: 'Total Stock',
                class: 'bg-c-yellow',
                icon: 'feather icon-box',
                primaryText: stats.totalStock,
                secondaryText: 'In Inventory',
                extraText: ''
              }}
            />
          </div>
        </Col>
        <Col md={6} xl={3}>
          <div onClick={() => navigate()} style={{ cursor: 'pointer' }}>
            <OrderCard
              params={{
                title: 'Avilable Stock',
                class: 'bg-c-red',
                icon: 'feather icon-box',
                primaryText: "545",
                secondaryText: 'In Inventory',
                extraText: ''
              }}
            />
          </div>
        </Col>
        <Col md={6} xl={3}>
          <div onClick={() => navigate()} style={{ cursor: 'pointer' }}>
            <OrderCard
              params={{
                title: 'Rented Stock',
                class: 'bg-c-yellow',
                icon: 'feather icon-box',
                primaryText: "876",
                secondaryText: 'Customer Inventory',
                extraText: ''
              }}
            />
          </div>
        </Col>
        <Col md={6} xl={3}>
          <div onClick={() => navigate()} style={{ cursor: 'pointer' }}>
            <OrderCard
              params={{
                title: 'Pending Payments',
                class: 'bg-c-red',
                icon: 'feather icon-box',
                primaryText: "₹1,23,456",
                secondaryText: 'Customer Payments',
                extraText: ''
              }}
            />
          </div>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default DashAnalytics;
