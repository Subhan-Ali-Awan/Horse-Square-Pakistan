import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { getApiUrl } from '../../config/api';
import {
  Stethoscope, Activity, Heart, Thermometer, Wind,
  Phone, MapPin, Building2, Send, Trash2, ChevronDown,
  ChevronUp, AlertTriangle, CheckCircle2, User, Bot
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Disease Context Map — injected into API calls when chips are selected
// ─────────────────────────────────────────────────────────────────────────────
const DISEASE_CONTEXTS = {
  anuria:      "The user has selected ANURIA (No Urine). This is a life-threatening emergency. Kidney failure, severe dehydration, urinary obstruction (stones), or toxins (acorns, red maple) are likely causes. [Source: Merck Veterinary Manual, Equine Urinary Disorders]",
  sweating:    "The user has selected HEAVY SWEATING. Possible causes: heat stress, pain, shock, Cushing's disease (PPID), electrolyte imbalance, Trypanosomiasis (Surra — common in Pakistan), or anxiety. [Source: Equine Internal Medicine, Reed, Bayly, Sellon]",
  coughing:    "The user has selected COUGHING. Differential: dust irritation (RAO/heaves), viral infection (EHV, influenza, strangles), allergies, bacterial pneumonia, aspiration, or choke-related aspiration. [Source: Merck Veterinary Manual, Equine Respiratory]",
  fever:       "The user has selected HIGH FEVER. Normal equine temperature: 99–101.5°F (37.2–38.6°C). Causes: viral respiratory (EHV, influenza), bacterial infection (pneumonia, wound sepsis), tick-borne disease (Lyme, Anaplasma), or Surra. [Source: Merck Veterinary Manual, Equine Fever]",
  refusing:    "The user has selected REFUSING FEED. Causes: dental pain (sharp points, hooks, wolf teeth), gastric ulcers (90% of performance horses), colic, fever, choke, metabolic crisis, or environmental stress. [Source: AAEP Guidelines, Equine Gastric Ulcer Syndrome]",
  footswelling:"The user has selected FOOT SWELLING. Localized: abscess, bruise, puncture wound. Generalized bilateral: cellulitis, lymphangitis, vasculitis. Hot hoof + strong digital pulse = LAMINITIS (emergency). [Source: Adams and Stashak's Lameness in Horses, 7th Ed]",
  thrush:      "The user has selected THRUSH. Bacterial (Fusobacterium necrophorum) infection of the frog and central/lateral sulci. Presents as black, tar-like discharge with fetid odor. Common in wet/dirty environments with poor hoof care. [Source: Merck Veterinary Manual, Equine Hoof Disorders]",
  epm:         "The user has selected EPM (Equine Protozoal Myeloencephalitis). Caused by Sarcocystis neurona via opossum fecal contamination of feed/water. Progressive neurological disease attacking brain and spinal cord. Fatal if untreated. [Source: Equine Internal Medicine, Reed, Bayly, Sellon, Ch. 12]",
  uveitis:     "The user has selected EYE INFECTION / UVEITIS. Equine Recurrent Uveitis (ERU) is the #1 cause of blindness in horses. Signs: blepharospasm, epiphora, corneal cloudiness/edema, miosis, photophobia. Requires urgent ophthalmic evaluation. [Source: Veterinary Clinics of North America: Equine Practice, Equine Ophthalmology]",
  choke:       "The user has selected CHOKE. Esophageal obstruction — food (grain/hay pellets) impacted in esophagus (NOT trachea). Horse cannot swallow, extends neck, feed/saliva discharges from nostrils. Aspiration pneumonia is a severe secondary risk. Requires immediate veterinary intervention. [Source: Merck Veterinary Manual, Equine Esophageal Obstruction]",
};

const DISEASE_CHIPS = [
  { key: 'anuria',       label: 'Anuria (No Urine)',        icon: '🚫', emergency: true  },
  { key: 'choke',        label: 'Choke',                    icon: '😵', emergency: true  },
  { key: 'uveitis',      label: 'Eye Infection / Uveitis',  icon: '👁️', emergency: false },
  { key: 'footswelling', label: 'Foot Swelling',            icon: '🦶', emergency: false },
  { key: 'fever',        label: 'High Fever',               icon: '🌡️', emergency: false },
  { key: 'sweating',     label: 'Heavy Sweating',           icon: '💦', emergency: false },
  { key: 'coughing',     label: 'Coughing',                 icon: '😤', emergency: false },
  { key: 'refusing',     label: 'Refusing Feed',            icon: '🥕', emergency: false },
  { key: 'thrush',       label: 'Thrush',                   icon: '🦠', emergency: false },
  { key: 'epm',          label: 'EPM',                      icon: '🧠', emergency: false },
];

// ─────────────────────────────────────────────────────────────────────────────
// Markdown renderer — bold, lists, confidence badges
// ─────────────────────────────────────────────────────────────────────────────
function renderMarkdown(text) {
  // Detect emergency
  const isEmergency = /stop\.\s*this is an emergency/i.test(text);

  // Parse [Confidence: X] and [Recommended Next Step: X]
  const confidenceMatch = text.match(/\[Confidence:\s*(HIGH|MODERATE|LOW)\]/i);
  const nextStepMatch   = text.match(/\[Recommended Next Step:\s*([^\]]+)\]/i);

  // Strip badges from body text
  let body = text
    .replace(/\[Confidence:\s*(HIGH|MODERATE|LOW)\]/gi, '')
    .replace(/\[Recommended Next Step:\s*([^\]]+)\]/gi, '')
    .trim();

  // Convert **bold** → <strong>
  body = body.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Convert numbered list lines
  body = body.replace(/^(\d+)\.\s+(.+)$/gm, '<li class="ml-4 mb-1"><span class="font-bold text-amber-600 mr-1">$1.</span>$2</li>');

  // Convert paragraphs (double newlines)
  const paragraphs = body.split(/\n\n+/);
  const htmlParts = paragraphs.map((para) => {
    if (para.includes('<li')) return `<ul class="space-y-1 my-2">${para}</ul>`;
    const withLineBreaks = para.replace(/\n/g, '<br/>');
    return `<p class="mb-3 leading-relaxed">${withLineBreaks}</p>`;
  });

  return { html: htmlParts.join(''), isEmergency, confidenceMatch, nextStepMatch };
}

// ─────────────────────────────────────────────────────────────────────────────
// Single message bubble
// ─────────────────────────────────────────────────────────────────────────────
function MessageBubble({ msg }) {
  const isUser = msg.role === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end mb-4 animate-fade-up">
        <div className="max-w-[80%] sm:max-w-[70%]">
          <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-lg">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
          </div>
          <p className="text-[10px] text-slate-400 font-medium mt-1 text-right pr-1">You</p>
        </div>
        <div className="w-7 h-7 rounded-full bg-[#0f172a] border-2 border-amber-400/40 flex items-center justify-center ml-2 shrink-0 mt-1">
          <User className="w-3.5 h-3.5 text-amber-400" />
        </div>
      </div>
    );
  }

  const { html, isEmergency, confidenceMatch, nextStepMatch } = renderMarkdown(msg.content);

  const confidenceLevel = confidenceMatch?.[1]?.toUpperCase();
  const confidenceColor = {
    HIGH:     'bg-emerald-100 text-emerald-800 border-emerald-300',
    MODERATE: 'bg-amber-100 text-amber-800 border-amber-300',
    LOW:      'bg-red-100 text-red-800 border-red-300',
  }[confidenceLevel] || 'bg-slate-100 text-slate-700 border-slate-200';

  if (isEmergency) {
    return (
      <div className="flex mb-5 animate-fade-up">
        <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center mr-3 shrink-0 mt-1 shadow-lg">
          <AlertTriangle className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <div className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl rounded-tl-sm px-5 py-4 shadow-xl border border-red-500">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-red-200 shrink-0" />
              <span className="text-xs font-black text-red-200 uppercase tracking-widest">Emergency Alert</span>
            </div>
            <div
              className="text-sm leading-relaxed prose-emergency"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
          <p className="text-[10px] text-slate-400 font-medium mt-1 pl-1">Dr. Max Hartwell</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex mb-5 animate-fade-up">
      <div className="w-8 h-8 rounded-full bg-[#0f172a] border-2 border-amber-400/50 flex items-center justify-center mr-3 shrink-0 mt-1 shadow-md">
        <span className="text-sm">🩺</span>
      </div>
      <div className="flex-1 max-w-[85%] sm:max-w-[80%]">
        <div className="bg-white rounded-2xl rounded-tl-sm px-5 py-4 shadow-md border border-slate-200">
          <div
            className="text-sm text-slate-800 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: html }}
          />
          {/* Confidence + Next Step Badges */}
          {(confidenceLevel || nextStepMatch) && (
            <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-slate-100">
              {confidenceLevel && (
                <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${confidenceColor}`}>
                  <CheckCircle2 className="w-3 h-3" />
                  Confidence: {confidenceLevel}
                </span>
              )}
              {nextStepMatch && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  <Activity className="w-3 h-3 text-slate-500" />
                  {nextStepMatch[1].trim()}
                </span>
              )}
            </div>
          )}
        </div>
        <p className="text-[10px] text-slate-400 font-medium mt-1 pl-1">Dr. Max Hartwell, B.V.Sc.</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Typing indicator
// ─────────────────────────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex mb-4 animate-fade-up">
      <div className="w-8 h-8 rounded-full bg-[#0f172a] border-2 border-amber-400/50 flex items-center justify-center mr-3 shrink-0 shadow-md">
        <span className="text-sm">🩺</span>
      </div>
      <div className="bg-white rounded-2xl rounded-tl-sm px-5 py-4 shadow-md border border-slate-200">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-400 font-medium mr-1">Dr. Max is reviewing</span>
          <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main VetDoctor Page
// ─────────────────────────────────────────────────────────────────────────────
export const VetDoctor = () => {
  useScrollReveal('.reveal-on-scroll');

  // ── Chat State ────────────────────────────────────────────────────
  const [messages,         setMessages]         = useState([]);
  const [horseInfo,        setHorseInfo]        = useState({ name: '', breed: '', age: '', sex: '' });
  const [selectedDiseases, setSelectedDiseases] = useState([]);
  const [isTyping,         setIsTyping]         = useState(false);
  const [inputText,        setInputText]        = useState('');
  const [showDisclaimer,   setShowDisclaimer]   = useState(true);
  const [showHorseInfo,    setShowHorseInfo]    = useState(false);

  // ── Refs ──────────────────────────────────────────────────────────
  const messagesEndRef = useRef(null);
  const textareaRef    = useRef(null);

  // ── Local Storage persistence ─────────────────────────────────────
  useEffect(() => {
    try {
      const saved = localStorage.getItem('drMaxChat_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        setMessages(parsed.messages || []);
        setShowDisclaimer(parsed.showDisclaimer !== false);
      }
    } catch { /* ignore parse errors */ }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('drMaxChat_v2', JSON.stringify({ messages, showDisclaimer }));
    } catch { /* ignore storage errors */ }
  }, [messages, showDisclaimer]);

  // ── Auto-scroll ───────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // ── Auto-resize textarea ──────────────────────────────────────────
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [inputText]);

  // ── Disease chip toggle ───────────────────────────────────────────
  const toggleDisease = (key) => {
    setSelectedDiseases((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  // ── Clear chat ────────────────────────────────────────────────────
  const clearChat = () => {
    setMessages([]);
    setSelectedDiseases([]);
    setInputText('');
    setShowDisclaimer(true);
    localStorage.removeItem('drMaxChat_v2');
  };

  // ── Send message ──────────────────────────────────────────────────
  const sendMessage = useCallback(async (text) => {
    const trimmed = text.trim();
    if (!trimmed && selectedDiseases.length === 0) return;
    if (isTyping) return;

    const diseaseContext = selectedDiseases.length > 0
      ? selectedDiseases.map((k) => DISEASE_CONTEXTS[k]).join('\n\n')
      : '';

    const userMessage = { role: 'user', content: trimmed || `Selected symptoms: ${selectedDiseases.join(', ')}` };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInputText('');
    setSelectedDiseases([]);
    setIsTyping(true);

    try {
      const res = await fetch(getApiUrl('/api/vet/chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          horseInfo,
          diseaseContext,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (err) {
      console.error('[DrMax] Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'I apologize — I am temporarily unable to connect to my clinical knowledge base. For any urgent equine concern, please contact your local veterinarian immediately. I will be available again momentarily.',
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  }, [messages, selectedDiseases, horseInfo, isTyping]);

  // ── Keyboard handler ──────────────────────────────────────────────
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputText);
    }
  };

  // ── Vital signs data ──────────────────────────────────────────────
  const vitalSigns = [
    { label: 'Body Temperature', range: '99°F – 101.5°F', metric: '(37.2°C – 38.6°C)', icon: <Thermometer className="w-5 h-5 text-red-500" />, desc: 'Use rectal thermometer. Higher than 102°F indicates fever.' },
    { label: 'Heart Rate (Pulse)', range: '28 – 44 bpm', metric: 'beats per minute', icon: <Heart className="w-5 h-5 text-rose-500 animate-pulse" />, desc: 'Measure at lower jaw or behind left elbow. High pulse indicates pain.' },
    { label: 'Respiration Rate', range: '8 – 16 breaths/min', metric: 'breaths per minute', icon: <Wind className="w-5 h-5 text-cyan-500" />, desc: 'Watch flank movements. Elevated rate suggests heat stress or respiratory illness.' },
  ];

  const localVets = [
    { name: 'UVAS Equine Clinic & Surgery Center', doctor: 'Dr. Aneela Zameer Durrani', city: 'Lahore', phone: '+924299211374', location: 'Outfall Road, Lahore' },
    { name: 'Lahore Race Club Equine Hospital', doctor: 'Dr. Muhammad Asim', city: 'Lahore', phone: '+923008456789', location: 'Kot Lakhpat, Lahore' },
    { name: 'Richmond Equine Clinic & Surgery', doctor: 'Dr. Farhan Ali', city: 'Karachi', phone: '+923001234567', location: 'Malir Cantt, Karachi' },
    { name: 'RVFC Army Equine Hospital', doctor: 'Col. Dr. Tariq Mahmood', city: 'Rawalpindi', phone: '+92515561234', location: 'Westridge, Rawalpindi' },
    { name: 'NARC Equine & Livestock Hospital', doctor: 'Dr. Khalid Naeem', city: 'Islamabad', phone: '+92519255012', location: 'Park Road, Islamabad' },
    { name: 'UAF Veterinary Teaching Hospital', doctor: 'Dr. Muhammad Tariq', city: 'Faisalabad', phone: '+92419200161', location: 'Jail Road, Faisalabad' },
    { name: 'Karachi Race Club Veterinary Hospital', doctor: 'Dr. Syed Muhammad Naeem', city: 'Karachi', phone: '+923332345678', location: 'Dehih, Karachi' },
    { name: 'Army Stud Farm Vet Center (Mona)', doctor: 'Maj. Dr. Shaukat Ali', city: 'Sargodha', phone: '+92483211234', location: 'Mona Depot, Sargodha' },
  ];

  // ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 px-4 sm:px-6 lg:px-8" style={{ fontFamily: "'Inter', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

      <div className="max-w-7xl mx-auto space-y-8">

        {/* ── Page Header ── */}
        <div className="liquid-glass-dark rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-10 text-white shadow-2xl reveal-on-scroll relative overflow-hidden liquid-glass-sheen">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
                <Stethoscope className="w-4 h-4" />
                <span>AI Equine Telemedicine — Dr. Max Hartwell</span>
              </div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Vet Doctor & Emergency Triage
              </h1>
              <p className="text-slate-300 max-w-2xl text-xs sm:text-sm leading-relaxed">
                Consult Dr. Max — a board-certified equine clinician with 50 years of experience. Describe your horse's symptoms in English or Roman Urdu for an expert assessment with clinical citations.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/20 text-center shrink-0">
              <span className="text-[10px] font-black text-amber-300 uppercase tracking-wider block mb-1">Emergency Helpline</span>
              <a href="tel:+924299211374" className="text-lg sm:text-2xl font-black text-white hover:text-amber-300 transition flex items-center justify-center gap-2">
                <Phone className="w-5 h-5 text-amber-400" />
                <span>+92 42 99211374</span>
              </a>
            </div>
          </div>
        </div>

        {/* ── Vital Signs Reference ── */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xl space-y-6 reveal-on-scroll">
          <div className="border-b pb-4">
            <h2 className="text-lg sm:text-xl font-black text-[#0F172A] flex items-center gap-2">
              <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-[#D4AF37]" /> Normal Equine Vital Signs (TPR Reference)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Compare your horse's current readings against healthy adult equine standards before contacting a vet.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {vitalSigns.map((vital, idx) => (
              <div key={idx} className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-700 uppercase">{vital.label}</span>
                  {vital.icon}
                </div>
                <div className="space-y-0.5">
                  <div className="text-lg sm:text-xl font-black text-[#0F172A]">{vital.range}</div>
                  <div className="text-[10px] font-bold text-slate-400">{vital.metric}</div>
                </div>
                <p className="text-xs text-slate-500 font-medium pt-1 border-t border-slate-200">{vital.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Dr. Max Chat Interface ── */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden" style={{ boxShadow: '0 4px 40px rgba(0,0,0,0.07)' }}>

          {/* Chat Header */}
          <div className="bg-gradient-to-r from-[#0f172a] to-[#1e293b] px-5 sm:px-7 py-4 sm:py-5 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-amber-400/20 border-2 border-amber-400/60 flex items-center justify-center text-xl shadow-lg">
                  🩺
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-[#1e293b] animate-pulse"></span>
              </div>
              <div>
                <h2 className="text-white font-black text-sm sm:text-base leading-tight">Dr. Max Hartwell</h2>
                <p className="text-amber-400/80 text-[10px] sm:text-xs font-semibold">Board-Certified Equine Veterinarian • 50 Years Experience</p>
                <p className="text-emerald-400 text-[10px] font-bold flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                  Available Now
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {messages.length > 0 && (
                <button
                  onClick={clearChat}
                  title="Clear conversation"
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-red-400 transition cursor-pointer border border-white/10"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Horse Info Bar */}
          <div className="bg-slate-50 border-b border-slate-200 px-5 sm:px-7 py-3">
            <button
              onClick={() => setShowHorseInfo(!showHorseInfo)}
              className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-amber-600 transition cursor-pointer"
            >
              {showHorseInfo ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              Horse Details (Optional — helps Dr. Max personalize advice)
              {(horseInfo.name || horseInfo.breed || horseInfo.age || horseInfo.sex) && (
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full text-[10px] font-black border border-amber-200">Filled</span>
              )}
            </button>
            {showHorseInfo && (
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 animate-fade-up">
                <input
                  type="text"
                  placeholder="Horse Name"
                  value={horseInfo.name}
                  onChange={(e) => setHorseInfo((p) => ({ ...p, name: e.target.value }))}
                  className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none bg-white transition"
                />
                <input
                  type="text"
                  placeholder="Breed (e.g. Arabian)"
                  value={horseInfo.breed}
                  onChange={(e) => setHorseInfo((p) => ({ ...p, breed: e.target.value }))}
                  className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none bg-white transition"
                />
                <input
                  type="text"
                  placeholder="Age (e.g. 8 years)"
                  value={horseInfo.age}
                  onChange={(e) => setHorseInfo((p) => ({ ...p, age: e.target.value }))}
                  className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none bg-white transition"
                />
                <select
                  value={horseInfo.sex}
                  onChange={(e) => setHorseInfo((p) => ({ ...p, sex: e.target.value }))}
                  className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none bg-white transition text-slate-600"
                >
                  <option value="">Sex</option>
                  <option value="Stallion">Stallion</option>
                  <option value="Mare">Mare</option>
                  <option value="Gelding">Gelding</option>
                  <option value="Filly">Filly</option>
                  <option value="Colt">Colt</option>
                  <option value="Foal">Foal</option>
                </select>
              </div>
            )}
          </div>

          {/* Disease Quick-Select Chips */}
          <div className="bg-slate-50/80 border-b border-slate-200 px-5 sm:px-7 py-3">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">Quick Symptom Select — click to add clinical context</p>
            <div className="flex flex-wrap gap-1.5">
              {DISEASE_CHIPS.map((chip) => {
                const isSelected = selectedDiseases.includes(chip.key);
                return (
                  <button
                    key={chip.key}
                    onClick={() => toggleDisease(chip.key)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition cursor-pointer select-none
                      ${isSelected
                        ? chip.emergency
                          ? 'bg-red-600 text-white border-red-600 shadow-md'
                          : 'bg-amber-400 text-slate-900 border-amber-400 shadow-md'
                        : chip.emergency
                          ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-amber-300 hover:text-amber-700'
                      }`}
                  >
                    <span>{chip.icon}</span>
                    <span>{chip.label}</span>
                  </button>
                );
              })}
            </div>
            {selectedDiseases.length > 0 && (
              <p className="text-[10px] text-amber-700 font-semibold mt-2">
                {selectedDiseases.length} condition{selectedDiseases.length > 1 ? 's' : ''} selected — context will be sent with your next message
              </p>
            )}
          </div>

          {/* Messages Area */}
          <div className="h-[420px] sm:h-[500px] overflow-y-auto px-5 sm:px-7 py-5 bg-[#f8fafc] scroll-smooth" id="drmax-chat-messages">

            {/* Disclaimer */}
            {showDisclaimer && (
              <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-sm animate-fade-up">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0">
                    <Stethoscope className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-amber-900 mb-1">Clinical Consultation Notice</h3>
                    <p className="text-xs text-amber-800 leading-relaxed font-medium">
                      Dr. Max provides educational guidance and triage support based on 50 years of equine clinical experience. He does not replace an in-person examination by a licensed veterinarian. Always consult your veterinarian before starting, stopping, or changing any treatment. In emergencies, contact your vet immediately.
                    </p>
                    <button
                      onClick={() => setShowDisclaimer(false)}
                      className="mt-3 px-5 py-2 bg-[#0f172a] hover:bg-[#1e293b] text-amber-400 text-xs font-black rounded-xl transition cursor-pointer border border-amber-400/30 shadow"
                    >
                      I Understand — Begin Consultation
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Empty state */}
            {!showDisclaimer && messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-48 text-center space-y-3 animate-fade-up">
                <div className="w-16 h-16 rounded-full bg-[#0f172a]/5 border-2 border-slate-200 flex items-center justify-center text-3xl">
                  🩺
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-700">Good day. I'm Dr. Max Hartwell.</p>
                  <p className="text-xs text-slate-400 font-medium mt-1 max-w-xs">Describe your horse's symptoms — in English or Roman Urdu. I'm here to help.</p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {['My horse is limping on his left front.', 'Mere ghore ko tez bukhar hai.', 'My horse hasn\'t eaten since morning.'].map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="px-3 py-1.5 bg-white border border-slate-200 hover:border-amber-400 rounded-xl text-xs font-medium text-slate-600 hover:text-amber-700 transition cursor-pointer shadow-sm"
                    >
                      "{q}"
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Message thread */}
            {messages.map((msg, idx) => (
              <MessageBubble key={idx} msg={msg} />
            ))}

            {/* Typing indicator */}
            {isTyping && <TypingIndicator />}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-slate-200 bg-white px-5 sm:px-7 py-4">
            <div className="flex items-end gap-3">
              <textarea
                ref={textareaRef}
                rows={1}
                placeholder={showDisclaimer ? 'Please read the notice above before consulting...' : 'Describe symptoms in English or Roman Urdu... (Enter to send, Shift+Enter for new line)'}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isTyping || showDisclaimer}
                className="flex-1 resize-none px-4 py-3 text-sm font-medium rounded-2xl border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none bg-slate-50 focus:bg-white transition text-slate-800 placeholder-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ minHeight: '48px', maxHeight: '120px', overflowY: 'auto' }}
              />
              <button
                onClick={() => sendMessage(inputText)}
                disabled={isTyping || showDisclaimer || (!inputText.trim() && selectedDiseases.length === 0)}
                className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 disabled:opacity-40 disabled:cursor-not-allowed text-slate-900 flex items-center justify-center shadow-lg transition cursor-pointer shrink-0 active:scale-95"
                title="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-[10px] text-slate-400 font-medium mt-2 text-center">
              Dr. Max does not prescribe medication. Always consult a licensed equine vet for treatment decisions.
            </p>
          </div>
        </div>

        {/* ── Emergency Vet Directory ── */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xl space-y-6 reveal-on-scroll">
          <div className="border-b pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-[#0F172A] flex items-center gap-2">
                <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#D4AF37]" /> Emergency Equine Hospitals in Pakistan
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">Verified equine surgery centers and veterinary teaching clinics across major cities.</p>
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200 self-start sm:self-auto">24/7 Contacts</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {localVets.map((vet, idx) => (
              <div key={idx} className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between hover:border-[#D4AF37] transition">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-slate-200 text-slate-700 rounded-md">{vet.city}</span>
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <h3 className="text-sm font-black text-[#0F172A] leading-snug">{vet.name}</h3>
                  <p className="text-xs font-bold text-slate-600">{vet.doctor}</p>
                  <p className="text-[11px] text-slate-400 font-medium line-clamp-2">{vet.location}</p>
                </div>
                <a
                  href={`tel:${vet.phone}`}
                  className="w-full py-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-[#D4AF37] font-black rounded-xl text-xs transition flex items-center justify-center gap-2 shadow"
                >
                  <Phone className="w-3.5 h-3.5" /> Call Emergency
                </a>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
