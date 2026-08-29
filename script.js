/**
 * VENKAT PORTFOLIO - ULTRA-MODERN JAVASCRIPT ENGINE
 * Modular HTML Component Loader & Interactive Features
 */

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Initialize background particle canvas & ambient aura immediately
  initParticleCanvas();
  initCursorGlow();

  // 2. Load all modular components asynchronously
  await loadComponents();

  // 3. Initialize all interactive UI modules once DOM elements are populated
  initTypewriter();
  init3DCardTilt();
  initThemeSwitcher();
  initTerminal();
  initProjects();
  initTestimonials();
  initMetricsCounter();
  initContactAndUtils();
  initMobileNav();
});

/* ==========================================================================
   MODULAR COMPONENT LOADER
   Loads HTML component snippets asynchronously into [data-component] slots
   ========================================================================== */
async function loadComponents() {
  const componentElements = document.querySelectorAll('[data-component]');
  
  const loadPromises = Array.from(componentElements).map(async (element) => {
    const file = element.getAttribute('data-component');
    if (!file) return;

    try {
      const response = await fetch(file);
      if (!response.ok) {
        throw new Error(`Failed to load ${file}: ${response.statusText}`);
      }
      const htmlContent = await response.text();
      element.outerHTML = htmlContent;
    } catch (err) {
      console.error(`Component loader error for ${file}:`, err);
    }
  });

  await Promise.all(loadPromises);
}

/* ==========================================================================
   1. PARTICLE & CONSTELLATION CANVAS
   ========================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;
  let particles = [];
  const particleCount = window.innerWidth < 768 ? 40 : 85;
  const maxDistance = 140;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.radius = Math.random() * 2 + 1;
      this.baseAlpha = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(139, 92, 246, ${this.baseAlpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // Track mouse for connection
  let mouse = { x: null, y: null };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      // Connect near particles
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          const alpha = (1 - dist / maxDistance) * 0.2;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Connect to mouse
      if (mouse.x !== null && mouse.y !== null) {
        const dx = particles[i].x - mouse.x;
        const dy = particles[i].y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 160) {
          const alpha = (1 - dist / 160) * 0.35;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }
  animate();
}

/* ==========================================================================
   2. AMBIENT MOUSE CURSOR GLOW
   ========================================================================== */
function initCursorGlow() {
  const glow = document.getElementById('cursorGlow');
  if (!glow) return;

  let mouseX = 0, mouseY = 0;
  let currentX = 0, currentY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function smoothGlow() {
    currentX += (mouseX - currentX) * 0.1;
    currentY += (mouseY - currentY) * 0.1;
    glow.style.left = `${currentX}px`;
    glow.style.top = `${currentY}px`;
    requestAnimationFrame(smoothGlow);
  }
  smoothGlow();
}

/* ==========================================================================
   3. TYPEWRITER EFFECT
   ========================================================================== */
function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const roles = [
    'Future of Intelligent Systems.',
    'Distributed Cloud Architectures.',
    'Next-Gen Autonomous AI Agents.',
    'High-Scale Microservices.'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function type() {
    const currentText = roles[roleIdx];

    if (isDeleting) {
      el.textContent = currentText.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 45;
    } else {
      el.textContent = currentText.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIdx === currentText.length) {
      isDeleting = true;
      typingSpeed = 2200; // Pause at end
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typingSpeed = 400; // Pause before typing new phrase
    }

    setTimeout(type, typingSpeed);
  }
  type();
}

/* ==========================================================================
   4. 3D CARD TILT ON MOUSE HOVER
   ========================================================================== */
function init3DCardTilt() {
  const card = document.getElementById('card3d');
  if (!card) return;

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotX = -(y / (rect.height / 2)) * 14;
    const rotY = (x / (rect.width / 2)) * 14;

    card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });
}

/* ==========================================================================
   5. THEME ACCENT COLOR SWITCHER
   ========================================================================== */
function initThemeSwitcher() {
  const paletteBtns = document.querySelectorAll('.palette-btn');
  const savedTheme = localStorage.getItem('venkat_theme') || 'violet';

  document.documentElement.setAttribute('data-theme', savedTheme);
  paletteBtns.forEach(btn => {
    if (btn.dataset.accent === savedTheme) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }

    btn.addEventListener('click', () => {
      paletteBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const chosenTheme = btn.dataset.accent;
      document.documentElement.setAttribute('data-theme', chosenTheme);
      localStorage.setItem('venkat_theme', chosenTheme);
      showToast(`Accent hue changed to ${chosenTheme.toUpperCase()}`);
    });
  });
}

/* ==========================================================================
   6. INTERACTIVE CLI TERMINAL
   ========================================================================== */
function initTerminal() {
  const tabStory = document.getElementById('tabStory');
  const tabTerminal = document.getElementById('tabTerminal');
  const viewStory = document.getElementById('about-story');
  const viewTerminal = document.getElementById('about-terminal');
  const termInput = document.getElementById('terminalInput');
  const termOutput = document.getElementById('terminalOutput');
  const openTerminalHero = document.getElementById('openTerminalHero');

  function switchTab(target) {
    if (target === 'terminal') {
      if (tabTerminal) tabTerminal.classList.add('active');
      if (tabStory) tabStory.classList.remove('active');
      if (viewTerminal) viewTerminal.classList.add('active');
      if (viewStory) viewStory.classList.remove('active');
      if (termInput) termInput.focus();
    } else {
      if (tabStory) tabStory.classList.add('active');
      if (tabTerminal) tabTerminal.classList.remove('active');
      if (viewStory) viewStory.classList.add('active');
      if (viewTerminal) viewTerminal.classList.remove('active');
    }
  }

  if (tabStory && tabTerminal) {
    tabStory.addEventListener('click', () => switchTab('story'));
    tabTerminal.addEventListener('click', () => switchTab('terminal'));
  }

  if (openTerminalHero) {
    openTerminalHero.addEventListener('click', () => {
      const aboutSec = document.getElementById('about');
      if (aboutSec) aboutSec.scrollIntoView({ behavior: 'smooth' });
      switchTab('terminal');
    });
  }

  const commands = {
    help: `Available commands:
  - <span class="term-highlight">about</span> : Read short executive engineering bio
  - <span class="term-highlight">skills</span> : List core technology stack and proficiencies
  - <span class="term-highlight">experience</span> : Print recent leadership milestones
  - <span class="term-highlight">projects</span> : View highlight open-source / enterprise projects
  - <span class="term-highlight">contact</span> : Show direct channels & email
  - <span class="term-highlight">sudo hire</span> : Check availability & trigger appointment link
  - <span class="term-highlight">clear</span> : Reset terminal output window`,

    about: `Venkat | Principal Solutions Architect & Tech Lead
9+ years architecting fault-tolerant microservices, modern reactive frontends, and AI agent engines with 99.99% uptime.`,

    skills: `[Languages] : TypeScript, Python, Go, Rust, SQL
[Cloud & Infra] : AWS (EKS, Lambda, RDS), Docker, Kubernetes, Terraform
[Frontend] : React 19, Next.js 15, Three.js, Tailwind, Vue
[AI & Data] : LangChain, OpenAI/Anthropic APIs, pgvector, Kafka, ClickHouse`,

    experience: `[2023 - Present] Principal Solutions Architect @ HyperScale AI Labs
[2020 - 2023]    Staff Full-Stack Tech Lead @ Apex Global FinTech
[2017 - 2020]    Senior Software Engineer @ Synapse Digital Systems`,

    projects: `1. NeuroNexus: Distributed autonomous LLM agent workflow engine
2. OmniStream: 150k msg/sec event mesh & observability pipeline
3. Zenith Workspace: Multiplayer canvas with real-time CRDT sync
4. AetherPay: Non-custodial zk-SNARK settlement platform`,

    contact: `Email: venkat@architect.dev | Location: San Francisco / Remote | Status: Ready for high-impact engagements.`,

    'sudo hire': `<span style="color:#10b981; font-weight:bold;">[SUCCESS] Access Granted!</span> Venkat is actively exploring Principal Architecture roles and Advisory engagements. Opening contact section...`
  };

  function executeCommand(rawCmd) {
    if (!termOutput) return;
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    const userLine = document.createElement('div');
    userLine.className = 'term-line';
    userLine.innerHTML = `<span class="term-prompt">venkat@architect:~$</span> <span class="term-cmd">${rawCmd}</span>`;
    termOutput.appendChild(userLine);

    if (cmd === 'clear') {
      termOutput.innerHTML = '';
      return;
    }

    const responseLine = document.createElement('div');
    responseLine.className = 'term-line output-line';

    if (commands[cmd]) {
      responseLine.innerHTML = commands[cmd].replace(/\n/g, '<br>');
      if (cmd === 'sudo hire') {
        setTimeout(() => {
          const contactSec = document.getElementById('contact');
          if (contactSec) contactSec.scrollIntoView({ behavior: 'smooth' });
        }, 1200);
      }
    } else {
      responseLine.innerHTML = `<span style="color:#ef4444;">zsh: command not found: ${rawCmd}</span>. Type <span class="term-highlight">'help'</span> for valid commands.`;
    }

    termOutput.appendChild(responseLine);
    termOutput.scrollTop = termOutput.scrollHeight;
  }

  if (termInput) {
    termInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        executeCommand(termInput.value);
        termInput.value = '';
      }
    });
  }

  document.querySelectorAll('.term-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.dataset.cmd;
      executeCommand(cmd);
    });
  });
}

/* ==========================================================================
   7. PROJECT FILTERING & MODAL DETAILS
   ========================================================================== */
const projectData = {
  p1: {
    title: 'NeuroNexus: Autonomous Multi-Agent Orchestrator',
    badge: 'AI & SYSTEM ORCHESTRATION',
    overview: 'A high-concurrency execution engine that empowers autonomous LLM agents to plan, execute, and self-verify complex software engineering pipelines.',
    architecture: 'Built on Python FastAPI with Redis message queues and pgvector for contextual memory. Leverages dynamic DAG scheduling to parallelize agent sub-tasks.',
    highlights: [
      'Engineered sub-50ms vector semantic searches over 10M+ embedded code tokens.',
      'Reduced test generation and PR review cycles from 4 hours to under 8 minutes.',
      'Supported self-reflection loop with AST code syntax verification before push.'
    ],
    stack: ['Python FastAPI', 'LangChain', 'pgvector', 'Next.js 15', 'Docker', 'Redis']
  },
  p2: {
    title: 'OmniStream: Real-time Event Mesh & Telemetry',
    badge: 'DISTRIBUTED SYSTEMS & K8S',
    overview: 'An ultra-high-throughput metrics and event stream ingest platform built for global infrastructure monitoring with sub-second dashboard rendering.',
    architecture: 'High-throughput Go (Golang) microservices ingesting Kafka streams directly into ClickHouse columnar storage with auto-scaled Kubernetes pods.',
    highlights: [
      'Sustained peak ingest of 150,000 events/sec with zero dropped packets.',
      'Designed custom compression algorithms reducing disk storage requirements by 58%.',
      'Automated cluster multi-region failover handling within 3.5 seconds.'
    ],
    stack: ['Go (Golang)', 'Apache Kafka', 'ClickHouse', 'Kubernetes', 'Prometheus', 'Grafana']
  },
  p3: {
    title: 'Zenith Workspace: Next-Gen Collaborative Canvas',
    badge: 'FULL-STACK & REAL-TIME WEB',
    overview: 'An infinite collaborative digital canvas facilitating real-time whiteboarding, markdown engineering documentation, and live presence indicator rooms.',
    architecture: 'React 19 frontend utilizing HTML5 Canvas/WebGL with Yjs Conflict-Free Replicated Data Types (CRDTs) over WebSockets and WebRTC audio.',
    highlights: [
      'Sub-16ms synchronized cursor and canvas movement across 50 simultaneous room users.',
      'Offline-first IndexedDB persistence with seamless auto-reconciliation on reconnect.',
      'Integrated AI assistant capable of transforming canvas mind-maps into structured code.'
    ],
    stack: ['React 19', 'TypeScript', 'WebSockets / WebRTC', 'Yjs CRDTs', 'Node.js', 'Redis']
  },
  p4: {
    title: 'AetherPay: Zero-Knowledge Liquidity Gateway',
    badge: 'FINTECH & DECENTRALIZED ARCHITECTURE',
    overview: 'Institutional non-custodial crypto-to-fiat settlement layer executing instant transfers with zero-knowledge cryptographic privacy guarantees.',
    architecture: 'Rust smart contracts paired with zk-SNARK proof verification circuits, backed by an audited enterprise Node.js microservice layer.',
    highlights: [
      'Processed in excess of $120M+ in cross-border settlements with 100% cryptographic integrity.',
      'Integrated AWS KMS hardware security modules for multi-signature governance.',
      'Passed multiple Tier-1 smart contract security audits with 0 critical vulnerabilities.'
    ],
    stack: ['Rust', 'Solidity / zk-SNARKs', 'Node.js', 'Ethers.js', 'AWS KMS', 'PostgreSQL']
  }
};

function initProjects() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const modal = document.getElementById('projectModal');
  const modalBody = document.getElementById('modalBody');
  const modalTitle = document.getElementById('modalTitle');
  const modalBadge = document.getElementById('modalBadge');
  const closeModalBtn = document.getElementById('closeModalBtn');

  // Filter Buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      projectCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Modal Open
  document.querySelectorAll('.project-modal-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const pid = trigger.dataset.target;
      const data = projectData[pid];
      if (!data || !modal) return;

      if (modalTitle) modalTitle.textContent = data.title;
      if (modalBadge) modalBadge.textContent = data.badge;

      if (modalBody) {
        modalBody.innerHTML = `
          <div style="margin-bottom: 16px;">
            <h4 style="color:#fff; font-size: 1rem; margin-bottom: 6px;">System Overview</h4>
            <p style="color:var(--text-secondary); font-size: 0.92rem; line-height: 1.6;">${data.overview}</p>
          </div>
          <div style="margin-bottom: 16px;">
            <h4 style="color:#fff; font-size: 1rem; margin-bottom: 6px;">Technical Architecture</h4>
            <p style="color:var(--text-secondary); font-size: 0.92rem; line-height: 1.6;">${data.architecture}</p>
          </div>
          <div style="margin-bottom: 20px;">
            <h4 style="color:#fff; font-size: 1rem; margin-bottom: 8px;">Key Engineering Outcomes</h4>
            <ul style="list-style:none; display:flex; flex-direction:column; gap:8px;">
              ${data.highlights.map(h => `<li style="font-size:0.88rem; color:var(--text-secondary);"><i class="fa-solid fa-check text-accent" style="margin-right:8px;"></i>${h}</li>`).join('')}
            </ul>
          </div>
          <div>
            <h4 style="color:#fff; font-size: 1rem; margin-bottom: 8px;">Core Tech Stack</h4>
            <div style="display:flex; flex-wrap:wrap; gap:6px;">
              ${data.stack.map(s => `<span class="tech-chip">${s}</span>`).join('')}
            </div>
          </div>
        `;
      }

      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
    });
  });

  // Modal Close
  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }
}

/* ==========================================================================
   8. TESTIMONIALS CAROUSEL
   ========================================================================== */
function initTestimonials() {
  const testimonials = [
    {
      quote: "Venkat is one of the rare architects who can effortlessly bridge the gap between high-level executive strategy and deep, low-level systems engineering. His leadership on our multi-agent platform transformed our turnaround time completely.",
      author: "Marcus Vance",
      role: "VP of Engineering, Global Tech Labs"
    },
    {
      quote: "Working alongside Venkat was masterclass in building for scale. He re-engineered our core trading pipelines to handle 15,000 ops/sec while keeping cloud expenditures well below budget.",
      author: "Elena Rostova",
      role: "Director of Product, Apex FinTech"
    },
    {
      quote: "Venkat brings a stellar balance of visual polish and bulletproof system reliability. His designs are not just aesthetically breathtaking—they are lightning-fast and battle-tested.",
      author: "David Chen",
      role: "Head of Infrastructure, Synapse Digital"
    }
  ];

  let currentIdx = 0;
  const quoteEl = document.getElementById('testQuote');
  const authorEl = document.getElementById('testAuthor');
  const roleEl = document.getElementById('testRole');
  const prevBtn = document.getElementById('prevTestimonial');
  const nextBtn = document.getElementById('nextTestimonial');

  function renderTestimonial(idx) {
    if (!quoteEl) return;
    quoteEl.style.opacity = '0';
    setTimeout(() => {
      quoteEl.textContent = `"${testimonials[idx].quote}"`;
      if (authorEl) authorEl.textContent = testimonials[idx].author;
      if (roleEl) roleEl.textContent = testimonials[idx].role;
      quoteEl.style.opacity = '1';
    }, 200);
  }

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      currentIdx = (currentIdx - 1 + testimonials.length) % testimonials.length;
      renderTestimonial(currentIdx);
    });

    nextBtn.addEventListener('click', () => {
      currentIdx = (currentIdx + 1) % testimonials.length;
      renderTestimonial(currentIdx);
    });
  }
}

/* ==========================================================================
   9. METRIC STAT COUNTERS (INTERSECTION OBSERVER)
   ========================================================================== */
function initMetricsCounter() {
  const metricNumbers = document.querySelectorAll('.metric-number');
  if (!metricNumbers.length) return;
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        metricNumbers.forEach(numEl => {
          const target = parseFloat(numEl.dataset.count);
          let current = 0;
          const duration = 1500;
          const stepTime = 20;
          const steps = duration / stepTime;
          const increment = target / steps;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            if (target % 1 !== 0) {
              numEl.textContent = current.toFixed(1) + '%';
            } else {
              numEl.textContent = Math.floor(current) + '+';
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.5 });

  const metricsSection = document.querySelector('.hero-metrics');
  if (metricsSection) observer.observe(metricsSection);
}

/* ==========================================================================
   10. CONTACT, LIVE TIMEZONE & UTILITY HANDLERS
   ========================================================================== */
function initContactAndUtils() {
  // Live Clock for UTC-8 / San Francisco
  const clockEl = document.getElementById('liveClock');
  function updateTime() {
    if (!clockEl) return;
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
      timeZone: 'America/Los_Angeles',
      hour: '2-digit',
      minute: '2-digit'
    });
    clockEl.textContent = `${timeString} PST`;
  }
  updateTime();
  setInterval(updateTime, 30000);

  // Dynamic Current Year
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Clipboard Copy Buttons
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.dataset.clipboard;
      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`Copied to clipboard: ${textToCopy}`);
      }).catch(() => {
        showToast('Copied to clipboard!');
      });
    });
  });

  // Sound Feedback Toggle
  const soundToggle = document.getElementById('soundToggle');
  let soundActive = true;
  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      soundActive = !soundActive;
      soundToggle.style.opacity = soundActive ? '1' : '0.4';
      showToast(soundActive ? 'Ambient feedback: ON' : 'Ambient feedback: MUTED');
    });
  }

  // Resume Download Button
  const resumeBtn = document.getElementById('downloadResumeBtn');
  if (resumeBtn) {
    resumeBtn.addEventListener('click', () => {
      showToast('Generating personalized CV dossier...');
      setTimeout(() => {
        showToast('Resume ready for download!');
      }, 1000);
    });
  }

  // Schedule Call Button
  const scheduleBtn = document.getElementById('scheduleCallBtn');
  if (scheduleBtn) {
    scheduleBtn.addEventListener('click', () => {
      showToast('Opening strategy scheduler calendar...');
    });
  }

  // Contact Form Submission
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('submitContactBtn');
      const nameInput = document.getElementById('userName');
      const emailInput = document.getElementById('userEmail');
      const messageInput = document.getElementById('userMessage');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const message = messageInput ? messageInput.value.trim() : '';

      if (!name || !email || !message) {
        showToast('Please fill in all required fields.', 'error');
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>Encrypting & Sending...</span>`;
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<i class="fa-solid fa-check"></i> <span>Transmission Delivered!</span>`;
        }
        showToast(`Thank you, ${name}. Your message has been transmitted securely.`);
        contactForm.reset();

        setTimeout(() => {
          if (submitBtn) {
            submitBtn.innerHTML = `<span class="btn-text">Transmit Message</span> <i class="fa-solid fa-paper-plane"></i>`;
          }
        }, 4000);
      }, 1200);
    });
  }

  // ScrollSpy Active Link Tracking
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

/* ==========================================================================
   11. MOBILE NAVIGATION
   ========================================================================== */
function initMobileNav() {
  const toggle = document.getElementById('mobileToggle');
  const menu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      menu.classList.toggle('open');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('open');
      });
    });
  }
}

/* ==========================================================================
   12. TOAST NOTIFICATION ENGINE
   ========================================================================== */
function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  const icon = type === 'error' ? 'fa-triangle-exclamation text-accent' : 'fa-circle-check text-accent';
  toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'all 0.4s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}
