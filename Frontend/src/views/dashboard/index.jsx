import React, { useEffect, useState } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import OrderCard from '@/components/Widgets/Statistic/OrderCard';
import { fetchDashboardStats } from '@/api/dashboardApi';
// Import Lucide icons
import { 
  Layers, 
  Grid, 
  Package, 
  PackageCheck, 
  ShoppingBag, 
  CreditCard,
  Truck,
  PackageOpen
} from 'lucide-react';

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
      {/* Rental Action Section - Full Width Buttons with Lucide Icons */}
      <Row className="mb-4 gx-4">
        <Col xs={12} md={6} className="mb-2">
          <Button
            variant="success"
            className="fw-bold py-3 fs-5 shadow-sm w-100 d-flex align-items-center justify-content-center gap-2"
            onClick={() => navigate('/rentals/in')}
          >
            <Truck size={24} />
            <span>IN - Incoming Rentals</span>
          </Button>
        </Col>
        <Col xs={12} md={6} className="mb-2">
          <Button
            variant="danger"
            className="fw-bold py-3 fs-5 shadow-sm w-100 d-flex align-items-center justify-content-center gap-2"
            onClick={() => navigate('/rentals/out')}
          >
            <PackageOpen size={24} />
            <span>OUT - Outgoing Rentals</span>
          </Button>
        </Col>
      </Row>

      {/* Order Cards Section with Lucide icons */}
      <Row>
        <Col md={6} xl={3}>
          <div onClick={() => navigate('/master/category')} style={{ cursor: 'pointer' }}>
            <OrderCard
              params={{
                title: 'Total Categories',
                class: 'bg-c-blue',
                icon: <Layers size={24} />,
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
                icon: <Grid size={24} />,
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
                icon: <Package size={24} />,
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
                title: 'Available Stock',
                class: 'bg-c-red',
                icon: <PackageCheck size={24} />,
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
                icon: <ShoppingBag size={24} />,
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
                class: 'bg-c-blue',
                icon: <CreditCard size={24} />,
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