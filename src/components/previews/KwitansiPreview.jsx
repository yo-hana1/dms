import React from 'react';
import logo from '../../assets/logowkp.jpg';

const terbilang = (angka) => {
  const bilne = ["", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh", "Sebelas"];
  if (angka < 12) return bilne[angka];
  else if (angka < 20) return terbilang(angka - 10) + " Belas";
  else if (angka < 100) return terbilang(Math.floor(angka / 10)) + " Puluh " + terbilang(angka % 10);
  else if (angka < 200) return "Seratus " + terbilang(angka - 100);
  else if (angka < 1000) return terbilang(Math.floor(angka / 100)) + " Ratus " + terbilang(angka % 100);
  else if (angka < 2000) return "Seribu " + terbilang(angka - 1000);
  else if (angka < 1000000) return terbilang(Math.floor(angka / 1000)) + " Ribu " + terbilang(angka % 1000);
  else if (angka < 1000000000) return terbilang(Math.floor(angka / 1000000)) + " Juta " + terbilang(angka % 1000000);
  else if (angka < 1000000000000) return terbilang(Math.floor(angka / 1000000000)) + " Milyar " + terbilang(angka % 1000000000);
  else if (angka < 1000000000000000) return terbilang(Math.floor(angka / 1000000000000)) + " Triliun " + terbilang(angka % 1000000000000);
  return "";
}

const KwitansiPreview = ({ item, invoices }) => {
  if (!item) return null;

  if (item.status === 'Pending') {
    return (
      <div style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
        <h3 style={{ color: '#856404', marginBottom: '10px' }}>Menunggu Persetujuan</h3>
        <p style={{ color: '#666' }}>Pembayaran ini belum disetujui oleh pihak keuangan.</p>
      </div>
    );
  }

  if (item.status === 'Rejected') {
    return (
      <div style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>❌</div>
        <h3 style={{ color: '#721c24', marginBottom: '10px' }}>Pembayaran Ditolak</h3>
        <p style={{ color: '#666' }}>Pembayaran tidak dapat diproses.</p>
      </div>
    );
  }

  /* APPROVED - KWITANSI FORMAT */
  const inv = invoices?.find(i => i.id === parseInt(item.invoiceId));
  const totalInclTax = (inv?.amount || item.amount || 0) * 1.11;
  
  return (
    <div id="kwitansi-document" style={{ 
      backgroundColor: 'white', 
      padding: '40px', 
      boxShadow: '0 0 15px rgba(0,0,0,0.1)',
      width: '100%',
      margin: '0 auto',
      color: '#000',
      fontFamily: 'serif',
      border: '2px solid #000'
    }}>
      {/* Letterhead (Kop) */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', borderBottom: '4px double #000', paddingBottom: '10px' }}>
        <img src={logo} alt="PT. WKP Logo" style={{ width: '60px', height: 'auto', marginRight: '15px' }} />
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0' }}>PT. WIJAYA KUSUMA PERDANA</h1>
          <p style={{ margin: '2px 0 0 0', fontSize: '10px', color: '#333', fontFamily: 'sans-serif' }}>
            Jl. Jendral Sudirman No. 123, Jakarta | Telp: (021) 555-0123
          </p>
        </div>
      </div>

      <div style={{ textAlign: 'center', position: 'relative', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', textDecoration: 'underline', letterSpacing: '2px' }}>KWITANSI</h2>
        <div style={{ position: 'absolute', top: '30px', right: '0', fontSize: '14px', fontWeight: 'bold' }}>
          No. {item.code?.split('/')?.[2] || '000'}
        </div>
      </div>

      <div style={{ border: '1px solid #000', padding: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '200px 10px 1fr', gap: '15px', marginBottom: '15px', alignItems: 'center' }}>
          <div style={{ fontStyle: 'italic', color: '#555' }}>Sudah diterima dari</div>
          <div>:</div>
          <div style={{ borderBottom: '1px dotted #000', fontWeight: 'bold', fontSize: '1.1rem', whiteSpace: 'nowrap' }}>PT. WIJAYA KUSUMA PERDANA</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '200px 10px 1fr', gap: '15px', marginBottom: '15px', alignItems: 'center' }}>
          <div style={{ fontStyle: 'italic', color: '#555' }}>Uang Sebesar</div>
          <div>:</div>
          <div style={{ backgroundColor: '#f9f9f9', padding: '8px 15px', border: '1px solid #aaa', fontStyle: 'italic', fontWeight: 'bold', minHeight: '35px', fontSize: '1.1rem' }}>
            {terbilang(Math.floor(totalInclTax))} Rupiah
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '200px 10px 1fr', gap: '15px', marginBottom: '15px', alignItems: 'center' }}>
          <div style={{ fontStyle: 'italic', color: '#555' }}>Untuk Pembayaran</div>
          <div>:</div>
          <div style={{ borderBottom: '1px dotted #000', fontWeight: 'bold' }}>
            Invoice {inv?.code || item.invoiceCode || '-'} ( {item.vendor} )
          </div>
        </div>

        <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ border: '4px double #000', padding: '10px 25px', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontSize: '20px', fontWeight: 'bold' }}>TERBILANG Rp.</span>
            <span style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '1px' }}>{totalInclTax.toLocaleString()} ,-</span>
          </div>
          
          <div style={{ textAlign: 'center', minWidth: '200px' }}>
            <p style={{ margin: '0 0 70px 0' }}>Jakarta, {item.date}</p>
            <p style={{ borderTop: '1px solid #000', fontWeight: 'bold', paddingTop: '5px' }}>( {item.vendor} )</p>
          </div>
        </div>
      </div>
      
      <div style={{ marginTop: '10px', fontSize: '10px', fontStyle: 'italic', color: '#777' }}>
        * Dokumen ini sah dan diterbitkan secara elektronik oleh sistem PT. Wijaya Kusuma Perdana
      </div>
    </div>
  );
};

export default KwitansiPreview;
