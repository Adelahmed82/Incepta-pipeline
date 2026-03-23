'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/supabase';

// ─── Login Screen ───
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [signupDone, setSignupDone] = useState(false);

  const handleSubmit = async () => {
    setError(''); setLoading(true);
    if (mode === 'signup') {
      const { data, error: err } = await supabase.auth.signUp({ email, password });
      if (err) { setError(err.message); setLoading(false); return; }
      // Link auth user to partners table
      if (data?.user) {
        await supabase.from('partners').update({ auth_id: data.user.id }).eq('email', email.toLowerCase());
      }
      setSignupDone(true); setLoading(false);
    } else {
      const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) { setError(err.message === 'Invalid login credentials' ? 'البريد أو كلمة السر غير صحيحة' : err.message); setLoading(false); return; }
      if (data?.user) onLogin(data.user);
    }
  };

  if (signupDone) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #0f4c5c 100%)', direction: 'rtl', fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 32, width: 380, maxWidth: '90vw', textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>✓</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#059669', marginBottom: 8 }}>تم إنشاء الحساب</div>
        <div style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>تحقق من بريدك الإلكتروني لتأكيد الحساب، ثم سجّل الدخول.</div>
        <button onClick={() => { setMode('login'); setSignupDone(false); setPassword(''); }} style={{ padding: '10px 24px', background: '#1e3a5f', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>تسجيل الدخول</button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #0f4c5c 100%)', direction: 'rtl', fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 32, width: 380, maxWidth: '90vw', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: '#0f172a', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 22, marginBottom: 12 }}>I</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>INCEPTA</div>
          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>{mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}</div>
        </div>

        {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#dc2626', marginBottom: 12 }}>{error}</div>}

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: '#475569' }}>البريد الإلكتروني</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 13, fontFamily: 'inherit', boxSizing: 'border-box', direction: 'ltr' }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: '#475569' }}>كلمة السر</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={mode === 'signup' ? '6 أحرف على الأقل' : '••••••'} onKeyDown={e => e.key === 'Enter' && handleSubmit()} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 13, fontFamily: 'inherit', boxSizing: 'border-box', direction: 'ltr' }} />
        </div>

        <button onClick={handleSubmit} disabled={loading || !email || !password} style={{ width: '100%', padding: '10px', background: loading ? '#94a3b8' : '#1e3a5f', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: loading ? 'wait' : 'pointer', fontFamily: 'inherit', marginBottom: 12 }}>
          {loading ? 'جاري...' : mode === 'login' ? 'دخول' : 'إنشاء حساب'}
        </button>

        <div style={{ textAlign: 'center', fontSize: 12, color: '#64748b' }}>
          {mode === 'login' ? (
            <span>ليس لديك حساب؟ <button onClick={() => { setMode('signup'); setError(''); }} style={{ background: 'none', border: 'none', color: '#1e3a5f', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', fontSize: 12 }}>إنشاء حساب</button></span>
          ) : (
            <span>لديك حساب؟ <button onClick={() => { setMode('login'); setError(''); }} style={{ background: 'none', border: 'none', color: '#1e3a5f', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', fontSize: 12 }}>تسجيل الدخول</button></span>
          )}
        </div>

        {mode === 'signup' && <div style={{ marginTop: 16, padding: '10px 12px', background: '#f8fafc', borderRadius: 8, fontSize: 11, color: '#64748b' }}>
          استخدم نفس البريد المسجل في النظام: adel.ahmed@aucegypt.edu أو arawad80@gmail.com أو mahmoud.dhs@gmail.com
        </div>}
      </div>
    </div>
  );
}

const PARTNERS_STATIC = [
  { id: null, slug: 'adel', name: 'د. عادل أحمد', specialty: 'سياسات وحوكمة', color: '#1e3a5f', role: 'admin' },
  { id: null, slug: 'ahmed', name: 'أحمد عوض', specialty: 'متابعة وتقييم', color: '#0d6e56', role: 'partner' },
  { id: null, slug: 'mahmoud', name: 'محمود شحاتة', specialty: 'بحوث ميدانية', color: '#92600a', role: 'partner' },
];

const OPP_STATUSES = [
  { v: 'identified', l: 'تم التحديد', c: '#6b7280' },
  { v: 'evaluating', l: 'قيد التقييم', c: '#7c3aed' },
  { v: 'writing', l: 'قيد الكتابة', c: '#2563eb' },
  { v: 'submitted', l: 'تم التقديم', c: '#d97706' },
  { v: 'won', l: 'ترسية', c: '#059669' },
  { v: 'lost', l: 'لم يتم', c: '#dc2626' },
  { v: 'cancelled', l: 'ملغاة', c: '#9ca3af' },
];

const TASK_STATUSES = [
  { v: 'pending', l: 'معلق', c: '#9ca3af' },
  { v: 'in_progress', l: 'جاري', c: '#2563eb' },
  { v: 'completed', l: 'مكتمل', c: '#059669' },
  { v: 'overdue', l: 'متأخر', c: '#dc2626' },
];

const PROJECT_PHASES = [
  { v: 'planning', l: 'تخطيط', c: '#7c3aed' },
  { v: 'executing', l: 'تنفيذ', c: '#2563eb' },
  { v: 'monitoring', l: 'متابعة', c: '#d97706' },
  { v: 'closing', l: 'إغلاق', c: '#059669' },
];

const SERVICE_AREAS = ['السياسات العامة والحوكمة', 'التعليم الفني', 'المتابعة والتقييم', 'البحوث الاجتماعية', 'النظم الصحية', 'تنمية الشباب وبناء القدرات'];
const CLIENT_TYPES = ['دولية', 'حكومية', 'محلية', 'منظمة أهلية'];

const fmtDate = d => d ? new Date(d + 'T00:00:00').toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' }) : '—';
const fmtMoney = v => v ? `$${Number(v).toLocaleString()}` : '$0';
const daysUntil = d => d ? Math.ceil((new Date(d + 'T00:00:00') - new Date()) / 864e5) : 999;

function prioLabel(s) {
  if (s >= 75) return { l: 'حرج', c: '#dc2626' };
  if (s >= 50) return { l: 'عالي', c: '#d97706' };
  if (s >= 25) return { l: 'متوسط', c: '#2563eb' };
  return { l: 'منخفض', c: '#6b7280' };
}

// Styles
const S = {
  card: { background: '#fff', borderRadius: 10, border: '1px solid #e2e8f0', padding: 14, marginBottom: 10 },
  badge: c => ({ display: 'inline-block', fontSize: 10, padding: '2px 8px', borderRadius: 10, background: c + '15', color: c, fontWeight: 700 }),
  input: { width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 12, fontFamily: 'inherit', boxSizing: 'border-box' },
  btnP: { padding: '7px 16px', background: '#1e3a5f', color: '#fff', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
  btnS: { padding: '6px 12px', background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' },
  btnD: { padding: '4px 8px', background: 'none', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 4, fontSize: 10, cursor: 'pointer', fontFamily: 'inherit' },
  sel: c => ({ padding: '4px 6px', borderRadius: 5, border: `1px solid ${c}40`, background: c + '12', color: c, fontSize: 10, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer' }),
  stat: { background: '#fff', borderRadius: 10, border: '1px solid #e2e8f0', padding: '12px 14px', flex: '1 1 130px', minWidth: 120 },
};

function Modal({ open, onClose, title, children, wide }) {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', padding: 12 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 12, width: wide ? 680 : 520, maxWidth: '96vw', maxHeight: '88vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#94a3b8' }}>×</button>
        </div>
        <div style={{ padding: 16 }}>{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return <div style={{ marginBottom: 10 }}><label style={{ display: 'block', fontSize: 11, fontWeight: 600, marginBottom: 3, color: '#64748b' }}>{label}</label>{children}</div>;
}

export default function InceptaApp() {
  const [authUser, setAuthUser] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [partners, setPartners] = useState([]);
  const [opps, setOpps] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [deliverables, setDeliverables] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [auditLog, setAuditLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('dashboard');
  const [modal, setModal] = useState(null);
  const [editing, setEditing] = useState(null);
  const [currentPartnerId, setCurrentPartnerId] = useState(null);
  const [toast, setToast] = useState('');

  const flash = msg => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  // ─── Auth check on mount ───
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthUser(session?.user || null);
      setAuthChecking(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthUser(session?.user || null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setAuthUser(null);
  };

  // ─── Show login if not authenticated ───
  if (authChecking) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontSize: 14, direction: 'rtl' }}>جاري التحقق...</div>;
  if (!authUser) return <LoginScreen onLogin={user => setAuthUser(user)} />;

  // ─── Load all data ───
  const loadAll = useCallback(async () => {
    const [p, o, t, c, pr, d, e, a] = await Promise.all([
      supabase.from('partners').select('*').order('created_at'),
      supabase.from('opportunities').select('*').order('priority_score', { ascending: false }),
      supabase.from('tasks').select('*').order('created_at', { ascending: false }),
      supabase.from('clients').select('*').order('name'),
      supabase.from('projects').select('*').order('created_at', { ascending: false }),
      supabase.from('deliverables').select('*').order('due_date'),
      supabase.from('expenses').select('*').order('expense_date', { ascending: false }),
      supabase.from('audit_log').select('*').order('created_at', { ascending: false }).limit(100),
    ]);
    setPartners(p.data || []);
    setOpps(o.data || []);
    setTasks(t.data || []);
    setClients(c.data || []);
    setProjects(pr.data || []);
    setDeliverables(d.data || []);
    setExpenses(e.data || []);
    setAuditLog(a.data || []);
    if (p.data?.length > 0 && !currentPartnerId) {
      // Auto-match logged-in user email to partner
      const matched = p.data.find(x => x.email?.toLowerCase() === authUser?.email?.toLowerCase());
      setCurrentPartnerId(matched?.id || p.data[0].id);
    }
    setLoading(false);
  }, [currentPartnerId, authUser]);

  useEffect(() => { loadAll(); }, []);

  // ─── Realtime subscriptions ───
  useEffect(() => {
    const channel = supabase.channel('all-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'opportunities' }, () => loadAll())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => loadAll())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => loadAll())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'clients' }, () => loadAll())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'deliverables' }, () => loadAll())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'expenses' }, () => loadAll())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [loadAll]);

  // ─── Audit helper ───
  const logAudit = async (action, table_name, record_id, old_value, new_value) => {
    await supabase.from('audit_log').insert({ partner_id: currentPartnerId, action, table_name, record_id, old_value, new_value });
  };

  // ─── CRUD: Opportunities ───
  const saveOpp = async (form) => {
    const isEdit = !!editing;
    const payload = {
      name: form.name, client_id: form.client_id || null, lead_partner_id: form.lead_partner_id,
      value: Number(form.value) || 0, deadline: form.deadline || null, status: form.status,
      service_area: form.service_area, win_probability: Number(form.win_probability) || 50,
      strategic_alignment: Number(form.strategic_alignment) || 3, drive_folder_url: form.drive_folder_url, notes: form.notes,
    };
    let result;
    if (isEdit) {
      result = await supabase.from('opportunities').update(payload).eq('id', editing.id).select().single();
      await logAudit('update', 'opportunities', editing.id, editing, result.data);
    } else {
      result = await supabase.from('opportunities').insert(payload).select().single();
      await logAudit('create', 'opportunities', result.data?.id, null, result.data);
    }
    // Auto-create project on won
    if (form.status === 'won' && (!isEdit || editing.status !== 'won') && result.data) {
      const existing = projects.find(p => p.opportunity_id === result.data.id);
      if (!existing) {
        await supabase.from('projects').insert({ opportunity_id: result.data.id, name: form.name, budget: Number(form.value) || 0, drive_folder_url: form.drive_folder_url });
        flash('تم إنشاء مشروع جديد تلقائيًا');
      }
    }
    await loadAll();
    setModal(null); setEditing(null);
    flash(isEdit ? 'تم تحديث المناقصة' : 'تم إضافة المناقصة');
  };

  const deleteOpp = async (id) => {
    if (!confirm('حذف هذه المناقصة والمهام المرتبطة بها؟')) return;
    await supabase.from('tasks').delete().eq('opportunity_id', id);
    await supabase.from('opportunities').delete().eq('id', id);
    await logAudit('delete', 'opportunities', id, null, null);
    await loadAll();
  };

  const updateOppStatus = async (id, status) => {
    await supabase.from('opportunities').update({ status }).eq('id', id);
    // Auto-create project
    if (status === 'won') {
      const opp = opps.find(o => o.id === id);
      const existing = projects.find(p => p.opportunity_id === id);
      if (!existing && opp) {
        await supabase.from('projects').insert({ opportunity_id: id, name: opp.name, budget: opp.value || 0, drive_folder_url: opp.drive_folder_url });
        flash('تم إنشاء مشروع تلقائيًا');
      }
    }
    await logAudit('update', 'opportunities', id, null, { status });
    await loadAll();
  };

  // ─── CRUD: Tasks ───
  const saveTask = async (form) => {
    const isEdit = !!editing;
    const payload = {
      title: form.title, description: form.description, opportunity_id: form.opportunity_id || null,
      project_id: form.project_id || null, assignee_id: form.assignee_id, status: form.status,
      due_date: form.due_date || null, completed_at: form.status === 'completed' ? new Date().toISOString() : null,
    };
    if (isEdit) {
      await supabase.from('tasks').update(payload).eq('id', editing.id);
    } else {
      await supabase.from('tasks').insert(payload);
    }
    await loadAll(); setModal(null); setEditing(null);
  };

  const deleteTask = async (id) => {
    await supabase.from('tasks').delete().eq('id', id);
    await loadAll();
  };

  const updateTaskStatus = async (id, status) => {
    await supabase.from('tasks').update({ status, completed_at: status === 'completed' ? new Date().toISOString() : null }).eq('id', id);
    await loadAll();
  };

  // ─── CRUD: Clients ───
  const saveClient = async (form) => {
    const isEdit = !!editing;
    const payload = { name: form.name, type: form.type, contact_person: form.contact_person, email: form.email, notes: form.notes };
    if (isEdit) { await supabase.from('clients').update(payload).eq('id', editing.id); }
    else { await supabase.from('clients').insert(payload); }
    await loadAll(); setModal(null); setEditing(null);
  };

  // ─── CRUD: Projects ───
  const saveProject = async (form) => {
    const payload = { name: form.name, budget: Number(form.budget) || 0, start_date: form.start_date || null, end_date: form.end_date || null, phase: form.phase, drive_folder_url: form.drive_folder_url };
    await supabase.from('projects').update(payload).eq('id', editing.id);
    await loadAll(); setModal(null); setEditing(null);
  };

  const updateProjectPhase = async (id, phase) => {
    await supabase.from('projects').update({ phase }).eq('id', id);
    await loadAll();
  };

  // ─── CRUD: Deliverables & Expenses ───
  const saveDeliverable = async (form) => {
    if (editing) { await supabase.from('deliverables').update(form).eq('id', editing.id); }
    else { await supabase.from('deliverables').insert(form); }
    await loadAll(); setModal(null); setEditing(null);
  };
  const saveExpense = async (form) => {
    await supabase.from('expenses').insert(form);
    await loadAll(); setModal(null); setEditing(null);
  };

  // ─── Computed ───
  const partner = id => partners.find(p => p.id === id);
  const partnerName = id => partner(id)?.name || '—';
  const partnerColor = id => partner(id)?.color || '#6b7280';
  const clientName = id => clients.find(c => c.id === id)?.name || '—';
  const currentPartner = partner(currentPartnerId);

  const activeOpps = opps.filter(o => !['won', 'lost', 'cancelled'].includes(o.status));
  const wonOpps = opps.filter(o => o.status === 'won');
  const decidedOpps = opps.filter(o => ['won', 'lost'].includes(o.status));
  const winRate = decidedOpps.length > 0 ? Math.round(wonOpps.length / decidedOpps.length * 100) : 0;
  const pendingTasks = tasks.filter(t => t.status !== 'completed');

  const alerts = useMemo(() => {
    const a = [];
    activeOpps.forEach(o => {
      const d = daysUntil(o.deadline);
      if (d >= 0 && d <= 3) a.push({ t: 'urgent', m: `${o.name} — الموعد بعد ${d} يوم` });
      else if (d < 0) a.push({ t: 'overdue', m: `${o.name} — تجاوز الموعد` });
    });
    tasks.filter(t => t.status !== 'completed' && daysUntil(t.due_date) < 0).forEach(t => {
      a.push({ t: 'overdue', m: `مهمة "${t.title}" متأخرة` });
    });
    return a;
  }, [opps, tasks]);

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontSize: 14 }}>جاري تحميل البيانات من Supabase...</div>;

  const tabs = [
    { id: 'dashboard', l: '◫ لوحة المتابعة' }, { id: 'opps', l: '◎ المناقصات' },
    { id: 'tasks', l: '☑ المهام' }, { id: 'projects', l: '▦ المشاريع' },
    { id: 'clients', l: '◉ العملاء' }, { id: 'audit', l: '◷ السجل' },
  ];

  return (
    <div style={{ minHeight: '100vh', fontSize: 13 }}>
      {toast && <div style={{ position: 'fixed', top: 8, left: '50%', transform: 'translateX(-50%)', zIndex: 2000, background: '#059669', color: '#fff', padding: '8px 20px', borderRadius: 8, fontSize: 12, fontWeight: 600, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>{toast}</div>}

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #0f4c5c 100%)', color: '#fff', padding: '10px 16px', position: 'sticky', top: 0, zIndex: 200 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 6, background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14 }}>I</div>
            <div><div style={{ fontSize: 14, fontWeight: 700, letterSpacing: 1.5 }}>INCEPTA</div><div style={{ fontSize: 9, opacity: 0.6 }}>نظام إدارة المناقصات والمشاريع</div></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {alerts.length > 0 && <span style={{ ...S.badge('#dc2626'), cursor: 'pointer' }} onClick={() => setTab('dashboard')}>{alerts.length} تنبيه</span>}
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
            <span style={{ fontSize: 11, opacity: 0.9 }}>{currentPartner?.name || authUser?.email}</span>
            <button onClick={handleSignOut} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 6, padding: '4px 10px', fontSize: 10, cursor: 'pointer', fontFamily: 'inherit' }}>خروج</button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 44, zIndex: 190, overflowX: 'auto', whiteSpace: 'nowrap' }}>
        <div style={{ display: 'flex', maxWidth: 1100, margin: '0 auto', padding: '0 12px' }}>
          {tabs.map(t => <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: '8px 14px', border: 'none', background: 'none', fontSize: 12, fontWeight: tab === t.id ? 700 : 400, color: tab === t.id ? '#1e3a5f' : '#64748b', borderBottom: tab === t.id ? '2px solid #1e3a5f' : '2px solid transparent', cursor: 'pointer', fontFamily: 'inherit' }}>{t.l}</button>)}
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '12px 14px' }}>

        {/* ═══ DASHBOARD ═══ */}
        {tab === 'dashboard' && <>
          {alerts.length > 0 && <div style={{ ...S.card, borderRight: '4px solid #dc2626', background: '#fef2f2' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#dc2626', marginBottom: 6 }}>تنبيهات ({alerts.length})</div>
            {alerts.slice(0, 5).map((a, i) => <div key={i} style={{ fontSize: 11, color: '#7f1d1d', padding: '2px 0' }}>{a.t === 'urgent' ? '⏰' : '⚠'} {a.m}</div>)}
          </div>}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
            {[
              ['مناقصات نشطة', activeOpps.length, '#1e3a5f'],
              ['تم التقديم', opps.filter(o => o.status === 'submitted').length, '#d97706'],
              ['ترسيات', wonOpps.length, '#059669'],
              ['نسبة الفوز', winRate + '%', '#7c3aed'],
              ['القيمة المتوقعة', fmtMoney(activeOpps.reduce((s, o) => s + (o.value || 0), 0)), '#1e3a5f'],
              ['مهام معلقة', pendingTasks.length, '#d97706'],
              ['مشاريع', projects.length, '#0d6e56'],
            ].map(([l, v, c]) => <div key={l} style={S.stat}><div style={{ fontSize: 10, color: '#64748b' }}>{l}</div><div style={{ fontSize: 22, fontWeight: 800, color: c, marginTop: 2 }}>{v}</div></div>)}
          </div>
          <div style={S.card}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>عبء العمل</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {partners.map(p => {
                const pt = tasks.filter(t => t.assignee_id === p.id);
                const done = pt.filter(t => t.status === 'completed').length;
                const rate = pt.length ? Math.round(done / pt.length * 100) : 0;
                return <div key={p.id} style={{ flex: '1 1 200px', padding: 10, borderRadius: 8, background: p.color + '08', border: `1px solid ${p.color}20` }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: p.color }}>{p.name}</div>
                  <div style={{ fontSize: 10, color: '#64748b' }}>{p.specialty}</div>
                  <div style={{ display: 'flex', gap: 12, marginTop: 4, fontSize: 10 }}><span>مناقصات: {opps.filter(o => o.lead_partner_id === p.id && !['won','lost','cancelled'].includes(o.status)).length}</span><span>مهام: {done}/{pt.length}</span></div>
                  <div style={{ marginTop: 4, height: 4, borderRadius: 2, background: '#e2e8f0' }}><div style={{ height: '100%', borderRadius: 2, background: p.color, width: `${rate}%` }} /></div>
                  <div style={{ fontSize: 10, color: p.color, fontWeight: 700, marginTop: 2 }}>{rate}%</div>
                </div>;
              })}
            </div>
          </div>
          <div style={S.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span style={{ fontSize: 13, fontWeight: 700 }}>أعلى الأولويات</span><button onClick={() => setTab('opps')} style={{ ...S.btnS, fontSize: 10, padding: '2px 8px' }}>عرض الكل</button></div>
            {activeOpps.slice(0, 5).map(o => {
              const pl = prioLabel(o.priority_score);
              return <div key={o.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', borderRadius: 6, background: '#f8fafc', marginBottom: 4, cursor: 'pointer' }} onClick={() => { setEditing(o); setModal('opp'); }}>
                <div style={{ width: 28, height: 28, borderRadius: 6, background: pl.c + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: pl.c }}>{o.priority_score}</div>
                <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.name}</div><div style={{ fontSize: 10, color: '#94a3b8' }}>{clientName(o.client_id)} · {partnerName(o.lead_partner_id)}</div></div>
                <select value={o.status} onClick={e => e.stopPropagation()} onChange={e => updateOppStatus(o.id, e.target.value)} style={S.sel(OPP_STATUSES.find(s => s.v === o.status)?.c || '#6b7280')}>{OPP_STATUSES.map(s => <option key={s.v} value={s.v}>{s.l}</option>)}</select>
              </div>;
            })}
            {activeOpps.length === 0 && <div style={{ color: '#94a3b8', fontSize: 11, textAlign: 'center', padding: 20 }}>لا توجد مناقصات نشطة</div>}
          </div>
        </>}

        {/* ═══ OPPORTUNITIES ═══ */}
        {tab === 'opps' && <OppsList opps={opps} partners={partners} clients={clients} partnerName={partnerName} partnerColor={partnerColor} clientName={clientName} onAdd={() => { setEditing(null); setModal('opp'); }} onEdit={o => { setEditing(o); setModal('opp'); }} onDelete={deleteOpp} updateStatus={updateOppStatus} />}

        {/* ═══ TASKS ═══ */}
        {tab === 'tasks' && <TasksList tasks={tasks} partners={partners} opps={opps} partnerName={partnerName} onAdd={() => { setEditing(null); setModal('task'); }} onEdit={t => { setEditing(t); setModal('task'); }} onDelete={deleteTask} updateStatus={updateTaskStatus} />}

        {/* ═══ PROJECTS ═══ */}
        {tab === 'projects' && <ProjectsList projects={projects} opps={opps} deliverables={deliverables} expenses={expenses} onEdit={p => { setEditing(p); setModal('project'); }} onAddDeliverable={pid => { setEditing(null); setModal('del:' + pid); }} onAddExpense={pid => { setEditing(null); setModal('exp:' + pid); }} updatePhase={updateProjectPhase} fmtMoney={fmtMoney} />}

        {/* ═══ CLIENTS ═══ */}
        {tab === 'clients' && <ClientsList clients={clients} opps={opps} onAdd={() => { setEditing(null); setModal('client'); }} onEdit={c => { setEditing(c); setModal('client'); }} />}

        {/* ═══ AUDIT ═══ */}
        {tab === 'audit' && <div>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>سجل المراجعة ({auditLog.length})</div>
          {auditLog.map(a => <div key={a.id} style={{ display: 'flex', gap: 8, padding: '6px 0', borderBottom: '1px solid #f1f5f9', fontSize: 11 }}>
            <span style={{ color: '#64748b', minWidth: 90 }}>{new Date(a.created_at).toLocaleString('ar-EG', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
            <span style={S.badge(partnerColor(a.partner_id))}>{partnerName(a.partner_id)}</span>
            <span style={S.badge(a.action === 'create' ? '#059669' : a.action === 'delete' ? '#dc2626' : '#d97706')}>{{ create: 'إنشاء', update: 'تعديل', delete: 'حذف' }[a.action]}</span>
            <span>{{ opportunities: 'المناقصات', tasks: 'المهام', clients: 'العملاء', projects: 'المشاريع' }[a.table_name] || a.table_name}</span>
          </div>)}
        </div>}
      </div>

      {/* ═══ MODALS ═══ */}
      <Modal open={modal === 'opp'} onClose={() => { setModal(null); setEditing(null); }} title={editing ? 'تعديل المناقصة' : 'مناقصة جديدة'} wide>
        <OppForm initial={editing} clients={clients} partners={partners} onSave={saveOpp} onCancel={() => { setModal(null); setEditing(null); }} />
      </Modal>
      <Modal open={modal === 'task'} onClose={() => { setModal(null); setEditing(null); }} title={editing ? 'تعديل المهمة' : 'مهمة جديدة'}>
        <TaskForm initial={editing} opps={opps} projects={projects} partners={partners} onSave={saveTask} onCancel={() => { setModal(null); setEditing(null); }} />
      </Modal>
      <Modal open={modal === 'client'} onClose={() => { setModal(null); setEditing(null); }} title={editing ? 'تعديل العميل' : 'عميل جديد'}>
        <ClientForm initial={editing} onSave={saveClient} onCancel={() => { setModal(null); setEditing(null); }} />
      </Modal>
      <Modal open={modal === 'project'} onClose={() => { setModal(null); setEditing(null); }} title="تعديل المشروع">
        <ProjectForm initial={editing} onSave={saveProject} onCancel={() => { setModal(null); setEditing(null); }} />
      </Modal>
      {modal?.startsWith('del:') && <Modal open onClose={() => { setModal(null); setEditing(null); }} title="تسليم جديد">
        <DeliverableForm projectId={modal.split(':')[1]} onSave={saveDeliverable} onCancel={() => { setModal(null); setEditing(null); }} />
      </Modal>}
      {modal?.startsWith('exp:') && <Modal open onClose={() => { setModal(null); setEditing(null); }} title="مصروف جديد">
        <ExpenseForm projectId={modal.split(':')[1]} onSave={saveExpense} onCancel={() => { setModal(null); setEditing(null); }} />
      </Modal>}
    </div>
  );
}

// ─── Sub-components ───

function OppsList({ opps, partners, clients, partnerName, partnerColor, clientName, onAdd, onEdit, onDelete, updateStatus }) {
  const [fp, setFP] = useState('all');
  const [fs, setFS] = useState('all');
  const filtered = opps.filter(o => fp === 'all' || o.lead_partner_id === fp).filter(o => fs === 'all' || o.status === fs);
  return <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 6 }}>
      <div style={{ display: 'flex', gap: 6 }}>
        <select value={fp} onChange={e => setFP(e.target.value)} style={{ ...S.input, width: 'auto', fontSize: 11 }}><option value="all">كل الشركاء</option>{partners.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
        <select value={fs} onChange={e => setFS(e.target.value)} style={{ ...S.input, width: 'auto', fontSize: 11 }}><option value="all">كل الحالات</option>{OPP_STATUSES.map(s => <option key={s.v} value={s.v}>{s.l}</option>)}</select>
      </div>
      <button onClick={onAdd} style={S.btnP}>+ مناقصة جديدة</button>
    </div>
    {filtered.length === 0 ? <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>لا توجد مناقصات</div> :
    filtered.map(o => {
      const pl = prioLabel(o.priority_score);
      const st = OPP_STATUSES.find(s => s.v === o.status);
      const dl = daysUntil(o.deadline);
      return <div key={o.id} style={{ ...S.card, borderRight: `4px solid ${pl.c}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}><span style={{ fontSize: 14, fontWeight: 700 }}>{o.name}</span><span style={S.badge(pl.c)}>أولوية {o.priority_score}</span></div>
            <div style={{ fontSize: 11, color: '#64748b' }}>{clientName(o.client_id)} · {o.service_area} · {fmtMoney(o.value)}</div>
            <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={S.badge(partnerColor(o.lead_partner_id))}>{partnerName(o.lead_partner_id)}</span>
              <span style={{ fontSize: 10, color: dl <= 3 ? '#dc2626' : dl <= 7 ? '#d97706' : '#64748b' }}>متبقي: {dl} يوم</span>
              <span style={{ fontSize: 10, color: '#64748b' }}>فوز: {o.win_probability}%</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            <select value={o.status} onChange={e => updateStatus(o.id, e.target.value)} style={S.sel(st?.c || '#6b7280')}>{OPP_STATUSES.map(s => <option key={s.v} value={s.v}>{s.l}</option>)}</select>
            <button onClick={() => onEdit(o)} style={S.btnS}>تعديل</button>
            <button onClick={() => onDelete(o.id)} style={S.btnD}>حذف</button>
          </div>
        </div>
      </div>;
    })}
  </div>;
}

function TasksList({ tasks, partners, opps, partnerName, onAdd, onEdit, onDelete, updateStatus }) {
  const [fp, setFP] = useState('all');
  const sorted = tasks.filter(t => fp === 'all' || t.assignee_id === fp).sort((a, b) => ({ overdue: 0, in_progress: 1, pending: 2, completed: 3 }[a.status] ?? 2) - ({ overdue: 0, in_progress: 1, pending: 2, completed: 3 }[b.status] ?? 2));
  return <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, gap: 6 }}>
      <select value={fp} onChange={e => setFP(e.target.value)} style={{ ...S.input, width: 'auto', fontSize: 11 }}><option value="all">كل الشركاء</option>{partners.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
      <button onClick={onAdd} style={S.btnP}>+ مهمة جديدة</button>
    </div>
    {sorted.map(t => {
      const ts = TASK_STATUSES.find(s => s.v === t.status);
      return <div key={t.id} style={{ ...S.card, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: ts?.c }} />
        <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 12, fontWeight: 600 }}>{t.title}</div><div style={{ fontSize: 10, color: '#94a3b8' }}>{opps.find(o => o.id === t.opportunity_id)?.name || 'عامة'} · {partnerName(t.assignee_id)} · {fmtDate(t.due_date)}</div></div>
        <select value={t.status} onChange={e => updateStatus(t.id, e.target.value)} style={S.sel(ts?.c || '#6b7280')}>{TASK_STATUSES.map(s => <option key={s.v} value={s.v}>{s.l}</option>)}</select>
        <button onClick={() => onEdit(t)} style={S.btnS}>تعديل</button>
        <button onClick={() => { if (confirm('حذف؟')) onDelete(t.id); }} style={S.btnD}>×</button>
      </div>;
    })}
  </div>;
}

function ProjectsList({ projects, opps, deliverables, expenses, onEdit, onAddDeliverable, onAddExpense, updatePhase, fmtMoney }) {
  return <div>
    <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>المشاريع ({projects.length})</div>
    {projects.length === 0 ? <div style={{ ...S.card, textAlign: 'center', color: '#94a3b8', padding: 30 }}>عند ترسية مناقصة يُنشأ مشروع تلقائيًا</div> :
    projects.map(p => {
      const ph = PROJECT_PHASES.find(x => x.v === p.phase);
      const pDel = deliverables.filter(d => d.project_id === p.id);
      const pExp = expenses.filter(e => e.project_id === p.id);
      const pct = p.budget > 0 ? Math.round((p.spent || 0) / p.budget * 100) : 0;
      return <div key={p.id} style={{ ...S.card, borderRight: `4px solid ${ph?.c || '#6b7280'}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <div><div style={{ fontSize: 14, fontWeight: 700 }}>{p.name}</div><div style={{ fontSize: 11, color: '#64748b' }}>الميزانية: {fmtMoney(p.budget)}</div></div>
          <div style={{ display: 'flex', gap: 4 }}>
            <select value={p.phase} onChange={e => updatePhase(p.id, e.target.value)} style={S.sel(ph?.c || '#6b7280')}>{PROJECT_PHASES.map(x => <option key={x.v} value={x.v}>{x.l}</option>)}</select>
            <button onClick={() => onEdit(p)} style={S.btnS}>تعديل</button>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 10, color: '#64748b', minWidth: 50 }}>الإنفاق:</span>
          <div style={{ flex: 1, height: 6, borderRadius: 3, background: '#e2e8f0' }}><div style={{ height: '100%', borderRadius: 3, background: pct > 90 ? '#dc2626' : '#059669', width: `${Math.min(pct, 100)}%` }} /></div>
          <span style={{ fontSize: 10, fontWeight: 700 }}>{fmtMoney(p.spent)}/{fmtMoney(p.budget)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ fontSize: 11, fontWeight: 600 }}>التسليمات ({pDel.length})</span><button onClick={() => onAddDeliverable(p.id)} style={{ ...S.btnS, fontSize: 10, padding: '2px 8px' }}>+ تسليم</button></div>
        {pDel.map(d => <div key={d.id} style={{ fontSize: 11, padding: '3px 0', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' }}><span>{d.title}</span><span style={{ color: '#64748b' }}>{fmtDate(d.due_date)} · {d.status}</span></div>)}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}><span style={{ fontSize: 11, fontWeight: 600 }}>المصروفات ({pExp.length})</span><button onClick={() => onAddExpense(p.id)} style={{ ...S.btnS, fontSize: 10, padding: '2px 8px' }}>+ مصروف</button></div>
        {pExp.slice(0, 3).map(e => <div key={e.id} style={{ fontSize: 10, color: '#64748b', display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}><span>{e.category}: {e.description}</span><span style={{ fontWeight: 600 }}>{fmtMoney(e.amount)}</span></div>)}
      </div>;
    })}
  </div>;
}

function ClientsList({ clients, opps, onAdd, onEdit }) {
  return <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}><span style={{ fontSize: 14, fontWeight: 700 }}>العملاء ({clients.length})</span><button onClick={onAdd} style={S.btnP}>+ عميل جديد</button></div>
    {clients.map(c => {
      const count = opps.filter(o => o.client_id === c.id).length;
      const won = opps.filter(o => o.client_id === c.id && o.status === 'won').length;
      return <div key={c.id} style={{ ...S.card, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => onEdit(c)}>
        <div><div style={{ fontSize: 13, fontWeight: 700 }}>{c.name}</div><div style={{ fontSize: 10, color: '#64748b' }}>{c.type} · {c.contact_person}</div></div>
        <div style={{ display: 'flex', gap: 12 }}><div style={{ textAlign: 'center' }}><div style={{ fontSize: 18, fontWeight: 800 }}>{count}</div><div style={{ fontSize: 9, color: '#94a3b8' }}>مناقصات</div></div><div style={{ textAlign: 'center' }}><div style={{ fontSize: 18, fontWeight: 800, color: '#059669' }}>{won}</div><div style={{ fontSize: 9, color: '#94a3b8' }}>ترسية</div></div></div>
      </div>;
    })}
  </div>;
}

// ─── Forms ───
function OppForm({ initial, clients, partners, onSave, onCancel }) {
  const [f, setF] = useState(initial ? { name: initial.name, client_id: initial.client_id || '', lead_partner_id: initial.lead_partner_id, value: initial.value || 0, deadline: initial.deadline || '', status: initial.status, service_area: initial.service_area || SERVICE_AREAS[0], win_probability: initial.win_probability || 50, strategic_alignment: initial.strategic_alignment || 3, drive_folder_url: initial.drive_folder_url || '', notes: initial.notes || '' } : { name: '', client_id: '', lead_partner_id: partners[0]?.id || '', value: 0, deadline: '', status: 'identified', service_area: SERVICE_AREAS[0], win_probability: 50, strategic_alignment: 3, drive_folder_url: '', notes: '' });
  const s = (k, v) => setF(x => ({ ...x, [k]: v }));
  return <div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 10px' }}>
      <Field label="اسم المناقصة *"><input style={S.input} value={f.name} onChange={e => s('name', e.target.value)} /></Field>
      <Field label="العميل"><select style={S.input} value={f.client_id} onChange={e => s('client_id', e.target.value)}><option value="">— اختر —</option>{clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></Field>
      <Field label="القيمة ($)"><input type="number" style={S.input} value={f.value} onChange={e => s('value', e.target.value)} /></Field>
      <Field label="الموعد النهائي *"><input type="date" style={S.input} value={f.deadline} onChange={e => s('deadline', e.target.value)} /></Field>
      <Field label="الشريك المسؤول"><select style={S.input} value={f.lead_partner_id} onChange={e => s('lead_partner_id', e.target.value)}>{partners.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></Field>
      <Field label="الحالة"><select style={S.input} value={f.status} onChange={e => s('status', e.target.value)}>{OPP_STATUSES.map(x => <option key={x.v} value={x.v}>{x.l}</option>)}</select></Field>
      <Field label="مجال الخدمة"><select style={S.input} value={f.service_area} onChange={e => s('service_area', e.target.value)}>{SERVICE_AREAS.map(x => <option key={x} value={x}>{x}</option>)}</select></Field>
      <Field label={`احتمالية الفوز: ${f.win_probability}%`}><input type="range" min="0" max="100" step="5" value={f.win_probability} onChange={e => s('win_probability', Number(e.target.value))} style={{ width: '100%' }} /></Field>
      <Field label={`التوافق: ${f.strategic_alignment}/5`}><input type="range" min="1" max="5" value={f.strategic_alignment} onChange={e => s('strategic_alignment', Number(e.target.value))} style={{ width: '100%' }} /></Field>
      <Field label="رابط Drive"><input style={S.input} value={f.drive_folder_url} onChange={e => s('drive_folder_url', e.target.value)} placeholder="https://drive.google.com/..." /></Field>
    </div>
    <Field label="ملاحظات"><textarea style={{ ...S.input, minHeight: 50 }} value={f.notes} onChange={e => s('notes', e.target.value)} /></Field>
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, marginTop: 10 }}>
      <button onClick={onCancel} style={S.btnS}>إلغاء</button>
      <button onClick={() => onSave(f)} disabled={!f.name || !f.deadline} style={{ ...S.btnP, opacity: !f.name || !f.deadline ? 0.5 : 1 }}>حفظ</button>
    </div>
  </div>;
}

function TaskForm({ initial, opps, projects, partners, onSave, onCancel }) {
  const [f, setF] = useState(initial ? { title: initial.title, description: initial.description || '', opportunity_id: initial.opportunity_id || '', project_id: initial.project_id || '', assignee_id: initial.assignee_id, status: initial.status, due_date: initial.due_date || '' } : { title: '', description: '', opportunity_id: '', project_id: '', assignee_id: partners[0]?.id || '', status: 'pending', due_date: '' });
  const s = (k, v) => setF(x => ({ ...x, [k]: v }));
  return <div>
    <Field label="العنوان *"><input style={S.input} value={f.title} onChange={e => s('title', e.target.value)} /></Field>
    <Field label="المناقصة"><select style={S.input} value={f.opportunity_id} onChange={e => s('opportunity_id', e.target.value)}><option value="">— بدون —</option>{opps.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}</select></Field>
    <Field label="المسؤول"><select style={S.input} value={f.assignee_id} onChange={e => s('assignee_id', e.target.value)}>{partners.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></Field>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 10px' }}>
      <Field label="تاريخ الاستحقاق"><input type="date" style={S.input} value={f.due_date} onChange={e => s('due_date', e.target.value)} /></Field>
      <Field label="الحالة"><select style={S.input} value={f.status} onChange={e => s('status', e.target.value)}>{TASK_STATUSES.map(x => <option key={x.v} value={x.v}>{x.l}</option>)}</select></Field>
    </div>
    <Field label="الوصف"><textarea style={{ ...S.input, minHeight: 40 }} value={f.description} onChange={e => s('description', e.target.value)} /></Field>
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, marginTop: 10 }}><button onClick={onCancel} style={S.btnS}>إلغاء</button><button onClick={() => onSave(f)} disabled={!f.title} style={{ ...S.btnP, opacity: !f.title ? 0.5 : 1 }}>حفظ</button></div>
  </div>;
}

function ClientForm({ initial, onSave, onCancel }) {
  const [f, setF] = useState(initial || { name: '', type: CLIENT_TYPES[0], contact_person: '', email: '', notes: '' });
  const s = (k, v) => setF(x => ({ ...x, [k]: v }));
  return <div>
    <Field label="اسم العميل *"><input style={S.input} value={f.name} onChange={e => s('name', e.target.value)} /></Field>
    <Field label="النوع"><select style={S.input} value={f.type} onChange={e => s('type', e.target.value)}>{CLIENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select></Field>
    <Field label="جهة الاتصال"><input style={S.input} value={f.contact_person} onChange={e => s('contact_person', e.target.value)} /></Field>
    <Field label="البريد"><input style={S.input} value={f.email} onChange={e => s('email', e.target.value)} /></Field>
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, marginTop: 10 }}><button onClick={onCancel} style={S.btnS}>إلغاء</button><button onClick={() => onSave(f)} disabled={!f.name} style={{ ...S.btnP, opacity: !f.name ? 0.5 : 1 }}>حفظ</button></div>
  </div>;
}

function ProjectForm({ initial, onSave, onCancel }) {
  const [f, setF] = useState(initial || { name: '', budget: 0, start_date: '', end_date: '', phase: 'planning', drive_folder_url: '' });
  const s = (k, v) => setF(x => ({ ...x, [k]: v }));
  return <div>
    <Field label="اسم المشروع"><input style={S.input} value={f.name} onChange={e => s('name', e.target.value)} /></Field>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 10px' }}>
      <Field label="الميزانية"><input type="number" style={S.input} value={f.budget} onChange={e => s('budget', e.target.value)} /></Field>
      <Field label="المرحلة"><select style={S.input} value={f.phase} onChange={e => s('phase', e.target.value)}>{PROJECT_PHASES.map(x => <option key={x.v} value={x.v}>{x.l}</option>)}</select></Field>
      <Field label="بداية"><input type="date" style={S.input} value={f.start_date} onChange={e => s('start_date', e.target.value)} /></Field>
      <Field label="نهاية"><input type="date" style={S.input} value={f.end_date} onChange={e => s('end_date', e.target.value)} /></Field>
    </div>
    <Field label="رابط Drive"><input style={S.input} value={f.drive_folder_url} onChange={e => s('drive_folder_url', e.target.value)} /></Field>
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, marginTop: 10 }}><button onClick={onCancel} style={S.btnS}>إلغاء</button><button onClick={() => onSave(f)} style={S.btnP}>حفظ</button></div>
  </div>;
}

function DeliverableForm({ projectId, onSave, onCancel }) {
  const [f, setF] = useState({ title: '', due_date: '', status: 'pending', drive_link: '', project_id: projectId });
  const s = (k, v) => setF(x => ({ ...x, [k]: v }));
  return <div>
    <Field label="العنوان *"><input style={S.input} value={f.title} onChange={e => s('title', e.target.value)} /></Field>
    <Field label="تاريخ الاستحقاق"><input type="date" style={S.input} value={f.due_date} onChange={e => s('due_date', e.target.value)} /></Field>
    <Field label="رابط Drive"><input style={S.input} value={f.drive_link} onChange={e => s('drive_link', e.target.value)} /></Field>
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, marginTop: 10 }}><button onClick={onCancel} style={S.btnS}>إلغاء</button><button onClick={() => onSave(f)} disabled={!f.title} style={{ ...S.btnP, opacity: !f.title ? 0.5 : 1 }}>حفظ</button></div>
  </div>;
}

function ExpenseForm({ projectId, onSave, onCancel }) {
  const [f, setF] = useState({ amount: 0, category: 'سفر', description: '', expense_date: new Date().toISOString().split('T')[0], project_id: projectId });
  const s = (k, v) => setF(x => ({ ...x, [k]: v }));
  return <div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 10px' }}>
      <Field label="المبلغ ($)"><input type="number" style={S.input} value={f.amount} onChange={e => s('amount', e.target.value)} /></Field>
      <Field label="التصنيف"><select style={S.input} value={f.category} onChange={e => s('category', e.target.value)}>{['سفر', 'إقامة', 'أتعاب مستشارين', 'طباعة', 'أخرى'].map(c => <option key={c} value={c}>{c}</option>)}</select></Field>
    </div>
    <Field label="الوصف"><input style={S.input} value={f.description} onChange={e => s('description', e.target.value)} /></Field>
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, marginTop: 10 }}><button onClick={onCancel} style={S.btnS}>إلغاء</button><button onClick={() => onSave(f)} style={S.btnP}>حفظ</button></div>
  </div>;
}
