// assets
import { DashboardOutlined } from '@ant-design/icons';

// icons
const icons = {
  DashboardOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const clientdashboard = {
  id: 'group-dashboard',
  title: 'Dashboard',
  type: 'group',
  children: [
    {
      id: 'clientdashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/client/dashboardclient',
      icon: icons.DashboardOutlined,
      breadcrumbs: false
    }
  ]
};

export default clientdashboard;
