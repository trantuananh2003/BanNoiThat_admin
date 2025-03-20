import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import User from '../model/User';

const Navbar: React.FC = () => {
  const userData: User = useSelector((state: RootState) => state.users);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const onLogout = () => {
    alert("Logged out!");
  };

  return (
    <div className="bg-gray-100 p-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-semibold">Quản lý danh mục</h1>
      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="flex items-center space-x-2 focus:outline-none"
        >
          <span>{userData.email}</span>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md">
            <button
              onClick={onLogout}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
