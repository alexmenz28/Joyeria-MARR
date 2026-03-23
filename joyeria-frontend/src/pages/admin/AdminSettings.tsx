import React from 'react';
import AdminNavbar from '../../components/layout/AdminNavbar';

const AdminSettings = () => {
  return (
    <>
      <AdminNavbar />
      <div className="w-full min-h-screen bg-ivory dark:bg-night-900 transition-colors pt-24 px-6 md:px-8 pb-12">
        <h1 className="text-3xl font-bold text-marrGold mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">This section is under construction.</p>
      </div>
    </>
  );
};

export default AdminSettings;
