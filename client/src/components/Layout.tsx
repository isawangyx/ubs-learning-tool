import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { ProfileMenu } from './ProfileMenu';

export function Layout() {
  return (
    <div className='flex h-screen'>
      <nav className='w-60 bg-white border-r p-4 flex flex-col'>
        <h2 className='text-2xl font-bold mb-8'>SkillsLife</h2>
        <NavLink
          to='/dashboard'
          className={({ isActive }) =>
            isActive ? 'font-semibold mb-4' : 'mb-4'
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to='/module'
          className={({ isActive }) =>
            isActive ? 'font-semibold mb-4' : 'mb-4'
          }
        >
          Explore
        </NavLink>
        <NavLink
          to='/certifications'
          className={({ isActive }) =>
            isActive ? 'font-semibold mb-4' : 'mb-4'
          }
        >
          Certifications
        </NavLink>
        <NavLink
          to='/saved-modules'
          className={({ isActive }) =>
            isActive ? 'font-semibold mb-4' : 'mb-4'
          }
        >
          My Courses
        </NavLink>
        <NavLink
          to='/chat'
          className={({ isActive }) =>
            isActive ? 'font-semibold mb-4' : 'mb-4'
          }
        >
          AI Chat
        </NavLink>
        <div className='mt-auto'>
          <NavLink to='/help' className='mb-2 block text-sm text-gray-500'>
            Help Center
          </NavLink>
          <NavLink to='/settings' className='text-sm text-gray-500'>
            Settings
          </NavLink>
        </div>
      </nav>

      <div className='flex-1 flex flex-col'>
        <header className='flex justify-between items-center p-4 border-b'>
          <input
            type='search'
            placeholder='Try search programming course'
            className='flex-1 max-w-md p-2 border rounded mr-4'
          />
          <ProfileMenu />
        </header>

        <main className='p-6 overflow-auto flex-1 bg-gray-50'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
