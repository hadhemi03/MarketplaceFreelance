import { createBrowserRouter } from 'react-router-dom';

// project import
import MainRoutes from './MainRoutes';
import LoginRoutes from './LoginRoutes';

// ==============================|| ROUTING RENDER ||============================== //

const router = createBrowserRouter([MainRoutes, LoginRoutes], { basename: import.meta.env.VITE_APP_BASE_NAME });

export default router;


{/**This code is responsible for configuring client-side navigation in a React application using react-router-dom. Specifically, it:

✅ Defines the application's route structure by combining MainRoutes and LoginRoutes.
✅ Enables nested routes, lazy loading, and data fetching within routes.
✅ Supports dynamic base paths via environment variables.
✅ Ensures smooth navigation without full-page reloads. */}