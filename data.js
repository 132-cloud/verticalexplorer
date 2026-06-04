// ============================================================
// CONCEPT DATA - Edit this file to add/modify concepts
// ============================================================

const CONCEPTS = [
  {
    id: 'contractor-banking',
    name: 'Contractor Banking',
    shortDesc: 'Purpose-built banking for independent contractors and trades professionals.',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop',
    tags: ['SMB', 'Deposits', 'Endorsed Solution'],
    audience: 'Independent contractors, electricians, plumbers, HVAC techs, and general contractors',
    problem: 'Contractors struggle with irregular income, job-based cash flow, tax management, and separating personal from business finances. Traditional banks don\'t understand their world.',
    growthThesis: 'Capture high-velocity deposit flows from a massive and underserved segment. Contractors cycle through significant capital monthly but lack banking built around project-based income.',
    features: [
      'Job-based account organization',
      'Quarterly tax set-aside automation',
      'Invoice and payment tracking',
      'Equipment financing pre-approval',
      'Material supplier payment tools',
      'Lien waiver and compliance document management'
    ],
    goToMarket: [
      'Partner with trade associations and licensing boards',
      'Integrate with contractor management software (Jobber, ServiceTitan)',
      'Sponsor trade shows and contractor education events',
      'Referral programs through material suppliers'
    ],
    brandDirection: 'Rugged, dependable, straightforward. Think Carhartt meets fintech. Strong wordmarks, earth tones with high-contrast accents.',
    complexity: 'Medium',
    launchTime: '4-6 months',
    relatedConcepts: ['local-smb-banking', 'agricultural-banking']
  },
  {
    id: 'healthcare-worker-banking',
    name: 'Healthcare Worker Banking',
    shortDesc: 'Financial wellness designed for nurses, techs, and healthcare professionals.',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&h=400&fit=crop',
    tags: ['Consumer', 'Affinity', 'Standalone Brand'],
    audience: 'Nurses, medical technicians, therapists, and allied health professionals',
    problem: 'Healthcare workers face student loan burdens, irregular shift-based schedules, and burnout-driven financial stress. They need banking that works around 12-hour shifts and values their service.',
    growthThesis: 'Tap into a 20M+ worker segment with strong employment stability and predictable income growth. High affinity and loyalty potential through purpose-aligned banking.',
    features: [
      'Student loan optimization tools',
      'Shift-pay early access',
      'Wellness spending accounts',
      'License renewal and CE expense tracking',
      'Peer support and financial community',
      'Retirement planning for healthcare careers'
    ],
    goToMarket: [
      'Partner with nursing associations and healthcare unions',
      'Campus recruiting at nursing and allied health programs',
      'Integration with scheduling and payroll platforms (Kronos, ShiftMed)',
      'Content marketing around financial wellness for healthcare'
    ],
    brandDirection: 'Warm, caring, professional. Soft blues and greens with clean typography. Should feel like a trusted colleague, not a corporation.',
    complexity: 'Medium-Low',
    launchTime: '3-5 months',
    relatedConcepts: ['student-athlete-banking', 'nonprofit-banking']
  },
  {
    id: 'nonprofit-banking',
    name: 'Nonprofit Banking',
    shortDesc: 'Banking infrastructure for mission-driven organizations and their teams.',
    image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=400&fit=crop',
    tags: ['SMB', 'Fee Income', 'Product Line'],
    audience: 'Nonprofit organizations, foundations, social enterprises, and their leadership teams',
    problem: 'Nonprofits deal with complex fund accounting, grant compliance, donor management cash flow, and board reporting requirements that standard business banking ignores.',
    growthThesis: 'Generate fee income through specialized treasury and compliance services. Nonprofits represent $2.5T in assets with high switching costs once embedded in their financial operations.',
    features: [
      'Fund-level account segregation',
      'Grant compliance and reporting tools',
      'Donor payment processing and receipting',
      'Board financial reporting dashboards',
      'Endowment management integration',
      'Fiscal sponsorship support'
    ],
    goToMarket: [
      'Partner with nonprofit associations and community foundations',
      'Integrate with nonprofit accounting tools (Blackbaud, QuickBooks Nonprofit)',
      'Sponsor nonprofit leadership conferences',
      'Provide free financial literacy for emerging nonprofits'
    ],
    brandDirection: 'Mission-aligned, trustworthy, transparent. Purpose-driven design with warm neutrals and impact-focused messaging.',
    complexity: 'Medium-High',
    launchTime: '5-7 months',
    relatedConcepts: ['local-smb-banking', 'healthcare-worker-banking']
  },
  {
    id: 'local-smb-banking',
    name: 'Local Small Business Banking',
    shortDesc: 'Community-rooted banking for Main Street businesses and local entrepreneurs.',
    image: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=600&h=400&fit=crop',
    tags: ['SMB', 'Relationship Growth', 'Endorsed Solution'],
    audience: 'Local retail shops, restaurants, service businesses, and first-time entrepreneurs',
    problem: 'Local businesses feel invisible to big banks and overwhelmed by fintech complexity. They need a banking partner that understands Main Street economics and provides hands-on guidance.',
    growthThesis: 'Deepen community relationships and capture primary operating accounts. Local SMBs represent the highest lifetime value segment when served with relevance and care.',
    features: [
      'Simplified business checking with smart insights',
      'POS and payment integration',
      'Local business directory and cross-promotion',
      'Cash flow forecasting for seasonal businesses',
      'Quick-apply business credit lines',
      'Bookkeeping automation and tax prep'
    ],
    goToMarket: [
      'Partner with local chambers of commerce and SBDCs',
      'Integration with Square, Clover, and Toast',
      'Local business spotlights and community storytelling',
      'Referral networks through accountants and business attorneys'
    ],
    brandDirection: 'Neighborly, optimistic, grounded. Local photography, warm colors, community-first language. Should feel like the best local bank, digitized.',
    complexity: 'Low-Medium',
    launchTime: '3-4 months',
    relatedConcepts: ['contractor-banking', 'nonprofit-banking']
  },
  {
    id: 'student-athlete-banking',
    name: 'Student Athlete Banking',
    shortDesc: 'NIL-era financial tools for college athletes building their brand and future.',
    image: 'https://images.unsplash.com/photo-1461896836934-bd45f5db65c1?w=600&h=400&fit=crop',
    tags: ['Younger Consumers', 'Affinity', 'Standalone Brand'],
    audience: 'College athletes (NCAA D1-D3), NIL earners, and young athletes transitioning to professional or post-athletic careers',
    problem: 'Student athletes now earn NIL income but lack financial literacy, tax guidance, and banking tools designed for their unique situation of balancing athletics, academics, and new income streams.',
    growthThesis: 'Capture the next generation of high earners early. Student athletes have outsized influence, brand value, and lifetime earning potential. Early banking relationships compound.',
    features: [
      'NIL income management and tax withholding',
      'Agent and advisor payment tracking',
      'Brand deal financial organization',
      'Financial literacy curriculum',
      'Savings goals tied to athletic milestones',
      'Transition planning for post-college careers'
    ],
    goToMarket: [
      'Partner with NIL collectives and athlete management platforms',
      'Campus ambassador programs',
      'Integration with NIL marketplaces (Opendorse, INFLCR)',
      'Content partnerships with athlete influencers'
    ],
    brandDirection: 'Bold, energetic, aspirational. Dynamic typography, vibrant gradients, athlete-first imagery. Should feel like a premium sports brand, not a bank.',
    complexity: 'Medium',
    launchTime: '4-6 months',
    relatedConcepts: ['healthcare-worker-banking', 'gig-economy-banking']
  },
  {
    id: 'agricultural-banking',
    name: 'Agricultural Banking',
    shortDesc: 'Season-smart banking for farmers, ranchers, and agribusiness operators.',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&h=400&fit=crop',
    tags: ['Commercial', 'Deposits', 'Product Line'],
    audience: 'Row crop farmers, livestock operators, agribusiness owners, and agricultural cooperatives',
    problem: 'Agricultural businesses operate on seasonal cycles with massive cash flow swings, commodity price risk, and complex equipment and land financing needs that standard business banking doesn\'t accommodate.',
    growthThesis: 'Capture large seasonal deposit inflows and generate fee income through specialized ag lending and treasury services. Agriculture represents $1.2T in annual output with deep relationship loyalty.',
    features: [
      'Seasonal cash flow management tools',
      'Commodity price tracking and alerts',
      'Equipment and land financing',
      'Crop insurance integration',
      'USDA program and subsidy tracking',
      'Cooperative member account management'
    ],
    goToMarket: [
      'Partner with Farm Bureau and agricultural cooperatives',
      'Integrate with farm management software (Granular, FarmLogs)',
      'Presence at agricultural trade shows and county fairs',
      'Relationships with ag equipment dealers and input suppliers'
    ],
    brandDirection: 'Steadfast, practical, rooted. Landscape photography, deep greens and golds, serif accents. Should feel like a trusted ag lender with modern tools.',
    complexity: 'High',
    launchTime: '6-9 months',
    relatedConcepts: ['contractor-banking', 'local-smb-banking']
  },
  {
    id: 'gig-economy-banking',
    name: 'Gig Economy Banking',
    shortDesc: 'Flexible banking for freelancers, creators, and platform workers.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop',
    tags: ['Consumer', 'Deposits', 'Standalone Brand'],
    audience: 'Rideshare drivers, delivery workers, freelance designers, content creators, and multi-platform gig workers',
    problem: 'Gig workers juggle multiple income streams, lack traditional employment benefits, struggle with tax planning, and need banking that adapts to variable income patterns.',
    growthThesis: 'The gig economy is 60M+ workers and growing. Capturing their fragmented deposit flows and providing structure creates deep engagement and cross-sell opportunity.',
    features: [
      'Multi-platform income aggregation',
      'Automatic tax set-asides by platform',
      'Expense categorization by gig type',
      'Benefits marketplace (health, retirement)',
      'Income smoothing and advance features',
      'Mileage and deduction tracking'
    ],
    goToMarket: [
      'Integration with gig platforms (Uber, DoorDash, Fiverr)',
      'Referral programs through freelancer communities',
      'Content marketing around freelance financial wellness',
      'Partnerships with coworking spaces and creator hubs'
    ],
    brandDirection: 'Modern, fluid, empowering. Gradient-rich, dynamic layouts, diverse imagery. Should feel like the financial OS for independent workers.',
    complexity: 'Medium',
    launchTime: '4-5 months',
    relatedConcepts: ['student-athlete-banking', 'contractor-banking']
  },
  {
    id: 'military-family-banking',
    name: 'Military Family Banking',
    shortDesc: 'Banking that moves with military families through every station and deployment.',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop',
    tags: ['Consumer', 'Affinity', 'Endorsed Solution'],
    audience: 'Active duty service members, military spouses, veterans transitioning to civilian life, and military families',
    problem: 'Military families face frequent relocations, deployment-related financial disruptions, spouse employment challenges, and difficulty maintaining consistent banking relationships across moves.',
    growthThesis: 'Military families represent 2M+ households with stable government income, high loyalty, and strong referral networks. Lifetime value increases dramatically when banking travels with them.',
    features: [
      'Seamless multi-state banking with no disruption',
      'Deployment financial automation',
      'Military spouse career and income tools',
      'VA benefit optimization',
      'PCS move financial planning',
      'Military discount and benefit aggregation'
    ],
    goToMarket: [
      'Partnerships with military family support organizations',
      'On-base financial wellness programs',
      'Integration with military pay systems (DFAS)',
      'Veteran transition career and finance programs'
    ],
    brandDirection: 'Honorable, steadfast, family-focused. Navy and gold palette, strong typography, family imagery. Should feel like a service to those who serve.',
    complexity: 'Medium',
    launchTime: '5-6 months',
    relatedConcepts: ['healthcare-worker-banking', 'local-smb-banking']
  },
  {
    id: 'creative-professional-banking',
    name: 'Creative Professional Banking',
    shortDesc: 'Financial tools for designers, artists, musicians, and creative entrepreneurs.',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&h=400&fit=crop',
    tags: ['Consumer', 'Fee Income', 'Standalone Brand'],
    audience: 'Graphic designers, musicians, visual artists, photographers, filmmakers, and creative agency owners',
    problem: 'Creatives deal with irregular project-based income, complex royalty and licensing payments, and need financial tools that understand the economics of creative work.',
    growthThesis: 'The creative economy is $2.25T globally. Creatives are highly engaged, socially influential, and generate significant transaction volume through project payments and tool subscriptions.',
    features: [
      'Project-based income tracking',
      'Royalty and licensing payment management',
      'Client invoicing and payment collection',
      'Equipment and software expense management',
      'Portfolio financing for creative projects',
      'Tax deduction optimization for creatives'
    ],
    goToMarket: [
      'Partnerships with creative platforms (Behance, Dribbble, Spotify for Artists)',
      'Integration with creative tools (Adobe, Figma)',
      'Sponsorship of creative festivals and conferences',
      'Creator community ambassadors'
    ],
    brandDirection: 'Expressive, bold, minimal. High contrast, creative typography, gallery-quality imagery. Should feel like a design tool, not a bank.',
    complexity: 'Medium',
    launchTime: '4-6 months',
    relatedConcepts: ['gig-economy-banking', 'student-athlete-banking']
  }
];

// ============================================================
// WIZARD STEPS DATA
// ============================================================

const WIZARD_STEPS = [
  {
    id: 'growth-goal',
    question: 'What are you trying to grow?',
    subtitle: 'Select the primary growth objective for your institution.',
    options: [
      { id: 'deposits', label: 'Deposits', desc: 'Grow core deposits and reduce funding costs' },
      { id: 'fee-income', label: 'Fee Income', desc: 'Generate new non-interest revenue streams' },
      { id: 'smb-relationships', label: 'SMB Relationships', desc: 'Deepen small business engagement' },
      { id: 'new-geographies', label: 'New Geographies', desc: 'Expand into new markets digitally' },
      { id: 'younger-consumers', label: 'Younger Consumers', desc: 'Attract Gen Z and millennial customers' },
      { id: 'brand-differentiation', label: 'Brand Differentiation', desc: 'Stand out in a crowded market' }
    ]
  },
  {
    id: 'audience',
    question: 'Who are you trying to serve?',
    subtitle: 'Define the primary audience for your vertical banking concept.',
    options: [
      { id: 'consumers', label: 'Consumers', desc: 'Individual retail banking customers' },
      { id: 'small-businesses', label: 'Small Businesses', desc: 'Local and emerging business owners' },
      { id: 'commercial-verticals', label: 'Commercial Verticals', desc: 'Industry-specific commercial clients' },
      { id: 'affinity-communities', label: 'Affinity Communities', desc: 'Shared-interest or identity groups' },
      { id: 'existing-customers', label: 'Existing Customers', desc: 'Deepen relationships with current base' }
    ]
  },
  {
    id: 'go-to-market',
    question: 'How do you want to go to market?',
    subtitle: 'Choose the brand and launch model that fits your institution.',
    options: [
      { id: 'standalone-brand', label: 'Standalone Digital Brand', desc: 'A new brand identity, separate from your FI' },
      { id: 'endorsed-solution', label: 'FI-Endorsed Vertical Solution', desc: 'Your brand backing a specialized vertical' },
      { id: 'product-line', label: 'Product Line Under Existing Brand', desc: 'New products within your current brand' },
      { id: 'not-sure', label: 'Not Sure Yet', desc: 'Help me figure out the right model' }
    ]
  },
  {
    id: 'launch-posture',
    question: 'What is your launch posture?',
    subtitle: 'How do you want to approach the market entry?',
    options: [
      { id: 'test-learn', label: 'Test and Learn', desc: 'Start small, validate, then scale' },
      { id: 'fast-launch', label: 'Fast Launch', desc: 'Get to market quickly with an MVP' },
      { id: 'strategic-expansion', label: 'Strategic Expansion', desc: 'Methodical rollout with full planning' },
      { id: 'fully-differentiated', label: 'Fully Differentiated Brand', desc: 'Build a complete, standalone experience' }
    ]
  }
];

// ============================================================
// RECOMMENDATION LOGIC (mocked)
// ============================================================

const RECOMMENDATION_MAP = {
  'deposits': ['contractor-banking', 'agricultural-banking', 'gig-economy-banking'],
  'fee-income': ['nonprofit-banking', 'creative-professional-banking', 'agricultural-banking'],
  'smb-relationships': ['local-smb-banking', 'contractor-banking', 'nonprofit-banking'],
  'new-geographies': ['gig-economy-banking', 'healthcare-worker-banking', 'military-family-banking'],
  'younger-consumers': ['student-athlete-banking', 'gig-economy-banking', 'creative-professional-banking'],
  'brand-differentiation': ['student-athlete-banking', 'creative-professional-banking', 'healthcare-worker-banking']
};

const RECOMMENDATION_REASONS = {
  'deposits': 'These concepts are optimized for deposit growth through high-velocity transaction accounts and recurring income capture from underserved segments.',
  'fee-income': 'These concepts generate fee income through specialized services, treasury management, and value-added tools that justify premium pricing.',
  'smb-relationships': 'These concepts deepen SMB relationships by solving real operational pain points that create daily engagement and switching costs.',
  'new-geographies': 'These concepts work digitally across geographies, allowing you to serve niche audiences regardless of physical branch footprint.',
  'younger-consumers': 'These concepts resonate with younger demographics through modern brand identity, lifestyle alignment, and digital-first experiences.',
  'brand-differentiation': 'These concepts create strong market differentiation through bold brand positioning and unique audience alignment.'
};

// ============================================================
// BROWSE CATEGORIES
// ============================================================

const BROWSE_CATEGORIES = [
  { title: 'Featured Concepts', filter: () => true, limit: 9 },
  { title: 'Deposit Growth Plays', filter: (c) => c.tags.some(t => t.toLowerCase().includes('deposit')) },
  { title: 'SMB Growth Concepts', filter: (c) => c.tags.some(t => t.toLowerCase().includes('smb')) },
  { title: 'Consumer Affinity Concepts', filter: (c) => c.tags.some(t => t.toLowerCase().includes('consumer') || t.toLowerCase().includes('affinity')) },
  { title: 'Fastest to Launch', filter: (c) => parseInt(c.launchTime) <= 4 },
  { title: 'Best for Existing Customers', filter: (c) => c.tags.some(t => t.toLowerCase().includes('endorsed') || t.toLowerCase().includes('product line')) },
  { title: 'Best for New Market Expansion', filter: (c) => c.tags.some(t => t.toLowerCase().includes('standalone')) }
];
