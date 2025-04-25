// assets
import {
  AppstoreAddOutlined,
  AntDesignOutlined,
  BarcodeOutlined,
  BgColorsOutlined,
  FontSizeOutlined,
  LoadingOutlined,
  UserOutlined,
  ProfileOutlined,
  CommentOutlined
} from '@ant-design/icons';

// icons
const icons = {
  FontSizeOutlined,
  BgColorsOutlined,
  BarcodeOutlined,
  AntDesignOutlined,
  LoadingOutlined,
  AppstoreAddOutlined,
  UserOutlined,
  ProfileOutlined,
  CommentOutlined
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
    }
  ]
};

export default Projects;
