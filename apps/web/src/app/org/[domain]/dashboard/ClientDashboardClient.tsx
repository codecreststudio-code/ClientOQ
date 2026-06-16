'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';

export default function ClientDashboardClient({ org }: { org: any }) {
  const [activeTab, setActiveTab] = useState<'projects' | 'invoices'>('projects');
  const [projects, setProjects] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [payingInvoice, setPayingInvoice] = useState<string | null>(null);
  
  const themeColor = org.themeColor || 'indigo';

  useEffect(() => {
    // Mocking fetch until we wire up real data
    setTimeout(() => {
      setProjects([
        { id: '1', name: 'Website Redesign', status: 'In Progress', progress: 65, files: [{ name: 'brief.pdf', url: '#' }] },
        { id: '2', name: 'SEO Audit', status: 'Review', progress: 90, files: [] }
      ]);
      setInvoices([
        { id: 'INV-001', amount: 1500, status: 'Unpaid', dueDate: '2026-07-01' },
        { id: 'INV-002', amount: 500, status: 'Paid', dueDate: '2026-06-01' }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleFileUpload = (projectId: string) => {
    alert(`File upload dialog opened for project ${projectId}. Restricted to Client role.`);
  };

  const handlePayInvoice = async (invoiceId: string) => {
    setPayingInvoice(invoiceId);
    try {
      // 1. Create order on backend (using the tenant's dynamic keys)
      const res = await fetch(`/api/portal/invoices/${invoiceId}/pay`, {
        method: 'POST'
      });
      const data = await res.json();
      
      if (!res.ok) {
        alert(data.message || 'Failed to initiate payment');
        setPayingInvoice(null);
        return;
      }

      // 2. Open Razorpay Checkout Widget
      const options = {
        key: data.keyId, // The tenant's Razorpay Public Key ID
        amount: data.amount,
        currency: data.currency,
        name: org.name,
        description: `Payment for Invoice ${invoiceId}`,
        image: org.logoUrl || undefined,
        order_id: data.orderId,
        handler: function (response: any) {
          alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
          // In a real app, this triggers our webhook in the background. We can optimistically update UI here.
          setInvoices(prev => prev.map(inv => inv.id === invoiceId ? { ...inv, status: 'Paid' } : inv));
        },
        theme: {
          color: org.themeColor || '#6366f1' // Use tenant's brand color for checkout modal!
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        alert(`Payment failed: ${response.error.description}`);
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      alert('An unexpected error occurred while processing payment.');
    } finally {
      setPayingInvoice(null);
    }
  };

  if (loading) return <div className="text-sm font-mono text-mute animate-pulse">Loading portal data...</div>;

  return (
    <div className="space-y-6">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      {/* Tabs */}
      <div className="flex gap-4 border-b border-hairline pb-2">
        <button 
          onClick={() => setActiveTab('projects')}
          className={`text-sm font-semibold pb-2 ${activeTab === 'projects' ? `text-${themeColor}-600 border-b-2 border-${themeColor}-600` : 'text-mute hover:text-ink'}`}
        >
          My Projects & Files
        </button>
        <button 
          onClick={() => setActiveTab('invoices')}
          className={`text-sm font-semibold pb-2 ${activeTab === 'invoices' ? `text-${themeColor}-600 border-b-2 border-${themeColor}-600` : 'text-mute hover:text-ink'}`}
        >
          Billing & Payments
        </button>
      </div>

      {/* Tab Content */}
      <div className="pt-4">
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold">Active Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map(p => (
                <div key={p.id} className="bg-canvas-soft border border-hairline rounded-md p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{p.name}</h3>
                      <span className="text-xs text-mute font-mono">{p.status}</span>
                    </div>
                    <span className="text-xs font-bold text-primary">{p.progress}%</span>
                  </div>
                  
                  <div className="pt-2 border-t border-hairline">
                    <h4 className="text-xs font-bold uppercase tracking-wider mb-2 text-mute">Files & Comments</h4>
                    {p.files.length === 0 ? <p className="text-xs text-mute">No files uploaded yet.</p> : (
                      <ul className="text-xs text-ink space-y-1">
                        {p.files.map((f: any, i: number) => <li key={i}>📄 {f.name}</li>)}
                      </ul>
                    )}
                    <button 
                      onClick={() => handleFileUpload(p.id)}
                      className="mt-3 text-xs bg-canvas border border-hairline px-3 py-1.5 rounded hover:border-primary transition-colors font-mono"
                    >
                      + Upload File or Comment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'invoices' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold">Outstanding Invoices</h2>
            <div className="bg-canvas-soft border border-hairline rounded-md overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-canvas border-b border-hairline text-xs font-mono uppercase tracking-wider text-mute">
                  <tr>
                    <th className="px-4 py-3">Invoice</th>
                    <th className="px-4 py-3">Due Date</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Amount</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline">
                  {invoices.map(inv => (
                    <tr key={inv.id}>
                      <td className="px-4 py-3 font-medium">{inv.id}</td>
                      <td className="px-4 py-3 text-mute">{inv.dueDate}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${inv.status === 'Paid' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'}`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono">${inv.amount}</td>
                      <td className="px-4 py-3 text-right">
                        {inv.status === 'Unpaid' ? (
                          <button 
                            onClick={() => handlePayInvoice(inv.id)}
                            className={`bg-${themeColor}-600 text-white text-xs px-3 py-1.5 rounded hover:bg-${themeColor}-700 transition-colors font-semibold`}
                            style={{ backgroundColor: org.themeColor ? org.themeColor : undefined }}
                          >
                            Pay Now
                          </button>
                        ) : (
                          <button className="text-xs text-mute border border-hairline px-3 py-1.5 rounded" disabled>Receipt</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
