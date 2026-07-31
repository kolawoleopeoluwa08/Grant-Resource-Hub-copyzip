import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import {
  LogOut, FileText, Clock, CheckCircle2, XCircle, Eye,
  Search, ChevronDown, Loader2, AlertCircle, LayoutDashboard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

type Status = 'pending' | 'reviewing' | 'approved' | 'rejected';

interface Application {
  id: number;
  applicationId: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  institution: string;
  yearOfStudy: string;
  grantType: string;
  requestedAmount: number;
  gpa: number | null;
  annualIncome: number | null;
  description: string;
  paymentMethod: string | null;
  status: Status;
  submittedAt: string;
}

interface Stats {
  total: number;
  pending: number;
  reviewing: number;
  approved: number;
  rejected: number;
}

const grantLabels: Record<string, string> = {
  tuition_fees: 'Tuition & Fees',
  books_supplies: 'Books & Supplies',
  housing_meals: 'Housing & Meals',
  technology_equipment: 'Technology',
  research_fees: 'Research Fees',
  study_abroad: 'Study Abroad',
  general_education: 'General Education',
};

const yearLabels: Record<string, string> = {
  freshman: 'Freshman', sophomore: 'Sophomore', junior: 'Junior',
  senior: 'Senior', graduate: 'Graduate', doctorate: 'Doctorate',
};

const paymentLabels: Record<string, string> = {
  check: 'Check (mailed)', wire_transfer: 'Wire Transfer', moneygram: 'MoneyGram',
};

const statusConfig: Record<Status, { label: string; color: string }> = {
  pending:   { label: 'Pending',   color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  reviewing: { label: 'Reviewing', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  approved:  { label: 'Approved',  color: 'bg-green-100 text-green-800 border-green-200' },
  rejected:  { label: 'Rejected',  color: 'bg-red-100 text-red-800 border-red-200' },
};

function authHeaders() {
  const token = localStorage.getItem('admin_token');
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
}

function StatusBadge({ status }: { status: Status }) {
  const cfg = statusConfig[status] ?? { label: status, color: 'bg-gray-100 text-gray-800 border-gray-200' };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cfg.color}`}>
      {cfg.label}
    </span>
  );
}

export default function AdminDashboard() {
  const [_, setLocation] = useLocation();
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<Status | 'all'>('all');
  const [selected, setSelected] = useState<Application | null>(null);
  const [updating, setUpdating] = useState(false);

  const fetchData = useCallback(async () => {
    const token = localStorage.getItem('admin_token');
    if (!token) { setLocation('/admin/login'); return; }

    try {
      const [appRes, statsRes] = await Promise.all([
        fetch(`${BASE}/api/admin/applications`, { headers: authHeaders() }),
        fetch(`${BASE}/api/admin/stats`, { headers: authHeaders() }),
      ]);

      if (appRes.status === 401 || statsRes.status === 401) {
        localStorage.removeItem('admin_token');
        setLocation('/admin/login');
        return;
      }

      const [apps, st] = await Promise.all([appRes.json(), statsRes.json()]);
      setApplications(apps as Application[]);
      setStats(st as Stats);
    } catch {
      setError('Failed to load data. Please refresh.');
    } finally {
      setLoading(false);
    }
  }, [setLocation]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const logout = () => {
    localStorage.removeItem('admin_token');
    setLocation('/admin/login');
  };

  const updateStatus = async (id: number, status: Status) => {
    setUpdating(true);
    try {
      const res = await fetch(`${BASE}/api/admin/applications/${id}/status`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Update failed');
      setApplications((prev) => prev.map((a) => a.id === id ? { ...a, status } : a));
      if (selected?.id === id) setSelected((s) => s ? { ...s, status } : s);
      setStats((s) => {
        if (!s) return s;
        const old = applications.find((a) => a.id === id)?.status;
        if (!old || old === status) return s;
        const next = { ...s };
        next[old] = Math.max(0, next[old] - 1);
        next[status] = next[status] + 1;
        return next;
      });
    } catch {
      setError('Failed to update status.');
    } finally {
      setUpdating(false);
    }
  };

  const filtered = applications.filter((a) => {
    const matchSearch = search === '' || [a.firstName, a.lastName, a.email, a.applicationId ?? '']
      .some((v) => v.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = filterStatus === 'all' || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <LayoutDashboard className="h-5 w-5 text-secondary" />
          <span className="font-serif font-bold text-lg">Grant Resource Hub</span>
          <span className="text-primary-foreground/50 text-sm hidden sm:block">— Admin Dashboard</span>
        </div>
        <Button variant="outline" size="sm" onClick={logout}
          className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
          <LogOut className="h-4 w-4 mr-1.5" /> Logout
        </Button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg p-3 flex items-center gap-2 text-sm">
            <AlertCircle className="h-4 w-4 shrink-0" /> {error}
            <button className="ml-auto underline text-xs" onClick={() => setError(null)}>Dismiss</button>
          </div>
        )}

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { label: 'Total', value: stats.total, icon: FileText, color: 'text-primary', bg: 'bg-primary/10' },
              { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
              { label: 'Reviewing', value: stats.reviewing, icon: Eye, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Approved', value: stats.approved, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
              { label: 'Rejected', value: stats.rejected, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
            ].map(({ label, value, icon: Icon, color, bg }) => (
              <motion.div key={label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-xl p-5 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{value}</div>
                  <div className="text-xs text-muted-foreground">{label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          {/* Filters */}
          <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email or ID…"
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {(['all', 'pending', 'reviewing', 'approved', 'rejected'] as const).map((s) => (
                <button key={s} onClick={() => setFilterStatus(s)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    filterStatus === s
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}>
                  {s === 'all' ? 'All' : statusConfig[s].label}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  {['Applicant', 'Email', 'Grant Category', 'Amount', 'Status', 'Submitted', ''].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                      No applications found
                    </td>
                  </tr>
                ) : filtered.map((app) => (
                  <tr key={app.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground">{app.firstName} {app.lastName}</div>
                      {app.applicationId && (
                        <div className="text-xs text-muted-foreground font-mono">{app.applicationId}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{app.email}</td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{grantLabels[app.grantType] ?? app.grantType}</td>
                    <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">
                      ${app.requestedAmount.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={app.status} /></td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {new Date(app.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3">
                      <Button variant="outline" size="sm" onClick={() => setSelected(app)}>
                        <Eye className="h-3.5 w-3.5 mr-1" /> View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto"
          onClick={(e) => { if (e.target === e.currentTarget) setSelected(null); }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl my-8"
          >
            <div className="bg-primary text-primary-foreground px-6 py-5 rounded-t-2xl flex items-start justify-between">
              <div>
                <h2 className="text-xl font-serif font-bold">{selected.firstName} {selected.lastName}</h2>
                {selected.applicationId && (
                  <p className="text-primary-foreground/70 text-sm font-mono mt-0.5">{selected.applicationId}</p>
                )}
              </div>
              <button onClick={() => setSelected(null)}
                className="text-primary-foreground/70 hover:text-primary-foreground text-2xl leading-none">×</button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status change */}
              <div className="bg-muted/50 rounded-xl p-4 flex items-center gap-4 flex-wrap">
                <div className="flex-1">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Current Status</div>
                  <StatusBadge status={selected.status} />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {(['pending', 'reviewing', 'approved', 'rejected'] as Status[]).map((s) => (
                    <button key={s} disabled={updating || selected.status === s}
                      onClick={() => updateStatus(selected.id, s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        selected.status === s
                          ? 'opacity-40 cursor-default bg-muted text-muted-foreground'
                          : `${statusConfig[s].color} border hover:opacity-90 cursor-pointer`
                      }`}>
                      {updating ? <Loader2 className="h-3 w-3 animate-spin inline" /> : statusConfig[s].label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                {[
                  { label: 'Email', value: selected.email },
                  { label: 'Phone', value: selected.phone },
                  { label: 'Address', value: selected.address },
                  { label: 'Institution', value: selected.institution },
                  { label: 'Year of Study', value: yearLabels[selected.yearOfStudy] ?? selected.yearOfStudy },
                  { label: 'GPA', value: selected.gpa != null ? `${selected.gpa.toFixed(2)} / 4.0` : '—' },
                  { label: 'Grant Category', value: grantLabels[selected.grantType] ?? selected.grantType },
                  { label: 'Requested Amount', value: `$${selected.requestedAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}` },
                  { label: 'Annual Income', value: selected.annualIncome != null ? `$${selected.annualIncome.toLocaleString()}` : '—' },
                  { label: 'Payment Method', value: selected.paymentMethod ? (paymentLabels[selected.paymentMethod] ?? selected.paymentMethod) : '—' },
                  { label: 'Submitted', value: new Date(selected.submittedAt).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' }) },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-muted/30 rounded-lg p-3">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">{label}</div>
                    <div className="font-medium text-foreground break-words">{value}</div>
                  </div>
                ))}
              </div>

              <div className="bg-muted/30 rounded-lg p-4">
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Statement of Need</div>
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{selected.description}</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
