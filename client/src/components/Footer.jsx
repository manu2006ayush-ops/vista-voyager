import React from 'react';
import { Link } from 'react-router-dom';
import { FiCompass, FiInstagram, FiTwitter, FiFacebook } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 text-lg font-bold">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-ocean-500 text-white">
                <FiCompass size={16} />
              </span>
              Vista Voyager
            </div>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              Voyager Intelligence System for Travel Assistance — plan smarter Indian adventures with AI-powered recommendations.
            </p>
            <div className="mt-4 flex gap-3 text-slate-400">
              <FiInstagram className="hover:text-primary-500 cursor-pointer" />
              <FiTwitter className="hover:text-primary-500 cursor-pointer" />
              <FiFacebook className="hover:text-primary-500 cursor-pointer" />
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">Explore</h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><Link to="/explore?category=family" className="hover:text-primary-500">Family Trips</Link></li>
              <li><Link to="/explore?category=romantic" className="hover:text-primary-500">Romantic Getaways</Link></li>
              <li><Link to="/explore?category=adventure" className="hover:text-primary-500">Adventure</Link></li>
              <li><Link to="/explore?category=budget" className="hover:text-primary-500">Budget Trips</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">Tools</h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><Link to="/trip-planner" className="hover:text-primary-500">AI Trip Planner</Link></li>
              <li><Link to="/wishlist" className="hover:text-primary-500">Wishlist</Link></li>
              <li><Link to="/dashboard" className="hover:text-primary-500">Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">Account</h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><Link to="/login" className="hover:text-primary-500">Log in</Link></li>
              <li><Link to="/register" className="hover:text-primary-500">Sign up</Link></li>
              <li><Link to="/profile" className="hover:text-primary-500">Profile</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200 dark:border-slate-800 pt-6 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} Vista Voyager. Final Year Major Project — Built with React, Node.js & MongoDB.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
