import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FiGrid, FiMap, FiUsers, FiBarChart2 } from 'react-icons/fi';

const links = [
  { to: '/admin', label: 'Overview', icon: <FiGrid />, end: true },
  { to: '/admin/destinations', label: 'Destinations', icon: <FiMap /> },
  { to: '/admin/users', label: 'Users', icon: <FiUsers /> },
  { to: '/admin/analytics', label: 'Analytics', icon: <FiBarChart2 /> },
];

const AdminLayout = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr]">
        <nav className="card flex flex-row gap-1 overflow-x-auto p-2 lg:flex-col lg:p-3">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                  isActive ? 'bg-primary-500 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`
              }
            >
              {link.icon} {link.label}
            </NavLink>
          ))}
        </nav>
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
