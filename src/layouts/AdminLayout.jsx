import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar, Navbar } from './LayoutComponents';
import { useAppData } from '../context/AppDataContext';

const AdminLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { setSearchTerm } = useAppData();

  // Clear search on page change
  React.useEffect(() => {
    setSearchTerm('');
  }, [location.pathname, setSearchTerm]);

  // Get current page name for breadcrumb
  const pathnames = location.pathname.split('/').filter((x) => x);
  const currentPage = pathnames.length > 0 ? pathnames[pathnames.length - 1] : 'Dashboard';

  const formatName = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ');
  };

  return (
    <div className="wrapper">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      <div className="main-content">
        <Navbar toggleSidebar={() => setIsCollapsed(!isCollapsed)} />
        
        <main className="content-body">
          {/* Breadcrumb */}
          <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '600' }}>{formatName(currentPage)}</h1>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>
              Home / <span style={{ color: 'var(--primary)', fontWeight: '500' }}>{formatName(currentPage)}</span>
            </div>
          </div>

          <Outlet />
        </main>

        <footer style={{ 
          padding: '15px 20px', 
          backgroundColor: 'white', 
          borderTop: '1px solid var(--border-color)',
          fontSize: '0.85rem',
          color: '#777'
        }}>
          <strong>Copyright &copy; 2026 PT. Wijaya Kusuma Perdana.</strong> All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
