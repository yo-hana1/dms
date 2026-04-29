import React from 'react';

const logo = '/logowkp.jpg';

const STPreview = ({ item, projects }) => {
  if (!item) return null;
  const project = projects?.find(p => p.id === parseInt(item.projectId));

  return (
    <div id="st-document" style={{ 
      backgroundColor: 'white', 
      padding: '60px', 
      boxShadow: '0 0 20px rgba(0,0,0,0.1)',
      minHeight: '800px',
      width: '100%',
      margin: '0 auto',
      color: '#333',
      fontFamily: 'serif'
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

      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', textDecoration: 'underline', marginBottom: '10px', textTransform: 'uppercase' }}>SURAT PENUNJUKAN & SERAH TERIMA</h2>
        <p style={{ fontSize: '14px' }}>Nomor: {item.code}</p>
      </div>

      <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
        <p style={{ marginBottom: '15px' }}>Yang bertanda tangan di bawah ini menerangkan bahwa:</p>
        
        <div style={{ marginLeft: '20px', marginBottom: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '150px 10px 1fr', gap: '5px' }}>
            <strong>Nama Proyek</strong><span>:</span><strong>{project?.name || item.projectName || '-'}</strong>
            <strong>Main Contractor</strong><span>:</span><span>{item.mainCon}</span>
            <strong>Sub Contractor</strong><span>:</span><span>{item.subCon || '-'}</span>
            <strong>Vendor Utama</strong><span>:</span><span>{item.vendor || '-'}</span>
            <strong>Tanggal</strong><span>:</span><span>{item.date}</span>
          </div>
        </div>
        
        <p>Telah resmi ditunjuk untuk melaksanakan pekerjaan sesuai dengan kesepakatan yang tertuang dalam dokumen teknis dan komersial.</p>
        
        <div style={{ marginTop: '50px', display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ textAlign: 'center' }}>
            <p>Diterima Oleh,</p>
            <div style={{ height: '80px' }}></div>
            <p><strong>( {item.mainCon} )</strong></p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p>Hormat Kami,</p>
            <div style={{ height: '80px' }}></div>
            <p><strong>( {project?.pic ? project.pic.split(' (')[0] : 'Direktur PT. WKP'} )</strong></p>
            <p style={{ fontSize: '12px', marginTop: '-15px' }}>{project?.pic ? project.pic.split(' (')[1]?.replace(')', '') : ''}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default STPreview;
