// Map bank code -> sprite <symbol id> from the BillDesk SVG sprite.
// Codes are short internal identifiers used by the mock.
// Verify each symbol id exists in your inlined sprite (index.html) or the imported sprite file.

export const BANK_ICON_BY_CODE = {
  // Top/common
  HDFC: 'hdfcbank',
  ICIC: 'icicibank',
  SBI: 'statebankofindia',            // State Bank of India
  SBIC: 'sbibank',           // SBI (CRIS) variant mapped to same icon
  AXIS: 'axisbank',

  // Extended set (sampled from provided list — expand as your sprite supports)
  DBSC: 'dbsbank',           // DBS Bank [Corporate]
  CBRR: 'canarabank',        // Canara Bank [Retail]
  DHAN: 'dhanlaxmibank',     // Dhanlaxmi bank
  JPMC: 'jpmc',              // JPMC Bank (adjust if your sprite uses another id)
  AUSF: 'ausmallfinancebank',
  'AUSF-C': 'ausmallfinancebank',
  'AXIS-C': 'axisbank',
  BAND: 'bandhanbank',
  'BAND-C': 'bandhanbank',
  'BOI-NR': 'bankofindia',   // Bank of India - New Retail
  'BARC-C': 'barclaysbank',
  BUPB: 'barodaupbank',
  BASSEIN: 'basseincatholic',
  BNPP: 'bnpparibas',
  'CACIB-C': 'cacib',        // Crédit Agricole CIB
  CNRB: 'canarabank',
  'CAPS-C': 'capitalsmallfinancebank',
  CSB: 'csb',                // Catholic Syrian Bank
  CBI: 'centralbankofindia',
  'CGB-C': 'chhattisgarhgraminbank',
  CUB: 'cityunionbank',
  'DBS-NC': 'dbsbank',       // DBS [New Corporate]
  'DHAN-C': 'dhanlaxmibank',
  'DIGI-DBS': 'dbsbank',     // digibank by DBS
  'JSB-C': 'janatasahakaribank',
  'KALU-R': 'kalupurbank',
  'KBL-R': 'karnatakabank',
  KGB: 'karnatakagraminbank',
  NKGSB: 'nkgsb',
  'PSB-C': 'punjabandsindbankcorporate',
  RAJG: 'rajasthangraminbank',
  RBL: 'rblbank',
  'RBL-C': 'rblbank',
};

// Utility: safe getter to avoid undefined icons
export function iconFor(code) {
  return BANK_ICON_BY_CODE[code] || null;
}
