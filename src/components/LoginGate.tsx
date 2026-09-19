import React, { useEffect, useState } from 'react';
import { Building2, LockKeyhole, LogIn, UserRound, GraduationCap } from 'lucide-react';

export type AccountRole = 'admin' | 'teacher' | 'student' | 'parent';
export type PermissionKey = 'overview' | 'attendance' | 'homework' | 'classes' | 'bus' | 'results' | 'fees' | 'parent-updates' | 'alerts';

export interface SchoolProfile {
  name: string; address: string; phone: string; email: string; website: string; affiliation: string; session: string;
}
export interface Account {
  id: string; password: string; name: string; role: AccountRole; active: boolean; permissions: PermissionKey[];
}

const PROFILE_KEY = 'edu_school_profile_v1';
const ACCOUNTS_KEY = 'edu_accounts_v1';

const defaultProfile: SchoolProfile = {
  name: 'Educate Portal School', address: 'School Address, City, State', phone: '+91 00000 00000',
  email: 'school@example.com', website: 'https://anish-tech.online/edu', affiliation: 'CBSE', session: '2026–2027',
};

const roleDefaults: Record<AccountRole, PermissionKey[]> = {
  admin: ['overview','attendance','homework','classes','bus','results','fees','parent-updates','alerts'],
  teacher: ['overview','attendance','homework','classes','bus','results','parent-updates','alerts'],
  student: ['overview','attendance','homework','bus','results','fees','parent-updates'],
  parent: ['overview','attendance','homework','bus','results','fees','parent-updates'],
};

const defaultAccounts: Account[] = [
  { id:'admin001', password:'Admin@123', name:'School Administrator', role:'admin', active:true, permissions:roleDefaults.admin },
  { id:'teacher001', password:'Teacher@123', name:'Sunita Verma', role:'teacher', active:true, permissions:roleDefaults.teacher },
  { id:'student001', password:'Student@123', name:'Aarav Sharma', role:'student', active:true, permissions:roleDefaults.student },
  { id:'parent001', password:'Parent@123', name:'Aarav Parent', role:'parent', active:true, permissions:roleDefaults.parent },
];

export function getSchoolProfile(): SchoolProfile {
  try { return JSON.parse(localStorage.getItem(PROFILE_KEY) || '') || defaultProfile; } catch { return defaultProfile; }
}
export function saveSchoolProfile(profile: SchoolProfile) { localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)); }
export function getAccounts(): Account[] {
  try {
    const raw = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || 'null');
    if (Array.isArray(raw)) return raw.map((a: any) => ({...a, permissions: Array.isArray(a.permissions) ? a.permissions : roleDefaults[a.role as AccountRole] || []}));
  } catch {}
  return defaultAccounts;
}
export function saveAccounts(accounts: Account[]) { localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts)); }

export default function LoginGate({ children }: { children: (account: Account, profile: SchoolProfile, logout: () => void) => React.ReactNode }) {
  const [profile, setProfile] = useState(getSchoolProfile());
  const [accounts, setAccounts] = useState<Account[]>(getAccounts());
  // Deliberately no persisted session restore: every portal open requires User ID + Password.
  const [account, setAccount] = useState<Account | null>(null);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { saveAccounts(accounts); }, [accounts]);

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    const found = accounts.find(a => a.active && a.id.toLowerCase() === userId.trim().toLowerCase() && a.password === password);
    if (!found) { setError('Invalid User ID or Password'); return; }
    setAccount(found); setError('');
  };
  const logout = () => { setAccount(null); setPassword(''); setUserId(''); };

  if (account) return <>{children(account, profile, logout)}</>;

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
        <div className="bg-indigo-700 text-white p-8 md:p-12 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-2xl bg-white/15"><GraduationCap className="w-8 h-8" /></div>
              <div><div className="text-xs uppercase tracking-widest text-indigo-200">School Management</div><h1 className="text-2xl font-black">{profile.name}</h1></div>
            </div>
            <div className="space-y-4 text-sm text-indigo-100">
              <p className="flex gap-2"><Building2 className="w-5 h-5 shrink-0" />{profile.address}</p><p>📞 {profile.phone}</p><p>✉ {profile.email}</p>
              <p>Affiliation: <strong>{profile.affiliation}</strong> • Session {profile.session}</p>
            </div>
          </div>
          <p className="mt-10 text-xs text-indigo-200">Role-based school portal • Login required every time</p>
        </div>
        <form onSubmit={login} className="p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-7"><div className="flex items-center gap-2 text-slate-500 text-sm font-bold"><LockKeyhole className="w-4 h-4"/> Portal Login</div><h2 className="text-3xl font-black text-slate-900 mt-2">Sign in</h2><p className="text-sm text-slate-500 mt-1">Enter your school User ID and Password.</p></div>
          <label className="text-sm font-bold text-slate-700 mb-2">User ID</label>
          <div className="relative mb-4"><UserRound className="absolute left-3 top-3.5 w-5 h-5 text-slate-400"/><input value={userId} onChange={e=>setUserId(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Enter User ID" autoComplete="username"/></div>
          <label className="text-sm font-bold text-slate-700 mb-2">Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-indigo-500 mb-3" placeholder="Enter Password" autoComplete="current-password"/>
          {error && <p className="text-sm font-semibold text-red-600 mb-3">{error}</p>}
          <button className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black flex items-center justify-center gap-2"><LogIn className="w-5 h-5"/> Login</button>
          <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600"><strong>Initial accounts</strong><br/>Admin: <b>admin001</b> / <b>Admin@123</b> • Teacher: <b>teacher001</b> / <b>Teacher@123</b><br/>Student: <b>student001</b> / <b>Student@123</b> • Parent: <b>parent001</b> / <b>Parent@123</b></div>
        </form>
      </div>
    </div>
  );
}
