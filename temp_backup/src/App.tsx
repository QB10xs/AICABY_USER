import React from 'react';
import { Toaster } from 'react-hot-toast';
import { Navigate } from 'react-router-dom';

const App: React.FC = () => {
  return (
    <>
      <Toaster position="top-center" />
      <Navigate to="/landing" replace />
    </>
  );
};

export default App;
