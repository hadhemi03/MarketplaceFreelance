// assets
import { DashboardOutlined } from '@ant-design/icons';

// icons
const icons = {
  DashboardOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const projects = {
  id: 'group-projects',
  title: 'Navigation',
  type: 'group',
  children: [
    {
      id: 'projects',
      title: 'Projects',
      type: 'item',
      url: '/client/projects',
      icon: icons.DashboardOutlined,
    },
    {
        id: 'freelancers',
        title: 'Freelancers',
        type: 'item',
        url: '/client/freelancers',
        icon: icons.DashboardOutlined,
      }
  ]
};

export default projects;
