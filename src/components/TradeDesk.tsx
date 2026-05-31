import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { 
  Globe, Ship, ArrowDownToLine, ArrowUpFromLine, FileText, FileCheck, 
  Anchor, HelpCircle, Landmark, Scale, AlertTriangle, Search, Plus, 
  CheckCircle2, Loader2, RefreshCw, Layers, MapPin, Compass, Shield,
  ArrowRight, Sparkles, FileSpreadsheet, Percent, Info, Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { mineralPrices } from '../data';

interface ImportItem {
  id: string;
  name: string;
  category: 'Machinery' | 'Chemicals' | 'Energy' | 'Tools';
  unitPrice: number;
  weightPerUnit: number; // in tonnes
  defaultSource: string;
}

const importCatalog: ImportItem[] = [
  { id: 'imp-001', name: 'Solid-State Battery Loader Fleet', category: 'Machinery', unitPrice: 850000, weightPerUnit: 24, defaultSource: 'Germany' },
  { id: 'imp-002', name: 'Diamond Core Drill Bits (Grade-T8)', category: 'Tools', unitPrice: 4500, weightPerUnit: 0.1, defaultSource: 'Japan' },
  { id: 'imp-003', name: 'Floatation Reagents (Froth Active)', category: 'Chemicals', unitPrice: 1250, weightPerUnit: 1.2, defaultSource: 'USA' },
  { id: 'imp-004', name: 'Sub-Surface Vent Fans (High Temp)', category: 'Machinery', unitPrice: 135000, weightPerUnit: 4.5, defaultSource: 'Canada' },
  { id: 'imp-005', name: 'Megawatt Solar Photovoltaic Panels', category: 'Energy', unitPrice: 850, weightPerUnit: 0.05, defaultSource: 'China' },
];

interface ExportItem {
  symbol: string;
  name: string;
  unit: string;
  gradeSpec: string;
  basePrice: number; // USD per unit
}

const exportCatalog: ExportItem[] = [
  { symbol: 'XAU', name: 'Refined Gold Bullion Bar', unit: 'oz', gradeSpec: '99.99% Sovereign Grade Fine Gold', basePrice: 2350 },
  { symbol: 'HG', name: 'High-Purity Copper Anode', unit: 'lb', gradeSpec: '99.99% Grade-A Cathode Matte', basePrice: 4.60 },
  { symbol: 'LI', name: 'Battery-Grade Lithium Hydroxide', unit: 't', gradeSpec: '99.5% LiOH Monohydrate Crystals', basePrice: 13800 },
  { symbol: 'PL', name: 'Ultra-Pure Platinum Powder', unit: 'oz', gradeSpec: '99.95% Industrial Sponge Catalyst', basePrice: 1045 },
  { symbol: 'ZN', name: 'Fine Zinc Flotation Concentrate', unit: 't', gradeSpec: '55% Zinc Ore Slurry Float', basePrice: 2940 },
];

interface TradeVessel {
  vesselName: string;
  flag: string;
  type: 'Bulk Carrier' | 'Container Ship' | 'Tanker';
  origin: string;
  destination: string;
  cargo: string;
  capacityUsed: number; // percentage
  coordinates: string;
  eta: string;
  status: 'In Transit' | 'Customs Hold' | 'Discharging' | 'Oceanic Passage' | 'Clearing Harbor';
}

const initialVessels: TradeVessel[] = [
  {
    vesselName: 'M.V. Aura Sovereign',
    flag: '🇨🇦 Canada',
    type: 'Bulk Carrier',
    origin: 'Ontario Rail Terminal, CA',
    destination: 'Rotterdam Gateway port, NL',
    cargo: '15,000 oz Gold Concentrate & Drusy Assay lots',
    capacityUsed: 78,
    coordinates: '49° 12\' N, 42° 15\' W',
    eta: 'June 03, 2026',
    status: 'Oceanic Passage'
  },
  {
    vesselName: 'M.V. Crest Pioneer',
    flag: '🇦🇺 Australia',
    type: 'Bulk Carrier',
    origin: 'Brisbane Port terminal, AU',
    destination: 'Chiba Smelter Docks, JP',
    cargo: '45,000 Wet Metric Tonnes Copper Concentrate',
    capacityUsed: 92,
    coordinates: '28° 40\' S, 155° 20\' E',
    eta: 'June 01, 2026',
    status: 'In Transit'
  },
  {
    vesselName: 'M.V. Atacama Pride',
    flag: '🇨🇱 Chile',
    type: 'Container Ship',
    origin: 'Atacama Rail Express, CL',
    destination: 'Hamburg Green Battery Node, DE',
    cargo: '3,200 Tonnes Vacuum Lithium Crystals',
    capacityUsed: 65,
    coordinates: '12° 14\' S, 79° 45\' W',
    eta: 'June 08, 2026',
    status: 'In Transit'
  },
  {
    vesselName: 'M.V. Pacific Grind',
    flag: '🇯🇵 Japan',
    type: 'Container Ship',
    origin: 'Kobe Heavy Industrial Dock, JP',
    destination: 'Aura Deepfields Facility, CA',
    cargo: 'Germany Heavy Electrical Battery Loaders',
    capacityUsed: 40,
    coordinates: '43° 32\' N, 168° 12\' W',
    eta: 'June 05, 2026',
    status: 'Clearing Harbor'
  }
];

interface LedgerEntry {
  id: string;
  timestamp: string;
  tradeType: 'Import' | 'Export';
  item: string;
  party: string;
  value: number; // USD
  quantity: number;
  origin: string;
  destination: string;
  customsStatus: 'Approved' | 'Reviewing' | 'Customs Inspected' | 'Pre-Screened';
  details: {
    freightCost: number;
    tariffDuty: number;
    cbamOffset: number;
    insurance: number;
    lcReference: string;
  }
}

const initialLedger: LedgerEntry[] = [
  {
    id: 'TR-EXP-801',
    timestamp: '2026-05-31 14:22',
    tradeType: 'Export',
    item: 'High-Purity Copper Anode',
    party: 'Rotterdam Metal Refinery Co.',
    value: 690000,
    quantity: 150000, // pounds
    origin: 'Queensland, AU',
    destination: 'Rotterdam, NL',
    customsStatus: 'Approved',
    details: {
      freightCost: 14500,
      tariffDuty: 1450, // lower duty
      cbamOffset: 320,
      insurance: 4200,
      lcReference: 'LC-HSBC-2287910'
    }
  },
  {
    id: 'TR-IMP-302',
    timestamp: '2026-05-31 09:15',
    tradeType: 'Import',
    item: 'Solid-State Battery Loader Fleet',
    party: 'Siemens Industrial AG',
    value: 1700000,
    quantity: 2, // units
    origin: 'Hamburg, DE',
    destination: 'Ontario Mine Site, CA',
    customsStatus: 'Customs Inspected',
    details: {
      freightCost: 48000,
      tariffDuty: 85000,
      cbamOffset: 0, // Green zero-emission credits
      insurance: 12000,
      lcReference: 'LC-COMMERZ-9938'
    }
  },
  {
    id: 'TR-EXP-803',
    timestamp: '2026-05-30 18:40',
    tradeType: 'Export',
    item: 'Battery-Grade Lithium Hydroxide',
    party: 'Tokyo battery Giga-V Consortium',
    value: 2760000,
    quantity: 200, // tonnes
    origin: 'Atacama, CL',
    destination: 'Yokohama, JP',
    customsStatus: 'Approved',
    details: {
      freightCost: 35000,
      tariffDuty: 55200,
      cbamOffset: 1200,
      insurance: 19500,
      lcReference: 'LC-MUFG-410022'
    }
  },
  {
    id: 'TR-IMP-304',
    timestamp: '2026-05-30 11:02',
    tradeType: 'Import',
    item: 'Floatation Reagents (Froth Active)',
    party: 'Dow Specialty Compounds Inc.',
    value: 62500,
    quantity: 50, // units
    origin: 'Houston, USA',
    destination: 'Queensland Basin, AU',
    customsStatus: 'Pre-Screened',
    details: {
      freightCost: 3200,
      tariffDuty: 3125,
      cbamOffset: 180,
      insurance: 950,
      lcReference: 'LC-WELLSFARGO-881'
    }
  },
];

export default function TradeDesk() {
  const { language } = useLanguage();
  const [activeSubTab, setActiveSubTab] = useState<'export' | 'import'>('export');
  const [vessels, setVessels] = useState<TradeVessel[]>(initialVessels);
  const [ledger, setLedger] = useState<LedgerEntry[]>(initialLedger);
  const [ledgerSearch, setLedgerSearch] = useState('');
  const [selectedLedgerItem, setSelectedLedgerItem] = useState<LedgerEntry | null>(null);

  // Export Contract State
  const [expCommodity, setExpCommodity] = useState<string>('HG');
  const [expClient, setExpClient] = useState<string>('Eurometal Smelting Ltd (Hamburg)');
  const [expQty, setExpQty] = useState<number>(50000); // units
  const [expMineSource, setExpMineSource] = useState<string>('Copper Crest Phase 2');
  const [expTradeTerm, setExpTradeTerm] = useState<'FOB' | 'CIF'>('FOB');
  const [isProcessingExport, setIsProcessingExport] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Import Sourcing State
  const [impCommodity, setImpCommodity] = useState<string>('imp-001');
  const [impOrigin, setImpOrigin] = useState<string>('Germany');
  const [impQty, setImpQty] = useState<number>(1);
  const [impDestMine, setImpDestMine] = useState<string>('Aura Deepfields');
  const [isProcessingImport, setIsProcessingImport] = useState(false);

  // Localized manual dictionary for high translation stability
  const i18n: Record<string, any> = {
    en: {
      tabTitle: "MineX Sovereign Trade Desk",
      tabSubtitle: "Import Sourcing Logistics & Bulk Metallurgy Sales Audits",
      statsTitleImport: "Active Inward Shipments",
      statsTitleExport: "Active Export Cargo",
      statsInTransit: "Vessels Underway",
      statsTotalLC: "Letters of Credit Held",
      exportMode: "Outport Trading (Metallurgical Sales Contract)",
      importMode: "Inport Trading (Equipment & Reagents Sourcing)",
      catalogLabel: "Select Commodity Specification",
      quantityLabel: "Custom Shipment Quantity",
      buyerLabel: "Corporate Purchaser / Destination Site",
      incotermsLabel: "Trade Term Structure (Incoterms)",
      sourceMineLabel: "Sourced Origin Mine Site",
      destinationMineLabel: "Delivery Target Mine Site",
      originLabel: "Import Manufacturer Origin",
      buttonAddContract: "Execute Trade Consignment Contract",
      calcFobFree: "Free on Board (FOB) Delivery offset",
      calcCifCost: "Carbon/Freight/Insurance (CIF) delivery",
      pricingBreakdown: "Real-Time Trade Invoicing Metrics ($ USD)",
      baseValue: "Raw Base Commodity Value",
      oceanFreightValue: "International Oceanic Freight",
      tariffDutyValue: "Import Tariffs / Sovereign Customs Duties",
      cbamOffsetValue: "Carbon Border Offset (CBAM)",
      totalConsignmentCost: "Total Cargo Consignment Net",
      vesselHeader: "Global Fleet Cargo Coordinates",
      vesselSearchLabel: "Live vessel coordinate tracking stream & ETA schedules",
      vesselStatusHold: "Customs Hold",
      vesselStatusTransit: "Transit Voyage",
      vesselStatusHarbor: "Port Inflow",
      vesselCapacity: "Capacity",
      ledgerHeader: "Sovereign Trade Ledger & Auditable Records",
      ledgerDescription: "Dual-signed contracts, Letters of Credit, customs clearance papers, and metallurgical assay logs.",
      searchPlaceholder: "Search ID, commodity, party, port...",
      colId: "Trade ID",
      colType: "Type",
      colItem: "Cargo Spec",
      colParty: "Counterparty",
      colValue: "Value (USD)",
      colStatus: "Customs Clear",
      colAction: "Assay Cert",
      detailsReceiptTitle: "Verified Trade Consignment Receipt",
      detailsReceiptSubtitle: "Sovereign Customs Clearance Record",
      certifyAssay: "Inspect NI 43-101 Core Quality Assurance Seal",
      letterOfCredit: "Registered Letter of Credit Ref",
      shipmentRoute: "Shipment Route Corridor",
      customsApproved: "Ready / Approved For Dispatch"
    },
    fr: {
      tabTitle: "Bureau d’Échange Souverain de MineX",
      tabSubtitle: "Logistique d'Importation & Audits des Ventes Métallurgiques",
      statsTitleImport: "Cargaisons à l'Import Actives",
      statsTitleExport: "Cargaisons à l'Export Actives",
      statsInTransit: "Vaisseaux en Mer",
      statsTotalLC: "Lettres de Crédit Détenues",
      exportMode: "Ventes Export (Outport Trading)",
      importMode: "Sourcing Import (Inport Trading)",
      catalogLabel: "Sélectionner la Spécification de Métal / Moyen",
      quantityLabel: "Quantité de Cargaison Spécifique",
      buyerLabel: "Acheteur Corporatif / Port de Destination",
      incotermsLabel: "Structure de Transp (Incoterms)",
      sourceMineLabel: "Mine d’Origine de l’Extraction",
      destinationMineLabel: "Mine de Destination de l’Import",
      originLabel: "Pays d'Origine de Fabrication",
      buttonAddContract: "Émettre l’Ordre d’Expédition de Lot",
      pricingBreakdown: "Métriques d'Évaluation de Facturation ($ USD)",
      baseValue: "Valeur de Base de la Matière",
      oceanFreightValue: "Fret Maritime International",
      tariffDutyValue: "Droits de Douane Souverains",
      cbamOffsetValue: "Ajustement Carbone Frontière (MACF)",
      totalConsignmentCost: "Net Global du Consignation",
      vesselHeader: "Position de la Flotte de Fret MineX",
      vesselSearchLabel: "Suivi des navires en temps réel & dates de livraison estimées",
      vesselStatusHold: "Douane Rétention",
      vesselStatusTransit: "En Voyage Maritime",
      vesselStatusHarbor: "Entrée Portuaire",
      vesselCapacity: "Volume Occupé",
      ledgerHeader: "Compte Souverain des Transactions",
      ledgerDescription: "Documentation signée, Lettres de Crédit, certificats d'assises géologiques.",
      searchPlaceholder: "Rechercher un ID, un métal, une entité...",
      colId: "ID Échange",
      colType: "Type",
      colItem: "Détail Matériel",
      colParty: "Contrepartie",
      colValue: "Valeur USD",
      colStatus: "Douane Clear",
      colAction: "Certif Qualité",
      detailsReceiptTitle: "Certificat d'Échange Maritime Officiel",
      detailsReceiptSubtitle: "Reçu d'Agrément Douanier International",
      certifyAssay: "Inspecter le Sceau de Qualité Biologique Métal",
      letterOfCredit: "ID Lettre de Crédit Garantie",
      shipmentRoute: "Corridor de Routage Maritime",
      customsApproved: "Approuvé pour Libération Directe"
    },
    rw: {
      tabTitle: "Ibiro by’Icuruzwa ry’Amabuye rya MineX",
      tabSubtitle: "Icungamari ry'Amabuye n'Ibyizeranywa ku Gucuruza Amabuye y'Acukurwa",
      statsTitleImport: "Amabuye Azanwa mu Gihugu",
      statsTitleExport: "Amabuye Acukurwa Cyurwa",
      statsInTransit: "Ubutegetsi mu Ndorerezi",
      statsTotalLC: "Letters of Credit Zifashwe",
      exportMode: "Kugurisha no Kwohereza (Outport Trading)",
      importMode: "Kugura n'Ibyinjira mu Kigo (Inport Trading)",
      catalogLabel: "Hitamo Amakuru y'Umwirondoro w'Amabuye",
      quantityLabel: "Ingano y'Ibicuruzwa Byoherezwa",
      buyerLabel: "Ikigo Kigura / Aho Bisohokera",
      incotermsLabel: "Uburyo bwo Kwishyura Fret (Incoterms)",
      sourceMineLabel: "Ikirombe Cyacukuwemo",
      destinationMineLabel: "Aho Imashine Igenewe Gukoreshwa",
      originLabel: "Igihugu Amashine Yakorewemo",
      buttonAddContract: "Kora Amasezerano y'Icuruzwa na Cargo",
      pricingBreakdown: "Isesengura ry'Ibiciro n'Amafaranga ($ USD)",
      baseValue: "Agaciro k'Ubutare Bukomoka",
      oceanFreightValue: "Inzira n'Urushako rwa Fret ku Nyanja",
      tariffDutyValue: "Imisoro n'Amahoro ya Douane",
      cbamOffsetValue: "Ikiguzi cy'Ibidukikije (CBAM Offset)",
      totalConsignmentCost: "Ikiguzi Cyose hamwe cya Cargo",
      vesselHeader: "Ikarita n'Imiterere y'Inyandiko ku Matwara",
      vesselSearchLabel: "Ihe rigezweho rya Live GPS ku nyanja hamwe n'igihe cy'ishika (ETA)",
      vesselStatusHold: "Zifashwe na Douane",
      vesselStatusTransit: "Muri Transit ku Nyanja",
      vesselStatusHarbor: "Zigeze ku Cyambu",
      vesselCapacity: "Umwanya Wafashwe",
      ledgerHeader: "Ububiko n'Amateka y'Icuruzi Ryayunguruwe",
      ledgerDescription: "Inyandiko z'Amasezerano zihuriweho, Impapuro za Douane, and Assay Quality Certifications.",
      searchPlaceholder: "Shakisha ID, ubutare, and site...",
      colId: "Nimero y'Isoko",
      colType: "Ubwoko",
      colItem: "Ibicuruzwa",
      colParty: "Uwo Mugurishije",
      colValue: "Agaciro (USD)",
      colStatus: "Urukundo rwa Douane",
      colAction: "Ibimenyetso by'Assay",
      detailsReceiptTitle: "Inyandiko Ngufi y' Icuruzwa",
      detailsReceiptSubtitle: "Impapuro Zemejwe n'Urwego rwa Douane",
      certifyAssay: "Isesengura rya NI 43-101 rema Agaciro",
      letterOfCredit: "Inyandiko ya Letter of Credit Reference",
      shipmentRoute: "Inzira y'Ubwikorezi ku Ikarita",
      customsApproved: "Yiteguye Kurekurwa ku Cyambu"
    },
    es: {
      tabTitle: "Mesa de Comercio Soberano de MineX",
      tabSubtitle: "Aduanas de Importación y Auditorías de Exportación de Minerales",
      statsTitleImport: "Cargamentos de Importación Activos",
      statsTitleExport: "Cargamentos de Exportación Activos",
      statsInTransit: "Buques en Ruta",
      statsTotalLC: "Cartas de Crédito Emitidas",
      exportMode: "Ventas de Exportación (Outport Trading)",
      importMode: "Adquisición de Importación (Inport Trading)",
      catalogLabel: "Selección del Tipo de Material / Maquinaria",
      quantityLabel: "Cantidad del Consignamiento",
      buyerLabel: "Comprador Regulado / Puerto Destino",
      incotermsLabel: "Estructura de Transporte (Incoterms)",
      sourceMineLabel: "Mina de Origen del Concentrado",
      destinationMineLabel: "Mina de Destino de la Entrega",
      originLabel: "Origen del Fabricante Industrial",
      buttonAddContract: "Emitir Factura y Orden de Carga Internacional",
      pricingBreakdown: "Desglose de Costos de la Transacción ($ USD)",
      baseValue: "Valor Base de la Materia Prima",
      oceanFreightValue: "Flete Marítimo de Ultramar",
      tariffDutyValue: "Impuestos Arancelarios y Aduaneros",
      cbamOffsetValue: "Ajuste por Carbono (CBAM)",
      totalConsignmentCost: "Costo Neto Total del Cargamento",
      vesselHeader: "Posiciones Geográficas de Buques Cargo",
      vesselSearchLabel: "Coordenadas GPS de buques activos y fechas estimadas de llegada",
      vesselStatusHold: "Retenido aduana",
      vesselStatusTransit: "Tránsito en Alta Mar",
      vesselStatusHarbor: "Entrada Puerto",
      vesselCapacity: "Capacidad Utilizada",
      ledgerHeader: "Historial de Aduanas y Libros de Consignaciones",
      ledgerDescription: "Cartas de crédito, manifiestos de embarque y sellos de laboratorios QP.",
      searchPlaceholder: "Buscar por ID, puerto, comprador...",
      colId: "ID de Tránsito",
      colType: "Clase",
      colItem: "Mercancía",
      colParty: "Contraparte",
      colValue: "Valor (USD)",
      colStatus: "Control Aduana",
      colAction: "Certificar",
      detailsReceiptTitle: "Certificado de Aduanas y Manifiesto",
      detailsReceiptSubtitle: "Declaración de Embarque Import/Export",
      certifyAssay: "Verificar Dictamen Metálico de Calidad NI 43-101",
      letterOfCredit: "Referencia de Crédito Bancario",
      shipmentRoute: "Canal y Corredor Marítimo",
      customsApproved: "Aprobado para Carga Directa"
    }
  };

  // Safe multilingual resolver falling back to English
  const getLoc = (key: string) => {
    return i18n[language]?.[key] || i18n['en']?.[key] || key;
  };

  // Lookup base objects based on selected state items
  const selectedExportItem = exportCatalog.find(i => i.symbol === expCommodity) || exportCatalog[0];
  const selectedImportItem = importCatalog.find(i => i.id === impCommodity) || importCatalog[0];

  // Computational Engines based on shipping, quantity, and Incoterms
  // Exports calculations
  const exportBaseValue = selectedExportItem.basePrice * expQty;
  const exportFreight = expTradeTerm === 'CIF' ? (expQty * 0.08) : 0; // standard freight math
  const exportTaxes = exportBaseValue * 0.02; // 2% sovereign mining export fee
  const exportCbam = expCommodity === 'HG' || expCommodity === 'ZN' ? (expQty * 0.15) : 0; // CBAM environmental offset fee
  const exportTotal = exportBaseValue + exportFreight + exportTaxes + exportCbam;

  // Imports calculations
  const importBaseValue = selectedImportItem.unitPrice * impQty;
  const importFreight = (selectedImportItem.weightPerUnit * impQty) * 1250; // $1250 per tonne
  const importTariff = importBaseValue * (impOrigin === 'Germany' || impOrigin === 'Japan' ? 0.03 : 0.05); // preferential tariffs
  const importCbam = selectedImportItem.category === 'Chemicals' ? (importBaseValue * 0.02) : 0; // chemicals offset
  const importTotal = importBaseValue + importFreight + importTariff + importCbam;

  const handleContractSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorPrompt(null);

    // Guard on unreasonable entries
    if (expQty <= 0 || impQty <= 0) {
      setErrorPrompt("Tonnage and piece counts must be positive integers.");
      return;
    }

    if (activeSubTab === 'export') {
      setIsProcessingExport(true);
      setTimeout(() => {
        // Create dynamic ledger consignment
        const newEntry: LedgerEntry = {
          id: `TR-EXP-${Math.floor(100 + Math.random() * 900)}`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
          tradeType: 'Export',
          item: selectedExportItem.name,
          party: expClient,
          value: Number(exportTotal.toFixed(2)),
          quantity: expQty,
          origin: expMineSource,
          destination: expClient.includes('Rotterdam') ? 'Rotterdam, NL' : expClient.includes('Hamburg') ? 'Hamburg, DE' : 'Yokohama, JP',
          customsStatus: 'Approved',
          details: {
            freightCost: Number(exportFreight.toFixed(2)),
            tariffDuty: Number(exportTaxes.toFixed(2)),
            cbamOffset: Number(exportCbam.toFixed(2)),
            insurance: Number((exportBaseValue * 0.005).toFixed(2)),
            lcReference: `LC-${expClient.split(' ')[0].toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`
          }
        };

        setLedger(prev => [newEntry, ...prev]);
        setIsProcessingExport(false);
        showSuccessToast(`Export Consignment Certificate ${newEntry.id} generated for ${newEntry.party}!`);
        
        // Feed into maritime vessels too
        const newVessel: TradeVessel = {
          vesselName: `M.V. MineX Sovereign ${Math.floor(10 + Math.random() * 90)}`,
          flag: '🇨🇦 Canada',
          type: 'Bulk Carrier',
          origin: expMineSource,
          destination: newEntry.destination,
          cargo: `${expQty} ${selectedExportItem.unit} of Premium ${selectedExportItem.name}`,
          capacityUsed: 80,
          coordinates: '32° 15\' N, 142° 10\' W',
          eta: 'June 12, 2026',
          status: 'Clearing Harbor'
        };
        setVessels(prev => [newVessel, ...prev]);
        setSelectedLedgerItem(newEntry);
      }, 1500);
    } else {
      setIsProcessingImport(true);
      setTimeout(() => {
        const newEntry: LedgerEntry = {
          id: `TR-IMP-${Math.floor(100 + Math.random() * 900)}`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
          tradeType: 'Import',
          item: selectedImportItem.name,
          party: impOrigin === 'Germany' ? 'Siemens Industrial AG' : impOrigin === 'Japan' ? 'Komatsu heavy S.A.' : 'Caterpillar Sourcing Ltd',
          value: Number(importTotal.toFixed(2)),
          quantity: impQty,
          origin: impOrigin,
          destination: `${impDestMine} Site`,
          customsStatus: 'Customs Inspected',
          details: {
            freightCost: Number(importFreight.toFixed(2)),
            tariffDuty: Number(importTariff.toFixed(2)),
            cbamOffset: Number(importCbam.toFixed(2)),
            insurance: Number((importBaseValue * 0.008).toFixed(2)),
            lcReference: `LC-IMPORT-${Math.floor(1000 + Math.random() * 9000)}`
          }
        };

        setLedger(prev => [newEntry, ...prev]);
        setIsProcessingImport(false);
        showSuccessToast(`Import Clearance document ${newEntry.id} launched for ${selectedImportItem.name}!`);
        setSelectedLedgerItem(newEntry);
      }, 1500);
    }
  };

  const showSuccessToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 5000);
  };

  // State guards
  const [errorPrompt, setErrorPrompt] = useState<string | null>(null);

  // Filter trade history ledger
  const filteredLedger = ledger.filter(entry => {
    if (!ledgerSearch) return true;
    const s = ledgerSearch.toLowerCase();
    return (
      entry.id.toLowerCase().includes(s) ||
      entry.item.toLowerCase().includes(s) ||
      entry.party.toLowerCase().includes(s) ||
      entry.origin.toLowerCase().includes(s) ||
      entry.destination.toLowerCase().includes(s)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 space-y-10" id="trade-operations-grid">
      {/* Dynamic Toast Feedback Overlay */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-amber-500 border border-slate-950 font-mono text-slate-950 px-6 py-3 shadow-2xl flex items-center gap-3"
          >
            <CheckCircle2 className="w-5 h-5 text-slate-950" />
            <span className="text-xs font-black uppercase tracking-wider">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Title Section */}
      <div className="border-b border-slate-800 pb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4 text-left">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1 text-[10px] font-mono font-bold text-amber-500 tracking-widest uppercase">
            <Globe className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '20s' }} />
            <span>METALLURGICIAL CONSIGNMENTS & TRADING LOGISTICS</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black font-sans uppercase tracking-tight text-white flex items-center gap-2.5">
            {getLoc('tabTitle')}
          </h2>
          <p className="text-xs text-slate-400 font-light leading-relaxed max-w-2xl">
            {getLoc('tabSubtitle')}
          </p>
        </div>

        {/* System parameters feedback */}
        <div className="flex gap-4 font-mono text-[9px] text-slate-500 bg-slate-900/60 p-3.5 border border-slate-850">
          <div className="space-y-0.5">
            <p className="text-slate-600 uppercase font-bold">Inland Clearance Hub</p>
            <p className="text-white font-black">MINEX-REG-LME</p>
          </div>
          <div className="w-px bg-slate-800"></div>
          <div className="space-y-0.5">
            <p className="text-slate-600 uppercase font-bold">Standard Protocol</p>
            <p className="text-emerald-500 font-black">ISO 9001 / ICC INCO</p>
          </div>
        </div>
      </div>

      {/* Mini-dashboard Analytics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
        {[
          {
            label: getLoc('statsTitleImport'),
            value: ledger.filter(l => l.tradeType === 'Import').length,
            unit: 'Shipments Sourced',
            icon: ArrowDownToLine,
            color: 'text-amber-500'
          },
          {
            label: getLoc('statsTitleExport'),
            value: ledger.filter(l => l.tradeType === 'Export').length,
            unit: 'Bulk Ores Dispatched',
            icon: ArrowUpFromLine,
            color: 'text-emerald-500'
          },
          {
            label: getLoc('statsInTransit'),
            value: vessels.length,
            unit: 'Sovereign Vessels Live',
            icon: Ship,
            color: 'text-cyan-500'
          },
          {
            label: getLoc('statsTotalLC'),
            value: `$${(ledger.reduce((acc, l) => acc + l.value, 0) / 1000000).toFixed(2)}M`,
            unit: 'FOB/CIF Commercial Guarantee',
            icon: Landmark,
            color: 'text-slate-300'
          }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-slate-900 border border-slate-800 p-5 rounded-none flex flex-col justify-between hover:border-slate-700 transition-colors">
              <span className="text-[9px] text-slate-500 font-mono uppercase font-black tracking-wider block">{stat.label}</span>
              <div className="flex items-baseline justify-between mt-3">
                <span className="text-xl md:text-2xl font-black font-mono text-white">{stat.value}</span>
                <Icon className={`w-4 h-4 ${stat.color} stroke-[2.2]`} />
              </div>
              <p className="text-[10px] text-slate-400 font-mono mt-1 font-semibold">{stat.unit}</p>
            </div>
          );
        })}
      </div>

      {/* Interactive Sourcing vs Sales Portals Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
        
        {/* Left Hand: Import/Export Rate Calculators */}
        <div className="lg:col-span-7 bg-slate-900/40 border border-slate-800 p-6 space-y-6">
          <div className="flex border-b border-slate-800 font-mono text-[10px] tracking-widest uppercase font-black">
            <button
              onClick={() => { setActiveSubTab('export'); setErrorPrompt(null); }}
              className={`flex-1 py-3 px-4 border-b-2 flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeSubTab === 'export'
                  ? 'border-emerald-500 text-emerald-400 bg-slate-900'
                  : 'border-transparent text-slate-500 hover:text-white'
              }`}
            >
              <ArrowUpFromLine className="w-3.5 h-3.5" />
              <span>{getLoc('exportMode')}</span>
            </button>
            <button
              onClick={() => { setActiveSubTab('import'); setErrorPrompt(null); }}
              className={`flex-1 py-3 px-4 border-b-2 flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeSubTab === 'import'
                  ? 'border-amber-500 text-amber-500 bg-slate-900'
                  : 'border-transparent text-slate-500 hover:text-white'
              }`}
            >
              <ArrowDownToLine className="w-3.5 h-3.5" />
              <span>{getLoc('importMode')}</span>
            </button>
          </div>

          {/* Form Wizard */}
          <form onSubmit={handleContractSubmit} className="space-y-5 font-mono text-xs">
            {errorPrompt && (
              <div className="p-3 bg-red-950/40 border border-red-800 text-red-400 font-mono text-[11px] leading-tight flex items-start gap-2 uppercase">
                <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span>⚠ {errorPrompt}</span>
              </div>
            )}

            {activeSubTab === 'export' ? (
              <>
                {/* Outport (Export) Configuration Panel */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[9px] text-slate-500 uppercase font-black tracking-widest">{getLoc('catalogLabel')}</label>
                    <select 
                      value={expCommodity}
                      onChange={(e) => setExpCommodity(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 px-3 py-2 text-white font-black cursor-pointer rounded-none focus:outline-none focus:border-emerald-500"
                    >
                      {exportCatalog.map(item => (
                        <option key={item.symbol} value={item.symbol}>{item.name} ({item.gradeSpec})</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[9px] text-slate-500 uppercase font-black tracking-widest">{getLoc('quantityLabel')} ({selectedExportItem.unit})</label>
                    <div className="relative">
                      <input 
                        type="number"
                        min={1}
                        required
                        value={expQty}
                        onChange={(e) => setExpQty(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-850 px-3 py-2 text-white font-black rounded-none focus:outline-none focus:border-emerald-500"
                      />
                      <span className="absolute right-3 top-2 text-[9px] text-slate-500 font-black uppercase">{selectedExportItem.unit}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[9px] text-slate-500 uppercase font-black tracking-widest">{getLoc('buyerLabel')}</label>
                    <select 
                      value={expClient}
                      onChange={(e) => setExpClient(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 px-3 py-2 text-white font-black cursor-pointer rounded-none focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Rotterdam metallurgical Refinery Co. (Rotterdam)">Rotterdam Metallurgical Refinery Co. (Rotterdam, NL)</option>
                      <option value="Tokyo Battery Giga-V Consortium (Yokohama)">Tokyo Battery Giga-V Consortium (Yokohama, JP)</option>
                      <option value="Sovereign Reserve Security vault (Vancouver)">Sovereign Reserve Vault (Vancouver, CA)</option>
                      <option value="ThyssenKrupp Industrial smelting (Hamburg)">ThyssenKrupp Industrial Smelting (Hamburg, DE)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[9px] text-slate-500 uppercase font-black tracking-widest">{getLoc('incotermsLabel')}</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setExpTradeTerm('FOB')}
                        className={`py-2 px-3 border transition-colors font-black text-center cursor-pointer font-mono text-[10px] ${
                          expTradeTerm === 'FOB' 
                            ? 'bg-emerald-950/40 border-emerald-500 text-emerald-400' 
                            : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-white'
                        }`}
                      >
                        FOB - Free on Board
                      </button>
                      <button
                        type="button"
                        onClick={() => setExpTradeTerm('CIF')}
                        className={`py-2 px-3 border transition-colors font-black text-center cursor-pointer font-mono text-[10px] ${
                          expTradeTerm === 'CIF' 
                            ? 'bg-emerald-950/40 border-emerald-500 text-emerald-400' 
                            : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-white'
                        }`}
                      >
                        CIF - Cost, Ins, Freight
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[9px] text-slate-500 uppercase font-black tracking-widest">{getLoc('sourceMineLabel')}</label>
                  <select 
                    value={expMineSource}
                    onChange={(e) => setExpMineSource(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 px-3 py-2 text-white font-black cursor-pointer rounded-none focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Aura Deepfields Mine Site (CA)">Aura Deepfields Mine Site – Ontario, Canada</option>
                    <option value="Copper Crest Phase 2 Site (AU)">Copper Crest Phase 2 Site – Queensland, Australia</option>
                    <option value="Sol Salar DLE Basin (CL)">Sol Salar DLE Basin – Atacama Basin, Chile</option>
                  </select>
                </div>
              </>
            ) : (
              <>
                {/* Inport (Import) Sourcing Config */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[9px] text-slate-500 uppercase font-black tracking-widest">{getLoc('catalogLabel')}</label>
                    <select 
                      value={impCommodity}
                      onChange={(e) => setImpCommodity(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 px-3 py-2 text-white font-black cursor-pointer rounded-none focus:outline-none focus:border-amber-500"
                    >
                      {importCatalog.map(item => (
                        <option key={item.id} value={item.id}>{item.name} (${item.unitPrice.toLocaleString()} ea)</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[9px] text-slate-500 uppercase font-black tracking-widest">{getLoc('quantityLabel')} (Units)</label>
                    <input 
                      type="number"
                      min={1}
                      required
                      value={impQty}
                      onChange={(e) => setImpQty(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-850 px-3 py-2 text-white font-black rounded-none focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[9px] text-slate-500 uppercase font-black tracking-widest">{getLoc('originLabel')}</label>
                    <select 
                      value={impOrigin}
                      onChange={(e) => setImpOrigin(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 px-3 py-2 text-white font-black cursor-pointer rounded-none focus:outline-none focus:border-amber-500"
                    >
                      <option value="Germany">Germany (Preferential Tariff Agreement)</option>
                      <option value="Japan">Japan (Sovereign Offtake Ally)</option>
                      <option value="USA">United States (NAFTA Corridor)</option>
                      <option value="China">China (Strategic Solar Node)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[9px] text-slate-500 uppercase font-black tracking-widest">{getLoc('destinationMineLabel')}</label>
                    <select 
                      value={impDestMine}
                      onChange={(e) => setImpDestMine(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 px-3 py-2 text-white font-black cursor-pointer rounded-none focus:outline-none focus:border-amber-500"
                    >
                      <option value="Aura Deepfields">Aura Deepfields Site – Ontario, CA</option>
                      <option value="Copper Crest">Copper Crest Phase 2 – Queensland, AU</option>
                      <option value="Sol Salar DLE">Sol Salar DLE – Atacama, CL</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* Calculations Invoicing Panel */}
            <div className="bg-slate-950 border border-slate-850 p-4 space-y-3">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                <Scale className="w-3.5 h-3.5 text-amber-500" />
                <span>{getLoc('pricingBreakdown')}</span>
              </div>
              
              <div className="space-y-1.5 text-[11px] text-slate-400">
                <div className="flex justify-between">
                  <span>{getLoc('baseValue')}:</span>
                  <span className="text-white font-bold font-mono">
                    ${(activeSubTab === 'export' ? exportBaseValue : importBaseValue).toLocaleString(undefined, {minimumFractionDigits: 2})}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{getLoc('oceanFreightValue')}:</span>
                  <span className="text-slate-300 font-mono">
                    ${(activeSubTab === 'export' ? exportFreight : importFreight).toLocaleString(undefined, {minimumFractionDigits: 2})}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{getLoc('tariffDutyValue')}:</span>
                  <span className="text-slate-300 font-mono">
                    ${(activeSubTab === 'export' ? exportTaxes : importTariff).toLocaleString(undefined, {minimumFractionDigits: 2})}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{getLoc('cbamOffsetValue')}:</span>
                  <span className="text-[10px] text-slate-500 italic font-sans flex items-center gap-1">
                    <Info className="w-3 h-3 text-emerald-500" />
                    <span>Based on carbon offsets</span>
                  </span>
                  <span className="text-emerald-500 font-mono font-bold">
                    ${(activeSubTab === 'export' ? exportCbam : importCbam).toLocaleString(undefined, {minimumFractionDigits: 2})}
                  </span>
                </div>
                <div className="border-t border-slate-850 pt-2 flex justify-between text-xs font-black uppercase text-white">
                  <span>{getLoc('totalConsignmentCost')}:</span>
                  <span className="text-amber-500 font-bold tracking-tight">
                    ${(activeSubTab === 'export' ? exportTotal : importTotal).toLocaleString(undefined, {minimumFractionDigits: 2})}
                  </span>
                </div>
              </div>
            </div>

            {/* Action dispatch button */}
            <button
              type="submit"
              disabled={isProcessingExport || isProcessingImport}
              className={`w-full py-3 text-[10px] font-black uppercase tracking-widest transition-all rounded-none flex items-center justify-center gap-2 cursor-pointer ${
                activeSubTab === 'export'
                  ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                  : 'bg-amber-500 text-slate-950 hover:bg-amber-400'
              }`}
            >
              {(isProcessingExport || isProcessingImport) ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Clearing trade ledgers...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5 text-slate-950" />
                  <span>{getLoc('buttonAddContract')}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Hand: Active Marine Vessel Fleet Coordinate Stream */}
        <div className="lg:col-span-5 bg-slate-900/40 border border-slate-800 p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono font-black text-white uppercase">
                  <Ship className="w-4 h-4 text-cyan-500 animate-pulse" />
                  <span>{getLoc('vesselHeader')}</span>
                </div>
                <p className="text-[10px] text-slate-500 font-mono lowercase">
                  {getLoc('vesselSearchLabel')}
                </p>
              </div>
              <button 
                onClick={() => setVessels(initialVessels)}
                className="p-1 px-1.5 bg-slate-950 hover:bg-slate-900 border border-slate-850 font-mono text-[9px] uppercase tracking-wider text-slate-400 hover:text-white"
                title="Reset Fleet Tracking coordinates"
              >
                Reset Fleet
              </button>
            </div>

            {/* Vessels List */}
            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {vessels.map((v, i) => (
                <div key={i} className="bg-slate-950 border border-slate-850 p-4 relative overflow-hidden text-left hover:border-slate-700 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-black tracking-tight text-white block">{v.vesselName}</span>
                      <span className="text-[9px] text-slate-500 font-mono font-bold block">{v.flag} • {v.type}</span>
                    </div>
                    <span className={`text-[8px] font-mono font-black uppercase px-1.5 py-0.5 border ${
                      v.status === 'Customs Hold' 
                        ? 'border-red-900 bg-red-950/20 text-red-400' 
                        : v.status === 'Clearing Harbor' 
                        ? 'border-amber-900 bg-amber-950/20 text-amber-500' 
                        : 'border-cyan-900 bg-cyan-950/20 text-cyan-400'
                    }`}>
                      {v.status}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-[9px] font-mono leading-loose text-slate-400 border-t border-slate-900 pt-2.5">
                    <div>
                      <p className="text-[8px] text-slate-600 uppercase font-black font-sans">Route corridor</p>
                      <p className="text-slate-300 font-bold truncate flex items-center gap-1">
                        <span>{v.origin.split(' ')[0]}</span>
                        <ArrowRight className="w-2.5 h-2.5 text-slate-500 shrink-0" />
                        <span>{v.destination.split(' ')[0]}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-[8px] text-slate-600 uppercase font-black font-sans">GPS coordinate</p>
                      <p className="text-white font-semibold flex items-center gap-1">
                        <Compass className="w-3 h-3 text-amber-500" />
                        <span>{v.coordinates}</span>
                      </p>
                    </div>
                  </div>

                  {/* Cargo Description */}
                  <div className="mt-2 text-[9px] bg-slate-900/60 p-2 border border-slate-900 font-mono text-slate-400 flex items-center justify-between">
                    <span className="truncate max-w-[70%]">Cargo: <strong>{v.cargo}</strong></span>
                    <span className="text-[8px] text-slate-500">Vol {v.capacityUsed}%</span>
                  </div>

                  {/* ETA bar */}
                  <div className="mt-2 flex justify-between items-center text-[8.5px] font-mono text-slate-500 bg-slate-900/20 px-2 py-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-2.5 h-2.5" />
                      <span>ETA System: <strong>{v.eta}</strong></span>
                    </span>
                    <span className="text-[7.5px] text-emerald-400 font-bold uppercase tracking-wider animate-pulse">Sovereign Stream Active</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-900 p-4 mt-6 text-left">
            <h5 className="text-[9px] font-mono uppercase font-black text-emerald-500 tracking-wider flex items-center gap-1 mb-1">
              <Shield className="w-3.5 h-3.5" />
              <span>MARITIME INSURANCE CONFORMITY SEAL</span>
            </h5>
            <p className="text-[10px] text-slate-500 font-serif leading-relaxed">
              All vessels registered under the MineX ocean group fly conforming OECD country colors and are backed by $250M Lloyd's underwriting assurance. Metallurgical cargo is held under strict CIF / FOB custody rules.
            </p>
          </div>
        </div>
      </div>

      {/* Sovereign Trade Ledger Area */}
      <div className="bg-slate-900/50 border border-slate-800 p-6 space-y-6 text-left" id="consignments-ledger">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="space-y-1">
            <h3 className="text-lg font-bold uppercase tracking-wider text-slate-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-500" />
              <span>{getLoc('ledgerHeader')}</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
              {getLoc('ledgerDescription')}
            </p>
          </div>

          {/* Ledger search bar */}
          <div className="relative font-mono">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-600" />
            <input 
              type="text"
              placeholder={getLoc('searchPlaceholder')}
              value={ledgerSearch}
              onChange={(e) => setLedgerSearch(e.target.value)}
              className="bg-slate-950 border border-slate-850 pl-10 pr-4 py-2 text-xs text-white placeholder:text-slate-700 w-full md:w-64 focus:outline-none focus:border-amber-500 font-bold rounded-none"
            />
          </div>
        </div>

        {/* Ledger grid & Selected Cert Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main ledger list */}
          <div className="lg:col-span-8 overflow-x-auto">
            <table className="w-full text-left font-mono text-[11px] border-collapse">
              <thead>
                <tr className="border-b border-slate-850 text-slate-500 uppercase font-black text-[9px] tracking-widest bg-slate-950/40">
                  <th className="py-3 px-3">{getLoc('colId')}</th>
                  <th className="py-3 px-3">{getLoc('colType')}</th>
                  <th className="py-3 px-3">{getLoc('colItem')}</th>
                  <th className="py-3 px-3">{getLoc('colParty')}</th>
                  <th className="py-3 px-3 text-right">{getLoc('colValue')}</th>
                  <th className="py-3 px-3 text-center">{getLoc('colStatus')}</th>
                  <th className="py-3 px-2 text-center">{getLoc('colAction')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredLedger.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-600">
                      No registered trade transactions match search parameters.
                    </td>
                  </tr>
                ) : (
                  filteredLedger.map((entry) => (
                    <tr 
                      key={entry.id} 
                      onClick={() => setSelectedLedgerItem(entry)}
                      className={`border-b border-slate-900 hover:bg-slate-900/60 cursor-pointer transition-colors ${
                        selectedLedgerItem?.id === entry.id ? 'bg-slate-900/80 border-l-4 border-l-amber-500 pl-2' : ''
                      }`}
                    >
                      <td className="py-3 px-3 font-black text-slate-300">{entry.id}</td>
                      <td className="py-3 px-3">
                        <span className={`px-1.5 py-0.5 font-bold ${
                          entry.tradeType === 'Export' ? 'text-emerald-500 bg-emerald-950/20' : 'text-amber-500 bg-amber-950/20'
                        }`}>
                          {entry.tradeType}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-white font-bold">{entry.item}</td>
                      <td className="py-3 px-3 text-slate-400 font-sans">{entry.party}</td>
                      <td className="py-3 px-3 text-right text-amber-500 font-bold">${entry.value.toLocaleString()}</td>
                      <td className="py-3 px-3 text-center">
                        <span className="text-[10px] text-slate-400 font-sans">{entry.customsStatus}</span>
                      </td>
                      <td className="py-3 px-2 text-center" onClick={(e) => { e.stopPropagation(); setSelectedLedgerItem(entry); }}>
                        <button className="text-[9px] bg-slate-950 hover:bg-slate-900 text-amber-500 hover:text-amber-400 border border-slate-850 px-2 py-1 text-center">
                          📜 Cert
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Side: Detailed receipt panel */}
          <div className="lg:col-span-4 bg-slate-950 border border-slate-850 p-5 relative overflow-hidden">
            {selectedLedgerItem ? (
              <div className="space-y-4">
                <div className="border-b border-slate-850 pb-3 flex justify-between items-center text-left">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-mono text-amber-500 uppercase font-black tracking-widest leading-none">
                      {getLoc('detailsReceiptTitle')}
                    </p>
                    <p className="text-[8.5px] text-slate-500 font-mono">
                      {getLoc('detailsReceiptSubtitle')}
                    </p>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-400 font-black">{selectedLedgerItem.id}</span>
                </div>

                <div className="space-y-3 font-mono text-[10.5px] text-slate-400 leading-normal text-left">
                  <p className="flex justify-between border-b border-slate-900 pb-1.5">
                    <span className="text-slate-600">Cargo Item Spec:</span>
                    <strong className="text-white">{selectedLedgerItem.item}</strong>
                  </p>
                  <p className="flex justify-between border-b border-slate-900 pb-1.5">
                    <span className="text-slate-600">Quantity Logged:</span>
                    <strong className="text-slate-200">{selectedLedgerItem.quantity.toLocaleString()}</strong>
                  </p>
                  <p className="flex justify-between border-b border-slate-900 pb-1.5">
                    <span className="text-slate-600">{getLoc('letterOfCredit')}:</span>
                    <span className="text-white font-bold text-[9px] bg-slate-900 px-1 border border-slate-850">{selectedLedgerItem.details.lcReference}</span>
                  </p>
                  <p className="flex justify-between border-b border-slate-900 pb-1.5">
                    <span className="text-slate-600">{getLoc('shipmentRoute')}:</span>
                    <strong className="text-slate-200">{selectedLedgerItem.origin} &rarr; {selectedLedgerItem.destination}</strong>
                  </p>
                  
                  <div className="bg-slate-900 p-3 border border-slate-850 space-y-1 mt-4">
                    <p className="text-[8px] text-slate-600 uppercase font-black">Trade Invoicing specifics ($ USD)</p>
                    <p className="flex justify-between text-[10px]">
                      <span>Inland freight charge:</span>
                      <span>${selectedLedgerItem.details.freightCost.toLocaleString()}</span>
                    </p>
                    <p className="flex justify-between text-[10px]">
                      <span>Customs Tariffs / Export Tax:</span>
                      <span>${selectedLedgerItem.details.tariffDuty.toLocaleString()}</span>
                    </p>
                    <p className="flex justify-between text-[10px]">
                      <span>Underwriting marine insurance:</span>
                      <span>${selectedLedgerItem.details.insurance.toLocaleString()}</span>
                    </p>
                    <p className="flex justify-between text-[10px] text-emerald-400 font-semibold">
                      <span>Carbon border adjust offset:</span>
                      <span>+${selectedLedgerItem.details.cbamOffset.toLocaleString()}</span>
                    </p>
                    <div className="border-t border-slate-800 pt-1.5 flex justify-between text-xs font-black text-white uppercase font-bold mt-2">
                      <span>Invoice Total:</span>
                      <span className="text-amber-500">${selectedLedgerItem.value.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Certified Seal Display */}
                  <div className="bg-emerald-950/20 border border-emerald-900 p-3 text-emerald-400 flex items-start gap-2 text-[10px] leading-relaxed font-sans mt-4">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-mono font-black uppercase text-[10px] tracking-wider text-emerald-400 leading-none mb-1">
                        {getLoc('customsApproved')}
                      </p>
                      <p className="text-[9px] text-slate-400">
                        This digital shipment record has been dual-cryptographically signed under standard OECD mining compliance rules. Assays are fully verified.
                      </p>
                    </div>
                  </div>

                  {/* PDF download mock button */}
                  <button
                    onClick={() => {
                      alert(`Downloading PDF Contract & Assays Sheet for ${selectedLedgerItem.id}...`);
                    }}
                    className="w-full mt-4 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white py-2 text-[9px] uppercase tracking-widest font-black flex items-center justify-center gap-1.5"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                    <span>Download Invoice PDF & Assay Certification</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-44 flex flex-col justify-center items-center text-center text-slate-600 border border-dashed border-slate-800 p-6">
                <FileText className="w-8 h-8 text-slate-800 mb-2 animate-bounce&quot;" />
                <p className="text-xs uppercase font-mono font-bold tracking-widest">Select Trade Log Record</p>
                <p className="text-[9px] text-slate-500 mt-1 max-w-[200px]">Click any entry in the sovereign ledger on the left to review its customs clearing specs and Letters of Credit.</p>
              </div>
            )}
            
            {/* Ambient vector detail backdrop */}
            <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
          </div>
        </div>
      </div>

      {/* Compliance Notice */}
      <div className="bg-slate-950 border border-slate-900 p-6 flex flex-col md:flex-row items-center gap-4 text-left font-sans border-l-4 border-l-amber-500">
        <Sparkles className="w-8 h-8 text-amber-500 shrink-0 animate-pulse" />
        <div className="space-y-1 text-xs">
          <p className="font-mono font-black uppercase text-amber-500 tracking-wider">
            Sovereign Smelter & Offtake Integrity Protocols
          </p>
          <p className="text-slate-500 font-light leading-relaxed">
            All outward metallurgical concentrates (Gold, Premium copper anodes, Lithium crystal matrices) cleared on this desk undergo strict independent sampling matching local NI 43-101 standards before boarding active maritime vessels. Sourcing files and customs clearances are routed securely to avoid spot trade fluctuations.
          </p>
        </div>
      </div>
    </div>
  );
}
