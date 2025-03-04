import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
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
      </Row>
    </React.Fragment>
  );
};

export default DashAnalytics;
