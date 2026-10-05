import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { Bell, CheckCircle2, AlertCircle, Info, ShieldAlert, Check } from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const { myNotifications, markNotificationAsRead, markAllNotificationsAsRead, activeRole, sendNotification, addToast } = useApp();
  const roleFiltered = myNotifications;
  const [audience, setAudience] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [formErr, setFormErr] = useState('');
  const [sentMsg, setSentMsg] = useState('');
  const handleSend = () => {
    setSentMsg('');
    if (!audience) return setFormErr('Please choose who should receive this notification.');
    if (!title.trim()) return setFormErr('Please enter a title.');
    if (!message.trim()) return setFormErr('Please enter a message.');
    setFormErr('');
    sendNotification(audience as 'all', title.trim(), message.trim());
    setSentMsg('Notification sent.');
    addToast('Notification sent.', title.trim(), 'success');
    setAudience(''); setTitle(''); setMessage('');
  };
  const heading = activeRole === 'admin' ? 'Send Notifications' : activeRole === 'security' ? 'Security Alerts' : 'Notifications';

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-amber-600" />;
      case 'alert':
        return <ShieldAlert className="w-5 h-5 text-rose-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-heading">
            {heading}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time permit updates, ALPR entry triggers, and campus parking alerts
          </p>
        </div>
        {roleFiltered.some((n) => !n.isRead) && (
          <button
            onClick={markAllNotificationsAsRead}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
          >
            <Check className="w-4 h-4" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {activeRole === 'admin' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-xs">
          <h3 className="font-bold text-sm text-slate-900">New Notification</h3>
          {formErr && <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 font-semibold">{formErr}</div>}
          {sentMsg && <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 font-semibold">{sentMsg}</div>}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Audience *</label>
            <select value={audience} onChange={(e) => setAudience(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg">
              <option value="">Choose recipients…</option>
              <option value="all">All students and staff</option>
              <option value="student">All students</option>
              <option value="staff">All staff</option>
              <option value="security">Security officers</option>
            </select>
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Title *</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Message *</label>
            <textarea rows={3} value={message} onChange={(e) => setMessage(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
          </div>
          <div className="flex justify-end">
            <button onClick={handleSend} className="py-2 px-5 rounded-lg bg-blue-950 text-white font-bold cursor-pointer">Send</button>
          </div>
        </div>
      )}

      {activeRole === 'admin' && <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">My Notifications</h3>}
      {/* List */}
      <div className="space-y-3">
        {roleFiltered.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
            <Bell className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <span>No notifications to display.</span>
          </div>
        ) : (
          roleFiltered.map((notif) => (
            <div
              key={notif.id}
              onClick={() => markNotificationAsRead(notif.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                notif.isRead
                  ? 'bg-white border-slate-200 text-slate-700'
                  : 'bg-blue-50/50 border-blue-200 shadow-xs'
              }`}
            >
              <div className="p-2 rounded-xl bg-white border border-slate-200 shrink-0">
                {getIcon(notif.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-bold text-sm text-slate-900">{notif.title}</h4>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap font-mono">{notif.timestamp}</span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notif.message}</p>
              </div>
              {!notif.isRead && (
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0 mt-2" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
