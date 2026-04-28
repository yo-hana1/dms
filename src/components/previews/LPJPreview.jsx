import React from 'react';
import logo from '../../assets/logowkp.jpg';

const LPJPreview = ({ item, appointments, projects }) => {
  if (!item) return null;
  const appointment = appointments?.find(a => a.id === parseInt(item.appointmentId));
  const project = projects?.find(p => p.id === parseInt(appointment?.projectId));

  return (
    <div id="lpj-document" style={{ 
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

      <div style={{ textAlign: 'center', margin: '30px 0' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', textDecoration: 'underline', marginBottom: '10px', textTransform: 'uppercase' }}>LAPORAN PERTANGGUNGJAWABAN (LPJ)</h2>
        <p style={{ fontSize: '14px' }}>Nomor: {item.code}</p>
      </div>

      <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
        <p style={{ marginBottom: '15px', textAlign: 'justify' }}>
          Yang bertanda tangan di bawah ini menerangkan bahwa proyek <strong>{project?.name || '-'}</strong> telah selesai dilaksanakan sesuai dengan ketentuan, spesifikasi teknis, dan kesepakatan yang tertuang dalam dokumen kontrak.
        </p>
        
        <div style={{ marginBottom: '25px', backgroundColor: '#fcfcfc', padding: '15px', border: '1px solid #eee' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 'bold', borderBottom: '1px solid #ddd', pb: '5px', mb: '10px' }}>Pelaksana Proyek:</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '150px 10px 1fr', gap: '5px' }}>
            <strong>Main Contractor</strong><span>:</span><span>{appointment?.mainCon || '-'}</span>
            <strong>Sub Contractor</strong><span>:</span><span>{appointment?.subCon || '-'}</span>
          </div>
        </div>

        <p style={{ marginBottom: '20px' }}>
          Laporan pertanggungjawaban ini kami serahkan kepada <strong>Pemilik Proyek ({item.owner || '-'})</strong> sebagai bukti formal penyelesaian seluruh tahapan pekerjaan proyek.
        </p>

        <div style={{ marginTop: '30px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 'bold', mb: '10px', textDecoration: 'underline' }}>Detail Dokumen:</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ border: '1px solid #eee', padding: '10px' }}>
              <p style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '8px', color: 'var(--primary)' }}>Informasi Umum</p>
              <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '5px', fontSize: '12px' }}>
                <span>Lokasi</span><span>: {project?.location || '-'}</span>
                <span>Tipe</span><span>: {project?.type || '-'}</span>
                <span>Mulai</span><span>: {project?.startDate || '-'}</span>
                <span>Selesai</span><span>: {project?.endDate || '-'}</span>
              </div>
            </div>
            <div style={{ border: '1px solid #eee', padding: '10px' }}>
              <p style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '8px', color: 'var(--primary)' }}>Informasi Khusus</p>
              <div style={{ fontSize: '12px' }}>
                <p><strong>Status Terakhir:</strong> Selesai (Final Handover)</p>
                <p><strong>Keterangan:</strong> {project?.details || 'Seluruh pekerjaan telah melalui inspeksi akhir.'}</p>
                <p><strong>Ref Serah Terima:</strong> {appointment?.code || '-'}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div style={{ marginTop: '60px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          <div style={{ textAlign: 'center' }}>
            <p>Main Contractor,</p>
            <div style={{ height: '70px' }}></div>
            <p><strong>( {appointment?.mainCon || '....................'} )</strong></p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p>Sub Contractor,</p>
            <div style={{ height: '70px' }}></div>
            <p><strong>( {appointment?.subCon || '....................'} )</strong></p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p>Pemilik Proyek,</p>
            <div style={{ height: '70px' }}></div>
            <p><strong>( {item.owner || '....................'} )</strong></p>
          </div>
        </div>

        <div style={{ marginTop: '40px', textAlign: 'right', fontSize: '12px', fontStyle: 'italic' }}>
          <p>Jakarta, {item.closingReportDate}</p>
          <p>Dicetak otomatis oleh DMS PT. WKP</p>
        </div>
      </div>
    </div>
  );
};

export default LPJPreview;
