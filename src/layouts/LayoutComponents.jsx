import { 
  LayoutDashboard, 
  Briefcase, 
  Handshake, 
  FileText, 
  FileCheck, 
  CreditCard, 
  PieChart, 
  CheckSquare, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  Bell,
  Search,
  User,
  RefreshCw,
  Inbox
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/logowkp.jpg';
import { useAppData } from '../context/AppDataContext';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Data Proyek', icon: Briefcase, path: '/proyek' },
    { name: 'Serah Terima', icon: Handshake, path: '/serah-terima' },
    { name: 'Purchase Order', icon: FileText, path: '/po' },
    { name: 'Invoice-Payment', icon: FileCheck, path: '/invoice-payment' },
    { name: 'Terima Barang', icon: Inbox, path: '/terima-barang' },
    { name: 'Laporan', icon: PieChart, path: '/laporan' },
    { name: 'Approval', icon: CheckSquare, path: '/approval' },
    { name: 'Restore', icon: RefreshCw, path: '/restore' },
  ];

  return (
    <>
      <aside className={`sidebar ${isCollapsed ? 'collapsed' : 'open'}`} style={{
        width: isCollapsed ? '70px' : '260px',
        backgroundColor: 'var(--sidebar-bg)',
        color: 'var(--sidebar-text)',
        transition: 'var(--transition)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        flexShrink: 0,
        overflowY: 'auto'
      }}>
      <div className="sidebar-header" style={{
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        borderBottom: '1px solid #4b545c',
        height: '60px'
      }}>
        <img src={logo} alt="Logo WKP" style={{ height: '35px', width: 'auto', borderRadius: '4px' }} />
        {!isCollapsed && (
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
            <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'white' }}>PT. WKP</span>
            <span style={{ fontWeight: '300', fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)' }}>Wijaya Kusuma Perdana</span>
          </div>
        )}
      </div>

      <nav style={{ flex: 1, padding: '10px 0' }}>
        <ul>
          {menuItems.map((item) => (
            <li key={item.name} style={{ margin: '4px 8px' }}>
              <NavLink 
                to={item.path}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 15px',
                  borderRadius: '4px',
                  color: isActive ? 'white' : 'var(--sidebar-text)',
                  backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                  transition: '0.2s'
                })}
              >
                <item.icon size={20} />
                {!isCollapsed && <span style={{ marginLeft: '12px' }}>{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div style={{ padding: '15px', borderTop: '1px solid #4b545c' }}>
        <button 
          onClick={() => {}} 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            width: '100%', 
            background: 'transparent', 
            border: 'none', 
            color: 'var(--sidebar-text)',
            padding: '10px'
          }}
        >
          <LogOut size={20} />
          {!isCollapsed && <span style={{ marginLeft: '12px' }}>Logout</span>}
        </button>
      </div>
    </aside>
    <div className={`sidebar-overlay ${!isCollapsed ? 'show' : ''}`} onClick={() => setIsCollapsed(true)}></div>
    </>
  );
};

const Navbar = ({ toggleSidebar }) => {
  const { searchTerm, setSearchTerm } = useAppData();

  return (
    <header style={{
      height: '60px',
      backgroundColor: 'var(--white)',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      position: 'sticky',
      top: 0,
      zIndex: 90
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <button onClick={toggleSidebar} style={{ background: 'none', border: 'none' }}>
          <Menu size={24} />
        </button>
        <div className="search-input-container" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={18} style={{ position: 'absolute', left: '10px', color: '#999' }} />
          <input 
            type="text" 
            placeholder="Pencarian dokumen..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              padding: '6px 10px 6px 35px', 
              borderRadius: '20px', 
              border: '1px solid #ddd',
              width: '250px'
            }} 
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ position: 'relative' }}>
          <Bell size={20} />
          <span style={{ 
            position: 'absolute', 
            top: '-5px', 
            right: '-5px', 
            backgroundColor: 'var(--primary)', 
            color: 'white', 
            fontSize: '10px', 
            padding: '1px 4px', 
            borderRadius: '50%' 
          }}>3</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ textAlign: 'right', display: 'none', sm: 'block' }}>
            <div style={{ fontSize: '14px', fontWeight: 'bold' }}>Admin User</div>
            <div style={{ fontSize: '12px', color: '#777' }}>Administrator</div>
          </div>
          <div style={{ width: '35px', height: '35px', borderRadius: '50%', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyItems: 'center' }}>
             <User size={20} style={{ margin: 'auto' }} />
          </div>
        </div>
      </div>
    </header>
  );
};

export { Sidebar, Navbar };
