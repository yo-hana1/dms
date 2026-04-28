import React, { useState } from 'react';
import { CheckCircle, XCircle, Eye, Printer, X } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import logo from '../assets/logowkp.jpg';

const Approval = () => {
  const { purchaseOrders, approvePO, rejectPO, projects, payments, approvePayment, rejectPayment, invoices } = useAppData();
  const [activePO, setActivePO] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  
  const openPreview = (po) => {
    setActivePO(po);
    setShowPreview(true);
  };
  
  const pendingPOs = purchaseOrders.filter(po => po.status === 'Pending');
  const pendingPayments = (payments || []).filter(p => p.status === 'Pending');

  return (
    <div>
      <div className="card" style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>Menunggu Persetujuan (Approval)</h2>
        <p style={{ color: '#666', fontSize: '14px' }}>Persetujuan Purchase Order dan Pembayaran</p>
      </div>

      <div className="card">
        <h3 style={{ fontSize: '1.1rem', marginBottom: '15px' }}>Purchase Orders Pending</h3>
        {pendingPOs.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>Tidak ada PO yang menunggu persetujuan.</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>No. PO</th>
                  <th>Proyek</th>
                  <th>Vendor</th>
                  <th>Total exc PPN</th>
                  <th>Tgl Pengajuan</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {pendingPOs.map((po) => (
                  <tr key={po.id}>
                    <td>{po.code}</td>
                    <td>{projects.find(p => p.id === parseInt(po.projectId))?.name}</td>
                    <td>{po.vendor}</td>
                    <td>Rp {po.total.toLocaleString()}</td>
                    <td>{po.date}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => approvePO(po.id)}
                          style={{ padding: '6px 12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px' }}
                        >
                          <CheckCircle size={14} /> Approve
                        </button>
                        <button 
                          onClick={() => rejectPO(po.id)}
                          style={{ padding: '6px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px' }}
                        >
                          <XCircle size={14} /> Reject
                        </button>
                        <button 
                          onClick={() => openPreview(po)}
                          style={{ padding: '6px 8px', border: '1px solid #ddd', background: 'white', borderRadius: '4px', cursor: 'pointer' }}
                          title="Preview Document"
                        >
                          <Eye size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card" style={{ marginTop: '20px' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '15px' }}>Pengajuan Pembayaran Pending</h3>
        {pendingPayments.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>Tidak ada pengajuan pembayaran yang menunggu persetujuan.</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>No. Invoice</th>
                  <th>Vendor</th>
                  <th>Nominal</th>
                  <th>Tgl Bayar</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {pendingPayments.map((p) => (
                  <tr key={p.id}>
                    <td>{invoices.find(inv => inv.id === parseInt(p.invoiceId))?.code || 'N/A'}</td>
                    <td>{p.vendor}</td>
                    <td>Rp {p.amount.toLocaleString()}</td>
                    <td>{p.date}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => approvePayment(p.id)}
                          style={{ padding: '6px 12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', cursor: 'pointer' }}
                        >
                          <CheckCircle size={14} /> Approve
                        </button>
                        <button 
                          onClick={() => rejectPayment(p.id)}
                          style={{ padding: '6px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', cursor: 'pointer' }}
                        >
                          <XCircle size={14} /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showPreview && activePO && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '900px', padding: '0', background: '#f4f4f4' }}>
            <div style={{ padding: '15px 25px', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>Preview Dokumen Purchase Order</h3>
              <button onClick={() => setShowPreview(false)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            
            <div style={{ padding: '40px', maxHeight: '80vh', overflowY: 'auto' }}>
              <div id="po-document" style={{ 
                backgroundColor: 'white', 
                padding: '50px', 
                boxShadow: '0 0 20px rgba(0,0,0,0.1)',
                minHeight: '800px',
                width: '100%',
                margin: '0 auto',
                color: '#333',
                fontFamily: 'serif',
                fontSize: '14px'
              }}>
                {/* Letterhead (Kop) */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', borderBottom: '4px double #333', paddingBottom: '20px' }}>
                  <img src={logo} alt="PT. WKP Logo" style={{ width: '80px', height: 'auto', marginRight: '20px' }} />
                  <div style={{ flex: 1 }}>
                    <h1 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0', letterSpacing: '1px' }}>PT. WIJAYA KUSUMA PERDANA</h1>
                    <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#555', fontFamily: 'sans-serif' }}>
                      General Contractor & Construction Management<br />
                      Jl. Jendral Sudirman No. 123, Jakarta, Indonesia<br />
                      Telp: (021) 555-0123 | Email: info@wkp-construction.id
                    </p>
                  </div>
                </div>

                <div style={{ textAlign: 'center', margin: '30px 0' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: 'bold', border: '2px solid #333', display: 'inline-block', padding: '5px 20px', marginBottom: '10px' }}>PURCHASE ORDER</h2>
                  <p style={{ fontSize: '14px', marginTop: '5px' }}>Ref: {projects.find(p => p.id === parseInt(activePO.projectId))?.code || '-'}</p>
                </div>

                {/* Header Info Table */}
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', border: '1px solid #333' }}>
                  <tbody>
                    <tr>
                      <td style={{ width: '65%', border: '1px solid #333', padding: '10px', verticalAlign: 'top' }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Kepada Yth. :</div>
                        <div style={{ fontWeight: 'bold', fontSize: '15px' }}>{activePO.vendor}</div>
                        <div style={{ color: '#555', fontSize: '13px', lineHeight: '1.4', marginTop: '5px' }}>
                          Jl. Kalianyar No.30, Kapasari, Kec. Genteng,<br />
                          Surabaya, Jawa Timur 60273
                        </div>
                      </td>
                      <td style={{ width: '35%', border: '1px solid #333', padding: '10px', verticalAlign: 'top' }}>
                        <div style={{ marginBottom: '5px' }}><strong>Tanggal :</strong> {new Date(activePO.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                        <div><strong>No. PO :</strong> {activePO.code}</div>
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Items Table */}
                <table className="po-items-table" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f9f9f9' }}>
                      <th style={{ border: '1px solid #333', padding: '8px', textAlign: 'center', width: '40px' }}>No.</th>
                      <th style={{ border: '1px solid #333', padding: '8px', textAlign: 'left' }}>Deskripsi</th>
                      <th style={{ border: '1px solid #333', padding: '8px', textAlign: 'center', width: '60px' }}>Qty</th>
                      <th style={{ border: '1px solid #333', padding: '8px', textAlign: 'center', width: '60px' }}>Uni</th>
                      <th style={{ border: '1px solid #333', padding: '8px', textAlign: 'right', width: '120px' }}>Harga per Unit</th>
                      <th style={{ border: '1px solid #333', padding: '8px', textAlign: 'right', width: '140px' }}>Jumlah</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activePO.items && activePO.items.map((item, idx) => (
                      <tr key={idx}>
                        <td style={{ border: '1px solid #333', padding: '8px', textAlign: 'center' }}>{idx + 1}</td>
                        <td style={{ border: '1px solid #333', padding: '8px' }}>{item.name}</td>
                        <td style={{ border: '1px solid #333', padding: '8px', textAlign: 'center' }}>{item.qty}</td>
                        <td style={{ border: '1px solid #333', padding: '8px', textAlign: 'center' }}>Pcs</td>
                        <td style={{ border: '1px solid #333', padding: '8px', textAlign: 'right' }}>{(item.price || 0).toLocaleString()}</td>
                        <td style={{ border: '1px solid #333', padding: '8px', textAlign: 'right' }}>{((item.qty || 0) * (item.price || 0)).toLocaleString()}</td>
                      </tr>
                    ))}
                    {/* Totals */}
                    <tr>
                      <td colSpan="4" rowSpan="3" style={{ border: '1px solid #333', padding: '10px', verticalAlign: 'top', backgroundColor: '#fff' }}></td>
                      <td style={{ border: '1px solid #333', padding: '8px', fontWeight: 'bold', textAlign: 'right' }}>Sub total</td>
                      <td style={{ border: '1px solid #333', padding: '8px', textAlign: 'right' }}>{(activePO.total || 0).toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid #333', padding: '8px', fontWeight: 'bold', textAlign: 'right' }}>PPN 11%</td>
                      <td style={{ border: '1px solid #333', padding: '8px', textAlign: 'right' }}>{((activePO.total || 0) * 0.11).toLocaleString()}</td>
                    </tr>
                    <tr style={{ backgroundColor: '#d4edda' }}>
                      <td style={{ border: '1px solid #333', padding: '8px', fontWeight: 'bold', textAlign: 'right' }}>Total</td>
                      <td style={{ border: '1px solid #333', padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>{((activePO.total || 0) * 1.11).toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>

                {/* Footer Notes */}
                <div style={{ border: '1px solid #333', padding: '10px', marginBottom: '40px' }}>
                  <div style={{ fontWeight: 'bold', textDecoration: 'underline', marginBottom: '10px' }}>Keterangan</div>
                  <div style={{ marginLeft: '10px' }}>
                    <div style={{ marginBottom: '10px' }}>
                      <strong>1. Delivery time :</strong> Urgent
                      <div style={{ marginLeft: '17px', marginTop: '5px' }}>
                        Dikirim ke alamat :<br />
                        <span style={{ fontWeight: 'bold' }}>{projects.find(p => p.id === parseInt(activePO.projectId))?.location || 'Alamat Proyek'}</span>
                      </div>
                    </div>
                    <div>
                      <strong>2. Payment :</strong><br />
                      <div style={{ marginLeft: '17px' }}>Transfer</div>
                    </div>
                  </div>
                </div>

                {/* Signature */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                  <div style={{ textAlign: 'center', minWidth: '200px' }}>
                    <p style={{ marginBottom: '80px' }}>Hormat Kami,</p>
                    <p style={{ margin: '0', fontWeight: 'bold', textDecoration: 'underline' }}>Bagian Keuangan</p>
                    <p style={{ margin: '0' }}>PT. WIJAYA KUSUMA PERDANA</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div style={{ padding: '15px 25px', borderTop: '1px solid #ddd', display: 'flex', justifyContent: 'flex-end', gap: '10px', background: 'white' }}>
              <button 
                className="btn btn-outline" 
                onClick={() => window.print()}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Printer size={16} /> Print Document
              </button>
              <button className="btn btn-primary" onClick={() => setShowPreview(false)}>Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Approval;
