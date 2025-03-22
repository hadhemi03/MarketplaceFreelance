/*import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import Dashboard from 'layout/Dashboard';

const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <Dashboard />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'color',
      element: <Color />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'sample-page',
      element: <SamplePage />
    },
    {
      path: 'shadow',
      element: <Shadow />
    },
    {
      path: 'typography',
      element: <Typography />
    }
  ]
};

export default MainRoutes;*/






// / is home page and when the user login he goes to dashoard par default

/*import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// project import
import Loadable from 'components/Loadable';
import Dashboard from 'layout/Dashboard';

// Lazy-loaded pages
const Home = Loadable(lazy(() => import('pages/home/Home')));  // Add Home Page
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));
const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));

// Check if user is logged in
const isAuthenticated = () => {
  return localStorage.getItem("currentUser") !== null; // Change based on your auth logic
};

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: isAuthenticated() ? <Dashboard /> : <Home />,  // Show Home if not logged in
  children: [
    {
      path: '/',
      element: isAuthenticated() ? <Navigate to="/dashboard/default" /> : <Home />
    },
    {
      path: 'dashboard',
      element: isAuthenticated() ? <Dashboard /> : <Navigate to="/" />,
      children: [
        {
          path: 'default',
          element: isAuthenticated() ? <DashboardDefault /> : <Navigate to="/" />
        }
      ]
    },
    {
      path: 'color',
      element: isAuthenticated() ? <Color /> : <Navigate to="/" />
    },
    {
      path: 'sample-page',
      element: isAuthenticated() ? <SamplePage /> : <Navigate to="/" />
    },
    {
      path: 'shadow',
      element: isAuthenticated() ? <Shadow /> : <Navigate to="/" />
    },
    {
      path: 'typography',
      element: isAuthenticated() ? <Typography /> : <Navigate to="/" />
    }
  ]
};

export default MainRoutes;*/



import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import Dashboard from 'layout/Dashboard';

const Home = Loadable(lazy(() => import('pages/home/Home')));  // Home Page
const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  children: [
    {
      path: '/', // Root path, can either be Home or Dashboard depending on logic
      element: <Home /> // Make Home the root element for the main route
    },
    {
      path: 'dashboard',
      element: <Dashboard />, // Dashboard route
      children: [
        {
          path: 'default',
          element: <DashboardDefault /> // Default dashboard page
        }
      ]
    },
    {
      path: 'color',
      element: <Color />
    },
    {
      path: 'sample-page',
      element: <SamplePage />
    },
    {
      path: 'shadow',
      element: <Shadow />
    },
    {
      path: 'typography',
      element: <Typography />
    }
  ]
};

export default MainRoutes;


