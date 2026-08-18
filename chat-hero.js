// ============================================================
// CHAT HERO INTERFACE - Guided Growth Path Flow
// A conversational chat-style wizard for discovering vertical concepts
// ============================================================

const CHAT_STEPS = [
  {
    id: 'growth-goal',
    question: 'What are you trying to grow?',
    subtitle: 'Select one or more objectives.',
    multiSelect: true,
    pills: [
      { id: 'deposits', label: 'Deposits' },
      { id: 'fee-income', label: 'Fee income' },
      { id: 'smb-relationships', label: 'SMB relationships' },
      { id: 'new-geographies', label: 'New geographies' },
      { id: 'younger-consumers', label: 'Younger consumers' },
      { id: 'brand-differentiation', label: 'Brand differentiation' }
    ]
  },
  {
    id: 'audience',
    question: 'Who are you trying to serve?',
    multiSelect: true,
    subtitle: 'Select one or more audiences.',
    pills: [
      { id: 'consumers', label: 'Consumers' },
      { id: 'small-businesses', label: 'Small businesses' },
      { id: 'commercial-verticals', label: 'Commercial verticals' },
      { id: 'affinity-communities', label: 'Affinity communities' },
      { id: 'existing-customers', label: 'Existing customers' }
    ]
  },
  {
    id: 'go-to-market',
    question: 'How do you want to go to market?',
    multiSelect: false,
    pills: [
      { id: 'standalone-brand', label: 'Standalone digital brand' },
      { id: 'endorsed-solution', label: 'FI-endorsed vertical solution' },
      { id: 'product-line', label: 'Product line under existing brand' },
      { id: 'not-sure', label: 'Not sure yet' }
    ]
  },
  {
    id: 'launch-posture',
    question: 'What is your launch posture?',
    multiSelect: false,
    pills: [
      { id: 'test-learn', label: 'Test and learn' },
      { id: 'fast-launch', label: 'Fast launch' },
      { id: 'strategic-expansion', label: 'Strategic expansion' },
      { id: 'fully-differentiated', label: 'Fully differentiated brand' }
    ]
  },
  {
    id: 'geography',
    question: 'Where do you want to grow?',
    subtitle: 'Select a market for opportunity sizing.',
    multiSelect: false,
    isGeoStep: true,
    pills: []
  }
];

const CHAT_PLACEHOLDERS = [
  "Grow deposits",
  "Reach younger consumers",
  "What do you want to grow?",
  "Launch a standalone brand",
  "Serve small businesses",
  "What do you want to grow?",
  "Expand into new geographies",
  "Differentiate my brand",
  "What do you want to grow?"
];

// Chat state
let chatStep = -1;
let chatSelections = {};
let chatExpanded = false;
let chatClosing = false;
let placeholderIndex = 0;
let placeholderTimer = null;
let geoFilterText = '';

// ============================================================
// INITIALIZATION
// ============================================================

function initChatHero() {
  startPlaceholderRotation();
  setupClickOutside();
}

// ============================================================
// WEBGL SHADER BACKGROUND
// ============================================================

function initShaderBackground(canvas) {
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  const TWO_PI = Math.PI * 2;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  // DotField config
  const dotRadius = 2;
  const dotSpacing = 14;
  const cursorRadius = 500;
  const bulgeStrength = 25;
  const glowRadius = 100;
  const gradientFrom = 'rgba(255, 69, 112, 0.35)';
  const gradientTo = 'rgba(70, 110, 180, 0.25)';

  let dots = [];
  let w = 0, h = 0, offsetX = 0, offsetY = 0;
  let mouseX = -9999, mouseY = -9999, prevMouseX = -9999, prevMouseY = -9999, mouseSpeed = 0;
  let engagement = 0;
  let frameCount = 0;
  let animId;
  let resizeTimer;

  function doResize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    w = rect.width;
    h = rect.height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    offsetX = rect.left + window.scrollX;
    offsetY = rect.top + window.scrollY;
    buildDots();
  }

  function buildDots() {
    const step = dotRadius + dotSpacing;
    const cols = Math.floor(w / step);
    const rows = Math.floor(h / step);
    const padX = (w % step) / 2;
    const padY = (h % step) / 2;
    dots = new Array(rows * cols);
    let idx = 0;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const ax = padX + col * step + step / 2;
        const ay = padY + row * step + step / 2;
        dots[idx++] = { ax, ay, sx: ax, sy: ay };
      }
    }
  }

  function onMouseMove(e) {
    mouseX = e.pageX - offsetX;
    mouseY = e.pageY - offsetY;
  }

  function updateMouseSpeed() {
    const dx = prevMouseX - mouseX;
    const dy = prevMouseY - mouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    mouseSpeed += (dist - mouseSpeed) * 0.5;
    if (mouseSpeed < 0.001) mouseSpeed = 0;
    prevMouseX = mouseX;
    prevMouseY = mouseY;
  }

  const speedInterval = setInterval(updateMouseSpeed, 20);

  function tick() {
    frameCount++;
    const len = dots.length;
    const crSq = cursorRadius * cursorRadius;
    const rad = dotRadius / 2;

    const targetEngagement = Math.min(mouseSpeed / 5, 1);
    engagement += (targetEngagement - engagement) * 0.06;
    if (engagement < 0.001) engagement = 0;

    ctx.clearRect(0, 0, w, h);

    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, gradientFrom);
    grad.addColorStop(1, gradientTo);
    ctx.fillStyle = grad;

    ctx.beginPath();
    for (let i = 0; i < len; i++) {
      const d = dots[i];
      const dx = mouseX - d.ax;
      const dy = mouseY - d.ay;
      const distSq = dx * dx + dy * dy;

      if (distSq < crSq && engagement > 0.01) {
        const dist = Math.sqrt(distSq);
        const t = 1 - dist / cursorRadius;
        const push = t * t * bulgeStrength * engagement;
        const angle = Math.atan2(dy, dx);
        d.sx += (d.ax - Math.cos(angle) * push - d.sx) * 0.15;
        d.sy += (d.ay - Math.sin(angle) * push - d.sy) * 0.15;
      } else {
        d.sx += (d.ax - d.sx) * 0.1;
        d.sy += (d.ay - d.sy) * 0.1;
      }

      ctx.moveTo(d.sx + rad, d.sy);
      ctx.arc(d.sx, d.sy, rad, 0, TWO_PI);
    }
    ctx.fill();

    animId = requestAnimationFrame(tick);
  }

  doResize();
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(doResize, 100);
  });
  window.addEventListener('mousemove', onMouseMove, { passive: true });
  animId = requestAnimationFrame(tick);
}

// ============================================================
// ANIMATED HERO SHADER OVERLAY (WebGL)
// ============================================================

function initHeroShaderOverlay(canvas) {
  if (!canvas) return;

  const gl = canvas.getContext('webgl', { premultipliedAlpha: false, alpha: true });
  if (!gl) return;

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  const vertSrc = `
    attribute vec2 a_position;
    void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
  `;

  const fragSrc = `
    precision highp float;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;
    uniform float u_time;

    void main() {
      vec2 uv = gl_FragCoord.xy / u_resolution;
      vec2 mouse = u_mouse;

      float wave = sin(uv.x * 5.0 + u_time * 0.4 + mouse.x * 2.0) * 0.015;
      wave += sin(uv.x * 3.0 - u_time * 0.25 + mouse.y * 1.5) * 0.01;

      float waveMask = smoothstep(0.2, 0.7, 1.0 - uv.y);
      float alpha = wave * waveMask * 2.0;
      alpha = clamp(alpha, 0.0, 0.15);

      gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
    }
  `;

  function createShader(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  }

  const prog = gl.createProgram();
  gl.attachShader(prog, createShader(gl.VERTEX_SHADER, vertSrc));
  gl.attachShader(prog, createShader(gl.FRAGMENT_SHADER, fragSrc));
  gl.linkProgram(prog);
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);

  const aPos = gl.getAttribLocation(prog, 'a_position');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(prog, 'u_resolution');
  const uMouse = gl.getUniformLocation(prog, 'u_mouse');
  const uTime = gl.getUniformLocation(prog, 'u_time');

  let mouseX = 0.5, mouseY = 0.5;
  let animId;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  function render(t) {
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform2f(uMouse, mouseX, mouseY);
    gl.uniform1f(uTime, t * 0.001);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    animId = requestAnimationFrame(render);
  }

  resize();
  window.addEventListener('resize', resize);
  animId = requestAnimationFrame(render);

  const parent = canvas.parentElement;
  if (parent) {
    parent.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) / rect.width;
      mouseY = (e.clientY - rect.top) / rect.height;
    });
  }
}

// ============================================================
// PLACEHOLDER ROTATION
// ============================================================

function startPlaceholderRotation() {
  if (placeholderTimer) clearInterval(placeholderTimer);
  placeholderTimer = setInterval(() => {
    if (chatExpanded) return;
    const el = document.getElementById('chatPlaceholder');
    if (!el) return;

    el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    el.style.opacity = '0';
    el.style.transform = 'translateY(-12px)';

    setTimeout(() => {
      placeholderIndex = (placeholderIndex + 1) % CHAT_PLACEHOLDERS.length;
      el.textContent = CHAT_PLACEHOLDERS[placeholderIndex];
      el.style.transition = 'none';
      el.style.transform = 'translateY(12px)';
      el.style.opacity = '0';

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        });
      });
    }, 400);
  }, 3000);
}

// ============================================================
// CLICK OUTSIDE DISMISS
// ============================================================

function setupClickOutside() {
  document.addEventListener('mousedown', (e) => {
    if (!chatExpanded || chatClosing) return;
    const chatbox = document.getElementById('chatPromptBox');
    const pills = document.getElementById('chatPills');
    if (chatbox && !chatbox.contains(e.target) && pills && !pills.contains(e.target)) {
      closeChatBox();
    }
  });
}

function closeChatBox() {
  chatClosing = true;
  const box = document.getElementById('chatPromptBox');
  if (box) {
    box.style.maxHeight = '56px';
  }

  // Persist geography selection for census panels on concept pages
  if (chatSelections['geography'] && chatSelections['geography'] !== 'national') {
    window._chatSelectedGeo = chatSelections['geography'];
  }

  setTimeout(() => {
    chatStep = -1;
    chatSelections = {};
    chatExpanded = false;
    chatClosing = false;
    geoFilterText = '';
    updateChatContent();
  }, 350);
}

// ============================================================
// CHAT INTERACTION
// ============================================================

function startChatFlow(initialGoal) {
  const savedVerticalMatch = chatSelections['_verticalMatch'];
  chatStep = 0;
  chatSelections = {};
  chatExpanded = true;
  geoFilterText = '';

  // Preserve vertical match from user input
  if (savedVerticalMatch) {
    chatSelections['_verticalMatch'] = savedVerticalMatch;
  }

  if (initialGoal) {
    chatSelections['growth-goal'] = [initialGoal];
    chatStep = 1;
  }

  expandChatBox();
  updateChatContent();
}

function expandChatBox() {
  const box = document.getElementById('chatPromptBox');
  if (box) {
    box.style.maxHeight = '600px';
  }
}

function selectChatOption(stepId, optionId) {
  const step = CHAT_STEPS[chatStep];

  if (step && step.multiSelect) {
    // Multi-select: toggle the option in an array
    if (!Array.isArray(chatSelections[stepId])) {
      chatSelections[stepId] = [];
    }
    const idx = chatSelections[stepId].indexOf(optionId);
    if (idx >= 0) {
      chatSelections[stepId].splice(idx, 1);
    } else {
      chatSelections[stepId].push(optionId);
    }
    // Update pills in-place without full re-render (prevents blink)
    updatePillStates(step);
  } else {
    // Single-select: advance immediately
    chatSelections[stepId] = optionId;
    chatStep++;
    if (chatStep >= CHAT_STEPS.length) {
      chatStep = CHAT_STEPS.length;
    }
    updateChatContent();
  }
}

// Update pill selected states and continue button without re-rendering
function updatePillStates(step) {
  const selections = chatSelections[step.id] || [];

  // Update each pill button
  document.querySelectorAll('#chatResponse .chat-option-pill').forEach(btn => {
    const id = btn.dataset.pillId;
    const selected = selections.includes(id);
    btn.classList.toggle('chat-pill-selected', selected);
    btn.dataset.selected = selected ? '1' : '0';

    // Update inner content
    const label = step.pills.find(p => p.id === id)?.label || '';
    btn.innerHTML = selected ? `<span class="pill-check">✓</span> ${label}` : label;
  });

  // Update continue button
  const continueBtn = document.getElementById('chatContinueBtn');
  if (continueBtn) {
    if (selections.length > 0) {
      continueBtn.classList.remove('chat-pill-disabled');
      continueBtn.disabled = false;
    } else {
      continueBtn.classList.add('chat-pill-disabled');
      continueBtn.disabled = true;
    }
  }
}

function advanceChatStep() {
  chatStep++;
  if (chatStep >= CHAT_STEPS.length) {
    chatStep = CHAT_STEPS.length;
  }
  updateChatContent();
}

function updateChatContent() {
  const responseArea = document.getElementById('chatResponse');
  if (!responseArea) return;

  if (!chatExpanded || chatStep === -1) {
    responseArea.innerHTML = '';
    return;
  }

  if (chatStep >= CHAT_STEPS.length) {
    renderChatResults(responseArea);
    return;
  }

  const step = CHAT_STEPS[chatStep];
  const isMulti = step.multiSelect;
  const currentSelections = isMulti ? (chatSelections[step.id] || []) : null;
  const hasSelections = isMulti ? currentSelections.length > 0 : false;
  const totalSteps = CHAT_STEPS.length;

  // Geo step gets a special render with type-to-search
  if (step.isGeoStep) {
    renderGeoStep(responseArea, step, totalSteps);
    expandChatBox();
    return;
  }

  responseArea.innerHTML = `
    <div class="chat-response-inner animate-fadeSlideIn">
      <div class="chat-divider"></div>
      <div class="chat-step-indicator">Step ${chatStep + 1} of ${totalSteps}${isMulti ? ' — select multiple' : ''}</div>
      <h2 class="chat-response-heading">${step.question}</h2>
      ${step.subtitle ? `<p class="chat-response-body" style="margin-bottom: 0.75rem;">${step.subtitle}</p>` : ''}
      <div class="chat-option-pills">
        ${step.pills.map(p => {
          const isSelected = isMulti ? currentSelections.includes(p.id) : false;
          return `
            <button class="chat-option-pill ${isSelected ? 'chat-pill-selected' : ''}" 
                    data-pill-id="${p.id}" 
                    onclick="selectChatOption('${step.id}', '${p.id}')">
              ${isSelected ? '<span class="pill-check">✓</span> ' : ''}${p.label}
            </button>
          `;
        }).join('')}
      </div>
      ${isMulti ? `
        <div class="chat-multi-actions">
          <button id="chatContinueBtn" 
                  class="chat-action-pill chat-action-primary chat-multi-continue ${!hasSelections ? 'chat-pill-disabled' : ''}" 
                  onclick="advanceChatStep()" 
                  ${!hasSelections ? 'disabled' : ''}>
            Continue
          </button>
        </div>
      ` : ''}
    </div>
  `;

  expandChatBox();
}

// ============================================================
// GEOGRAPHY STEP - Type-to-search state picker
// ============================================================

function renderGeoStep(container, step, totalSteps) {
  const allGeos = [
    { id: 'national', label: 'National (all states)' },
    ...US_STATES.map(s => ({ id: s.fips, label: s.name }))
  ];

  const filtered = geoFilterText
    ? allGeos.filter(g => g.label.toLowerCase().includes(geoFilterText.toLowerCase()))
    : allGeos.slice(0, 12);

  container.innerHTML = `
    <div class="chat-response-inner animate-fadeSlideIn">
      <div class="chat-divider"></div>
      <div class="chat-step-indicator">Step ${chatStep + 1} of ${totalSteps}</div>
      <h2 class="chat-response-heading">${step.question}</h2>
      <p class="chat-response-body" style="margin-bottom: 0.75rem;">${step.subtitle}</p>
      <div class="chat-geo-search">
        <input type="text" 
               class="chat-geo-input" 
               placeholder="Type a state name..." 
               value="${geoFilterText}"
               oninput="handleGeoFilter(this.value)"
               id="geoSearchInput" />
      </div>
      <div class="chat-option-pills" id="geoPillsList">
        ${filtered.map(g => `
          <button class="chat-option-pill" onclick="selectGeoOption('${g.id}')">
            ${g.label}
          </button>
        `).join('')}
      </div>
    </div>
  `;

  // Focus the search input
  requestAnimationFrame(() => {
    const input = document.getElementById('geoSearchInput');
    if (input) input.focus();
  });
}

function handleGeoFilter(value) {
  geoFilterText = value;
  const allGeos = [
    { id: 'national', label: 'National (all states)' },
    ...US_STATES.map(s => ({ id: s.fips, label: s.name }))
  ];

  const filtered = geoFilterText
    ? allGeos.filter(g => g.label.toLowerCase().includes(geoFilterText.toLowerCase()))
    : allGeos.slice(0, 12);

  const pillsList = document.getElementById('geoPillsList');
  if (pillsList) {
    pillsList.innerHTML = filtered.map(g => `
      <button class="chat-option-pill" onclick="selectGeoOption('${g.id}')">
        ${g.label}
      </button>
    `).join('');
  }
}

function selectGeoOption(geoId) {
  chatSelections['geography'] = geoId;
  geoFilterText = '';
  chatStep = CHAT_STEPS.length;
  setSelectedGeo(geoId);
  updateChatContent();
}

// ============================================================
// RESULTS
// ============================================================

function renderChatResults(container) {
  const growthGoals = Array.isArray(chatSelections['growth-goal'])
    ? chatSelections['growth-goal']
    : [chatSelections['growth-goal'] || 'deposits'];

  const audienceSelections = Array.isArray(chatSelections['audience'])
    ? chatSelections['audience']
    : chatSelections['audience'] ? [chatSelections['audience']] : [];

  const gtmSelection = chatSelections['go-to-market'] || '';
  const postureSelection = chatSelections['launch-posture'] || '';

  // Score every concept based on all wizard selections
  const scored = CONCEPTS.map(concept => {
    let score = 0;
    const cTags = concept.tags.map(t => t.toLowerCase()).join(' ');
    const cGrowth = (concept.growthObjective || '').toLowerCase();
    const cAudience = (concept.audienceType || '').toLowerCase();
    const cModel = (concept.launchModel || '').toLowerCase();
    const cLaunch = (concept.launchTime || '').toLowerCase();

    // Growth goal matching (strongest signal)
    for (const goal of growthGoals) {
      if (goal === 'deposits' && (cGrowth.includes('deposit') || cTags.includes('deposit'))) score += 3;
      if (goal === 'fee-income' && (cGrowth.includes('fee') || cTags.includes('fee income'))) score += 3;
      if (goal === 'lending' && (cGrowth.includes('lending') || cGrowth.includes('finance') || cTags.includes('lending'))) score += 3;
      if (goal === 'smb-relationships' && (cAudience.includes('smb') || cTags.includes('smb'))) score += 3;
      if (goal === 'younger-consumers' && (cGrowth.includes('younger') || cTags.includes('younger consumers'))) score += 3;
      if (goal === 'brand-differentiation' && (cGrowth.includes('differentiation') || cGrowth.includes('brand'))) score += 3;
    }

    // Audience matching
    for (const aud of audienceSelections) {
      if (aud === 'consumers' && cAudience.includes('consumer')) score += 2;
      if (aud === 'small-businesses' && cAudience.includes('smb')) score += 2;
      if (aud === 'commercial-verticals' && cAudience.includes('commercial')) score += 2;
      if (aud === 'affinity-communities' && (cTags.includes('affinity') || cGrowth.includes('affinity'))) score += 2;
      if (aud === 'existing-customers' && cModel.includes('product line')) score += 2;
    }

    // Go-to-market model matching
    if (gtmSelection === 'standalone-brand' && cModel.includes('standalone')) score += 2;
    if (gtmSelection === 'endorsed-solution' && (cModel.includes('endorsed') || cModel.includes('fi-endorsed'))) score += 2;
    if (gtmSelection === 'product-line' && cModel.includes('product line')) score += 2;

    // Launch posture matching (time to launch as proxy)
    if (postureSelection === 'fast-launch' && (cLaunch.includes('3-4') || cLaunch.includes('3-5'))) score += 1;
    if (postureSelection === 'test-learn' && (cLaunch.includes('3-4') || cLaunch.includes('3-5') || cLaunch.includes('4-5'))) score += 1;
    if (postureSelection === 'fully-differentiated' && (cLaunch.includes('6-9') || cLaunch.includes('5-7'))) score += 1;

    return { concept, score };
  });

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  const seenIds = new Set();
  const allRecommended = [];

  // If there's a vertical match from user input, always include it first
  const verticalMatch = chatSelections['_verticalMatch'];
  if (verticalMatch) {
    const matchedConcept = CONCEPTS.find(c => c.id === verticalMatch);
    if (matchedConcept) {
      seenIds.add(matchedConcept.id);
      allRecommended.push(matchedConcept);
    }
  }

  // Fill remaining slots from scored results
  for (const { concept } of scored) {
    if (allRecommended.length >= 3) break;
    if (!seenIds.has(concept.id)) {
      seenIds.add(concept.id);
      allRecommended.push(concept);
    }
  }

  const recommended = allRecommended.slice(0, 3);

  const reasons = growthGoals.map(g => RECOMMENDATION_REASONS[g]).filter(Boolean);
  const reason = reasons[0] || RECOMMENDATION_REASONS['deposits'];

  const geoId = chatSelections['geography'] || 'national';
  const geoState = US_STATES.find(s => s.fips === geoId);
  const geoLabel = geoId === 'national' ? 'nationally' : (geoState ? geoState.name : 'nationally');

  container.innerHTML = `
    <div class="chat-response-inner animate-fadeSlideIn">
      <div class="chat-divider"></div>
      <h2 class="chat-response-heading">Here are your recommended vertical concepts.</h2>
      <p class="chat-response-body">${reason} Market data sized for <strong>${geoLabel}</strong>.</p>
      <div class="chat-result-cards">
        ${recommended.map(c => `
          <div class="chat-result-card" onclick="closeChatBox(); setTimeout(() => navigateTo('concept', '${c.id}'), 400)">
            <div class="chat-result-img" style="background-image: url('${c.image}')"></div>
            <div class="chat-result-info">
              <span class="chat-result-name">${c.name}</span>
              <span class="chat-result-desc">${c.shortDesc}</span>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="chat-result-actions">
        <button class="chat-action-pill chat-action-primary" onclick="closeChatBox(); setTimeout(() => navigateTo('browse'), 400)">Browse all concepts</button>
        <button class="chat-action-pill chat-action-primary" onclick="window.open('https://nymbus.com/lp/labs-contact-us/', '_blank')">Build your own</button>
        <button class="chat-action-pill" onclick="window.open('https://nymbus.com/lp/labs-contact-us/', '_blank')">Request strategy session</button>
      </div>
    </div>
  `;
}

// ============================================================
// INPUT HANDLING
// ============================================================

function handleChatInput(e) {
  e.preventDefault();
  const input = document.getElementById('chatInput');
  const value = input.value.trim().toLowerCase();
  if (!value) return;

  // Check if the input matches a vertical/concept in the library
  const verticalMatch = matchInputToVertical(value);

  const goalMatch = matchInputToGoal(value);
  if (goalMatch) {
    if (verticalMatch) {
      chatSelections['_verticalMatch'] = verticalMatch;
    }
    startChatFlow(goalMatch);
    input.value = '';
  } else if (verticalMatch) {
    // No goal matched but a vertical did — skip straight to results with that vertical
    chatSelections['_verticalMatch'] = verticalMatch;
    startChatFlow(null);
    input.value = '';
  } else {
    startChatFlow(null);
    input.value = '';
  }
}

function matchInputToGoal(input) {
  const lower = input.toLowerCase();
  const keywords = {
    'deposits': ['deposit', 'deposits', 'savings', 'funding'],
    'fee-income': ['fee', 'income', 'revenue', 'non-interest'],
    'lending': ['lending', 'loan', 'finance', 'credit', 'financing'],
    'smb-relationships': ['smb', 'small business', 'business relationships', 'commercial'],
    'younger-consumers': ['younger', 'gen z', 'millennial', 'young', 'student', 'athlete'],
    'brand-differentiation': ['differentiat', 'brand', 'stand out', 'unique']
  };

  for (const [goal, keys] of Object.entries(keywords)) {
    if (keys.some(k => lower.includes(k))) return goal;
  }
  return null;
}

function matchInputToVertical(input) {
  const lower = input.toLowerCase().trim();
  const verticalKeywords = {
    'healthcare-practice-banking': ['healthcare practice', 'physician', 'dental practice', 'dentist', 'clinic', 'medical practice'],
    'college-athlete-banking': ['college athlete', 'nil', 'student athlete', 'ncaa'],
    'trucking-banking': ['trucking', 'trucker', 'owner-operator', 'freight', 'logistics'],
    'construction-and-trades-banking': ['construction', 'contractor', 'trades', 'builder', 'plumber', 'electrician', 'hvac'],
    'professional-services-banking': ['professional services', 'consultant', 'agency', 'accounting firm', 'law firm'],
    'family-and-youth-banking': ['family banking', 'kids', 'teens', 'youth', 'allowance', 'parental'],
    'agriculture-banking': ['agriculture', 'farming', 'farmer', 'ranch', 'agribusiness', 'crop'],
    'maker-and-artisan-banking': ['maker', 'artisan', 'etsy', 'craft', 'handmade'],
    'life-sciences-banking': ['life sciences', 'clinical trial', 'biotech', 'pharma'],
    'remittance-and-newcomer-family-banking': ['remittance', 'cross-border', 'immigrant family', 'money transfer'],
    'emerging-athlete-and-artist-wealth-banking': ['emerging athlete', 'emerging artist', 'talent wealth', 'pro athlete'],
    'rv-lifestyle-banking': ['rv', 'recreational vehicle', 'motorhome', 'camper van'],
    'values-driven-banking': ['values', 'cause', 'charitable', 'purpose-driven', 'impact banking'],
    'veteran-entrepreneur-banking': ['veteran entrepreneur', 'vetpreneur', 'veteran business', 'vet-owned'],
    'gig-worker-banking': ['gig', 'freelance', 'freelancer', 'rideshare', 'delivery worker', 'gig economy'],
    'franchisee-banking': ['franchise', 'franchisee', 'franchise owner'],
    'first-responder-banking': ['first responder', 'firefighter', 'paramedic', 'emt', 'police'],
    'boat-owner-banking': ['boat', 'boating', 'marina', 'yacht', 'charter'],
    'gamer-and-streamer-banking': ['gamer', 'streamer', 'gaming', 'esports', 'twitch'],
    'landscaper-banking': ['landscaper', 'landscaping', 'lawn care', 'groundskeeping'],
    'k-12-education-banking': ['teacher', 'k-12', 'education banking', 'classroom', 'school'],
    'workplace-financial-wellness-banking': ['workplace', 'employee wellness', 'payroll banking', 'employer'],
    'survivor-safety-banking': ['survivor', 'domestic violence', 'safety banking', 'financial abuse'],
    'newcomer-banking': ['newcomer', 'immigrant', 'new to us', 'relocated', 'new arrival'],
    'nurse-and-healthcare-worker-banking': ['nurse', 'nursing', 'healthcare worker', 'medical worker'],
    'outdoor-adventure-banking': ['outdoor', 'adventure', 'hiking', 'camping', 'recreation']
  };

  for (const [conceptId, keys] of Object.entries(verticalKeywords)) {
    if (keys.some(k => lower.includes(k))) return conceptId;
  }
  return null;
}

function handleChatPillClick(goalId) {
  startChatFlow(goalId);
}
