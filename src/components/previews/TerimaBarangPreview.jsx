import React from 'react';

const TerimaBarangPreview = ({ item, purchaseOrders }) => {
  if (!item) return null;
  const po = purchaseOrders?.find(p => p.id === parseInt(item.poId));

  return (
    <div id="tb-document" style={{ 
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
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', textDecoration: 'underline' }}>SURAT TERIMA BARANG</h2>
        <div style={{ fontSize: '14px', marginTop: '5px' }}>Nomor: {item.code}</div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <table style={{ width: '100%', fontSize: '14px', lineHeight: '1.6' }}>
          <tbody>
            <tr>
              <td style={{ width: '200px', fontWeight: 'bold' }}>Tanggal Diterima</td>
              <td style={{ width: '10px' }}>:</td>
              <td>{item.date ? new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold' }}>Vendor</td>
              <td>:</td>
              <td>{item.vendor}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold' }}>Nomor PO Referensi</td>
              <td>:</td>
              <td>{po?.code || item.poCode || '-'}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold' }}>Proyek</td>
              <td>:</td>
              <td>{item.projectName || po?.projectName || '-'}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold' }}>PIC (Manajer Gudang)</td>
              <td>:</td>
              <td>{item.pic || '-'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p style={{ marginTop: '20px', marginBottom: '15px' }}>Dengan ini menyatakan bahwa barang/pekerjaan dari Purchase Order tersebut di atas telah diterima dengan baik sesuai dengan spesifikasi dan jumlah yang diminta.</p>

      {/* Items Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f9f9f9' }}>
            <th style={{ border: '1px solid #333', padding: '8px', textAlign: 'center', width: '40px' }}>No.</th>
            <th style={{ border: '1px solid #333', padding: '8px', textAlign: 'left' }}>Deskripsi Barang/Pekerjaan</th>
            <th style={{ border: '1px solid #333', padding: '8px', textAlign: 'center', width: '80px' }}>Qty Dipesan</th>
            <th style={{ border: '1px solid #333', padding: '8px', textAlign: 'center', width: '80px' }}>Qty Diterima</th>
            <th style={{ border: '1px solid #333', padding: '8px', textAlign: 'center', width: '60px' }}>Satuan</th>
          </tr>
        </thead>
        <tbody>
          {po?.items?.map((p_item, idx) => (
            <tr key={idx}>
              <td style={{ border: '1px solid #333', padding: '8px', textAlign: 'center' }}>{idx + 1}</td>
              <td style={{ border: '1px solid #333', padding: '8px' }}>{p_item.name}</td>
              <td style={{ border: '1px solid #333', padding: '8px', textAlign: 'center' }}>{p_item.qty}</td>
              <td style={{ border: '1px solid #333', padding: '8px', textAlign: 'center' }}>{p_item.qty}</td>
              <td style={{ border: '1px solid #333', padding: '8px', textAlign: 'center' }}>Pcs</td>
            </tr>
          ))}
          {(!po?.items || po.items.length === 0) && (
            <tr>
              <td colSpan="5" style={{ border: '1px solid #333', padding: '15px', textAlign: 'center', fontStyle: 'italic', color: '#777' }}>
                Rincian barang terlampir pada dokumen vendor.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div style={{ marginTop: '60px', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ textAlign: 'center', width: '40%' }}>
          <p>Diserahkan Oleh,</p>
          <p style={{ marginBottom: '60px' }}></p>
          <p><strong>( Perwakilan Vendor )</strong></p>
          <p style={{ marginTop: '5px' }}>{item.vendor}</p>
        </div>
        <div style={{ textAlign: 'center', width: '40%' }}>
          <p>Diterima Oleh,</p>
          <p style={{ marginBottom: '60px' }}></p>
          <p><strong>( {item.pic || 'Manajer Gudang'} )</strong></p>
          <p style={{ marginTop: '5px' }}>PT. Wijaya Kusuma Perdana</p>
        </div>
      </div>
    </div>
  );
};

export default TerimaBarangPreview;
