import React from 'react';

const ProjectPreview = ({ item }) => {
  if (!item) return null;

  return (
    <div id="project-document" style={{ 
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
        <img src="/logo.jpg" alt="PT. WKP Logo" style={{ width: '80px', height: 'auto', marginRight: '20px' }} />
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0', letterSpacing: '1px' }}>PT. WIJAYA KUSUMA PERDANA</h1>
          <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#555' }}>
            General Contractor & Construction Management<br />
            Jl. Jendral Sudirman No. 123, Jakarta, Indonesia<br />
            Telp: (021) 555-0123 | Email: info@wkp-construction.id
          </p>
        </div>
      </div>

      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', textDecoration: 'underline', marginBottom: '10px' }}>DOKUMEN DATA PROYEK</h2>
        <p style={{ fontSize: '14px' }}>Ref: {item.code}</p>
      </div>

      <div style={{ fontSize: '15px', lineHeight: '1.8' }}>
        <p style={{ marginBottom: '25px' }}>Berikut adalah rincian data proyek yang telah terdaftar dalam sistem manajemen PT. Wijaya Kusuma Perdana:</p>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '40px' }}>
          <tbody>
            <tr>
              <td style={{ width: '220px', padding: '8px 0', fontWeight: 'bold', verticalAlign: 'top' }}>Nama Proyek</td>
              <td style={{ width: '20px', padding: '8px 0', textAlign: 'center', verticalAlign: 'top' }}>:</td>
              <td style={{ padding: '8px 0', fontWeight: 'bold', fontSize: '16px' }}>{item.name}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', fontWeight: '600', verticalAlign: 'top' }}>Pemilik / Pengusul Proyek</td>
              <td style={{ padding: '8px 0', textAlign: 'center', verticalAlign: 'top' }}>:</td>
              <td style={{ padding: '8px 0' }}>{item.owner}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', fontWeight: '600', verticalAlign: 'top' }}>Jenis Pembangunan</td>
              <td style={{ padding: '8px 0', textAlign: 'center', verticalAlign: 'top' }}>:</td>
              <td style={{ padding: '8px 0' }}>{item.type}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', fontWeight: '600', verticalAlign: 'top' }}>Lokasi Proyek</td>
              <td style={{ padding: '8px 0', textAlign: 'center', verticalAlign: 'top' }}>:</td>
              <td style={{ padding: '8px 0' }}>{item.location}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', fontWeight: '600', verticalAlign: 'top' }}>Tanggal Mulai</td>
              <td style={{ padding: '8px 0', textAlign: 'center', verticalAlign: 'top' }}>:</td>
              <td style={{ padding: '8px 0' }}>{item.startDate ? new Date(item.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', fontWeight: '600', verticalAlign: 'top' }}>Tanggal Selesai</td>
              <td style={{ padding: '8px 0', textAlign: 'center', verticalAlign: 'top' }}>:</td>
              <td style={{ padding: '8px 0' }}>{item.endDate ? new Date(item.endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', fontWeight: '600', verticalAlign: 'top' }}>Detail Kebutuhan</td>
              <td style={{ padding: '8px 0', textAlign: 'center', verticalAlign: 'top' }}>:</td>
              <td style={{ padding: '8px 0', textAlign: 'justify' }}>{item.details || 'Tidak ada detail tambahan.'}</td>
            </tr>
          </tbody>
        </table>

        <p style={{ marginBottom: '50px' }}>Demikian data proyek ini disampaikan untuk dapat dipergunakan sebagaimana mestinya.</p>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ textAlign: 'center', minWidth: '250px' }}>
            <p style={{ marginBottom: '80px' }}>Jakarta, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}<br /><strong>Hormat Kami,</strong></p>
            <p style={{ margin: '0', fontWeight: 'bold', textDecoration: 'underline' }}>{item.pic ? item.pic.split(' (')[0] : 'Direktur PT. WKP'}</p>
            <p style={{ margin: '0', fontSize: '13px' }}>{item.pic ? item.pic.split(' (')[1]?.replace(')', '') : 'PT. Wijaya Kusuma Perdana'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPreview;
