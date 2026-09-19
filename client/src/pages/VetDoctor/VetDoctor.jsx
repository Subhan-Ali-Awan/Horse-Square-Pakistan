import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { getApiUrl } from '../../config/api';
import {
  Stethoscope, Activity, Heart, Thermometer, Wind,
  Phone, MapPin, Building2, Send, Trash2, ChevronDown,
  ChevronUp, AlertTriangle, CheckCircle2, User, Bot,
  Search, ExternalLink, ShieldCheck, PhoneCall
} from 'lucide-react';


// ─────────────────────────────────────────────────────────────────────────────
// Disease Context Map — injected into API calls when chips are selected
// ─────────────────────────────────────────────────────────────────────────────
const DISEASE_CONTEXTS = {
  anuria: "The user has selected ANURIA (No Urine). This is a life-threatening emergency. Kidney failure, severe dehydration, urinary obstruction (stones), or toxins (acorns, red maple) are likely causes. [Source: Merck Veterinary Manual, Equine Urinary Disorders]",
  sweating: "The user has selected HEAVY SWEATING. Possible causes: heat stress, pain, shock, Cushing's disease (PPID), electrolyte imbalance, Trypanosomiasis (Surra — common in Pakistan), or anxiety. [Source: Equine Internal Medicine, Reed, Bayly, Sellon]",
  coughing: "The user has selected COUGHING. Differential: dust irritation (RAO/heaves), viral infection (EHV, influenza, strangles), allergies, bacterial pneumonia, aspiration, or choke-related aspiration. [Source: Merck Veterinary Manual, Equine Respiratory]",
  fever: "The user has selected HIGH FEVER. Normal equine temperature: 99–101.5°F (37.2–38.6°C). Causes: viral respiratory (EHV, influenza), bacterial infection (pneumonia, wound sepsis), tick-borne disease (Lyme, Anaplasma), or Surra. [Source: Merck Veterinary Manual, Equine Fever]",
  refusing: "The user has selected REFUSING FEED. Causes: dental pain (sharp points, hooks, wolf teeth), gastric ulcers (90% of performance horses), colic, fever, choke, metabolic crisis, or environmental stress. [Source: AAEP Guidelines, Equine Gastric Ulcer Syndrome]",
  footswelling: "The user has selected FOOT SWELLING. Localized: abscess, bruise, puncture wound. Generalized bilateral: cellulitis, lymphangitis, vasculitis. Hot hoof + strong digital pulse = LAMINITIS (emergency). [Source: Adams and Stashak's Lameness in Horses, 7th Ed]",
  thrush: "The user has selected THRUSH. Bacterial (Fusobacterium necrophorum) infection of the frog and central/lateral sulci. Presents as black, tar-like discharge with fetid odor. Common in wet/dirty environments with poor hoof care. [Source: Merck Veterinary Manual, Equine Hoof Disorders]",
  epm: "The user has selected EPM (Equine Protozoal Myeloencephalitis). Caused by Sarcocystis neurona via opossum fecal contamination of feed/water. Progressive neurological disease attacking brain and spinal cord. Fatal if untreated. [Source: Equine Internal Medicine, Reed, Bayly, Sellon, Ch. 12]",
  uveitis: "The user has selected EYE INFECTION / UVEITIS. Equine Recurrent Uveitis (ERU) is the #1 cause of blindness in horses. Signs: blepharospasm, epiphora, corneal cloudiness/edema, miosis, photophobia. Requires urgent ophthalmic evaluation. [Source: Veterinary Clinics of North America: Equine Practice, Equine Ophthalmology]",
  choke: "The user has selected CHOKE. Esophageal obstruction — food (grain/hay pellets) impacted in esophagus (NOT trachea). Horse cannot swallow, extends neck, feed/saliva discharges from nostrils. Aspiration pneumonia is a severe secondary risk. Requires immediate veterinary intervention. [Source: Merck Veterinary Manual, Equine Esophageal Obstruction]",
};

const DISEASE_CHIPS = [
  { key: 'anuria', label: 'Anuria (No Urine) / پیشاب نہ آنا', emergency: true },
  { key: 'choke', label: 'Choke / گلے میں خوراک پھنس جانا', emergency: true },
  { key: 'uveitis', label: 'Eye Infection / Uveitis / آنکھ کا انفیکشن / یووائٹس', emergency: false },
  { key: 'footswelling', label: 'Foot Swelling / پاؤں میں سوجن', emergency: false },
  { key: 'fever', label: 'High Fever / تیز بخار', emergency: false },
  { key: 'sweating', label: 'Heavy Sweating / زیادہ پسینہ آنا', emergency: false },
  { key: 'coughing', label: 'Coughing / کھانسی', emergency: false },
  { key: 'refusing', label: 'Refusing Feed / خوراک نہ کھانا', emergency: false },
  { key: 'thrush', label: 'Thrush / کھُر کی سڑن / تھرش', emergency: false },
  { key: 'epm', label: 'EPM / ای پی ایم (اعصابی بیماری)', emergency: false },
];

// ─────────────────────────────────────────────────────────────────────────────
// WhatsApp Icon Component & Phone Helpers
// ─────────────────────────────────────────────────────────────────────────────
function WhatsAppIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.97.53 1.942.813 2.796.813h.005c3.18 0 5.767-2.586 5.768-5.766 0-1.54-.599-2.989-1.687-4.079-1.09-1.09-2.537-1.69-4.086-1.69zm3.385 8.163c-.147.414-.725.76-1.026.797-.282.036-.632.148-2.072-.452-1.748-.727-2.868-2.511-2.955-2.628-.087-.117-.714-.951-.714-1.815 0-.864.449-1.288.609-1.464.16-.176.35-.22.467-.22.117 0 .234.001.336.006.107.005.252-.041.394.3.147.355.503 1.228.547 1.316.044.088.073.19.015.307-.058.117-.088.19-.176.293-.088.103-.185.23-.264.309-.092.091-.188.19-.081.374.107.183.475.785 1.02 1.27.702.626 1.294.82 1.477.911.183.092.292.078.4-.047.108-.124.462-.538.585-.723.123-.184.246-.154.414-.092.168.062 1.066.503 1.249.595.183.092.306.138.35.215.044.078.044.453-.103.867z" />
      <path d="M12 2C6.477 2 2 6.477 2 12c0 1.892.524 3.662 1.435 5.177L2 22l4.981-1.306A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.2c-1.636 0-3.17-.468-4.475-1.277l-.321-.197-2.96.776.79-2.887-.216-.344A8.163 8.163 0 013.8 12c0-4.521 3.679-8.2 8.2-8.2 4.521 0 8.2 3.679 8.2 8.2 0 4.521-3.679 8.2-8.2 8.2z" />
    </svg>
  );
}

const cleanPhoneForDial = (phoneStr) => {
  if (!phoneStr) return '';
  return phoneStr.replace(/[^0-9+]/g, '');
};

const isMobileNumber = (phoneStr) => {
  if (!phoneStr) return false;
  const digits = phoneStr.replace(/[^0-9]/g, '');
  return digits.startsWith('03') || digits.startsWith('923') || digits.startsWith('3');
};

const getWhatsAppUrl = (phoneStr, clinicName) => {
  let cleaned = phoneStr.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '92' + cleaned.slice(1);
  }
  const text = encodeURIComponent(
    `Hello! I found your veterinary clinic (${clinicName || 'Clinic'}) on Horse Square Pakistan and would like to get in touch.`
  );
  return `https://wa.me/${cleaned}?text=${text}`;
};

// ─────────────────────────────────────────────────────────────────────────────
// City-Wise Vet Doctors & Hospitals Data
// ─────────────────────────────────────────────────────────────────────────────
const CITY_VET_DIRECTORIES = [
  // Gujranwala
  {
    city: 'Gujranwala',
    doctors: 'Dr. Rabia Mazhar & Dr. Ahmed Khan Buttar',
    clinic: 'Ahmed Veterinary Clinic',
    location: 'Satellite Town, Gujranwala',
    phones: ['0333-8789880', '0310-1911191'],
    url: 'https://www.petpitari.com/2018/05/29/vets-in-gujranwala/?utm_source=gemini',
    tag: 'Clinic & Surgery',
  },
  {
    city: 'Gujranwala',
    doctors: 'Dr. Tariq Malik',
    clinic: 'PetVet Veterinary Hospital',
    location: 'GT Road, Gujranwala',
    phones: ['0348-4241140'],
    url: 'https://www.petpitari.com/2018/05/29/vets-in-gujranwala/?utm_source=gemini',
    tag: 'Hospital',
  },
  {
    city: 'Gujranwala',
    doctors: 'Dr. M. Waqas Sandhu',
    clinic: 'Waqas Pets Clinic',
    location: 'Satellite Town, Gujranwala',
    phones: ['0303-8110853'],
    url: 'https://www.petpitari.com/2018/05/29/vets-in-gujranwala/?utm_source=gemini',
    tag: 'Pet & Animal Care',
  },

  // Hyderabad
  {
    city: 'Hyderabad',
    doctors: 'Dr. Zeeshan',
    clinic: 'Dr Zeeshan Pet Hospital',
    location: 'Hyderabad, Sindh',
    phones: ['0304-3044676'],
    url: 'https://mannvetcorner.com/best-pet-clinics-veterinary-services-in-hyderabad-sindh/?utm_source=gemini',
    tag: 'Pet Hospital',
  },
  {
    city: 'Hyderabad',
    doctors: 'Dr. Javed',
    clinic: "Javed's Veterinary Clinic & Surgery Centre",
    location: 'Hyderabad, Sindh',
    phones: ['0319-1251515'],
    url: 'https://mannvetcorner.com/best-pet-clinics-veterinary-services-in-hyderabad-sindh/?utm_source=gemini',
    tag: 'Surgery Centre',
  },
  {
    city: 'Hyderabad',
    doctors: 'Dr. Athar',
    clinic: "Dr Athar's Veterinary Home Service",
    location: 'Hyderabad, Sindh',
    phones: ['0300-4805303'],
    url: 'https://mannvetcorner.com/best-pet-clinics-veterinary-services-in-hyderabad-sindh/?utm_source=gemini',
    tag: 'Home Service',
  },
  {
    city: 'Hyderabad',
    doctors: 'Dr. Wahaj',
    clinic: 'Dr. Wahaj Animal Home Service',
    location: 'Hyderabad, Sindh',
    phones: ['0333-1630087'],
    url: 'https://mannvetcorner.com/best-pet-clinics-veterinary-services-in-hyderabad-sindh/?utm_source=gemini',
    tag: 'Home Service',
  },
  {
    city: 'Hyderabad',
    doctors: 'Emergency Medical Team',
    clinic: 'Aman Vet Pet (24/7 Emergency)',
    location: 'Hyderabad, Sindh',
    phones: ['0341-2977213'],
    url: null,
    tag: '24/7 Emergency',
  },
  {
    city: 'Hyderabad',
    doctors: 'Senior Veterinary Team',
    clinic: 'Tixe Animal Hospital',
    location: 'Hyderabad, Sindh',
    phones: ['022-6127092'],
    url: null,
    tag: 'Hospital',
  },
  {
    city: 'Hyderabad',
    doctors: 'Duty Veterinary Doctor',
    clinic: 'My Pet Hospital',
    location: 'Hyderabad, Sindh',
    phones: ['0345-7088362'],
    url: null,
    tag: 'Hospital',
  },

  // Peshawar
  {
    city: 'Peshawar',
    doctors: 'Dr. Sher',
    clinic: 'Dr. Sher Pet Clinic',
    location: 'Jamrud Road, Peshawar',
    phones: ['0333-9124018', '091-5842523'],
    url: 'https://www.petpitari.com/2018/02/10/vets-in-peshawar/?utm_source=gemini',
    tag: 'Clinic',
  },
  {
    city: 'Peshawar',
    doctors: 'Dr. Waqar Ali Khan',
    clinic: "Dr. Waqar's Pets Clinic",
    location: 'Peshawar, KPK',
    phones: [],
    url: 'https://www.petpitari.com/2018/02/10/vets-in-peshawar/?utm_source=gemini',
    tag: 'Clinic',
  },
  {
    city: 'Peshawar',
    doctors: 'Duty Veterinary Staff',
    clinic: 'National Veterinary Hospital',
    location: 'Matta Road, Peshawar',
    phones: ['091-6282358'],
    url: null,
    tag: 'Hospital',
  },

  // Multan
  {
    city: 'Multan',
    doctors: 'Veterinary Specialist Team',
    clinic: 'Gentle Care Pets Clinic',
    location: 'Wapda Town & Gulgasht Colony Branches, Multan',
    phones: ['0306-6757043'],
    url: 'https://gentlecarepetsclinic.com/areas-we-serve/wapda-town-?utm_source=gemini',
    tag: 'Multi-Branch Clinic',
  },

  // Sialkot
  {
    city: 'Sialkot',
    doctors: 'Consultant Veterinarians',
    clinic: 'The Sialkot Veterinary Clinic',
    location: 'Sialkot, Punjab',
    phones: ['0315-5563939'],
    url: 'https://yandex.com/maps/org/the_sialkot_veterinary_clinic/231821842411/?utm_source=gemini',
    tag: 'Veterinary Clinic',
  },

  // Lahore
  {
    city: 'Lahore',
    doctors: 'Dr. Ahmed Raza Khan',
    clinic: 'Feline & K9 Hospital',
    location: 'Gulberg-2, Lahore',
    phones: ['0300-8402944'],
    url: 'https://www.scribd.com/doc/130143439/Vets-in-Lahore?utm_source=gemini',
    tag: 'Hospital',
  },
  {
    city: 'Lahore',
    doctors: 'Dr. Awais Anees Awan',
    clinic: 'Lahore Animal Hospital',
    location: 'Raiwind Road, Lahore',
    phones: ['0300-4349002', '042-38424399'],
    url: 'https://www.scribd.com/doc/130143439/Vets-in-Lahore?utm_source=gemini',
    tag: 'Animal Hospital',
  },
  {
    city: 'Lahore',
    doctors: 'Dr. Inayat Ullah H. Kathio',
    clinic: 'Lahore Animal Hospital',
    location: 'Raiwind Road, Lahore',
    phones: ['0300-4348993'],
    url: 'https://www.scribd.com/doc/130143439/Vets-in-Lahore?utm_source=gemini',
    tag: 'Consultant',
  },
  {
    city: 'Lahore',
    doctors: 'Dr. Hamid Akbar',
    clinic: "Small Animals' Hospital",
    location: 'Gulberg-3 / Bedian Road, Lahore',
    phones: ['0321-4551700'],
    url: 'https://www.scribd.com/doc/130143439/Vets-in-Lahore?utm_source=gemini',
    tag: 'Specialist',
  },
  {
    city: 'Lahore',
    doctors: 'Dr. Rehan Mehmood',
    clinic: 'Pets & Vets Clinic',
    location: 'DHA Phase-1, Lahore',
    phones: ['0333-4242458'],
    url: 'https://www.scribd.com/doc/130143439/Vets-in-Lahore?utm_source=gemini',
    tag: 'Clinic',
  },
  {
    city: 'Lahore',
    doctors: 'Dr. Muhammad Ahmad',
    clinic: 'Vets On Door',
    location: 'Home Visits & Clinics, Lahore',
    phones: ['0307-8517122'],
    url: 'https://www.vetsondoor.com/veterinarian-lahore?utm_source=gemini',
    tag: 'Doorstep Vet',
  },
  {
    city: 'Lahore',
    doctors: 'Dr. Asim Khalid',
    clinic: "Asim Pets' Clinic",
    location: 'Faisal Town, Lahore',
    phones: ['0300-8406873'],
    url: 'https://www.scribd.com/doc/130143439/Vets-in-Lahore?utm_source=gemini',
    tag: 'Clinic',
  },
  {
    city: 'Lahore',
    doctors: 'Dr. Hafiz Wasif Umair',
    clinic: 'Pets Health Clinic',
    location: 'Johar Town, Lahore',
    phones: ['0321-6434045'],
    url: 'https://www.scribd.com/doc/130143439/Vets-in-Lahore?utm_source=gemini',
    tag: 'Clinic',
  },

  // Karachi
  {
    city: 'Karachi',
    doctors: 'Dr. Osama, Dr. Arsalan, and Dr. Zaitullah',
    clinic: 'Pets Care n Cure',
    location: 'DHA Phase 6, Karachi',
    phones: ['0302-8281181'],
    url: 'https://petscarencure.com.pk/?utm_source=gemini',
    tag: 'Advanced Clinic',
  },
  {
    city: 'Karachi',
    doctors: 'Dr. Emily Parker, Dr. Wade Warren, and Dr. Albert Flores',
    clinic: 'Healthy Tails Animal Hospital',
    location: 'Karachi, Sindh',
    phones: ['0317-8221223'],
    url: 'https://healthytailsanimalhospital.com/?utm_source=gemini',
    tag: 'Animal Hospital',
  },

  // Islamabad / Rawalpindi
  {
    city: 'Islamabad / Rawalpindi',
    doctors: 'Dr. Farooq Tahir & Dr. Masood Tahir',
    clinic: 'Pioneer Pets Hospital',
    location: 'Satellite Town, Rawalpindi',
    phones: ['0321-7654036'],
    url: 'https://www.petpitari.com/2018/02/10/vets-in-rawalpindi/?utm_source=gemini',
    tag: 'Hospital',
  },
  {
    city: 'Islamabad / Rawalpindi',
    doctors: 'Dr. Azhar Majeed',
    clinic: 'Pet Care 2 Clinic',
    location: 'Bahria Phase 7, Rawalpindi',
    phones: ['0304-5585881'],
    url: 'https://www.petpitari.com/2018/02/10/vets-in-rawalpindi/?utm_source=gemini',
    tag: 'Clinic',
  },
  {
    city: 'Islamabad / Rawalpindi',
    doctors: 'Dr. Faisal Ibrahim Khan',
    clinic: 'Pets & Vets Clinic',
    location: 'F-7/4, Islamabad / Bahria Town Phase-5',
    phones: ['0300-8545566'],
    url: 'https://www.ebizpk.com/pet-clinics-islamabad.htm?utm_source=gemini',
    tag: 'Dual Branch Clinic',
  },
  {
    city: 'Islamabad / Rawalpindi',
    doctors: 'Dr. Inam Ullah Khan',
    clinic: 'Niazi Animal Clinic',
    location: 'Chakra Road, Rawalpindi',
    phones: ['0301-5090546'],
    url: 'https://www.petpitari.com/2018/02/10/vets-in-rawalpindi/?utm_source=gemini',
    tag: 'Clinic',
  },
  {
    city: 'Islamabad / Rawalpindi',
    doctors: 'Dr. Mahmood Rashid',
    clinic: 'Private Pets Clinic',
    location: 'Airport Housing Society, Rawalpindi',
    phones: ['0345-8362737'],
    url: 'https://www.petpitari.com/2018/02/10/vets-in-rawalpindi/?utm_source=gemini',
    tag: 'Clinic',
  },
  {
    city: 'Islamabad / Rawalpindi',
    doctors: 'Dr. Hassan Sarosh Akram',
    clinic: "Dr. Hassan's Clinic",
    location: 'Satellite Town, Rawalpindi',
    phones: ['051-4457435'],
    url: 'https://www.ebizpk.com/pet-clinics-islamabad.htm?utm_source=gemini',
    tag: 'Clinic',
  },

  // Faisalabad
  {
    city: 'Faisalabad',
    doctors: 'Dr. Muhammad Saad Sabir',
    clinic: 'D Vets Pet Clinic',
    location: 'Faisalabad, Punjab',
    phones: ['0345-7533820'],
    url: 'https://dvetsfaisalabad.com/?utm_source=gemini',
    tag: 'Clinic',
  },
  {
    city: 'Faisalabad',
    doctors: 'Dr. Amjad Khan',
    clinic: 'Dr. Amjad Khan Clinic',
    location: 'Afshan Colony, Faisalabad',
    phones: ['0335-7955457'],
    url: 'https://yandex.com/maps/org/dr_amjad_khan/168632216884/?utm_source=gemini',
    tag: 'Clinic',
  },
];


// ─────────────────────────────────────────────────────────────────────────────
// Markdown renderer — bold, lists, confidence badges
// ─────────────────────────────────────────────────────────────────────────────
function renderMarkdown(text) {
  // Detect emergency
  const isEmergency = /stop\.\s*this is an emergency/i.test(text);

  // Parse [Confidence: X] and [Recommended Next Step: X]
  const confidenceMatch = text.match(/\[Confidence:\s*(HIGH|MODERATE|LOW)\]/i);
  const nextStepMatch = text.match(/\[Recommended Next Step:\s*([^\]]+)\]/i);

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
    HIGH: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    MODERATE: 'bg-amber-100 text-amber-800 border-amber-300',
    LOW: 'bg-red-100 text-red-800 border-red-300',
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
          <p className="text-[10px] text-slate-400 font-medium mt-1 pl-1">Dr. Max (AI Equine Assistant)</p>
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
        <p className="text-[10px] text-slate-400 font-medium mt-1 pl-1">Dr. Max (AI Equine Assistant)</p>
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
  const [messages, setMessages] = useState([]);
  const [horseInfo, setHorseInfo] = useState({ name: '', breed: '', age: '', sex: '' });
  const [selectedDiseases, setSelectedDiseases] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputText, setInputText] = useState('');
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [showHorseInfo, setShowHorseInfo] = useState(false);

  // ── City Vet Directory State ──────────────────────────────────────
  const [selectedCity, setSelectedCity] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // ── Refs ──────────────────────────────────────────────────────────
  const chatContainerRef = useRef(null);
  const textareaRef = useRef(null);

  // ── Local Storage persistence ─────────────────────────────────────
  useEffect(() => {
    try {
      const saved = localStorage.getItem('drMaxChat_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        setMessages(parsed.messages || []);
        setShowDisclaimer(parsed.showDisclaimer !== false);
      }
    } catch { /* ignore parse errors */ }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('drMaxChat_v3', JSON.stringify({ messages, showDisclaimer }));
    } catch { /* ignore storage errors */ }
  }, [messages, showDisclaimer]);

  // ── Auto-scroll strictly within the chat container (prevents whole-page scrolling) ──
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
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
    const chip = DISEASE_CHIPS.find((c) => c.key === key);
    setSelectedDiseases((prev) => {
      const isAlreadySelected = prev.includes(key);
      const next = isAlreadySelected ? prev.filter((k) => k !== key) : [...prev, key];
      return next;
    });

    // If input is empty, auto-fill a clear starter question for the user
    if (chip && !inputText.trim()) {
      const cleanName = chip.label.split('/')[0].trim();
      setInputText(`My horse is showing symptoms of ${cleanName}. What should I do?`);
    }
  };

  // ── Clear chat ────────────────────────────────────────────────────
  const clearChat = () => {
    setMessages([]);
    setSelectedDiseases([]);
    setInputText('');
    setShowDisclaimer(true);
    localStorage.removeItem('drMaxChat_v3');
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
          message: userMessage.content,
          messages: newMessages,
          horseInfo,
          diseaseContext,
        }),
      });

      const data = await res.json();

      if (data.success && data.reply) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        throw new Error(data.error || 'Dr. Max is temporarily unavailable. Please try again in a moment.');
      }
    } catch (err) {
      console.error('[DrMax] Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: err.message || 'Dr. Max is temporarily unavailable. Please try again in a moment.',
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

  const CITIES = ['All', 'Gujranwala', 'Hyderabad', 'Peshawar', 'Multan', 'Sialkot', 'Lahore', 'Karachi', 'Islamabad / Rawalpindi', 'Faisalabad'];

  const filteredVets = CITY_VET_DIRECTORIES.filter((vet) => {
    const matchesCity = selectedCity === 'All' || vet.city === selectedCity;
    const cleanQuery = searchQuery.trim().toLowerCase();
    const matchesSearch = !cleanQuery ||
      vet.doctors.toLowerCase().includes(cleanQuery) ||
      vet.clinic.toLowerCase().includes(cleanQuery) ||
      vet.city.toLowerCase().includes(cleanQuery) ||
      vet.location.toLowerCase().includes(cleanQuery) ||
      vet.phones.some((p) => p.toLowerCase().includes(cleanQuery));
    return matchesCity && matchesSearch;
  });

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
                <span>Dr. Max — AI Equine Veterinary Assistant</span>
              </div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Vet Doctor & Equine Care AI
              </h1>
              <p className="text-slate-300 max-w-2xl text-xs sm:text-sm leading-relaxed">
                Chat with Dr. Max, your AI-powered Equine Veterinary Assistant for Horse Square Pakistan. Ask anything about horse health, symptoms, nutrition, breeding, training, or emergency care in English, Roman English, or Roman Urdu.
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
                <h2 className="text-white font-black text-sm sm:text-base leading-tight">Dr. Max</h2>
                <p className="text-amber-400/80 text-[10px] sm:text-xs font-semibold">AI Equine Veterinary Assistant • Horse Square Pakistan</p>
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
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border transition cursor-pointer select-none
                      ${isSelected
                        ? chip.emergency
                          ? 'bg-red-600 text-white border-red-600 shadow-md'
                          : 'bg-amber-400 text-slate-900 border-amber-400 shadow-md'
                        : chip.emergency
                          ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-amber-300 hover:text-amber-700'
                      }`}
                  >
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
          <div
            ref={chatContainerRef}
            className="h-[420px] sm:h-[500px] overflow-y-auto px-5 sm:px-7 py-5 bg-[#f8fafc] scroll-smooth"
            id="drmax-chat-messages"
          >

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
                  <p className="text-sm font-bold text-slate-700">Good day! I'm Dr. Max, your AI Equine Veterinary Assistant.</p>
                  <p className="text-xs text-slate-400 font-medium mt-1 max-w-sm">Ask me anything about horses, symptoms, nutrition, breeding, or care — in English, Roman English, or Roman Urdu.</p>
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
          </div>

          {/* Input Area */}
          <div className="border-t border-slate-200 bg-white px-5 sm:px-7 py-4">
            {/* Active Selected Disease Chips in Input Area */}
            {selectedDiseases.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-3 pb-2.5 border-b border-slate-100">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Active Selected:</span>
                {selectedDiseases.map((key) => {
                  const chip = DISEASE_CHIPS.find((c) => c.key === key);
                  if (!chip) return null;
                  return (
                    <span
                      key={key}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black shadow-sm ${chip.emergency
                          ? 'bg-red-600 text-white'
                          : 'bg-amber-400 text-slate-900'
                        }`}
                    >
                      <span>{chip.label.split('/')[0].trim()}</span>
                      <button
                        type="button"
                        onClick={() => toggleDisease(key)}
                        className="hover:opacity-75 cursor-pointer ml-1 text-xs font-bold leading-none"
                        title="Remove symptom"
                      >
                        ✕
                      </button>
                    </span>
                  );
                })}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDiseases([]);
                    setInputText('');
                  }}
                  className="text-[11px] font-bold text-slate-400 hover:text-red-500 underline ml-auto cursor-pointer"
                >
                  Clear all
                </button>
              </div>
            )}

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

        {/* ── City-Wise Vet Doctors Directory ── */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xl space-y-6 reveal-on-scroll">
          {/* Section Header */}
          <div className="border-b border-slate-200 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-extrabold border border-amber-200">
                  Verified Directory
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-extrabold border border-emerald-200 flex items-center gap-1">
                  <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-600" /> WhatsApp & Call Ready
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] flex items-center gap-2 pt-1">
                <Building2 className="w-6 h-6 text-[#D4AF37]" /> City-Wise Veterinary Doctors & Clinics
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Click the contact button to open your device phone dialer or the WhatsApp icon to start an instant consultation.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative min-w-[260px] sm:min-w-[300px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search doctor, clinic, or area..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none bg-slate-50 focus:bg-white transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* City Filter Tabs */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1">
            {CITIES.map((city) => {
              const count = city === 'All'
                ? CITY_VET_DIRECTORIES.length
                : CITY_VET_DIRECTORIES.filter((v) => v.city === city).length;
              const isSelected = selectedCity === city;
              return (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer select-none ${
                    isSelected
                      ? 'bg-[#0F172A] text-amber-400 shadow-md border border-[#0F172A]'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                  }`}
                >
                  <span>{city}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
                    isSelected ? 'bg-amber-400/20 text-amber-300' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Doctor Cards Grid */}
          {filteredVets.length === 0 ? (
            <div className="py-12 text-center space-y-2 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <p className="text-sm font-bold text-slate-600">No veterinary clinics found matching your filter criteria.</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCity('All'); }}
                className="text-xs font-bold text-amber-600 hover:underline cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {filteredVets.map((vet, idx) => {
                return (
                  <div
                    key={idx}
                    className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 hover:bg-white border border-slate-200 hover:border-amber-400 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between group"
                  >
                    {/* Top Content */}
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-200/70 rounded-md truncate max-w-[130px]">
                          {vet.city}
                        </span>
                        {vet.tag && (
                          <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200 shrink-0">
                            {vet.tag}
                          </span>
                        )}
                      </div>

                      <div>
                        <h3 className="text-sm font-black text-[#0F172A] leading-snug group-hover:text-amber-600 transition flex items-start gap-1.5">
                          <span>{vet.clinic}</span>
                          {vet.url && (
                            <a
                              href={vet.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Open website / profile"
                              className="text-slate-400 hover:text-amber-600 transition inline-flex mt-0.5 shrink-0"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </h3>
                        <p className="text-xs font-bold text-slate-700 mt-1 flex items-center gap-1.5">
                          <Stethoscope className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span className="truncate">{vet.doctors}</span>
                        </p>
                      </div>

                      <div className="flex items-start gap-1 text-[11px] text-slate-500 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{vet.location}</span>
                      </div>
                    </div>

                    {/* Actions & Contact */}
                    <div className="pt-3.5 mt-3 border-t border-slate-200/80 space-y-2">
                      {vet.phones.length > 0 ? (
                        vet.phones.map((phone, pIdx) => {
                          const isMobile = isMobileNumber(phone);
                          const cleanDial = cleanPhoneForDial(phone);
                          const whatsAppUrl = getWhatsAppUrl(phone, vet.clinic);

                          return (
                            <div key={pIdx} className="flex items-center gap-1.5">
                              {/* Direct Dial Call Button */}
                              <a
                                href={`tel:${cleanDial}`}
                                title={`Call ${phone} (Opens phone dialer)`}
                                className="flex-1 py-2 px-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-amber-400 hover:text-amber-300 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-sm active:scale-95 group/call"
                              >
                                <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0 group-hover/call:scale-110 transition-transform" />
                                <span className="text-[11px] font-black tracking-tight truncate">{phone}</span>
                              </a>

                              {/* Direct WhatsApp Button */}
                              {isMobile && (
                                <a
                                  href={whatsAppUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title={`Chat on WhatsApp with ${phone}`}
                                  className="p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition shadow-sm active:scale-95 shrink-0 flex items-center justify-center"
                                >
                                  <WhatsAppIcon className="w-4 h-4" />
                                </a>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        vet.url && (
                          <a
                            href={vet.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition text-center"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                            <span>View Clinic Details</span>
                          </a>
                        )
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>


      </div>
    </div>
  );
};
