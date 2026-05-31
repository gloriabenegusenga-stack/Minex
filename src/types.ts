export interface DrillHole {
  holeId: string;
  depth: number;
  grade: number;
  lithology: string;
}

export interface Project {
  id: string;
  name: string;
  location: string;
  type: 'Gold' | 'Copper' | 'Lithium' | 'Zinc';
  phase: 'Production' | 'Development' | 'Exploration';
  tonnage: string;
  grade: string;
  mineLife: number;
  capex: string;
  npv: string;
  irr: string;
  coordinates: string;
  drillHoles: DrillHole[];
  description: string;
  highlights: string[];
  annualProduction: { year: string; volume: number; unit: string }[];
}

export interface NewsArticle {
  id: string;
  title: string;
  date: string;
  category: 'Corporate' | 'Exploration' | 'Financial' | 'ESG';
  summary: string;
  readTime: string;
  content: string;
}

export interface TechnicalDoc {
  id: string;
  title: string;
  type: string;
  size: string;
  date: string;
  isLocked: boolean;
}

export interface Inquiry {
  id: string;
  name: string;
  organization: string;
  audienceType: 'Investor' | 'Partner' | 'Government' | 'General';
  email: string;
  details: string;
  submittedAt: string;
  status: 'Received' | 'Approved' | 'Reviewing';
  additionalData: Record<string, string>;
}

export interface StoneSale {
  id: string;
  name: string;
  shape: string;
  size: string;
  quantitySold: number;
  unitCost: number;
  totalCost: number;
  year: string;
  grade: string;
  site: string;
}

