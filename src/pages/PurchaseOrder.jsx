import React, { useState } from 'react';
import { Plus, Search, Eye, Printer, Trash, Trash2, FileDown, X } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import DocumentDetail from '../components/DocumentDetail';
import POPreview from '../components/previews/POPreview';

const PurchaseOrder = () => {
  const { projects, purchaseOrders, addPO, approvePO, rejectPO, searchTerm, softDelete } = useAppData();
  const [showModal, setShowModal] = useState(false);
  const [items, setItems] = useState([{ name: '', qty: 0, price: 0 }]);
  const [activePO, setActivePO] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  
  const [formData, setFormData] = useState({
    projectId: '',
    vendor: '',
    date: new Date().toISOString().split('T')[0],
  });

  const addItem = () => setItems([...items, { name: '', qty: 0, price: 0 }]);
  const removeItem = (index) => setItems(items.filter((_, i) => i !== index));
  
  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.qty * item.price), 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addPO({
      ...formData,
      items,
      total: calculateTotal()
    });
    setShowModal(false);
    setItems([{ name: '', qty: 0, price: 0 }]);
  };

  const openPreview = (po) => {
    setActivePO(po);
    setShowPreview(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Hapus dokumen Purchase Order ini?")) {
      softDelete('PO', id);
    }
  };

  const filteredPOs = purchaseOrders.filter(po => {
    if (po.isDeleted) return false;
    const project = projects.find(p => p.id === parseInt(po.projectId));
    const searchLow = (searchTerm || '').toLowerCase();
    return searchTerm === '' || 
      (po.code && po.code.toLowerCase().includes(searchLow)) ||
      (project && project.name && project.name.toLowerCase().includes(searchLow)) ||
      (po.vendor && po.vendor.toLowerCase().includes(searchLow));
  });

  return (
    <div>
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.2rem' }}>Daftar Purchase Order</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Buat PO Baru
        </button>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>No. PO</th>
                <th>Tanggal</th>
                <th>Proyek</th>
                <th>Vendor</th>
                <th>Total Nominal</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredPOs.map((po) => (
                <tr key={po.id}>
                  <td>{po.code}</td>
                  <td>{po.date}</td>
                  <td>{projects.find(p => p.id === parseInt(po.projectId))?.name || 'Project A'}</td>
                  <td>{po.vendor}</td>
                  <td>Rp {po.total.toLocaleString()}</td>
                  <td>
                    <span style={{ 
                      padding: '4px 10px', 
                      borderRadius: '12px', 
                      fontSize: '12px', 
                      backgroundColor: po.status === 'Approved' ? '#d4edda' : po.status === 'Pending' ? '#fff3cd' : '#f8d7da',
                      color: po.status === 'Approved' ? '#155724' : po.status === 'Pending' ? '#856404' : '#721c24'
                    }}>
                      {po.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button 
                        onClick={() => openPreview(po)}
                        style={{ color: '#007bff', background: 'none', border: 'none' }} 
                        title="View Detail"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(po.id)} 
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

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '800px' }}>
            <h2 style={{ marginBottom: '20px' }}>Create New Purchase Order</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Pilih Proyek</label>
                  <select 
                    required
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                    value={formData.projectId}
                    onChange={(e) => setFormData({...formData, projectId: e.target.value})}
                  >
                    <option value="">-- Pilih Proyek --</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Nama Vendor</label>
                  <input 
                    type="text" 
                    required
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                    value={formData.vendor}
                    onChange={(e) => setFormData({...formData, vendor: e.target.value})}
                    placeholder="Contoh: PT. Baja Abadi"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Tanggal PO</label>
                  <input 
                    type="date" 
                    required
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h4 style={{ fontWeight: '600' }}>Item Detail</h4>
                  <button type="button" onClick={addItem} className="btn btn-outline" style={{ fontSize: '12px', padding: '4px 8px' }}>
                    <Plus size={14} /> Add Item
                  </button>
                </div>
                
                <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #eee', padding: '10px', borderRadius: '4px' }}>
                  {items.map((item, index) => (
                    <div key={index} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.5fr 40px', gap: '10px', marginBottom: '10px' }}>
                      <input 
                        placeholder="Nama Item" 
                        style={{ padding: '6px', border: '1px solid #ddd' }}
                        value={item.name}
                        onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                      />
                      <input 
                        type="number" 
                        placeholder="Qty" 
                        style={{ padding: '6px', border: '1px solid #ddd' }}
                        value={item.qty}
                        onChange={(e) => handleItemChange(index, 'qty', parseInt(e.target.value))}
                      />
                      <input 
                        type="number" 
                        placeholder="Harga" 
                        style={{ padding: '6px', border: '1px solid #ddd' }}
                        value={item.price}
                        onChange={(e) => handleItemChange(index, 'price', parseInt(e.target.value))}
                      />
                      <button type="button" onClick={() => removeItem(index)} style={{ border: 'none', background: 'none', color: '#dc3545' }}>
                        <Trash size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                
                <div style={{ textAlign: 'right', marginTop: '15px', fontWeight: 'bold' }}>
                  Total: Rp {calculateTotal().toLocaleString()}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Batal</button>
                <button type="submit" className="btn btn-primary">Simpan PO</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPreview && activePO && (
        <DocumentDetail 
          item={{
            ...activePO,
            projectName: projects.find(p => p.id === parseInt(activePO.projectId))?.name
          }} 
          type="PO" 
          onClose={() => setShowPreview(false)}
          previewContent={<POPreview item={activePO} projects={projects} />}
        />
      )}
    </div>
  );
};

export default PurchaseOrder;
