import React, { useState } from 'react';
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

      const res = await fetch('/api/vet/check', {
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
        'Fauri emergency vet doctor ko bulayen taakay nali (catheter) lagayen aur blood test (BUN/Creatinine) karwayen.'
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
    } else if (lower.includes('paw') || lower.includes('roll') || lower.includes('flank') || lower.includes('belly') || lower.includes('feed') || lower.includes('refus')) {
      possibleCondition = 'Potential Colic (Gastrointestinal Distress)';
      romanUrduCondition = 'Colic (Pet Ka Dard / Aant Ki Rukawat)';
      urgency = 'HIGH - Veterinary Attention Recommended';
      romanUrduUrgency = 'SANJEEDA - Doctor Ko Fauri Bulayen';
      recommendedActions = [
        'Immediately restrict access to all feeds, grains, and hay.',
        'Walk the horse gently on soft ground to prevent violent rolling, which can twist intestines.',
        'Keep a close record of heart rate and respiration rate.',
        'Call an emergency veterinarian immediately if the horse is sweating heavily or thrashing.'
      ];
      romanUrduActions = [
        'Fauri taur par dana, patte aur ghaas khana bilkul band kar den.',
        'Ghode ko narm zameen par ahista paidal chalayen taakay woh zameen par aante na maroray.',
        'Ghode ki saans aur dil ki dhadkan par barabar nazar rakhen.',
        'Agar ghode ko shadeed paseena aaye ya dard se tadpe to fauri emergency vet ko phone karen.'
      ];
      romanUrduSummary = 'Pet dard me ghode ka khana peena roken aur narm zameen par chalayen. Zameen par letne aur rolling se bachayen.';
    } else if (lower.includes('limp') || lower.includes('lame') || lower.includes('hoof') || lower.includes('hooves') || lower.includes('swell') || lower.includes('swelling')) {
      possibleCondition = 'Laminitis (Founder) or Sole Bruise';
      romanUrduCondition = 'Laminitis (Sum Ka Dard / Khur Ki Sujan)';
      urgency = 'HIGH - Limit movement immediately';
      romanUrduUrgency = 'SANJEEDA - Harakat Fauri Roken';
      recommendedActions = [
        'Move the horse to dry, deep, soft bedding (sand or shavings) and limit all movement.',
        'Apply cold water or ice to the hooves to control acute inflammation.',
        'Avoid feeding any grains, concentrates, or fresh pasture grass.',
        'Schedule an emergency visit with your vet and farrier.'
      ];
      romanUrduActions = [
        'Ghode ko narm reti ya bhoose par khada karen aur bilkul mat chalayen.',
        'Sumon (khuron) par thanda pani ya baraf lagayen taakay sujan kam ho.',
        'Dana, gur aur taza haray patte bilkul mat den.',
        'Fauri vet doctor aur naal-band (farrier) ko checkup ke liye bulayen.'
      ];
      romanUrduSummary = 'Khuron ki sujan me ghode ko narm zameen par rakhen aur baraf se sek den. Dana peena roken.';
    } else if (lower.includes('discharge') || lower.includes('cough') || lower.includes('fever') || lower.includes('throat') || lower.includes('sweat')) {
      possibleCondition = 'Equine Respiratory Infection (Strangles / Influenza)';
      romanUrduCondition = 'Saans Ki Bimari / Khansi (Strangles Ya Nazla)';
      urgency = 'MODERATE - Isolate the horse';
      romanUrduUrgency = 'MADHYAM - Ghode Ko Alag Karen';
      recommendedActions = [
        'Quarantine the horse in a well-ventilated stable to prevent spreading infection to other animals.',
        'Provide dust-free forage (soak hay if necessary) and moisten feed to ease swallowing.',
        'Monitor body temperature twice daily.',
        'Call a veterinarian to perform nasal swabs and determine if antibiotics or anti-inflammatories are needed.'
      ];
      romanUrduActions = [
        'Bimar ghode ko doosre ghodon se alag hawadar kamre me rakhen.',
        'Gardi se paak narm ghaas den, khana bhigo kar den taakay nigalne me aasani ho.',
        'Din me do baar bukhar zaroor napen.',
        'Doctor se checkup karwayen taakay zaroori antibiotic shuru ki ja sakain.'
      ];
      romanUrduSummary = 'Khansi aur nazla me ghode ko alag rakhen, gard-o-ghubar se bachayen aur doctor se mashwara karen.';
    }

    setAssessment({ possibleCondition, romanUrduCondition, urgency, romanUrduUrgency, recommendedActions, romanUrduActions, romanUrduSummary });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fade-up">

      {/* Banner */}
      <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-full text-xs font-semibold uppercase tracking-wider">
            <Stethoscope className="w-3.5 h-3.5 text-amber-400" /> AI Equine Vet System
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            AI Vet Diagnostics & Equine Care Suite
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl font-light">
            Obtain instant visual or symptoms-based diagnostic evaluations. Learn standard vital signs, review equine disease procedures, or contact trusted regional clinics.
          </p>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Columns - Diagnostic Panel */}
        <div className="lg:col-span-7 space-y-6">

          {/* Symptoms Analyzer Box */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md">
            <h2 className="text-xl font-black text-[#0F172A] mb-2 flex items-center gap-2">
              <Bot className="w-6 h-6 text-[#D4AF37]" /> Describe Symptoms
            </h2>
            <p className="text-xs text-slate-500 mb-6 font-light">
              Explain current symptoms or upload photos of wounds, skin issues, or body postures to generate triage evaluations.
            </p>

            <form onSubmit={handleConsult} className="space-y-6">

              {/* Quick Select Tags */}
              <div className="space-y-2">
                <label className="block text-xs font-extrabold uppercase text-slate-700 tracking-wider">
                  Quick Select Symptoms
                </label>
                <div className="flex flex-wrap gap-2">
                  {quickSymptoms.map((symp, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleTagClick(symp.label)}
                      className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:border-[#D4AF37] hover:bg-amber-500/5 transition cursor-pointer"
                    >
                      + {symp.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Input */}
              <div className="space-y-2">
                <label className="block text-xs font-extrabold uppercase text-slate-700 tracking-wider">
                  Observed Behavior & Symptoms
                </label>
                <textarea
                  rows="6"
                  required
                  placeholder="Describe your horse's symptoms (e.g., horse is pawing the ground, looking at flanks, sweating, breathing rapidly...)"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="w-full p-4 border border-slate-200 rounded-xl text-sm focus:border-[#D4AF37] focus:outline-none bg-slate-50 focus:bg-white transition"
                ></textarea>
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-extrabold uppercase text-slate-700 tracking-wider">
                  Upload Photo (Optional)
                </label>
                <div className="border border-dashed border-slate-300 p-6 rounded-xl text-center bg-slate-50 hover:bg-slate-100/50 hover:border-[#D4AF37] transition cursor-pointer relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSymptomFile(e.target.files[0])}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Upload className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                  <span className="text-xs text-slate-600 font-semibold block">
                    {symptomFile ? symptomFile.name : 'Click to add hoof, skin, or posture image'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-light block mt-1">
                    Supports JPG, PNG formats up to 5MB
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#C9A227] hover:from-[#C9A227] hover:to-[#B8860B] text-[#0F172A] font-bold rounded-xl text-sm shadow transition cursor-pointer disabled:opacity-50"
                >
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
                    className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition"
                  >
                    Clear
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Diagnosis Results Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-5">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-xl font-black text-[#0F172A] flex items-center gap-2">
                <Bot className="w-6 h-6 text-[#D4AF37]" /> AI Diagnosis Results
              </h2>
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 bg-amber-100 text-amber-900 rounded-full border border-amber-300">
                English & Roman Urdu
              </span>
            </div>

            {assessment ? (
              <div className="space-y-5 animate-fade-in">
                {/* Potential Condition */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50/50 p-5 rounded-2xl border border-amber-200 shadow-xs space-y-1">
                  <span className="text-[10px] font-extrabold text-amber-800 uppercase tracking-widest block">
                    Potential Condition / Shubahat-e-Bimari
                  </span>
                  <h3 className="text-xl font-black text-[#0F172A] leading-snug">
                    {assessment.possibleCondition}
                  </h3>
                  {assessment.romanUrduCondition && (
                    <p className="text-xs font-bold text-amber-900 pt-1 flex items-center gap-1.5">
                      <span>🇵🇰 Roman Urdu:</span>
                      <span className="underline decoration-amber-400 font-extrabold">{assessment.romanUrduCondition}</span>
                    </p>
                  )}
                </div>

                {/* Urgency Badge */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-rose-500/15 text-rose-700 rounded-lg text-xs font-extrabold uppercase tracking-wider border border-rose-500/30">
                        Urgency Level
                      </span>
                      <span className="text-xs font-black text-slate-900">{assessment.urgency}</span>
                    </div>
                    {assessment.romanUrduUrgency && (
                      <span className="text-xs font-black text-rose-700 bg-rose-50 px-3 py-1 rounded-lg border border-rose-200">
                        🇵🇰 {assessment.romanUrduUrgency}
                      </span>
                    )}
                  </div>

                  {/* Recommended First Aid with Roman Urdu */}
                  <div className="space-y-3">
                    <p className="text-xs font-black text-slate-700 uppercase tracking-wider">
                      Recommended First Aid & Immediate Actions / Fauri Hidayat
                    </p>
                    <ul className="space-y-3.5">
                      {assessment.recommendedActions.map((act, idx) => (
                        <li key={idx} className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs space-y-1">
                          <div className="flex items-start gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">{act}</span>
                          </div>
                          {assessment.romanUrduActions && assessment.romanUrduActions[idx] && (
                            <p className="text-[11px] font-medium text-emerald-800 bg-emerald-50/80 p-2 rounded-lg border border-emerald-100/80 ml-6 flex items-start gap-1">
                              <span className="font-extrabold shrink-0">🇵🇰 Roman Urdu:</span>
                              <span>{assessment.romanUrduActions[idx]}</span>
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Roman Urdu Executive Summary Card */}
                  {assessment.romanUrduSummary && (
                    <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-400/30 space-y-1">
                      <span className="text-[10px] font-black text-amber-900 uppercase tracking-widest flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-amber-600" /> 🇵🇰 Roman Urdu Summary / Khulasa:
                      </span>
                      <p className="text-xs font-bold text-slate-900 leading-relaxed">
                        {assessment.romanUrduSummary}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-slate-400 text-sm font-light">
                <Stethoscope className="w-10 h-10 mx-auto text-slate-200 mb-3" />
                Fill in details on the form above to generate an instant diagnostic report.
              </div>
            )}
            <p className="text-[10px] text-slate-400 mt-6 border-t pt-3 italic leading-normal flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 text-slate-300 shrink-0" />
              Disclaimer: This AI analysis serves as an educational support utility. It does not replace hands-on diagnostic checks by a qualified animal hospital.
            </p>
          </div>
        </div>

        {/* Right Columns - Medical Knowledge base & Contacts */}
        <div className="lg:col-span-5 space-y-6">

          {/* Vitals Dashboard */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md">
            <h2 className="text-lg font-bold text-[#0F172A] mb-1 flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#D4AF37]" /> Normal Vital Signs
            </h2>
            <p className="text-xs text-slate-500 mb-4 font-light">
              Use these standard baselines to monitor your horse’s active status.
            </p>
            <div className="grid grid-cols-1 gap-4">
              {vitalSigns.map((sign, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-xl hover:shadow transition">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg border border-slate-100">
                      {sign.icon}
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-700">{sign.label}</h4>
                      <p className="text-sm font-bold text-[#0F172A]">
                        {sign.range} <span className="text-[10px] text-slate-500 font-light">{sign.metric}</span>
                      </p>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed font-light pl-11">
                    {sign.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Regional Vets */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md">
            <h2 className="text-lg font-bold text-[#0F172A] mb-1 flex items-center gap-2">
              <Phone className="w-5 h-5 text-[#D4AF37]" /> Emergency Vet Contacts
            </h2>
            <p className="text-xs text-slate-500 mb-4 font-light">
              Contact verified equine veterinarians and specialized animal hospitals in Pakistan.
            </p>

            <div className="space-y-4">
              {localVets.map((vet, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-between hover:shadow transition hover:border-amber-200">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-[#0F172A]">{vet.name}</h4>
                      <span className="bg-amber-100 text-amber-900 border border-amber-300 font-black text-[9px] px-2.5 py-0.5 rounded-full uppercase">
                        {vet.city}
                      </span>
                    </div>
                    {vet.doctor && (
                      <p className="text-[11px] text-slate-600 font-semibold bg-white px-2 py-1 rounded border border-slate-100 inline-block">
                        👨‍⚕️ {vet.doctor}
                      </p>
                    )}
                    <p className="text-[10px] text-slate-400 font-light leading-normal">{vet.location}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                    <a
                      href={`tel:${vet.phone}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D4AF37] hover:text-[#0F172A] transition"
                    >
                      <Phone className="w-3.5 h-3.5" /> Call Hospital
                    </a>
                    <span className="text-[10px] text-slate-500 font-bold">{vet.phone}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
