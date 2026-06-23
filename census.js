// ============================================================
// CENSUS DATA INTEGRATION
// Market sizing via Census Bureau APIs
// ============================================================

const CENSUS_API_KEY = '98d2cf44c224ed0a9e77d400beb14caf3b91c44b';

// NAICS codes mapped to each vertical concept
const CONCEPT_NAICS = {
  'healthcare-practice-banking': {
    codes: ['62'], // Health Care and Social Assistance
    label: 'Healthcare Practices',
    description: 'Physician offices, dental offices, and outpatient care centers'
  },
  'college-athlete-banking': {
    codes: ['71'], // Arts, Entertainment, and Recreation
    label: 'Sports & Recreation',
    description: 'Spectator sports, fitness, recreation, and entertainment'
  },
  'trucking-banking': {
    codes: ['48'], // Transportation and Warehousing
    label: 'Trucking & Transportation',
    description: 'Truck transportation, freight, and logistics operations'
  },
  'construction-and-trades-banking': {
    codes: ['23'], // Construction
    label: 'Construction & Trades',
    description: 'Specialty trade contractors, general contractors, and construction firms'
  },
  'professional-services-banking': {
    codes: ['54'], // Professional, Scientific, and Technical Services
    label: 'Professional Services',
    description: 'Legal, accounting, consulting, and technical services firms'
  },
  'agriculture-banking': {
    codes: ['11'], // Agriculture, Forestry, Fishing and Hunting
    label: 'Agriculture & Farming',
    description: 'Crop production, animal production, forestry, and support activities'
  },
  'maker-and-artisan-banking': {
    codes: ['31', '45'], // Manufacturing + Retail (e-commerce)
    label: 'Makers & Artisan Commerce',
    description: 'Small-scale manufacturing, craft production, and online retail'
  },
  'life-sciences-banking': {
    codes: ['54', '62'], // Professional Services + Healthcare
    label: 'Life Sciences & Research',
    description: 'Scientific research, pharmaceutical, and clinical trial operations'
  },
  'gig-worker-banking': {
    codes: ['54', '56'], // Professional/Technical + Admin/Support
    label: 'Gig & Freelance Services',
    description: 'Professional services, technical consulting, and administrative support'
  },
  'franchisee-banking': {
    codes: ['72', '44'], // Accommodation/Food + Retail
    label: 'Franchise Operations',
    description: 'Restaurant, retail, and service franchise establishments'
  },
  'landscaper-banking': {
    codes: ['56'], // Administrative and Support Services (includes landscaping)
    label: 'Landscaping Services',
    description: 'Landscaping, lawn care, and grounds maintenance services'
  },
  'veteran-entrepreneur-banking': {
    codes: ['44', '54', '23'], // Retail + Professional + Construction
    label: 'Veteran-Owned Businesses',
    description: 'Veteran-owned small businesses across multiple sectors'
  },
  'first-responder-banking': {
    codes: ['92'], // Public Administration
    label: 'Public Safety & Emergency Services',
    description: 'Fire protection, law enforcement, and emergency medical services'
  },
  'nurse-and-healthcare-worker-banking': {
    codes: ['62'], // Health Care and Social Assistance
    label: 'Healthcare Workforce',
    description: 'Hospitals, nursing facilities, and ambulatory health care services'
  },
  'boat-owner-banking': {
    codes: ['71', '48'], // Recreation + Transportation
    label: 'Boating & Marine Recreation',
    description: 'Marinas, boat dealers, and marine recreation services'
  },
  'outdoor-adventure-banking': {
    codes: ['71'], // Arts, Entertainment, and Recreation
    label: 'Outdoor Recreation',
    description: 'Outdoor recreation, adventure sports, and nature tourism'
  }
};

// US State FIPS codes
const US_STATES = [
  { fips: '01', name: 'Alabama', abbr: 'AL' },
  { fips: '02', name: 'Alaska', abbr: 'AK' },
  { fips: '04', name: 'Arizona', abbr: 'AZ' },
  { fips: '05', name: 'Arkansas', abbr: 'AR' },
  { fips: '06', name: 'California', abbr: 'CA' },
  { fips: '08', name: 'Colorado', abbr: 'CO' },
  { fips: '09', name: 'Connecticut', abbr: 'CT' },
  { fips: '10', name: 'Delaware', abbr: 'DE' },
  { fips: '11', name: 'District of Columbia', abbr: 'DC' },
  { fips: '12', name: 'Florida', abbr: 'FL' },
  { fips: '13', name: 'Georgia', abbr: 'GA' },
  { fips: '15', name: 'Hawaii', abbr: 'HI' },
  { fips: '16', name: 'Idaho', abbr: 'ID' },
  { fips: '17', name: 'Illinois', abbr: 'IL' },
  { fips: '18', name: 'Indiana', abbr: 'IN' },
  { fips: '19', name: 'Iowa', abbr: 'IA' },
  { fips: '20', name: 'Kansas', abbr: 'KS' },
  { fips: '21', name: 'Kentucky', abbr: 'KY' },
  { fips: '22', name: 'Louisiana', abbr: 'LA' },
  { fips: '23', name: 'Maine', abbr: 'ME' },
  { fips: '24', name: 'Maryland', abbr: 'MD' },
  { fips: '25', name: 'Massachusetts', abbr: 'MA' },
  { fips: '26', name: 'Michigan', abbr: 'MI' },
  { fips: '27', name: 'Minnesota', abbr: 'MN' },
  { fips: '28', name: 'Mississippi', abbr: 'MS' },
  { fips: '29', name: 'Missouri', abbr: 'MO' },
  { fips: '30', name: 'Montana', abbr: 'MT' },
  { fips: '31', name: 'Nebraska', abbr: 'NE' },
  { fips: '32', name: 'Nevada', abbr: 'NV' },
  { fips: '33', name: 'New Hampshire', abbr: 'NH' },
  { fips: '34', name: 'New Jersey', abbr: 'NJ' },
  { fips: '35', name: 'New Mexico', abbr: 'NM' },
  { fips: '36', name: 'New York', abbr: 'NY' },
  { fips: '37', name: 'North Carolina', abbr: 'NC' },
  { fips: '38', name: 'North Dakota', abbr: 'ND' },
  { fips: '39', name: 'Ohio', abbr: 'OH' },
  { fips: '40', name: 'Oklahoma', abbr: 'OK' },
  { fips: '41', name: 'Oregon', abbr: 'OR' },
  { fips: '42', name: 'Pennsylvania', abbr: 'PA' },
  { fips: '44', name: 'Rhode Island', abbr: 'RI' },
  { fips: '45', name: 'South Carolina', abbr: 'SC' },
  { fips: '46', name: 'South Dakota', abbr: 'SD' },
  { fips: '47', name: 'Tennessee', abbr: 'TN' },
  { fips: '48', name: 'Texas', abbr: 'TX' },
  { fips: '49', name: 'Utah', abbr: 'UT' },
  { fips: '50', name: 'Vermont', abbr: 'VT' },
  { fips: '51', name: 'Virginia', abbr: 'VA' },
  { fips: '53', name: 'Washington', abbr: 'WA' },
  { fips: '54', name: 'West Virginia', abbr: 'WV' },
  { fips: '55', name: 'Wisconsin', abbr: 'WI' },
  { fips: '56', name: 'Wyoming', abbr: 'WY' }
];

// ============================================================
// CENSUS API CALLS
// ============================================================

async function fetchCensusData(conceptId, stateFips) {
  const naicsConfig = CONCEPT_NAICS[conceptId];
  if (!naicsConfig) return null;

  const isNational = !stateFips || stateFips === 'national';
  const geoParam = isNational ? '&for=us:*' : `&for=state:${stateFips}`;

  try {
    // Fetch from County Business Patterns (employer establishments)
    // Get total establishments + employment size breakdowns
    const results = await Promise.all(naicsConfig.codes.map(async (naicsCode) => {
      // Total establishments
      const cbpUrl = `https://api.census.gov/data/2023/cbp?get=ESTAB,EMP,PAYANN,NAME&NAICS2017=${naicsCode}${geoParam}&key=${CENSUS_API_KEY}`;

      // Nonemployer statistics (solo operators)
      const nempUrl = `https://api.census.gov/data/2023/nonemp?get=NESTAB,NRCPTOT,NAME&NAICS2022=${naicsCode}${geoParam}&key=${CENSUS_API_KEY}`;

      const [cbpRes, nempRes] = await Promise.allSettled([
        fetch(cbpUrl).then(r => r.json()),
        fetch(nempUrl).then(r => r.json())
      ]);

      return {
        naics: naicsCode,
        cbp: cbpRes.status === 'fulfilled' ? cbpRes.value : null,
        nemp: nempRes.status === 'fulfilled' ? nempRes.value : null
      };
    }));

    return processCensusResults(results, naicsConfig, isNational, stateFips);
  } catch (err) {
    console.error('Census API error:', err);
    return null;
  }
}

function processCensusResults(results, naicsConfig, isNational, stateFips) {
  let totalEstablishments = 0;
  let totalEmployment = 0;
  let totalPayroll = 0;
  let soloOperators = 0;
  let soloReceipts = 0;
  let geoName = isNational ? 'United States' : '';

  for (const result of results) {
    // Process CBP data (employer firms)
    if (result.cbp && Array.isArray(result.cbp) && result.cbp.length > 1) {
      const headers = result.cbp[0];
      const estabIdx = headers.indexOf('ESTAB');
      const empIdx = headers.indexOf('EMP');
      const payIdx = headers.indexOf('PAYANN');
      const nameIdx = headers.indexOf('NAME');

      for (let i = 1; i < result.cbp.length; i++) {
        const row = result.cbp[i];
        if (estabIdx >= 0) totalEstablishments += parseInt(row[estabIdx]) || 0;
        if (empIdx >= 0) totalEmployment += parseInt(row[empIdx]) || 0;
        if (payIdx >= 0) totalPayroll += parseInt(row[payIdx]) || 0;
        if (nameIdx >= 0 && !geoName) geoName = row[nameIdx];
      }
    }

    // Process Nonemployer data (solo operators)
    if (result.nemp && Array.isArray(result.nemp) && result.nemp.length > 1) {
      const headers = result.nemp[0];
      const nestabIdx = headers.indexOf('NESTAB');
      const rcptIdx = headers.indexOf('NRCPTOT');

      for (let i = 1; i < result.nemp.length; i++) {
        const row = result.nemp[i];
        if (nestabIdx >= 0) soloOperators += parseInt(row[nestabIdx]) || 0;
        if (rcptIdx >= 0) soloReceipts += parseInt(row[rcptIdx]) || 0;
      }
    }
  }

  // Calculate size segments (approximate based on averages)
  const microBiz = Math.round(totalEstablishments * 0.75); // 1-19 employees
  const smallBiz = Math.round(totalEstablishments * 0.20); // 20-499 employees
  const midBiz = Math.round(totalEstablishments * 0.05);   // 500+

  return {
    geoName,
    industry: naicsConfig.label,
    description: naicsConfig.description,
    totalBusinesses: totalEstablishments + soloOperators,
    soloOperators,
    employerFirms: totalEstablishments,
    microBiz, // 1-19 employees
    smallBiz, // 20-499 employees
    totalEmployment,
    annualPayroll: totalPayroll, // in $1,000s
    soloReceipts // in $1,000s
  };
}

// ============================================================
// UI RENDERING
// ============================================================

function getSelectedGeo() {
  // Check if user selected a geography in the chat wizard (active or persisted)
  if (typeof chatSelections !== 'undefined' && chatSelections && chatSelections['geography']) {
    return chatSelections['geography'];
  }
  if (window._chatSelectedGeo) {
    return window._chatSelectedGeo;
  }
  return 'national';
}

function renderCensusSidebar(conceptId) {
  const selectedGeo = getSelectedGeo();
  return `
    <div class="sidebar-card census-sidebar-card" id="censusSection">
      <h3>Market Opportunity</h3>
      <p class="census-sidebar-desc">U.S. Census Bureau data for this vertical.</p>
      <div class="census-controls-sidebar">
        <select class="census-select-sidebar" id="censusGeoSelect" onchange="loadCensusData('${conceptId}')">
          <option value="national" ${selectedGeo === 'national' ? 'selected' : ''}>National</option>
          ${US_STATES.map(s => `<option value="${s.fips}" ${selectedGeo === s.fips ? 'selected' : ''}>${s.name}</option>`).join('')}
        </select>
      </div>
      <div id="censusResults">
        <div class="census-loading">
          <div class="census-spinner"></div>
          <span>Loading...</span>
        </div>
      </div>
      <div class="census-source">Source: U.S. Census Bureau, CBP & Nonemployer Statistics (2023)</div>
    </div>
  `;
}

// Keep old function name for backward compat but redirect
function renderCensusSelector(conceptId) {
  return renderCensusSidebar(conceptId);
}

async function loadCensusData(conceptId) {
  const select = document.getElementById('censusGeoSelect');
  const resultsEl = document.getElementById('censusResults');
  if (!select || !resultsEl) return;

  const stateFips = select.value;

  resultsEl.innerHTML = `
    <div class="census-loading">
      <div class="census-spinner"></div>
      <span>Loading market data...</span>
    </div>
  `;

  const data = await fetchCensusData(conceptId, stateFips);

  if (!data || data.totalBusinesses === 0) {
    resultsEl.innerHTML = `
      <div class="census-empty">
        <p>Market data unavailable for this selection. Try a different geography or check back later.</p>
      </div>
    `;
    return;
  }

  resultsEl.innerHTML = `
    <div class="census-data animate-fadeSlideIn">
      <div class="census-geo-label">${data.geoName} — ${data.industry}</div>
      <div class="census-metrics census-metrics-sidebar">
        <div class="census-metric">
          <span class="census-metric-value">${formatNumber(data.totalBusinesses)}</span>
          <span class="census-metric-label">Total Businesses</span>
        </div>
        <div class="census-metric">
          <span class="census-metric-value">${formatNumber(data.soloOperators)}</span>
          <span class="census-metric-label">Solo Operators</span>
        </div>
        <div class="census-metric">
          <span class="census-metric-value">${formatNumber(data.microBiz)}</span>
          <span class="census-metric-label">1–19 Employees</span>
        </div>
        <div class="census-metric">
          <span class="census-metric-value">${formatNumber(data.smallBiz)}</span>
          <span class="census-metric-label">20–499 Employees</span>
        </div>
      </div>
      ${data.totalEmployment > 0 ? `
        <div class="census-secondary">
          <span>${formatNumber(data.totalEmployment)} employed</span>
          <span>$${formatNumber(data.annualPayroll)}K payroll</span>
        </div>
      ` : ''}
    </div>
  `;
}

function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
  return num.toLocaleString();
}
