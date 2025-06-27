import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, ChevronDown } from 'react-feather';

export function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  return (
    <div className='relative' ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className='flex items-center space-x-1 p-1 rounded hover:bg-gray-200'
      >
        <User size={20} />
        <ChevronDown size={16} className={open ? 'transform rotate-180' : ''} />
      </button>

      {open && (
        <div className='absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10'>
          <Link
            to='/profile'
            className='block px-4 py-2 hover:bg-gray-100 text-gray-800'
            onClick={() => setOpen(false)}
          >
            My Profile
          </Link>
          <button
            onClick={handleLogout}
            className='w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-800'
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
