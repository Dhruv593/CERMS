import React, { useEffect, useState } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import OrderCard from '@/components/Widgets/Statistic/OrderCard';
import { fetchDashboardStats } from '@/api/dashboardApi';
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
      {/* Full-width Status Card */}
      <div className="mb-4 p-3 p-md-4 rounded-3" 
           style={{ 
             backgroundColor: 'rgba(173, 216, 230, 0.15)',
             border: '1px solid rgba(0, 0, 0, 0.1)'
           }}>
        <Row className="align-items-center g-3">
          {/* Left Side Text Content */}
          <Col md={8} xs={12}>
            <div className="text-md-start text-center">
              <h4 className="fw-bold mb-2 text-primary">Rental Operations Dashboard</h4>
              <p className="text-muted mb-0">
                Manage incoming and outgoing rental transactions. Track real-time 
                status and initiate new operations with one click.
              </p>
            </div>
          </Col>

          {/* Right Side Buttons */}
          <Col md={4} xs={12}>
            <div className="d-flex flex-md-row flex-column gap-2 justify-content-md-end justify-content-center">
              <Button
                variant="success"
                className="fw-bold py-2 px-3 d-flex align-items-center gap-2 text-center"
                onClick={() => navigate('/rentals/in')}
              >
                <Truck size={20} />
                <span>IN - Incoming</span>
              </Button>
              
              <Button
                variant="danger"
                className="fw-bold py-2 px-3 d-flex align-items-center gap-2 text-center"
                onClick={() => navigate('/rentals/out')}
              >
                <PackageOpen size={20} />
                <span>OUT - Outgoing</span>
              </Button>
            </div>
          </Col>
        </Row>
      </div>

      {/* Order Cards Grid */}
      <Row>
        <Col md={6} xl={3} className="mb-2">
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

        <Col md={6} xl={3} className="mb-2">
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

        <Col md={6} xl={3} className="mb-2">
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

        <Col md={6} xl={3} className="mb-2">
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

        <Col md={6} xl={3} className="mb-2">
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

        <Col md={6} xl={3} className="mb-2">
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
