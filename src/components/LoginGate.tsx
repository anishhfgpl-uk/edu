import React, { useEffect, useState } from 'react';
import { Building2, LockKeyhole, LogIn, UserRound, GraduationCap } from 'lucide-react';

type AccountRole = 'admin' | 'teacher' | 'student' | 'parent';
export interface SchoolProfile {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  affiliation: string;
  session: string;
}

interface Account {
  id: string;
  password: string;
  name: string;
  role: AccountRole;
  active: boolean;
}

const PROFILE_KEY = 'edu_school_profile_v1';
const ACCOUNTS_KEY = 'edu_accounts_v1';
const SESSION_KEY = 'edu_session_v1';

const defaultProfile: SchoolProfile = {
  name: 'Educate Portal School',
  address: 'School Address, City, State',
  phone: '+91 00000 00000',
  email: 'school@example.com',
  website: 'https://anish-tech.online/edu',
  affiliation: 'CBSE',
  session: '2026–2027',
};

const defaultAccounts: Account[] = [
  { id: 'admin001', password: 'Admin@123', name: 'School Administrator', role: 'admin', active: true },
  { id: 'teacher001', password: 'Teacher@123', name: 'Sunita Verma', role: 'teacher', active: true },
  { id: 'student001', password: 'Student@123', name: 'Aarav Sharma', role: 'student', active: true },
  { id: 'parent001', password: 'Parent@123', name: 'Aarav Parent', role: 'parent', active: true },
];

export function getSchoolProfile(): SchoolProfile {
  try { return JSON.parse(localStorage.getItem(PROFILE_KEY) || '') || defaultProfile; } catch { return defaultProfile; }
}

export function saveSchoolProfile(profile: SchoolProfile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function getAccounts(): Account[] {
  try { return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '') || defaultAccounts; } catch { return defaultAccounts; }
}

export function saveAccounts(accounts: Account[]) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

export default function LoginGate({ children }: { children: (account: Account, profile: SchoolProfile, logout: () => void) => React.ReactNode }) {
  const [profile, setProfile] = useState<SchoolProfile>(getSchoolProfile());
  const [accounts, setAccounts] = useState<Account[]>(getAccounts());
  const [account, setAccount] = useState<Account | null>(() => {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); } catch { return null; }
  });
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { saveAccounts(accounts); }, [accounts]);

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    const found = accounts.find(a => a.active && a.id.toLowerCase() === userId.trim().toLowerCase() && a.password === password);
    if (!found) { setError('Invalid User ID or Password'); return; }
    localStorage.setItem(SESSION_KEY, JSON.stringify(found));
    setAccount(found);
    setError('');
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setAccount(null);
    setPassword('');
  };

  const roleLabel = (role: AccountRole) => role === 'admin' ? 'School Admin' : role[0].toUpperCase() + role.slice(1);

  if (account) return <>{children(account, profile, logout)}</>;

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
        <div className="bg-indigo-700 text-white p-8 md:p-12 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-2xl bg-white/15"><GraduationCap className="w-8 h-8" /></div>
              <div>
                <div className="text-xs uppercase tracking-widest text-indigo-200">School Management</div>
                <h1 className="text-2xl font-black">{profile.name}</h1>
              </div>
            </div>
            <div className="space-y-4 text-sm text-indigo-100">
              <p className="flex gap-2"><Building2 className="w-5 h-5 shrink-0" />{profile.address}</p>
              <p>📞 {profile.phone}</p>
              <p>✉ {profile.email}</p>
              <p>Affiliation: <strong>{profile.affiliation}</strong> • Session {profile.session}</p>
            </div>
          </div>
          <p className="mt-10 text-xs text-indigo-200">Secure role-based school portal</p>
        </div>
        <form onSubmit={login} className="p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-7">
            <div className="flex items-center gap-2 text-slate-500 text-sm font-bold"><LockKeyhole className="w-4 h-4" /> Portal Login</div>
            <h2 className="text-3xl font-black text-slate-900 mt-2">Sign in</h2>
            <p className="text-sm text-slate-500 mt-1">Use your school User ID and Password.</p>
          </div>
          <label className="text-sm font-bold text-slate-700 mb-2">User ID</label>
          <div className="relative mb-4"><UserRound className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" /><input value={userId} onChange={e=>setUserId(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Enter User ID" autoComplete="username" /></div>
          <label className="text-sm font-bold text-slate-700 mb-2">Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-indigo-500 mb-3" placeholder="Enter Password" autoComplete="current-password" />
          {error && <p className="text-sm font-semibold text-red-600 mb-3">{error}</p>}
          <button className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black flex items-center justify-center gap-2"><LogIn className="w-5 h-5" /> Login</button>
          <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
            <strong>Initial accounts</strong><br />
            Admin: <b>admin001</b> / <b>Admin@123</b> • Teacher: <b>teacher001</b> / <b>Teacher@123</b><br />
            Student: <b>student001</b> / <b>Student@123</b> • Parent: <b>parent001</b> / <b>Parent@123</b>
          </div>
        </form>
      </div>
    </div>
  );
}
