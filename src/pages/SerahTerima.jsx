import React, { useState } from 'react';
import { Upload, Plus, Trash2, Eye, ClipboardCheck, X } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import DocumentDetail from '../components/DocumentDetail';
import STPreview from '../components/previews/STPreview';
import LPJPreview from '../components/previews/LPJPreview';

const SerahTerima = () => {
  const { projects, appointments, setAppointments, generateSTCode, lpjReports, setLpjReports, generateLPJCode, searchTerm, softDelete } = useAppData();
  const [showModal, setShowModal] = useState(false);
  const [showLPJModal, setShowLPJModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [previewType, setPreviewType] = useState('SerahTerima');
  
  const [formData, setFormData] = useState({
    projectId: '',
    mainCon: '',
    subCon: '',
    vendor: '',
    date: new Date().toISOString().split('T')[0],
    document: null,
  });

  const [lpjFormData, setLpjFormData] = useState({
    appointmentId: '',
    closingReportDate: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newAppointment = {
      ...formData,
      id: Date.now(),
      code: generateSTCode(formData.date)
    };
    setAppointments([...appointments, newAppointment]);
    setShowModal(false);
    setFormData({
      projectId: '',
      mainCon: '',
      subCon: '',
      vendor: '',
      date: new Date().toISOString().split('T')[0],
      document: null,
    });
  };

  const handleLPJSubmit = (e) => {
    e.preventDefault();
    const appointment = appointments.find(a => a.id === parseInt(lpjFormData.appointmentId));
    const project = projects.find(p => p.id === parseInt(appointment?.projectId));
    
    const newLPJ = {
      ...lpjFormData,
      id: Date.now(),
      projectName: project?.name || 'Project',
      owner: project?.owner || 'Owner',
      code: generateLPJCode(project?.name || 'Unknown', lpjFormData.closingReportDate)
    };
    
    setLpjReports([...lpjReports, newLPJ]);
    setShowLPJModal(false);
    setLpjFormData({
      appointmentId: '',
      closingReportDate: new Date().toISOString().split('T')[0],
    });
  };

  const openLPJModal = (appointmentId) => {
    setLpjFormData({
      ...lpjFormData,
      appointmentId: appointmentId.toString()
    });
    setShowLPJModal(true);
  };

  const handleDelete = (type, id) => {
    if (window.confirm(`Hapus dokumen ${type} ini?`)) {
      softDelete(type, id);
    }
  };

  const openPreview = (item, type = 'SerahTerima') => {
    setActiveItem(item);
    setPreviewType(type);
    setShowPreview(true);
  };

  const filteredAppointments = appointments.filter(a => {
    if (a.isDeleted) return false;
    const project = projects.find(p => p.id === parseInt(a.projectId));
    const searchLow = (searchTerm || '').toLowerCase();
    return searchTerm === '' || 
      (a.code && a.code.toLowerCase().includes(searchLow)) ||
      (project && project.name && project.name.toLowerCase().includes(searchLow)) ||
      (a.vendor && a.vendor.toLowerCase().includes(searchLow)) ||
      (a.mainCon && a.mainCon.toLowerCase().includes(searchLow)) ||
      (a.subCon && a.subCon.toLowerCase().includes(searchLow));
  });

  const filteredLPJ = lpjReports.filter(l => {
    if (l.isDeleted) return false;
    const searchLow = (searchTerm || '').toLowerCase();
    return searchTerm === '' || 
      (l.code && l.code.toLowerCase().includes(searchLow)) ||
      (l.projectName && l.projectName.toLowerCase().includes(searchLow)) ||
      (l.owner && l.owner.toLowerCase().includes(searchLow));
  });

  return (
    <div>
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.2rem' }}>Penunjukan & Serah Terima</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Input Penunjukan
        </button>
      </div>

      <div className="card" style={{ marginBottom: '30px' }}>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>No. ST</th>
                <th>Proyek</th>
                <th>Main Contractor</th>
                <th>Sub Contractor</th>
                <th>Vendor Utama</th>
                <th>Tgl Penunjukan</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((st) => (
                <tr key={st.id}>
                  <td>{st.code}</td>
                  <td>{projects.find(p => p.id === parseInt(st.projectId))?.name}</td>
                  <td>{st.mainCon}</td>
                  <td>{st.subCon}</td>
                  <td>{st.vendor}</td>
                  <td>{st.date}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button 
                        onClick={() => openLPJModal(st.id)}
                        style={{ color: '#28a745', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }} 
                        title="Buat Pertanggungjawaban (LPJ)"
                      >
                        <ClipboardCheck size={16} /> LPJ
                      </button>
                      <button 
                        onClick={() => openPreview(st)}
                        style={{ color: '#007bff', background: 'none', border: 'none', cursor: 'pointer' }} 
                        title="Preview"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete('SerahTerima', st.id)} 
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

      <div className="card" style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.2rem' }}>Laporan Penutupan (LPJ)</h2>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>No. LPJ</th>
                <th>Ref Serah Terima</th>
                <th>Pemilik Proyek</th>
                <th>Tgl Penutupan</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredLPJ.map((lpj) => (
                <tr key={lpj.id}>
                  <td>{lpj.code}</td>
                  <td>{appointments.find(a => a.id === parseInt(lpj.appointmentId))?.code}</td>
                  <td>{lpj.owner}</td>
                  <td>{lpj.closingReportDate}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button 
                        onClick={() => openPreview(lpj, 'LPJ')}
                        style={{ color: '#007bff', background: 'none', border: 'none', cursor: 'pointer' }} 
                        title="Preview LPJ"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete('LPJ', lpj.id)} 
                        style={{ color: '#dc3545', background: 'none', border: 'none', cursor: 'pointer' }} 
                        title="Hapus"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredLPJ.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#999' }}>Belum ada laporan penutupan.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showPreview && activeItem && (
        <DocumentDetail 
          item={previewType === 'SerahTerima' ? {
            ...activeItem,
            projectName: projects.find(p => p.id === parseInt(activeItem.projectId))?.name
          } : activeItem} 
          type={previewType} 
          onClose={() => setShowPreview(false)}
          previewContent={
            previewType === 'SerahTerima' 
              ? <STPreview item={activeItem} projects={projects} />
              : <LPJPreview item={activeItem} appointments={appointments} projects={projects} />
          }
        />
      )}

      {/* Input Penunjukan Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '800px' }}>
            <h2 style={{ marginBottom: '20px' }}>Input Penunjukan Pihak</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
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
                  <label style={{ display: 'block', marginBottom: '5px' }}>Main Contractor</label>
                  <input 
                    type="text" 
                    required
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                    value={formData.mainCon}
                    onChange={(e) => setFormData({...formData, mainCon: e.target.value})}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Sub Contractor</label>
                  <input 
                    type="text" 
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                    value={formData.subCon}
                    onChange={(e) => setFormData({...formData, subCon: e.target.value})}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Vendor / Supplier</label>
                  <input 
                    type="text" 
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                    value={formData.vendor}
                    onChange={(e) => setFormData({...formData, vendor: e.target.value})}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Tanggal Serah Terima</label>
                  <input 
                    type="date" 
                    required
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
              </div>

              <div style={{ margin: '20px 0' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Upload Dokumen Penunjukan</label>
                <label style={{ display: 'block', border: '2px dashed #ddd', padding: '20px', textAlign: 'center', borderRadius: '4px', cursor: 'pointer' }}>
                  <input 
                    type="file" 
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" 
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setFormData({...formData, document: e.target.files[0]});
                      }
                    }}
                  />
                  <Upload size={24} color="#999" />
                  {formData.document ? (
                    <p style={{ fontSize: '14px', color: '#333', marginTop: '10px' }}>
                      File terpilih: <strong>{formData.document.name}</strong>
                    </p>
                  ) : (
                    <p style={{ fontSize: '12px', color: '#999', marginTop: '10px' }}>Klik untuk pilih file PDF, Word, atau JPG</p>
                  )}
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Batal</button>
                <button type="submit" className="btn btn-primary">Simpan Penunjukan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Input LPJ Modal */}
      {showLPJModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2>Form Pertanggungjawaban (LPJ)</h2>
              <button onClick={() => setShowLPJModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            <form onSubmit={handleLPJSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Pilih Referensi Serah Terima</label>
                  <select 
                    required
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                    value={lpjFormData.appointmentId}
                    onChange={(e) => setLpjFormData({...lpjFormData, appointmentId: e.target.value})}
                  >
                    <option value="">-- Pilih ST --</option>
                    {appointments.map(a => (
                      <option key={a.id} value={a.id}>{a.code} - {projects.find(p => p.id === parseInt(a.projectId))?.name}</option>
                    ))}
                  </select>
                </div>

                {lpjFormData.appointmentId && (
                  <>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px' }}>Pemilik Proyek</label>
                      <input 
                        type="text" 
                        readOnly
                        style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#f9f9f9' }}
                        value={projects.find(p => p.id === parseInt(appointments.find(a => a.id === parseInt(lpjFormData.appointmentId))?.projectId))?.owner || ''}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '5px' }}>Tanggal Proyek Diselesaikan</label>
                      <input 
                        type="date" 
                        readOnly
                        style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#f9f9f9' }}
                        value={projects.find(p => p.id === parseInt(appointments.find(a => a.id === parseInt(lpjFormData.appointmentId))?.projectId))?.endDate || ''}
                      />
                    </div>
                  </>
                )}

                <div>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Tanggal Laporan Penutupan</label>
                  <input 
                    type="date" 
                    required
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                    value={lpjFormData.closingReportDate}
                    onChange={(e) => setLpjFormData({...lpjFormData, closingReportDate: e.target.value})}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '25px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowLPJModal(false)}>Batal</button>
                <button type="submit" className="btn btn-primary">Simpan LPJ</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SerahTerima;
