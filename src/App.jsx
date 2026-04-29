import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppDataProvider } from './context/AppDataContext';
import AdminLayout from './layouts/AdminLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DataProyek from './pages/DataProyek';
import SerahTerima from './pages/SerahTerima';
import PurchaseOrder from './pages/PurchaseOrder';
import InvoicePayment from './pages/InvoicePayment';
import Laporan from './pages/Laporan';
import Approval from './pages/Approval';
import Restore from './pages/Restore';
import TerimaBarang from './pages/TerimaBarang';
import MasterUser from './pages/MasterUser';

function App() {
  return (
    <AppDataProvider>
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Login />} />

          {/* Admin Routes */}
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="master-user" element={<MasterUser />} />
            <Route path="proyek" element={<DataProyek />} />
            <Route path="serah-terima" element={<SerahTerima />} />
            <Route path="po" element={<PurchaseOrder />} />
            <Route path="invoice-payment" element={<InvoicePayment />} />
            <Route path="terima-barang" element={<TerimaBarang />} />
            <Route path="laporan" element={<Laporan />} />
            <Route path="approval" element={<Approval />} />
            <Route path="restore" element={<Restore />} />
          </Route>

          {/* Redirects */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AppDataProvider>
  );
}

export default App;
