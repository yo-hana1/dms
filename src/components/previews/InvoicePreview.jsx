import React from 'react';
import { formatTerbilang } from '../../utils/terbilang';

const InvoicePreview = ({ item, purchaseOrders }) => {
  if (!item) return null;
  const po = purchaseOrders?.find(p => p.id === parseInt(item.poId));

  return (
    <div id="invoice-document" style={{ 
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
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', textDecoration: 'underline' }}>INVOICE</h2>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px', textAlign: 'right' }}>
        <div style={{ fontSize: '13px', lineHeight: '1.6' }}>
          <div><strong>Tanggal:</strong> {item.date ? new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}</div>
          <div><strong>No. Invoice:</strong> {item.code}</div>
          <div><strong>PO Reff:</strong> {po?.code || item.poCode || '-'}</div>
        </div>
      </div>

      {/* Bill To / Ship To Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '25px' }}>
        <thead>
          <tr>
            <th style={{ width: '50%', textAlign: 'left', padding: '8px', border: '1px solid #333', backgroundColor: '#f9f9f9', fontSize: '12px' }}>BILL TO</th>
            <th style={{ width: '50%', textAlign: 'left', padding: '8px', border: '1px solid #333', backgroundColor: '#f9f9f9', fontSize: '12px' }}>SHIP TO</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: '1px solid #333', padding: '12px', verticalAlign: 'top' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>PT. Wijaya Kusuma Perdana</div>
              <div style={{ fontSize: '12px', lineHeight: '1.4' }}>
                Jl. Jendral Sudirman No. 123,<br />
                Jakarta, Indonesia
              </div>
            </td>
            <td style={{ border: '1px solid #333', padding: '12px', verticalAlign: 'top' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>PT. Wijaya Kusuma Perdana</div>
              <div style={{ fontSize: '12px', lineHeight: '1.4' }}>
                Proyek: {item.projectName || po?.projectName || 'Lokasi Proyek'}<br />
                Jakarta, Indonesia
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Items Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f9f9f9' }}>
            <th style={{ border: '1px solid #333', padding: '8px', textAlign: 'center', width: '40px' }}>No.</th>
            <th style={{ border: '1px solid #333', padding: '8px', textAlign: 'left' }}>Deskripsi</th>
            <th style={{ border: '1px solid #333', padding: '8px', textAlign: 'center', width: '60px' }}>Qty</th>
            <th style={{ border: '1px solid #333', padding: '8px', textAlign: 'center', width: '60px' }}>Unit</th>
            <th style={{ border: '1px solid #333', padding: '8px', textAlign: 'right', width: '130px' }}>Harga Nett per Unit (IDR)</th>
            <th style={{ border: '1px solid #333', padding: '8px', textAlign: 'right', width: '140px' }}>Total (IDR)</th>
          </tr>
        </thead>
        <tbody>
          {po?.items?.map((p_item, idx) => (
            <tr key={idx}>
              <td style={{ border: '1px solid #333', padding: '8px', textAlign: 'center' }}>{idx + 1}</td>
              <td style={{ border: '1px solid #333', padding: '8px' }}>{p_item.name}</td>
              <td style={{ border: '1px solid #333', padding: '8px', textAlign: 'center' }}>{p_item.qty}</td>
              <td style={{ border: '1px solid #333', padding: '8px', textAlign: 'center' }}>Pcs</td>
              <td style={{ border: '1px solid #333', padding: '8px', textAlign: 'right' }}>{p_item.price.toLocaleString()}</td>
              <td style={{ border: '1px solid #333', padding: '8px', textAlign: 'right' }}>{(p_item.qty * p_item.price).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="4" rowSpan="3" style={{ border: '1px solid #333', padding: '10px', verticalAlign: 'top' }}>
              <div style={{ fontWeight: 'bold', fontSize: '11px', marginBottom: '5px' }}>TERBILANG / AMOUNT IN WORDS:</div>
              <div style={{ fontStyle: 'italic', color: '#555', textTransform: 'capitalize' }}>
                {formatTerbilang(item.amount * 1.11)}
              </div>
            </td>
            <td style={{ border: '1px solid #333', padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>Sub-Total</td>
            <td style={{ border: '1px solid #333', padding: '8px', textAlign: 'right' }}>{item.amount?.toLocaleString()}</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #333', padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>PPN 11%</td>
            <td style={{ border: '1px solid #333', padding: '8px', textAlign: 'right' }}>{(item.amount * 0.11).toLocaleString()}</td>
          </tr>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <td style={{ border: '1px solid #333', padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>TOTAL</td>
            <td style={{ border: '1px solid #333', padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>{(item.amount * 1.11).toLocaleString()}</td>
          </tr>
        </tfoot>
      </table>

      <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: '60%' }}>
          <div style={{ fontWeight: 'bold', textDecoration: 'underline', marginBottom: '5px' }}>Note:</div>
          <div style={{ fontSize: '11px', color: '#666' }}>
            - Please make payment of this invoice within 14 days.<br />
            - Payment by transfer can be aimed to: <br />
            &nbsp;&nbsp;<strong>Bank Mandiri (Acc: 123-456-7890) a/n PT. Wijaya Kusuma Perdana</strong>
          </div>
        </div>
        <div style={{ textAlign: 'center', width: '30%' }}>
          <p>Jakarta, {new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          <p style={{ marginBottom: '60px' }}>Hormat Kami,</p>
          <p><strong>( {item.vendor} )</strong></p>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;
