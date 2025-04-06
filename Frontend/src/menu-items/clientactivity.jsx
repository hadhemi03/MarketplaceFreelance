// assets
import { ProfileOutlined, MessageOutlined} from '@ant-design/icons';

// icons
const icons = {
    ProfileOutlined,
    MessageOutlined
};

// ==============================|| MENU ITEMS - SAMPLE PAGE & DOCUMENTATION ||============================== //

const clientActivity = {
  id: 'clientActivity',
  title: 'My Activity',
  type: 'group',
  children: [
    {
      id: 'my-projects',
      title: 'My Projects',
      type: 'item',
      url: '/client/my-projects',
      icon: icons.ProfileOutlined
    },
    {
      id: 'messages',
      title: 'My Messages',
      type: 'item',
      url: '/client/messages',
      icon: icons.MessageOutlined,
    }
  ]
};

export default clientActivity;
