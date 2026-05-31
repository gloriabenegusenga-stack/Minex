import { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { stonesSoldData } from '../data';
import { StoneSale } from '../types';
import { Gem, ArrowUpDown, Filter, BarChart3, Calculator, Tag, Sparkles, TrendingUp, DollarSign } from 'lucide-react';
import { motion } from 'motion/react';

export default function StonesTracker() {
  const { t } = useLanguage();
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [selectedShape, setSelectedShape] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Interactive Calculator State
  const [calcType, setCalcType] = useState<'Diamond' | 'Gold Nugget' | 'Emerald' | 'Spodumene Spindle'>('Diamond');
  const [calcShape, setCalcShape] = useState<string>('Round Brilliant');
  const [calcSize, setCalcSize] = useState<number>(5.5); // Carats or grams
  const [calcGrade, setCalcGrade] = useState<'Flawless' | 'Premium' | 'Standard'>('Flawless');
  const [calcQty, setCalcQty] = useState<number>(10);
  const [isCalculated, setIsCalculated] = useState<boolean>(false);
  const [calcResult, setCalcResult] = useState<any>(null);

  // Sorting
  const [sortField, setSortField] = useState<'name' | 'quantitySold' | 'unitCost' | 'totalCost'>('totalCost');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Filter lists
  const years = ['All', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26 (Proj)'];
  const shapes = ['All', ...Array.from(new Set(stonesSoldData.map(s => s.shape)))];
  const stoneTypes = ['All', 'Diamond', 'Gold', 'Emerald', 'Copper', 'Lithium', 'Aquamarine'];

  // Handle Filtering
  const filteredStones = stonesSoldData.filter((stone) => {
    const matchesYear = selectedYear === 'All' || stone.year === selectedYear;
    const matchesShape = selectedShape === 'All' || stone.shape === selectedShape;
    const matchesType = selectedType === 'All' || stone.name.toLowerCase().includes(selectedType.toLowerCase());
    
    const matchesSearch = searchTerm === '' || 
      stone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stone.shape.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stone.size.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stone.grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stone.site.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesYear && matchesShape && matchesType && matchesSearch;
  });

  // Handle Sorting
  const sortedStones = [...filteredStones].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];

    if (typeof valA === 'string') {
      valA = valA.toLowerCase();
      valB = (valB as string).toLowerCase();
    }

    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Toggle Sorting column
  const requestSort = (field: 'name' | 'quantitySold' | 'unitCost' | 'totalCost') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Perform interactive calculation
  const handleCalculateEstimates = () => {
    let basePricePerUnit = 0;
    let sizeMultiplier = 1;
    let gradeMultiplier = 1;

    if (calcType === 'Diamond') {
      basePricePerUnit = 8500;
      sizeMultiplier = Math.pow(calcSize / 2.5, 1.8); // exponential diamond math
      gradeMultiplier = calcGrade === 'Flawless' ? 1.5 : calcGrade === 'Premium' ? 1.1 : 0.85;
    } else if (calcType === 'Gold Nugget') {
      basePricePerUnit = 6500; // per 100g chunk
      sizeMultiplier = calcSize / 5; // linear sizing
      gradeMultiplier = calcGrade === 'Flawless' ? 1.25 : calcGrade === 'Premium' ? 1.1 : 0.95;
    } else if (calcType === 'Emerald') {
      basePricePerUnit = 7200;
      sizeMultiplier = Math.pow(calcSize / 3, 1.4);
      gradeMultiplier = calcGrade === 'Flawless' ? 1.4 : calcGrade === 'Premium' ? 1.15 : 0.9;
    } else { // Spodumene Spindle
      basePricePerUnit = 120;
      sizeMultiplier = calcSize / 10;
      gradeMultiplier = calcGrade === 'Flawless' ? 1.3 : calcGrade === 'Premium' ? 1.1 : 0.9;
    }

    const estimatedUnitCost = Math.round(basePricePerUnit * sizeMultiplier * gradeMultiplier);
    const estimatedTotal = estimatedUnitCost * calcQty;

    setCalcResult({
      unitCost: estimatedUnitCost,
      totalCost: estimatedTotal,
      tax: Math.round(estimatedTotal * 0.12),
      grandTotal: Math.round(estimatedTotal * 1.12),
      deliveryDays: calcQty > 500 ? 45 : 14,
      jurisdictionLevel: 'OECD Tier-One Insured'
    });
    setIsCalculated(true);
  };

  // Aggregated Analytics
  const totalQuantitySold = filteredStones.reduce((sum, s) => sum + s.quantitySold, 0);
  const totalRevenue = filteredStones.reduce((sum, s) => sum + s.totalCost, 0);
  const averageUnitCost = filteredStones.length > 0 
    ? Math.round(filteredStones.reduce((sum, s) => sum + s.unitCost, 0) / filteredStones.length)
    : 0;

  // Year groups for the bar visualizers
  const revenueByYear = stonesSoldData.reduce((acc, stone) => {
    acc[stone.year] = (acc[stone.year] || 0) + stone.totalCost;
    return acc;
  }, {} as Record<string, number>);

  const maxYearRev = Math.max(...Object.values(revenueByYear), 1);

  return (
    <section className="py-16 px-4 md:px-6 bg-slate-950 text-left border-b border-slate-800">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Responsive Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-amber-500 uppercase mb-2">
              <Gem className="w-4 h-4 text-amber-500" />
              <span>{t('stonesHeaderBadge') || 'CUSTOM GEM & MINERAL TRACKER'}</span>
            </div>
            <h2 className="text-3xl font-black uppercase text-white tracking-tighter">
              {t('stonesTitle') || 'Reserve Stone registry'} <span className="text-slate-500 font-black">{t('stonesTitlePost') || '& Valuations'}</span>
            </h2>
            <p className="text-slate-400 text-xs md:text-sm font-light max-w-xl mt-1.5 leading-relaxed">
              {t('stonesDesc') || 'Inspect the specific shapes, sizes, and annual sales costs of rare crystals, diamonds, and metallurgy assets processed across our high-performing mines.'}
            </p>
          </div>

          {/* Key Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 bg-slate-900/60 p-4 border border-slate-800 rounded-none">
            <div className="text-left">
              <span className="text-[9px] font-mono tracking-widest text-[#909EAA] block uppercase">
                {t('totalRegistryQuantity') || 'TOTAL PIECES SOLD'}
              </span>
              <span className="text-amber-500 font-mono font-black text-lg">
                {totalQuantitySold.toLocaleString()} units
              </span>
            </div>
            <div className="text-left">
              <span className="text-[9px] font-mono tracking-widest text-[#909EAA] block uppercase">
                {t('totalCapitalReceipts') || 'TOTAL SALES VALUE'}
              </span>
              <span className="text-slate-100 font-mono font-black text-lg">
                ${(totalRevenue / 1000000).toFixed(2)}M
              </span>
            </div>
            <div className="text-left col-span-2 md:col-span-1 border-t border-slate-800 md:border-t-0 pt-2 md:pt-0">
              <span className="text-[9px] font-mono tracking-widest text-[#909EAA] block uppercase">
                {t('averageUnitAssess') || 'AVG UNIT VALUE'}
              </span>
              <span className="text-emerald-400 font-mono font-black text-lg">
                ${averageUnitCost.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Graphic Analytics & Estimator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Block: Fiscal Sales & Solid Volumes Chart */}
          <div className="lg:col-span-7 bg-slate-900/40 border border-slate-800 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono tracking-widest text-slate-400 font-bold uppercase flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-amber-500" />
                {t('annualRevenueStreams') || 'ANNUAL PRECISION VALUE STREAMS ($ USD)'}
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5">
                {t('verifiedAudits') || 'Audited Data'}
              </span>
            </div>

            {/* Custom SVG Data Visualization Bars */}
            <div className="space-y-4 pt-2">
              {Object.keys(revenueByYear).sort().map((y) => {
                const rev = revenueByYear[y];
                const percentage = (rev / maxYearRev) * 100;
                return (
                  <div key={y} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-mono font-bold text-slate-300">{y} {y.includes('Proj') ? `(${t('projected') || 'Proj'})` : ''}</span>
                      <span className="font-mono text-amber-500 font-black">${(rev / 1000000).toFixed(2)}M USD</span>
                    </div>
                    <div className="w-full bg-slate-950 h-3 border border-slate-850 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-amber-600 to-amber-400 h-full transition-all duration-1000"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-[10px] font-mono text-slate-500 leading-relaxed pt-2 border-t border-slate-850 flex items-start gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500/70 flex-shrink-0 mt-0.5" />
              <span>
                {t('reserveSourcingNote') || 'Reserve stone sales represent specialty gemstones and custom native mineral structures recovered during development drift blast operations. Revenues directly offset capital expenditure (CapEx) schedules.'}
              </span>
            </div>
          </div>

          {/* Right Block: Interactive Custom Order Pricing Estimator */}
          <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800 p-6 space-y-4">
            <h3 className="text-xs font-mono tracking-widest text-slate-400 font-bold uppercase flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-emerald-400" />
              {t('bulkEstimatorTitle') || 'Custom Offtake & Cost Estimator'}
            </h3>
            
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              {t('bulkEstimatorDesc') || 'Select custom shape characteristics, target grade, cut, and weight to calculate verified bulk contract prices for secure raw mineral lots.'}
            </p>

            <div className="space-y-3 pt-2">
              {/* Stone Selector */}
              <div>
                <label className="block text-[9px] font-mono text-slate-500 uppercase mb-1">{t('calcStoneType') || 'Select Mineral Class'}</label>
                <select 
                  value={calcType}
                  onChange={(e) => {
                    const val = e.target.value as any;
                    setCalcType(val);
                    if (val === 'Diamond') {
                      setCalcShape('Round Brilliant');
                      setCalcSize(5.5);
                    } else if (val === 'Gold Nugget') {
                      setCalcShape('Rough Nugget');
                      setCalcSize(150);
                    } else if (val === 'Emerald') {
                      setCalcShape('Emerald Cut');
                      setCalcSize(8.0);
                    } else {
                      setCalcShape('Hexagonal Prism');
                      setCalcSize(25.0);
                    }
                    setIsCalculated(false);
                  }}
                  className="w-full bg-slate-950 text-xs text-white p-2 border border-slate-850 rounded-none focus:outline-none focus:border-amber-400"
                >
                  <option value="Diamond">Diamond (Premium Gem)</option>
                  <option value="Gold Nugget">Native Gold Ore Nuggets</option>
                  <option value="Emerald">Rare Emerald (Chrome-Beryl)</option>
                  <option value="Spodumene Spindle">Lithium Spodumene (Spindle)</option>
                </select>
              </div>

              {/* Shape Input */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] font-mono text-slate-500 uppercase mb-1">{t('calcShapeOpt') || 'Target Shape Style'}</label>
                  <select 
                    value={calcShape}
                    onChange={(e) => {
                      setCalcShape(e.target.value);
                      setIsCalculated(false);
                    }}
                    className="w-full bg-slate-950 text-xs text-white p-2 border border-slate-850 rounded-none"
                  >
                    {calcType === 'Diamond' && (
                      <>
                        <option value="Round Brilliant">Round Brilliant</option>
                        <option value="Cushion Cut">Cushion Cut</option>
                        <option value="Pear Shape">Pear Shape</option>
                        <option value="Heart Brilliant">Heart Brilliant</option>
                      </>
                    )}
                    {calcType === 'Gold Nugget' && (
                      <>
                        <option value="Rough Nugget">Rough Native Nugget</option>
                        <option value="Alluvial Granule">Alluvial Grain Pile</option>
                      </>
                    )}
                    {calcType === 'Emerald' && (
                      <>
                        <option value="Emerald Cut">Emerald Cut</option>
                        <option value="Asscher Cut">Asscher Cut</option>
                      </>
                    )}
                    {calcType === 'Spodumene Spindle' && (
                      <>
                        <option value="Hexagonal Prism">Hexagonal Prism</option>
                        <option value="Rough Needle">Rough Needle</option>
                      </>
                    )}
                  </select>
                </div>

                {/* Grade Input */}
                <div>
                  <label className="block text-[9px] font-mono text-slate-500 uppercase mb-1">{t('calcGradeOpt') || 'Grade/Clarity Target'}</label>
                  <select 
                    value={calcGrade}
                    onChange={(e) => {
                      setCalcGrade(e.target.value as any);
                      setIsCalculated(false);
                    }}
                    className="w-full bg-slate-950 text-xs text-white p-2 border border-slate-850 rounded-none"
                  >
                    <option value="Flawless">Premium / Flawless (AAA)</option>
                    <option value="Premium">High Purity / VVS (AA)</option>
                    <option value="Standard">Industrial / Mine Grade</option>
                  </select>
                </div>
              </div>

              {/* Size Slider */}
              <div>
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mb-1">
                  <span>{t('calcSizeOpt') || 'Indicated Stone Size (Per Piece)'}</span>
                  <span className="text-amber-500 font-bold">
                    {calcSize} {calcType === 'Diamond' || calcType === 'Emerald' ? 'Carats' : calcType === 'Gold Nugget' ? 'Grams' : 'mm Length'}
                  </span>
                </div>
                <input 
                  type="range"
                  min={calcType === 'Diamond' || calcType === 'Emerald' ? '0.5' : calcType === 'Gold Nugget' ? '10' : '5'}
                  max={calcType === 'Diamond' || calcType === 'Emerald' ? '25' : calcType === 'Gold Nugget' ? '1000' : '150'}
                  step={calcType === 'Diamond' || calcType === 'Emerald' ? '0.1' : '5'}
                  value={calcSize}
                  onChange={(e) => {
                    setCalcSize(parseFloat(e.target.value));
                    setIsCalculated(false);
                  }}
                  className="w-full accent-amber-500 bg-slate-950 cursor-pointer h-1.5 focus:outline-none"
                />
              </div>

              {/* Quantity Input */}
              <div>
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mb-1">
                  <span>{t('calcQtyOpt') || 'Quantity (Pieces Sold/Ordered)'}</span>
                  <span className="text-emerald-400 font-bold">{calcQty} units</span>
                </div>
                <input 
                  type="range"
                  min="1"
                  max="1000"
                  value={calcQty}
                  onChange={(e) => {
                    setCalcQty(parseInt(e.target.value));
                    setIsCalculated(false);
                  }}
                  className="w-full accent-emerald-500 bg-slate-950 cursor-pointer h-1.5 focus:outline-none"
                />
              </div>

              {/* Action Button */}
              <button
                onClick={handleCalculateEstimates}
                className="w-full cursor-pointer mt-4 py-2 bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-widest hover:bg-amber-400 active:scale-95 transition-all text-center rounded-none"
              >
                {t('calculateReceipt') || 'GENERATE QUOTE STATEMENT'}
              </button>

              {/* Results box */}
              {isCalculated && calcResult && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-950 p-4 border border-emerald-500/30 space-y-2 mt-4 text-xs font-mono border-l-4 border-l-emerald-500"
                >
                  <div className="flex items-center justify-between text-emerald-400 font-bold uppercase tracking-wider text-[10px]">
                    <span>QUOTATION RECORD GENERATED</span>
                    <span>No: MINEX-{Math.floor(Math.random() * 8999) + 1000}</span>
                  </div>
                  <div className="border-b border-slate-900 pb-2 space-y-1 text-slate-300">
                    <p className="flex justify-between">
                      <span>Unit Value estimate:</span>
                      <span className="text-white">${calcResult.unitCost.toLocaleString()} USD</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Standard batch cost:</span>
                      <span className="text-white">${calcResult.totalCost.toLocaleString()} USD</span>
                    </p>
                    <p className="flex justify-between text-[11px] text-slate-400">
                      <span>Jurisdiction Levy (12%):</span>
                      <span>+${calcResult.tax.toLocaleString()} USD</span>
                    </p>
                  </div>
                  <div className="flex justify-between text-base font-black text-amber-500 uppercase font-sans">
                    <span>Est. Cost:</span>
                    <span>${calcResult.grandTotal.toLocaleString()} USD</span>
                  </div>
                  <div className="text-[9px] text-slate-500 space-y-0.5">
                    <p>✓ Compliance Framework: OECD Insured Carrier</p>
                    <p>✓ Estimated Dispatch Time: {calcResult.deliveryDays} business days</p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Filters Bar */}
        <div className="bg-slate-900/60 p-4 border border-slate-800 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-slate-400">
            <Filter className="w-4 h-4 text-amber-500" />
            <span>{t('filterVault') || 'Filter Active Sales Registers'}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative">
              <input 
                type="text"
                placeholder={t('searchStonesPlaceholder') || 'Search name, grade, site...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 p-2 text-xs text-white border border-slate-800 focus:outline-none focus:border-amber-500 rounded-none placeholder:text-slate-600"
              />
            </div>

            {/* Fiscal Year dropdown */}
            <div>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full bg-slate-950 p-2 text-xs text-white border border-slate-800 focus:outline-none rounded-none"
              >
                <option value="All">{t('allYears') || 'All Fiscal Years'}</option>
                <option value="FY22">FY22</option>
                <option value="FY23">FY23</option>
                <option value="FY24">FY24</option>
                <option value="FY25">FY25</option>
                <option value="FY26 (Proj)">FY26 (Proj)</option>
              </select>
            </div>

            {/* Mineral Type dropdown */}
            <div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-slate-950 p-2 text-xs text-white border border-slate-800 focus:outline-none rounded-none"
              >
                <option value="All">{t('allTypes') || 'All Mineral classes'}</option>
                {stoneTypes.filter(st => st !== 'All').map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            {/* Stone Shape dropdown */}
            <div>
              <select
                value={selectedShape}
                onChange={(e) => setSelectedShape(e.target.value)}
                className="w-full bg-slate-950 p-2 text-xs text-white border border-slate-800 focus:outline-none rounded-none"
              >
                <option value="All">{t('allShapes') || 'All Stone Shapes'}</option>
                {shapes.filter(sh => sh !== 'All').map(sh => (
                  <option key={sh} value={sh}>{sh}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Detailed Sales Registry Table */}
        <div className="overflow-x-auto bg-slate-950 border border-slate-800 rounded-none">
          <table className="w-full text-left text-xs md:text-sm font-sans border-collapse">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-500 font-mono text-[10px] uppercase tracking-wider select-none">
                <th onClick={() => requestSort('name')} className="py-4 px-6 font-bold hover:text-white cursor-pointer group">
                  <span className="flex items-center gap-1">
                    {t('colStoneName') || 'Stone / Asset Class'}
                    <SymbolSort active={sortField === 'name'} dir={sortDirection} />
                  </span>
                </th>
                <th className="py-4 px-4 font-bold">{t('colShape') || 'Shape Character'}</th>
                <th className="py-4 px-4 font-bold">{t('colSize') || 'Individual Size'}</th>
                <th onClick={() => requestSort('quantitySold')} className="py-4 px-4 font-bold hover:text-white cursor-pointer group">
                  <span className="flex items-center gap-1">
                    {t('colQtySold') || 'Quantity Sold'}
                    <SymbolSort active={sortField === 'quantitySold'} dir={sortDirection} />
                  </span>
                </th>
                <th onClick={() => requestSort('unitCost')} className="py-4 px-4 font-bold hover:text-white cursor-pointer group">
                  <span className="flex items-center gap-1">
                    {t('colUnitCost') || 'Unit Cost (USD)'}
                    <SymbolSort active={sortField === 'unitCost'} dir={sortDirection} />
                  </span>
                </th>
                <th onClick={() => requestSort('totalCost')} className="py-4 px-4 font-bold hover:text-white cursor-pointer group">
                  <span className="flex items-center gap-1">
                    {t('colTotalCost') || 'Annual Cost Stream'}
                    <SymbolSort active={sortField === 'totalCost'} dir={sortDirection} />
                  </span>
                </th>
                <th className="py-4 px-4 font-bold">{t('colYear') || 'Fiscal Period'}</th>
                <th className="py-4 px-6 font-bold md:table-cell hidden">{t('colSite') || 'Sourced Site'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {sortedStones.length > 0 ? (
                sortedStones.map((stone) => (
                  <tr key={stone.id} className="hover:bg-slate-900/30 transition-colors">
                    {/* Sourced stone type & identification code */}
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-bold text-slate-100">{stone.name}</p>
                        <span className="text-[10px] font-mono text-amber-500/80 tracking-widest block uppercase mt-0.5">
                          {stone.id} • {stone.grade}
                        </span>
                      </div>
                    </td>

                    {/* Shape representation */}
                    <td className="py-4 px-4">
                      <span className="px-2 py-0.5 font-mono text-[10px] bg-slate-900 border border-slate-850 text-slate-300 rounded-none uppercase">
                        {stone.shape}
                      </span>
                    </td>

                    {/* Individual Size details */}
                    <td className="py-4 px-4 font-bold text-slate-300">
                      {stone.size}
                    </td>

                    {/* Quantity sold in standard metric pieces */}
                    <td className="py-4 px-4 font-mono text-slate-300">
                      {stone.quantitySold.toLocaleString()} units
                    </td>

                    {/* Individual price per Unit of Stone */}
                    <td className="py-4 px-4 text-emerald-400 font-mono font-bold">
                      ${stone.unitCost.toLocaleString()}
                    </td>

                    {/* Consolidated annual production cost / total revenue */}
                    <td className="py-4 px-4 text-amber-500 font-mono font-extrabold">
                      ${stone.totalCost.toLocaleString()}
                    </td>

                    {/* Sourced Fiscal Period */}
                    <td className="py-4 px-4 font-mono text-slate-400">
                      {stone.year}
                    </td>

                    {/* Minesite extraction location */}
                    <td className="py-4 px-6 font-mono text-xs text-slate-500 space-y-0.5 md:table-cell hidden">
                      <p>{stone.site}</p>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 font-mono uppercase text-xs">
                    {t('noStonesFound') || 'No records match target filtering queries.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
      </div>
    </section>
  );
}

// Internal inline icon indicator for active sort
function SymbolSort({ active, dir }: { active: boolean; dir: 'asc' | 'desc' }) {
  if (!active) {
    return <ArrowUpDown className="w-3 h-3 text-slate-700 group-hover:text-slate-400 transition-colors" />;
  }
  return <ArrowUpDown className={`w-3 h-3 text-amber-500 ${dir === 'asc' ? 'rotate-180' : ''}`} />;
}
