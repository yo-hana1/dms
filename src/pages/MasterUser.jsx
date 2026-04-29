import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { Plus, Search, Filter, X, Edit, Trash2 } from 'lucide-react';

const MasterUser = () => {
  const { masterUsers, addMasterUser, updateMasterUser, softDelete, searchTerm } = useAppData();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filterType, setFilterType] = useState('All');
  
  const [formData, setFormData] = useState({
    type: '',
    name: '',
    position: '',
    company: '',
    contact: '',
    status: 'Aktif'
  });

  const filteredUsers = masterUsers.filter(user => {
    if (user.isDeleted) return false;
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'All' || user.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateMasterUser(editingId, formData);
      setEditingId(null);
    } else {
      addMasterUser(formData);
    }
    setShowModal(false);
    setFormData({ type: '', name: '', position: '', company: '', contact: '', status: 'Aktif' });
  };

  const handleEdit = (user) => {
    setFormData({
      type: user.type,
      name: user.name,
      position: user.position,
      company: user.company,
      contact: user.contact,
      status: user.status
    });
    setEditingId(user.id);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Hapus user ini?')) {
      softDelete('MasterUser', id);
    }
  };

  const getStatusBadgeStyle = (status) => {
    return {
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '500',
      backgroundColor: status === 'Aktif' ? '#dcfce7' : '#fee2e2',
      color: status === 'Aktif' ? '#166534' : '#991b1b'
    };
  };

  return (
    <div className="master-user-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <select 
            className="card" 
            style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', margin: 0 }}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="All">Semua Tipe</option>
            <option value="Internal">Internal</option>
            <option value="Main Contractor">Main Contractor</option>
            <option value="Sub Contractor">Sub Contractor</option>
            <option value="Vendor">Vendor</option>
          </select>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={() => {
            setEditingId(null);
            setFormData({ type: '', name: '', position: '', company: '', contact: '', status: 'Aktif' });
            setShowModal(true);
          }}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={18} /> Tambah User
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        {['Internal', 'Main Contractor', 'Sub Contractor', 'Vendor'].map(type => {
          const usersByType = filteredUsers.filter(u => u.type === type);
          if (filterType !== 'All' && filterType !== type) return null;

          return (
            <div key={type}>
              <h3 style={{ 
                marginBottom: '15px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px',
                fontSize: '1.1rem',
                color: 'var(--secondary)'
              }}>
                <span style={{ width: '4px', height: '18px', backgroundColor: 'var(--primary)', borderRadius: '2px' }}></span>
                List {type}
              </h3>
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div className="table-container">
                  <table style={{ 
                    tableLayout: 'fixed', 
                    width: '100%', 
                    borderCollapse: 'collapse',
                    borderSpacing: 0
                  }}>
                    <thead>
                      <tr>
                        <th style={{ width: '25%', padding: '15px', textAlign: 'left', borderBottom: '1px solid #edf2f7', color: '#718096', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nama</th>
                        <th style={{ width: '20%', padding: '15px', textAlign: 'left', borderBottom: '1px solid #edf2f7', color: '#718096', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Jabatan</th>
                        <th style={{ width: '20%', padding: '15px', textAlign: 'left', borderBottom: '1px solid #edf2f7', color: '#718096', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Perusahaan</th>
                        <th style={{ width: '15%', padding: '15px', textAlign: 'left', borderBottom: '1px solid #edf2f7', color: '#718096', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Kontak</th>
                        <th style={{ width: '10%', padding: '15px', textAlign: 'left', borderBottom: '1px solid #edf2f7', color: '#718096', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                        <th style={{ width: '10%', padding: '15px', textAlign: 'center', borderBottom: '1px solid #edf2f7', color: '#718096', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersByType.length > 0 ? usersByType.map(user => (
                        <tr key={user.id} style={{ borderBottom: '1px solid #edf2f7' }}>
                          <td style={{ padding: '15px', verticalAlign: 'middle', fontWeight: '500', color: '#2d3748', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</td>
                          <td style={{ padding: '15px', verticalAlign: 'middle', color: '#4a5568', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.position}</td>
                          <td style={{ padding: '15px', verticalAlign: 'middle', color: '#4a5568', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.company}</td>
                          <td style={{ padding: '15px', verticalAlign: 'middle', color: '#4a5568', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.contact}</td>
                          <td style={{ padding: '15px', verticalAlign: 'middle' }}>
                            <span style={getStatusBadgeStyle(user.status)}>{user.status}</span>
                          </td>
                          <td style={{ padding: '15px', verticalAlign: 'middle' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                              <button 
                                onClick={() => handleEdit(user)}
                                style={{ background: 'none', border: 'none', color: '#3182ce', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }}
                                title="Edit"
                              >
                                <Edit size={18} />
                              </button>
                              <button 
                                onClick={() => handleDelete(user.id)}
                                style={{ background: 'none', border: 'none', color: '#e53e3e', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }}
                                title="Hapus"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#a0aec0', fontSize: '14px' }}>
                            Data {type} tidak ditemukan
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content modal-small">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{editingId ? 'Edit User' : 'Tambah User Baru'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>Tipe User <span style={{ color: 'red' }}>*</span></label>
                <select 
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  <option value="">Pilih Tipe</option>
                  <option value="Internal">Internal</option>
                  <option value="Main Contractor">Main Contractor</option>
                  <option value="Sub Contractor">Sub Contractor</option>
                  <option value="Vendor">Vendor</option>
                </select>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>Nama</label>
                <input 
                  type="text"
                  placeholder="Nama Lengkap"
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>Jabatan</label>
                <input 
                  type="text"
                  placeholder="Jabatan"
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                  value={formData.position}
                  onChange={(e) => setFormData({...formData, position: e.target.value})}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>Perusahaan</label>
                <input 
                  type="text"
                  placeholder="Nama Perusahaan"
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>Kontak</label>
                <input 
                  type="text"
                  placeholder="Email atau No. Telp"
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                  value={formData.contact}
                  onChange={(e) => setFormData({...formData, contact: e.target.value})}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>Status</label>
                <select 
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Tidak Aktif">Tidak Aktif</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline" style={{ padding: '10px 20px' }}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px' }}>{editingId ? 'Update User' : 'Simpan User'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterUser;

