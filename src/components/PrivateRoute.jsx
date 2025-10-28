import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const PrivateRoute = () => {
  const { userInfo } = useContext(AuthContext);

  // If user is logged in, show the child component (e.g., DashboardPage)
  // Otherwise, redirect to the login page
  return userInfo ? <Outlet /> : <Navigate to='/login' replace />;
};

export default PrivateRoute;