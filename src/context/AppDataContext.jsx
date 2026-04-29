import React, { createContext, useContext, useState, useEffect } from 'react';
import { format } from 'date-fns';

const AppDataContext = createContext();

export const useAppData = () => useContext(AppDataContext);

export const AppDataProvider = ({ children }) => {
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('dms_projects');
    const data = saved ? JSON.parse(saved) : [
      { id: 1, code: 'PR/001/Gedung Pusat/2026', name: 'Gedung Pusat', type: 'Gedung', location: 'Jakarta', startDate: '2026-01-10', endDate: '2026-12-31', status: 'Active', details: 'Pembangunan gedung 10 lantai', owner: 'System Administrator', createdAt: '2026-01-10T09:00:00Z', accessMode: 'Full Access', fileType: 'PDF', fileSize: '1.2 MB' },
      { id: 2, code: 'PR/002/Jembatan Kali/2026', name: 'Jembatan Kali', type: 'Jembatan', location: 'Semarang', startDate: '2026-02-15', endDate: '2026-08-15', status: 'Active', details: 'Renovasi jembatan utama', owner: 'System Administrator', createdAt: '2026-02-15T10:30:00Z', accessMode: 'Full Access', fileType: 'PDF', fileSize: '850 KB' },
    ];

    // Migrate old types on init and Rename specific projects
    const typeMap = { 'Perkantoran': 'Gedung', 'Infrastruktur': 'Jembatan' };
    return data.map(p => {
      let updated = { ...p };
      
      // Rename 'Future Proyek 2027' -> 'Apartment Tidar'
      if (p.name.toLowerCase() === 'future proyek 2027') {
        updated.name = 'Apartment Tidar';
        updated.code = updated.code.replace(/future proyek 2027/i, 'Apartment Tidar');
      }
      // Rename 'Past Proyek 2025' -> 'Perumahan Dewata'
      if (p.name.toLowerCase() === 'past proyek 2025') {
        updated.name = 'Perumahan Dewata';
        updated.code = updated.code.replace(/past proyek 2025/i, 'Perumahan Dewata');
      }

      updated.type = typeMap[updated.type] || (['Gedung', 'Rumah', 'Jembatan', 'Renovasi', 'Jalan', 'Lainnya'].includes(updated.type) ? updated.type : 'Lainnya');
      return updated;
    });
  });

  const [appointments, setAppointments] = useState(() => {
    const saved = localStorage.getItem('dms_appointments');
    let data = saved ? JSON.parse(saved) : [
      { id: 1, code: 'ST/PT. WKP/2026/01/001', projectId: 1, mainCon: 'PT. Bangun Jaya', subCon: 'CV. Mandiri Teknik', vendor: 'Mandiri Steel', date: '2026-01-15', owner: 'System Administrator', createdAt: '2026-01-15T14:45:00Z', accessMode: 'Read / Write', fileType: 'DOCX', fileSize: '450 KB' },
      { id: 2, code: 'ST/PT. WKP/2026/02/002', projectId: 2, mainCon: 'PT. Infrastruktur Utama', subCon: 'CV. Karya Mandiri', vendor: 'Semen Nusantara', date: '2026-02-22', owner: 'System Administrator', createdAt: '2026-02-22T11:20:00Z', accessMode: 'Read / Write', fileType: 'DOCX', fileSize: '420 KB' }
    ];

    // Migration and Cleanup
    // 1. Remove 'Apartment Tidar' records (since it's a test data the user wants gone)
    // 2. Fix 'Jembatan Kali' date
    return data.filter(a => {
      const p = projects.find(proj => proj.id === a.projectId);
      return p && p.name !== 'Apartment Tidar';
    }).map(a => {
      const p = projects.find(proj => proj.id === a.projectId);
      if (p && p.name === 'Jembatan Kali') {
        return { ...a, date: '2026-02-22', code: a.code.replace(/Jembatan Kali/i, 'Jembatan Kali') };
      }
      return a;
    });
  });

  const [purchaseOrders, setPurchaseOrders] = useState(() => {
    const saved = localStorage.getItem('dms_pos');
    let data = saved ? JSON.parse(saved) : [
      { id: 1, code: 'PO/PT. WKP/2026/02/001', projectId: 1, vendor: 'Mandiri Steel', date: '2026-02-01', total: 150000000, status: 'Approved', items: [{ name: 'Semen', qty: 1000, price: 60000 }, { name: 'Besi Beton', qty: 500, price: 180000 }], owner: 'System Administrator', createdAt: '2026-02-01T16:15:00Z', accessMode: 'Full Access', fileType: 'PDF', fileSize: '2.1 MB' },
      { id: 2, code: 'PO/PT. WKP/2026/03/002', projectId: 2, vendor: 'Semen Nusantara', date: '2026-03-05', total: 45000000, status: 'Pending', items: [{ name: 'Pasir', qty: 50, price: 900000 }], owner: 'System Administrator', createdAt: '2026-03-05T09:10:00Z', accessMode: 'Read Only', fileType: 'PDF', fileSize: '1.8 MB' }
    ];

    // Migrate old PO codes to new format
    return data.map((po, index, array) => {
      if (po.code.includes('Wijaya Kusuma Perdana')) {
        const date = new Date(po.date);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        // Recalculate sequence for migration
        const monthYear = `${year}-${month}`;
        const prevInMonth = array.slice(0, index).filter(p => p.date.startsWith(monthYear)).length;
        const seq = String(prevInMonth + 1).padStart(3, '0');
        return { ...po, code: `PO/PT. WKP/${year}/${month}/${seq}` };
      }
      return po;
    });
  });

  const [terimaBarang, setTerimaBarang] = useState(() => {
    const saved = localStorage.getItem('dms_terimabarang');
    return saved ? JSON.parse(saved) : [];
  });

  const [lpjReports, setLpjReports] = useState(() => {
    const saved = localStorage.getItem('dms_lpj');
    return saved ? JSON.parse(saved) : [];
  });

  const [invoices, setInvoices] = useState(() => {
    const saved = localStorage.getItem('dms_invoices');
    let data = saved ? JSON.parse(saved) : [
      { id: 1, code: 'INV/Mandiri Steel/2026/02/101', poId: 1, vendor: 'Mandiri Steel', date: '2026-02-15', amount: 150000000, status: 'Paid', owner: 'System Administrator', createdAt: '2026-02-15T13:00:00Z', accessMode: 'Full Access', fileType: 'PDF', fileSize: '1.5 MB' }
    ];

    // Migrate old invoice codes to new format
    return data.map((inv, index, array) => {
      // Check if it's the old format (e.g., contains vendor name followed by a 4-digit number at the start)
      if (inv.code.startsWith('INV/') && inv.code.split('/').length === 5 && inv.code.split('/')[2].length === 4) {
        const date = new Date(inv.date);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        // Recalculate sequence starting from 101
        const monthYear = `${year}-${month}`;
        const prevInMonth = array.slice(0, index).filter(i => i.date.startsWith(monthYear)).length;
        const seq = 101 + prevInMonth;
        return { ...inv, code: `INV/${inv.vendor}/${year}/${month}/${seq}` };
      }
      return inv;
    });
  });

  const [payments, setPayments] = useState(() => {
    const saved = localStorage.getItem('dms_payments');
    return saved ? JSON.parse(saved) : [
      { id: 1, code: 'KWT/Mandiri Steel/2026/02/001', invoiceId: 1, vendor: 'Mandiri Steel', date: '2026-02-20', amount: 150000000, method: 'Transfer', status: 'Approved', owner: 'System Administrator', createdAt: '2026-02-20T10:00:00Z', accessMode: 'Full Access', fileType: 'PDF', fileSize: '1.1 MB' }
    ];
  });

  const [masterUsers, setMasterUsers] = useState(() => {
    const saved = localStorage.getItem('dms_master_users');
    return saved ? JSON.parse(saved) : [
      // Internal
      { id: 1, type: 'Internal', name: 'Budi Wirawan', position: 'Direktur', company: 'PT. WKP', contact: '-', status: 'Aktif' },
      { id: 2, type: 'Internal', name: 'Anto Suliso', position: 'Manajer', company: 'PT. WKP', contact: '-', status: 'Aktif' },
      { id: 3, type: 'Internal', name: 'Dedi Purnomo', position: 'Konsultan', company: 'PT. WKP', contact: '-', status: 'Aktif' },
      { id: 4, type: 'Internal', name: 'System Administrator', position: 'Admin', company: 'PT. WKP', contact: '-', status: 'Aktif' },
      // Main Contractor
      { id: 5, type: 'Main Contractor', name: '-', position: '-', company: 'PT. Bangun Jaya', contact: '-', status: 'Aktif' },
      { id: 6, type: 'Main Contractor', name: '-', position: '-', company: 'PT Wijaya Kusuma Perdana', contact: '-', status: 'Aktif' },
      { id: 7, type: 'Main Contractor', name: '-', position: '-', company: 'PT. Infrastruktur Utama', contact: '-', status: 'Aktif' },
      // Sub Contractor
      { id: 8, type: 'Sub Contractor', name: '-', position: '-', company: 'CV. Mandiri Teknik', contact: '-', status: 'Aktif' },
      { id: 9, type: 'Sub Contractor', name: '-', position: '-', company: 'CV. Karya Mandiri', contact: '-', status: 'Aktif' },
      // Vendor
      { id: 10, type: 'Vendor', name: '-', position: '-', company: 'Mandiri Steel', contact: '-', status: 'Aktif' },
      { id: 11, type: 'Vendor', name: '-', position: '-', company: 'Semen Nusantara', contact: '-', status: 'Aktif' },
      { id: 12, type: 'Vendor', name: '-', position: '-', company: 'CV. Terang Sejahtera', contact: '-', status: 'Aktif' },
      { id: 13, type: 'Vendor', name: '-', position: '-', company: 'PT. Cerah Merona', contact: '-', status: 'Aktif' },
    ];
  });

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    localStorage.setItem('dms_projects', JSON.stringify(projects));
    localStorage.setItem('dms_appointments', JSON.stringify(appointments));
    localStorage.setItem('dms_pos', JSON.stringify(purchaseOrders));
    localStorage.setItem('dms_invoices', JSON.stringify(invoices));
    localStorage.setItem('dms_payments', JSON.stringify(payments));
    localStorage.setItem('dms_terimabarang', JSON.stringify(terimaBarang));
    localStorage.setItem('dms_lpj', JSON.stringify(lpjReports));
    localStorage.setItem('dms_master_users', JSON.stringify(masterUsers));
  }, [projects, appointments, purchaseOrders, invoices, payments, terimaBarang, lpjReports, masterUsers]);

  // Generators
  const generateProjectCode = (name) => {
    const year = new Date().getFullYear();
    const count = projects.filter(p => new Date(p.startDate).getFullYear() === year).length + 1;
    return `PR/${String(count).padStart(3, '0')}/${name}/${year}`;
  };

  const generatePOCode = (dateStr) => {
    const date = dateStr ? new Date(dateStr) : new Date();
    const month = date.getMonth();
    const monthStr = String(month + 1).padStart(2, '0');
    const year = date.getFullYear();
    const count = purchaseOrders.filter(p => {
      const d = new Date(p.date);
      return d.getMonth() === month && d.getFullYear() === year;
    }).length + 1;
    return `PO/PT. WKP/${year}/${monthStr}/${String(count).padStart(3, '0')}`;
  };

  const generateInvoiceCode = (vendor, dateStr) => {
    const date = dateStr ? new Date(dateStr) : new Date();
    const month = date.getMonth();
    const monthStr = String(month + 1).padStart(2, '0');
    const year = date.getFullYear();
    const count = invoices.filter(i => {
      const d = new Date(i.date);
      return d.getMonth() === month && d.getFullYear() === year;
    }).length + 101;
    return `INV/${vendor}/${year}/${monthStr}/${count}`;
  };

  const generateSTCode = (dateStr) => {
    const date = dateStr ? new Date(dateStr) : new Date();
    const month = date.getMonth();
    const monthStr = String(month + 1).padStart(2, '0');
    const year = date.getFullYear();
    const count = appointments.filter(a => {
      const d = new Date(a.date);
      return d.getMonth() === month && d.getFullYear() === year;
    }).length + 1;
    return `ST/PT. WKP/${year}/${monthStr}/${String(count).padStart(3, '0')}`;
  };

  const generateTBCode = (vendor, dateStr) => {
    const date = dateStr ? new Date(dateStr) : new Date();
    const month = date.getMonth();
    const monthStr = String(month + 1).padStart(2, '0');
    const year = date.getFullYear();
    const count = terimaBarang.filter(tb => {
      const d = new Date(tb.date);
      return d.getMonth() === month && d.getFullYear() === year;
    }).length + 1;
    return `TB/${vendor}/${String(count).padStart(3, '0')}/${monthStr}/${year}`;
  };

  const generateLPJCode = (projectName, dateStr) => {
    const date = dateStr ? new Date(dateStr) : new Date();
    const monthStr = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `LPJ/${projectName}/${monthStr}/${year}`;
  };

  // Actions
  const addProject = (data) => {
    const newProject = { 
      ...data, 
      id: Date.now(), 
      code: generateProjectCode(data.name),
      owner: 'System Administrator',
      createdAt: new Date().toISOString(),
      accessMode: 'Full Access',
      fileType: 'PDF',
      fileSize: (Math.random() * 2 + 0.5).toFixed(1) + ' MB'
    };
    setProjects([...projects, newProject]);
    return newProject;
  };

  const addPO = (data) => {
    const newPO = { 
      ...data, 
      id: Date.now(), 
      code: generatePOCode(data.date), 
      status: 'Pending',
      owner: 'System Administrator',
      createdAt: new Date().toISOString(),
      accessMode: 'Full Access',
      fileType: 'PDF',
      fileSize: (Math.random() * 3 + 1.0).toFixed(1) + ' MB'
    };
    setPurchaseOrders([...purchaseOrders, newPO]);
  };

  const addMasterUser = (data) => {
    const newUser = {
      ...data,
      id: Date.now(),
      status: data.status || 'Aktif',
      createdAt: new Date().toISOString()
    };
    setMasterUsers([...masterUsers, newUser]);
    return newUser;
  };

  const updateMasterUser = (id, data) => {
    setMasterUsers(masterUsers.map(u => u.id === id ? { ...u, ...data } : u));
  };

  const approvePO = (id) => {
    setPurchaseOrders(purchaseOrders.map(po => po.id === id ? { ...po, status: 'Approved' } : po));
  };

  const rejectPO = (id) => {
    setPurchaseOrders(purchaseOrders.map(po => po.id === id ? { ...po, status: 'Rejected' } : po));
  };

  const approvePayment = (id) => {
    const payment = payments.find(p => p.id === id);
    if (payment) {
      setPayments(payments.map(p => p.id === id ? { ...p, status: 'Approved' } : p));
      if (payment.invoiceId) {
        setInvoices(invoices.map(inv => inv.id === parseInt(payment.invoiceId) ? { ...inv, status: 'Paid' } : inv));
      }
    }
  };

  const rejectPayment = (id) => {
    setPayments(payments.map(p => p.id === id ? { ...p, status: 'Rejected' } : p));
  };

  const softDelete = (type, id) => {
    const deletedAt = new Date().toISOString();
    switch (type) {
      case 'Project':
        setProjects(prev => prev.map(p => p.id === id ? { ...p, isDeleted: true, deletedAt } : p));
        break;
      case 'SerahTerima':
        setAppointments(prev => prev.map(a => a.id === id ? { ...a, isDeleted: true, deletedAt } : a));
        break;
      case 'PO':
        setPurchaseOrders(prev => prev.map(p => p.id === id ? { ...p, isDeleted: true, deletedAt } : p));
        break;
      case 'Invoice':
        setInvoices(prev => prev.map(i => i.id === id ? { ...i, isDeleted: true, deletedAt } : i));
        break;
      case 'Pembayaran':
        setPayments(prev => prev.map(p => p.id === id ? { ...p, isDeleted: true, deletedAt } : p));
        break;
      case 'TerimaBarang':
        setTerimaBarang(prev => prev.map(tb => tb.id === id ? { ...tb, isDeleted: true, deletedAt } : tb));
        break;
      case 'LPJ':
        setLpjReports(prev => prev.map(l => l.id === id ? { ...l, isDeleted: true, deletedAt } : l));
        break;
      case 'MasterUser':
        setMasterUsers(prev => prev.map(u => u.id === id ? { ...u, isDeleted: true, deletedAt } : u));
        break;
      default: break;
    }
  };

  const restoreItem = (type, id) => {
    switch (type) {
      case 'Project':
        setProjects(prev => prev.map(p => p.id === id ? { ...p, isDeleted: false, deletedAt: null } : p));
        break;
      case 'SerahTerima':
        setAppointments(prev => prev.map(a => a.id === id ? { ...a, isDeleted: false, deletedAt: null } : a));
        break;
      case 'PO':
        setPurchaseOrders(prev => prev.map(p => p.id === id ? { ...p, isDeleted: false, deletedAt: null } : p));
        break;
      case 'Invoice':
        setInvoices(prev => prev.map(i => i.id === id ? { ...i, isDeleted: false, deletedAt: null } : i));
        break;
      case 'Pembayaran':
        setPayments(prev => prev.map(p => p.id === id ? { ...p, isDeleted: false, deletedAt: null } : p));
        break;
      case 'TerimaBarang':
        setTerimaBarang(prev => prev.map(tb => tb.id === id ? { ...tb, isDeleted: false, deletedAt: null } : tb));
        break;
      case 'LPJ':
        setLpjReports(prev => prev.map(l => l.id === id ? { ...l, isDeleted: false, deletedAt: null } : l));
        break;
      case 'MasterUser':
        setMasterUsers(prev => prev.map(u => u.id === id ? { ...u, isDeleted: false, deletedAt: null } : u));
        break;
      default: break;
    }
  };

  const removeAppointment = (id) => {
    softDelete('SerahTerima', id);
  };

  const setAppointmentsWithMetadata = (newAppointments) => {
    // Check if we are adding a single new appointment
    if (newAppointments.length > appointments.length) {
      const added = newAppointments[newAppointments.length - 1];
      if (!added.owner) {
        added.owner = 'System Administrator';
        added.createdAt = new Date().toISOString();
        added.accessMode = 'Read / Write';
        if (added.document && added.document.name) {
          added.fileType = added.document.name.split('.').pop().toUpperCase();
          const kb = added.document.size / 1024;
          added.fileSize = kb > 1024 ? (kb / 1024).toFixed(2) + ' MB' : kb.toFixed(2) + ' KB';
          // Kita tidak perlu menyimpan object File utuh di state yang akan masuk localStorage,
          // tapi cukup ambil metadata nya saja. Object File bisa diremove atau dibiarkan (akan jadi {} di localstorage).
        } else {
          added.fileType = 'DOCX';
          added.fileSize = (Math.random() * 1 + 0.2).toFixed(1) + ' MB';
        }
      }
    }
    setAppointments(newAppointments);
  };

  const setInvoicesWithMetadata = (newInvoices) => {
    if (newInvoices.length > invoices.length) {
      const added = newInvoices[newInvoices.length - 1];
      if (!added.owner) {
        added.owner = 'System Administrator';
        added.createdAt = new Date().toISOString();
        added.accessMode = 'Full Access';
        added.fileType = 'PDF';
        added.fileSize = (Math.random() * 2 + 0.8).toFixed(1) + ' MB';
      }
    }
    setInvoices(newInvoices);
  };

  const setPaymentsWithMetadata = (newPayments) => {
    if (newPayments.length > payments.length) {
      const added = newPayments[newPayments.length - 1];
      if (!added.owner) {
        added.owner = 'System Administrator';
        added.createdAt = new Date().toISOString();
        added.accessMode = 'Full Access';
        added.fileType = 'PDF';
        added.fileSize = (Math.random() * 1.5 + 0.5).toFixed(1) + ' MB';
      }
    }
    setPayments(newPayments);
  };

  return (
    <AppDataContext.Provider value={{
      projects, addProject,
      appointments, setAppointments: setAppointmentsWithMetadata,
      purchaseOrders, addPO, approvePO, rejectPO,
      invoices, setInvoices: setInvoicesWithMetadata,
      payments, setPayments: setPaymentsWithMetadata, approvePayment, rejectPayment,
      terimaBarang, setTerimaBarang,
      lpjReports, setLpjReports,
      removeAppointment,
      generateInvoiceCode,
      generateSTCode,
      generateTBCode,
      generateLPJCode,
      searchTerm, setSearchTerm,
      softDelete, restoreItem,
      masterUsers, addMasterUser, updateMasterUser
    }}>
      {children}
    </AppDataContext.Provider>
  );
};
