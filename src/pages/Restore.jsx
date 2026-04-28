import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { RefreshCcw, Eye, Search, Trash2, Clock, Calendar, FileText } from 'lucide-react';
import { format } from 'date-fns';
import DocumentDetail from '../components/DocumentDetail';
import ProjectPreview from '../components/previews/ProjectPreview';
import STPreview from '../components/previews/STPreview';
import POPreview from '../components/previews/POPreview';
import InvoicePreview from '../components/previews/InvoicePreview';
import KwitansiPreview from '../components/previews/KwitansiPreview';

const Restore = () => {
  const { 
    projects, appointments, purchaseOrders, invoices, payments,
    restoreItem, softDelete 
  } = useAppData();

  const [activeItem, setActiveItem] = useState(null);
  const [activeType, setActiveType] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const deletedProjects = projects.filter(p => p.isDeleted);
  const deletedST = appointments.filter(a => a.isDeleted);
  const deletedPOs = purchaseOrders.filter(p => p.isDeleted);
  const deletedInvoices = invoices.filter(i => i.isDeleted);
  const deletedPayments = payments.filter(p => p.isDeleted);

  const handlePreview = (item, type) => {
    setActiveItem(item);
    setActiveType(type);
    setShowPreview(true);
  };

  const handleRestore = (type, id) => {
    if (window.confirm("Restore dokumen ini ke daftar aktif?")) {
      restoreItem(type, id);
    }
  };

  const renderTable = (items, type, title) => {
    if (items.length === 0) return null;

    return (
      <div className="card" style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--primary)' }}>Dokumen {title} Terhapus</h3>
          <span className="badge" style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '4px 12px', borderRadius: '20px', fontSize: '12px' }}>
            {items.length} Dokumen
          </span>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nomor Dokumen</th>
                <th>Tanggal Dibuat</th>
                <th>Tanggal Dihapus</th>
                <th style={{ textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td style={{ fontWeight: '500' }}>{item.code}</td>
                  <td>{item.createdAt ? format(new Date(item.createdAt), 'dd/MM/yyyy HH:mm') : '-'}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#dc3545' }}>
                      <Clock size={14} />
                      {item.deletedAt ? format(new Date(item.deletedAt), 'dd/MM/yyyy HH:mm') : '-'}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                      <button 
                        onClick={() => handlePreview(item, type)}
                        className="btn-icon" 
                        style={{ color: '#007bff' }} 
                        title="Preview"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => handleRestore(type, item.id)}
                        className="btn-icon" 
                        style={{ color: '#28a745' }} 
                        title="Restore"
                      >
                        <RefreshCcw size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const getPreviewContent = () => {
    if (!activeItem || !activeType) return null;
    
    switch (activeType) {
      case 'Project': return <ProjectPreview item={activeItem} />;
      case 'SerahTerima': return <STPreview item={activeItem} projects={projects} />;
      case 'PO': return <POPreview item={activeItem} projects={projects} />;
      case 'Invoice': return <InvoicePreview item={activeItem} purchaseOrders={purchaseOrders} />;
      case 'Pembayaran': return <KwitansiPreview item={activeItem} invoices={invoices} />;
      default: return null;
    }
  };

  const totalDeleted = deletedProjects.length + deletedST.length + deletedPOs.length + deletedInvoices.length + deletedPayments.length;

  return (
    <div className="content-body">
      <div style={{ marginBottom: '25px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--secondary)' }}>Restore Management</h2>
        <p style={{ color: '#666' }}>Kelola dan pulihkan dokumen yang telah dihapus sementara.</p>
      </div>

      {totalDeleted === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{ marginBottom: '20px', color: '#ccc' }}>
            <Trash2 size={60} strokeWidth={1.5} />
          </div>
          <h3 style={{ fontSize: '20px', color: '#555', marginBottom: '10px' }}>Tempat Sampah Kosong</h3>
          <p style={{ color: '#888' }}>Tidak ada dokumen yang sedang dihapus sementara.</p>
        </div>
      ) : (
        <>
          {renderTable(deletedProjects, 'Project', 'Data Proyek')}
          {renderTable(deletedST, 'SerahTerima', 'Serah Terima')}
          {renderTable(deletedPOs, 'PO', 'Purchase Order')}
          {renderTable(deletedInvoices, 'Invoice', 'Invoice')}
          {renderTable(deletedPayments, 'Pembayaran', 'Pembayaran')}
        </>
      )}

      {showPreview && activeItem && (
        <DocumentDetail 
          item={activeItem} 
          type={activeType} 
          onClose={() => setShowPreview(false)}
          previewContent={getPreviewContent()}
        />
      )}
    </div>
  );
};

export default Restore;
