// assets
import { ChromeOutlined, QuestionOutlined } from '@ant-design/icons';

// icons
const icons = {
  ChromeOutlined,
  QuestionOutlined
};

// ==============================|| MENU ITEMS - SAMPLE PAGE & DOCUMENTATION ||============================== //

const clientprofile = {
  id: 'clientprofile',
  title: 'History',
  type: 'group',
  children: [
    {
      id: 'my-projects',
      title: 'My Projects',
      type: 'item',
      url: '/client/my-project',
      icon: icons.ChromeOutlined
    },
    {
      id: 'payments',
      title: 'Payments',
      type: 'item',
      url: '/client/payments',
      icon: icons.QuestionOutlined,
      external: true,
      target: true
    }
  ]
};

export default clientprofile;
