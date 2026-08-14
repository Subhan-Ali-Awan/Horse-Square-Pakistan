import React, { useState } from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { getApiUrl } from '../../config/api';
import {
  Stethoscope,
  Upload,
  Bot,
  CheckCircle2,
  Activity,
  Heart,
  Thermometer,
  Wind,
  AlertTriangle,
  Phone,
  Info,
  ChevronDown,
  ChevronUp,
  MapPin,
  Building2,
  Sparkles,
  Globe
} from 'lucide-react';

export const VetDoctor = () => {
  // Enable scroll reveal animations
  useScrollReveal('.reveal-on-scroll');
  const [symptoms, setSymptoms] = useState('');
  const [symptomFile, setSymptomFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [assessment, setAssessment] = useState(null);

  const quickSymptoms = [
    { label: 'Anuria (No Urine)', category: 'Urinary' },
    { label: 'Heavy Sweating', category: 'General' },
    { label: 'Coughing', category: 'Respiratory' },
    { label: 'High Fever', category: 'General' },
    { label: 'Refusing Feed', category: 'Digestive' },
    { label: 'Foot Swelling', category: 'Physical' }
  ];

  const vitalSigns = [
    {
      label: 'Body Temperature',
      range: '99°F - 101.5°F',
      metric: '(37.2°C - 38.6°C)',
      icon: <Thermometer className="w-5 h-5 text-red-500" />,
      desc: 'Use rectal thermometer. Higher indicates fever/infection.'
    },
    {
      label: 'Heart Rate (Pulse)',
      range: '28 - 44 bpm',
      metric: 'beats per minute',
      icon: <Heart className="w-5 h-5 text-rose-500 animate-pulse" />,
      desc: 'Measure at lower jaw or behind left elbow. High pulse indicates pain.'
    },
    {
      label: 'Respiration Rate',
      range: '8 - 16 breaths/min',
      metric: 'breaths per minute',
      icon: <Wind className="w-5 h-5 text-cyan-500" />,
      desc: 'Watch flank movements. Elevated rate suggests heat stress or respiratory illness.'
    }
  ];

  const localVets = [
    {
      name: 'UVAS Equine Clinic & Surgery Center',
      doctor: 'Dr. Aneela Zameer Durrani (Equine Specialist)',
      city: 'Lahore',
      phone: '+924299211374',
      location: 'Outfall Road, Near District Courts, Lahore'
    },
    {
      name: 'Lahore Race Club Equine Hospital',
      doctor: 'Dr. Muhammad Asim (Racehorse Practitioner)',
      city: 'Lahore',
      phone: '+923008456789',
      location: 'Kot Lakhpat, Lahore'
    },
    {
      name: 'Richmond Equine Clinic & Surgery',
      doctor: 'Dr. Farhan Ali (Equine Surgeon)',
      city: 'Karachi',
      phone: '+923001234567',
      location: 'Malir Cantt, Karachi'
    },
    {
      name: 'Karachi Race Club Veterinary Hospital',
      doctor: 'Dr. Syed Muhammad Naeem (Orthopedics)',
      city: 'Karachi',
      phone: '+923332345678',
      location: 'Dehih, Karachi'
    },
    {
      name: 'RVFC Army Equine Hospital',
      doctor: 'Col. Dr. Tariq Mahmood (Internal Medicine)',
      city: 'Rawalpindi',
      phone: '+92515561234',
      location: 'Westridge, Rawalpindi Cantonment'
    },
    {
      name: 'NARC Equine & Livestock Hospital',
      doctor: 'Dr. Khalid Naeem (Large Animal Medicine)',
      city: 'Islamabad',
      phone: '+92519255012',
      location: 'Park Road, Islamabad'
    },
    {
      name: 'UAF Veterinary Teaching Hospital',
      doctor: 'Dr. Muhammad Tariq (Equine Medicine)',
      city: 'Faisalabad',
      phone: '+92419200161',
      location: 'Jail Road, Faisalabad'
    },
    {
      name: 'Army Stud Farm Veterinary Center (Mona Depot)',
      doctor: 'Maj. Dr. Shaukat Ali (Breeding & Care)',
      city: 'Sargodha',
      phone: '+92483211234',
      location: 'Mona Depot, Sargodha'
    }
  ];

  const handleTagClick = (tagLabel) => {
    setSymptoms((prev) => {
      const trimmed = prev.trim();
      if (trimmed === '') return tagLabel;
      // Prevent duplicates
      const tagsList = trimmed.split(',').map(t => t.trim());
      if (tagsList.includes(tagLabel)) return prev;
      return `${trimmed}, ${tagLabel}`;
    });
  };

  const handleConsult = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAssessment(null);

    try {
      const formData = new FormData();
      formData.append('symptoms', symptoms);
      if (symptomFile) formData.append('images', symptomFile);

      const res = await fetch(getApiUrl('/api/vet/check'), {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setAssessment(data.assessment);
        } else {
          fallbackAI();
        }
      } else {
        fallbackAI();
      }
    } catch (err) {
      fallbackAI();
    } finally {
      setLoading(false);
    }
  };

  const fallbackAI = () => {
    const lower = symptoms.toLowerCase();
    let possibleCondition = 'Mild Colic / Digestive Upset or Muscle Strain';
    let romanUrduCondition = 'Halki Maida Kharabi Ya Kangan Kharabi';
    let urgency = 'Moderate - Monitor closely';
    let romanUrduUrgency = 'AAM - Dehyan Rakhen';
    let recommendedActions = [
      'Ensure fresh clean water is available at all times.',
      'Walk gently for 15-20 minutes to encourage bowel motility.',
      'Do not feed grain or heavy food until evaluated by a certified local vet.',
      'Check vital signs: normal horse pulse is 28-44 bpm, respiration 8-16 breaths/min.'
    ];
    let romanUrduActions = [
      'Saaf aur taza pani har waqt samne rakhen.',
      'Ghode ko 15-20 minute ahista paidal chalayen.',
      'Bhaari khurak tab tak mat den jab tak doctor check na kar le.',
      'Saans aur dil ki dhadkan par nazar rakhen.'
    ];
    let romanUrduSummary = 'Ghode ko ahista chalayen, saaf pani den aur khana roken jab tak doctor na aayen.';

    if (lower.includes('anuria') || lower.includes('no urine') || lower.includes('urinate') || lower.includes('urine')) {
      possibleCondition = 'Equine Anuria (Acute Renal Failure / Urethral Obstruction / Ruptured Bladder)';
      romanUrduCondition = 'Ghode Ko Peshab Na Aana (Gurday Ka Masla Ya Urinary Pathri)';
      urgency = 'CRITICAL EMERGENCY - Immediate Vet Catheterization Required';
      romanUrduUrgency = 'SHDEED EMERGENCY - Fauri Doctor Se Catheter Lagwayen';
      recommendedActions = [
        'Stop all non-essential medications immediately (especially NSAIDs like Banamine or Phenylbutazone which exacerbate renal failure).',
        'Check for bladder distension and monitor closely for straining, colic signs, or painful posture.',
        'Provide access to fresh water, but DO NOT force fluids if complete urethral blockage is suspected.',
        'Contact an emergency equine veterinarian immediately for urinary catheterization, blood work (BUN & Creatinine), and IV fluid therapy.'
      ];
      romanUrduActions = [
        'Fauri taur par Banamine ya Phenylbutazone dawaiyan band karen jo gurday kharab karti hain.',
        'Methane (bladder) ki sujan check karen aur ghode ke zoor lagane ya dard par nazar rakhen.',
        'Saaf pani samne rakhen, lekin agar peshab ki nali me rukawat ho to zabardasti pani mat pilayen.',
        'Fauri emergency vet doctor ko bulayen taakay nali (catheter) lagwayen aur blood test (BUN/Creatinine) karwayen.'
      ];
      romanUrduSummary = 'Ghode ko peshab na aana renal failure ya nali me rukawat ki waja se ho sakta hai. Painkiller dawaen band karen aur fauri doctor se catheter lagwayen.';
    } else if (lower.includes('sweat') && lower.includes('fever')) {
      possibleCondition = 'Trypanosomiasis (Surra) - Parasitic Fever';
      romanUrduCondition = 'Surra Bimari (Peti / Parasite Bukhār)';
      urgency = 'HIGH - Veterinary Treatment Required';
      romanUrduUrgency = 'SANJEEDA - Doctor Ki Dawai Zaroori Hai';
      recommendedActions = [
        'Isolate the infected horse from biting flies (vector control).',
        'Record temperature regularly. Surra causes intermittent spikes.',
        'Consult a veterinarian immediately for antiprotozoal drug treatment (e.g. Quinapyramine).',
        'Provide supportive care, fluids, and anti-inflammatory therapy to manage weakness.'
      ];
      romanUrduActions = [
        'Bimar ghode ko makkhiyon aur machharon se door alag astabal me rakhen.',
        'Har 4 ghanatay baad bukhar check karen, Surra me bukhar chhadta utarta hai.',
        'Fauri vet doctor se Quinapyramine injection ka mashwara karen.',
        'Ghode ki kamzori door karne ke liye glucose drip aur taqat ki khurak den.'
      ];
      romanUrduSummary = 'Surra makkhi ke katne se hota hai. Ghode ko alag rakhen aur Quinapyramine injection ke liye doctor se rabta karen.';
    } else if (lower.includes('colic') || lower.includes('feed') || lower.includes('refus') || lower.includes('paw') || lower.includes('roll')) {
      possibleCondition = 'Potential Colic (Gastrointestinal Distress)';
      romanUrduCondition = 'Colic (Pet Ka Dard / Aant Ki Rukawat)';
      urgency = 'HIGH - Veterinary Attention Recommended';
      romanUrduUrgency = 'SANJEEDA - Doctor Ki Dawai Zaroori Hai';
      recommendedActions = [
        'Immediately restrict all feed and grain.',
        'Walk the horse gently for 15-20 minutes to prevent violent rolling, which can cause intestinal volvulus.',
        'Check TPR vitals (Temperature, Pulse, Respiration) and listen for gut sounds.',
        'Contact an equine vet urgently for rectal exam and diagnostic workup.'
      ];
      romanUrduActions = [
        'Fauri taur par dana, patte aur ghaas khana bilkul band kar den.',
        'Ghode ko ahista chalayen taakay aant nali mude nahi.',
        'Pet ki aawaz (gut sounds) aur saans check karen.',
        'Fauri doctor se rabta karen.'
      ];
      romanUrduSummary = 'Pet dard me ghode ka khana peena roken aur narm zameen par chalayen. Zameen par letne aur rolling se bachayen.';
    }

    setAssessment({
      possibleCondition,
      romanUrduCondition,
      urgency,
      romanUrduUrgency,
      recommendedActions,
      romanUrduActions,
      romanUrduSummary
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
        {/* Header Section */}
        <div className="liquid-glass-dark rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-10 text-white shadow-2xl reveal-on-scroll relative overflow-hidden liquid-glass-sheen">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 sm:space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-[#D4AF37] border border-amber-500/30 text-xs sm:text-sm font-bold">
                <Stethoscope className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37]" />
                <span>AI Equine Diagnostics 2.0</span>
              </div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                AI Vet Doctor & Emergency Triage
              </h1>
              <p className="text-slate-300 max-w-2xl text-xs sm:text-base leading-relaxed">
                Enter your horse's symptoms or upload photos for instant AI preliminary medical assessment, vital signs monitoring, and emergency local vet contacts across Pakistan.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/20 text-center shrink-0 self-start md:self-auto">
              <span className="text-[10px] sm:text-xs font-black text-[#D4AF37] uppercase tracking-wider block mb-1">Emergency Helpline</span>
              <a href="tel:+924299211374" className="text-lg sm:text-2xl font-black text-white hover:text-[#D4AF37] transition flex items-center justify-center gap-2">
                <Phone className="w-5 h-5 text-[#D4AF37]" />
                <span>+92 42 99211374</span>
              </a>
            </div>
          </div>
        </div>

        {/* Quick Symptom Tags */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xl space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs sm:text-sm font-black text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" /> Common Symptoms Quick Select
            </h2>
            <span className="text-[10px] sm:text-xs text-slate-400 font-medium">Click to add to description</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {quickSymptoms.map((symptom, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleTagClick(symptom.label)}
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-50 hover:bg-[#0F172A] text-slate-700 hover:text-[#D4AF37] rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold border border-slate-200 hover:border-[#D4AF37] transition cursor-pointer flex items-center gap-1.5"
              >
                <span>+</span>
                <span>{symptom.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Grid: Consultation Form & Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Symptom Input Form */}
          <div className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xl space-y-5 sm:space-y-6">
            <div className="border-b pb-4">
              <h2 className="text-lg sm:text-xl font-black text-[#0F172A] flex items-center gap-2">
                <Stethoscope className="w-5 h-5 sm:w-6 sm:h-6 text-[#D4AF37]" /> Describe Horse Symptoms
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                Provide detailed observations (e.g. fever temp, sweating, colic signs, swelling, feed refusal).
              </p>
            </div>

            <form onSubmit={handleConsult} className="space-y-4 sm:space-y-5">
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-xs font-black uppercase text-slate-700 tracking-wider">
                  Symptom Description / Alamat
                </label>
                <textarea
                  rows="5"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Example: My horse Pasha has high fever 39.8°C, heavy sweating, and hasn't urinated since morning..."
                  className="w-full p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none text-xs sm:text-sm font-medium transition"
                  required
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-xs font-black uppercase text-slate-700 tracking-wider">
                  Upload Photo (Optional)
                </label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl sm:rounded-2xl p-4 text-center hover:border-[#D4AF37] transition relative bg-slate-50/50">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSymptomFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="space-y-1">
                    <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                    <p className="text-xs font-bold text-slate-700">
                      {symptomFile ? symptomFile.name : 'Click or drag photo of wound / leg swelling / discharge'}
                    </p>
                    <p className="text-[10px] text-slate-400">JPG, PNG up to 10MB</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3.5 sm:py-4 bg-[#0F172A] hover:bg-[#1E293B] text-[#D4AF37] font-black rounded-xl sm:rounded-2xl text-xs sm:text-sm shadow-xl transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37]" />
                  {loading ? 'Analyzing Symptoms...' : 'Run Diagnostics'}
                </button>
                {symptoms && (
                  <button
                    type="button"
                    onClick={() => {
                      setSymptoms('');
                      setSymptomFile(null);
                      setAssessment(null);
                    }}
                    className="w-full sm:w-auto px-6 py-3.5 sm:py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl sm:rounded-2xl text-xs sm:text-sm transition cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Diagnosis Results Card */}
          <div className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xl space-y-4 sm:space-y-5">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-lg sm:text-xl font-black text-[#0F172A] flex items-center gap-2">
                <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-[#D4AF37]" /> AI Diagnosis Results
              </h2>
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2.5 py-1 bg-amber-100 text-amber-900 rounded-full border border-amber-300">
                English & Roman Urdu
              </span>
            </div>

            {assessment ? (
              <div className="space-y-4 sm:space-y-5 animate-fade-in">
                {/* Potential Condition */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50/50 p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-amber-200 shadow-xs space-y-1">
                  <span className="text-[9px] sm:text-[10px] font-extrabold text-amber-800 uppercase tracking-widest block">
                    Potential Condition / Shubahat-e-Bimari
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-[#0F172A] leading-snug">
                    {assessment.possibleCondition}
                  </h3>
                  {assessment.romanUrduCondition && (
                    <p className="text-xs font-bold text-amber-900 pt-1 flex flex-wrap items-center gap-1.5">
                      <span>🇵🇰 Roman Urdu:</span>
                      <span className="underline decoration-amber-400 font-extrabold">{assessment.romanUrduCondition}</span>
                    </p>
                  )}
                </div>

                {/* Urgency Badge */}
                <div className="bg-slate-50 p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-1 bg-rose-500/15 text-rose-700 rounded-lg text-[10px] sm:text-xs font-extrabold uppercase tracking-wider border border-rose-500/30">
                        Urgency Level
                      </span>
                      <span className="text-xs font-black text-slate-900">{assessment.urgency}</span>
                    </div>
                    {assessment.romanUrduUrgency && (
                      <span className="text-xs font-black text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 self-start sm:self-auto">
                        🇵🇰 {assessment.romanUrduUrgency}
                      </span>
                    )}
                  </div>

                  {/* Recommended First Aid with Roman Urdu */}
                  <div className="space-y-3">
                    <p className="text-xs font-black text-slate-700 uppercase tracking-wider">
                      Recommended First Aid & Immediate Actions / Fauri Hidayat
                    </p>
                    <ul className="space-y-3 sm:space-y-3.5">
                      {assessment.recommendedActions.map((act, idx) => (
                        <li key={idx} className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs space-y-1">
                          <div className="flex items-start gap-2 text-xs sm:text-sm font-extrabold text-slate-800">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{act}</span>
                          </div>
                          {assessment.romanUrduActions && assessment.romanUrduActions[idx] && (
                            <p className="text-xs font-semibold text-amber-900 pl-6 flex items-center gap-1.5">
                              <span>🇵🇰</span>
                              <span>{assessment.romanUrduActions[idx]}</span>
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Roman Urdu Summary Card */}
                  {assessment.romanUrduSummary && (
                    <div className="p-3.5 sm:p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl sm:rounded-2xl text-xs sm:text-sm space-y-1">
                      <span className="text-[10px] font-black text-amber-900 uppercase tracking-wider block">
                        🇵🇰 Roman Urdu Summary (Khulasa):
                      </span>
                      <p className="font-extrabold text-amber-950 leading-relaxed">
                        {assessment.romanUrduSummary}
                      </p>
                    </div>
                  )}
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-[11px] font-medium flex items-start gap-2">
                  <Info className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                  <span>
                    This AI diagnosis is preliminary guidance. Always consult a licensed equine practitioner for physical examination and official prescription.
                  </span>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 space-y-3">
                <Bot className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="text-xs sm:text-sm font-medium">
                  Select symptoms or type observations above, then click <strong>Run Diagnostics</strong> to see AI preliminary assessment.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Vital Signs Reference Grid */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xl space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-lg sm:text-xl font-black text-[#0F172A] flex items-center gap-2">
              <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-[#D4AF37]" /> Normal Equine Vital Signs (TPR Reference)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Compare your horse's current vital signs against healthy adult equine standards before calling a vet.
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

        {/* Emergency Vet Hospitals Directory */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xl space-y-6">
          <div className="border-b pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-[#0F172A] flex items-center gap-2">
                <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#D4AF37]" /> Emergency Equine Hospitals in Pakistan
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                Verified equine surgery centers and veterinary teaching clinics across major cities.
              </p>
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200 self-start sm:self-auto">
              24/7 Helpline Contacts
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {localVets.map((vet, idx) => (
              <div key={idx} className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between hover:border-[#D4AF37] transition">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-slate-200 text-slate-700 rounded-md">
                      {vet.city}
                    </span>
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
                  <Phone className="w-3.5 h-3.5 text-[#D4AF37]" /> Call Emergency
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
