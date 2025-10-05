import express from 'express';
import fetch from 'node-fetch';

export function billdeskRouter() {
  const router = express.Router();

  const BD_BASE = process.env.BD_BASE;       // e.g. https://uat1.billdesk.com
  let BD_OTOKEN = process.env.BD_OTOKEN;     // Raw token value (without "OToken " prefix)

  // Validate env upfront
  if (!BD_BASE) {
    console.warn('[BD PROXY] Missing BD_BASE env; requests will fail. Set BD_BASE to your UAT host.');
  }
  if (!BD_OTOKEN) {
    console.warn('[BD PROXY] Missing BD_OTOKEN env; requests will fail with 401. Set BD_OTOKEN to your UAT token.');
  }

  // If user accidentally added "OToken " in env, strip it to avoid "OToken OToken ..."
  if (BD_OTOKEN && BD_OTOKEN.trim().toUpperCase().startsWith('OTOKEN ')) {
    BD_OTOKEN = BD_OTOKEN.trim().slice(7);
    console.log('[BD PROXY] Stripped "OToken " prefix from BD_OTOKEN env to avoid duplication.');
  }

  function makeHeaders(clientHeaders = {}) {
    const now = new Date();
    const ts = now.toISOString().replace(/[-:.TZ]/g, '').slice(0, 14); // YYYYMMDDhhmmss
    const trace = (Math.random().toString(36).slice(2, 8) + Math.random().toString(36).slice(2, 8)).toUpperCase();

    // Some UAT setups require Origin; enable if needed:
    // const origin = 'https://uat1.billdesk.com';

    return {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `OToken ${BD_OTOKEN}`,
      'Bd-Timestamp': ts,
      'Bd-Traceid': trace,
      // Origin: origin, // uncomment if UAT enforces Origin
    };
  }

  async function forwardJson(url, body, req, res, tag) {
    const headers = makeHeaders(req.headers);
    // Log outgoing request (truncate large bodies)
    console.log(`[BD PROXY] ${tag} ->`, { url, headers: { ...headers, Authorization: 'OToken ****' }, body });

    let upstream;
    try {
      upstream = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });
    } catch (err) {
      console.error(`[BD PROXY] ${tag} fetch error`, err);
      return res.status(502).json({ code: 'BD_PROXY_ERROR', message: err.message || String(err) });
    }

    const ct = upstream.headers.get('content-type') || '';
    const status = upstream.status;
    let raw;
    try {
      raw = await upstream.text();
    } catch (err) {
      console.error(`[BD PROXY] ${tag} read error`, err);
      return res.status(502).json({ code: 'BD_PROXY_READ_ERROR', message: err.message || String(err) });
    }

    // Log response (trim to avoid flooding logs)
    console.log(`[BD PROXY] ${tag} <-`, { status, contentType: ct, preview: raw.slice(0, 400) });

    // Pass through content type and status
    res.status(status).type(ct || 'application/json').send(raw);
  }

  // POST /api/bd/surcharge
  router.post('/surcharge', async (req, res) => {
    if (!BD_BASE || !BD_OTOKEN) {
      return res.status(500).json({ code: 'BD_PROXY_CONFIG', message: 'BD_BASE/BD_OTOKEN not configured' });
    }

    // Validate required fields quickly to avoid 400s
    const { mercid, bdorderid, bank_id, payment_method_type, txn_process_type, product_id, amount } = req.body || {};
    if (!mercid || !bdorderid || !bank_id || !payment_method_type || !txn_process_type || !product_id || !amount) {
      console.warn('[BD PROXY] surcharge missing fields', req.body);
      // Still forward if you prefer UAT to validate; otherwise short-circuit:
      // return res.status(400).json({ code: 'BAD_REQUEST', message: 'Missing required fields' });
    }

    const url = `${BD_BASE}/payments/v1_2/orders/surcharge`;
    return forwardJson(url, req.body, req, res, 'surcharge');
  });

  // POST /api/bd/order
  router.post('/order', async (req, res) => {
    if (!BD_BASE || !BD_OTOKEN) {
      return res.status(500).json({ code: 'BD_PROXY_CONFIG', message: 'BD_BASE/BD_OTOKEN not configured' });
    }

    // Validate expected fields (note: bankid and itemcode differ from surcharge)
    const { mercid, bdorderid, bankid, itemcode, amount, payment_method_type, txn_process_type, issuer_response_type, clientPlatform } = req.body || {};
    if (!mercid || !bdorderid || !bankid || !itemcode || !amount || !payment_method_type || !txn_process_type) {
      console.warn('[BD PROXY] order missing fields', req.body);
      // Same note as above about early 400 return
    }

    const url = `${BD_BASE}/web/v1_2/transactions/order`;
    return forwardJson(url, req.body, req, res, 'order');
  });

  return router;
}
