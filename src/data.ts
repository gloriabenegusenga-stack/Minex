import { Project, NewsArticle, TechnicalDoc } from './types';

export const mineralPrices = [
  { symbol: 'XAU', name: 'Gold', price: 2348.50, change: +1.24, unit: 'oz' },
  { symbol: 'HG', name: 'Copper', price: 4.62, change: +0.85, unit: 'lb' },
  { symbol: 'LI', name: 'Lithium Carb', price: 13800.00, change: -0.42, unit: 't' },
  { symbol: 'PL', name: 'Platinum', price: 1042.80, change: +2.18, unit: 'oz' },
  { symbol: 'ZN', name: 'Zinc', price: 2945.00, change: +0.12, unit: 't' },
];

export const projectsData: Project[] = [
  {
    id: 'aura-deepfields',
    name: 'Aura Deepfields',
    location: 'Ontario, Canada',
    type: 'Gold',
    phase: 'Production',
    tonnage: '12.8M oz Proven & Probable',
    grade: '4.85 g/t Au (High-Grade)',
    mineLife: 15,
    capex: '$420M Initial CapEx',
    npv: '$1.24B (at $2,000 Gold Base)',
    irr: '32.4% Post-Tax IRR',
    coordinates: '51° 13\' 52" N, 81° 02\' 11" W',
    description: 'A stellar deep underground gold project leveraging autonomous electric haulage fleets. Operating inside a tier-one mining jurisdiction with local community partners, Aura Deepfields produces zero direct scope 1 diesel emissions due to its complete underground electrification design.',
    highlights: [
      '100% Underground fleet fully electrified in FY24',
      'Over 225,000 oz average annual gold production',
      'Long-term land-use agreement with First Nations partners',
      'AISC (All-In Sustaining Cost) of $845/oz vs $1,250 industry average'
    ],
    annualProduction: [
      { year: 'FY22', volume: 195, unit: 'k oz' },
      { year: 'FY23', volume: 210, unit: 'k oz' },
      { year: 'FY24', volume: 230, unit: 'k oz' },
      { year: 'FY25', volume: 245, unit: 'k oz' },
      { year: 'FY26 (Proj)', volume: 260, unit: 'k oz' }
    ],
    drillHoles: [
      { holeId: 'AD-25-081', depth: 412, grade: 8.42, lithology: 'Silicified Tonalite' },
      { holeId: 'AD-25-082', depth: 550, grade: 12.15, lithology: 'Quartz-Sulfide Veining' },
      { holeId: 'AD-25-083', depth: 290, grade: 3.80, lithology: 'Metasedimentary Schist' },
      { holeId: 'AD-25-084', depth: 620, grade: 15.60, lithology: 'Brecciated Diorite' }
    ]
  },
  {
    id: 'copper-crest',
    name: 'Copper Crest Phase 2',
    location: 'Queensland, Australia',
    type: 'Copper',
    phase: 'Development',
    tonnage: '245M Tons Resource',
    grade: '1.15% Cu Equivalent',
    mineLife: 28,
    capex: '$850M Estimated CapEx',
    npv: '$2.10B (at $4.00 Copper Base)',
    irr: '24.1% IRR',
    coordinates: '21° 45\' 04" S, 142° 36\' 58" E',
    description: 'An expansive open-pit mega-project engineered to satisfy the intense demand for high-purity copper concentrates in grid electrification and EV manufacture. Currently fully permitted, Copper Crest is finalizing offtake commitments with premier European smelters and battery manufacturers.',
    highlights: [
      'Direct rail link to regional deepwater shipping ports',
      'Water management plan recycles 95% of active metallurgical fluids',
      'Power supply negotiated with the Regional 200MW Solar Corridor',
      'Co-product golden credits significantly reduce forward cash cost base'
    ],
    annualProduction: [
      { year: 'FY23', volume: 45, unit: 'k tonnes' },
      { year: 'FY24', volume: 62, unit: 'k tonnes' },
      { year: 'FY25', volume: 84, unit: 'k tonnes' },
      { year: 'FY26 (Proj)', volume: 110, unit: 'k tonnes' },
      { year: 'FY27 (Proj)', volume: 125, unit: 'k tonnes' }
    ],
    drillHoles: [
      { holeId: 'CC-04-12A', depth: 150, grade: 1.45, lithology: 'Chalcopyrite Breccia' },
      { holeId: 'CC-04-12B', depth: 220, grade: 1.88, lithology: 'Supergene Oxide Zone' },
      { holeId: 'CC-04-14C', depth: 310, grade: 0.95, lithology: 'Porphyry Host intrusive' },
      { holeId: 'CC-04-15D', depth: 405, grade: 2.12, lithology: 'Massive Sulfide Bleb' }
    ]
  },
  {
    id: 'sol-salar',
    name: 'Sol Salar DLE Asset',
    location: 'Atacama Basin, Chile',
    type: 'Lithium',
    phase: 'Exploration',
    tonnage: '15.2M Tons LCE',
    grade: '840 mg/L Lithium Concentration',
    mineLife: 25,
    capex: '$580M Preliminary CapEx',
    npv: '$1.85B (at $14k Lithium LCE base)',
    irr: '29.6% IRR',
    coordinates: '23° 31\' 12" S, 68° 14\' 55" W',
    description: 'A low-footprint, state-of-the-art Direct Lithium Extraction (DLE) project designed to completely bypass open evaporation ponds. This revolutionary tech reinjects depleted brine back into subterranean aquifers, sustaining fragile desert surface ecosystems and regional water cycles.',
    highlights: [
      'Reinjects 85% of processed brine directly back to source aquifers',
      '0% evaporation-pond dependency preserving delicate desert basins',
      'Partnership with regional co-ops for local power & logistics hubs',
      'On-track to produce premium battery-grade lithium hydroxide by 2028'
    ],
    annualProduction: [
      { year: 'FY25 (Exp)', volume: 1.2, unit: 'k tons LCE' },
      { year: 'FY26 (Proj)', volume: 5.4, unit: 'k tons LCE' },
      { year: 'FY27 (Proj)', volume: 18.0, unit: 'k tons LCE' },
      { year: 'FY28 (Proj)', volume: 32.0, unit: 'k tons LCE' },
      { year: 'FY29 (Proj)', volume: 45.0, unit: 'k tons LCE' }
    ],
    drillHoles: [
      { holeId: 'SS-BR-01', depth: 120, grade: 790, lithology: 'Aquifer Halite Conglomerate' },
      { holeId: 'SS-BR-02', depth: 210, grade: 890, lithology: 'Saturated Clay Brine sand' },
      { holeId: 'SS-BR-03', depth: 340, grade: 860, lithology: 'Sub-Saline Mudstone' },
      { holeId: 'SS-BR-04', depth: 450, grade: 920, lithology: 'Deep Sand Basin Aquifer' }
    ]
  }
];

export const technicalDocsData: TechnicalDoc[] = [
  {
    id: 'ni-43-101-aura',
    title: 'NI 43-101 Feasibility Resource Statement Upper Aura Gold',
    type: 'Mineral Resource Report',
    size: '18.4 MB',
    date: 'March 14, 2026',
    isLocked: true
  },
  {
    id: 'pep-copper-crest',
    title: 'Copper Crest Phase 2 Metallurgical Fluid Efficiency Audit',
    type: 'Engineering Specification',
    size: '6.2 MB',
    date: 'April 22, 2026',
    isLocked: true
  },
  {
    id: 'esg-impact-salar',
    title: 'Direct Lithium Extraction Aquifer Hydrology Modeling Study',
    type: 'Environmental Assessment',
    size: '12.8 MB',
    date: 'May 10, 2026',
    isLocked: true
  },
  {
    id: 'annual-report-2025',
    title: 'MineX Gold, Silver & Bronze Group Annual Report & Mineral Stock Accounts 2025',
    type: 'Financial Statement',
    size: '22M oz Core Summary',
    date: 'February 28, 2026',
    isLocked: false
  },
  {
    id: 'safety-guide-lti',
    title: 'MineX Consolidated LTI Preventive Protocol & Field Safety Standard',
    type: 'Safety Guidelines',
    size: '4.1 MB',
    date: 'January 15, 2026',
    isLocked: false
  }
];

export const newsData: NewsArticle[] = [
  {
    id: 'gold-drill-high',
    title: 'MineX Intersects 154m of 4.2g/t Gold at Aura Deepfields Horizons',
    date: 'May 28, 2026',
    category: 'Exploration',
    summary: 'Aura Deepfields exploration team confirms major depth extension of our main mineralized shears. Assay results reveal record intercepts including several gold veins with visible minerals.',
    readTime: '3 min read',
    content: 'Our exploratory drilling has confirmed a spectacular underground extension of the Aura shear system. Drill hole AD-25-084 intercepted 154 meters grading 4.2 g/t Au starting at a depth of 520 meters. These results indicate a substantial upward adjustment in mine reserves before the close of the next fiscal audit. Planning for infill drill rigs is underway to bring these ounces into the proven category.'
  },
  {
    id: 'offtake-eu-bbr',
    title: 'MineX Secures Strategic Offtake Agreement with European EV Consortium',
    date: 'May 12, 2026',
    category: 'Corporate',
    summary: 'Signing of binding framework agreement ensures high-purity electrical copper and lithium hydroxide from Copper Crest and Sol Salar are committed directly to certified green manufacturing supply chains.',
    readTime: '5 min read',
    content: 'MineX Gold, Silver & Bronze Group has formalized a major, long-term mineral offtake commitment. In line with increasing international demands for direct supply chain traceability, the contract covers 30,000 tonnes of electro-refined copper concentrate and 15,000 tonnes of battery-grade lithium annually over a rolling 8-year term. Premium pricing is structured around clean, low-impact carbon auditing indices of which MineX ranks in the top decile.'
  },
  {
    id: 'q1-beating-estimates',
    title: 'Q1 2026 Financial Audits: MineX Exceeds EBITDA Guidance by 14%',
    date: 'April 30, 2026',
    category: 'Financial',
    summary: 'Underpinned by sustained gold pricing metrics and superb cost discipline at all operating divisions, operational cash flow hits a historical peak for the consolidated quarterly period.',
    readTime: '4 min read',
    content: 'We are pleased to report first-quarter earnings that demonstrate outstanding resilience and operational efficiency. Group revenue reached $385M with margins supported by record gold sustained at Aura Deepfields. High recovery rates in metallurgical processing plants yielded an additional 4% copper tonnage over the planned seasonal target, establishing solid financial footing for full-year exploration funding.'
  },
  {
    id: 'zero-harm-achievement',
    title: 'Zero Lost Time Injuries Achieved Across Solid Six-Month Campaign',
    date: 'March 22, 2026',
    category: 'ESG',
    summary: 'In line with MineX Safety Core Values, all active sites mark a historical half-year of 3.2M combined operating hours without a single recordable bodily incident.',
    readTime: '2 min read',
    content: 'Under peerless operating guidelines enforced by local safety managers, MineX is proud to note 180 consecutive operating days free from LTI events. Our preventative monitoring systems focus on dynamic site inspections, crew safety councils, and computerized risk telemetry in subsurface chambers. MineX is now targeting full compliance with internal ISO 45001 safety ratings by the fourth quarter.'
  }
];

export const stonesSoldData = [
  // FY22 data
  {
    id: 'st-22-001',
    name: 'Glacial Diamond',
    shape: 'Round Brilliant',
    size: '2.5 Carats',
    quantitySold: 140,
    unitCost: 12500,
    totalCost: 1750000,
    year: 'FY22',
    grade: 'D-Flawless (Exquisite)',
    site: 'Aura Deepfields'
  },
  {
    id: 'st-22-002',
    name: 'Aura Gold Nugget',
    shape: 'Rough Nugget',
    quantitySold: 420,
    size: '120g Raw Cluster',
    unitCost: 7800,
    totalCost: 3276000,
    year: 'FY22',
    grade: '98.4% Pure Native Gold',
    site: 'Aura Deepfields'
  },
  {
    id: 'st-22-003',
    name: 'Crest Copper Slab',
    shape: 'Anode Panel',
    size: '1.2m x 0.9m Slab',
    quantitySold: 1200,
    unitCost: 2100,
    totalCost: 2520000,
    year: 'FY22',
    grade: '99.99% Matte Copper Cathode',
    site: 'Copper Crest Phase 2'
  },

  // FY23 data
  {
    id: 'st-23-001',
    name: 'Sovereign Diamond',
    shape: 'Oval Cut',
    size: '4.2 Carats',
    quantitySold: 85,
    unitCost: 28000,
    totalCost: 2380000,
    year: 'FY23',
    grade: 'VVS1 Clarity Grade',
    site: 'Aura Deepfields'
  },
  {
    id: 'st-23-002',
    name: 'Royal Emerald',
    shape: 'Emerald Cut',
    size: '6.8 Carats',
    quantitySold: 64,
    unitCost: 19500,
    totalCost: 1248000,
    year: 'FY23',
    grade: 'Vivid Deep-Green Grade',
    site: 'Aura Deepfields'
  },
  {
    id: 'st-23-003',
    name: 'Lithium Spodumene Crystal',
    shape: 'Hexagonal Prism',
    size: '45 mm Monolithic Needle',
    quantitySold: 4500,
    unitCost: 350,
    totalCost: 1575000,
    year: 'FY23',
    grade: 'Battery-Grade High-LCE Spodumene',
    site: 'Sol Salar DLE Asset'
  },
  {
    id: 'st-23-004',
    name: 'Native Auriferous Quartz',
    shape: 'Crystalline Cluster',
    size: '22 cm Drusy Matrix',
    quantitySold: 350,
    unitCost: 4500,
    totalCost: 1575000,
    year: 'FY23',
    grade: 'High jewelry Specimen Quartz',
    site: 'Aura Deepfields'
  },

  // FY24 data
  {
    id: 'st-24-001',
    name: 'Polaris Diamond',
    shape: 'Cushion Cut',
    size: '5.8 Carats',
    quantitySold: 120,
    unitCost: 42000,
    totalCost: 5040000,
    year: 'FY24',
    grade: 'IF (Internally Flawless) Colorless',
    site: 'Aura Deepfields'
  },
  {
    id: 'st-24-002',
    name: 'Crest Copper Slab',
    shape: 'Anode Panel',
    size: '1.2m x 0.9m Slab',
    quantitySold: 2800,
    unitCost: 2450,
    totalCost: 6860000,
    year: 'FY24',
    grade: '99.99% Grade-A Copper Cathode',
    site: 'Copper Crest Phase 2'
  },
  {
    id: 'st-24-003',
    name: 'Starlight Aquamarine',
    shape: 'Asscher Cut',
    size: '14.5 Carats',
    quantitySold: 95,
    unitCost: 8200,
    totalCost: 779000,
    year: 'FY24',
    grade: 'AAA Luster Sky-Blue Mineral',
    site: 'Sol Salar DLE Asset'
  },

  // FY25 data
  {
    id: 'st-25-001',
    name: 'Aurelia Crown Diamond',
    shape: 'Pear Shape Brilliant',
    size: '8.4 Carats',
    quantitySold: 46,
    unitCost: 96000,
    totalCost: 4416000,
    year: 'FY25',
    grade: 'D-Color Triple Excellent cut',
    site: 'Aura Deepfields'
  },
  {
    id: 'st-25-002',
    name: 'Imperial Emerald',
    shape: 'Emerald Cut',
    size: '11.2 Carats',
    quantitySold: 38,
    unitCost: 52000,
    totalCost: 1976000,
    year: 'FY25',
    grade: 'Zero-treatment Intense Green Chrome-Beryl',
    site: 'Aura Deepfields'
  },
  {
    id: 'st-25-003',
    name: 'Lithium Spodumene Crystal',
    shape: 'Hexagonal Prism',
    size: '60 mm Monolithic Needle',
    quantitySold: 8500,
    unitCost: 480,
    totalCost: 4080000,
    year: 'FY25',
    grade: 'Ultra High purity Battery-Grade Spodumene',
    site: 'Sol Salar DLE Asset'
  },

  // FY26 (Projected / Proj) data
  {
    id: 'st-26-001',
    name: 'Sovereign Diamond Prime',
    shape: 'Heart Brilliant',
    size: '12.2 Carats',
    quantitySold: 30,
    unitCost: 155000,
    totalCost: 4650000,
    year: 'FY26 (Proj)',
    grade: 'Type IIa Ultra-Pure Diamond',
    site: 'Aura Deepfields'
  },
  {
    id: 'st-26-002',
    name: 'Aura Gold Nugget Large',
    shape: 'Rough Nugget',
    size: '500g Giant Cluster',
    quantitySold: 180,
    unitCost: 32500,
    totalCost: 5850000,
    year: 'FY26 (Proj)',
    grade: '99.1% High-Density Native specimen',
    site: 'Aura Deepfields'
  },
  {
    id: 'st-26-003',
    name: 'Crest Copper Slab premium',
    shape: 'Anode Panel',
    size: '1.2m x 0.9m Slab',
    quantitySold: 4200,
    unitCost: 2600,
    totalCost: 10920000,
    year: 'FY26 (Proj)',
    grade: 'High conductivity Electronic Cathode spec',
    site: 'Copper Crest Phase 2'
  }
];

