import React, { useState } from 'react';
import { Plus, Edit2, Eye, Trash2, Filter, X } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import DocumentDetail from '../components/DocumentDetail';
import ProjectPreview from '../components/previews/ProjectPreview';

const DataProyek = () => {
  const { projects, addProject, searchTerm, softDelete } = useAppData();
  const [showModal, setShowModal] = useState(false);
  const [filterYear, setFilterYear] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    owner: '',
    type: '',
    location: '',
    startDate: '',
    endDate: '',
    details: '',
    pic: '',
    status: 'Active'
  });

  const years = Array.from({ length: 2035 - 2026 + 1 }, (_, i) => (2026 + i).toString()).reverse();

  const projectTypes = ['Gedung', 'Rumah', 'Jembatan', 'Renovasi', 'Jalan', 'Lainnya'];
  const picOptions = [
    'Budi Wirawan (Direktur PT. WKP)',
    'Anto Susilo (Manajer PT. WKP)',
    'Dedi Purnomo (Konsultan PT. WKP)'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    addProject({ ...formData, status: 'Active' });
    setShowModal(false);
    setFormData({ name: '', owner: '', type: '', location: '', startDate: '', endDate: '', details: '', pic: '' });
  };

  const openPreview = (item) => {
    setActiveItem(item);
    setShowPreview(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Hapus dokumen data proyek ini?")) {
      softDelete('Project', id);
    }
  };

  const filteredProjects = projects.filter(p => {
    if (p.isDeleted) return false;
    const matchType = filterType === '' || p.type === filterType;
    const matchYear = filterYear === '' || (p.startDate && p.startDate.split('-')[0] === filterYear);
    
    // Search matching
    const searchLow = (searchTerm || '').toLowerCase();
    const matchSearch = searchTerm === '' || 
      (p.name && p.name.toLowerCase().includes(searchLow)) || 
      (p.owner && p.owner.toLowerCase().includes(searchLow)) || 
      (p.location && p.location.toLowerCase().includes(searchLow)) ||
      (p.code && p.code.toLowerCase().includes(searchLow));

    return matchType && matchYear && matchSearch;
  });

  const today = new Date().toISOString().split('T')[0];

  const getStatusInfo = (p) => {
    if (!p.startDate || !p.endDate) return { label: 'Unknown', color: '#6c757d', bg: '#e9ecef' };
    
    if (today < p.startDate) {
      return { label: 'Waiting', color: '#856404', bg: '#fff3cd' };
    } else if (today > p.endDate) {
      return { label: 'Done', color: '#721c24', bg: '#f8d7da' };
    } else {
      return { label: 'Active', color: '#155724', bg: '#d4edda' };
    }
  };

  return (
    <div>
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={18} color="#666" />
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#666' }}>Filter:</span>
          </div>
          
          <select 
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '14px', minWidth: '150px' }}
          >
            <option value="">Semua Tahun</option>
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '14px', minWidth: '150px' }}
          >
            <option value="">Semua Jenis</option>
            {projectTypes.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <button className="btn btn-primary" onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Tambah Proyek
        </button>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>No. Proyek</th>
                <th>Nama Proyek</th>
                <th>Pemilik</th>
                <th>Jenis</th>
                <th>Lokasi</th>
                <th>Tgl Mulai</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.length > 0 ? (
                filteredProjects.map((p) => {
                  const statusInfo = getStatusInfo(p);
                  return (
                    <tr key={p.id}>
                      <td>{p.code}</td>
                      <td style={{ fontWeight: '500' }}>{p.name}</td>
                      <td>{p.owner || '-'}</td>
                      <td>{p.type}</td>
                      <td>{p.location}</td>
                      <td>{p.startDate}</td>
                      <td>
                        <span style={{ 
                          padding: '4px 10px', 
                          borderRadius: '12px', 
                          fontSize: '12px', 
                          backgroundColor: statusInfo.bg,
                          color: statusInfo.color
                        }}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button style={{ color: '#007bff', background: 'none', border: 'none' }} title="Detail" onClick={() => openPreview(p)}><Eye size={16} /></button>
                          <button style={{ color: '#dc3545', background: 'none', border: 'none' }} title="Hapus" onClick={() => handleDelete(p.id)}><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '30px', color: '#999' }}>Tidak ada proyek yang ditemukan.</td>
                </tr>
              )}


            </tbody>
          </table>
        </div>
      </div>

      {/* Preview Detail Modal */}
      {showPreview && activeItem && (
        <DocumentDetail 
          item={activeItem} 
          type="Project" 
          onClose={() => setShowPreview(false)}
          previewContent={<ProjectPreview item={activeItem} />}
        />
      )}

      {/* Modal Tambah Proyek */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '800px' }}>
            <h2 style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Tambah Proyek Baru</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Nama Proyek</label>
                  <input 
                    type="text" 
                    required 
                    className="form-control" 
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Pemilik (Owner)</label>
                  <input 
                    type="text" 
                    required 
                    className="form-control" 
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                    value={formData.owner}
                    onChange={(e) => setFormData({...formData, owner: e.target.value})}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Jenis Pembangunan</label>
                  <select 
                    required
                    className="form-control" 
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="">Pilih Jenis</option>
                    {projectTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Lokasi</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Tanggal Mulai</label>
                  <input 
                    type="date" 
                    className="form-control" 
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Tanggal Selesai</label>
                  <input 
                    type="date" 
                    className="form-control" 
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>PIC Proyek (PT. WKP)</label>
                  <select 
                    required
                    className="form-control" 
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                    value={formData.pic}
                    onChange={(e) => setFormData({...formData, pic: e.target.value})}
                  >
                    <option value="">Pilih PIC</option>
                    {picOptions.map((pic) => (
                      <option key={pic} value={pic}>{pic}</option>
                    ))}
                  </select>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Detail Kebutuhan</label>
                  <textarea 
                    rows="3" 
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                    value={formData.details}
                    onChange={(e) => setFormData({...formData, details: e.target.value})}
                  ></textarea>
                </div>
              </div>
              <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Batal</button>
                <button type="submit" className="btn btn-primary">Simpan Proyek</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataProyek;
