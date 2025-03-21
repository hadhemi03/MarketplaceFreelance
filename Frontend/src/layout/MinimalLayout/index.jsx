import { Outlet } from 'react-router-dom';

// ==============================|| MINIMAL LAYOUT ||============================== //

export default function MinimalLayout() {
  return (
    <>
      {/** a placeholder to render the content of the currently active nested route */}
      <Outlet />
    </>
  );
}
