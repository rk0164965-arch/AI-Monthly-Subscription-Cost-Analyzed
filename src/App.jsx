import { useState, useRef, useEffect } from 'react';
import './App.css';

/* ── Icon Components ── */
const IconPlus = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
);
const IconTrash = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
);
const IconWallet = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2v-5zm-5 1a1 1 0 110-2 1 1 0 010 2z" /></svg>
);
const IconCalendar = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
);
const IconSavings = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
const IconBrain = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
);
const IconChart = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
);

/* ── Helper Functions ── */
function getStatus(usage) {
  if (usage === 'Daily' || usage === 'Weekly') return 'Active';
  if (usage === 'Monthly' || usage === 'Rarely') return 'Underused';
  return 'Unused';
}

function getRecommendation(status) {
  if (status === 'Active') return 'Keep';
  if (status === 'Underused') return 'Downgrade';
  return 'Cancel';
}

function getStatusColor(status) {
  if (status === 'Active') return { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30', dot: 'bg-emerald-400' };
  if (status === 'Underused') return { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30', dot: 'bg-amber-400' };
  return { bg: 'bg-rose-500/15', text: 'text-rose-400', border: 'border-rose-500/30', dot: 'bg-rose-400' };
}

function getRecColor(rec) {
  if (rec === 'Keep') return 'text-emerald-400';
  if (rec === 'Downgrade') return 'text-amber-400';
  return 'text-rose-400';
}

function toMonthly(cost, cycle) {
  return cycle === 'Yearly' ? parseFloat((cost / 12).toFixed(2)) : cost;
}

/* ── Main App ── */
export default function App() {
  const [subs, setSubs] = useState([
    { id: 1, name: 'Netflix', cost: 649, cycle: 'Monthly', usage: 'Daily' },
    { id: 2, name: 'Spotify', cost: 119, cycle: 'Monthly', usage: 'Weekly' },
    { id: 3, name: 'Adobe CC', cost: 5400, cycle: 'Yearly', usage: 'Rarely' },
    { id: 4, name: 'LinkedIn Premium', cost: 1500, cycle: 'Monthly', usage: 'Never' },
    { id: 5, name: 'ChatGPT Plus', cost: 1950, cycle: 'Monthly', usage: 'Daily' },
  ]);
  const [form, setForm] = useState({ name: '', cost: '', cycle: 'Monthly', usage: 'Daily' });
  const [nextId, setNextId] = useState(6);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addSub = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.cost) return;
    setSubs([...subs, { ...form, id: nextId, cost: parseFloat(form.cost) }]);
    setNextId(nextId + 1);
    setForm({ name: '', cost: '', cycle: 'Monthly', usage: 'Daily' });
  };

  const deleteSub = (id) => setSubs(subs.filter((s) => s.id !== id));

  /* Calculations */
  const totalMonthly = subs.reduce((sum, s) => sum + toMonthly(s.cost, s.cycle), 0);
  const totalYearly = totalMonthly * 12;
  const savings = subs.filter((s) => getStatus(s.usage) === 'Unused').reduce((sum, s) => sum + toMonthly(s.cost, s.cycle), 0);
  const unusedCount = subs.filter((s) => getStatus(s.usage) === 'Unused').length;
  const underusedCount = subs.filter((s) => getStatus(s.usage) === 'Underused').length;
  const activeCount = subs.filter((s) => getStatus(s.usage) === 'Active').length;
  const underusedSavings = subs.filter((s) => getStatus(s.usage) === 'Underused').reduce((sum, s) => sum + toMonthly(s.cost, s.cycle) * 0.5, 0);

  return (
    <div className="min-h-screen bg-[#0a0a1a] relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25 animate-float">
              <IconBrain />
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              SubTracker AI
            </h1>
          </div>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Intelligent subscription cost analyzer — track, analyze &amp; optimize your recurring expenses
          </p>
        </header>

        {/* Input Form */}
        <section className="mb-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="glass-strong rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <IconChart />
              <h2 className="text-xl font-bold text-white">Add Subscription</h2>
            </div>
            <form onSubmit={addSub} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Name</label>
                <input
                  id="input-name"
                  name="name"
                  type="text"
                  placeholder="e.g. Netflix"
                  value={form.name}
                  onChange={handleChange}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cost (₹)</label>
                <input
                  id="input-cost"
                  name="cost"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="499"
                  value={form.cost}
                  onChange={handleChange}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Billing Cycle</label>
                <select
                  id="input-cycle"
                  name="cycle"
                  value={form.cycle}
                  onChange={handleChange}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all appearance-none cursor-pointer"
                >
                  <option className="bg-[#1a1a2e]" value="Monthly">Monthly</option>
                  <option className="bg-[#1a1a2e]" value="Yearly">Yearly</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Usage</label>
                <select
                  id="input-usage"
                  name="usage"
                  value={form.usage}
                  onChange={handleChange}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all appearance-none cursor-pointer"
                >
                  <option className="bg-[#1a1a2e]" value="Daily">Daily</option>
                  <option className="bg-[#1a1a2e]" value="Weekly">Weekly</option>
                  <option className="bg-[#1a1a2e]" value="Monthly">Monthly</option>
                  <option className="bg-[#1a1a2e]" value="Rarely">Rarely</option>
                  <option className="bg-[#1a1a2e]" value="Never">Never</option>
                </select>
              </div>
              <div className="flex flex-col justify-end">
                <button
                  id="btn-add"
                  type="submit"
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl px-6 py-3 transition-all duration-300 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-95 cursor-pointer"
                >
                  <IconPlus /> Add
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Summary Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <SummaryCard icon={<IconWallet />} label="Monthly Cost" value={`₹${totalMonthly.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`} gradient="from-indigo-600 to-blue-600" shadow="shadow-indigo-500/20" />
          <SummaryCard icon={<IconCalendar />} label="Yearly Cost" value={`₹${totalYearly.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`} gradient="from-purple-600 to-pink-600" shadow="shadow-purple-500/20" />
          <SummaryCard icon={<IconSavings />} label="Potential Savings" value={`₹${savings.toLocaleString('en-IN', { maximumFractionDigits: 0 })}/mo`} gradient="from-emerald-600 to-teal-600" shadow="shadow-emerald-500/20" accent />
        </section>

        {/* Subscription Table */}
        <section className="mb-10 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="glass-strong rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-white/5">
              <h2 className="text-xl font-bold text-white">Your Subscriptions</h2>
              <p className="text-sm text-slate-400 mt-1">{subs.length} active subscription{subs.length !== 1 ? 's' : ''} tracked</p>
            </div>
            {subs.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <p className="text-lg">No subscriptions yet.</p>
                <p className="text-sm mt-1">Add your first subscription above to get started.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-white/5">
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Cost/mo</th>
                      <th className="px-6 py-4">Usage</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Recommendation</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subs.map((s, i) => {
                      const status = getStatus(s.usage);
                      const rec = getRecommendation(status);
                      const sc = getStatusColor(status);
                      const monthly = toMonthly(s.cost, s.cycle);
                      return (
                        <tr key={s.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group" style={{ animationDelay: `${i * 0.05}s` }}>
                          <td className="px-6 py-4">
                            <span className="font-semibold text-white">{s.name}</span>
                            {s.cycle === 'Yearly' && <span className="ml-2 text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full">Yearly</span>}
                          </td>
                          <td className="px-6 py-4 font-mono text-slate-200">₹{monthly.toLocaleString('en-IN')}</td>
                          <td className="px-6 py-4 text-slate-300">{s.usage}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${sc.bg} ${sc.text} ${sc.border}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                              {status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`font-semibold text-sm ${getRecColor(rec)}`}>{rec}</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button onClick={() => deleteSub(s.id)} className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all opacity-50 group-hover:opacity-100 cursor-pointer" title="Delete">
                              <IconTrash />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* Insights & Recommendations */}
        {subs.length > 0 && (
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            {/* Insights */}
            <div className="glass-strong rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h3 className="text-lg font-bold text-white">Smart Insights</h3>
              </div>
              <ul className="space-y-3">
                {unusedCount > 0 && (
                  <li className="flex items-start gap-3 p-3 rounded-xl bg-rose-500/5 border border-rose-500/10">
                    <span className="mt-0.5 w-2 h-2 rounded-full bg-rose-400 shrink-0" />
                    <span className="text-sm text-slate-300">You are paying <strong className="text-rose-400">₹{savings.toLocaleString('en-IN', { maximumFractionDigits: 0 })}/mo</strong> for {unusedCount} unused subscription{unusedCount > 1 ? 's' : ''}. Consider cancelling.</span>
                  </li>
                )}
                {underusedCount > 0 && (
                  <li className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
                    <span className="mt-0.5 w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                    <span className="text-sm text-slate-300"><strong className="text-amber-400">{underusedCount} subscription{underusedCount > 1 ? 's are' : ' is'} underused</strong>. Downgrading could save ~₹{underusedSavings.toLocaleString('en-IN', { maximumFractionDigits: 0 })}/mo.</span>
                  </li>
                )}
                {activeCount > 0 && (
                  <li className="flex items-start gap-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                    <span className="mt-0.5 w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                    <span className="text-sm text-slate-300"><strong className="text-emerald-400">{activeCount} subscription{activeCount > 1 ? 's' : ''}</strong> {activeCount > 1 ? 'are' : 'is'} actively used and worth keeping.</span>
                  </li>
                )}
                <li className="flex items-start gap-3 p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
                  <span className="mt-0.5 w-2 h-2 rounded-full bg-indigo-400 shrink-0" />
                  <span className="text-sm text-slate-300">Total annual spend is <strong className="text-indigo-400">₹{totalYearly.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</strong>. That's ₹{(totalYearly / 365).toFixed(0)}/day.</span>
                </li>
              </ul>
            </div>

            {/* Breakdown */}
            <div className="glass-strong rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
                  <IconChart />
                </div>
                <h3 className="text-lg font-bold text-white">Spending Breakdown</h3>
              </div>
              <div className="space-y-4">
                <BreakdownBar label="Active" count={activeCount} amount={subs.filter(s => getStatus(s.usage) === 'Active').reduce((a, s) => a + toMonthly(s.cost, s.cycle), 0)} total={totalMonthly} color="bg-emerald-500" />
                <BreakdownBar label="Underused" count={underusedCount} amount={subs.filter(s => getStatus(s.usage) === 'Underused').reduce((a, s) => a + toMonthly(s.cost, s.cycle), 0)} total={totalMonthly} color="bg-amber-500" />
                <BreakdownBar label="Unused" count={unusedCount} amount={savings} total={totalMonthly} color="bg-rose-500" />
              </div>
              {(savings + underusedSavings) > 0 && (
                <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
                  <p className="text-sm text-slate-300">💡 <strong className="text-emerald-400">Maximum possible savings:</strong> ₹{(savings + underusedSavings).toLocaleString('en-IN', { maximumFractionDigits: 0 })}/mo (₹{((savings + underusedSavings) * 12).toLocaleString('en-IN', { maximumFractionDigits: 0 })}/yr)</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="text-center py-8 border-t border-white/5">
          <p className="text-sm text-slate-500">© {new Date().getFullYear()} SubTracker AI. All rights reserved.</p>
        </footer>
      </div>

      {/* Chatbot */}
      <Chatbot
        subs={subs}
        totalMonthly={totalMonthly}
        totalYearly={totalYearly}
        savings={savings}
        unusedCount={unusedCount}
        underusedCount={underusedCount}
        activeCount={activeCount}
        underusedSavings={underusedSavings}
      />
    </div>
  );
}

/* ── Summary Card Component ── */
function SummaryCard({ icon, label, value, gradient, shadow, accent }) {
  return (
    <div className={`glass-strong rounded-2xl p-6 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300 ${accent ? 'animate-glow' : ''}`}>
      <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400 mb-1">{label}</p>
          <p className="text-3xl font-extrabold text-white tracking-tight">{value}</p>
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg ${shadow}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

/* ── Breakdown Bar Component ── */
function BreakdownBar({ label, count, amount, total, color }) {
  const pct = total > 0 ? (amount / total) * 100 : 0;
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
          <span className="text-sm font-medium text-slate-300">{label}</span>
          <span className="text-xs text-slate-500">({count})</span>
        </div>
        <span className="text-sm font-semibold text-slate-200">₹{amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}/mo</span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-700 ease-out`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/* ── Chatbot Component (Backend API) ── */
function Chatbot({ subs, totalMonthly, totalYearly, savings, unusedCount, underusedCount, activeCount, underusedSavings }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hi! 👋 I'm your SubTracker AI assistant. Ask me anything about your subscriptions, spending, or savings!" },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const clearChat = () => {
    setMessages([{ role: 'bot', text: "Hi! 👋 I'm your SubTracker AI assistant. Ask me anything about your subscriptions, spending, or savings!" }]);
    setChatHistory([]);
  };

  /* Prepare subscription data to send to backend */
  function getSubData() {
    return {
      subs: subs.map((s) => ({
        name: s.name, cost: s.cost, cycle: s.cycle, usage: s.usage,
        status: getStatus(s.usage), recommendation: getRecommendation(getStatus(s.usage)),
      })),
      totalMonthly: Math.round(totalMonthly),
      totalYearly: Math.round(totalYearly),
      savings: Math.round(savings),
      activeCount, underusedCount, unusedCount,
    };
  }

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { role: 'user', text: trimmed }]);
    setInput('');
    setTyping(true);

    try {
      const res = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: chatHistory,
          subscriptionData: getSubData(),
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || `Server error ${res.status}`);

      const reply = data.reply;
      setChatHistory((prev) => [...prev, { role: 'user', content: trimmed }, { role: 'assistant', content: reply }]);
      setMessages((prev) => [...prev, { role: 'bot', text: reply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'bot', text: `⚠️ ${err.message}\n\nMake sure the backend is running:\n  node server.cjs` }]);
    } finally {
      setTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-[370px] max-w-[calc(100vw-2rem)] h-[min(480px,70vh)] glass-strong rounded-2xl flex flex-col overflow-hidden shadow-2xl shadow-indigo-500/10 animate-fade-in-up border border-white/10">
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b border-white/10 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 shrink-0">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0a0a1a]" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-white">SubTracker AI</h4>
              <p className="text-[11px] text-slate-400">AI Assistant • Online</p>
            </div>
            {messages.length > 1 && (
              <button onClick={clearChat} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer" title="Clear chat">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            )}
            <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-[13px] leading-relaxed whitespace-pre-line break-words ${
                  m.role === 'user'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-md'
                    : 'bg-white/[0.06] text-slate-200 border border-white/5 rounded-bl-md'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-white/[0.06] border border-white/5 px-4 py-3 rounded-2xl rounded-bl-md flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-white/10 shrink-0">
            <div className="flex items-center gap-2">
              <input id="chat-input" type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Ask about your subscriptions..." className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all" />
              <button id="btn-chat-send" onClick={handleSend} disabled={!input.trim()} className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20 cursor-pointer active:scale-90">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
            </div>
            <p className="text-[10px] text-slate-600 mt-1 text-center">Domain-locked to subscription queries only</p>
          </div>
        </div>
      )}

      {/* Toggle */}
      <button id="btn-chat-toggle" onClick={() => setOpen(!open)} className="group w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer relative">
        {!open && unusedCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#0a0a1a]">{unusedCount}</span>
        )}
        {open ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
        )}
      </button>
    </div>
  );
}
