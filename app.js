// ============================================================
// APPLICATION STATE
// ============================================================

let currentPage = 'home';
let wizardStep = 0;
let wizardSelections = {};

// ============================================================
// NAVIGATION
// ============================================================

function navigateTo(page, data) {
  currentPage = page;
  closeMobileNav();
  window.scrollTo({ top: 0, behavior: 'smooth' });

  const content = document.getElementById('appContent');
  content.style.opacity = '0';
  content.style.transform = 'translateY(10px)';

  setTimeout(() => {
    switch (page) {
      case 'home': renderHome(); break;
      case 'wizard': wizardStep = 0; wizardSelections = {}; renderWizard(); break;
      case 'browse': renderBrowse(); break;
      case 'results': renderResults(); break;
      case 'concept': renderConceptDetail(data); break;
      case 'how-it-works': renderHowItWorks(); break;
      case 'strategy-room': renderStrategyRoom(); break;
      case 'build-your-own': renderBuildYourOwn(); break;
      default: renderHome();
    }
    content.style.opacity = '1';
    content.style.transform = 'translateY(0)';
  }, 200);
}

function toggleMobileNav() {
  document.getElementById('mobileNav').classList.toggle('active');
  document.querySelector('.nav-toggle').classList.toggle('active');
}

function closeMobileNav() {
  document.getElementById('mobileNav').classList.remove('active');
  document.querySelector('.nav-toggle').classList.remove('active');
}

// ============================================================
// HOME PAGE
// ============================================================

function renderHome() {
  const content = document.getElementById('appContent');
  content.innerHTML = `
    <section class="chat-hero">
      <canvas class="chat-hero-canvas" id="shaderCanvas"></canvas>
      <div class="chat-hero-grain"></div>
      <div class="chat-hero-fade"></div>

      <div class="chat-hero-content">
        <h1 class="chat-hero-headline">Explore vertical banking strategies<br>built around your growth goals.</h1>
        <p class="chat-hero-subquestion">What do you want to grow?</p>

        <!-- Prompt Box -->
        <div class="chat-prompt-wrapper">
          <div class="chat-prompt-box" id="chatPromptBox">
            <form class="chat-input-row" onsubmit="handleChatInput(event)">
              <div class="chat-input-container">
                <input
                  type="text"
                  id="chatInput"
                  class="chat-input"
                  autocomplete="off"
                  onfocus="this.parentElement.querySelector('.chat-placeholder').style.display='none'"
                  onblur="if(!this.value) this.parentElement.querySelector('.chat-placeholder').style.display=''"
                />
                <span class="chat-placeholder" id="chatPlaceholder">${CHAT_PLACEHOLDERS[0]}</span>
              </div>
              <button type="submit" class="chat-submit-btn" aria-label="Submit">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                  <path d="M10 16V4M10 4L5 9M10 4L15 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </form>

            <!-- Expanded response area -->
            <div id="chatResponse"></div>
          </div>
        </div>

        <!-- Pill Buttons -->
        <div class="chat-pills" id="chatPills">
          <button class="chat-pill" onclick="handleChatPillClick('deposits')">Grow deposits</button>
          <button class="chat-pill" onclick="handleChatPillClick('fee-income')">Fee income</button>
          <button class="chat-pill" onclick="handleChatPillClick('smb-relationships')">SMB relationships</button>
          <button class="chat-pill" onclick="handleChatPillClick('younger-consumers')">Younger consumers</button>
          <button class="chat-pill" onclick="handleChatPillClick('new-geographies')">New geographies</button>
          <button class="chat-pill" onclick="handleChatPillClick('brand-differentiation')">Differentiation</button>
          <button class="chat-pill chat-pill-cta" onclick="navigateTo('browse')">Browse all concepts</button>
          <button class="chat-pill chat-pill-cta" onclick="navigateTo('build-your-own')">Build your own</button>
        </div>
      </div>
    </section>

    <section class="brand-models">
      <div class="container">
        <h2 class="section-title">Launch concepts your way</h2>
        <p class="section-subtitle">Every concept can be adapted to match your institution's strategic posture and brand architecture.</p>
        <div class="models-grid">
          <div class="model-card">
            <h3>Standalone Brand</h3>
            <p>Launch a new digital brand that serves a vertical market independently, powered by your institution behind the scenes.</p>
          </div>
          <div class="model-card">
            <h3>FI-Endorsed Solution</h3>
            <p>Position your institution as the trusted partner backing a specialized vertical experience with your brand's credibility.</p>
          </div>
          <div class="model-card">
            <h3>Product Line</h3>
            <p>Add vertical-specific products and features under your existing brand to deepen relevance with target segments.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="featured-preview">
      <div class="container">
        <h2 class="section-title">Popular vertical concepts</h2>
        <p class="section-subtitle">Explore some of our most requested growth concepts.</p>
        <div class="preview-grid">
          ${CONCEPTS.slice(0, 3).map(c => renderConceptCard(c)).join('')}
        </div>
        <div class="text-center" style="margin-top: 2rem;">
          <button class="btn btn-secondary" onclick="navigateTo('browse')">Browse All Concepts</button>
        </div>
      </div>
    </section>
  `;

  // Initialize shader after DOM is ready
  requestAnimationFrame(() => {
    const canvas = document.getElementById('shaderCanvas');
    if (canvas) initShaderBackground(canvas);
    initChatHero();
  });
}

// ============================================================
// WIZARD
// ============================================================

function renderWizard() {
  const content = document.getElementById('appContent');
  const step = WIZARD_STEPS[wizardStep];
  const progress = ((wizardStep) / WIZARD_STEPS.length) * 100;

  content.innerHTML = `
    <section class="wizard-page">
      <div class="wizard-container">
        <div class="wizard-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${progress}%"></div>
          </div>
          <div class="progress-steps">
            ${WIZARD_STEPS.map((s, i) => `
              <span class="progress-step ${i < wizardStep ? 'completed' : ''} ${i === wizardStep ? 'active' : ''}">
                ${i < wizardStep ? '✓' : i + 1}
              </span>
            `).join('')}
          </div>
        </div>

        <div class="wizard-content">
          <h1 class="wizard-question">${step.question}</h1>
          <p class="wizard-subtitle">${step.subtitle}</p>

          <div class="wizard-options">
            ${step.options.map(opt => `
              <button class="wizard-option ${wizardSelections[step.id] === opt.id ? 'selected' : ''}" onclick="selectWizardOption('${step.id}', '${opt.id}')">
                <span class="option-content">
                  <span class="option-label">${opt.label}</span>
                  <span class="option-desc">${opt.desc}</span>
                </span>
              </button>
            `).join('')}
          </div>

          <div class="wizard-nav">
            ${wizardStep > 0 ? '<button class="btn btn-ghost" onclick="prevWizardStep()">← Back</button>' : '<div></div>'}
            <button class="btn btn-primary" onclick="nextWizardStep()" ${!wizardSelections[step.id] ? 'disabled' : ''}>
              ${wizardStep === WIZARD_STEPS.length - 1 ? 'See Recommendations' : 'Continue →'}
            </button>
          </div>
        </div>
      </div>
    </section>
  `;
}

function selectWizardOption(stepId, optionId) {
  wizardSelections[stepId] = optionId;
  renderWizard();
}

function nextWizardStep() {
  if (wizardStep < WIZARD_STEPS.length - 1) {
    wizardStep++;
    renderWizard();
  } else {
    navigateTo('results');
  }
}

function prevWizardStep() {
  if (wizardStep > 0) {
    wizardStep--;
    renderWizard();
  }
}

// ============================================================
// RESULTS PAGE
// ============================================================

function renderResults() {
  const growthGoal = wizardSelections['growth-goal'] || 'deposits';
  const recommendedIds = RECOMMENDATION_MAP[growthGoal] || RECOMMENDATION_MAP['deposits'];
  const recommended = recommendedIds.map(id => CONCEPTS.find(c => c.id === id)).filter(Boolean);
  const reason = RECOMMENDATION_REASONS[growthGoal] || RECOMMENDATION_REASONS['deposits'];

  const content = document.getElementById('appContent');
  content.innerHTML = `
    <section class="results-page">
      <div class="container">
        <div class="results-header">
          <h1>Recommended vertical concepts for your growth path</h1>
          <div class="results-why">
            <h3>Why these fit</h3>
            <p>${reason}</p>
          </div>
        </div>

        <div class="results-grid">
          ${recommended.map(c => renderConceptCard(c, true)).join('')}
        </div>

        <div class="results-actions">
          <button class="btn btn-secondary" onclick="navigateTo('wizard')">← Refine My Path</button>
          <button class="btn btn-secondary" onclick="navigateTo('browse')">Browse All Concepts</button>
          <button class="btn btn-primary" onclick="openStrategySession()">Request Strategy Session</button>
        </div>
      </div>
    </section>
  `;
}

// ============================================================
// BROWSE PAGE (Netflix-style)
// ============================================================

function renderBrowse() {
  const content = document.getElementById('appContent');

  const rows = BROWSE_CATEGORIES.map(cat => {
    const filtered = CONCEPTS.filter(cat.filter);
    const items = cat.limit ? filtered.slice(0, cat.limit) : filtered;
    if (items.length === 0) return '';

    return `
      <div class="browse-row">
        <h2 class="row-title">${cat.title}</h2>
        <div class="row-scroll">
          ${items.map(c => renderBrowseTile(c)).join('')}
        </div>
      </div>
    `;
  }).join('');

  content.innerHTML = `
    <section class="browse-page">
      <div class="browse-hero">
        <h1>Explore Vertical Banking Concepts</h1>
        <p>Browse ready-to-launch concepts organized by growth strategy, audience, and market fit.</p>
      </div>
      ${rows}
    </section>
  `;
}

function renderBrowseTile(concept) {
  return `
    <div class="browse-tile" onclick="navigateTo('concept', '${concept.id}')">
      <div class="tile-image" style="background-image: url('${concept.image}')">
        <div class="tile-overlay"></div>
      </div>
      <div class="tile-content">
        <h3 class="tile-name">${concept.name}</h3>
        <p class="tile-desc">${concept.shortDesc}</p>
        <div class="tile-tags">
          ${concept.tags.map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
      </div>
    </div>
  `;
}

// ============================================================
// CONCEPT DETAIL PAGE
// ============================================================

function renderConceptDetail(conceptId) {
  const concept = CONCEPTS.find(c => c.id === conceptId);
  if (!concept) { navigateTo('browse'); return; }

  const related = (concept.relatedConcepts || [])
    .map(id => CONCEPTS.find(c => c.id === id))
    .filter(Boolean);

  const content = document.getElementById('appContent');
  content.innerHTML = `
    <section class="concept-detail">
      <div class="concept-hero" style="background-image: url('${concept.image}')">
        <div class="concept-hero-overlay"></div>
        <div class="concept-hero-content">
          <button class="btn btn-ghost btn-back" onclick="navigateTo('browse')">← Back to Concepts</button>
          <h1>${concept.name}</h1>
          <p class="concept-hero-desc">${concept.shortDesc}</p>
          <div class="concept-hero-tags">
            ${concept.tags.map(t => `<span class="tag tag-light">${t}</span>`).join('')}
          </div>
        </div>
      </div>

      <div class="concept-body container">
        <div class="concept-grid">
          <div class="concept-main">
            <div class="detail-section">
              <h2>Audience Snapshot</h2>
              <p>${concept.audience}</p>
            </div>

            <div class="detail-section">
              <h2>Problem to Solve</h2>
              <p>${concept.problem}</p>
            </div>

            <div class="detail-section">
              <h2>FI Growth Thesis</h2>
              <p>${concept.growthThesis}</p>
            </div>

            <div class="detail-section">
              <h2>Product & Feature Hooks</h2>
              <ul class="feature-list">
                ${concept.features.map(f => `<li>${f}</li>`).join('')}
              </ul>
            </div>

            <div class="detail-section">
              <h2>Go-to-Market Models</h2>
              <ul class="feature-list">
                ${concept.goToMarket.map(g => `<li>${g}</li>`).join('')}
              </ul>
            </div>

            <div class="detail-section">
              <h2>Brand Direction</h2>
              <p>${concept.brandDirection}</p>
            </div>

            ${CONCEPT_NAICS[concept.id] ? renderCensusSelector(concept.id) : ''}
          </div>

          <div class="concept-sidebar">
            <div class="sidebar-card">
              <h3>Quick Facts</h3>
              <div class="sidebar-facts">
                <div class="fact">
                  <span class="fact-label">Complexity</span>
                  <span class="fact-value">${concept.complexity}</span>
                </div>
                <div class="fact">
                  <span class="fact-label">Time to Launch</span>
                  <span class="fact-value">${concept.launchTime}</span>
                </div>
                <div class="fact">
                  <span class="fact-label">Audience</span>
                  <span class="fact-value">${concept.tags[0]}</span>
                </div>
                <div class="fact">
                  <span class="fact-label">Model</span>
                  <span class="fact-value">${concept.tags[2] || concept.tags[1]}</span>
                </div>
              </div>
            </div>

            <div class="sidebar-actions">
              <button class="btn btn-primary btn-full" onclick="addToStrategyRoom()">Add to Strategy Room</button>
              <button class="btn btn-secondary btn-full" onclick="openStrategySession()">Explore with Nymbus</button>
            </div>
          </div>
        </div>

        ${related.length > 0 ? `
          <div class="related-section">
            <h2>Related Concepts</h2>
            <div class="related-grid">
              ${related.map(c => renderConceptCard(c)).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    </section>
  `;

  // Auto-load census data if available for this concept
  if (CONCEPT_NAICS[concept.id]) {
    requestAnimationFrame(() => loadCensusData(concept.id));
  }
}

// ============================================================
// HOW IT WORKS PAGE
// ============================================================

function renderHowItWorks() {
  const content = document.getElementById('appContent');
  content.innerHTML = `
    <section class="how-it-works-page">
      <div class="container">
        <h1>How It Works</h1>
        <p class="page-subtitle">From concept to launch, Nymbus guides your institution through every step of building a vertical banking strategy.</p>

        <div class="steps-grid">
          <div class="step-card">
            <div class="step-number">01</div>
            <h3>Explore Concepts</h3>
            <p>Browse our library of vertical banking concepts or use the guided wizard to find strategies aligned with your growth objectives.</p>
          </div>
          <div class="step-card">
            <div class="step-number">02</div>
            <h3>Build Your Strategy</h3>
            <p>Add concepts to your Strategy Room. Compare options, assess fit, and build a prioritized roadmap with your team.</p>
          </div>
          <div class="step-card">
            <div class="step-number">03</div>
            <h3>Design & Validate</h3>
            <p>Work with Nymbus strategists to refine your chosen concept, validate market fit, and design the product experience.</p>
          </div>
          <div class="step-card">
            <div class="step-number">04</div>
            <h3>Launch & Scale</h3>
            <p>Deploy your vertical banking concept on the Nymbus platform with full technology, compliance, and operational support.</p>
          </div>
        </div>

        <div class="text-center" style="margin-top: 3rem;">
          <button class="btn btn-primary btn-lg" onclick="navigateTo('wizard')">Start Exploring</button>
        </div>
      </div>
    </section>
  `;
}

// ============================================================
// STRATEGY ROOM PAGE
// ============================================================

function renderStrategyRoom() {
  const content = document.getElementById('appContent');
  content.innerHTML = `
    <section class="strategy-room-page">
      <div class="container">
        <h1>Strategy Room</h1>
        <p class="page-subtitle">Your collaborative workspace for evaluating and prioritizing vertical banking concepts.</p>

        <div class="empty-state">
          <h2>No concepts added yet</h2>
          <p>Browse concepts and add them to your Strategy Room to compare options, collaborate with your team, and build your vertical banking roadmap.</p>
          <div class="empty-actions">
            <button class="btn btn-primary" onclick="navigateTo('wizard')">Choose Growth Path</button>
            <button class="btn btn-secondary" onclick="navigateTo('browse')">Browse Concepts</button>
          </div>
        </div>
      </div>
    </section>
  `;
}

// ============================================================
// BUILD YOUR OWN PAGE
// ============================================================

function renderBuildYourOwn() {
  const content = document.getElementById('appContent');
  content.innerHTML = `
    <section class="build-your-own-page">
      <div class="container">
        <div class="byo-header">
          <h1>Build Your Own Vertical</h1>
          <p class="page-subtitle">Don't see exactly what you need? Work directly with Nymbus Labs to design, validate, and launch a custom vertical banking concept built around your institution's unique opportunity.</p>
        </div>

        <div class="byo-grid">
          <div class="byo-card">
            <div class="byo-card-number">01</div>
            <h3>Discovery & Strategy</h3>
            <p>We'll collaborate to identify your target audience, define the market opportunity, and align on a growth thesis that fits your institution's goals.</p>
          </div>
          <div class="byo-card">
            <div class="byo-card-number">02</div>
            <h3>Concept Design</h3>
            <p>Our team builds the brand direction, product hooks, feature set, and go-to-market model — purpose-built around your audience and objectives.</p>
          </div>
          <div class="byo-card">
            <div class="byo-card-number">03</div>
            <h3>Validate & Size</h3>
            <p>Using proprietary research and census data, we quantify the opportunity, validate market fit, and build the business case for internal stakeholders.</p>
          </div>
          <div class="byo-card">
            <div class="byo-card-number">04</div>
            <h3>Launch on Nymbus</h3>
            <p>Deploy on the Nymbus platform with core processing, digital banking, account opening, and managed operations connected from day one.</p>
          </div>
        </div>

        <div class="byo-examples">
          <h2 class="section-title" style="text-align: left; margin-bottom: 1rem;">Custom concepts we've built with partners</h2>
          <p class="section-subtitle" style="text-align: left; margin-bottom: 2rem;">These verticals started as conversations and became differentiated banking experiences.</p>
          <div class="byo-example-grid">
            <div class="byo-example">
              <div class="byo-example-img" style="background-image: url('https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=250&fit=crop')"></div>
              <div class="byo-example-content">
                <h4>Cannabis Banking</h4>
                <p>Custom compliance-first banking for licensed cannabis operators in states with legal frameworks.</p>
              </div>
            </div>
            <div class="byo-example">
              <div class="byo-example-img" style="background-image: url('https://images.unsplash.com/photo-1560472355-536de3962603?w=400&h=250&fit=crop')"></div>
              <div class="byo-example-content">
                <h4>Creator Economy Banking</h4>
                <p>Purpose-built financial tools for content creators managing brand deals, royalties, and multi-platform income.</p>
              </div>
            </div>
            <div class="byo-example">
              <div class="byo-example-img" style="background-image: url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=250&fit=crop')"></div>
              <div class="byo-example-content">
                <h4>Professional Services Banking</h4>
                <p>Specialized banking for law firms, accounting practices, and consulting firms with trust account management.</p>
              </div>
            </div>
          </div>
        </div>

        <div class="byo-cta">
          <div class="byo-cta-card">
            <h2>Ready to build something new?</h2>
            <p>Talk to Nymbus Labs about designing a custom vertical banking concept for your institution.</p>
            <div class="byo-cta-actions">
              <button class="btn btn-primary btn-lg" onclick="openStrategySession()">Talk to Labs</button>
              <button class="btn btn-secondary btn-lg" onclick="navigateTo('browse')">Browse existing concepts</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

// ============================================================
// SHARED COMPONENTS
// ============================================================

function renderConceptCard(concept, showActions = false) {
  return `
    <div class="concept-card" onclick="navigateTo('concept', '${concept.id}')">
      <div class="card-image" style="background-image: url('${concept.image}')">
        <div class="card-image-overlay"></div>
      </div>
      <div class="card-body">
        <h3 class="card-title">${concept.name}</h3>
        <p class="card-desc">${concept.shortDesc}</p>
        <div class="card-tags">
          ${concept.tags.map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
        ${showActions ? `
          <div class="card-actions" onclick="event.stopPropagation()">
            <button class="btn btn-sm btn-primary" onclick="navigateTo('concept', '${concept.id}')">View Concept</button>
            <button class="btn btn-sm btn-secondary" onclick="addToStrategyRoom()">Add to Strategy Room</button>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

// ============================================================
// MODAL & ACTIONS
// ============================================================

function addToStrategyRoom() {
  document.getElementById('strategyModal').classList.add('active');
}

function closeModal() {
  document.getElementById('strategyModal').classList.remove('active');
}

function openStrategySession() {
  document.getElementById('strategyModal').querySelector('h2').textContent = 'Strategy Session Requested';
  document.getElementById('strategyModal').querySelector('p').textContent = 'A Nymbus vertical banking strategist will reach out within one business day to schedule a collaborative session around your selected concepts.';
  document.getElementById('strategyModal').classList.add('active');
}

// ============================================================
// INITIALIZATION
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  navigateTo('home');
});
