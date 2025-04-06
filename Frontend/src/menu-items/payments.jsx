// assets
import { PayCircleOutlined } from '@ant-design/icons';

// icons
const icons = {
  PayCircleOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const clientPayment = {
  id: 'group-payment',
  title: 'Payments',
  type: 'group',
  children: [
    {
      id: 'payments',
      title: 'My payments',
      type: 'item',
      url: '/client/payments',
      icon: icons.PayCircleOutlined,
      breadcrumbs: false
    }
  ]
};

export default clientPayment;
