import React, { useState } from 'react';
import { Plus, Search, Eye, FileCheck, Upload, Printer, X, Trash2, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import { useAppData } from '../context/AppDataContext';
import DocumentDetail from '../components/DocumentDetail';
import InvoicePreview from '../components/previews/InvoicePreview';
import KwitansiPreview from '../components/previews/KwitansiPreview';

const InvoicePayment = () => {
  const { purchaseOrders, invoices, setInvoices, payments, setPayments, generateInvoiceCode, projects, searchTerm, softDelete } = useAppData();
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  const [showPreview, setShowPreview] = useState(false);
  const [activeDocument, setActiveDocument] = useState(null);
  const [previewType, setPreviewType] = useState(''); // 'Invoice' or 'Pembayaran'
  
  const [invoiceFormData, setInvoiceFormData] = useState({
    poId: '',
    date: new Date().toISOString().split('T')[0],
  });

  const [paymentFormData, setPaymentFormData] = useState({
    invoiceId: '',
    method: 'Transfer',
    date: new Date().toISOString().split('T')[0],
  });

  const approvedPOs = purchaseOrders.filter(po => po.status === 'Approved');

  const handleInvoiceSubmit = (e) => {
    e.preventDefault();
    const po = purchaseOrders.find(p => p.id === parseInt(invoiceFormData.poId));
    const newInvoice = {
      ...invoiceFormData,
      id: Date.now(),
      vendor: po?.vendor || 'Vendor',
      amount: po?.total || 0,
      code: generateInvoiceCode(po?.vendor || 'Unknown', invoiceFormData.date),
      status: 'Pending'
    };
    setInvoices([...invoices, newInvoice]);
    setShowInvoiceModal(false);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    const inv = invoices.find(i => i.id === parseInt(paymentFormData.invoiceId));
    const newPayment = {
      ...paymentFormData,
      id: Date.now(),
      vendor: inv?.vendor || 'Vendor',
      amount: inv?.amount || 0,
      status: 'Approved', // Auto approved as requested
      code: `KWT/${inv?.vendor || 'Unknown'}/00${payments.length + 1}/${format(new Date(paymentFormData.date), 'MM')}/${format(new Date(paymentFormData.date), 'yyyy')}`
    };
    
    // Save payment
    setPayments([...payments, newPayment]);
    
    // Auto update invoice to Paid
    setInvoices(invoices.map(i => i.id === inv.id ? { ...i, status: 'Paid' } : i));
    
    setShowPaymentModal(false);
  };

  const openPaymentModal = (invoiceId) => {
    setPaymentFormData({
      ...paymentFormData,
      invoiceId: invoiceId
    });
    setShowPaymentModal(true);
  };

  const handleDelete = (type, id) => {
    if (window.confirm(`Hapus dokumen ${type} ini?`)) {
      softDelete(type, id);
    }
  };

  const openPreview = (item, type) => {
    setActiveDocument(item);
    setPreviewType(type);
    setShowPreview(true);
  };

  const filteredInvoices = invoices.filter(inv => {
    if (inv.isDeleted) return false;
    const po = purchaseOrders.find(p => p.id === parseInt(inv.poId));
    const searchLow = (searchTerm || '').toLowerCase();
    return searchTerm === '' || 
      (inv.code && inv.code.toLowerCase().includes(searchLow)) ||
      (po && po.code && po.code.toLowerCase().includes(searchLow)) ||
      (inv.vendor && inv.vendor.toLowerCase().includes(searchLow));
  });

  const filteredPayments = payments.filter(p => {
    if (p.isDeleted) return false;
    const inv = invoices.find(i => i.id === parseInt(p.invoiceId));
    const searchLow = (searchTerm || '').toLowerCase();
    return searchTerm === '' || 
      (p.code && p.code.toLowerCase().includes(searchLow)) ||
      (p.vendor && p.vendor.toLowerCase().includes(searchLow)) ||
      (inv && inv.code && inv.code.toLowerCase().includes(searchLow));
  });

  return (
    <div>
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.2rem' }}>Daftar Invoice Vendor</h2>
        <button className="btn btn-primary" onClick={() => setShowInvoiceModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Input Invoice Baru
        </button>
      </div>

      <div className="card" style={{ marginBottom: '30px' }}>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>No. Invoice</th>
                <th>No. PO Ref</th>
                <th>Vendor</th>
                <th>Nominal</th>
                <th>Tgl Invoice</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((inv) => (
                <tr key={inv.id}>
                  <td>{inv.code}</td>
                  <td>{purchaseOrders.find(p => p.id === parseInt(inv.poId))?.code || 'PO Ref'}</td>
                  <td>{inv.vendor}</td>
                  <td>Rp {inv.amount.toLocaleString()}</td>
                  <td>{inv.date}</td>
                  <td>
                    <span style={{ 
                      padding: '4px 10px', 
                      borderRadius: '12px', 
                      fontSize: '12px', 
                      backgroundColor: inv.status === 'Paid' ? '#d4edda' : '#fff3cd',
                      color: inv.status === 'Paid' ? '#155724' : '#856404'
                    }}>
                      {inv.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {inv.status !== 'Paid' && (
                        <button 
                          onClick={() => openPaymentModal(inv.id)}
                          style={{ color: '#28a745', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }} 
                          title="Bayar Invoice"
                        >
                          <CreditCard size={16} /> Bayar
                        </button>
                      )}
                      <button 
                        onClick={() => openPreview(inv, 'Invoice')}
                        style={{ color: '#007bff', background: 'none', border: 'none' }} 
                        title="View Preview"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete('Invoice', inv.id)}
                        style={{ color: '#dc3545', background: 'none', border: 'none' }} 
                        title="Hapus"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.2rem' }}>Daftar Pembayaran</h2>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>No. Kuitansi</th>
                <th>Vendor</th>
                <th>Nominal</th>
                <th>Metode</th>
                <th>Tgl Bayar</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((p) => (
                <tr key={p.id}>
                  <td>{p.code}</td>
                  <td>{p.vendor}</td>
                  <td>Rp {p.amount.toLocaleString()}</td>
                  <td>{p.method}</td>
                  <td>{p.date}</td>
                  <td>
                     <span style={{ 
                       padding: '4px 10px', 
                       borderRadius: '12px', 
                       fontSize: '12px', 
                       backgroundColor: p.status === 'Approved' ? '#d4edda' : p.status === 'Pending' ? '#fff3cd' : '#f8d7da',
                       color: p.status === 'Approved' ? '#155724' : p.status === 'Pending' ? '#856404' : '#721c24'
                     }}>
                       {p.status || 'Approved'}
                     </span>
                   </td>
                  <td>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button 
                        onClick={() => openPreview(p, 'Pembayaran')}
                        style={{ color: '#007bff', background: 'none', border: 'none', cursor: 'pointer' }} 
                        title="View Detail"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete('Pembayaran', p.id)}
                        style={{ color: '#dc3545', background: 'none', border: 'none', cursor: 'pointer' }} 
                        title="Hapus"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showInvoiceModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '800px' }}>
            <h2 style={{ marginBottom: '20px' }}>Input Invoice Masuk</h2>
            <form onSubmit={handleInvoiceSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Pilih PO Referensi</label>
                  <select 
                    required
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                    value={invoiceFormData.poId}
                    onChange={(e) => setInvoiceFormData({...invoiceFormData, poId: e.target.value})}
                  >
                    <option value="">-- Pilih PO --</option>
                    {approvedPOs.map(po => <option key={po.id} value={po.id}>{po.code} - {po.vendor} (Rp {po.total.toLocaleString()})</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Vendor</label>
                  <input
                    type="text"
                    readOnly
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#f8f9fa' }}
                    value={purchaseOrders.find(p => p.id === parseInt(invoiceFormData.poId))?.vendor || ''}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Tanggal Invoice (di Dokumen)</label>
                  <input 
                    type="date" 
                    required
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                    value={invoiceFormData.date}
                    onChange={(e) => setInvoiceFormData({...invoiceFormData, date: e.target.value})}
                  />
                </div>
              </div>

              <div style={{ margin: '20px 0' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Upload Bukti Invoice Vendor</label>
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                  onChange={(e) => setInvoiceFormData({ ...invoiceFormData, file: e.target.files[0] })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '30px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowInvoiceModal(false)}>Batal</button>
                <button type="submit" className="btn btn-primary">Simpan Invoice</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPaymentModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <h2 style={{ marginBottom: '20px' }}>Input Realisasi Pembayaran</h2>
            <form onSubmit={handlePaymentSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Referensi Invoice</label>
                <input
                  type="text"
                  readOnly
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', backgroundColor: '#f8f9fa', borderRadius: '4px' }}
                  value={invoices.find(i => i.id === parseInt(paymentFormData.invoiceId))?.code || ''}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Vendor</label>
                <input
                  type="text"
                  readOnly
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', backgroundColor: '#f8f9fa', borderRadius: '4px' }}
                  value={invoices.find(i => i.id === parseInt(paymentFormData.invoiceId))?.vendor || ''}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Metode Pembayaran</label>
                <select 
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                  value={paymentFormData.method}
                  onChange={(e) => setPaymentFormData({...paymentFormData, method: e.target.value})}
                >
                  <option value="Transfer">Transfer Bank</option>
                  <option value="Tunai">Tunai / Kas Kecil</option>
                  <option value="Cek">Cek / Giro</option>
                </select>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Tanggal Bayar</label>
                <input 
                  type="date" 
                  required
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                  value={paymentFormData.date}
                  onChange={(e) => setPaymentFormData({...paymentFormData, date: e.target.value})}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '30px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowPaymentModal(false)}>Batal</button>
                <button type="submit" className="btn btn-primary">Proses Pembayaran</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPreview && activeDocument && previewType === 'Invoice' && (
        <DocumentDetail 
          item={{
            ...activeDocument,
            poCode: purchaseOrders.find(p => p.id === parseInt(activeDocument.poId))?.code
          }} 
          type="Invoice" 
          onClose={() => setShowPreview(false)}
          previewContent={<InvoicePreview item={activeDocument} purchaseOrders={purchaseOrders} />}
        />
      )}

      {showPreview && activeDocument && previewType === 'Pembayaran' && (
        <DocumentDetail 
          item={{
            ...activeDocument,
            invoiceCode: invoices.find(i => i.id === parseInt(activeDocument.invoiceId))?.code
          }} 
          type="Pembayaran" 
          onClose={() => setShowPreview(false)}
          previewContent={<KwitansiPreview item={activeDocument} invoices={invoices} />}
        />
      )}
    </div>
  );
};

export default InvoicePayment;
