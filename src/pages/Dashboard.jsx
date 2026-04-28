import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { 
  Briefcase, 
  FileText, 
  FileCheck, 
  AlertCircle,
  TrendingUp,
  Clock
} from 'lucide-react';
import { useAppData } from '../context/AppDataContext';

const Dashboard = () => {
  const { projects, purchaseOrders, invoices } = useAppData();

  const today = new Date().toISOString().split('T')[0];

  const activeProjectsCount = projects.filter(p => {
    if (!p.startDate || !p.endDate) return false;
    return p.startDate <= today && p.endDate >= today;
  }).length;

  const stats = [
    { name: 'Total Proyek', value: projects.length, icon: Briefcase, color: '#17a2b8' },
    { name: 'Proyek Aktif', value: activeProjectsCount, icon: TrendingUp, color: '#28a745' },
    { name: 'Total PO', value: purchaseOrders.length, icon: FileText, color: '#ffc107' },
    { name: 'Invoice Masuk', value: invoices.length, icon: FileCheck, color: '#dc3545' },
    { name: 'Unpaid Invoices', value: invoices.filter(i => i.status !== 'Paid').length, icon: AlertCircle, color: '#6c757d' },
  ];

  const barData = [
    { name: 'Jan', amount: 4000 },
    { name: 'Feb', amount: 3000 },
    { name: 'Mar', amount: 2000 },
    { name: 'Apr', amount: 2780 },
  ];

  const vendorData = [
    { name: 'Mandiri Steel', total: 150000000 },
    { name: 'Bangun Perkasa', total: 45000000 },
    { name: 'Karya Abadi', total: 80000000 },
    { name: 'Indo Teknik', total: 120000000 },
  ];

  return (
    <div>
      {/* Stats Cards */}
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        {stats.map((stat) => (
          <div key={stat.name} className="card" style={{ display: 'flex', alignItems: 'center', padding: '0', overflow: 'hidden' }}>
            <div style={{ padding: '20px', backgroundColor: stat.color, color: 'white' }}>
              <stat.icon size={30} />
            </div>
            <div style={{ padding: '15px' }}>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>{stat.name}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="charts-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 2fr))', gap: '20px', marginBottom: '20px' }}>
        {/* Expenditure Chart */}
        <div className="card">
          <h3 style={{ marginBottom: '20px', fontSize: '1.1rem' }}>Pengeluaran Proyek Per Bulan</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={barData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => value.toLocaleString()} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="amount" stroke="var(--primary)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Vendor Transaction Chart */}
        <div className="card">
          <h3 style={{ marginBottom: '20px', fontSize: '1.1rem' }}>Transaksi Vendor Utama</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vendorData} margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" interval={0} style={{ fontSize: '12px' }} />
                <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)} jt`} />
                <Tooltip formatter={(value) => `Rp ${value.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="total" fill="var(--primary)" barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 style={{ marginBottom: '15px', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Clock size={18} /> Recent Activity
        </h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Aktivitas</th>
                <th>ID Dokumen</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>16 Apr 2026</td>
                <td>Penerbitan PO Baru</td>
                <td>PO/WKP/0024</td>
                <td><span style={{ padding: '3px 8px', borderRadius: '12px', fontSize: '11px', backgroundColor: '#fff3cd', color: '#856404' }}>Waiting Approval</span></td>
              </tr>
              <tr>
                <td>15 Apr 2026</td>
                <td>Pembayaran Invoice</td>
                <td>KWT/Steel/003</td>
                <td><span style={{ padding: '3px 8px', borderRadius: '12px', fontSize: '11px', backgroundColor: '#d4edda', color: '#155724' }}>Success</span></td>
              </tr>
              <tr>
                <td>14 Apr 2026</td>
                <td>Registrasi Proyek Baru</td>
                <td>PR/012/Office/2026</td>
                <td><span style={{ padding: '3px 8px', borderRadius: '12px', fontSize: '11px', backgroundColor: '#cce5ff', color: '#004085' }}>Active</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
