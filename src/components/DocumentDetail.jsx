import React from 'react';
import { X, Download, Edit3, FileText, Calendar, User, Shield, HardDrive, Info } from 'lucide-react';
import { format } from 'date-fns';
import { useAppData } from '../context/AppDataContext';

const DocumentDetail = ({ item, type, onClose, onEdit, previewContent }) => {
  const { projects, purchaseOrders } = useAppData();
  if (!item) return null;

  const getFileSize = () => {
    if (item.document && item.document.size) {
      const kb = item.document.size / 1024;
      if (kb > 1024) return (kb / 1024).toFixed(2) + ' MB';
      return kb.toFixed(2) + ' KB';
    }
    return item.fileSize || '0 KB';
  };

  const getFileType = () => {
    if (item.document && item.document.name) {
      return item.document.name.split('.').pop().toUpperCase();
    }
    return item.fileType || 'PDF';
  };

  const getCreatedDate = () => {
    try {
      if (item.createdAt) return format(new Date(item.createdAt), 'dd MMMM yyyy, HH:mm');
      if (item.date) return format(new Date(item.date), 'dd MMMM yyyy');
    } catch (e) {
      return '-';
    }
    return '-';
  };

  const getOwner = () => {
    if (type === 'Terima Barang') return 'Budi Santoso';
    
    let projectId = item.projectId;
    if (type === 'Project') projectId = item.id;
    
    if (projectId) {
      const project = projects.find(p => p.id === parseInt(projectId));
      if (project && project.pic) {
        return project.pic.split(' (')[0];
      }
    }
    
    return item.owner || 'System Administrator';
  };

  const metadata = [
    { label: 'Nomor Dokumen', value: item.code, icon: <FileText size={16} /> },
    { label: 'Owner', value: getOwner(), icon: <User size={16} /> },
    { label: 'Created', value: getCreatedDate(), icon: <Calendar size={16} /> },
    { label: 'Default Access Mode', value: item.accessMode || 'Full Access', icon: <Shield size={16} /> },
    { label: 'File Type', value: getFileType(), icon: <FileText size={16} /> },
    { label: 'File Size', value: getFileSize(), icon: <HardDrive size={16} /> },
    { label: 'Status Dokumen', value: item.status || 'Active', icon: <Info size={16} /> },
    { label: 'Comment / Keterangan', value: item.details || item.comment || '-', icon: <Info size={16} /> },
  ];

  const renderSpecificInfo = () => {
    switch (type) {
      case 'Project':
        return (
          <>
            <InfoRow label="Nomor" value={item.code} />
            <InfoRow label="Nama Proyek" value={item.name} />
            <InfoRow label="Jenis Pembangunan" value={item.type} />
            <InfoRow label="Lokasi" value={item.location} />
            <InfoRow label="Tanggal Mulai" value={item.startDate} />
            <InfoRow label="Tanggal Selesai" value={item.endDate} />
            <InfoRow label="Status Proyek" value={item.status} />
          </>
        );
      case 'SerahTerima':
        return (
          <>
            <InfoRow label="Nomor" value={item.code} />
            <InfoRow label="Tanggal Serah Terima" value={item.date} />
            <InfoRow label="Nama Proyek" value={item.projectName || '-'} />
            <InfoRow label="Main Contractor" value={item.mainCon} />
            <InfoRow label="Sub Contractor" value={item.subCon} />
            <InfoRow label="Vendor / Supplier" value={item.vendor} />
            <InfoRow label="Keterangan" value={item.details || '-'} />
          </>
        );
      case 'PO':
        return (
          <>
            <InfoRow label="Nomor" value={item.code} />
            <InfoRow label="Tanggal PO" value={item.date} />
            <InfoRow label="Nama Proyek" value={item.projectName || '-'} />
            <InfoRow label="Vendor" value={item.vendor} />
            <InfoRow label="Total Harga" value={`Rp ${item.total?.toLocaleString()}`} />
            <InfoRow label="Status PO" value={item.status} />
          </>
        );
      case 'Invoice':
        return (
          <>
            <InfoRow label="Nomor" value={item.code} />
            <InfoRow label="Tanggal Invoice" value={item.date} />
            <InfoRow label="Referensi PO" value={item.poCode || '-'} />
            <InfoRow label="Nama Vendor" value={item.vendor} />
            <InfoRow label="Total Tagihan" value={`Rp ${item.amount?.toLocaleString()}`} />
            <InfoRow label="Status Pembayaran" value={item.status} />
          </>
        );
      case 'Kwitansi':
        return (
          <>
            <InfoRow label="Nomor" value={item.code} />
            <InfoRow label="Tanggal Pembayaran" value={item.date} />
            <InfoRow label="Nama Vendor" value={item.vendor} />
            <InfoRow label="Jumlah Dibayar" value={`Rp ${item.amount?.toLocaleString()}`} />
            <InfoRow label="Metode Pembayaran" value={item.method} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-detail" style={{ 
        width: '95%', 
        maxWidth: '1400px', 
        height: '92vh', 
        display: 'flex', 
        flexDirection: 'column',
        padding: 0,
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div className="no-print" style={{ 
          padding: '15px 25px', 
          borderBottom: '1px solid #eee', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          background: 'white'
        }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary)', margin: 0 }}>Detail Dokumen</h3>
            <p style={{ fontSize: '12px', color: '#666', margin: '2px 0 0 0' }}>{type} Management System</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
             <button 
              className="btn btn-outline" 
              onClick={() => window.print()}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Download size={16} /> Download PDF
            </button>
            <button 
              className="btn btn-primary" 
              onClick={() => onEdit ? onEdit(item) : alert('Edit mode not implemented')}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Edit3 size={16} /> Edit Dokumen
            </button>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', marginLeft: '10px' }}>
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Main Content Pane */}
        <div className="modal-main-pane" style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Metadata Sidebar */}
          <div className="no-print" style={{ 
            width: '380px', 
            background: '#f8f9fa', 
            borderRight: '1px solid #eee', 
            overflowY: 'auto', 
            padding: '25px' 
          }}>
            <h4 style={{ fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase', color: '#555', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Info size={18} /> Informasi Umum
            </h4>
            
            <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '15px', border: '1px solid #eee', marginBottom: '30px' }}>
              {metadata.map((m, idx) => (
                <div key={idx} style={{ marginBottom: idx === metadata.length - 1 ? 0 : '15px' }}>
                  <label style={{ fontSize: '11px', color: '#999', display: 'block', marginBottom: '4px' }}>{m.label}</label>
                  <div style={{ fontSize: '13px', fontWeight: '500', color: '#333', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#aaa' }}>{m.icon}</span>
                    {m.value}
                  </div>
                </div>
              ))}
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '25px 0' }} />

            <h4 style={{ fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase', color: '#555', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
               Informasi Khusus
            </h4>
            <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '15px', border: '1px solid #eee', marginBottom: '30px' }}>
              {renderSpecificInfo()}
            </div>
          </div>

          {/* Document Preview Pane */}
          <div className="document-print-container" style={{ flex: 1, background: '#e4e4e4', overflowY: 'auto', padding: '40px' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
              {previewContent}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '13px', paddingBottom: '8px', borderBottom: '1px solid #f1f1f1' }}>
    <span style={{ color: '#666' }}>{label}</span>
    <span style={{ fontWeight: '500', color: '#333', textAlign: 'right' }}>{value || '-'}</span>
  </div>
);

export default DocumentDetail;
