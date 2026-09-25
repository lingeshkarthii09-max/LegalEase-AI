export interface DocumentRequest {
  document_type: string;
  parties: string;
  terms: string;
  dates: string;
  governing_law?: string;
  tone?: string;
  custom_notes?: string;
}

export interface DocumentAnalysis {
  plain_summary: string;
  key_obligations: string[];
  risk_flags: {
    title: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
  }[];
  key_dates: string[];
  score: {
    fairness: number;
    clarity: number;
    protection: number;
  };
}

export interface PrebuiltScenario {
  id: string;
  title: string;
  subtitle: string;
  docType: string;
  parties: string;
  terms: string;
  date: string;
  governingLaw: string;
  badge: string;
}

export interface BrandingOptions {
  companyName: string;
  contactEmail: string;
  showLogo: boolean;
  fontFamily: 'Times New Roman' | 'Georgia' | 'Courier New' | 'Arial';
  includeTermsTable: boolean;
}
