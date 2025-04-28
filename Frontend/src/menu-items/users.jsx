// assets
import {
  UserOutlined
} from '@ant-design/icons';

// icons
const icons = {
  UserOutlined
};

// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const Users = {
  id: 'Users',
  title: 'Users',
  type: 'group',
  children: [
    {
      id: 'crudclients',
      title: 'Clients',
      type: 'item',
      url: 'crudclients',
      icon: icons.UserOutlined
    },
    {
      id: 'crudfreelancers',
      title: 'Freelancers',
      type: 'item',
      url: 'crudfreelancers',
      icon: icons.UserOutlined
    }
  ]
};

export default Users;
