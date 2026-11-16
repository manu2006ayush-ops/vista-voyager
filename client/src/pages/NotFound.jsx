import React from 'react';
import { Link } from 'react-router-dom';
import { FiCompass } from 'react-icons/fi';

const NotFound = () => (
  <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
    <FiCompass className="mb-4 text-primary-400" size={48} />
    <h1 className="text-5xl font-extrabold">404</h1>
    <p className="mt-2 text-lg text-slate-500">Looks like you've wandered off the map.</p>
    <Link to="/" className="btn-primary mt-6">
      Back to Home
    </Link>
  </div>
);

export default NotFound;
