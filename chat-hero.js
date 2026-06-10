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
  }
];

const CHAT_PLACEHOLDERS = [
  "Grow deposits",
  "Reach younger consumers",
  "Launch a standalone brand",
  "Serve small businesses",
  "Expand into new geographies",
  "Differentiate my brand"
];

// Chat state
let chatStep = -1; // -1 = idle, 0-3 = steps, 4 = results
let chatSelections = {};
let chatExpanded = false;
let chatClosing = false;
let placeholderIndex = 0;
let placeholderTimer = null;
let placeholderAnimState = 'visible';

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

  const gl = canvas.getContext('webgl');
  if (!gl) return;

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
      float y = uv.y;
      vec3 col;

      // Base gradient: deep navy → blue → subtle light at bottom
      col = vec3(0.0);
      col = mix(col, vec3(0.0, 0.04, 0.16), smoothstep(0.95, 0.7, y));
      col = mix(col, vec3(0.0, 0.12, 0.45), smoothstep(0.75, 0.5, y));
      col = mix(col, vec3(0.0, 0.25, 0.7), smoothstep(0.55, 0.35, y));

      // Bottom arc glow
      float arcDist = length((uv - vec2(0.5, -0.5)) * vec2(0.5, 1.0));
      float arc = smoothstep(1.0, 0.3, arcDist);
      float bottomGlow = smoothstep(0.4, 0.0, y);
      col = mix(col, vec3(0.0, 0.35, 0.9), bottomGlow * arc * 0.6);

      // Mouse glow
      vec2 glowCenter = vec2(mouse.x, 1.0 - mouse.y);
      float glowDist = length((uv - glowCenter) * vec2(1.4, 1.0));
      float glow = exp(-glowDist * 3.5) * 0.25;
      col += vec3(0.0, 0.25, 1.0) * glow;

      // Subtle wave
      float wave = sin(uv.x * 5.0 + u_time * 0.4 + mouse.x * 2.0) * 0.015;
      wave += sin(uv.x * 3.0 - u_time * 0.25) * 0.01;
      float waveMask = smoothstep(0.3, 0.8, 1.0 - uv.y);
      col += vec3(0.0, 0.1, 0.3) * wave * waveMask * 2.5;

      gl_FragColor = vec4(col, 1.0);
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
    const dpr = Math.min(window.devicePixelRatio, 2);
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  function render(t) {
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform2f(uMouse, mouseX, mouseY);
    gl.uniform1f(uTime, t * 0.001);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    animId = requestAnimationFrame(render);
  }

  resize();
  window.addEventListener('resize', resize);
  animId = requestAnimationFrame(render);

  const heroEl = canvas.closest('.chat-hero');
  if (heroEl) {
    heroEl.addEventListener('mousemove', (e) => {
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

    // Slide out
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
  setTimeout(() => {
    chatStep = -1;
    chatSelections = {};
    chatExpanded = false;
    chatClosing = false;
    updateChatContent();
  }, 350);
}

// ============================================================
// CHAT INTERACTION
// ============================================================

function startChatFlow(initialGoal) {
  chatStep = 0;
  chatSelections = {};
  chatExpanded = true;

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
    box.style.maxHeight = '500px';
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
    // Re-render current step (don't advance)
    updateChatContent();
  } else {
    // Single-select: advance immediately
    chatSelections[stepId] = optionId;
    chatStep++;
    if (chatStep >= CHAT_STEPS.length) {
      chatStep = 4;
    }
    updateChatContent();
  }
}

function advanceChatStep() {
  chatStep++;
  if (chatStep >= CHAT_STEPS.length) {
    chatStep = 4;
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

  if (chatStep === 4) {
    renderChatResults(responseArea);
    return;
  }

  const step = CHAT_STEPS[chatStep];
  const isMulti = step.multiSelect;
  const currentSelections = isMulti ? (chatSelections[step.id] || []) : null;
  const hasSelections = isMulti ? currentSelections.length > 0 : false;

  responseArea.innerHTML = `
    <div class="chat-response-inner animate-fadeSlideIn">
      <div class="chat-divider"></div>
      <div class="chat-step-indicator">Step ${chatStep + 1} of 4${isMulti ? ' — select multiple' : ''}</div>
      <h2 class="chat-response-heading">${step.question}</h2>
      ${step.subtitle ? `<p class="chat-response-body" style="margin-bottom: 0.75rem;">${step.subtitle}</p>` : ''}
      <div class="chat-option-pills">
        ${step.pills.map(p => {
          const isSelected = isMulti ? currentSelections.includes(p.id) : false;
          return `
            <button class="chat-option-pill ${isSelected ? 'chat-pill-selected' : ''}" onclick="selectChatOption('${step.id}', '${p.id}')">
              ${isSelected ? '<span class="pill-check">✓</span> ' : ''}${p.label}
            </button>
          `;
        }).join('')}
      </div>
      ${isMulti ? `
        <div class="chat-multi-actions">
          <button class="chat-action-pill chat-action-primary ${!hasSelections ? 'chat-pill-disabled' : ''}" 
                  onclick="${hasSelections ? 'advanceChatStep()' : ''}" 
                  ${!hasSelections ? 'disabled' : ''}>
            Continue
          </button>
        </div>
      ` : ''}
    </div>
  `;

  // Ensure expanded height accommodates content
  expandChatBox();
}

function renderChatResults(container) {
  // Support multi-select: merge recommendations from all selected goals
  const growthGoals = Array.isArray(chatSelections['growth-goal'])
    ? chatSelections['growth-goal']
    : [chatSelections['growth-goal'] || 'deposits'];

  // Gather unique concept IDs from all selected goals
  const seenIds = new Set();
  const allRecommended = [];
  for (const goal of growthGoals) {
    const ids = RECOMMENDATION_MAP[goal] || [];
    for (const id of ids) {
      if (!seenIds.has(id)) {
        seenIds.add(id);
        const concept = CONCEPTS.find(c => c.id === id);
        if (concept) allRecommended.push(concept);
      }
    }
  }
  const recommended = allRecommended.slice(0, 3);

  // Build combined reason
  const reasons = growthGoals
    .map(g => RECOMMENDATION_REASONS[g])
    .filter(Boolean);
  const reason = reasons[0] || RECOMMENDATION_REASONS['deposits'];

  container.innerHTML = `
    <div class="chat-response-inner animate-fadeSlideIn">
      <div class="chat-divider"></div>
      <h2 class="chat-response-heading">Here are your recommended vertical concepts.</h2>
      <p class="chat-response-body">${reason}</p>
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
        <button class="chat-action-pill chat-action-primary" onclick="closeChatBox(); setTimeout(() => navigateTo('build-your-own'), 400)">Build your own</button>
        <button class="chat-action-pill" onclick="openStrategySession()">Request strategy session</button>
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

  // Match input to growth goals
  const goalMatch = matchInputToGoal(value);
  if (goalMatch) {
    startChatFlow(goalMatch);
    input.value = '';
  } else {
    // Start from step 1 with no pre-selection
    startChatFlow(null);
    input.value = '';
  }
}

function matchInputToGoal(input) {
  const lower = input.toLowerCase();
  const keywords = {
    'deposits': ['deposit', 'deposits', 'savings', 'funding'],
    'fee-income': ['fee', 'income', 'revenue', 'non-interest'],
    'smb-relationships': ['smb', 'small business', 'business relationships', 'commercial'],
    'new-geographies': ['geography', 'geographies', 'new market', 'expand', 'expansion'],
    'younger-consumers': ['younger', 'gen z', 'millennial', 'young', 'student', 'athlete'],
    'brand-differentiation': ['differentiat', 'brand', 'stand out', 'unique']
  };

  for (const [goal, keys] of Object.entries(keywords)) {
    if (keys.some(k => lower.includes(k))) return goal;
  }
  return null;
}

function handleChatPillClick(goalId) {
  startChatFlow(goalId);
}
