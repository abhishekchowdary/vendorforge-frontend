import { BANK_ICON_BY_CODE } from './bankIcons.js';

export const BANKS = [
  // Top/common banks seen in screenshots
  { code: 'HDFC', name: 'HDFC Bank', icon: 'hdfcbank' },
  { code: 'ICIC', name: 'ICICI Bank', icon: 'icicibank' },
  { code: 'SBI',  name: 'SBI Bank', icon: 'sbibank' },              // a.k.a. State Bank of India
  { code: 'SBIC', name: 'State Bank of India (CRIS)', icon: 'sbibank' },
  { code: 'AXIS', name: 'Axis Bank', icon: 'axisbank' },

  // Extracted entries from paste (sample set; extend as needed)
  { code: 'DBSC', name: 'DBS Bank [Corporate]', icon: 'dbsbank' },
  { code: 'CBRR', name: 'Canara Bank [Retail]', icon: 'canarabank' },
  { code: 'DHAN', name: 'Dhanlaxmi bank', icon: 'dhanlaxmibank' },
  { code: 'JPMC', name: 'JPMC Bank', icon: 'jpmc' },               // sprite id inferred; adjust if your sprite uses another id
  { code: 'AUSF', name: 'AU Small Finance Bank', icon: 'ausmallfinancebank' },
  { code: 'AUSF-C', name: 'AU Small Finance Bank [Corporate]', icon: 'ausmallfinancebank' },
  { code: 'AXIS-C', name: 'Axis Bank[Corporate]', icon: 'axisbank' },
  { code: 'BAND', name: 'Bandhan Bank', icon: 'bandhanbank' },
  { code: 'BAND-C', name: 'Bandhan Bank [Corporate]', icon: 'bandhanbank' },
  { code: 'BOI-NR', name: 'Bank of India - New Retail', icon: 'bankofindia' },
  { code: 'BARC-C', name: 'Barclays Bank [Corporate]', icon: 'barclaysbank' },
  { code: 'BUPB', name: 'Baroda U.P. Bank', icon: 'barodaupbank' },
  { code: 'BASSEIN', name: 'Bassein Catholic Co-Operative Bank', icon: 'basseincatholic' },
  { code: 'BNPP', name: 'BNP Paribas', icon: 'bnpparibas' },
  { code: 'CACIB-C', name: 'CACIB [Corporate]', icon: 'cacib' },
  { code: 'CNRB', name: 'Canara Bank', icon: 'canarabank' },
  { code: 'CAPS-C', name: 'Capital Small Finance Bank[Corporate]', icon: 'capitalsmallfinancebank' },
  { code: 'CSB', name: 'Catholic Syrian Bank', icon: 'csb' },
  { code: 'CBI', name: 'Central Bank of India', icon: 'centralbankofindia' },
  { code: 'CGB-C', name: 'Chhatisgarh Rajya Gramin Bank Corpoarate', icon: 'chhattisgarhgraminbank' },
  { code: 'CUB', name: 'City Union Bank', icon: 'cityunionbank' },
  { code: 'DBS-NC', name: 'DBS Bank [New Corporate]', icon: 'dbsbank' },
  { code: 'DHAN-C', name: 'Dhanlaxmi bank[Corporate]', icon: 'dhanlaxmibank' },
  { code: 'DIGI-DBS', name: 'Digibank by DBS', icon: 'dbsbank' },
  { code: 'JSB-C', name: 'Janata Sahkari Bank [Corporate]', icon: 'janatasahakaribank' },
  { code: 'KALU-R', name: 'Kalupur Bank Retail', icon: 'kalupurbank' },
  { code: 'KBL-R', name: 'Karnataka Bank (KBL) Retail', icon: 'karnatakabank' },
  { code: 'KGB', name: 'Karnataka Gramin Bank', icon: 'karnatakagraminbank' },
  { code: 'NKGSB', name: 'NKGSB Bank', icon: 'nkgsb' },
  { code: 'PSB-C', name: 'Punjab and Sind Bank [Corporate]', icon: 'punjabandsindbankcorporate' },
  { code: 'RAJG', name: 'Rajasthan Gramin Bank', icon: 'rajasthangraminbank' },
  { code: 'RBL', name: 'RBL Bank', icon: 'rblbank' },
  { code: 'RBL-C', name: 'RBL Bank [Corporate]', icon: 'rblbank' },

  // Keep adding from paste.txt: follow the same pattern.
  // Tip: for each list item, use the <use xlink:href="#{symbolId}"> value as icon,
  // and the visible text content as name.
];

// Optional: export a helper to find by code quickly
export const BANK_BY_CODE = Object.fromEntries(BANKS.map(b => [b.code, b]));