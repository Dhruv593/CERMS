import React, { Suspense, Fragment, lazy } from 'react';
import { Routes, Navigate, Route } from 'react-router-dom';

// project import
import Loader from './components/Loader/Loader';
import AdminLayout from './layouts/AdminLayout';

import { BASE_URL } from './config/constant';

// ==============================|| ROUTES ||============================== //

const renderRoutes = (routes = []) => (
  <Suspense fallback={<Loader />}>
    <Routes>
      {routes.map((route, i) => {
        const Guard = route.guard || Fragment;
        const Layout = route.layout || Fragment;
        const Element = route.element;

        return (
          <Route
            key={i}
            path={route.path}
            exact={route.exact}
            element={
              <Guard>
                <Layout>{route.routes ? renderRoutes(route.routes) : <Element props={true} />}</Layout>
              </Guard>
            }
          />
        );
      })}
    </Routes>
  </Suspense>
);

export const routes = [
  {
    exact: 'true',
    path: '/auth/signin-1',
    element: lazy(() => import('./views/auth/signin/SignIn1'))
  },
  
  {
    path: '*',
    layout: AdminLayout,
    routes: [
      {
        exact: 'true',
        path: '/app/dashboard/analytics',
        element: lazy(() => import('./views/dashboard'))
      },
      {
        exact: 'true',
        path: '/master/category',
        element: lazy(() => import('./views/master/Category'))
      },
      {
        exact: 'true',
        path: '/master/subcategory',
        element: lazy(() => import('./views/master/Subcategory'))
      },
      {
        exact: 'true',
        path: '/master/stock',
        element: lazy(() => import('./views/master/Stock'))
      },
      {
        exact: 'true',
        path: '/master/rent',
        element: lazy(() => import('./views/master/Rent'))
      },

      {
        exact: 'true',
        path: '/master/deposit',
        element: lazy(() => import('./views/master/Deposit'))
      },
      {
        exact: 'true',
        path: '/master/customer',
        element: lazy(() => import('./views/master/Customer'))
      },
      {
        exact: 'true',
        path: '/basic/tooltip-popovers',
        element: lazy(() => import('./views/ui-elements/BasicTooltipsPopovers'))
      },
      {
        exact: 'true',
        path: '/sample-page',
        element: lazy(() => import('./views/extra/SamplePage'))
      },
      {
        exact: 'true',
        path: '/sidebartest',
        element: lazy(() => import('./views/extra/Sidebartest'))
      },
      {
        path: '*',
        exact: 'true',
        element: () => <Navigate to={BASE_URL} />
      }
    ]
  }
];

export default renderRoutes;
