import React from 'react';

const POPreview = ({ item, projects }) => {
  if (!item) return null;
  const project = projects?.find(p => p.id === parseInt(item.projectId));

  return (
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
        <img src="/logo.jpg" alt="PT. WKP Logo" style={{ width: '80px', height: 'auto', marginRight: '20px' }} />
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
        <p style={{ fontSize: '14px', marginTop: '5px' }}>Ref: {project?.code || '-'}</p>
      </div>

      {/* Header Info Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', border: '1px solid #333' }}>
        <tbody>
          <tr>
            <td style={{ padding: '8px', border: '1px solid #333', width: '20%', fontWeight: 'bold' }}>Nomor PO</td>
            <td style={{ padding: '8px', border: '1px solid #333', width: '30%' }}>{item.code}</td>
            <td style={{ padding: '8px', border: '1px solid #333', width: '20%', fontWeight: 'bold' }}>Vendor</td>
            <td style={{ padding: '8px', border: '1px solid #333', width: '30%' }}>{item.vendor}</td>
          </tr>
          <tr>
            <td style={{ padding: '8px', border: '1px solid #333', fontWeight: 'bold' }}>Tanggal</td>
            <td style={{ padding: '8px', border: '1px solid #333' }}>{item.date}</td>
            <td style={{ padding: '8px', border: '1px solid #333', fontWeight: 'bold' }}>Proyek</td>
            <td style={{ padding: '8px', border: '1px solid #333' }}>{project?.name || item.projectName || '-'}</td>
          </tr>
        </tbody>
      </table>

      {/* Items Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px', border: '1px solid #333' }}>
        <thead style={{ backgroundColor: '#f2f2f2' }}>
          <tr>
            <th style={{ padding: '10px', border: '1px solid #333', width: '50%' }}>Item Description</th>
            <th style={{ padding: '10px', border: '1px solid #333', width: '10%' }}>Qty</th>
            <th style={{ padding: '10px', border: '1px solid #333', width: '20%' }}>Unit Price</th>
            <th style={{ padding: '10px', border: '1px solid #333', width: '20%' }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {item.items?.map((item, idx) => (
            <tr key={idx}>
              <td style={{ padding: '10px', border: '1px solid #333' }}>{item.name}</td>
              <td style={{ padding: '10px', border: '1px solid #333', textAlign: 'center' }}>{item.qty}</td>
              <td style={{ padding: '10px', border: '1px solid #333', textAlign: 'right' }}>Rp {item.price.toLocaleString()}</td>
              <td style={{ padding: '10px', border: '1px solid #333', textAlign: 'right' }}>Rp {(item.qty * item.price).toLocaleString()}</td>
            </tr>
          ))}
          {/* Fill empty rows to maintain size */}
          {[...Array(Math.max(0, 5 - (item.items?.length || 0)))].map((_, idx) => (
            <tr key={`empty-${idx}`}>
              <td style={{ padding: '10px', border: '1px solid #333', color: 'transparent' }}>-</td>
              <td style={{ padding: '10px', border: '1px solid #333' }}></td>
              <td style={{ padding: '10px', border: '1px solid #333' }}></td>
              <td style={{ padding: '10px', border: '1px solid #333' }}></td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="3" style={{ padding: '10px', border: '1px solid #333', textAlign: 'right', fontWeight: 'bold' }}>TOTAL</td>
            <td style={{ padding: '10px', border: '1px solid #333', textAlign: 'right', fontWeight: 'bold', backgroundColor: '#f2f2f2' }}>
              Rp {item.total?.toLocaleString()}
            </td>
          </tr>
        </tfoot>
      </table>

      <div style={{ marginTop: '50px', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ textAlign: 'center' }}>
          <p>Disetujui Oleh,</p>
          <div style={{ height: '80px' }}></div>
          <p style={{ textDecoration: 'underline' }}><strong>( Direktur Utama )</strong></p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p>Jakarta, {item.date}</p>
          <p>Vendor,</p>
          <div style={{ height: '80px' }}></div>
          <p style={{ textDecoration: 'underline' }}><strong>( {item.vendor} )</strong></p>
        </div>
      </div>
    </div>
  );
};

export default POPreview;
