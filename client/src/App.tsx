import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { SignUp } from './pages/Signup';
import { Onboarding } from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { Protected } from './hooks/useAuth';
import { Profile } from './pages/Profile';
import { EditProfile } from './pages/EditProfile';
import { ModuleDetails } from './pages/ModuleDetails';
import { ModuleList } from './pages/ModuleList';
import { Certifications } from './pages/Certifications';
import { SavedModules } from './pages/SavedModules';
import { Layout } from './components/Layout';
import { ChatPage } from './pages/Chat';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/'
          element={
            localStorage.getItem('token') ? (
              <Navigate to='/dashboard' replace />
            ) : (
              <Navigate to='/login' replace />
            )
          }
        />
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
          path='/'
          element={
            <Protected>
              <Layout />
            </Protected>
          }
        >
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='module' element={<ModuleList />} />
          <Route path='module/:moduleId' element={<ModuleDetails />} />
          <Route path='certifications' element={<Certifications />} />
          <Route path='saved-modules' element={<SavedModules />} />
          <Route path='profile' element={<Profile />} />
          <Route path='edit-profile' element={<EditProfile />} />
          <Route path='chat' element={<ChatPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
