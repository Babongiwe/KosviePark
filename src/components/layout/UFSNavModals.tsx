import React, { useState } from 'react';
import {
  X,
  Mail,
  Phone,
  Send,
  Sparkles,
  Bot,
  User,
  Shield,
  Building,
  GraduationCap,
  Accessibility,
  ExternalLink,
  CheckCircle2,
  HelpCircle,
  Car,
  Layers,
  BookOpen,
  Calendar,
  Grid,
} from 'lucide-react';
import { UFSBrandLogo } from '../common/UFSBrandLogo';

// 1. App Launcher 3x3 Grid Dropdown / Modal
export const AppLauncherModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSelectApp: (app: string) => void;
}> = ({ isOpen, onClose, onSelectApp }) => {
  if (!isOpen) return null;

  const ufsApps = [
    {
      id: 'kovsiepark',
      name: 'KovsiePark',
      desc: 'Smart Parking & ALPR Boom Gates',
      icon: Car,
      color: 'bg-[#C8102E] text-white',
      badge: 'Active App',
    },
    {
      id: 'kovsielife',
      name: 'KovsieLife Portal',
      desc: 'Student Life, Timetables & Notices',
      icon: GraduationCap,
      color: 'bg-[#002B49] text-white',
    },
    {
      id: 'blackboard',
      name: 'Blackboard LMS',
      desc: 'e-Learning, Modules & Coursework',
      icon: BookOpen,
      color: 'bg-amber-600 text-white',
    },
    {
      id: 'selfservice',
      name: 'Student Self-Service',
      desc: 'Academic Records, Registration & Fees',
      icon: User,
      color: 'bg-emerald-700 text-white',
    },
    {
      id: 'cuads',
      name: 'CUADS Universal Access',
      desc: 'Disability & Accessibility Support',
      icon: Accessibility,
      color: 'bg-blue-700 text-white',
    },
    {
      id: 'security',
      name: 'Campus Security 24/7',
      desc: 'Emergency Assistance & Patrols',
      icon: Shield,
      color: 'bg-indigo-900 text-white',
    },
  ];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-start justify-end sm:justify-center pt-16 sm:pt-20 px-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-5 animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Grid className="w-5 h-5 text-[#002B49]" />
            <h3 className="font-bold text-sm text-slate-900 font-serif">
              UFS Digital Services & Systems
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {ufsApps.map((app) => {
            const Icon = app.icon;
            return (
              <button
                key={app.id}
                onClick={() => {
                  onSelectApp(app.id);
                  onClose();
                }}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-[#002B49] bg-slate-50/70 hover:bg-blue-50/50 transition-all text-left group flex flex-col justify-between cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-8 h-8 rounded-lg ${app.color} flex items-center justify-center shadow-xs`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {app.badge && (
                    <span className="text-[9px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.5 rounded">
                      {app.badge}
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 group-hover:text-[#002B49]">
                    {app.name}
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                    {app.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 text-center">
          <span className="text-[11px] text-slate-400 italic font-serif">
            University of the Free State • In Veritate Sapientiae Lux
          </span>
        </div>
      </div>
    </div>
  );
};

// 2. Message from Senior Director Modal
export const DirectorMessageModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-6">
        <div className="bg-[#002B49] text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <UFSBrandLogo size="sm" showSubtitle={false} showSlogan={false} theme="dark" />
            <div>
              <h2 className="text-base font-bold font-serif tracking-tight">
                Message from the Senior Director: Support Services
              </h2>
              <p className="text-xs text-amber-300 font-serif italic">
                University of the Free State (UFS)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 text-xs sm:text-sm text-slate-700 space-y-4 max-h-[70vh] overflow-y-auto leading-relaxed">
          <div className="p-4 bg-blue-50/80 rounded-xl border border-blue-200">
            <h3 className="font-bold text-sm text-[#002B49] mb-1 font-serif">
              &quot;Inspiring Excellence Through Safe, Orderly, and Accessible Campus Mobility&quot;
            </h3>
            <p className="text-xs text-slate-600">
              Department of Support Services & University Law Enforcement
            </p>
          </div>

          <p>
            Dear Kovsie Students, Staff Members, and Esteemed Visitors,
          </p>
          <p>
            Welcome to <strong>KovsiePark</strong>, the University of the Free State&apos;s intelligent campus parking and access management platform. Our mission is to maintain an orderly, safe, and accessible campus environment across the <strong>Bloemfontein Main Campus</strong>, <strong>Qwaqwa Campus</strong>, and <strong>South Campus</strong>.
          </p>
          <p>
            Unlike many universities situated in crowded metropolitan centers, the UFS is privileged to provide extensive, well-maintained parking facilities. To sustain this privilege, we have deployed automated Automatic License Plate Recognition (ALPR) boom gates and dedicated accessible parking protocols in close collaboration with the Centre for Universal Access and Disability Support (CUADS).
          </p>
          <p>
            We kindly urge all members of the university community to adhere strictly to parking allocations, respect reserved disability bays, and observe the 15-minute courtesy grace period.
          </p>

          <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-900 font-serif">Senior Director: Support Services</p>
              <p className="text-xs text-slate-500">University of the Free State</p>
            </div>
            <span className="text-xs font-serif italic text-amber-800 font-medium">
              In Veritate Sapientiae Lux
            </span>
          </div>
        </div>

        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#002B49] hover:bg-[#001A30] text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Close Message
          </button>
        </div>
      </div>
    </div>
  );
};

// 3. Meet the Team Modal
export const MeetTheTeamModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const team = [
    {
      name: 'Dr. Kobus van der Merwe',
      role: 'Senior Director: University Support Services',
      email: 'supportservices@ufs.ac.za',
      phone: '+27 51 401 2100',
      office: 'Main Admin Building, Bloemfontein Campus',
      avatarColor: 'bg-[#002B49]',
    },
    {
      name: 'Mrs. Nomsa Khumalo',
      role: 'Head of Parking Administration & Zoning',
      email: 'parking@ufs.ac.za',
      phone: '+27 51 401 3555',
      office: 'KovsiePark Office, Visitors Centre',
      avatarColor: 'bg-[#C8102E]',
    },
    {
      name: 'Capt. Johan Botha',
      role: 'Chief of Campus Security & ALPR Enforcement',
      email: 'security@ufs.ac.za',
      phone: '+27 51 401 2911',
      office: '24/7 Security Control Centre, Gate 5',
      avatarColor: 'bg-blue-900',
    },
    {
      name: 'Ms. Lerato Moloi',
      role: 'CUADS Universal Accessible Parking Coordinator',
      email: 'cuads@ufs.ac.za',
      phone: '+27 51 401 3713',
      office: 'Centre for Universal Access, Sasol Library',
      avatarColor: 'bg-emerald-800',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-6">
        <div className="bg-[#002B49] text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <UFSBrandLogo size="sm" showSubtitle={false} showSlogan={false} theme="dark" />
            <div>
              <h2 className="text-base font-bold font-serif tracking-tight">
                Meet the Parking & Support Services Team
              </h2>
              <p className="text-xs text-amber-300 font-serif italic">
                University of the Free State
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 text-xs sm:text-sm space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {team.map((member, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-10 h-10 rounded-full ${member.avatarColor} text-white font-bold flex items-center justify-center shadow-xs text-sm`}
                    >
                      {member.name.split(' ')[1]?.[0] || 'U'}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                        {member.name}
                      </h4>
                      <p className="text-[11px] text-blue-900 font-semibold">
                        {member.role}
                      </p>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    📍 {member.office}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <a
                    href={`mailto:${member.email}`}
                    className="text-blue-900 font-bold hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <Mail className="w-3 h-3 text-[#C8102E]" />
                    <span>{member.email}</span>
                  </a>
                  <a
                    href={`tel:${member.phone.replace(/\\s+/g, '')}`}
                    className="text-slate-700 font-semibold hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>{member.phone}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#002B49] hover:bg-[#001A30] text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// 4. Quick Mail Support Modal
export const QuickMailModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-[#002B49] text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Mail className="w-5 h-5 text-amber-400" />
            <h2 className="text-sm font-bold font-serif">
              Contact UFS Parking Support Desk
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {sent ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
            <h3 className="font-bold text-slate-900 text-sm">Inquiry Transmitted</h3>
            <p className="text-xs text-slate-600">
              Your inquiry has been routed to <strong>parking@ufs.ac.za</strong>. A representative will respond within 24 business hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
              <span className="text-[10px] uppercase font-bold text-blue-900 block mb-0.5">
                Direct Inquiries
              </span>
              <p className="text-slate-600">
                You can also email directly to <strong className="text-slate-900">parking@ufs.ac.za</strong> or call <strong className="text-slate-900">+27 51 401 9111</strong>.
              </p>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Subject</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Question regarding Zone B permit renewal or boom gate clearance"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002B49]"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Message</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please describe your parking question, license plate or campus location..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002B49]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#C8102E] hover:bg-[#A51C30] text-white font-bold inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send to Parking Desk</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

// 5. Quick KovsieBot Chat Support Modal
export const KovsieChatModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ sender: 'bot' | 'user'; text: string }[]>([
    {
      sender: 'bot',
      text: 'Hello! I am KovsieBot, your campus parking assistant. How can I assist you with permits, ALPR boom gates, zones, or CUADS accessible bays today?',
    },
  ]);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setInput('');

    setTimeout(() => {
      let reply = 'Thank you for your question. You can manage your permits in the Applications tab, consult the UFS Parking Map PDF in the Resources menu, or email parking@ufs.ac.za.';
      const lower = userText.toLowerCase();

      if (lower.includes('disability') || lower.includes('accessible') || lower.includes('cuads')) {
        reply = 'Accessible parking bays close to entrances are reserved for persons with disabilities. Applications must be submitted directly to CUADS via cuads@ufs.ac.za.';
      } else if (lower.includes('visitor') || lower.includes('guest')) {
        reply = 'Visitors can register at the Visitors Centre (+27 51 401 9111) for temporary access cards, or pre-register via the Visitor Portal.';
      } else if (lower.includes('gate') || lower.includes('alpr') || lower.includes('camera') || lower.includes('boom')) {
        reply = 'Our ALPR boom gate cameras automatically scan registered license plates upon approach and grant instant entry. A 15-minute courtesy grace period is granted for drop-offs.';
      } else if (lower.includes('fine') || lower.includes('citation') || lower.includes('violation')) {
        reply = 'Fines are issued for unauthorized zone parking, blocking red lines, or expired permits. Revenue collected is reinvested in campus security and road maintenance.';
      }

      setMessages((prev) => [...prev, { sender: 'bot', text: reply }]);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full h-[520px] shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-[#002B49] text-white p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-blue-950 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold font-serif">KovsieBot Parking Assistant</h2>
              <span className="text-[10px] text-emerald-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Online • UFS Smart Support
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat log */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-[#002B49] text-white rounded-tr-none'
                    : 'bg-white border border-slate-200 text-slate-800 shadow-2xs rounded-tl-none'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about permits, gates, CUADS..."
            className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002B49]"
          />
          <button
            type="submit"
            className="p-2 bg-[#002B49] hover:bg-[#001A30] text-white rounded-xl shadow-xs cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
