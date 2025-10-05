const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5176/api/bd';

function headers() {
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
}

export async function bdSurcharge(payload) {
  const r = await fetch(`${BASE}/surcharge`, {
    method: 'POST', headers: headers(), body: JSON.stringify(payload)
  });
  if (!r.ok) throw new Error(`Surcharge failed ${r.status}`);
  return r.json();
}

export async function bdCreateOrder(payload) {
  const r = await fetch(`${BASE}/order`, {
    method: 'POST', headers: headers(), body: JSON.stringify(payload)
  });
  if (!r.ok) throw new Error(`Order failed ${r.status}`);
  return r.json();
}
