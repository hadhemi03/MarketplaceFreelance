// layout/MinimalLayout.js
import React from 'react';

const MinimalLayout = ({ children }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      {children}
    </div>
  );
};

export default MinimalLayout;
