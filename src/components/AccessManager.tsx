import React, { useState } from 'react';
import { X, ShieldCheck, UserPlus, Trash2, Save, Building2 } from 'lucide-react';
import { Account, SchoolProfile, getAccounts, saveAccounts, saveSchoolProfile } from './LoginGate';

type PermissionKey = 'overview' | 'attendance' | 'homework' | 'classes' | 'bus' | 'results' | 'fees' | 'parent-updates' | 'alerts';

const permissionLabels: Record<PermissionKey, string> = {
  overview: 'Academic Profile',
  attendance: 'Attendance',
  homework: 'Homework',
  classes: 'Classes & Sections',
  bus: 'Bus Transport',
  results: 'Results / Marksheet',
  fees: 'Fees & Receipts',
  'parent-updates': 'Parent Portal',
  alerts: 'Send Alerts / Updates',
};

const allPermissions: PermissionKey[] = Object.keys(permissionLabels) as PermissionKey[];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  profile: SchoolProfile;
  onProfileChange: (profile: SchoolProfile) => void;
  onAccountsChange?: () => void;
}

export const AccessManager: React.FC<Props> = ({ isOpen, onClose, profile, onProfileChange, onAccountsChange }) => {
  const [accounts, setAccounts] = useState<Account[]>(getAccounts());
  const [selectedId, setSelectedId] = useState(accounts[0]?.id || '');
  const [localProfile, setLocalProfile] = useState(profile);

  if (!isOpen) return null;

  const selected = accounts.find(a => a.id === selectedId) || accounts[0];

  const updateAccount = (patch: Partial<Account>) => {
    if (!selected) return;
    const next = accounts.map(a => a.id === selected.id ? { ...a, ...patch } : a);
    setAccounts(next);
    saveAccounts(next);
    onAccountsChange?.();
  };

  const togglePermission = (permission: PermissionKey) => {
    if (!selected) return;
    const permissions = selected.permissions || [];
    const nextPermissions = permissions.includes(permission)
      ? permissions.filter(p => p !== permission)
      : [...permissions, permission];
    updateAccount({ permissions: nextPermissions });
  };

  const addUser = () => {
    const base = 'user' + String(Date.now()).slice(-5);
    const newAccount: Account = {
      id: base,
      password: 'ChangeMe@123',
      name: 'New User',
      role: 'teacher',
      active: true,
      permissions: ['overview', 'attendance', 'homework'],
    };
    const next = [...accounts, newAccount];
    setAccounts(next);
    saveAccounts(next);
    setSelectedId(newAccount.id);
    onAccountsChange?.();
  };

  const deleteUser = () => {
    if (!selected || selected.role === 'admin') return;
    const next = accounts.filter(a => a.id !== selected.id);
    setAccounts(next);
    saveAccounts(next);
    setSelectedId(next[0]?.id || '');
    onAccountsChange?.();
  };

  const saveProfile = () => {
    saveSchoolProfile(localProfile);
    onProfileChange(localProfile);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-6xl max-h-[92vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-700"><ShieldCheck className="w-5 h-5" /></div>
            <div>
              <h2 className="font-black text-lg text-slate-900">Admin Access & School Management</h2>
              <p className="text-xs text-slate-500">Admin decides exactly which user can see each portal module.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-auto p-6 space-y-6">
          <section className="border border-slate-200 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div><h3 className="font-black">School Profile</h3><p className="text-xs text-slate-500">This information appears on the login screen.</p></div>
              <Building2 className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {([
                ['name','School Name'],['address','Address'],['phone','Phone'],['email','Email'],
                ['website','Website'],['affiliation','Affiliation / Board'],['session','Academic Session']
              ] as const).map(([key,label]) => (
                <label key={key} className="text-xs font-bold text-slate-700">
                  {label}
                  <input value={localProfile[key]} onChange={e=>setLocalProfile({...localProfile,[key]:e.target.value})} className="mt-1 w-full p-2.5 rounded-xl border border-slate-300 font-normal" />
                </label>
              ))}
            </div>
            <button onClick={saveProfile} className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-bold flex items-center gap-2"><Save className="w-4 h-4"/> Save School Profile</button>
          </section>

          <section className="border border-slate-200 rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div><h3 className="font-black">User Accounts & Permissions</h3><p className="text-xs text-slate-500">Create users, change credentials, activate/deactivate accounts and set module access.</p></div>
              <div className="flex gap-2">
                <button onClick={addUser} className="px-3 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold flex items-center gap-2"><UserPlus className="w-4 h-4"/> Add User</button>
                <button onClick={deleteUser} disabled={!selected || selected.role === 'admin'} className="px-3 py-2 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold flex items-center gap-2 disabled:opacity-40"><Trash2 className="w-4 h-4"/> Delete</button>
              </div>
            </div>

            <div className="grid lg:grid-cols-[280px_1fr]">
              <div className="border-r border-slate-200 p-3 space-y-1">
                {accounts.map(a => (
                  <button key={a.id} onClick={()=>setSelectedId(a.id)} className={`w-full text-left p-3 rounded-xl ${selected?.id===a.id?'bg-indigo-50 border border-indigo-200':'hover:bg-slate-50'}`}>
                    <div className="font-bold text-sm">{a.name}</div>
                    <div className="text-[11px] text-slate-500">{a.id} • {a.role}</div>
                  </button>
                ))}
              </div>

              {selected && <div className="p-5">
                <div className="grid md:grid-cols-2 gap-3 mb-5">
                  <label className="text-xs font-bold">Name<input value={selected.name} onChange={e=>updateAccount({name:e.target.value})} className="mt-1 w-full p-2.5 rounded-xl border border-slate-300 font-normal"/></label>
                  <label className="text-xs font-bold">User ID<input value={selected.id} disabled={selected.role==='admin'} onChange={e=>updateAccount({id:e.target.value.trim()})} className="mt-1 w-full p-2.5 rounded-xl border border-slate-300 font-normal disabled:bg-slate-100"/></label>
                  <label className="text-xs font-bold">Password<input value={selected.password} onChange={e=>updateAccount({password:e.target.value})} className="mt-1 w-full p-2.5 rounded-xl border border-slate-300 font-normal"/></label>
                  <label className="text-xs font-bold">Role<select value={selected.role} onChange={e=>updateAccount({role:e.target.value as Account['role']})} className="mt-1 w-full p-2.5 rounded-xl border border-slate-300 font-normal"><option value="admin">Admin</option><option value="teacher">Teacher</option><option value="student">Student</option><option value="parent">Parent</option></select></label>
                </div>

                <label className="flex items-center gap-2 text-sm font-bold mb-5"><input type="checkbox" checked={selected.active} onChange={e=>updateAccount({active:e.target.checked})}/> Account Active</label>

                <h4 className="font-black text-sm mb-3">Allowed Modules</h4>
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-2">
                  {allPermissions.map(permission => {
                    const checked = (selected.permissions || []).includes(permission);
                    return <label key={permission} className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer ${checked?'border-indigo-300 bg-indigo-50':'border-slate-200'}`}>
                      <input type="checkbox" checked={checked} onChange={()=>togglePermission(permission)} />
                      <span className="text-xs font-semibold">{permissionLabels[permission]}</span>
                    </label>;
                  })}
                </div>
                {selected.role === 'admin' && <p className="mt-3 text-xs text-indigo-700 bg-indigo-50 p-3 rounded-xl">Admin accounts always retain full access and can manage school settings and user permissions.</p>}
              </div>}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
