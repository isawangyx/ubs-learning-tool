import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from './pages/Login';
import { SignUp } from './pages/Signup';
import { Onboarding } from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { Protected } from './hooks/useAuth';
import { Profile } from './pages/Profile';
import { EditProfile } from './pages/EditProfile';
import { ModuleDetails } from './pages/ModuleDetails';
import { ModuleList } from './pages/ModuleList';

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
        <Route path='/module' element={<ModuleList />} />
        <Route path='/module/:moduleId' element={<ModuleDetails />} />
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
