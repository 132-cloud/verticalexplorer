// ============================================================
// BLS OCCUPATIONAL EMPLOYMENT & WAGE STATISTICS (OES) API
// Workforce sizing via Bureau of Labor Statistics OEWS data
// ============================================================

// Register for a free API key at https://data.bls.gov/registrationEngine/
// Without a key: 25 series per request, 10 year range, 25 requests/day
// With a key: 50 series per request, 20 year range, 500 requests/day
const BLS_API_KEY = ''; // Add your key here for higher rate limits

// ============================================================
// SOC CODE MAPPINGS FOR WORKFORCE VERTICALS
// Maps concept IDs to SOC occupation codes used in OES series IDs
// Only concepts with occupational workforce segments are included
// ============================================================

const CONCEPT_SOC_CODES = {
  'trucking-banking': {
    label: 'Trucking & Transportation Workers',
    description: 'Heavy truck drivers, light truck drivers, and driver/sales workers',
    occupations: [
      { soc: '533032', name: 'Heavy and Tractor-Trailer Truck Drivers' },
      { soc: '533033', name: 'Light Truck Drivers' },
      { soc: '533030', name: 'Driver/Sales Workers and Truck Drivers (Combined)' }
    ]
  },
  'healthcare-practice-banking': {
    label: 'Healthcare Practitioners',
    description: 'Physicians, dentists, and healthcare diagnosing practitioners',
    occupations: [
      { soc: '291210', name: 'Physicians (Except Pediatric)' },
      { soc: '291020', name: 'Dentists, General and Specialists' },
      { soc: '291000', name: 'Healthcare Diagnosing/Treating Practitioners' }
    ]
  },
  'construction-and-trades-banking': {
    label: 'Construction & Extraction Workers',
    description: 'Construction trades workers including carpenters, electricians, and laborers',
    occupations: [
      { soc: '470000', name: 'Construction and Extraction Occupations (All)' },
      { soc: '472031', name: 'Carpenters' },
      { soc: '472111', name: 'Electricians' },
      { soc: '472152', name: 'Plumbers, Pipefitters, and Steamfitters' },
      { soc: '474000', name: 'Other Construction and Related Workers' }
    ]
  },
  'nurse-and-healthcare-worker-banking': {
    label: 'Nurses & Healthcare Support Workers',
    description: 'Registered nurses, licensed practical nurses, and nursing assistants',
    occupations: [
      { soc: '291141', name: 'Registered Nurses' },
      { soc: '292061', name: 'Licensed Practical and Licensed Vocational Nurses' },
      { soc: '311100', name: 'Nursing Assistants, Orderlies, and Psychiatric Aides' }
    ]
  },
  'landscaper-banking': {
    label: 'Grounds Maintenance Workers',
    description: 'Landscaping, groundskeeping, and tree trimming workers',
    occupations: [
      { soc: '373010', name: 'Grounds Maintenance Workers (Combined)' },
      { soc: '373011', name: 'Landscaping and Groundskeeping Workers' },
      { soc: '373013', name: 'Tree Trimmers and Pruners' }
    ]
  },
  'first-responder-banking': {
    label: 'First Responders & Protective Service',
    description: 'Firefighters, police officers, EMTs, and paramedics',
    occupations: [
      { soc: '332011', name: 'Firefighters' },
      { soc: '333051', name: 'Police and Sheriff\'s Patrol Officers' },
      { soc: '292040', name: 'Emergency Medical Technicians and Paramedics' },
      { soc: '330000', name: 'Protective Service Occupations (All)' }
    ]
  },
  'k-12-education-banking': {
    label: 'K-12 Teachers & Education Workers',
    description: 'Elementary, middle, and secondary school teachers',
    occupations: [
      { soc: '252020', name: 'Elementary and Middle School Teachers' },
      { soc: '252030', name: 'Secondary School Teachers' },
      { soc: '252050', name: 'Special Education Teachers' },
      { soc: '250000', name: 'Educational Instruction and Library Occupations (All)' }
    ]
  },
  'agriculture-banking': {
    label: 'Agricultural Workers',
    description: 'Farmers, farm laborers, and agricultural support workers',
    occupations: [
      { soc: '450000', name: 'Farming, Fishing, and Forestry Occupations (All)' },
      { soc: '452090', name: 'Miscellaneous Agricultural Workers' },
      { soc: '451011', name: 'First-Line Supervisors of Farming Workers' }
    ]
  },
  'professional-services-banking': {
    label: 'Business & Financial Operations',
    description: 'Accountants, consultants, management analysts, and financial specialists',
    occupations: [
      { soc: '130000', name: 'Business and Financial Operations Occupations (All)' },
      { soc: '132011', name: 'Accountants and Auditors' },
      { soc: '131111', name: 'Management Analysts' }
    ]
  },
  'gig-worker-banking': {
    label: 'Gig & Independent Delivery Workers',
    description: 'Taxi drivers, rideshare drivers, and delivery workers',
    occupations: [
      { soc: '533054', name: 'Taxi Drivers' },
      { soc: '533033', name: 'Light Truck Drivers (Delivery)' },
      { soc: '413099', name: 'Sales Workers, All Other' }
    ]
  },
  'tech-contractor-banking': {
    label: 'Computer & Technology Workers',
    description: 'Software developers, IT consultants, and computer specialists',
    occupations: [
      { soc: '150000', name: 'Computer and Mathematical Occupations (All)' },
      { soc: '151252', name: 'Software Developers' },
      { soc: '151211', name: 'Computer Systems Analysts' }
    ]
  },
  'life-sciences-banking': {
    label: 'Life Scientists & Researchers',
    description: 'Biological scientists, medical scientists, and research technicians',
    occupations: [
      { soc: '191000', name: 'Life Scientists (All)' },
      { soc: '191042', name: 'Medical Scientists' },
      { soc: '194000', name: 'Life, Physical, and Social Science Technicians' }
    ]
  },
  'maker-and-artisan-banking': {
    label: 'Production & Craft Workers',
    description: 'Craft artists, woodworkers, textile workers, and small-batch production',
    occupations: [
      { soc: '272012', name: 'Craft Artists' },
      { soc: '519000', name: 'Other Production Occupations' },
      { soc: '516000', name: 'Textile, Apparel, and Furnishings Workers' }
    ]
  }
};

// ============================================================
// OES SERIES ID CONSTRUCTION
// Format: OE + U + areatype(1) + area_code(7) + industry(6) + occupation(6) + datatype(2)
// ============================================================

const BLS_DATATYPES = {
  EMPLOYMENT: '01',        // Employment count
  HOURLY_MEAN: '03',      // Hourly mean wage
  ANNUAL_MEAN: '04',      // Annual mean wage
  HOURLY_MEDIAN: '12',    // Hourly median wage
  ANNUAL_MEDIAN: '13',    // Annual median wage
  HOURLY_10PCT: '07',     // Hourly 10th percentile wage
  HOURLY_90PCT: '11',     // Hourly 90th percentile wage
  ANNUAL_10PCT: '14',     // Annual 10th percentile wage
  ANNUAL_90PCT: '17'      // Annual 90th percentile wage
};

// State FIPS to BLS OES state area code mapping
// BLS uses the format: S + state FIPS padded to 7 chars (e.g., state 06 → 0600000)
function stateFipsToBlsArea(fips) {
  return fips.padEnd(7, '0');
}

/**
 * Build an OES series ID
 * @param {string} socCode - 6-digit SOC code without hyphen (e.g. '533032')
 * @param {string} datatype - Datatype code from BLS_DATATYPES (e.g. '01' for employment)
 * @param {string|null} stateFips - 2-digit state FIPS code, or null/national for national
 * @returns {string} Complete series ID like 'OEUN000000000000053303201'
 */
function buildOesSeriesId(socCode, datatype, stateFips) {
  const seasonal = 'U'; // OES is never seasonally adjusted
  let areaType, areaCode;

  if (!stateFips || stateFips === 'national') {
    areaType = 'N';
    areaCode = '0000000';
  } else {
    areaType = 'S';
    areaCode = stateFipsToBlsArea(stateFips);
  }

  const industry = '000000'; // Cross-industry (all industries)
  return `OE${seasonal}${areaType}${areaCode}${industry}${socCode}${datatype}`;
}

// ============================================================
// API CALLS
// ============================================================

// In-memory cache to reduce API calls (session-level)
const _blsOesCache = {};

/**
 * Fetch OES data for a concept from the BLS API
 * Returns employment counts and wage data for the concept's occupations
 */
async function fetchBlsOesData(conceptId, stateFips) {
  const config = CONCEPT_SOC_CODES[conceptId];
  if (!config) return null;

  const isNational = !stateFips || stateFips === 'national';
  const cacheKey = `${conceptId}__${isNational ? 'national' : stateFips}`;

  // Check cache first
  if (_blsOesCache[cacheKey]) {
    return _blsOesCache[cacheKey];
  }

  // Build series IDs: for each occupation, get employment + annual median wage
  const seriesIds = [];
  for (const occ of config.occupations) {
    seriesIds.push(buildOesSeriesId(occ.soc, BLS_DATATYPES.EMPLOYMENT, stateFips));
    seriesIds.push(buildOesSeriesId(occ.soc, BLS_DATATYPES.ANNUAL_MEDIAN, stateFips));
    seriesIds.push(buildOesSeriesId(occ.soc, BLS_DATATYPES.ANNUAL_MEAN, stateFips));
  }

  try {
    const payload = {
      seriesid: seriesIds,
      annualaverage: true,
      catalog: false,
      calculations: false,
      aspects: false
    };

    // Add registration key if available
    if (BLS_API_KEY) {
      payload.registrationkey = BLS_API_KEY;
    }

    const response = await fetch('https://api.bls.gov/publicAPI/v2/timeseries/data/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const json = await response.json();

    if (json.status !== 'REQUEST_SUCCEEDED') {
      console.warn('BLS API request failed:', json.message);
      return null;
    }

    const result = processBlsOesResults(json.Results, config, isNational, stateFips);
    _blsOesCache[cacheKey] = result;
    return result;
  } catch (err) {
    console.error('BLS OES API error:', err);
    return null;
  }
}

/**
 * Process BLS API results into a structured format
 */
function processBlsOesResults(results, config, isNational, stateFips) {
  const occupationData = [];
  let totalEmployment = 0;
  let weightedWageSum = 0;
  let weightedWageCount = 0;

  if (!results || !results.series) return null;

  // Map series IDs back to occupations
  for (const occ of config.occupations) {
    const empSeriesId = buildOesSeriesId(occ.soc, BLS_DATATYPES.EMPLOYMENT, stateFips);
    const medianSeriesId = buildOesSeriesId(occ.soc, BLS_DATATYPES.ANNUAL_MEDIAN, stateFips);
    const meanSeriesId = buildOesSeriesId(occ.soc, BLS_DATATYPES.ANNUAL_MEAN, stateFips);

    const empSeries = results.series.find(s => s.seriesID === empSeriesId);
    const medianSeries = results.series.find(s => s.seriesID === medianSeriesId);
    const meanSeries = results.series.find(s => s.seriesID === meanSeriesId);

    // Get most recent annual data point (period A01)
    const empValue = getLatestValue(empSeries);
    const medianWage = getLatestValue(medianSeries);
    const meanWage = getLatestValue(meanSeries);

    const employment = empValue ? parseInt(empValue.value) : null;
    const median = medianWage ? parseInt(medianWage.value) : null;
    const mean = meanWage ? parseInt(meanWage.value) : null;

    if (employment && employment > 0) {
      totalEmployment += employment;
      if (median) {
        weightedWageSum += median * employment;
        weightedWageCount += employment;
      }
    }

    occupationData.push({
      soc: occ.soc,
      name: occ.name,
      employment,
      annualMedianWage: median,
      annualMeanWage: mean,
      year: empValue ? empValue.year : null
    });
  }

  const avgMedianWage = weightedWageCount > 0
    ? Math.round(weightedWageSum / weightedWageCount)
    : null;

  // Determine geo label
  let geoName = 'United States';
  if (!isNational && stateFips) {
    const state = US_STATES.find(s => s.fips === stateFips);
    geoName = state ? state.name : `State ${stateFips}`;
  }

  return {
    geoName,
    segmentLabel: config.label,
    description: config.description,
    totalEmployment,
    avgMedianWage,
    occupations: occupationData.filter(o => o.employment !== null),
    dataYear: occupationData.find(o => o.year)?.year || null
  };
}

/**
 * Extract the most recent annual value from a BLS series
 */
function getLatestValue(series) {
  if (!series || !series.data || series.data.length === 0) return null;

  // BLS OES data uses period A01 for annual
  const annualData = series.data
    .filter(d => d.period === 'A01' && d.value && d.value !== '-')
    .sort((a, b) => parseInt(b.year) - parseInt(a.year));

  return annualData.length > 0 ? annualData[0] : null;
}

// ============================================================
// UI RENDERING
// ============================================================

/**
 * Render the BLS OES sidebar card for a concept detail page
 * Follows the same pattern as renderCensusSidebar
 */
function renderBlsOesSidebar(conceptId) {
  if (!CONCEPT_SOC_CODES[conceptId]) return '';

  const selectedGeo = getSelectedGeo();
  return `
    <div class="sidebar-card bls-oes-sidebar-card" id="blsOesSection">
      <h3>Workforce Sizing</h3>
      <p class="census-sidebar-desc">BLS Occupational Employment &amp; Wage Statistics.</p>
      <div class="census-controls-sidebar">
        <select class="census-select-sidebar" id="blsOesGeoSelect" onchange="loadBlsOesData('${conceptId}')">
          <option value="national" ${selectedGeo === 'national' ? 'selected' : ''}>National</option>
          ${US_STATES.map(s => `<option value="${s.fips}" ${selectedGeo === s.fips ? 'selected' : ''}>${s.name}</option>`).join('')}
        </select>
      </div>
      <div id="blsOesResults">
        <div class="census-loading">
          <div class="census-spinner"></div>
          <span>Loading workforce data...</span>
        </div>
      </div>
      <div class="census-source">Source: U.S. Bureau of Labor Statistics, OEWS (<span id="blsOesYear">latest</span>)</div>
    </div>
  `;
}

/**
 * Load and display BLS OES data for a concept
 */
async function loadBlsOesData(conceptId) {
  const select = document.getElementById('blsOesGeoSelect');
  const resultsEl = document.getElementById('blsOesResults');
  if (!select || !resultsEl) return;

  const stateFips = select.value;
  setSelectedGeo(stateFips);

  resultsEl.innerHTML = `
    <div class="census-loading">
      <div class="census-spinner"></div>
      <span>Loading workforce data...</span>
    </div>
  `;

  const data = await fetchBlsOesData(conceptId, stateFips);

  if (!data || data.totalEmployment === 0) {
    resultsEl.innerHTML = `
      <div class="census-empty">
        <p>Workforce data unavailable for this selection. Try a different geography.</p>
      </div>
    `;
    return;
  }

  // Update the year in the source line
  const yearEl = document.getElementById('blsOesYear');
  if (yearEl && data.dataYear) {
    yearEl.textContent = data.dataYear;
  }

  // Build occupation breakdown rows
  const topOccupations = data.occupations
    .sort((a, b) => (b.employment || 0) - (a.employment || 0))
    .slice(0, 4);

  const occRows = topOccupations.map(occ => `
    <div class="bls-occ-row">
      <span class="bls-occ-name">${occ.name}</span>
      <span class="bls-occ-stats">
        ${occ.employment ? formatBlsNumber(occ.employment) + ' workers' : '—'}
        ${occ.annualMedianWage ? ' · $' + formatBlsNumber(occ.annualMedianWage) + '/yr' : ''}
      </span>
    </div>
  `).join('');

  resultsEl.innerHTML = `
    <div class="census-data animate-fadeSlideIn">
      <div class="census-geo-label">${data.geoName} — ${data.segmentLabel}</div>
      <div class="census-metrics census-metrics-sidebar">
        <div class="census-metric">
          <span class="census-metric-value">${formatBlsNumber(data.totalEmployment)}</span>
          <span class="census-metric-label">Total Workers</span>
        </div>
        ${data.avgMedianWage ? `
        <div class="census-metric">
          <span class="census-metric-value">$${formatBlsNumber(data.avgMedianWage)}</span>
          <span class="census-metric-label">Avg Median Wage</span>
        </div>
        ` : ''}
      </div>
      ${occRows ? `
        <div class="bls-occ-breakdown">
          <div class="bls-occ-header">Occupation Breakdown</div>
          ${occRows}
        </div>
      ` : ''}
    </div>
  `;
}

/**
 * Format large numbers with K/M suffix
 */
function formatBlsNumber(num) {
  if (num == null) return '—';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
  return num.toLocaleString();
}
