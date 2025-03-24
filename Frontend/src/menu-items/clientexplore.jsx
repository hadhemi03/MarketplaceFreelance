// assets
import { InsertRowBelowOutlined, UsergroupAddOutlined } from '@ant-design/icons';

// icons
const icons = {
    InsertRowBelowOutlined,
    UsergroupAddOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const clientExplore = {
  id: 'group-projects',
  title: 'Explore',
  type: 'group',
  children: [
    {
      id: 'projects',
      title: 'Projects',
      type: 'item',
      url: '/client/projects',
      icon: icons.InsertRowBelowOutlined,
    },
    {
        id: 'freelancers',
        title: 'Freelancers',
        type: 'item',
        url: '/client/freelancers',
        icon: icons.UsergroupAddOutlined,
      }
  ]
};

export default clientExplore;
