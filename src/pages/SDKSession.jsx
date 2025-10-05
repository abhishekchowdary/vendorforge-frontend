import { useMemo, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getSession, updateSession } from '../lib/sessionStore.js';
import { motion } from 'framer-motion';
import { BANKS } from '../data/banks.js';
import { UPI_APPS } from '../data/upiApps.js';
import BankIcon from '../components/BankIcon.jsx';
import { bdSurcharge, bdCreateOrder } from '../lib/billdeskClient.js';

/* Left-rail methods */
const methods = [
  { key: 'saved',   label: 'Saved payment options' },
  { key: 'card',    label: 'Credit / Debit Cards' },
  { key: 'emi',     label: 'EMI' },
  { key: 'nb',      label: 'Internet Banking' },
  { key: 'upi',     label: 'UPI' },
  { key: 'wallet',  label: 'Wallets' },
  { key: 'challan', label: 'Challan' },
];

function isVpaValid(v) {
  return /^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}$/.test(v || '');
}

/* NetBanking redirect simulator */
function BankRedirect({ bank, amount, onComplete, onCancel }) {
  const [t, setT] = useState(3);
  useEffect(() => {
    const iv = setInterval(() => setT(x => x - 1), 1000);
    const tm = setTimeout(() => onComplete(), 3200);
    return () => { clearInterval(iv); clearTimeout(tm); };
  }, []);
  return (
    <div className="space-y-4 text-center">
      <div className="text-sm text-gray-300">Redirecting to {bank}…</div>
      <div className="text-xs text-gray-400">Amount: ₹{amount}</div>
      <div className="text-xs text-gray-500">Returning in {t}s</div>
      <div className="mx-auto h-1.5 w-full bg-white/5 rounded overflow-hidden">
        <div className="h-1.5 bg-brand-600 animate-pulse" style={{ width: `${(4 - t) * 25}%` }} />
      </div>
      <button onClick={onCancel} className="btn bg-white/10 hover:bg-white/20 text-white">Cancel</button>
    </div>
  );
}

export default function SDKSession() {
  const { id } = useParams();
  const nav = useNavigate();

  const [sess, setSess] = useState(() => getSession(id));
  const [active, setActive] = useState('card');

  // Card
  const [form, setForm] = useState({ card: '', exp: '', cvv: '', name: '', agree: false });

  // NetBanking
  const [nb, setNb] = useState({ bank: '' });
  const [nbRedirect, setNbRedirect] = useState(false);
  const [showAllBanks, setShowAllBanks] = useState(false);
  const [bankQuery, setBankQuery] = useState('');

  // UPI
  const [upi, setUpi] = useState({ vpa: '', mode: 'collect' }); // collect | intent

  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!sess) return;
    if (sess.status === 'CREATED') {
      const s = updateSession(sess.orderId, { status: 'IN_PROGRESS' });
      setSess(s);
    }
  }, []);

  const amount = useMemo(() => (sess?.amount ?? 0).toFixed(2), [sess]);

  if (!sess) {
    return (
      <div className="container-px py-8">
        <div className="text-gray-300">Session not found. It may have expired or the order ID is invalid.</div>
      </div>
    );
  }

  const payDisabled =
    processing ||
    (active === 'card' && (!form.card || !form.exp || !form.cvv || !form.name)) ||
    (active === 'nb' && !nb.bank) ||
    (active === 'upi' && !isVpaValid(upi.vpa));

  async function pay() {
    if (payDisabled) return;

    // NetBanking real UAT path (via proxy)
    if (active === 'nb') {
      try {
        setProcessing(true);

        const surchargeReq = {
          mercid: 'TESTMERCHANT',       // TODO: replace with actual
          bdorderid: sess.orderId,
          bank_id: nb.bank,
          payment_method_type: 'netbanking',
          txn_process_type: 'nb',
          product_id: 'DIRECT',
          amount: amount
        };

        const sRes = await bdSurcharge(surchargeReq);
        // Optional: show sRes.data.components & payable_amount

        const orderReq = {
          mercid: 'TESTMERCHANT',
          bdorderid: sess.orderId,
          issuer_response_type: 'billdesk',
          itemcode: 'DIRECT',
          bankid: nb.bank,
          amount: amount,
          payment_method_type: 'netbanking',
          txn_process_type: 'nb',
          clientPlatform: 'WEB'
        };

        const oRes = await bdCreateOrder(orderReq);
        const redirectUrl = oRes?.data?.redirect_url;

        // If a real redirect URL is provided, navigate out; otherwise show simulated redirect UI.
        if (redirectUrl) {
          // window.location.href = redirectUrl; // Uncomment for real redirect
          setNbRedirect(true);
          setTimeout(() => {
            const updated = updateSession(sess.orderId, {
              status: 'SUCCESS',
              method: 'nb',
              meta: { bank: nb.bank, session_id: oRes?.data?.session_id, redirect_url: redirectUrl, surcharge: sRes?.data }
            });
            setSess(updated);
            setProcessing(false);
            setNbRedirect(false);
          }, 2000);
        } else {
          setNbRedirect(true);
          setTimeout(() => {
            const updated = updateSession(sess.orderId, {
              status: 'SUCCESS',
              method: 'nb',
              meta: { bank: nb.bank, session_id: oRes?.data?.session_id, surcharge: sRes?.data }
            });
            setSess(updated);
            setProcessing(false);
            setNbRedirect(false);
          }, 2000);
        }
      } catch (e) {
        const updated = updateSession(sess.orderId, { status: 'FAIL', method: 'nb', meta: { bank: nb.bank, error: String(e?.message || e) } });
        setSess(updated);
        setProcessing(false);
      }
      return;
    }

    // Card / UPI demo handling (unchanged)
    setProcessing(true);
    setTimeout(() => {
      let status = 'SUCCESS';
      if (active === 'card' && form.card.endsWith('0')) status = 'FAIL';
      if (active === 'upi' && upi.vpa.endsWith('@fail')) status = 'FAIL';

      const updated = updateSession(sess.orderId, {
        status,
        method: active,
        meta: active === 'card'
          ? { last4: form.card.slice(-4) }
          : { vpa: upi.vpa, mode: upi.mode }
      });
      setSess(updated);
      setProcessing(false);
    }, active === 'upi' ? 1800 : 1200);
  }

  function finish() {
    nav('/payments');
  }

  // Filtered/Grouped banks
  const filtered = BANKS.filter(b =>
    b.name.toLowerCase().includes(bankQuery.toLowerCase()) ||
    b.code.toLowerCase().includes(bankQuery.toLowerCase())
  );
  const primaryBanks = filtered.slice(0, 8);
  const otherBanks = filtered.slice(8);

  return (
    <div className="container-px py-6">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left rail */}
        <div className="card p-0 overflow-hidden">
          {methods.map(m => (
            <button
              key={m.key}
              onClick={() => setActive(m.key)}
              className={`w-full text-left px-4 py-3 border-b border-white/5 hover:bg-white/5 ${active === m.key ? 'bg-white/10' : ''}`}
            >
              <span className="text-sm text-gray-200">{m.label}</span>
            </button>
          ))}
        </div>

        {/* Center panel */}
        <div className="lg:col-span-1 card p-5">
          {/* Card */}
          {active === 'card' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="grid gap-3">
                <input
                  placeholder="Card number"
                  value={form.card}
                  onChange={e => setForm({ ...form, card: e.target.value })}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-brand-500"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    placeholder="Expiration date"
                    value={form.exp}
                    onChange={e => setForm({ ...form, exp: e.target.value })}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-brand-500"
                  />
                  <input
                    placeholder="Security code"
                    value={form.cvv}
                    onChange={e => setForm({ ...form, cvv: e.target.value })}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-brand-500"
                  />
                </div>
                <input
                  placeholder="Full name on card"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-brand-500"
                />
                <label className="flex items-center gap-2 text-sm text-gray-400">
                  <input
                    type="checkbox"
                    checked={form.agree}
                    onChange={e => setForm({ ...form, agree: e.target.checked })}
                  />{' '}
                  Securely save this card.
                </label>
              </div>

              {sess.status === 'IN_PROGRESS' ? (
                <button
                  disabled={payDisabled}
                  onClick={pay}
                  className={`btn w-full ${payDisabled ? 'bg-white/10 text-gray-400' : 'btn-primary justify-center'}`}
                >
                  {processing ? 'Processing…' : `Pay ₹${amount}`}
                </button>
              ) : (
                <ResultBlock status={sess.status} onDone={finish} />
              )}
            </motion.div>
          )}

          {/* NetBanking with icon grid + search + redirect */}
          {active === 'nb' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              {!nbRedirect ? (
                <>
                  {/* Search */}
                  <div className="relative">
                    <input
                      value={bankQuery}
                      onChange={(e) => setBankQuery(e.target.value)}
                      placeholder="Search by bank name"
                      className="w-full bg-[#0f0d1a] text-gray-100 border border-white/10 rounded-lg px-3 py-2 pr-9 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand/40"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 text-sm">⌘K</span>
                  </div>

                  {/* Top banks */}
                  <div className="space-y-2">
                    <div className="text-xs tracking-wide text-gray-400">Top banks</div>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {primaryBanks.length === 0 && (
                        <div className="text-sm text-gray-500 col-span-2">No banks match “{bankQuery}”.</div>
                      )}
                      {primaryBanks.map(b => (
                        <button
                          key={b.code}
                          onClick={() => setNb({ bank: b.code })}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg border transition ${
                            nb.bank === b.code
                              ? 'border-brand-600 bg-white/10 ring-1 ring-brand/30'
                              : 'border-white/10 bg-white/5 hover:bg-white/10'
                          }`}
                        >
                          <BankIcon id={b.icon} className="h-5 w-5" />
                          <span className="text-sm text-gray-100">{b.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* All other banks */}
                  <div className="space-y-2">
                    {!showAllBanks ? (
                      <button onClick={() => setShowAllBanks(true)} className="text-sm text-brand-300 hover:text-brand-200">
                        All banks
                      </button>
                    ) : (
                      <>
                        <div className="text-xs tracking-wide text-gray-400">All other banks</div>
                        <div className="grid sm:grid-cols-2 gap-2 max-h-56 overflow-auto pr-1">
                          {otherBanks.map(b => (
                            <button
                              key={b.code}
                              onClick={() => setNb({ bank: b.code })}
                              className={`flex items-center gap-3 px-3 py-2 rounded-lg border transition ${
                                nb.bank === b.code
                                  ? 'border-brand-600 bg-white/10 ring-1 ring-brand/30'
                                  : 'border-white/10 bg-white/5 hover:bg-white/10'
                              }`}
                            >
                              <BankIcon id={b.icon} className="h-5 w-5" />
                              <span className="text-sm text-gray-100">{b.name}</span>
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Accessible fallback select */}
                  <div className="grid gap-2">
                    <label className="text-xs tracking-wide text-gray-500">Or choose from list</label>
                    <select
                      value={nb.bank}
                      onChange={(e) => setNb({ bank: e.target.value })}
                      className="bg-[#0f0d1a] text-gray-100 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand/40"
                    >
                      <option value="" className="bg-[#0f0d1a] text-gray-300">Choose</option>
                      {filtered.map(b => (
                        <option key={b.code} value={b.code} className="bg-[#0f0d1a] text-gray-100">
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Action */}
                  {sess.status === 'IN_PROGRESS' ? (
                    <button
                      disabled={processing || !nb.bank}
                      onClick={pay}
                      className={`btn w-full ${processing || !nb.bank ? 'bg-white/10 text-gray-400' : 'btn-primary justify-center'}`}
                    >
                      {processing
                        ? 'Connecting to bank…'
                        : nb.bank
                        ? `Pay ₹${amount} via ${BANKS.find(x => x.code === nb.bank)?.name || nb.bank}`
                        : `Pay ₹${amount}`}
                    </button>
                  ) : (
                    <ResultBlock status={sess.status} onDone={finish} />
                  )}
                </>
              ) : (
                <BankRedirect
                  bank={BANKS.find(b => b.code === nb.bank)?.name || nb.bank}
                  amount={amount}
                  onComplete={() => {
                    const status = ['SBI'].includes(nb.bank) ? 'FAIL' : 'SUCCESS';
                    const updated = updateSession(sess.orderId, { status, method: 'nb', meta: { bank: nb.bank } });
                    setSess(updated);
                    setProcessing(false);
                    setNbRedirect(false);
                  }}
                  onCancel={() => {
                    const updated = updateSession(sess.orderId, { status: 'CANCELLED', method: 'nb', meta: { bank: nb.bank } });
                    setSess(updated);
                    setProcessing(false);
                    setNbRedirect(false);
                  }}
                />
              )}
            </motion.div>
          )}

          {/* UPI */}
          {active === 'upi' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="flex items-center gap-2">
                {UPI_APPS.map(app => (
                  <span key={app.key} className="px-2 py-1 text-xs rounded bg-white/5 border border-white/10 text-gray-200">
                    {app.label}
                  </span>
                ))}
              </div>

              <div className="grid gap-2">
                <label className="text-sm text-gray-400">UPI ID (VPA)</label>
                <input
                  placeholder="name@upi"
                  value={upi.vpa}
                  onChange={(e) => setUpi({ ...upi, vpa: e.target.value })}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-brand-500"
                />
                {!isVpaValid(upi.vpa) && upi.vpa && (
                  <span className="text-xs text-red-400">Enter a valid VPA like user@okhdfcbank</span>
                )}
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="upimode"
                      checked={upi.mode === 'collect'}
                      onChange={() => setUpi({ ...upi, mode: 'collect' })}
                    />
                    Collect
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="upimode"
                      checked={upi.mode === 'intent'}
                      onChange={() => setUpi({ ...upi, mode: 'intent' })}
                    />
                    Intent
                  </label>
                </div>
                <p className="text-xs text-gray-500">This mock simulates a collect request and auto-approves after a delay.</p>
              </div>

              {sess.status === 'IN_PROGRESS' ? (
                <button
                  disabled={payDisabled}
                  onClick={pay}
                  className={`btn w-full ${payDisabled ? 'bg-white/10 text-gray-400' : 'btn-primary justify-center'}`}
                >
                  {processing ? (upi.mode === 'collect' ? 'Awaiting approval…' : 'Opening UPI app…') : `Pay ₹${amount}`}
                </button>
              ) : (
                <ResultBlock status={sess.status} onDone={finish} />
              )}
            </motion.div>
          )}

          {/* Placeholder for other methods */}
          {active !== 'card' && active !== 'nb' && active !== 'upi' && (
            <div className="text-sm text-gray-400">This method is not interactive yet.</div>
          )}
        </div>

        {/* Right summary */}
        <div className="card p-5">
          <div className="text-sm text-gray-400">Summary</div>
          <div className="mt-2 text-xs tracking-wide text-gray-400">Order ID</div>
          <div className="text-white font-medium">{sess.orderId}</div>
          <div className="mt-4 text-xs tracking-wide text-gray-400">Total Amount</div>
          <div className="text-xl font-semibold">₹{amount}</div>
          <div className="mt-6 text-xs tracking-wide text-gray-400">Status</div>
          <div className="text-sm">{sess.status}</div>
        </div>
      </div>
    </div>
  );
}

function ResultBlock({ status, onDone }) {
  return (
    <div className="space-y-3">
      <div className={`text-sm ${status === 'SUCCESS' ? 'text-green-400' : status === 'CANCELLED' ? 'text-yellow-400' : 'text-red-400'}`}>
        Result: {status}
      </div>
      <button onClick={onDone} className="btn btn-primary">Return to Payments</button>
    </div>
  );
}
