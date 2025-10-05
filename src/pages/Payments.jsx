import { useState } from 'react';
import Card from '../components/Card.jsx';
import { createSession, listSessions } from '../lib/sessionStore.js';
import { Link } from 'react-router-dom';

export default function Payments() {
  const [amount, setAmount] = useState('1.79'); // demo default
  const [last, setLast] = useState(listSessions());

  function createOrder() {
    const sess = createSession({ amount: parseFloat(amount || '0') });
    setLast(listSessions());
    window.location.href = `/sdk/session/${sess.orderId}`;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card title="New Payment" actions={<button className="btn btn-primary" onClick={createOrder}>Create Order</button>}>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <label className="text-sm text-gray-400">Amount (INR)</label>
            <input value={amount} onChange={e => setAmount(e.target.value)} type="number"
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-brand-500" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm text-gray-400">Merchant ID</label>
            <input disabled value="TESTMERCHANT" className="bg-white/5 border border-white/10 rounded-lg px-3 py-2" />
          </div>
        </div>
        <p className="mt-3 text-sm text-gray-400">Click Create Order to open the BillDesk‑like checkout with this amount.</p>
      </Card>

      <Card title="Recent Orders">
        <ul className="space-y-2">
          {last.map(s => (
            <li key={s.orderId} className="flex items-center justify-between">
              <span className="text-gray-300">{s.orderId}</span>
              <div className="flex items-center gap-3">
                <span className="text-xs px-2 py-0.5 rounded bg-white/5 border border-white/10">{s.status}</span>
                <Link to={`/sdk/session/${s.orderId}`} className="text-sm text-brand-300 hover:text-brand-200">Open</Link>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <Card title="Notes">
        This flow excludes eMandate and focuses on card/netbanking/UPI UI and session lifecycle.
      </Card>
    </div>
  );
}
