/*// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';

// project import
import Search from './Search';
import Profile from './Profile';
import Notification from './Notification';
import MobileSection from './MobileSection';

// project import
import { GithubOutlined } from '@ant-design/icons';

// ==============================|| HEADER - CONTENT ||============================== //

export default function HeaderContent() {
  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  return (
    <>
      {!downLG && <Search />}
      {downLG && <Box sx={{ width: '100%', ml: 1 }} />}
      

      <Notification />
      {!downLG && <Profile />}
      {downLG && <MobileSection />}
    </>
  );
}
*/


// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';

// project import
import Search from './Search';
import Profile from './Profile';
import Notification from './Notification';
import MobileSection from './MobileSection';
import Logo from 'components/logo/LogoMain';



// Define menu items once and export them
const role = localStorage.getItem('userRole'); // Retrieve the user's role
//
export const menuItems =
  role === 'client'
    ? [
        { id: 'Projects', label: 'Projects', path: '/free/client/projects' },
        { id: 'Freelancers', label: 'Freelancers', path: '/free/client/freelancers' },
        { id: 'ClientProjects', label: 'My Projects', path: '/free/client/my-projects' },
        { id: 'Messages', label: 'Messages', path: '/free/client/messages' },
        { id: 'clientPayment', label: 'My Payments', path: '/free/client/payments' }
      ]
    : role === 'freelancer'
    ? [
        { id: 'FreelancerProjects', label: 'Projects', path: '/free/freelancer/projects' },
        { id: 'MyProjectsFreelancer', label: 'My Projects', path: '/free/freelancer/my-projects' },
        { id: 'Messages', label: 'Messages', path: '/free/freelancer/messages' },
        { id: 'MyCalendar', label: 'My Calendar', path: '/free/freelancer/my-calendar' },
        { id: 'MyOffers', label: 'My Offers', path: '/free/freelancer/my-offers' },

      ]
    :
    [
        { id: 'dashboard', label: 'Dashboard', path: '/dashboard' },
        { id: 'pages', label: 'Pages', path: '/pages' },
        { id: 'utilities', label: 'Utilities', path: '/utilities' },
        { id: 'support', label: 'Support', path: '/support' }
      ];

// ==============================|| HEADER - CONTENT ||============================== //

const HeaderContent = () => {
  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
      {/* Logo on the left */}
      <Box sx={{ flex: 0 }}>
        <Logo />
      </Box>

      {/* Menu Items in the center, spread evenly */}
      <Box sx={{ display: 'flex', justifyContent: 'center', flex: 1 }}>
        {menuItems.map((item) => (
          <Link
            key={item.id}
            href={item.path}
            sx={{
              textDecoration: 'none',
              color: 'inherit',
              padding: '0 20px',  // Spacing between the menu items
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {item.label}
          </Link>
        ))}
      </Box>

      {/* Notifications and Profile on the right */}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <Notification />
        {!downLG && <Profile />}
      </Box>
    </Box>
  );
};


export default HeaderContent;
