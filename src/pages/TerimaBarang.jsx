import React, { useState } from 'react';
import { Plus, Search, Eye, FileCheck, Upload, Printer, X, Trash2, Camera } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import DocumentDetail from '../components/DocumentDetail';
import TerimaBarangPreview from '../components/previews/TerimaBarangPreview';

const TerimaBarang = () => {
  const { purchaseOrders, terimaBarang, setTerimaBarang, generateTBCode, projects, searchTerm, softDelete } = useAppData();
  const [showModal, setShowModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [activeTB, setActiveTB] = useState(null);
  
  const [formData, setFormData] = useState({
    poId: '',
    date: new Date().toISOString().split('T')[0],
    pic: 'Budi Santoso (Manajer Gudang)'
  });

  const approvedPOs = purchaseOrders.filter(po => po.status === 'Approved');

  const handleSubmit = (e) => {
    e.preventDefault();
    const po = purchaseOrders.find(p => p.id === parseInt(formData.poId));
    const newTB = {
      ...formData,
      id: Date.now(),
      vendor: po?.vendor || 'Vendor',
      code: generateTBCode(po?.vendor || 'Vendor', formData.date),
      status: 'Received',
      fileType: formData.file ? formData.file.name.split('.').pop().toUpperCase() : 'PDF',
      fileSize: formData.file ? ((formData.file.size || 2048000) / 1024 / 1024).toFixed(1) + ' MB' : '1.5 MB'
    };
    
    setTerimaBarang([...terimaBarang, newTB]);
    setShowModal(false);
    setFormData({
      poId: '',
      date: new Date().toISOString().split('T')[0],
      pic: 'Budi Santoso (Manajer Gudang)'
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Hapus dokumen Terima Barang ini?")) {
      softDelete('TerimaBarang', id);
    }
  };

  const openPreview = (tb) => {
    setActiveTB(tb);
    setShowPreview(true);
  };

  const filteredTBs = terimaBarang.filter(tb => {
    if (tb.isDeleted) return false;
    const po = purchaseOrders.find(p => p.id === parseInt(tb.poId));
    const searchLow = (searchTerm || '').toLowerCase();
    return searchTerm === '' || 
      (tb.code && tb.code.toLowerCase().includes(searchLow)) ||
      (po && po.code && po.code.toLowerCase().includes(searchLow)) ||
      (tb.vendor && tb.vendor.toLowerCase().includes(searchLow));
  });

  return (
    <div>
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.2rem' }}>Daftar Terima Barang</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Input Terima Barang
        </button>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>No. Terima Barang</th>
                <th>No. PO Ref</th>
                <th>Vendor</th>
                <th>Tanggal Diterima</th>
                <th>PIC (Gudang)</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredTBs.map((tb) => (
                <tr key={tb.id}>
                  <td>{tb.code}</td>
                  <td>{purchaseOrders.find(p => p.id === parseInt(tb.poId))?.code || 'PO Ref'}</td>
                  <td>{tb.vendor}</td>
                  <td>{tb.date}</td>
                  <td>{tb.pic}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button 
                        onClick={() => openPreview(tb)}
                        style={{ color: '#007bff', background: 'none', border: 'none' }} 
                        title="View Preview"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(tb.id)}
                        style={{ color: '#dc3545', background: 'none', border: 'none' }} 
                        title="Hapus"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredTBs.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                    Belum ada data Terima Barang.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '800px' }}>
            <h2 style={{ marginBottom: '20px' }}>Form Input Serah Terima Barang</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Pilih Referensi PO</label>
                  <select 
                    required
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                    value={formData.poId}
                    onChange={(e) => setFormData({...formData, poId: e.target.value})}
                  >
                    <option value="">-- Pilih PO --</option>
                    {approvedPOs.map(po => <option key={po.id} value={po.id}>{po.code} - {po.vendor}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Vendor</label>
                  <input
                    type="text"
                    readOnly
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#f8f9fa' }}
                    value={purchaseOrders.find(p => p.id === parseInt(formData.poId))?.vendor || ''}
                    placeholder="Auto generate dari PO"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Tanggal Terima Barang</label>
                  <input 
                    type="date" 
                    required
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '5px' }}>PIC (Manajer Gudang)</label>
                  <input 
                    type="text" 
                    required
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                    value={formData.pic}
                    onChange={(e) => setFormData({...formData, pic: e.target.value})}
                  />
                </div>
              </div>

              <div style={{ margin: '20px 0' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Dokumen Tanda Terima (Surat Jalan/Delivery Order)</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ flex: 1, position: 'relative' }}>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      id="upload-file-tb"
                      style={{ display: 'none' }}
                      onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
                    />
                    <label 
                      htmlFor="upload-file-tb"
                      className="btn btn-outline"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', borderStyle: 'dashed' }}
                    >
                      <Upload size={18} /> {formData.file ? formData.file.name : 'Upload File (PDF/Word/JPG/PNG)'}
                    </label>
                  </div>
                  
                  <div style={{ flex: 1, position: 'relative' }}>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      id="scan-camera-tb"
                      style={{ display: 'none' }}
                      onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
                    />
                    <label 
                      htmlFor="scan-camera-tb"
                      className="btn btn-outline"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', backgroundColor: '#f8f9fa' }}
                    >
                      <Camera size={18} /> Scan Dokumen dari Kamera
                    </label>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '30px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Batal</button>
                <button type="submit" className="btn btn-primary">Simpan Data Terima Barang</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPreview && activeTB && (
        <DocumentDetail 
          item={{
            ...activeTB,
            poCode: purchaseOrders.find(p => p.id === parseInt(activeTB.poId))?.code,
            projectName: projects.find(p => p.id === parseInt(purchaseOrders.find(po => po.id === parseInt(activeTB.poId))?.projectId))?.name
          }} 
          type="Terima Barang" 
          onClose={() => setShowPreview(false)}
          previewContent={<TerimaBarangPreview item={activeTB} purchaseOrders={purchaseOrders} />}
        />
      )}
    </div>
  );
};

export default TerimaBarang;
