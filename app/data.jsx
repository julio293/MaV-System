/* ══════════════════════════════════════════════════════════════════════════
   Mock data — payees, transactions, billers, plans. Indian UPI context.
   ══════════════════════════════════════════════════════════════════════════ */

const USER = { name: 'Aarav Mehta', first: 'Aarav', vpa: 'aarav@fyscal', phone: '+91 98765 43210', bank: 'HDFC Bank ••6042', balance: 48250.75, wallet: 1240.00, rewards: 1875, scratchCards: 3,
  upiLimit: 100000, spentToday: 26200 };

/* the user's own accounts, for Self-transfer */
const SELF_ACCOUNTS = [
  { id: 'self-hdfc', name: 'HDFC Bank', acc: '•• 6042', type: 'Savings', balance: 48250.75, color: '#004c8f', vpa: 'aarav@fyscal' },
  { id: 'self-icici', name: 'ICICI Bank', acc: '•• 9931', type: 'Salary', balance: 122430.00, color: '#b02a30', vpa: 'aarav.m@okicici' },
];

/* known merchants — verified payees (fraud cue: green verified badge) */
const KNOWN_MERCHANTS = {
  'swiggy@ybl': { name: 'Swiggy', verified: true },
  'brewco@ybl': { name: 'Brew & Co. Coffee', verified: true },
  'amazon@apl': { name: 'Amazon Pay India', verified: true },
};

const BANKS = [
  { id: 'bk1', name: 'HDFC Bank', acc: '•• 6042', balance: 48250.75, color: '#004c8f', primary: true },
  { id: 'bk2', name: 'ICICI Bank', acc: '•• 9931', balance: 122430.00, color: '#b02a30' },
];

const PAYEES = [
  { id: 'p1', name: 'Priya Sharma', vpa: 'priya@okhdfc', phone: '98201 11223', recent: true },
  { id: 'p2', name: 'Rahul Verma', vpa: 'rahulv@okaxis', phone: '99100 44556', recent: true },
  { id: 'p3', name: 'Sneha Iyer', vpa: 'sneha.iyer@oksbi', phone: '90043 77889', recent: true },
  { id: 'p4', name: 'Vikram Nair', vpa: '9845012345@ybl', phone: '98450 12345', recent: true },
  { id: 'p5', name: 'Ananya Gupta', vpa: 'ananyag@okicici', phone: '97654 32109' },
  { id: 'p6', name: 'Karthik Reddy', vpa: 'karthik@paytm', phone: '90876 54321' },
  { id: 'p7', name: 'Meera Joshi', vpa: 'meeraj@okhdfc', phone: '99887 76655' },
  { id: 'p8', name: 'Arjun Singh', vpa: 'arjun.s@ybl', phone: '98112 23344' },
];

const TXNS = [
  { id: 't1', name: 'Priya Sharma', type: 'P2P · Sent', cat: 'sent', tag: 'transfers', amount: -1200, when: 'Today, 2:14 PM', day: 'Today', status: 'Success', vpa: 'priya@okhdfc', note: 'Dinner split', bal: 48250.75 },
  { id: 't2', name: 'Salary — Acme Corp', type: 'Bank transfer', cat: 'credit', tag: 'income', amount: 92000, when: 'Today, 9:02 AM', day: 'Today', status: 'Success', vpa: 'acme@hdfcbank', note: 'June payout', bal: 49450.75 },
  { id: 't3', name: 'Airtel Prepaid', type: 'Mobile recharge', cat: 'bill', tag: 'bills', amount: -299, when: 'Today, 8:30 AM', day: 'Today', status: 'Success', note: '₹299 · 28 days', bal: 7450.75 },
  { id: 't10', name: 'Uber', type: 'Merchant · Scan', cat: 'sent', tag: 'travel', amount: -340, when: 'Today, 8:05 AM', day: 'Today', status: 'Success', vpa: 'uber@axisbank', bal: 7749.75 },
  { id: 't4', name: 'Swiggy', type: 'Merchant · Scan', cat: 'sent', tag: 'food', amount: -476, when: 'Yesterday, 9:21 PM', day: 'Yesterday', status: 'Success', vpa: 'swiggy@ybl', bal: 8089.75 },
  { id: 't5', name: 'Rahul Verma', type: 'P2P · Sent', cat: 'sent', tag: 'transfers', amount: -5000, when: 'Yesterday, 6:40 PM', day: 'Yesterday', status: 'Pending', vpa: 'rahulv@okaxis', note: 'Trip advance', bal: 8565.75 },
  { id: 't11', name: 'BigBasket', type: 'Merchant · Refund', cat: 'credit', tag: 'shopping', amount: 1284, when: 'Yesterday, 1:12 PM', day: 'Yesterday', status: 'Refunded', vpa: 'bigbasket@hdfcbank', note: 'Order cancelled', bal: 13565.75 },
  { id: 't6', name: 'BESCOM Electricity', type: 'Bill payment', cat: 'bill', tag: 'bills', amount: -1840, when: 'Yesterday, 11:10 AM', day: 'Yesterday', status: 'Success', note: 'June bill', bal: 12281.75 },
  { id: 't12', name: 'Zomato', type: 'Merchant · Scan', cat: 'sent', tag: 'food', amount: -612, when: '23 Jun, 8:48 PM', day: 'Earlier', status: 'Success', vpa: 'zomato@ybl', bal: 14121.75 },
  { id: 't7', name: 'Sneha Iyer', type: 'P2P · Received', cat: 'credit', tag: 'transfers', amount: 2500, when: '23 Jun, 4:05 PM', day: 'Earlier', status: 'Success', vpa: 'sneha.iyer@oksbi', bal: 14733.75 },
  { id: 't8', name: 'Amazon Pay', type: 'Merchant', cat: 'sent', tag: 'shopping', amount: -2199, when: '22 Jun, 1:30 PM', day: 'Earlier', status: 'Success', vpa: 'amazon@apl', bal: 12233.75 },
  { id: 't9', name: 'Vikram Nair', type: 'P2P · Sent', cat: 'sent', tag: 'transfers', amount: -800, when: '21 Jun, 7:55 PM', day: 'Earlier', status: 'Failed', vpa: '9845012345@ybl', note: 'Bank declined', bal: 14432.75 },
];

/* smart categories */
const CATEGORIES = {
  food: { label: 'Food & Drink', icon: 'cup', color: '#ff8400' },
  shopping: { label: 'Shopping', icon: 'cart', color: '#7c4dff' },
  bills: { label: 'Bills & Utilities', icon: 'bolt', color: '#0098a6' },
  travel: { label: 'Travel', icon: 'car', color: '#0053ff' },
  transfers: { label: 'Transfers', icon: 'send', color: '#352eff' },
  income: { label: 'Income', icon: 'receive', color: '#629c28' },
};

/* monthly statements */
const STATEMENTS = [
  { id: 'sm-jun', month: 'June 2026', range: '1–30 Jun', credit: 94500, debit: 11615, count: 24, current: true },
  { id: 'sm-may', month: 'May 2026', range: '1–31 May', credit: 92000, debit: 38420, count: 41 },
  { id: 'sm-apr', month: 'April 2026', range: '1–30 Apr', credit: 92000, debit: 29870, count: 36 },
  { id: 'sm-mar', month: 'March 2026', range: '1–31 Mar', credit: 88000, debit: 41250, count: 52 },
];

/* dispute reasons for support escalation */
const DISPUTE_REASONS = [
  { id: 'd1', label: 'I didn’t receive what I paid for', icon: 'cart' },
  { id: 'd2', label: 'Money was debited but payment failed', icon: 'alert' },
  { id: 'd3', label: 'I was charged twice', icon: 'copy' },
  { id: 'd4', label: 'I don’t recognise this transaction', icon: 'shield' },
  { id: 'd5', label: 'Wrong amount was charged', icon: 'rupee' },
  { id: 'd6', label: 'Something else', icon: 'dots' },
];

const RECHARGE_PLANS = [
  { id: 'r1', price: 299, validity: '28 days', data: '1.5 GB/day', extra: 'Unlimited calls · 100 SMS/day', tag: 'Popular' },
  { id: 'r2', price: 479, validity: '56 days', data: '1.5 GB/day', extra: 'Unlimited calls · 100 SMS/day' },
  { id: 'r3', price: 719, validity: '84 days', data: '2 GB/day', extra: 'Unlimited calls · Disney+ Hotstar' },
  { id: 'r4', price: 155, validity: '24 days', data: '1 GB total', extra: 'Unlimited calls · 300 SMS' },
];

const BILLERS = [
  { id: 'b-elec', label: 'Electricity', icon: 'bolt', tint: 'tint-warning' },
  { id: 'b-mobile', label: 'Mobile', icon: 'phone', tint: 'tint-primary' },
  { id: 'b-dth', label: 'DTH', icon: 'tv', tint: 'tint-primary' },
  { id: 'b-water', label: 'Water', icon: 'drop', tint: 'tint-primary' },
  { id: 'b-broadband', label: 'Broadband', icon: 'wifi', tint: 'tint-primary' },
  { id: 'b-gas', label: 'Gas', icon: 'flash', tint: 'tint-warning' },
  { id: 'b-insurance', label: 'Insurance', icon: 'insurance', tint: 'tint-success' },
  { id: 'b-credit', label: 'Credit Card', icon: 'card', tint: 'tint-neutral' },
];

/* personalized smart-suggestion cards (adaptive widgets) */
const SUGGESTIONS = [
  { id: 's1', kind: 'request', icon: 'receive', tint: 'tint-success', title: 'Priya requested ₹500', sub: 'Dinner split · 2h ago', cta: 'Pay', accent: 'var(--mav-success)' },
  { id: 's2', kind: 'bill', icon: 'bolt', tint: 'tint-warning', title: 'Electricity due in 3 days', sub: 'BESCOM · ₹1,840', cta: 'Pay bill', accent: '#b35e00' },
  { id: 's3', kind: 'recharge', icon: 'phone', tint: 'tint-primary', title: 'Airtel plan expires tomorrow', sub: 'Recharge ₹299 · 1.5GB/day', cta: 'Recharge', accent: 'var(--mav-primary)' },
];

/* offers + rewards */
const OFFERS = [
  { id: 'o1', brand: 'Swiggy', icon: 'gift', title: '60% off up to ₹120', sub: 'Pay via Fyscal UPI', grad: 'linear-gradient(135deg,#ff6b35,#f7931e)' },
  { id: 'o2', brand: 'BookMyShow', icon: 'star', title: 'Buy 1 Get 1 on movies', sub: 'Every Wednesday', grad: 'linear-gradient(135deg,#352eff,#0053ff)' },
  { id: 'o3', brand: 'MMT', icon: 'bolt', title: 'Flat ₹750 off flights', sub: 'Code FLYUPI', grad: 'linear-gradient(135deg,#0098a6,#1affcd)' },
];

/* finance products */
const FINANCE = [
  { id: 'f-wallet', icon: 'card', label: 'Wallet', value: '₹1,240', tint: 'tint-primary' },
  { id: 'f-rewards', icon: 'gift', label: 'Rewards', value: '1,875 pts', tint: 'tint-success' },
  { id: 'f-credit', icon: 'rupee', label: 'Pay Later', value: 'Up to ₹60k', tint: 'tint-primary' },
  { id: 'f-insurance', icon: 'insurance', label: 'Insurance', value: 'From ₹20/mo', tint: 'tint-warning' },
];

/* bank directory for the link-account flow */
const BANK_DIR = [
  { id: 'hdfc', name: 'HDFC Bank', color: '#004c8f', popular: true },
  { id: 'sbi', name: 'State Bank of India', color: '#22409a', popular: true },
  { id: 'icici', name: 'ICICI Bank', color: '#b02a30', popular: true },
  { id: 'axis', name: 'Axis Bank', color: '#97144d', popular: true },
  { id: 'kotak', name: 'Kotak Mahindra Bank', color: '#ed1c24', popular: true },
  { id: 'pnb', name: 'Punjab National Bank', color: '#a8881f', popular: true },
  { id: 'bob', name: 'Bank of Baroda', color: '#f15a22', popular: true },
  { id: 'yes', name: 'YES Bank', color: '#00518f', popular: true },
  { id: 'idfc', name: 'IDFC FIRST Bank', color: '#9c1d27' },
  { id: 'indus', name: 'IndusInd Bank', color: '#9b1b30' },
  { id: 'canara', name: 'Canara Bank', color: '#1a3c8c' },
  { id: 'union', name: 'Union Bank of India', color: '#c8102e' },
  { id: 'idbi', name: 'IDBI Bank', color: '#0a6b3b' },
  { id: 'rbl', name: 'RBL Bank', color: '#5b2d8e' },
  { id: 'fed', name: 'Federal Bank', color: '#f6a21e', unsupported: true },
  { id: 'bandhan', name: 'Bandhan Bank', color: '#b8232f', unsupported: true },
];

/* accounts discovered at a bank during linking (multi-account UX) */
const FOUND_ACCOUNTS = [
  { id: 'a1', type: 'Savings account', acc: '•••• 6042', primary: true },
  { id: 'a2', type: 'Salary account', acc: '•••• 8817' },
  { id: 'a3', type: 'Current account', acc: '•••• 2390' },
];

/* notification center — prioritized, actionable, deep-linked */
const NOTIFS = [
  { id: 'n2', group: 'Today', cat: 'security', icon: 'shieldChk', tint: 'tint-primary', priority: 'high', verified: true, title: 'New device signed in', body: 'iPhone 15 · Bengaluru · 3:10 PM. Was this you?', time: 'now', unread: true, action: { label: 'Review', screen: 'devices' }, dismiss: 'Yes, it’s me' },
  { id: 'n1', group: 'Today', cat: 'transaction', icon: 'receive', tint: 'tint-success', title: 'Money received', body: 'Sneha Iyer sent you ₹2,500', time: '4:05 PM', unread: true, link: { screen: 'txn', params: { id: 't7' } }, action: { label: 'View', screen: 'txn', params: { id: 't7' } } },
  { id: 'n3', group: 'Today', cat: 'reminder', icon: 'rupee', tint: 'tint-primary', title: 'Priya requested ₹500', body: 'Dinner split · expires in 22 hours', time: '2:10 PM', unread: true, action: { label: 'Pay', screen: 'amount', params: { payee: { name: 'Priya Sharma', vpa: 'priya@okhdfc', known: true } } } },
  { id: 'n7', group: 'Today', cat: 'reminder', icon: 'bolt', tint: 'tint-warning', priority: 'high', title: 'Electricity bill due in 3 days', body: 'BESCOM · ₹1,840 · Pay now to avoid late fee', time: '11:00 AM', unread: true, action: { label: 'Pay bill', screen: 'biller', params: { savedId: 'sb1' } } },
  { id: 'n3b', group: 'Today', cat: 'cashback', icon: 'gift', tint: 'tint-success', title: 'You won a scratch card 🎉', body: 'Earned on your ₹476 Swiggy payment', time: '9:25 AM', unread: true, action: { label: 'Scratch now', screen: 'rewards' } },
  { id: 'n8', group: 'Today', cat: 'suggestion', icon: 'sparkle', tint: 'tint-primary', title: 'Set up AutoPay for your Wi-Fi', body: 'You’ve paid ACT Fibernet 3 months in a row — automate it', time: '8:30 AM', unread: false, action: { label: 'Set up', screen: 'autopay', params: { provider: 'ACT Fibernet' } } },
  { id: 'n6', group: 'Earlier', cat: 'transaction', icon: 'check', tint: 'tint-success', title: 'Recharge successful', body: 'Airtel prepaid · ₹299 · 28 days validity', time: 'Mon', unread: false, link: { screen: 'txn', params: { id: 't3' } } },
  { id: 'n5', group: 'Earlier', cat: 'cashback', icon: 'rupee', tint: 'tint-success', title: '₹35 cashback credited', body: 'From your Swiggy payment · added to balance', time: 'Sun', unread: false, action: { label: 'View rewards', screen: 'rewards' } },
  { id: 'n9', group: 'Earlier', cat: 'security', icon: 'lock', tint: 'tint-primary', verified: true, title: 'UPI PIN changed', body: 'Your UPI PIN was updated successfully', time: '23 Jun', unread: false },
];
const NOTIF_FILTERS = [
  { id: 'all', label: 'All' }, { id: 'transaction', label: 'Transactions' },
  { id: 'security', label: 'Security' }, { id: 'cashback', label: 'Rewards' }, { id: 'reminder', label: 'Reminders' },
];

/* ── INR amount → words (Indian system: lakh / crore) ──────────────────── */
function inrWords(num) {
  num = Math.floor(Number(num) || 0);
  if (num === 0) return 'Zero rupees';
  const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  const two = (n) => n < 20 ? ones[n] : tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
  const three = (n) => (n >= 100 ? ones[Math.floor(n / 100)] + ' hundred' + (n % 100 ? ' ' + two(n % 100) : '') : two(n));
  let out = '';
  const crore = Math.floor(num / 10000000); num %= 10000000;
  const lakh = Math.floor(num / 100000); num %= 100000;
  const thou = Math.floor(num / 1000); num %= 1000;
  if (crore) out += three(crore) + ' crore ';
  if (lakh) out += two(lakh) + ' lakh ';
  if (thou) out += two(thou) + ' thousand ';
  if (num) out += three(num);
  out = out.trim().replace(/\s+/g, ' ');
  return out.charAt(0).toUpperCase() + out.slice(1) + ' rupees';
}
window.inrWords = inrWords;

/* KYC — OCR-extracted document data (simulated) */
const KYC = {
  pan: { number: 'ABCPM4521K', name: 'AARAV MEHTA', dob: '14 Aug 1996', father: 'RAJESH MEHTA' },
  aadhaar: { number: 'XXXX XXXX 4521', name: 'Aarav Mehta', dob: '14/08/1996', gender: 'Male' },
  address: { line1: '402, Lake View Residency', line2: 'Indiranagar, 12th Main', city: 'Bengaluru', state: 'Karnataka', pin: '560038' },
};
window.KYC = KYC;

/* bill-pay categories */
const BILL_CATEGORIES = [
  { id: 'electricity', label: 'Electricity', icon: 'bolt', tint: 'tint-warning' },
  { id: 'water', label: 'Water', icon: 'drop', tint: 'tint-primary' },
  { id: 'gas', label: 'Gas', icon: 'flash', tint: 'tint-warning' },
  { id: 'broadband', label: 'Broadband', icon: 'wifi', tint: 'tint-primary' },
  { id: 'dth', label: 'DTH', icon: 'tv', tint: 'tint-primary' },
  { id: 'education', label: 'Education', icon: 'cap', tint: 'tint-success' },
  { id: 'fastag', label: 'FASTag', icon: 'car', tint: 'tint-primary' },
  { id: 'creditcard', label: 'Credit Card', icon: 'card', tint: 'tint-neutral' },
];

/* providers per category (for provider search) */
const PROVIDERS = {
  electricity: ['BESCOM', 'MSEDCL', 'Tata Power', 'Adani Electricity', 'BSES Rajdhani', 'Torrent Power', 'TNEB', 'CESC'],
  water: ['BWSSB Bangalore', 'Delhi Jal Board', 'MCGM Mumbai', 'Hyderabad Water Board'],
  gas: ['Indane Gas', 'HP Gas', 'Bharat Gas', 'Mahanagar Gas', 'Adani Gas'],
  broadband: ['ACT Fibernet', 'JioFiber', 'Airtel Xstream', 'BSNL Broadband', 'Hathway'],
  dth: ['Tata Play', 'Airtel Digital TV', 'Dish TV', 'd2h', 'Sun Direct'],
  education: ['Vidyalaya School', 'Delhi Public School', 'VIT University', 'BYJU’S', 'Unacademy'],
  fastag: ['HDFC FASTag', 'ICICI FASTag', 'Paytm FASTag', 'SBI FASTag', 'Axis FASTag'],
  creditcard: ['HDFC Bank', 'ICICI Bank', 'Axis Bank', 'SBI Card', 'Kotak', 'American Express'],
};

/* saved billers (statuses: overdue · due · autopay · paid) */
const SAVED_BILLERS = [
  { id: 'sb2', category: 'broadband', provider: 'ACT Fibernet', icon: 'wifi', tint: 'tint-primary', consumerId: '••8830', nick: 'Home Wi-Fi', amount: 1199, due: '24 Jun', status: 'overdue', daysLeft: -3 },
  { id: 'sb1', category: 'electricity', provider: 'BESCOM', icon: 'bolt', tint: 'tint-warning', consumerId: '••4471', nick: 'Home electricity', amount: 1840, due: '30 Jun', status: 'due', daysLeft: 2 },
  { id: 'sb4', category: 'creditcard', provider: 'HDFC Credit Card', icon: 'card', tint: 'tint-neutral', consumerId: '••6042', nick: 'HDFC Regalia', amount: 24500, due: '5 Jul', status: 'due', daysLeft: 10 },
  { id: 'sb3', category: 'dth', provider: 'Tata Play', icon: 'tv', tint: 'tint-primary', consumerId: '••2096', nick: 'Living room', amount: 399, due: '2 Jul', status: 'autopay', daysLeft: 7 },
  { id: 'sb5', category: 'fastag', provider: 'HDFC FASTag', icon: 'car', tint: 'tint-primary', consumerId: '••KA01', nick: 'Car · KA01', amount: 0, status: 'paid', balance: 560 },
];

/* profile / settings data */
const UPI_IDS = [
  { id: 'u1', vpa: 'aarav@fyscal', primary: true, bank: 'HDFC Bank ••6042' },
  { id: 'u2', vpa: 'aarav.mehta@fyscal', primary: false, bank: 'HDFC Bank ••6042' },
  { id: 'u3', vpa: '9876543210@fyscal', primary: false, bank: 'ICICI Bank ••9931' },
];
const DEVICES = [
  { id: 'd1', name: 'iPhone 15 Pro', os: 'iOS 18.2 · Fyscal app', loc: 'Bengaluru, IN', active: 'Active now', current: true },
  { id: 'd2', name: 'iPad Air', os: 'iPadOS · Fyscal app', loc: 'Bengaluru, IN', active: '2 days ago' },
  { id: 'd3', name: 'Chrome on Mac', os: 'Fyscal for Web', loc: 'Mumbai, IN', active: '12 Jun, 6:40 PM' },
];
const LANGUAGES = [
  { id: 'en', label: 'English', native: 'English' }, { id: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { id: 'bn', label: 'Bengali', native: 'বাংলা' }, { id: 'te', label: 'Telugu', native: 'తెలుగు' },
  { id: 'mr', label: 'Marathi', native: 'मराठी' }, { id: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { id: 'gu', label: 'Gujarati', native: 'ગુજરાતી' }, { id: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { id: 'ml', label: 'Malayalam', native: 'മലയാളം' }, { id: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
];
const HELP_TOPICS = [
  { id: 'h1', icon: 'send', label: 'Payments & transfers' },
  { id: 'h2', icon: 'refresh', label: 'Refunds & disputes' },
  { id: 'h3', icon: 'idcard', label: 'KYC & account' },
  { id: 'h4', icon: 'shield', label: 'Security & fraud' },
  { id: 'h5', icon: 'bills', label: 'Bills & recharges' },
  { id: 'h6', icon: 'gift', label: 'Rewards & offers' },
];
const HELP_FAQS = [
  { q: 'Money was debited but the payment failed', a: 'Don’t worry — failed-payment debits are auto-reversed by your bank, usually within 48 hours. You can track it under the transaction’s refund timeline.' },
  { q: 'How do I reset my UPI PIN?', a: 'Go to Profile → Security & privacy → Change UPI PIN. You’ll need your debit card details to set a new one with your bank.' },
  { q: 'Is there a limit on UPI payments?', a: 'UPI allows up to ₹1,00,000 per day across apps. Some banks set lower limits for new payees in the first 24 hours.' },
  { q: 'How do I remove a linked device?', a: 'Go to Profile → Linked devices, tap the device, and choose Remove. That device will be signed out immediately.' },
];
const COMPLAINT_CATS = ['Failed transaction', 'Money debited, not received', 'Unauthorised transaction', 'KYC or account issue', 'App not working', 'Something else'];

/* rewards & cashback ecosystem */
const REWARDS = {
  coins: 1875, cashbackMonth: 240, streak: 5,
  scratchCards: [
    { id: 'sc1', state: 'new', from: 'Swiggy payment', sub: '₹476 · Today', reward: { type: 'cashback', value: 35 } },
    { id: 'sc2', state: 'new', from: 'Electricity bill', sub: '₹1,840 · Today', reward: { type: 'coins', value: 50 } },
    { id: 'sc3', state: 'scratched', from: 'Mobile recharge', sub: 'Yesterday', reward: { type: 'cashback', value: 12 } },
    { id: 'sc4', state: 'scratched', from: 'Amazon Pay', sub: '22 Jun', reward: { type: 'coins', value: 25 } },
    { id: 'sc5', state: 'expired', from: 'BigBasket payment', sub: 'Expired 18 Jun', reward: null },
  ],
  cashbackFeed: [
    { id: 'cb1', brand: 'Swiggy', icon: 'cup', tint: 'tint-warning', desc: 'Cashback on food order', amount: 35, when: 'Today, 2:10 PM', status: 'credited' },
    { id: 'cb2', brand: 'Electricity bill', icon: 'bolt', tint: 'tint-warning', desc: 'On-time bill payment reward', amount: 15, when: 'Yesterday', status: 'credited' },
    { id: 'cb3', brand: 'Referral · Rahul V', icon: 'gift', tint: 'tint-success', desc: 'Your friend’s first payment', amount: 50, when: '23 Jun', status: 'credited' },
    { id: 'cb4', brand: 'Mobile recharge', icon: 'phone', tint: 'tint-primary', desc: 'Crediting within 24 hours', amount: 12, when: 'Today', status: 'pending' },
  ],
  referral: { code: 'AARAV50', invited: 3, joined: 2, earned: 100, perReferral: 50 },
};

/* support — tickets & call slots */
const TICKETS = [
  { id: 'FYD482190', subject: 'Money debited, payment failed', ref: '₹800 to Vikram Nair', category: 'Failed transaction', status: 'in-progress', created: 'Today, 3:10 PM', updated: 'Auto-reversal initiated by bank', step: 1 },
  { id: 'FYD556621', subject: 'Didn’t recognise a transaction', ref: '₹2,199 · Amazon Pay', category: 'Security', status: 'escalated', created: '20 Jun, 1:30 PM', updated: 'Escalated to your bank’s team', step: 2 },
  { id: 'FYC771204', subject: 'Cashback not received', ref: 'Swiggy · ₹476', category: 'Rewards', status: 'resolved', created: '22 Jun', updated: '₹35 cashback credited', step: 3 },
];
const TICKET_LIFECYCLE = ['Raised', 'Under review', 'Action taken', 'Resolved'];
const CALL_SLOTS = ['Today, 5:00 PM', 'Today, 6:30 PM', 'Tomorrow, 10:00 AM', 'Tomorrow, 12:30 PM', 'Tomorrow, 4:00 PM'];

/* UPI-powered card ecosystem */
const CARD = {
  issued: true,
  variant: 'graphite',
  bank: 'Federal Bank', network: 'RuPay',
  number: '4291', expiry: '09/29', holder: 'AARAV MEHTA',
  spendLimit: 100000, spentMonth: 38420,
  frozen: false,
  controls: { online: true, contactless: true, atm: false, intl: false },
  tier: 'Core',
  variants: [
    { id: 'graphite', name: 'Midnight Graphite', sub: 'Matte titanium', bg: 'linear-gradient(150deg,#33343c,#0e0e13)', accent: '#cfd2dc', ink: '#fff', tier: 'Core', sheen: 'rgba(255,255,255,.14)' },
    { id: 'titanium', name: 'Titanium Black', sub: 'Brushed metal', bg: 'linear-gradient(150deg,#23242b,#08080b)', accent: '#9da3b4', ink: '#fff', tier: 'Core', sheen: 'rgba(180,190,220,.22)' },
    { id: 'lime', name: 'Electric Lime', sub: 'Accent edition', bg: 'linear-gradient(150deg,#16170f,#1d2410)', accent: '#c6ff4d', ink: '#fff', tier: 'Premium', sheen: 'rgba(198,255,77,.26)' },
    { id: 'frost', name: 'Frost White', sub: 'Ceramic finish', bg: 'linear-gradient(150deg,#f4f5f8,#d3d6e0)', accent: '#2b2b30', ink: '#16181f', tier: 'Premium', sheen: 'rgba(255,255,255,.7)' },
    { id: 'elite', name: 'Elite Metal', sub: 'Stainless steel', bg: 'linear-gradient(150deg,#5a5e6b,#2a2c34)', accent: '#e7e9f0', ink: '#fff', tier: 'Elite', sheen: 'rgba(255,255,255,.4)' },
    { id: 'limited', name: 'Limited Edition', sub: 'Invite only', bg: 'linear-gradient(150deg,#1a1340,#3a1d6e)', accent: '#c9a7ff', ink: '#fff', tier: 'Invite', sheen: 'rgba(201,167,255,.3)' },
  ],
  txns: [
    { id: 'c1', name: 'Apple Services', cat: 'Subscriptions', icon: 'sparkle', amount: -149, when: 'Today', card: true },
    { id: 'c2', name: 'Blue Tokai Coffee', cat: 'Food & Drink', icon: 'cup', amount: -420, when: 'Today', card: true },
    { id: 'c3', name: 'Uber', cat: 'Travel', icon: 'car', amount: -286, when: 'Yesterday', card: true },
    { id: 'c4', name: 'Cashback earned', cat: 'Reward', icon: 'gift', amount: 38, when: 'Yesterday', card: true, credit: true },
    { id: 'c5', name: 'Myntra', cat: 'Shopping', icon: 'cart', amount: -2480, when: '23 Jun', card: true },
  ],
  subscriptions: [
    { id: 's1', name: 'Netflix', amount: 649, cycle: 'Monthly · 28 Jun', icon: 'tv', tint: 'tint-warning' },
    { id: 's2', name: 'Spotify', amount: 119, cycle: 'Monthly · 2 Jul', icon: 'sparkle', tint: 'tint-success' },
    { id: 's3', name: 'iCloud+', amount: 75, cycle: 'Monthly · 5 Jul', icon: 'card', tint: 'tint-primary' },
  ],
  vault: [
    { id: 'v1', brand: 'MakeMyTrip', title: '₹1,500 off flights', tier: 'Unlocked', state: 'open' },
    { id: 'v2', brand: 'Cult.fit', title: '3 months free', tier: 'Spend ₹10k more', state: 'locked' },
    { id: 'v3', brand: 'Amazon', title: '₹500 voucher', tier: 'Mystery drop', state: 'mystery' },
  ],
};

window.DATA = { USER, BANKS, SELF_ACCOUNTS, KNOWN_MERCHANTS, PAYEES, TXNS, CATEGORIES, STATEMENTS, DISPUTE_REASONS, RECHARGE_PLANS, BILLERS, BILL_CATEGORIES, PROVIDERS, SAVED_BILLERS, SUGGESTIONS, OFFERS, FINANCE, NOTIFS, NOTIF_FILTERS, BANK_DIR, FOUND_ACCOUNTS, KYC, UPI_IDS, DEVICES, LANGUAGES, HELP_TOPICS, HELP_FAQS, COMPLAINT_CATS, REWARDS, TICKETS, TICKET_LIFECYCLE, CALL_SLOTS, CARD };
