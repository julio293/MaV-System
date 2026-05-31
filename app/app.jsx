/* ══════════════════════════════════════════════════════════════════════════
   App shell + router — stack navigation, transitions, status-bar tone,
   toast host, persistence.
   ══════════════════════════════════════════════════════════════════════════ */

const SCREENS = {
  splash: () => OnboardScreens.Splash,
  onboarding: () => AuthScreens.Onboarding,
  login: () => AuthScreens.Login,
  permissions: () => OnboardScreens.Permissions,
  simdetect: () => OnboardScreens.SimDetect,
  deviceverify: () => OnboardScreens.DeviceVerify,
  otp: () => AuthScreens.Otp,
  biometric: () => OnboardScreens.Biometric,
  mpin: () => OnboardScreens.Mpin,
  email: () => OnboardScreens.EmailLink,
  referral: () => OnboardScreens.Referral,
  allset: () => OnboardScreens.AllSet,
  setpin: () => AuthScreens.SetPin,
  home: () => HomeScreens.Home,
  send: () => SendScreens.Send,
  verifypayee: () => SendScreens.VerifyPayee,
  bankxfer: () => SendScreens.BankTransfer,
  self: () => SendScreens.SelfTransfer,
  amount: () => PayScreens.Amount,
  pay: () => PayScreens.PayFlow,
  receipt: () => PayScreens.Receipt,
  receive: () => PayScreens.Receive,
  addmoney: () => PayScreens.AddMoney,
  scan: () => ScanScreens.Scan,
  bills: () => BillScreens.Bills,
  billcat: () => BillScreens.BillCategory,
  biller: () => BillScreens.Biller,
  autopay: () => BillScreens.AutoPay,
  recharge: () => BillScreens.Recharge,
  history: () => HistoryScreens.History,
  txn: () => HistoryScreens.TxnDetail,
  statements: () => HistoryScreens.Statements,
  dispute: () => HistoryScreens.Dispute,
  kyc: () => KycScreens.KycFlow,
  profile: () => ProfileScreens.Profile,
  editprofile: () => ProfileScreens.EditProfile,
  upiids: () => ProfileScreens.UpiIds,
  banks: () => ProfileScreens.BankAccounts,
  settings: () => ProfileScreens.Settings,
  devices: () => ProfileScreens.Devices,
  notifications: () => ProfileScreens.Notifications,
  language: () => ProfileScreens.Language,
  appearance: () => ProfileScreens.Appearance,
  changepin: () => ProfileScreens.ChangeMpin,
  help: () => ProfileScreens.Help,
  complaint: () => ProfileScreens.Complaint,
  privacy: () => ProfileScreens.Privacy,
  rewards: () => RewardScreens.Rewards,
  scratch: () => RewardScreens.ScratchReveal,
  referrals: () => RewardScreens.Referrals,
  support: () => SupportScreens.Support,
  chat: () => SupportScreens.ChatSupport,
  tickets: () => SupportScreens.Tickets,
  ticket: () => SupportScreens.TicketDetail,
  callschedule: () => SupportScreens.CallSchedule,
  notif: () => HomeScreens.NotificationCenter,
  linkbank: () => LinkBankScreens.LinkBank,
  card: () => CardScreens.CardLanding,
  cardissue: () => CardScreens.CardIssuance,
  cardcontrols: () => CardScreens.CardControls,
  taptopay: () => CardScreens.TapToPay,
  cardstyle: () => CardScreens.CardStyle,
  vault: () => CardScreens.Vault,
};

// tab destinations replace the stack root; sub-screens push
const TABS = ['home', 'history', 'scan', 'bills', 'profile'];
const TONE = { scan: 'light', receive: 'light', splash: 'light', allset: 'light' };

// every cold start opens on the boot splash; it then routes to home or onboarding
const FLOW_VERSION = 'boot-1';
if (localStorage.getItem('fyscal-flow-v') !== FLOW_VERSION) {
  localStorage.setItem('fyscal-authed', '1');   // keep returning-user state for review
  localStorage.removeItem('fyscal-stack');
  localStorage.setItem('fyscal-flow-v', FLOW_VERSION);
}

// theme manager — light / dark / system, persisted, applied to <html data-theme>
function applyTheme(t) {
  const sys = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const dark = t === 'dark' || (t === 'system' && sys);
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
}
applyTheme(localStorage.getItem('fyscal-theme') || 'light');

function App() {
  const [authed, setAuthed] = useState(() => localStorage.getItem('fyscal-authed') === '1');
  const [theme, setThemeState] = useState(() => localStorage.getItem('fyscal-theme') || 'light');
  const setTheme = (t) => { localStorage.setItem('fyscal-theme', t); setThemeState(t); applyTheme(t); fx && fx.tap && fx.tap(); };
  useEffect(() => {
    const mq = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => { if ((localStorage.getItem('fyscal-theme') || 'light') === 'system') applyTheme('system'); };
    mq && mq.addEventListener && mq.addEventListener('change', onChange);
    return () => { mq && mq.removeEventListener && mq.removeEventListener('change', onChange); };
  }, []);
  const [stack, setStack] = useState([{ screen: 'splash', params: {} }]);   // always boot on splash
  const [tone, setTone] = useState('light');
  const { toasts, push } = useToasts();
  const top = stack[stack.length - 1];

  useEffect(() => { localStorage.setItem('fyscal-stack', JSON.stringify(stack)); }, [stack]);
  useEffect(() => { localStorage.setItem('fyscal-authed', authed ? '1' : '0'); }, [authed]);
  useEffect(() => { setTone(TONE[top.screen] || 'dark'); }, [top.screen]);

  const nav = {
    go: (screen, params = {}) => {
      if (TABS.includes(screen)) setStack([{ screen, params }]);      // tab switch resets stack
      else setStack((s) => [...s, { screen, params }]);
    },
    back: () => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s)),
    replace: (screen, params = {}) => setStack((s) => s.slice(0, -1).concat({ screen, params })),
    reset: (screen, params = {}) => setStack([{ screen, params }]),
  };
  const app = { toast: push, setAuthed, setTone, authed };

  const Screen = (SCREENS[top.screen] || SCREENS.home)();

  return (
    <div className="device">
      <div className="device-screen">
        <div className="di" />
        <StatusBar tone={tone} />
        <ToastHost toasts={toasts} />
        <Screen key={stack.length + ':' + top.screen} nav={nav} params={top.params} app={app} />
        <div className={`home-ind ${tone === 'light' ? 'on-dark' : ''}`} />
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
