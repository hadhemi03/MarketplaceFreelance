// assets
import {
  ProfileOutlined,
  CommentOutlined,
  CreditCardOutlined
} from '@ant-design/icons';

// icons
const icons = {
  ProfileOutlined,
  CommentOutlined,
  CreditCardOutlined
};

// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const Projects = {
  id: 'ContentManagement',
  title: 'Content Management',
  type: 'group',
  children: [
    {
      id: 'crudprojects',
      title: 'Projects',
      type: 'item',
      url: 'crudprojects',
      icon: icons.ProfileOutlined
    },
    {
      id: 'crudcomments',
      title: 'Comments',
      type: 'item',
      url: 'crudcomments',
      icon: icons.CommentOutlined
    },
    {
      id: 'viewpayments',
      title: 'Payments',
      type: 'item',
      url: 'viewpayments',
      icon: icons.CreditCardOutlined
    }
  ]
};

export default Projects;
