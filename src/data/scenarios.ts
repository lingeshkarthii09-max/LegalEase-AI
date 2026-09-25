import { PrebuiltScenario } from '../types';

export const PREBUILT_SCENARIOS: PrebuiltScenario[] = [
  {
    id: 'freelance-contract',
    title: 'Freelance Work Contract',
    subtitle: 'From LegalEase Official Demo (Pages 18-24)',
    docType: 'Freelance Work Contract',
    parties: 'Jane Doe (Service Provider), TechNova Inc. (Client)',
    terms: 'Work must be delivered by May 15, 2025; Payment will be made within 7 days of invoice; The client retains intellectual property rights; Confidentiality must be maintained at all times; Either party may terminate with 15 days notice',
    date: 'April 15, 2025',
    governingLaw: 'State of California',
    badge: 'Standard Demo',
  },
  {
    id: 'employment-contract',
    title: 'Startup Employment Contract',
    subtitle: 'Scenario 1: Comprehensive agreement with roles, comp & IP',
    docType: 'Employment Contract',
    parties: 'Apex Innovations LLC (Employer), Marcus Vance (Employee)',
    terms: 'Full-time position as Lead Full-Stack Engineer; Base compensation of $140,000 per annum paid semi-monthly; Comprehensive health, dental, and 401(k) matching package starting day 30; At-will employment status governed by statutory law; Employee agrees to assign all work-related intellectual property to company; 12-month post-employment non-solicitation of clients and staff',
    date: 'May 1, 2025',
    governingLaw: 'State of Delaware',
    badge: 'Scenario 1',
  },
  {
    id: 'nda-agreement',
    title: 'Non-Disclosure Agreement (NDA)',
    subtitle: 'Scenario 2: Bilateral confidentiality & trade secrets',
    docType: 'Mutual Non-Disclosure Agreement',
    parties: 'Vanguard Studios LLC (Disclosing Party), Sarah Jenkins (Receiving Party)',
    terms: 'Proprietary source code, design mockups, and customer analytics classified as confidential; Information shall be held in strict secrecy for a term of three (3) years; Information used exclusively to evaluate potential freelance engineering engagement; Immediate return or certified destruction of confidential assets upon written request; Injunction relief available without requirement of posting bond in case of breach',
    date: 'April 20, 2025',
    governingLaw: 'State of New York',
    badge: 'Scenario 2',
  },
  {
    id: 'lease-agreement',
    title: 'Residential Lease Agreement',
    subtitle: 'Scenario 3: Landlord-tenant terms with deposit & utilities',
    docType: 'Residential Lease Agreement',
    parties: 'Alice Smith (Tenant), XYZ Realty Partners LLC (Landlord)',
    terms: 'Premises located at 742 Evergreen Terrace, Unit 4B; Term of lease shall run for twelve (12) consecutive calendar months; Monthly rent of $2,350 due on or before the 1st of each calendar month; Security deposit of $3,500 held in an insured escrow account; Tenant responsible for all electricity, cooking gas, and high-speed internet charges; No unauthorized subleasing or assignment without prior written consent',
    date: 'July 1, 2025',
    governingLaw: 'State of Texas',
    badge: 'Scenario 3',
  },
  {
    id: 'consulting-sla',
    title: 'Consulting & Advisory Agreement',
    subtitle: 'High-level advisory services with milestone payments',
    docType: 'Consulting Services Agreement',
    parties: 'Dr. Evelyn Reed (Advisor), Horizon BioTech Corp (Company)',
    terms: 'Monthly strategic advisory board attendance and roadmap review; Consulting retainer fee of $5,000 per month payable net 15; Advisory stock option grant of 0.35% equity vesting over twenty-four months; Mutual confidentiality and complete invention assignment; Termination permitted by either party upon thirty (30) days written notice',
    date: 'September 1, 2025',
    governingLaw: 'State of Delaware',
    badge: 'Corporate',
  },
];

export const COMMON_CLAUSE_PRESETS = [
  {
    label: 'Payment terms (Net 15)',
    clause: 'Payment shall be remitted within 15 calendar days upon receipt of invoice',
  },
  {
    label: 'Payment terms (Net 30)',
    clause: 'Payment will be made within 30 days of invoice date',
  },
  {
    label: 'Strict Confidentiality',
    clause: 'Confidentiality must be maintained at all times during and 3 years post-term',
  },
  {
    label: 'IP Assignment to Client',
    clause: 'The client retains all intellectual property rights and work product title upon payment',
  },
  {
    label: '15 Days Notice Termination',
    clause: 'Either party may terminate this agreement with 15 days written notice',
  },
  {
    label: '30 Days Notice Termination',
    clause: 'Either party may terminate this agreement with 30 days written notice',
  },
  {
    label: 'Deliverables Deadline',
    clause: 'The provider agrees to deliver final milestones by the agreed project deadline',
  },
  {
    label: 'Indemnification & Hold Harmless',
    clause: 'Each party agrees to indemnify and hold harmless against third-party claims arising from gross negligence',
  },
  {
    label: 'Arbitration Clause',
    clause: 'Any disputes shall be resolved through binding confidential arbitration before filing court proceedings',
  },
];

export const POPULAR_DOC_TYPES = [
  'Freelance Work Contract',
  'Non-Disclosure Agreement (NDA)',
  'Employment Contract',
  'Residential Lease Agreement',
  'Independent Contractor Agreement',
  'Consulting Agreement',
  'Partnership Agreement',
  'Service Level Agreement (SLA)',
  'Cease and Desist Notice',
  'Employment Offer Letter',
];
