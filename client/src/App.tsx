import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from './pages/Login';
import { SignUp } from './pages/Signup';
import { Onboarding } from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { Protected } from './hooks/useAuth';
import { Profile } from './pages/Profile';
import { EditProfile } from './pages/EditProfile';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/signup' element={<SignUp />} />
        <Route path='/login' element={<Login />} />
        <Route
          path='/onboarding'
          element={
            <Protected>
              <Onboarding />
            </Protected>
          }
        />
        <Route
          path='/dashboard'
          element={
            <Protected>
              <Dashboard />
            </Protected>
          }
        />
        <Route
          path='/profile'
          element={
            <Protected>
              <Profile />
            </Protected>
          }
        />
        <Route
          path='/edit-profile'
          element={
            <Protected>
              <EditProfile />
            </Protected>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
