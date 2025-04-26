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
import ClientDashboard from 'layout/Clientdashboard';
import DashboardLayout from 'layout/Dashboard/index';
import { element } from 'prop-types';
import { Navigate } from 'react-router';
import FreelancerDashboard from 'layout/FreelancerDashboard';
import MyCalendar from 'pages/freelancer/MyCalendar';

const Home = Loadable(lazy(() => import('pages/home/Home')));  // Home Page
const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));


const AuthLogin = Loadable(lazy(() => import('pages/authentication/login')));
const AuthRegister = Loadable(lazy(() => import('pages/authentication/register')));

// Pages du client
const Projects = Loadable(lazy(() => import('pages/client/Projects')));
const MyProjects = Loadable(lazy(() => import('pages/client/MyProjects')));
const Freelancers = Loadable(lazy(() => import('pages/client/Freelancers')));
const Payments = Loadable(lazy(() => import('pages/client/Payments')));
const MyPayments = Loadable(lazy(() => import('pages/client/MyPayments')));
const PaymentSuccess = Loadable(lazy(() => import('pages/client/PaymentSucess')));
const CreateProject = Loadable(lazy(() => import('pages/client/CreateProject')));
const EditProject = Loadable(lazy(() => import('components/project/EditProject')));
const ProjectDetails = Loadable(lazy(() => import('pages/client/ProjectDetails')));
const MakeDeal = Loadable(lazy(() => import('pages/client/MakeDeal')));
const Messages = Loadable(lazy(() => import('pages/messages/chatPage')));


// Pages du freelancer
const MyProjectsFreelancer = Loadable(lazy(() => import('pages/freelancer/MyProjects')));
const CalendarPage = Loadable(lazy(() => import('pages/freelancer/MyCalendar')));
const FreelancerCalendar = Loadable(lazy(() => import('pages/freelancer/FreelancerCalendar')));
const Profile = Loadable(lazy(() => import('pages/freelancer/Profile')));
const Offers = Loadable(lazy(() => import('pages/freelancer/Offers')));


// Pages d'Admin
const CRUDClients = Loadable(lazy(() => import('pages/admin/Clients')));
const CRUDFreelancers = Loadable(lazy(() => import('pages/admin/Freelancers')));
const CRUDProjects = Loadable(lazy(() => import('pages/admin/Projects')));
const CRUDComments = Loadable(lazy(() => import('pages/admin/Comments')));






// ==============================|| MAIN ROUTING ||============================== //


const MainRoutes = {
  path: '/',  // Root path, can either be Home or Dashboard depending on logic
  children: [
    {
      path: '/', // Root path - Home page
      element: <Home />  // Home Page
    },
    {
      path: 'login',  // Login route
      element: <AuthLogin />
    },
    {
      path: 'register',  // Register route
      element: <AuthRegister />
    },
    {
      path: 'client',  // Client dashboard route
      element: <ClientDashboard />,  // Main layout for client routes
      children: [
        { path: 'projects', element: <Projects /> },
        { path: 'my-projects', element: <MyProjects /> },
        { path: 'create-project', element: <CreateProject /> },
        { path: 'edit-project/:projectId', element: <EditProject /> },
        { path: 'projectDetails/:projectId', element: <ProjectDetails /> },
        { path: 'freelancers', element: <Freelancers /> },
        { path: 'my-payments', element: <MyPayments /> },
        { path: 'payments/:freelancerId/:projectId/:price', element: <Payments /> },
        { path: 'payments/success', element: <PaymentSuccess /> },
        { path: 'messages', element: <Messages /> },
        { path: 'messages/:userId', element: <Messages /> },
        { path: 'make-deal/:projectId', element: <MakeDeal /> },
        { path: 'my-calendar/:projectId', element: <CalendarPage /> },
        { path: 'freelancers/my-profile/:id', element: <Profile /> },





      ]
    },
    {
      path: 'freelancer',  // frelancer dashboard route
      element: <FreelancerDashboard />,  // Main layout for freelancer routes
      children: [
        { path: 'projects', element: <Projects /> },
        { path: 'my-projects', element: <MyProjectsFreelancer /> },
        { path: 'my-calendar/:projectId', element: <CalendarPage /> },
        { path: 'freelancer-calendar', element: <FreelancerCalendar /> },
        { path: 'messages', element: <Messages /> },
        { path: 'messages/:userId', element: <Messages /> },
        { path: 'my-profile', element: <Profile /> },
        { path: 'my-offers', element: <Offers /> },



        
      ]
    },
    {
      path: 'dashboard',  // Admin dashboard route
      element: <DashboardLayout />,  // Main layout for admin routes
      children: [
        { path: 'default', element: <DashboardDefault /> }, 
        {
          path: 'sample-page',  // Sample page route
          element: <SamplePage />
        },
        {
          path: 'shadow',  // Shadow page route
          element: <Shadow />
        },
        {
          path: 'crudclients',  
          element: <CRUDClients />
        },
        {
          path: 'crudfreelancers', 
          element: <CRUDFreelancers />
        },
        {
          path: 'crudprojects',  
          element: <CRUDProjects />
        },
        {
          path: 'crudcomments',  
          element: <CRUDComments />
        }
      ]
    },
    
  ]
};

export default MainRoutes;



