import React, { useState } from 'react';
import { Filter, FileDown, Table } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';

const Laporan = () => {
  const { projects, purchaseOrders, invoices, payments } = useAppData();
  const [filterType, setFilterType] = useState('Proyek');

  return (
    <div>
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <label style={{ fontSize: '14px', fontWeight: '500' }}>Jenis Laporan:</label>
          <select 
            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="Proyek">Laporan Proyek</option>
            <option value="PO">Laporan Purchase Order</option>
            <option value="Invoice">Laporan Invoice</option>
            <option value="Pembayaran">Laporan Pembayaran</option>
          </select>
          <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
            <input type="date" style={{ padding: '6px', border: '1px solid #ddd' }} />
            <span>s/d</span>
            <input type="date" style={{ padding: '6px', border: '1px solid #ddd' }} />
          </div>
          <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Filter size={14} /> Filter
          </button>
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '5px', borderColor: '#28a745', color: '#28a745' }}>
            <FileDown size={14} /> Excel
          </button>
          <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '5px', borderColor: '#dc3545', color: '#dc3545' }}>
             <FileDown size={14} /> PDF
          </button>
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontSize: '1.1rem', marginBottom: '15px' }}>Data {filterType}</h3>
        <div className="table-container">
          {filterType === 'Proyek' && (
            <table>
              <thead>
                <tr>
                  <th>No. Proyek</th>
                  <th>Nama Proyek</th>
                  <th>Lokasi</th>
                  <th>Tgl Mulai</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {projects.map(p => (
                  <tr key={p.id}>
                    <td>{p.code}</td>
                    <td>{p.name}</td>
                    <td>{p.location}</td>
                    <td>{p.startDate}</td>
                    <td>{p.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {filterType === 'PO' && (
            <table>
              <thead>
                <tr>
                  <th>No. PO</th>
                  <th>Vendor</th>
                  <th>Total</th>
                  <th>Tgl</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {purchaseOrders.map(po => (
                  <tr key={po.id}>
                    <td>{po.code}</td>
                    <td>{po.vendor}</td>
                    <td>Rp {po.total.toLocaleString()}</td>
                    <td>{po.date}</td>
                    <td>{po.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {filterType === 'Invoice' && (
            <table>
              <thead>
                <tr>
                  <th>No. Invoice</th>
                  <th>Vendor</th>
                  <th>Nominal</th>
                  <th>Tgl</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map(inv => (
                  <tr key={inv.id}>
                    <td>{inv.code}</td>
                    <td>{inv.vendor}</td>
                    <td>Rp {inv.amount.toLocaleString()}</td>
                    <td>{inv.date}</td>
                    <td>{inv.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {filterType === 'Pembayaran' && (
            <table>
              <thead>
                <tr>
                  <th>No. KWT</th>
                  <th>Vendor</th>
                  <th>Nominal</th>
                  <th>Tgl Bayar</th>
                  <th>Metode</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p.id}>
                    <td>{p.code}</td>
                    <td>{p.vendor}</td>
                    <td>Rp {p.amount.toLocaleString()}</td>
                    <td>{p.date}</td>
                    <td>{p.method}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Laporan;
